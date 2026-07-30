# David's Gym Companion — Large-Text Swipe Prototype v4

This version is designed for an iPhone 12 Pro Max and prioritizes large text, high contrast, large tap targets, and minimal scrolling during workouts.

## Main flow

1. Choose the equipment available right now.
2. Review the recommended Push, Pull, or Legs + Core combination.
3. Swipe left or tap Start.
4. Record one exercise at a time.
5. Swipe between exercises.
6. Review and save the workout.

## Equipment modes

- Mixed equipment
- Bodyweight
- TRX
- Cable / rope
- Dumbbells
- Machines
- Smith machine

A single-equipment workout uses only the selected equipment type. Mixed equipment uses the equipment enabled in Settings.

## Memory and date behavior

- Weight, setup, reps, notes, exercise position, and completion status save as they are entered.
- Closing or refreshing the page does not erase the current workout.
- On the same day, the app resumes the saved workout.
- If an unfinished workout crosses into a new calendar day, the app asks whether to continue it, save completed exercises, or discard it.
- Nothing is deleted automatically because the date changed.
- Saved data remains in the browser's localStorage. Use Export Backup before clearing browser data or changing devices.

## Swipe controls

- Recommendation: left to continue, right to go back.
- Workout: left for the next exercise, right for the previous exercise or overview.
- Final exercise: left to open the summary.
- Summary: right to return to the workout.
- History and Settings: swipe between them.

Swipes are ignored while using inputs, buttons, links, menus, or dialogs.

## Install on GitHub Pages

Replace the existing repository files with:

- `index.html`
- `style.css`
- `exercises.js`
- `app.js`

The README is optional and is not required for the app to run.

## Exercise demonstrations

The Video button opens a YouTube search for the selected exercise. This avoids maintaining a large custom image or video library. Review demonstrations critically and stop any movement that causes sharp or worsening pain.
