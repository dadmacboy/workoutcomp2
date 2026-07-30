# David's Gym Companion v6.1

A phone-first adaptive hypertrophy workout prototype designed for an iPhone 12 Pro Max with large, high-contrast text and minimal scrolling.

## Main flow

1. **Home:** choose the equipment currently available from a dropdown.
2. **Recommendation:** the app selects a Push, Pull, or Legs + Core workout using recovery, recent exercise history, muscle emphasis, and equipment availability.
3. **Workout:** enter sets, load/setup, and reps one exercise at a time. Swipe left or right, or use the large arrow buttons.
4. **Finish:** save the session to local workout history.

## Bottom navigation

- **Home** — equipment selection, recovery preview, resume an unfinished workout, and history access.
- **Search** — browse the exercise library by name, body part, or equipment.
- **Supplements** — weight-based protein target plus general creatine, magnesium L-threonate, and omega-3 planning information.
- **Settings** — body weight, units, text size, workout duration, sets, equipment preferences, recovery hours, and backup tools.

## Saving and date changes

- Entries save automatically in browser localStorage.
- Refreshing or closing the page does not erase an active workout.
- When a new calendar day begins, an unfinished workout is preserved and the app asks whether to continue, save completed exercises and start new, or discard it.
- Nothing is deleted automatically.
- Export a backup before clearing Safari data or changing phones.

## Home-screen icon

The package includes an Apple touch icon and web-app manifest. After publishing on GitHub Pages, open the site in Safari, tap **Share**, then **Add to Home Screen**.

## Install on GitHub Pages

Replace these files in the repository root:

- `index.html`
- `style.css`
- `exercises.js`
- `app.js`
- `apple-touch-icon.png`
- `icon-192.png`
- `icon-512.png`
- `manifest.webmanifest`
- `service-worker.js`

The service worker provides a basic offline cache after the first successful visit.

## Health note

Recovery and supplement values are planning aids, not medical prescriptions. Adjust training for pain, unusual fatigue, clinician advice, and individual recovery. Supplements may interact with medications or health conditions.


## v6 visual refresh

- Softer high-contrast navy and teal design for easier viewing.
- Larger, clearer bottom-navigation icons.
- Friendly supplement cards with protein, creatine, magnesium L-threonate, and omega-3 targets.
- Magnesium L-threonate is shown as a trial range, while clearly separating compound weight from elemental magnesium.
- Existing v5 workout history and settings remain compatible because the local-storage key is unchanged.

## Supplement evidence notes

The magnesium card distinguishes the weight of the magnesium L-threonate compound from elemental magnesium. Recent randomized trials used 1 g/day or 2 g/day of the compound. The general U.S. tolerable upper limit for magnesium from supplements and medications is 350 mg/day of elemental magnesium for adults unless a clinician advises otherwise.

Sources:
- NIH Office of Dietary Supplements: https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/
- 2024 randomized sleep trial: https://pubmed.ncbi.nlm.nih.gov/39252819/
- Randomized cognition and sleep trial: https://pubmed.ncbi.nlm.nih.gov/41601871/


## v6.1 home screen cleanup

Removed the redundant “What equipment can you use?” heading. The Home screen now shows only “Available equipment” above the equipment dropdown.
