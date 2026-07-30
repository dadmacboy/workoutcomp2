(() => {
  "use strict";

  const DATA = window.GYM_DATA;
  const STORAGE_KEY = "gym-companion-adaptive-v2";
  const $ = id => document.getElementById(id);
  const splitOrder = ["push", "pull", "legs"];
  const exerciseById = Object.fromEntries(DATA.exercises.map(exercise => [exercise.id, exercise]));
  const equipmentIcon = {
    mixed: "✦",
    bodyweight: "◯",
    trx: "△",
    cable: "⌁",
    dumbbell: "◆",
    machine: "▣",
    smith: "▥"
  };
  const splitAnchors = {
    push: ["chest", "triceps"],
    pull: ["back", "biceps", "forearms"],
    legs: ["quads", "hamstrings", "glutes"]
  };

  const defaultState = () => ({
    settings: {
      workoutMinutes: 45,
      defaultSets: 3,
      experienceLevel: "beginner",
      textSize: "extra",
      lastEquipmentMode: "mixed",
      equipment: Object.fromEntries(DATA.equipment.map(item => [item.id, true])),
      recoveryHours: Object.fromEntries(
        Object.entries(DATA.muscles).map(([id, muscle]) => [id, muscle.defaultRecovery])
      )
    },
    sessions: [],
    currentWorkout: null
  });

  let state = loadState();
  let currentView = "equipmentView";
  let pendingPlan = null;
  let pendingEquipmentMode = null;
  let runtimeDateKey = localDateKey(new Date());
  let toastTimer = null;

  function loadState() {
    const fresh = defaultState();
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored || typeof stored !== "object") return fresh;
      const merged = {
        ...fresh,
        ...stored,
        settings: {
          ...fresh.settings,
          ...(stored.settings || {}),
          equipment: { ...fresh.settings.equipment, ...(stored.settings?.equipment || {}) },
          recoveryHours: { ...fresh.settings.recoveryHours, ...(stored.settings?.recoveryHours || {}) }
        },
        sessions: Array.isArray(stored.sessions) ? stored.sessions : []
      };
      if (merged.currentWorkout) {
        merged.currentWorkout.activeIndex = Math.max(0, Number(merged.currentWorkout.activeIndex || 0));
        merged.currentWorkout.exercises = Array.isArray(merged.currentWorkout.exercises)
          ? merged.currentWorkout.exercises
          : [];
      }
      return merged;
    } catch (error) {
      console.warn("Could not read saved Gym Companion data.", error);
      return fresh;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Could not save Gym Companion data.", error);
      showToast("The browser could not save your latest entry.");
    }
  }

  function localDateKey(value) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatDate(value, options = {}) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      ...options
    }).format(date);
  }

  function formatToday() {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    }).format(new Date());
  }

  function hoursSince(value) {
    const time = new Date(value).getTime();
    if (!Number.isFinite(time)) return Infinity;
    return Math.max(0, (Date.now() - time) / 36e5);
  }

  function titleCase(value) {
    return String(value || "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  function escapeAttribute(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function enabledEquipment(source = state.settings.equipment) {
    if (Array.isArray(source)) return [...source];
    return Object.entries(source || {})
      .filter(([, enabled]) => Boolean(enabled))
      .map(([id]) => id);
  }

  function equipmentForMode(mode) {
    if (mode === "mixed") return enabledEquipment();
    return [mode];
  }

  function equipmentNames(ids) {
    return (ids || [])
      .map(id => DATA.equipment.find(item => item.id === id)?.name || titleCase(id))
      .join(", ");
  }

  function numberOfExercises() {
    const minutes = Number(state.settings.workoutMinutes);
    if (minutes <= 30) return 4;
    if (minutes <= 45) return 5;
    if (minutes <= 60) return 6;
    return 7;
  }

  function sessionExerciseRecords() {
    return state.sessions.flatMap(session =>
      (session.exercises || []).map(item => ({
        ...item,
        sessionId: session.id,
        splitId: session.splitId,
        completedAt: item.completedAt || session.completedAt || session.startedAt
      }))
    );
  }

  function muscleStimuli(muscleId) {
    const stimuli = [];
    state.sessions.forEach(session => {
      (session.exercises || []).forEach(item => {
        const exercise = exerciseById[item.exerciseId];
        if (!exercise) return;
        const completedAt = item.completedAt || session.completedAt || session.startedAt;
        if (exercise.primary === muscleId) {
          stimuli.push({ completedAt, factor: 1, exercise, session });
        } else if (exercise.secondary.includes(muscleId)) {
          stimuli.push({ completedAt, factor: 0.5, exercise, session });
        }
      });
    });
    return stimuli.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }

  function muscleRecovery(muscleId) {
    const required = Number(
      state.settings.recoveryHours[muscleId] || DATA.muscles[muscleId].defaultRecovery
    );
    const stimuli = muscleStimuli(muscleId);
    if (!stimuli.length) {
      return { readiness: 1, percent: 100, hoursRemaining: 0, last: null, required };
    }

    let lowestReadiness = 1;
    let governingStimulus = stimuli[0];
    for (const stimulus of stimuli.slice(0, 10)) {
      const adjustedRequired = Math.max(12, required * stimulus.factor);
      const readiness = Math.min(1, hoursSince(stimulus.completedAt) / adjustedRequired);
      if (readiness < lowestReadiness) {
        lowestReadiness = readiness;
        governingStimulus = stimulus;
      }
    }

    const adjustedRequired = Math.max(12, required * governingStimulus.factor);
    const remaining = Math.max(0, adjustedRequired - hoursSince(governingStimulus.completedAt));
    return {
      readiness: lowestReadiness,
      percent: Math.round(lowestReadiness * 100),
      hoursRemaining: Math.ceil(remaining),
      last: governingStimulus,
      required
    };
  }

  function splitReadiness(splitId) {
    const split = DATA.splits[splitId];
    const allScores = split.muscles.map(id => muscleRecovery(id));
    const anchorScores = (splitAnchors[splitId] || split.muscles).map(id => muscleRecovery(id));
    const anchorMinimum = Math.min(...anchorScores.map(score => score.readiness));
    const allAverage = allScores.reduce((sum, score) => sum + score.readiness, 0) / allScores.length;
    return {
      minimum: anchorMinimum,
      average: allAverage,
      percent: Math.round((anchorMinimum * 0.65 + allAverage * 0.35) * 100)
    };
  }

  function lastCompletedSplit() {
    return [...state.sessions]
      .sort((a, b) => new Date(b.completedAt || b.startedAt) - new Date(a.completedAt || a.startedAt))[0]
      ?.splitId || null;
  }

  function splitCapacity(splitId, equipmentIds) {
    const exercises = DATA.exercises.filter(exercise =>
      exercise.split === splitId && equipmentIds.includes(exercise.equipment)
    );
    const covered = new Set(exercises.map(exercise => exercise.primary));
    const usefulMuscles = [...new Set(DATA.splits[splitId].slots.slice(0, numberOfExercises()))];
    return {
      exerciseCount: exercises.length,
      coveredMuscles: usefulMuscles.filter(id => covered.has(id)).length,
      usefulMuscleCount: usefulMuscles.length
    };
  }

  function chooseSplit(equipmentIds, allowUnderRecovered = false) {
    const lastSplit = lastCompletedSplit();
    const targetCount = numberOfExercises();
    const ranked = splitOrder
      .map(splitId => {
        const readiness = splitReadiness(splitId);
        const capacity = splitCapacity(splitId, equipmentIds);
        const coverage = capacity.usefulMuscleCount
          ? capacity.coveredMuscles / capacity.usefulMuscleCount
          : 0;
        const feasible = capacity.exerciseCount >= Math.min(3, targetCount) && coverage >= 0.6;
        const rotationBonus = splitId === lastSplit ? -7 : 5;
        return {
          splitId,
          ...readiness,
          ...capacity,
          coverage,
          feasible,
          rankScore:
            readiness.percent +
            Math.min(capacity.exerciseCount, targetCount) * 2 +
            coverage * 10 +
            rotationBonus
        };
      })
      .sort((a, b) => b.rankScore - a.rankScore);

    const ready = ranked.filter(item => item.feasible && item.minimum >= 0.85);
    let selected = ready[0] || null;
    if (!selected && allowUnderRecovered) {
      selected = ranked.find(item => item.feasible) || null;
    }

    if (!selected) {
      const best = ranked.find(item => item.feasible) || ranked[0];
      return {
        splitId: null,
        fallbackSplitId: best?.splitId || null,
        readiness: best?.percent || 0,
        reason: `No focused combination is fully recovered with ${equipmentNames(equipmentIds)} right now. Rest is the growth-friendly recommendation.`
      };
    }

    if (selected.splitId === lastSplit && ready.length > 1) {
      const alternate = ready.find(item => item.splitId !== lastSplit && item.rankScore >= selected.rankScore - 8);
      if (alternate) selected = alternate;
    }

    const split = DATA.splits[selected.splitId];
    const readyNames = split.muscles
      .filter(id => muscleRecovery(id).readiness >= 0.9)
      .map(id => DATA.muscles[id].name);
    const forcedText = allowUnderRecovered && selected.minimum < 0.85
      ? " This is the least-fatigued option, not a fully recovered one."
      : "";

    return {
      splitId: selected.splitId,
      fallbackSplitId: selected.splitId,
      readiness: selected.percent,
      forced: allowUnderRecovered && selected.minimum < 0.85,
      reason: readyNames.length
        ? `${readyNames.join(", ")} have the strongest recovery scores. The app matched them to ${equipmentNames(equipmentIds)}.${forcedText}`
        : `${split.name} is the best compatible combination for the equipment you selected.${forcedText}`
    };
  }

  function exerciseHistory(exerciseId) {
    return sessionExerciseRecords()
      .filter(record => record.exerciseId === exerciseId)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }

  function emphasisLastUsed(primary, emphasis) {
    return sessionExerciseRecords()
      .filter(record => {
        const exercise = exerciseById[record.exerciseId];
        return exercise?.primary === primary && exercise.emphasis === emphasis;
      })
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0]?.completedAt || null;
  }

  function exerciseScore(exercise, selectedIds, selectedEmphases) {
    const history = exerciseHistory(exercise.id);
    const lastUsed = history[0]?.completedAt;
    const emphasisUsed = emphasisLastUsed(exercise.primary, exercise.emphasis);
    const emphasisKey = `${exercise.primary}:${exercise.emphasis}`;
    let score = 100;

    score += Math.min(hoursSince(lastUsed), 24 * 30) / 12;
    score += Math.min(hoursSince(emphasisUsed), 24 * 30) / 18;
    if (!lastUsed) score += 35;
    if (!emphasisUsed) score += 20;
    if (selectedIds.has(exercise.id)) score -= 1000;
    if (selectedEmphases.has(emphasisKey)) score -= 35;
    if (lastUsed && hoursSince(lastUsed) < 24 * 5) score -= 50;
    return score;
  }

  function buildWorkout(splitId, equipmentIds, recommendation) {
    const split = DATA.splits[splitId];
    const count = numberOfExercises();
    const selected = [];
    const selectedIds = new Set();
    const selectedEmphases = new Set();

    function addExercise(chosen) {
      if (!chosen || selectedIds.has(chosen.id) || selected.length >= count) return;
      const prior = exerciseHistory(chosen.id)[0];
      const lastPrimary = sessionExerciseRecords()
        .filter(record => exerciseById[record.exerciseId]?.primary === chosen.primary)
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
      const lastPrimaryExercise = lastPrimary ? exerciseById[lastPrimary.exerciseId] : null;
      selectedIds.add(chosen.id);
      selectedEmphases.add(`${chosen.primary}:${chosen.emphasis}`);
      selected.push({
        exerciseId: chosen.id,
        completed: false,
        completedAt: null,
        notes: "",
        sets: Array.from({ length: Number(state.settings.defaultSets) }, (_, index) => ({
          set: index + 1,
          weight: prior?.sets?.[index]?.weight || "",
          reps: ""
        })),
        reason: lastPrimaryExercise
          ? `${DATA.muscles[chosen.primary].name} is ready. Your last direct choice was ${lastPrimaryExercise.name}; this rotates to ${chosen.emphasis}.`
          : `This begins your ${chosen.emphasis} rotation for ${DATA.muscles[chosen.primary].name.toLowerCase()}.`
      });
    }

    for (const muscleId of split.slots) {
      if (selected.length >= count) break;
      const candidates = DATA.exercises.filter(exercise =>
        exercise.split === splitId &&
        exercise.primary === muscleId &&
        equipmentIds.includes(exercise.equipment) &&
        !selectedIds.has(exercise.id)
      );
      const chosen = [...candidates]
        .sort((a, b) => exerciseScore(b, selectedIds, selectedEmphases) - exerciseScore(a, selectedIds, selectedEmphases))[0];
      addExercise(chosen);
    }

    if (selected.length < count) {
      const remaining = DATA.exercises
        .filter(exercise =>
          exercise.split === splitId &&
          equipmentIds.includes(exercise.equipment) &&
          !selectedIds.has(exercise.id)
        )
        .sort((a, b) => exerciseScore(b, selectedIds, selectedEmphases) - exerciseScore(a, selectedIds, selectedEmphases));
      for (const exercise of remaining) {
        addExercise(exercise);
        if (selected.length >= count) break;
      }
    }

    return {
      id: `workout-${Date.now()}`,
      splitId,
      startedAt: null,
      dateKey: null,
      plannedMinutes: Number(state.settings.workoutMinutes),
      equipment: [...equipmentIds],
      equipmentMode: pendingEquipmentMode || state.settings.lastEquipmentMode || "mixed",
      recommendationReason: recommendation.reason,
      readiness: recommendation.readiness,
      forced: Boolean(recommendation.forced),
      activeIndex: 0,
      exercises: selected
    };
  }

  function preparePlan(mode, allowUnderRecovered = false) {
    const equipmentIds = equipmentForMode(mode);
    if (!equipmentIds.length) {
      showToast("Choose at least one usual equipment type in Settings.");
      showView("settingsView");
      return;
    }

    const recommendation = chooseSplit(equipmentIds, allowUnderRecovered);
    const splitId = recommendation.splitId;
    const workout = splitId ? buildWorkout(splitId, equipmentIds, recommendation) : null;
    pendingPlan = { mode, equipmentIds, recommendation, workout };
    renderRecommendation();
    showView("recommendationView");
  }

  function renderEquipment() {
    $("todayDate").textContent = formatToday();
    const grid = $("equipmentGrid");
    const options = [
      { id: "mixed", name: "Mixed equipment", note: "Use your usual selections" },
      ...DATA.equipment.map(item => ({ ...item, note: item.id === "bodyweight" ? "No station needed" : item.note }))
    ];
    grid.innerHTML = "";
    options.forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `equipment-card ${option.id === "mixed" ? "mixed" : ""}`;
      button.dataset.equipmentMode = option.id;
      button.innerHTML = `
        <span class="equipment-icon" aria-hidden="true">${equipmentIcon[option.id] || "●"}</span>
        <strong>${option.name}</strong>
        <small>${option.note || "Use only this equipment"}</small>
      `;
      button.addEventListener("click", () => chooseEquipment(option.id));
      grid.appendChild(button);
    });

    const resumeCard = $("resumeWorkoutCard");
    if (state.currentWorkout) {
      const split = DATA.splits[state.currentWorkout.splitId];
      const completed = state.currentWorkout.exercises.filter(item => item.completed).length;
      $("resumeWorkoutText").textContent = `${split?.name || "Saved"} • ${completed} of ${state.currentWorkout.exercises.length} complete`;
      resumeCard.hidden = false;
    } else {
      resumeCard.hidden = true;
    }
    $("workoutNavButton").disabled = !state.currentWorkout;
  }

  function chooseEquipment(mode) {
    pendingEquipmentMode = mode;
    if (!state.currentWorkout) {
      preparePlan(mode);
      return;
    }
    const split = DATA.splits[state.currentWorkout.splitId];
    const completed = state.currentWorkout.exercises.filter(item => item.completed).length;
    $("activeWorkoutText").textContent = `${split?.name || "Current"} workout: ${completed} of ${state.currentWorkout.exercises.length} exercises complete.`;
    $("activeWorkoutDialog").showModal();
  }

  function renderRecommendation() {
    if (!pendingPlan) return;
    const { recommendation, workout, equipmentIds } = pendingPlan;
    const split = recommendation.splitId ? DATA.splits[recommendation.splitId] : null;
    const active = Boolean(pendingPlan.active);

    $("recommendationTitle").textContent = active ? "Workout overview" : "Recommended workout";
    $("recommendationStatus").className = `status-pill ${split ? "ready" : "rest"}`;
    $("recommendationStatus").textContent = split
      ? recommendation.forced ? "LEAST-FATIGUED OPTION" : "READY TO TRAIN"
      : "RECOVERY DAY";
    $("recommendationSplit").textContent = split ? split.name : "Recover and grow";
    $("recommendationMuscles").textContent = split
      ? split.muscles.map(id => DATA.muscles[id].name).join(" • ")
      : "No focused combination is fully ready";
    $("recommendationReadiness").textContent = `${recommendation.readiness || 0}%`;
    $("recommendationTime").textContent = split ? `${workout?.plannedMinutes || state.settings.workoutMinutes} min` : "Rest";
    $("recommendationCount").textContent = split ? workout?.exercises.length || 0 : 0;
    $("recommendationEquipment").textContent = equipmentNames(equipmentIds);
    $("recommendationReason").textContent = recommendation.reason;

    const recovery = $("recommendationRecovery");
    recovery.innerHTML = "";
    if (split) {
      split.muscles.forEach(muscleId => {
        const score = muscleRecovery(muscleId);
        const chip = document.createElement("span");
        chip.className = `recovery-chip ${score.percent >= 90 ? "ready" : "rest"}`;
        chip.textContent = `${DATA.muscles[muscleId].name} ${score.percent}%`;
        recovery.appendChild(chip);
      });
    }

    $("startWorkoutButton").hidden = !split;
    $("startWorkoutButton").textContent = active ? "Resume workout" : "Start workout";
    $("forceWorkoutButton").hidden = Boolean(split) || !recommendation.fallbackSplitId;
    $("changeEquipmentButton").textContent = active ? "Return to workout" : "Choose different equipment";
  }

  function startPendingWorkout() {
    if (!pendingPlan) return;
    if (pendingPlan.active) {
      showView("workoutView");
      return;
    }
    if (!pendingPlan.workout) return;
    const now = new Date();
    pendingPlan.workout.startedAt = now.toISOString();
    pendingPlan.workout.dateKey = localDateKey(now);
    pendingPlan.workout.activeIndex = 0;
    state.currentWorkout = pendingPlan.workout;
    state.settings.lastEquipmentMode = pendingPlan.mode;
    saveState();
    pendingPlan = null;
    renderAll();
    showView("workoutView");
    showToast("Workout saved. Your entries will remain after a refresh.");
  }

  function showCurrentOverview() {
    const workout = state.currentWorkout;
    if (!workout) return;
    pendingPlan = {
      active: true,
      mode: workout.equipmentMode,
      equipmentIds: workout.equipment,
      recommendation: {
        splitId: workout.splitId,
        readiness: workout.readiness || splitReadiness(workout.splitId).percent,
        forced: workout.forced,
        reason: workout.recommendationReason || DATA.splits[workout.splitId].explanation
      },
      workout
    };
    renderRecommendation();
    showView("recommendationView");
  }

  function currentWorkoutItem() {
    const workout = state.currentWorkout;
    if (!workout?.exercises?.length) return null;
    const index = Math.min(Math.max(0, Number(workout.activeIndex || 0)), workout.exercises.length - 1);
    workout.activeIndex = index;
    return { workout, index, item: workout.exercises[index], exercise: exerciseById[workout.exercises[index].exerciseId] };
  }

  function renderWorkout() {
    const current = currentWorkoutItem();
    if (!current) {
      $("workoutNavButton").disabled = true;
      return;
    }
    const { workout, index, item, exercise } = current;
    const split = DATA.splits[workout.splitId];
    const completed = workout.exercises.filter(record => record.completed).length;
    const percent = Math.round(completed / workout.exercises.length * 100);

    $("workoutScreenTitle").textContent = `${split.name} workout`;
    $("workoutEquipmentLine").textContent = equipmentNames(workout.equipment);
    $("exerciseCounter").textContent = `Exercise ${index + 1} of ${workout.exercises.length}`;
    $("workoutPercent").textContent = `${percent}%`;
    $("workoutProgressBar").style.width = `${percent}%`;
    $("workoutFooterCounter").textContent = `${index + 1} / ${workout.exercises.length}`;

    if (!exercise) return;
    $("exerciseTarget").textContent = `${DATA.muscles[exercise.primary].name.toUpperCase()} • ${exercise.emphasis.toUpperCase()}`;
    $("exerciseName").textContent = exercise.name;
    $("exercisePrescription").textContent = `${item.sets.length} SETS • ${exercise.reps} REPS`;
    $("lastPerformance").textContent = lastPerformanceText(exercise.id);
    $("loadColumnLabel").textContent = exercise.equipment === "trx"
      ? "SETUP"
      : exercise.equipment === "bodyweight"
        ? "VARIATION"
        : "WEIGHT";
    $("videoButton").href = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.videoQuery)}`;
    $("exerciseNoteButton").textContent = item.notes ? "View note" : "Add note";

    renderSetRows(item, exercise, index);
    $("completeExerciseButton").classList.toggle("done", item.completed);
    $("completeExerciseButton").textContent = item.completed
      ? index === workout.exercises.length - 1 ? "Completed ✓ • Summary" : "Completed ✓ • Next"
      : index === workout.exercises.length - 1 ? "Complete & review" : "Complete & next";
    $("previousExerciseButton").disabled = false;
    $("nextExerciseButton").textContent = index === workout.exercises.length - 1 ? "Summary ›" : "Next ›";
    $("workoutNavButton").disabled = false;
  }

  function lastPerformanceText(exerciseId) {
    const prior = exerciseHistory(exerciseId)[0];
    if (!prior) return "First time using this exercise";
    const loads = (prior.sets || []).map(set => set.weight).filter(Boolean);
    const reps = (prior.sets || []).map(set => set.reps).filter(Boolean);
    const loadText = loads.length ? loads[0] : "Load not recorded";
    const repText = reps.length ? reps.join(" / ") : "reps not recorded";
    return `Last: ${loadText} • ${repText}`;
  }

  function renderSetRows(item, exercise, exerciseIndex) {
    const container = $("setRows");
    container.innerHTML = "";
    item.sets.forEach((set, setIndex) => {
      const row = document.createElement("div");
      row.className = "set-row";
      const isText = exercise.equipment === "trx" || exercise.equipment === "bodyweight";
      const placeholder = exercise.equipment === "trx"
        ? "Angle"
        : exercise.equipment === "bodyweight"
          ? "Style"
          : "Load";
      row.innerHTML = `
        <span class="set-label">${setIndex + 1}</span>
        <input class="load-input" data-exercise-index="${exerciseIndex}" data-set-index="${setIndex}" inputmode="${isText ? "text" : "decimal"}" autocomplete="off" aria-label="Set ${setIndex + 1} ${placeholder}" placeholder="${placeholder}" value="${escapeAttribute(set.weight)}">
        <input class="reps-input" data-exercise-index="${exerciseIndex}" data-set-index="${setIndex}" inputmode="numeric" autocomplete="off" aria-label="Set ${setIndex + 1} repetitions" placeholder="Reps" value="${escapeAttribute(set.reps)}">
      `;
      container.appendChild(row);
    });

    container.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", event => {
        if (!state.currentWorkout) return;
        const eIndex = Number(event.target.dataset.exerciseIndex);
        const sIndex = Number(event.target.dataset.setIndex);
        const field = event.target.classList.contains("load-input") ? "weight" : "reps";
        state.currentWorkout.exercises[eIndex].sets[sIndex][field] = event.target.value;
        state.currentWorkout.lastSavedAt = new Date().toISOString();
        saveState();
      });
    });
  }

  function openTips() {
    const current = currentWorkoutItem();
    if (!current?.exercise) return;
    const { item, exercise } = current;
    $("tipsTarget").textContent = `${DATA.muscles[exercise.primary].name} • ${exercise.emphasis}`;
    $("tipsExerciseName").textContent = exercise.name;
    $("tipsCue").textContent = exercise.cue;
    $("tipsPrimary").textContent = `${DATA.muscles[exercise.primary].name} — ${exercise.emphasis}`;
    $("tipsSecondary").textContent = exercise.secondary.length
      ? exercise.secondary.map(id => DATA.muscles[id].name).join(", ")
      : "No major assisting group recorded";
    $("tipsReason").textContent = item.reason;
    $("formTipsDialog").showModal();
  }

  function openNotes() {
    const current = currentWorkoutItem();
    if (!current?.exercise) return;
    $("notesExerciseName").textContent = current.exercise.name;
    $("exerciseNotes").value = current.item.notes || "";
    $("notesDialog").showModal();
    setTimeout(() => $("exerciseNotes").focus(), 80);
  }

  function saveNote(event) {
    event.preventDefault();
    const current = currentWorkoutItem();
    if (!current) return;
    current.item.notes = $("exerciseNotes").value.trim();
    state.currentWorkout.lastSavedAt = new Date().toISOString();
    saveState();
    $("notesDialog").close();
    renderWorkout();
    showToast("Note saved.");
  }

  function completeCurrentExercise() {
    const current = currentWorkoutItem();
    if (!current) return;
    current.item.completed = true;
    current.item.completedAt = current.item.completedAt || new Date().toISOString();
    state.currentWorkout.lastSavedAt = new Date().toISOString();
    saveState();
    if (current.index >= current.workout.exercises.length - 1) {
      showSummary();
    } else {
      moveExercise(1);
    }
  }

  function moveExercise(direction) {
    const current = currentWorkoutItem();
    if (!current) return;
    const next = current.index + direction;
    if (next < 0) {
      showCurrentOverview();
      return;
    }
    if (next >= current.workout.exercises.length) {
      showSummary();
      return;
    }
    state.currentWorkout.activeIndex = next;
    saveState();
    renderWorkout();
    $("workoutSwipeSurface").scrollTop = 0;
  }

  function showSummary() {
    if (!state.currentWorkout) return;
    renderSummary();
    showView("summaryView");
  }

  function renderSummary() {
    const workout = state.currentWorkout;
    if (!workout) return;
    const split = DATA.splits[workout.splitId];
    const completed = workout.exercises.filter(item => item.completed).length;
    $("summarySplit").textContent = split.name.toUpperCase();
    $("summaryCompleted").textContent = `${completed} of ${workout.exercises.length} complete`;
    $("summaryEquipment").textContent = equipmentNames(workout.equipment);
    $("finishWorkoutButton").disabled = completed === 0;

    const list = $("summaryExerciseList");
    list.innerHTML = "";
    workout.exercises.forEach((item, index) => {
      const exercise = exerciseById[item.exerciseId];
      const row = document.createElement("button");
      row.type = "button";
      row.className = `summary-exercise-item ${item.completed ? "complete" : ""}`;
      row.innerHTML = `<strong>${index + 1}. ${exercise?.name || "Exercise"}</strong><span>${item.completed ? "Completed ✓" : "Not complete"}</span>`;
      row.addEventListener("click", () => {
        state.currentWorkout.activeIndex = index;
        saveState();
        showView("workoutView");
      });
      list.appendChild(row);
    });
  }

  function finishWorkout() {
    const workout = state.currentWorkout;
    if (!workout) return;
    const completedExercises = workout.exercises.filter(item => item.completed);
    if (!completedExercises.length) {
      showToast("Complete at least one exercise before saving.");
      return;
    }
    state.sessions.push({
      ...workout,
      completedAt: new Date().toISOString(),
      exercises: completedExercises,
      partial: completedExercises.length < workout.exercises.length
    });
    state.currentWorkout = null;
    pendingPlan = null;
    saveState();
    renderAll();
    showView("equipmentView");
    showToast("Workout saved. Recovery clocks have started.");
  }

  function weeklyVolume() {
    const now = new Date();
    const daysSinceMonday = (now.getDay() + 6) % 7;
    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(now.getDate() - daysSinceMonday);
    const volume = Object.fromEntries(Object.keys(DATA.muscles).map(id => [id, 0]));

    state.sessions.forEach(session => {
      const sessionDate = new Date(session.completedAt || session.startedAt);
      if (sessionDate < weekStart) return;
      (session.exercises || []).forEach(item => {
        const exercise = exerciseById[item.exerciseId];
        if (!exercise) return;
        const performedSets = item.sets?.filter(set => set.reps || set.weight).length || item.sets?.length || 0;
        volume[exercise.primary] += performedSets;
        exercise.secondary.forEach(id => { volume[id] += performedSets * 0.5; });
      });
    });
    return volume;
  }

  function renderHistory() {
    const sessions = [...state.sessions].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    const volume = weeklyVolume();
    $("totalWorkouts").textContent = sessions.length;
    $("weeklySets").textContent = Math.round(Object.values(volume).reduce((sum, value) => sum + value, 0));
    $("lastSplit").textContent = sessions[0] ? DATA.splits[sessions[0].splitId]?.name || "—" : "—";

    const volumeList = $("volumeList");
    volumeList.innerHTML = "";
    Object.entries(DATA.muscles).forEach(([muscleId, muscle]) => {
      const sets = volume[muscleId] || 0;
      const target = state.settings.experienceLevel === "beginner" ? 10 : 14;
      const percent = Math.min(100, Math.round(sets / target * 100));
      const item = document.createElement("article");
      item.className = "volume-item";
      item.innerHTML = `
        <div class="volume-head"><strong>${muscle.name}</strong><span>${sets.toFixed(sets % 1 ? 1 : 0)} sets</span></div>
        <div class="volume-track"><div class="volume-bar" style="width:${percent}%"></div></div>
      `;
      volumeList.appendChild(item);
    });

    const historyList = $("historyList");
    historyList.innerHTML = "";
    if (!sessions.length) {
      historyList.innerHTML = '<p class="empty-message">Completed workouts will appear here.</p>';
      return;
    }
    sessions.slice(0, 15).forEach(session => {
      const item = document.createElement("article");
      item.className = "history-item";
      const names = (session.exercises || [])
        .map(record => exerciseById[record.exerciseId]?.name)
        .filter(Boolean);
      item.innerHTML = `
        <div class="history-head">
          <strong>${DATA.splits[session.splitId]?.name || titleCase(session.splitId)}</strong>
          <span>${formatDate(session.completedAt)}</span>
        </div>
        <p>${session.exercises?.length || 0} exercises • ${equipmentNames(session.equipment || [])}</p>
        <p>${names.join(" • ")}</p>
      `;
      historyList.appendChild(item);
    });
  }

  function renderSettings() {
    $("textSize").value = state.settings.textSize || "extra";
    $("workoutMinutes").value = String(state.settings.workoutMinutes);
    $("defaultSets").value = String(state.settings.defaultSets);

    const equipmentContainer = $("equipmentOptions");
    equipmentContainer.innerHTML = "";
    DATA.equipment.forEach(item => {
      const label = document.createElement("label");
      label.className = "settings-check";
      label.innerHTML = `<input type="checkbox" data-equipment-setting="${item.id}" ${state.settings.equipment[item.id] ? "checked" : ""}><span>${item.name}</span>`;
      equipmentContainer.appendChild(label);
    });

    const recoveryContainer = $("recoverySettings");
    recoveryContainer.innerHTML = "";
    Object.entries(DATA.muscles).forEach(([muscleId, muscle]) => {
      const row = document.createElement("div");
      row.className = "recovery-setting";
      row.innerHTML = `
        <label for="recovery-${muscleId}">${muscle.name}</label>
        <input id="recovery-${muscleId}" data-recovery-setting="${muscleId}" type="number" inputmode="numeric" min="12" max="168" step="6" value="${state.settings.recoveryHours[muscleId]}">
      `;
      recoveryContainer.appendChild(row);
    });
  }

  function saveSettings(event) {
    event.preventDefault();
    const equipment = {};
    document.querySelectorAll("[data-equipment-setting]").forEach(input => {
      equipment[input.dataset.equipmentSetting] = input.checked;
    });
    if (!Object.values(equipment).some(Boolean)) {
      showToast("Mixed equipment needs at least one selected option.");
      return;
    }

    const recoveryHours = {};
    document.querySelectorAll("[data-recovery-setting]").forEach(input => {
      recoveryHours[input.dataset.recoverySetting] = Math.min(168, Math.max(12, Number(input.value) || 48));
    });

    state.settings = {
      ...state.settings,
      textSize: $("textSize").value,
      workoutMinutes: Number($("workoutMinutes").value),
      defaultSets: Number($("defaultSets").value),
      equipment,
      recoveryHours
    };
    saveState();
    applyTextSize();
    renderAll();
    showView("equipmentView");
    showToast("Settings saved.");
  }

  function applyTextSize() {
    document.body.dataset.textSize = state.settings.textSize || "extra";
  }

  function exportData() {
    const payload = {
      app: "David's Gym Companion",
      exportedAt: new Date().toISOString(),
      version: 4,
      state
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gym-companion-backup-${localDateKey(new Date())}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("Backup exported.");
  }

  async function importData(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const imported = parsed.state || parsed;
      if (!imported || !Array.isArray(imported.sessions) || !imported.settings) {
        throw new Error("This is not a Gym Companion backup.");
      }
      if (!confirm("Replace the current app data with this backup?")) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));
      state = loadState();
      applyTextSize();
      renderAll();
      showView(state.currentWorkout ? "workoutView" : "equipmentView");
      showToast("Backup imported.");
    } catch (error) {
      console.error(error);
      showToast("That backup file could not be imported.");
    }
  }

  function resetApp() {
    if (!confirm("Erase all workout history, settings, and the current workout? This cannot be undone.")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = defaultState();
    pendingPlan = null;
    applyTextSize();
    saveState();
    renderAll();
    showView("equipmentView");
    showToast("Gym Companion has been reset.");
  }

  function archiveCompletedCurrent(reason = "partial") {
    const workout = state.currentWorkout;
    if (!workout) return 0;
    const completedExercises = workout.exercises.filter(item => item.completed);
    if (completedExercises.length) {
      state.sessions.push({
        ...workout,
        id: `${workout.id}-${reason}-${Date.now()}`,
        completedAt: new Date().toISOString(),
        exercises: completedExercises,
        partial: true,
        partialReason: reason
      });
    }
    state.currentWorkout = null;
    saveState();
    return completedExercises.length;
  }

  function handleNewDayAction(action) {
    const dialog = $("newDayDialog");
    if (!state.currentWorkout) {
      dialog.close();
      return;
    }
    if (action === "continue") {
      state.currentWorkout.newDayPromptFor = localDateKey(new Date());
      saveState();
      dialog.close();
      renderAll();
      showView("workoutView");
      return;
    }
    if (action === "save") {
      const count = archiveCompletedCurrent("new-day");
      dialog.close();
      renderAll();
      showView("equipmentView");
      showToast(count ? `${count} completed exercises saved.` : "No completed exercises were recorded.");
      return;
    }
    if (action === "discard") {
      if (!confirm("Discard the unfinished workout? Saved workout history will remain.")) return;
      state.currentWorkout = null;
      saveState();
      dialog.close();
      renderAll();
      showView("equipmentView");
      showToast("Unfinished workout discarded.");
    }
  }

  function handleActiveWorkoutAction(action) {
    const dialog = $("activeWorkoutDialog");
    if (action === "resume") {
      dialog.close();
      showView("workoutView");
      return;
    }
    if (action === "save") {
      archiveCompletedCurrent("replaced");
      dialog.close();
      renderAll();
      preparePlan(pendingEquipmentMode);
      return;
    }
    if (action === "discard") {
      if (!confirm("Discard the current unfinished workout and build a new one?")) return;
      state.currentWorkout = null;
      saveState();
      dialog.close();
      renderAll();
      preparePlan(pendingEquipmentMode);
    }
  }

  function checkDateChange() {
    const today = localDateKey(new Date());
    if (today !== runtimeDateKey) {
      runtimeDateKey = today;
      renderEquipment();
      renderHistory();
    }
    const workout = state.currentWorkout;
    if (!workout?.startedAt) return;
    const workoutDate = workout.dateKey || localDateKey(workout.startedAt);
    if (workoutDate && workoutDate !== today && workout.newDayPromptFor !== today && !$("newDayDialog").open) {
      const split = DATA.splits[workout.splitId];
      const completed = workout.exercises.filter(item => item.completed).length;
      $("newDayWorkoutText").textContent = `${split?.name || "Previous"} workout from ${formatDate(workout.startedAt)}: ${completed} of ${workout.exercises.length} exercises complete.`;
      $("savePartialWorkoutButton").textContent = completed
        ? `Save ${completed} completed exercise${completed === 1 ? "" : "s"} & start new`
        : "Start new without saving exercises";
      $("newDayDialog").showModal();
    }
  }

  function showView(viewId) {
    if (viewId === "workoutView" && !state.currentWorkout) {
      showToast("Choose equipment to build a workout first.");
      viewId = "equipmentView";
    }
    document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === viewId));
    currentView = viewId;
    const hideBottomNav = ["recommendationView", "workoutView", "summaryView"].includes(viewId);
    $("bottomNav").hidden = hideBottomNav;
    document.body.classList.toggle("flow-mode", viewId === "recommendationView" || viewId === "summaryView");
    document.body.classList.toggle("workout-mode", viewId === "workoutView");
    document.querySelectorAll(".nav-item").forEach(button => {
      button.classList.toggle("active", button.dataset.viewTarget === viewId);
    });
    if (viewId === "equipmentView") renderEquipment();
    if (viewId === "recommendationView") renderRecommendation();
    if (viewId === "workoutView") renderWorkout();
    if (viewId === "summaryView") renderSummary();
    if (viewId === "historyView") renderHistory();
    if (viewId === "settingsView") renderSettings();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function renderAll() {
    renderEquipment();
    renderWorkout();
    renderHistory();
    renderSettings();
  }

  function closeDialogById(id) {
    const dialog = $(id);
    if (dialog?.open) dialog.close();
  }

  function installSwipe(element, onLeft, onRight) {
    let startX = 0;
    let startY = 0;
    let target = null;
    element.addEventListener("touchstart", event => {
      const touch = event.changedTouches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      target = event.target;
    }, { passive: true });
    element.addEventListener("touchend", event => {
      if (target?.closest("input, textarea, select, button, a, dialog, summary, label")) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dx) < 70 || Math.abs(dx) <= Math.abs(dy) * 1.15) return;
      if (dx < 0) onLeft?.();
      else onRight?.();
    }, { passive: true });
  }

  function bindEvents() {
    document.querySelectorAll("[data-view-target]").forEach(button => {
      button.addEventListener("click", () => showView(button.dataset.viewTarget));
    });
    document.querySelectorAll("[data-close-dialog]").forEach(button => {
      button.addEventListener("click", () => closeDialogById(button.dataset.closeDialog));
    });

    $("resumeWorkoutCard").addEventListener("click", () => showView("workoutView"));
    $("recommendationBackButton").addEventListener("click", () => pendingPlan?.active ? showView("workoutView") : showView("equipmentView"));
    $("changeEquipmentButton").addEventListener("click", () => pendingPlan?.active ? showView("workoutView") : showView("equipmentView"));
    $("startWorkoutButton").addEventListener("click", startPendingWorkout);
    $("forceWorkoutButton").addEventListener("click", () => {
      if (!pendingPlan) return;
      preparePlan(pendingPlan.mode, true);
    });

    $("workoutOverviewButton").addEventListener("click", showCurrentOverview);
    $("workoutNotesButton").addEventListener("click", openNotes);
    $("exerciseNoteButton").addEventListener("click", openNotes);
    $("formTipsButton").addEventListener("click", openTips);
    $("notesForm").addEventListener("submit", saveNote);
    $("completeExerciseButton").addEventListener("click", completeCurrentExercise);
    $("previousExerciseButton").addEventListener("click", () => moveExercise(-1));
    $("nextExerciseButton").addEventListener("click", () => moveExercise(1));

    $("summaryBackButton").addEventListener("click", () => showView("workoutView"));
    $("returnToWorkoutButton").addEventListener("click", () => showView("workoutView"));
    $("finishWorkoutButton").addEventListener("click", finishWorkout);

    $("settingsForm").addEventListener("submit", saveSettings);
    $("exportDataButton").addEventListener("click", exportData);
    $("importDataInput").addEventListener("change", importData);
    $("resetAppButton").addEventListener("click", resetApp);

    $("continueOldWorkoutButton").addEventListener("click", () => handleNewDayAction("continue"));
    $("savePartialWorkoutButton").addEventListener("click", () => handleNewDayAction("save"));
    $("discardOldWorkoutButton").addEventListener("click", () => handleNewDayAction("discard"));
    $("resumeActiveWorkoutButton").addEventListener("click", () => handleActiveWorkoutAction("resume"));
    $("saveActivePartialButton").addEventListener("click", () => handleActiveWorkoutAction("save"));
    $("discardActiveWorkoutButton").addEventListener("click", () => handleActiveWorkoutAction("discard"));

    installSwipe($("recommendationContent"), startPendingWorkout, () => pendingPlan?.active ? showView("workoutView") : showView("equipmentView"));
    installSwipe($("workoutSwipeSurface"), () => moveExercise(1), () => moveExercise(-1));
    installSwipe($("summaryView"), null, () => showView("workoutView"));
    installSwipe($("historyView"), () => showView("settingsView"), null);
    installSwipe($("settingsView"), null, () => showView("historyView"));

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) checkDateChange();
    });
    window.addEventListener("focus", checkDateChange);
    setInterval(checkDateChange, 60_000);
  }

  function initialize() {
    applyTextSize();
    bindEvents();
    renderAll();
    if (state.currentWorkout) showView("workoutView");
    else showView("equipmentView");
    setTimeout(checkDateChange, 50);
  }

  initialize();
})();
