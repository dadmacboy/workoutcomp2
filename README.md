# David's Gym Companion — Equipment-First Adaptive Prototype

This prototype replaces fixed Monday/Wednesday/Friday workouts with an adaptive Push, Pull, or Legs + Core recommendation.

## New equipment-first flow

1. Tap **Choose equipment & build workout**.
2. Select the equipment you can use right now:
   - Mixed equipment
   - Bodyweight / pull-up bar
   - TRX suspension trainer
   - Cable / rope
   - Dumbbells
   - Machines
   - Smith machine
3. The app checks recovery and chooses the most practical compatible body-part combination.
4. The generated workout uses only the equipment selected for that session.

The last choice is remembered for convenience, but the app asks again before every new workout.

## Main features

- Saves all data locally in the browser with `localStorage`
- Recommends one compatible muscle combination instead of a full-body session
- Uses adjustable recovery hours for every major muscle group
- Counts assisting muscles as partial fatigue and partial weekly volume
- Rotates muscle emphasis and recent exercise history
- Includes 95 exercises across Push, Pull, and Legs + Core
- Supports Machine, Cable/Rope, Dumbbell, Smith Machine, Bodyweight, and TRX workouts
- Builds 30-, 45-, 60-, or 75-minute sessions
- Tracks weight, repetitions, notes, completed exercises, recovery, equipment used, and workout history
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
