(() => {
  "use strict";

  const DATA = window.GYM_DATA;
  const STORAGE_KEY = "gym-companion-adaptive-v2";
  const $ = id => document.getElementById(id);
  const exerciseById = Object.fromEntries(DATA.exercises.map(exercise => [exercise.id, exercise]));
  const splitOrder = ["push", "pull", "legs"];

  const defaultState = () => ({
    settings: {
      workoutMinutes: 45,
      defaultSets: 3,
      experienceLevel: "beginner",
      equipment: Object.fromEntries(DATA.equipment.map(item => [item.id, true])),
      recoveryHours: Object.fromEntries(
        Object.entries(DATA.muscles).map(([id, muscle]) => [id, muscle.defaultRecovery])
      )
    },
    sessions: [],
    currentWorkout: null
  });

  let state = loadState();
  let workoutIndex = 0;
  let currentRecommendation = null;
  let toastTimer = null;

  function loadState() {
    const fresh = defaultState();
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored) return fresh;
      return {
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
    } catch {
      return fresh;
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function titleCase(value) {
    return String(value || "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  function formatDate(value, options = {}) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      ...options
    }).format(date);
  }

  function hoursSince(value) {
    const time = new Date(value).getTime();
    if (!Number.isFinite(time)) return Infinity;
    return Math.max(0, (Date.now() - time) / 36e5);
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
          stimuli.push({ completedAt, factor: 0.6, exercise, session });
        }
      });
    });
    return stimuli.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }

  function muscleRecovery(muscleId) {
    const required = Number(state.settings.recoveryHours[muscleId] || DATA.muscles[muscleId].defaultRecovery);
    const stimuli = muscleStimuli(muscleId);
    if (!stimuli.length) {
      return { readiness: 1, percent: 100, hoursRemaining: 0, last: null, required };
    }

    let lowestReadiness = 1;
    let governingStimulus = stimuli[0];

    for (const stimulus of stimuli.slice(0, 8)) {
      const adjustedRequired = required * stimulus.factor;
      const readiness = Math.min(1, hoursSince(stimulus.completedAt) / adjustedRequired);
      if (readiness < lowestReadiness) {
        lowestReadiness = readiness;
        governingStimulus = stimulus;
      }
    }

    const adjustedRequired = required * governingStimulus.factor;
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
    const scores = split.muscles.map(muscleRecovery);
    const minimum = Math.min(...scores.map(score => score.readiness));
    const average = scores.reduce((sum, score) => sum + score.readiness, 0) / scores.length;
    return { minimum, average, percent: Math.round((minimum * 0.65 + average * 0.35) * 100) };
  }

  function lastCompletedSplit() {
    return [...state.sessions]
      .sort((a, b) => new Date(b.completedAt || b.startedAt) - new Date(a.completedAt || a.startedAt))[0]?.splitId || null;
  }

  function chooseSplit() {
    const lastSplit = lastCompletedSplit();
    const ranked = splitOrder
      .map(splitId => ({ splitId, ...splitReadiness(splitId) }))
      .sort((a, b) => b.percent - a.percent);

    const ready = ranked.filter(item => item.minimum >= 0.85);
    if (!ready.length) {
      return {
        splitId: null,
        readiness: ranked[0]?.percent || 0,
        reason: "Every training combination still has meaningful recovery time remaining. A rest day, walking, or gentle mobility is the better recommendation."
      };
    }

    let selected = ready[0];
    if (selected.splitId === lastSplit && ready[1] && ready[1].percent >= selected.percent - 8) {
      selected = ready[1];
    }

    const split = DATA.splits[selected.splitId];
    const readyNames = split.muscles
      .filter(id => muscleRecovery(id).readiness >= 0.95)
      .map(id => DATA.muscles[id].name);

    return {
      splitId: selected.splitId,
      readiness: selected.percent,
      reason: readyNames.length
        ? `${readyNames.join(", ")} have the strongest recovery scores, and this combination keeps today's work focused.`
        : `${split.name} is the most recovered compatible combination available today.`
    };
  }

  function exerciseHistory(exerciseId) {
    return sessionExerciseRecords()
      .filter(record => record.exerciseId === exerciseId)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }

  function emphasisLastUsed(primary, emphasis) {
    const records = sessionExerciseRecords()
      .filter(record => {
        const exercise = exerciseById[record.exerciseId];
        return exercise?.primary === primary && exercise.emphasis === emphasis;
      })
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    return records[0]?.completedAt || null;
  }

  function enabledEquipment() {
    return Object.entries(state.settings.equipment)
      .filter(([, enabled]) => enabled)
      .map(([id]) => id);
  }

  function exerciseScore(exercise, selectedIds) {
    const history = exerciseHistory(exercise.id);
    const lastUsed = history[0]?.completedAt;
    const emphasisUsed = emphasisLastUsed(exercise.primary, exercise.emphasis);
    let score = 100;

    score += Math.min(hoursSince(lastUsed), 24 * 30) / 12;
    score += Math.min(hoursSince(emphasisUsed), 24 * 30) / 18;
    if (!lastUsed) score += 35;
    if (!emphasisUsed) score += 20;
    if (selectedIds.includes(exercise.id)) score -= 1000;
    if (lastUsed && hoursSince(lastUsed) < 24 * 5) score -= 50;

    return score;
  }

  function numberOfExercises() {
    const minutes = Number(state.settings.workoutMinutes);
    if (minutes <= 30) return 4;
    if (minutes <= 45) return 5;
    if (minutes <= 60) return 6;
    return 7;
  }

  function buildWorkout(splitId) {
    const split = DATA.splits[splitId];
    const allowedEquipment = enabledEquipment();
    const count = numberOfExercises();
    const selected = [];

    for (const muscleId of split.slots.slice(0, count)) {
      let candidates = DATA.exercises.filter(exercise =>
        exercise.split === splitId &&
        exercise.primary === muscleId &&
        allowedEquipment.includes(exercise.equipment)
      );

      if (!candidates.length) {
        candidates = DATA.exercises.filter(exercise =>
          exercise.split === splitId && allowedEquipment.includes(exercise.equipment)
        );
      }

      const chosen = [...candidates]
        .sort((a, b) => exerciseScore(b, selected.map(item => item.exerciseId)) - exerciseScore(a, selected.map(item => item.exerciseId)))[0];

      if (!chosen) continue;
      const prior = exerciseHistory(chosen.id)[0];
      const lastPrimary = sessionExerciseRecords()
        .filter(record => exerciseById[record.exerciseId]?.primary === chosen.primary)
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
      const lastPrimaryExercise = lastPrimary ? exerciseById[lastPrimary.exerciseId] : null;

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
          ? `${DATA.muscles[chosen.primary].name} is ready. Last time you used ${lastPrimaryExercise.name}; this rotates to ${chosen.emphasis} with ${titleCase(chosen.equipment)} equipment.`
          : `No prior ${DATA.muscles[chosen.primary].name.toLowerCase()} record exists, so this begins your ${chosen.emphasis} rotation.`
      });
    }

    return {
      id: `workout-${Date.now()}`,
      splitId,
      startedAt: new Date().toISOString(),
      plannedMinutes: Number(state.settings.workoutMinutes),
      exercises: selected
    };
  }

  function renderToday() {
    $("todayDate").textContent = new Intl.DateTimeFormat("en-US", {
      weekday: "short", month: "short", day: "numeric"
    }).format(new Date());

    currentRecommendation = chooseSplit();
    const split = currentRecommendation.splitId ? DATA.splits[currentRecommendation.splitId] : null;

    if (split) {
      $("recommendationBadge").textContent = "READY TO TRAIN";
      $("recommendationBadge").className = "status-pill ready";
      $("recommendedSplit").textContent = `${split.name} Focus`;
      $("recommendationReason").textContent = currentRecommendation.reason;
      $("readinessScore").textContent = `${currentRecommendation.readiness}%`;
      $("estimatedTime").textContent = `${state.settings.workoutMinutes} min`;
      $("exerciseTotal").textContent = numberOfExercises();
      $("buildWorkoutButton").textContent = state.currentWorkout ? "Replace current workout" : "Build today's workout";
      $("buildWorkoutButton").disabled = false;
      $("splitExplanation").textContent = split.explanation;
    } else {
      $("recommendationBadge").textContent = "RECOVERY DAY";
      $("recommendationBadge").className = "status-pill rest";
      $("recommendedSplit").textContent = "Recover and grow";
      $("recommendationReason").textContent = currentRecommendation.reason;
      $("readinessScore").textContent = `${currentRecommendation.readiness}%`;
      $("estimatedTime").textContent = "Rest";
      $("exerciseTotal").textContent = "0";
      $("buildWorkoutButton").textContent = "No workout recommended";
      $("buildWorkoutButton").disabled = true;
      $("splitExplanation").textContent = "The app intentionally avoids filling every day with exercises. Recovery is part of the training plan, not an empty space between workouts.";
    }

    renderRecoveryGrid();
  }

  function renderRecoveryGrid() {
    const grid = $("recoveryGrid");
    grid.innerHTML = "";

    Object.entries(DATA.muscles).forEach(([muscleId, muscle]) => {
      const recovery = muscleRecovery(muscleId);
      const card = document.createElement("button");
      card.type = "button";
      card.className = `recovery-card ${recovery.percent >= 95 ? "ready" : "rest"}`;
      card.dataset.muscle = muscleId;
      card.innerHTML = `
        <span class="recovery-card-top">
          <strong>${muscle.name}</strong>
          <span class="recovery-percent">${recovery.percent}%</span>
        </span>
        <span class="mini-track"><span class="mini-bar" style="width:${recovery.percent}%"></span></span>
        <small>${recovery.hoursRemaining ? `${recovery.hoursRemaining} hr remaining` : "Ready"}</small>
      `;
      card.addEventListener("click", () => openMuscleDialog(muscleId));
      grid.appendChild(card);
    });
  }

  function openMuscleDialog(muscleId) {
    const muscle = DATA.muscles[muscleId];
    const recovery = muscleRecovery(muscleId);
    $("dialogMuscleGroup").textContent = muscle.group;
    $("dialogMuscleName").textContent = muscle.name;
    $("dialogRecoveryBar").querySelector(".progress-bar").style.width = `${recovery.percent}%`;
    $("dialogRecoveryText").textContent = recovery.hoursRemaining
      ? `${recovery.percent}% recovered. About ${recovery.hoursRemaining} hours remain under your current setting.`
      : "This body part has completed its current recovery target.";
    $("dialogLastExercise").textContent = recovery.last
      ? `Latest stimulus: ${recovery.last.exercise.name} on ${formatDate(recovery.last.completedAt, { hour: "numeric", minute: "2-digit" })}.`
      : "No previous training record yet.";
    $("muscleDialog").showModal();
  }

  function renderWorkout() {
    const workout = state.currentWorkout;
    $("emptyWorkout").hidden = Boolean(workout);
    $("activeWorkout").hidden = !workout;
    if (!workout) return;

    workoutIndex = Math.min(workoutIndex, Math.max(0, workout.exercises.length - 1));
    const split = DATA.splits[workout.splitId];
    const completed = workout.exercises.filter(item => item.completed).length;
    const percent = workout.exercises.length ? Math.round(completed / workout.exercises.length * 100) : 0;

    $("workoutTitle").textContent = `${split.name} Workout`;
    $("workoutSubtitle").textContent = `${workout.exercises.length} exercises • about ${workout.plannedMinutes} minutes`;
    $("workoutPercent").textContent = `${percent}%`;
    $("workoutProgressBar").style.width = `${percent}%`;

    const item = workout.exercises[workoutIndex];
    const exercise = exerciseById[item.exerciseId];
    if (!item || !exercise) return;

    $("exerciseNumber").textContent = workoutIndex + 1;
    $("exerciseTarget").textContent = `${DATA.muscles[exercise.primary].name.toUpperCase()} • ${exercise.emphasis.toUpperCase()}`;
    $("exerciseName").textContent = exercise.name;
    $("equipmentTag").textContent = titleCase(exercise.equipment);
    $("movementTag").textContent = exercise.movement;
    $("setRepTag").textContent = `${item.sets.length} sets × ${exercise.reps}`;
    $("exerciseReason").textContent = item.reason;
    $("exerciseCue").textContent = exercise.cue;
    $("primaryMuscle").textContent = `${DATA.muscles[exercise.primary].name} — ${exercise.emphasis}`;
    $("secondaryMuscles").textContent = exercise.secondary.length
      ? exercise.secondary.map(id => DATA.muscles[id].name).join(", ")
      : "No major assisting group recorded";
    $("videoButton").href = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.videoQuery)}`;
    $("exerciseNotes").value = item.notes || "";

    renderSetRows(item);

    $("previousExerciseButton").disabled = workoutIndex === 0;
    $("completeExerciseButton").textContent = item.completed
      ? "Completed ✓ — Next"
      : "Complete exercise";
    $("completeExerciseButton").classList.toggle("done", item.completed);
    $("finishWorkoutButton").disabled = completed === 0;
  }

  function renderSetRows(item) {
    const container = $("setRows");
    container.innerHTML = "";
    item.sets.forEach((set, index) => {
      const row = document.createElement("div");
      row.className = "set-row";
      row.innerHTML = `
        <span class="set-label">${index + 1}</span>
        <input class="weight-input" data-set="${index}" inputmode="decimal" aria-label="Set ${index + 1} weight" placeholder="Weight" value="${escapeAttribute(set.weight)}">
        <input class="reps-input" data-set="${index}" inputmode="numeric" aria-label="Set ${index + 1} repetitions" placeholder="Reps" value="${escapeAttribute(set.reps)}">
      `;
      container.appendChild(row);
    });

    container.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", event => {
        const setIndex = Number(event.target.dataset.set);
        const field = event.target.classList.contains("weight-input") ? "weight" : "reps";
        state.currentWorkout.exercises[workoutIndex].sets[setIndex][field] = event.target.value;
        saveState();
      });
    });
  }

  function escapeAttribute(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function completeCurrentExercise() {
    const workout = state.currentWorkout;
    if (!workout) return;
    const item = workout.exercises[workoutIndex];
    item.notes = $("exerciseNotes").value.trim();
    item.completed = true;
    item.completedAt = item.completedAt || new Date().toISOString();
    saveState();

    if (workoutIndex < workout.exercises.length - 1) {
      workoutIndex += 1;
      renderWorkout();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      renderWorkout();
      showToast("All planned exercises are complete. Finish the workout when ready.");
    }
  }

  function saveCurrentNotes() {
    if (!state.currentWorkout) return;
    state.currentWorkout.exercises[workoutIndex].notes = $("exerciseNotes").value;
    saveState();
  }

  function finishWorkout() {
    const workout = state.currentWorkout;
    if (!workout) return;
    const completedExercises = workout.exercises.filter(item => item.completed);
    if (!completedExercises.length) {
      showToast("Complete at least one exercise before saving the workout.");
      return;
    }

    const session = {
      ...workout,
      completedAt: new Date().toISOString(),
      exercises: completedExercises
    };
    state.sessions.push(session);
    state.currentWorkout = null;
    workoutIndex = 0;
    saveState();
    renderAll();
    switchView("progressView");
    showToast("Workout saved. Recovery clocks have started.");
  }

  function weeklyVolume() {
    const now = new Date();
    const day = now.getDay();
    const daysSinceMonday = (day + 6) % 7;
    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(now.getDate() - daysSinceMonday);

    const volume = Object.fromEntries(Object.keys(DATA.muscles).map(id => [id, 0]));
    state.sessions.forEach(session => {
      const date = new Date(session.completedAt || session.startedAt);
      if (date < weekStart) return;
      (session.exercises || []).forEach(item => {
        const exercise = exerciseById[item.exerciseId];
        if (!exercise) return;
        const performedSets = item.sets?.filter(set => set.reps || set.weight).length || item.sets?.length || 0;
        volume[exercise.primary] += performedSets;
        exercise.secondary.forEach(id => {
          volume[id] += performedSets * 0.5;
        });
      });
    });
    return volume;
  }

  function renderProgress() {
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
        <p class="volume-meta">Direct sets count fully; assisting sets count as half.</p>
        <div class="volume-track"><div class="volume-bar" style="width:${percent}%"></div></div>
      `;
      volumeList.appendChild(item);
    });

    const historyList = $("historyList");
    historyList.innerHTML = "";
    if (!sessions.length) {
      historyList.innerHTML = '<div class="empty-state"><h3>No saved workouts yet</h3><p>Your completed workouts will appear here.</p></div>';
      return;
    }

    sessions.slice(0, 12).forEach(session => {
      const item = document.createElement("article");
      item.className = "history-item";
      const exerciseNames = (session.exercises || []).map(record => exerciseById[record.exerciseId]?.name).filter(Boolean);
      item.innerHTML = `
        <div class="history-head">
          <strong>${DATA.splits[session.splitId]?.name || titleCase(session.splitId)}</strong>
          <span>${formatDate(session.completedAt)}</span>
        </div>
        <p class="history-meta">${session.exercises?.length || 0} exercises • ${session.plannedMinutes || "—"} planned minutes</p>
        <p class="history-exercises">${exerciseNames.join(" • ")}</p>
      `;
      historyList.appendChild(item);
    });
  }

  function renderSettings() {
    $("workoutMinutes").value = String(state.settings.workoutMinutes);
    $("defaultSets").value = String(state.settings.defaultSets);
    $("experienceLevel").value = state.settings.experienceLevel;

    const equipmentContainer = $("equipmentOptions");
    equipmentContainer.innerHTML = "";
    DATA.equipment.forEach(item => {
      const label = document.createElement("label");
      label.className = "check-option";
      label.innerHTML = `<input type="checkbox" data-equipment="${item.id}" ${state.settings.equipment[item.id] ? "checked" : ""}> <span>${item.name}</span>`;
      equipmentContainer.appendChild(label);
    });

    const recoveryContainer = $("recoverySettings");
    recoveryContainer.innerHTML = "";
    Object.entries(DATA.muscles).forEach(([muscleId, muscle]) => {
      const row = document.createElement("div");
      row.className = "recovery-setting";
      row.innerHTML = `
        <label for="recovery-${muscleId}">${muscle.name}</label>
        <input id="recovery-${muscleId}" data-recovery="${muscleId}" type="number" inputmode="numeric" min="12" max="168" step="6" value="${state.settings.recoveryHours[muscleId]}">
      `;
      recoveryContainer.appendChild(row);
    });
  }

  function saveSettings(event) {
    event.preventDefault();
    const equipment = {};
    document.querySelectorAll("[data-equipment]").forEach(input => {
      equipment[input.dataset.equipment] = input.checked;
    });

    if (!Object.values(equipment).some(Boolean)) {
      showToast("Select at least one equipment type.");
      return;
    }

    const recoveryHours = {};
    document.querySelectorAll("[data-recovery]").forEach(input => {
      const value = Math.min(168, Math.max(12, Number(input.value) || 48));
      recoveryHours[input.dataset.recovery] = value;
    });

    state.settings = {
      ...state.settings,
      workoutMinutes: Number($("workoutMinutes").value),
      defaultSets: Number($("defaultSets").value),
      experienceLevel: $("experienceLevel").value,
      equipment,
      recoveryHours
    };
    saveState();
    renderAll();
    showToast("Coach settings saved.");
    switchView("todayView");
  }

  function resetApp() {
    const confirmed = confirm("Erase all settings, workout history, and the current workout? This cannot be undone.");
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEY);
    state = defaultState();
    workoutIndex = 0;
    saveState();
    renderAll();
    switchView("todayView");
    showToast("Gym Companion has been reset.");
  }

  function switchView(viewId) {
    document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === viewId));
    document.querySelectorAll(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.view === viewId));

    const titles = {
      todayView: "Today's Plan",
      workoutView: "Workout",
      progressView: "Progress",
      settingsView: "Settings"
    };
    $("pageTitle").textContent = titles[viewId] || "Gym Companion";

    if (viewId === "workoutView") renderWorkout();
    if (viewId === "progressView") renderProgress();
    if (viewId === "settingsView") renderSettings();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderAll() {
    renderToday();
    renderWorkout();
    renderProgress();
    renderSettings();
  }

  function buildRecommendedWorkout() {
    if (!currentRecommendation?.splitId) return;
    if (state.currentWorkout) {
      const confirmed = confirm("Replace the current unfinished workout with a new recommendation?");
      if (!confirmed) return;
    }
    state.currentWorkout = buildWorkout(currentRecommendation.splitId);
    workoutIndex = 0;
    saveState();
    renderWorkout();
    switchView("workoutView");
    showToast("Workout built from recovery and rotation history.");
  }

  function moveExercise(direction) {
    if (!state.currentWorkout) return;
    saveCurrentNotes();
    const next = workoutIndex + direction;
    if (next < 0 || next >= state.currentWorkout.exercises.length) return;
    workoutIndex = next;
    renderWorkout();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  $("quickSettingsButton").addEventListener("click", () => switchView("settingsView"));
  $("goTodayButton").addEventListener("click", () => switchView("todayView"));
  $("buildWorkoutButton").addEventListener("click", buildRecommendedWorkout);
  $("previousExerciseButton").addEventListener("click", () => moveExercise(-1));
  $("completeExerciseButton").addEventListener("click", completeCurrentExercise);
  $("exerciseNotes").addEventListener("input", saveCurrentNotes);
  $("finishWorkoutButton").addEventListener("click", finishWorkout);
  $("settingsForm").addEventListener("submit", saveSettings);
  $("resetAppButton").addEventListener("click", resetApp);

  let touchStartX = 0;
  let touchStartY = 0;
  let touchTarget = null;
  $("exerciseCard").addEventListener("touchstart", event => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchTarget = event.target;
  }, { passive: true });

  $("exerciseCard").addEventListener("touchend", event => {
    if (touchTarget?.closest("input, textarea, button, a")) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    if (Math.abs(dx) < 60 || Math.abs(dx) <= Math.abs(dy)) return;
    moveExercise(dx < 0 ? 1 : -1);
  }, { passive: true });

  renderAll();
})();
