# David's Gym Companion — Adaptive Prototype

This prototype replaces fixed Monday/Wednesday/Friday workouts with an adaptive Push, Pull, or Legs + Core recommendation.

## Main features

- Saves all data locally in the browser with `localStorage`
- Recommends one compatible muscle combination instead of a full-body session
- Uses adjustable recovery hours for every major muscle group
- Counts assisting muscles as partial fatigue and partial weekly volume
- Rotates exercise emphasis, equipment, and recent exercise history
- Supports Machine, Cable/Rope, Dumbbell, Smith Machine, and Bodyweight filters
- Builds 30-, 45-, 60-, or 75-minute sessions
- Tracks weight, repetitions, notes, completed exercises, recovery, and workout history
- Uses YouTube search links for demonstrations instead of custom pictures
- Works as a static GitHub Pages site; no server or API key is required

## Install in the existing GitHub Pages repository

Replace these files in `dadmacboy/workoutcomp`:

1. `index.html`
2. `style.css`
3. `exercises.js`
4. `app.js`

The old image files can remain in the repository; this version does not load them.

## Important prototype limitation

Recovery time is an adjustable planning rule, not a biological measurement. Soreness, sleep, joint pain, performance, illness, and medical restrictions still require human judgment. Stop an exercise that causes sharp or unusual pain.
