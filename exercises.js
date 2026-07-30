window.GYM_DATA = {
  "equipment": [
    {
      "id": "bodyweight",
      "name": "Bodyweight",
      "note": "Floor, bench, or pull-up bar"
    },
    {
      "id": "trx",
      "name": "TRX",
      "note": "Suspension trainer"
    },
    {
      "id": "cable",
      "name": "Cable / rope",
      "note": "Cable station and attachments"
    },
    {
      "id": "dumbbell",
      "name": "Dumbbells",
      "note": "One or two dumbbells"
    },
    {
      "id": "machine",
      "name": "Machines",
      "note": "Selectorized or plate-loaded"
    },
    {
      "id": "smith",
      "name": "Smith machine",
      "note": "Guided barbell station"
    }
  ],
  "muscles": {
    "chest": {
      "name": "Chest",
      "group": "Push",
      "defaultRecovery": 72
    },
    "shoulders": {
      "name": "Shoulders",
      "group": "Push / Pull",
      "defaultRecovery": 60
    },
    "triceps": {
      "name": "Triceps",
      "group": "Push",
      "defaultRecovery": 48
    },
    "back": {
      "name": "Back",
      "group": "Pull",
      "defaultRecovery": 72
    },
    "biceps": {
      "name": "Biceps",
      "group": "Pull",
      "defaultRecovery": 48
    },
    "forearms": {
      "name": "Forearms",
      "group": "Pull",
      "defaultRecovery": 48
    },
    "quads": {
      "name": "Quadriceps",
      "group": "Legs",
      "defaultRecovery": 72
    },
    "hamstrings": {
      "name": "Hamstrings",
      "group": "Legs",
      "defaultRecovery": 72
    },
    "glutes": {
      "name": "Glutes",
      "group": "Legs",
      "defaultRecovery": 72
    },
    "calves": {
      "name": "Calves",
      "group": "Legs",
      "defaultRecovery": 48
    },
    "core": {
      "name": "Core",
      "group": "Trunk",
      "defaultRecovery": 48
    }
  },
  "splits": {
    "push": {
      "name": "Push",
      "muscles": [
        "chest",
        "shoulders",
        "triceps"
      ],
      "explanation": "Chest, pressing deltoids, and triceps work together. Training them in one session avoids scattering fatigue across your whole body.",
      "slots": [
        "chest",
        "chest",
        "shoulders",
        "triceps",
        "shoulders",
        "triceps",
        "chest"
      ]
    },
    "pull": {
      "name": "Pull",
      "muscles": [
        "back",
        "shoulders",
        "biceps",
        "forearms"
      ],
      "explanation": "Back, rear deltoids, biceps, and forearms share pulling movements, so the session stays efficient and biomechanically compatible.",
      "slots": [
        "back",
        "back",
        "shoulders",
        "biceps",
        "forearms",
        "biceps",
        "back"
      ]
    },
    "legs": {
      "name": "Legs + Core",
      "muscles": [
        "quads",
        "hamstrings",
        "glutes",
        "calves",
        "core"
      ],
      "explanation": "Lower-body muscles and core are grouped together so upper-body recovery is protected while your whole body still receives balanced training.",
      "slots": [
        "quads",
        "hamstrings",
        "glutes",
        "calves",
        "core",
        "quads",
        "hamstrings"
      ]
    }
  },
  "exercises": [
    {
      "id": "machine-chest-press",
      "name": "Machine Chest Press",
      "split": "push",
      "primary": "chest",
      "emphasis": "middle chest",
      "secondary": [
        "triceps",
        "shoulders"
      ],
      "equipment": "machine",
      "movement": "Horizontal press",
      "reps": "8–12",
      "cue": "Keep your shoulder blades gently back and press without bouncing or locking out hard.",
      "videoQuery": "machine chest press proper form"
    },
    {
      "id": "incline-machine-press",
      "name": "Incline Machine Press",
      "split": "push",
      "primary": "chest",
      "emphasis": "upper chest",
      "secondary": [
        "triceps",
        "shoulders"
      ],
      "equipment": "machine",
      "movement": "Incline press",
      "reps": "8–12",
      "cue": "Keep your chest tall and press up and slightly inward while your shoulders stay down.",
      "videoQuery": "incline machine chest press proper form"
    },
    {
      "id": "incline-dumbbell-press",
      "name": "Incline Dumbbell Press",
      "split": "push",
      "primary": "chest",
      "emphasis": "upper chest",
      "secondary": [
        "triceps",
        "shoulders"
      ],
      "equipment": "dumbbell",
      "movement": "Incline press",
      "reps": "8–12",
      "cue": "Use a modest bench angle, lower with control, and keep your forearms nearly vertical.",
      "videoQuery": "incline dumbbell press proper form"
    },
    {
      "id": "cable-chest-fly",
      "name": "Standing Cable Fly",
      "split": "push",
      "primary": "chest",
      "emphasis": "shortened-position chest",
      "secondary": [
        "shoulders"
      ],
      "equipment": "cable",
      "movement": "Fly / adduction",
      "reps": "10–15",
      "cue": "Keep a soft bend in your elbows and bring your upper arms across your torso without shrugging.",
      "videoQuery": "standing cable chest fly proper form"
    },
    {
      "id": "high-to-low-cable-fly",
      "name": "High-to-Low Cable Fly",
      "split": "push",
      "primary": "chest",
      "emphasis": "lower chest",
      "secondary": [
        "shoulders"
      ],
      "equipment": "cable",
      "movement": "Decline fly",
      "reps": "10–15",
      "cue": "Sweep the handles down toward your lower ribs while keeping your torso still.",
      "videoQuery": "high to low cable fly proper form"
    },
    {
      "id": "push-up",
      "name": "Controlled Push-Up",
      "split": "push",
      "primary": "chest",
      "emphasis": "overall chest",
      "secondary": [
        "triceps",
        "shoulders",
        "core"
      ],
      "equipment": "bodyweight",
      "movement": "Horizontal press",
      "reps": "8–15",
      "cue": "Keep a straight line from shoulders to heels and lower your chest under control.",
      "videoQuery": "push up proper form chest"
    },
    {
      "id": "machine-shoulder-press",
      "name": "Machine Shoulder Press",
      "split": "push",
      "primary": "shoulders",
      "emphasis": "front deltoid",
      "secondary": [
        "triceps"
      ],
      "equipment": "machine",
      "movement": "Vertical press",
      "reps": "8–12",
      "cue": "Keep your ribs down and press smoothly without forcing a painful range overhead.",
      "videoQuery": "machine shoulder press proper form"
    },
    {
      "id": "dumbbell-shoulder-press",
      "name": "Seated Dumbbell Shoulder Press",
      "split": "push",
      "primary": "shoulders",
      "emphasis": "front and side deltoids",
      "secondary": [
        "triceps"
      ],
      "equipment": "dumbbell",
      "movement": "Vertical press",
      "reps": "8–12",
      "cue": "Brace your torso and press the dumbbells up without arching your lower back.",
      "videoQuery": "seated dumbbell shoulder press proper form"
    },
    {
      "id": "machine-lateral-raise",
      "name": "Machine Lateral Raise",
      "split": "push",
      "primary": "shoulders",
      "emphasis": "side deltoid",
      "secondary": [],
      "equipment": "machine",
      "movement": "Lateral raise",
      "reps": "10–15",
      "cue": "Lead with your elbows and stop near shoulder height without shrugging.",
      "videoQuery": "machine lateral raise proper form"
    },
    {
      "id": "cable-lateral-raise",
      "name": "Single-Arm Cable Lateral Raise",
      "split": "push",
      "primary": "shoulders",
      "emphasis": "side deltoid",
      "secondary": [],
      "equipment": "cable",
      "movement": "Lateral raise",
      "reps": "10–15",
      "cue": "Move slowly from the shoulder and keep the torso quiet throughout the raise.",
      "videoQuery": "single arm cable lateral raise proper form"
    },
    {
      "id": "dumbbell-lateral-raise",
      "name": "Dumbbell Lateral Raise",
      "split": "push",
      "primary": "shoulders",
      "emphasis": "side deltoid",
      "secondary": [],
      "equipment": "dumbbell",
      "movement": "Lateral raise",
      "reps": "10–15",
      "cue": "Use a light weight, maintain a soft elbow bend, and avoid swinging.",
      "videoQuery": "dumbbell lateral raise proper form"
    },
    {
      "id": "rope-pushdown",
      "name": "Rope Triceps Pushdown",
      "split": "push",
      "primary": "triceps",
      "emphasis": "lateral-head emphasis",
      "secondary": [],
      "equipment": "cable",
      "movement": "Elbow extension",
      "reps": "10–15",
      "cue": "Pin your elbows near your sides and separate the rope at the bottom.",
      "videoQuery": "rope triceps pushdown proper form"
    },
    {
      "id": "overhead-rope-extension",
      "name": "Overhead Rope Extension",
      "split": "push",
      "primary": "triceps",
      "emphasis": "long-head emphasis",
      "secondary": [],
      "equipment": "cable",
      "movement": "Overhead elbow extension",
      "reps": "10–15",
      "cue": "Keep your upper arms steady and allow a comfortable stretch behind your head.",
      "videoQuery": "overhead rope triceps extension proper form"
    },
    {
      "id": "reverse-grip-pushdown",
      "name": "Reverse-Grip Cable Pushdown",
      "split": "push",
      "primary": "triceps",
      "emphasis": "medial-head emphasis",
      "secondary": [],
      "equipment": "cable",
      "movement": "Supinated elbow extension",
      "reps": "10–15",
      "cue": "Use a lighter load and keep your wrists neutral as your elbows straighten.",
      "videoQuery": "reverse grip triceps pushdown proper form"
    },
    {
      "id": "dumbbell-overhead-extension",
      "name": "Dumbbell Overhead Triceps Extension",
      "split": "push",
      "primary": "triceps",
      "emphasis": "long-head emphasis",
      "secondary": [],
      "equipment": "dumbbell",
      "movement": "Overhead elbow extension",
      "reps": "10–15",
      "cue": "Keep your ribs down and move only at the elbows through a comfortable range.",
      "videoQuery": "dumbbell overhead triceps extension proper form"
    },
    {
      "id": "assisted-dip-machine",
      "name": "Assisted Dip Machine",
      "split": "push",
      "primary": "triceps",
      "emphasis": "overall triceps",
      "secondary": [
        "chest",
        "shoulders"
      ],
      "equipment": "machine",
      "movement": "Compound press",
      "reps": "8–12",
      "cue": "Keep your shoulders down and use assistance that lets you control the entire repetition.",
      "videoQuery": "assisted dip machine proper form triceps"
    },
    {
      "id": "neutral-grip-lat-pulldown",
      "name": "Neutral-Grip Lat Pulldown",
      "split": "pull",
      "primary": "back",
      "emphasis": "lat width",
      "secondary": [
        "biceps",
        "shoulders"
      ],
      "equipment": "cable",
      "movement": "Vertical pull",
      "reps": "8–12",
      "cue": "Drive your elbows toward your ribs and avoid turning the movement into a backward lean.",
      "videoQuery": "neutral grip lat pulldown proper form"
    },
    {
      "id": "wide-grip-lat-pulldown",
      "name": "Wide-Grip Lat Pulldown",
      "split": "pull",
      "primary": "back",
      "emphasis": "upper-lat width",
      "secondary": [
        "biceps",
        "shoulders"
      ],
      "equipment": "cable",
      "movement": "Vertical pull",
      "reps": "8–12",
      "cue": "Pull toward your upper chest with controlled elbows and never behind your neck.",
      "videoQuery": "wide grip lat pulldown proper form"
    },
    {
      "id": "machine-high-row",
      "name": "Machine High Row",
      "split": "pull",
      "primary": "back",
      "emphasis": "upper back and lats",
      "secondary": [
        "biceps",
        "shoulders"
      ],
      "equipment": "machine",
      "movement": "Diagonal pull",
      "reps": "8–12",
      "cue": "Keep your chest supported and pull your elbows down and back without shrugging.",
      "videoQuery": "machine high row proper form"
    },
    {
      "id": "seated-cable-row",
      "name": "Seated Cable Row",
      "split": "pull",
      "primary": "back",
      "emphasis": "middle-back thickness",
      "secondary": [
        "biceps",
        "shoulders"
      ],
      "equipment": "cable",
      "movement": "Horizontal pull",
      "reps": "8–12",
      "cue": "Stay tall and pull toward your lower ribs without rocking your torso.",
      "videoQuery": "seated cable row proper form"
    },
    {
      "id": "chest-supported-machine-row",
      "name": "Chest-Supported Machine Row",
      "split": "pull",
      "primary": "back",
      "emphasis": "middle-back thickness",
      "secondary": [
        "biceps",
        "shoulders"
      ],
      "equipment": "machine",
      "movement": "Horizontal pull",
      "reps": "8–12",
      "cue": "Keep your chest on the pad and draw your shoulder blades back without jerking.",
      "videoQuery": "chest supported machine row proper form"
    },
    {
      "id": "single-arm-dumbbell-row",
      "name": "Single-Arm Dumbbell Row",
      "split": "pull",
      "primary": "back",
      "emphasis": "lat and middle back",
      "secondary": [
        "biceps",
        "forearms"
      ],
      "equipment": "dumbbell",
      "movement": "Single-arm row",
      "reps": "8–12",
      "cue": "Brace your torso and pull your elbow toward your hip without twisting.",
      "videoQuery": "single arm dumbbell row proper form"
    },
    {
      "id": "straight-arm-pulldown",
      "name": "Straight-Arm Cable Pulldown",
      "split": "pull",
      "primary": "back",
      "emphasis": "lat isolation",
      "secondary": [
        "core"
      ],
      "equipment": "cable",
      "movement": "Shoulder extension",
      "reps": "10–15",
      "cue": "Keep your arms nearly straight and pull from your shoulders rather than your triceps.",
      "videoQuery": "straight arm cable pulldown proper form"
    },
    {
      "id": "reverse-pec-deck",
      "name": "Reverse Pec Deck",
      "split": "pull",
      "primary": "shoulders",
      "emphasis": "rear deltoid",
      "secondary": [
        "back"
      ],
      "equipment": "machine",
      "movement": "Reverse fly",
      "reps": "10–15",
      "cue": "Keep your chest on the pad and sweep your arms back without shrugging.",
      "videoQuery": "reverse pec deck rear delt proper form"
    },
    {
      "id": "cable-rear-delt-fly",
      "name": "Cable Rear-Delt Fly",
      "split": "pull",
      "primary": "shoulders",
      "emphasis": "rear deltoid",
      "secondary": [
        "back"
      ],
      "equipment": "cable",
      "movement": "Reverse fly",
      "reps": "10–15",
      "cue": "Use a light load and move from the shoulders while your torso remains still.",
      "videoQuery": "cable rear delt fly proper form"
    },
    {
      "id": "face-pull",
      "name": "Rope Face Pull",
      "split": "pull",
      "primary": "shoulders",
      "emphasis": "rear deltoid and external rotation",
      "secondary": [
        "back"
      ],
      "equipment": "cable",
      "movement": "High pull",
      "reps": "12–15",
      "cue": "Pull the rope toward eye level and finish with your hands apart.",
      "videoQuery": "rope face pull proper form"
    },
    {
      "id": "incline-dumbbell-curl",
      "name": "Incline Dumbbell Curl",
      "split": "pull",
      "primary": "biceps",
      "emphasis": "long-head emphasis",
      "secondary": [
        "forearms"
      ],
      "equipment": "dumbbell",
      "movement": "Supinated curl",
      "reps": "8–12",
      "cue": "Let your arms hang behind your torso and curl without moving your shoulders forward.",
      "videoQuery": "incline dumbbell curl proper form"
    },
    {
      "id": "machine-preacher-curl",
      "name": "Machine Preacher Curl",
      "split": "pull",
      "primary": "biceps",
      "emphasis": "short-head emphasis",
      "secondary": [
        "forearms"
      ],
      "equipment": "machine",
      "movement": "Supported curl",
      "reps": "8–12",
      "cue": "Keep your upper arms on the pad and stop before your elbows become uncomfortable.",
      "videoQuery": "machine preacher curl proper form"
    },
    {
      "id": "cable-curl",
      "name": "Standing Cable Curl",
      "split": "pull",
      "primary": "biceps",
      "emphasis": "overall biceps",
      "secondary": [
        "forearms"
      ],
      "equipment": "cable",
      "movement": "Cable curl",
      "reps": "8–12",
      "cue": "Keep your elbows near your sides and curl without leaning backward.",
      "videoQuery": "standing cable curl proper form"
    },
    {
      "id": "hammer-curl",
      "name": "Dumbbell Hammer Curl",
      "split": "pull",
      "primary": "biceps",
      "emphasis": "brachialis emphasis",
      "secondary": [
        "forearms"
      ],
      "equipment": "dumbbell",
      "movement": "Neutral-grip curl",
      "reps": "8–12",
      "cue": "Keep your palms facing inward and avoid swinging the dumbbells.",
      "videoQuery": "dumbbell hammer curl proper form"
    },
    {
      "id": "rope-hammer-curl",
      "name": "Rope Hammer Curl",
      "split": "pull",
      "primary": "biceps",
      "emphasis": "brachialis emphasis",
      "secondary": [
        "forearms"
      ],
      "equipment": "cable",
      "movement": "Neutral-grip curl",
      "reps": "10–15",
      "cue": "Keep your upper arms still and separate the rope slightly near the top.",
      "videoQuery": "rope hammer curl proper form"
    },
    {
      "id": "wrist-curl",
      "name": "Dumbbell Wrist Curl",
      "split": "pull",
      "primary": "forearms",
      "emphasis": "wrist flexors",
      "secondary": [],
      "equipment": "dumbbell",
      "movement": "Wrist flexion",
      "reps": "12–20",
      "cue": "Support your forearms and move only at the wrists through a controlled range.",
      "videoQuery": "dumbbell wrist curl proper form"
    },
    {
      "id": "reverse-wrist-curl",
      "name": "Reverse Dumbbell Wrist Curl",
      "split": "pull",
      "primary": "forearms",
      "emphasis": "wrist extensors",
      "secondary": [],
      "equipment": "dumbbell",
      "movement": "Wrist extension",
      "reps": "12–20",
      "cue": "Use a light load and keep your forearms supported while lifting the backs of your hands.",
      "videoQuery": "reverse dumbbell wrist curl proper form"
    },
    {
      "id": "farmers-carry",
      "name": "Dumbbell Farmer's Carry",
      "split": "pull",
      "primary": "forearms",
      "emphasis": "grip",
      "secondary": [
        "core",
        "shoulders"
      ],
      "equipment": "dumbbell",
      "movement": "Loaded carry",
      "reps": "30–45 sec",
      "cue": "Stand tall, keep your ribs stacked, and walk without letting the weights swing.",
      "videoQuery": "dumbbell farmers carry proper form"
    },
    {
      "id": "leg-press",
      "name": "Leg Press",
      "split": "legs",
      "primary": "quads",
      "emphasis": "overall quadriceps",
      "secondary": [
        "glutes",
        "hamstrings"
      ],
      "equipment": "machine",
      "movement": "Compound knee extension",
      "reps": "8–12",
      "cue": "Keep your feet flat and lower only as far as your pelvis stays stable on the pad.",
      "videoQuery": "leg press proper form"
    },
    {
      "id": "smith-squat",
      "name": "Smith Machine Squat",
      "split": "legs",
      "primary": "quads",
      "emphasis": "overall quadriceps",
      "secondary": [
        "glutes",
        "hamstrings",
        "core"
      ],
      "equipment": "smith",
      "movement": "Squat",
      "reps": "8–12",
      "cue": "Use a stance that lets your knees track with your toes and keep the movement controlled.",
      "videoQuery": "smith machine squat proper form"
    },
    {
      "id": "goblet-squat",
      "name": "Dumbbell Goblet Squat",
      "split": "legs",
      "primary": "quads",
      "emphasis": "deep knee flexion",
      "secondary": [
        "glutes",
        "core"
      ],
      "equipment": "dumbbell",
      "movement": "Squat",
      "reps": "8–12",
      "cue": "Hold the dumbbell close to your chest and sit between your hips while your feet stay planted.",
      "videoQuery": "dumbbell goblet squat proper form"
    },
    {
      "id": "leg-extension",
      "name": "Leg Extension",
      "split": "legs",
      "primary": "quads",
      "emphasis": "shortened-position quadriceps",
      "secondary": [],
      "equipment": "machine",
      "movement": "Knee extension",
      "reps": "10–15",
      "cue": "Align your knee with the machine pivot and lift smoothly without kicking.",
      "videoQuery": "leg extension machine proper form"
    },
    {
      "id": "split-squat",
      "name": "Dumbbell Split Squat",
      "split": "legs",
      "primary": "quads",
      "emphasis": "unilateral quadriceps",
      "secondary": [
        "glutes",
        "hamstrings",
        "core"
      ],
      "equipment": "dumbbell",
      "movement": "Single-leg squat",
      "reps": "8–12 each",
      "cue": "Keep most of your pressure on the front foot and lower straight down with control.",
      "videoQuery": "dumbbell split squat proper form"
    },
    {
      "id": "seated-leg-curl",
      "name": "Seated Leg Curl",
      "split": "legs",
      "primary": "hamstrings",
      "emphasis": "lengthened hamstrings",
      "secondary": [],
      "equipment": "machine",
      "movement": "Knee flexion",
      "reps": "8–12",
      "cue": "Keep your hips against the pad and curl without lifting your thighs.",
      "videoQuery": "seated leg curl proper form"
    },
    {
      "id": "lying-leg-curl",
      "name": "Lying Leg Curl",
      "split": "legs",
      "primary": "hamstrings",
      "emphasis": "knee-flexion hamstrings",
      "secondary": [],
      "equipment": "machine",
      "movement": "Knee flexion",
      "reps": "8–12",
      "cue": "Keep your hips down and curl smoothly without arching your lower back.",
      "videoQuery": "lying leg curl proper form"
    },
    {
      "id": "dumbbell-romanian-deadlift",
      "name": "Dumbbell Romanian Deadlift",
      "split": "legs",
      "primary": "hamstrings",
      "emphasis": "hip-hinge hamstrings",
      "secondary": [
        "glutes",
        "back",
        "forearms"
      ],
      "equipment": "dumbbell",
      "movement": "Hip hinge",
      "reps": "8–12",
      "cue": "Push your hips back while the dumbbells stay close to your legs and your spine remains neutral.",
      "videoQuery": "dumbbell Romanian deadlift proper form"
    },
    {
      "id": "smith-romanian-deadlift",
      "name": "Smith Machine Romanian Deadlift",
      "split": "legs",
      "primary": "hamstrings",
      "emphasis": "hip-hinge hamstrings",
      "secondary": [
        "glutes",
        "back"
      ],
      "equipment": "smith",
      "movement": "Hip hinge",
      "reps": "8–12",
      "cue": "Keep the bar close, soften your knees, and hinge until you feel a controlled hamstring stretch.",
      "videoQuery": "smith machine Romanian deadlift proper form"
    },
    {
      "id": "machine-hip-thrust",
      "name": "Hip Thrust Machine",
      "split": "legs",
      "primary": "glutes",
      "emphasis": "shortened-position glutes",
      "secondary": [
        "hamstrings"
      ],
      "equipment": "machine",
      "movement": "Hip extension",
      "reps": "8–12",
      "cue": "Finish by squeezing your glutes without overextending your lower back.",
      "videoQuery": "hip thrust machine proper form"
    },
    {
      "id": "smith-hip-thrust",
      "name": "Smith Machine Hip Thrust",
      "split": "legs",
      "primary": "glutes",
      "emphasis": "shortened-position glutes",
      "secondary": [
        "hamstrings",
        "core"
      ],
      "equipment": "smith",
      "movement": "Hip extension",
      "reps": "8–12",
      "cue": "Keep your chin tucked and finish with your ribs down as your hips rise.",
      "videoQuery": "smith machine hip thrust proper form"
    },
    {
      "id": "cable-pull-through",
      "name": "Cable Pull-Through",
      "split": "legs",
      "primary": "glutes",
      "emphasis": "hip-hinge glutes",
      "secondary": [
        "hamstrings",
        "core"
      ],
      "equipment": "cable",
      "movement": "Hip hinge",
      "reps": "10–15",
      "cue": "Let your hips travel back, then stand by squeezing your glutes—not by leaning backward.",
      "videoQuery": "cable pull through proper form"
    },
    {
      "id": "machine-hip-abduction",
      "name": "Hip Abduction Machine",
      "split": "legs",
      "primary": "glutes",
      "emphasis": "glute medius",
      "secondary": [],
      "equipment": "machine",
      "movement": "Hip abduction",
      "reps": "12–20",
      "cue": "Keep your torso steady and open your knees without bouncing the stack.",
      "videoQuery": "hip abduction machine proper form"
    },
    {
      "id": "standing-calf-raise",
      "name": "Standing Calf Raise Machine",
      "split": "legs",
      "primary": "calves",
      "emphasis": "gastrocnemius",
      "secondary": [],
      "equipment": "machine",
      "movement": "Straight-knee calf raise",
      "reps": "10–15",
      "cue": "Pause at the stretched bottom and rise onto the balls of your feet without bouncing.",
      "videoQuery": "standing calf raise machine proper form"
    },
    {
      "id": "seated-calf-raise",
      "name": "Seated Calf Raise",
      "split": "legs",
      "primary": "calves",
      "emphasis": "soleus",
      "secondary": [],
      "equipment": "machine",
      "movement": "Bent-knee calf raise",
      "reps": "12–20",
      "cue": "Use a full comfortable range and pause briefly at the top and bottom.",
      "videoQuery": "seated calf raise proper form"
    },
    {
      "id": "leg-press-calf-raise",
      "name": "Leg Press Calf Raise",
      "split": "legs",
      "primary": "calves",
      "emphasis": "gastrocnemius",
      "secondary": [],
      "equipment": "machine",
      "movement": "Calf press",
      "reps": "12–20",
      "cue": "Move only through your ankles and keep a slight softness in your knees.",
      "videoQuery": "leg press calf raise proper form"
    },
    {
      "id": "cable-crunch",
      "name": "Kneeling Cable Crunch",
      "split": "legs",
      "primary": "core",
      "emphasis": "rectus abdominis",
      "secondary": [],
      "equipment": "cable",
      "movement": "Spinal flexion",
      "reps": "10–15",
      "cue": "Curl your ribs toward your pelvis without turning the movement into a hip hinge.",
      "videoQuery": "kneeling cable crunch proper form"
    },
    {
      "id": "pallof-press",
      "name": "Cable Pallof Press",
      "split": "legs",
      "primary": "core",
      "emphasis": "anti-rotation",
      "secondary": [
        "shoulders"
      ],
      "equipment": "cable",
      "movement": "Anti-rotation press",
      "reps": "10–12 each",
      "cue": "Press straight out while resisting the cable's attempt to rotate your torso.",
      "videoQuery": "cable Pallof press proper form"
    },
    {
      "id": "dead-bug",
      "name": "Dead Bug",
      "split": "legs",
      "primary": "core",
      "emphasis": "deep core control",
      "secondary": [],
      "equipment": "bodyweight",
      "movement": "Anti-extension",
      "reps": "8–12 each",
      "cue": "Keep your lower back gently against the floor as opposite limbs extend.",
      "videoQuery": "dead bug exercise proper form"
    },
    {
      "id": "plank",
      "name": "Front Plank",
      "split": "legs",
      "primary": "core",
      "emphasis": "anti-extension endurance",
      "secondary": [
        "shoulders",
        "glutes"
      ],
      "equipment": "bodyweight",
      "movement": "Isometric brace",
      "reps": "20–45 sec",
      "cue": "Brace as if preparing for a punch and keep your ribs and pelvis stacked.",
      "videoQuery": "front plank proper form"
    },
    {
      "id": "incline-push-up",
      "name": "Incline Push-Up",
      "split": "push",
      "primary": "chest",
      "emphasis": "overall chest",
      "secondary": [
        "triceps",
        "shoulders",
        "core"
      ],
      "equipment": "bodyweight",
      "movement": "Horizontal press",
      "reps": "10–20",
      "cue": "Use a stable bench or rail, keep your body straight, and lower your chest with control.",
      "videoQuery": "incline push up proper form"
    },
    {
      "id": "pike-push-up",
      "name": "Pike Push-Up",
      "split": "push",
      "primary": "shoulders",
      "emphasis": "front deltoid",
      "secondary": [
        "triceps",
        "core"
      ],
      "equipment": "bodyweight",
      "movement": "Vertical press",
      "reps": "6–12",
      "cue": "Keep your hips high and lower the crown of your head between your hands without collapsing your shoulders.",
      "videoQuery": "pike push up proper form"
    },
    {
      "id": "close-grip-push-up",
      "name": "Close-Grip Push-Up",
      "split": "push",
      "primary": "triceps",
      "emphasis": "overall triceps",
      "secondary": [
        "chest",
        "shoulders",
        "core"
      ],
      "equipment": "bodyweight",
      "movement": "Close-grip press",
      "reps": "8–15",
      "cue": "Keep your elbows close to your torso and maintain a straight line from shoulders to heels.",
      "videoQuery": "close grip push up triceps proper form"
    },
    {
      "id": "trx-chest-press",
      "name": "TRX Chest Press",
      "split": "push",
      "primary": "chest",
      "emphasis": "middle chest",
      "secondary": [
        "triceps",
        "shoulders",
        "core"
      ],
      "equipment": "trx",
      "movement": "Suspension press",
      "reps": "8–15",
      "cue": "Keep your body rigid, lower your chest between the handles, and adjust foot position to control difficulty.",
      "videoQuery": "TRX chest press proper form"
    },
    {
      "id": "trx-push-up",
      "name": "TRX Push-Up",
      "split": "push",
      "primary": "chest",
      "emphasis": "stability chest",
      "secondary": [
        "triceps",
        "shoulders",
        "core"
      ],
      "equipment": "trx",
      "movement": "Suspended push-up",
      "reps": "6–12",
      "cue": "Brace your trunk and keep the straps steady while lowering through a comfortable range.",
      "videoQuery": "TRX suspended push up proper form"
    },
    {
      "id": "trx-y-raise",
      "name": "TRX Y Raise",
      "split": "push",
      "primary": "shoulders",
      "emphasis": "front and side deltoids",
      "secondary": [
        "back",
        "core"
      ],
      "equipment": "trx",
      "movement": "Suspension raise",
      "reps": "10–15",
      "cue": "Lean back under control and raise your straight arms into a Y without shrugging.",
      "videoQuery": "TRX Y raise proper form"
    },
    {
      "id": "trx-triceps-extension",
      "name": "TRX Triceps Extension",
      "split": "push",
      "primary": "triceps",
      "emphasis": "long-head emphasis",
      "secondary": [
        "shoulders",
        "core"
      ],
      "equipment": "trx",
      "movement": "Suspension elbow extension",
      "reps": "8–15",
      "cue": "Keep your upper arms aimed forward and straighten your elbows while your body stays rigid.",
      "videoQuery": "TRX triceps extension proper form"
    },
    {
      "id": "dumbbell-floor-press",
      "name": "Dumbbell Floor Press",
      "split": "push",
      "primary": "chest",
      "emphasis": "middle chest",
      "secondary": [
        "triceps",
        "shoulders"
      ],
      "equipment": "dumbbell",
      "movement": "Horizontal press",
      "reps": "8–12",
      "cue": "Lower until your upper arms gently contact the floor, pause, and press without bouncing.",
      "videoQuery": "dumbbell floor press proper form"
    },
    {
      "id": "dumbbell-triceps-kickback",
      "name": "Dumbbell Triceps Kickback",
      "split": "push",
      "primary": "triceps",
      "emphasis": "lateral-head emphasis",
      "secondary": [],
      "equipment": "dumbbell",
      "movement": "Elbow extension",
      "reps": "10–15",
      "cue": "Hold your upper arm still beside your torso and straighten the elbow without swinging.",
      "videoQuery": "dumbbell triceps kickback proper form"
    },
    {
      "id": "pull-up",
      "name": "Pull-Up",
      "split": "pull",
      "primary": "back",
      "emphasis": "lat width",
      "secondary": [
        "biceps",
        "forearms",
        "shoulders"
      ],
      "equipment": "bodyweight",
      "movement": "Vertical pull",
      "reps": "5–10",
      "cue": "Begin from a controlled hang, pull your elbows toward your ribs, and avoid kicking or swinging.",
      "videoQuery": "pull up proper form beginner"
    },
    {
      "id": "chin-up",
      "name": "Chin-Up",
      "split": "pull",
      "primary": "biceps",
      "emphasis": "short-head emphasis",
      "secondary": [
        "back",
        "forearms"
      ],
      "equipment": "bodyweight",
      "movement": "Supinated vertical pull",
      "reps": "5–10",
      "cue": "Use an underhand grip, keep your ribs controlled, and pull without swinging.",
      "videoQuery": "chin up proper form"
    },
    {
      "id": "scapular-pull-up",
      "name": "Scapular Pull-Up",
      "split": "pull",
      "primary": "back",
      "emphasis": "scapular control",
      "secondary": [
        "shoulders",
        "forearms"
      ],
      "equipment": "bodyweight",
      "movement": "Scapular depression",
      "reps": "8–15",
      "cue": "Keep your elbows straight and pull your shoulders down away from your ears before returning slowly.",
      "videoQuery": "scapular pull up proper form"
    },
    {
      "id": "prone-reverse-snow-angel",
      "name": "Prone Reverse Snow Angel",
      "split": "pull",
      "primary": "shoulders",
      "emphasis": "rear deltoid",
      "secondary": [
        "back"
      ],
      "equipment": "bodyweight",
      "movement": "Prone shoulder sweep",
      "reps": "10–15",
      "cue": "Lie face down, keep your ribs grounded, and sweep your arms slowly without forcing the range.",
      "videoQuery": "prone reverse snow angel exercise proper form"
    },
    {
      "id": "dead-hang",
      "name": "Controlled Dead Hang",
      "split": "pull",
      "primary": "forearms",
      "emphasis": "grip endurance",
      "secondary": [
        "back",
        "shoulders"
      ],
      "equipment": "bodyweight",
      "movement": "Isometric hang",
      "reps": "15–45 sec",
      "cue": "Use a secure bar, keep a light active shoulder position, and stop before your grip suddenly fails.",
      "videoQuery": "active dead hang proper form"
    },
    {
      "id": "trx-low-row",
      "name": "TRX Low Row",
      "split": "pull",
      "primary": "back",
      "emphasis": "middle-back thickness",
      "secondary": [
        "biceps",
        "forearms",
        "shoulders"
      ],
      "equipment": "trx",
      "movement": "Suspension row",
      "reps": "8–15",
      "cue": "Keep your body straight and pull the handles toward your lower ribs without shrugging.",
      "videoQuery": "TRX low row proper form"
    },
    {
      "id": "trx-high-row",
      "name": "TRX High Row",
      "split": "pull",
      "primary": "back",
      "emphasis": "upper-back thickness",
      "secondary": [
        "biceps",
        "shoulders"
      ],
      "equipment": "trx",
      "movement": "High suspension row",
      "reps": "8–15",
      "cue": "Pull your elbows outward toward shoulder level while keeping your body rigid.",
      "videoQuery": "TRX high row proper form"
    },
    {
      "id": "trx-reverse-fly",
      "name": "TRX Reverse Fly",
      "split": "pull",
      "primary": "shoulders",
      "emphasis": "rear deltoid",
      "secondary": [
        "back",
        "core"
      ],
      "equipment": "trx",
      "movement": "Suspension reverse fly",
      "reps": "10–15",
      "cue": "Use a modest lean and open your arms under control without letting the straps go slack.",
      "videoQuery": "TRX reverse fly proper form"
    },
    {
      "id": "trx-biceps-curl",
      "name": "TRX Biceps Curl",
      "split": "pull",
      "primary": "biceps",
      "emphasis": "short-head emphasis",
      "secondary": [
        "forearms",
        "core"
      ],
      "equipment": "trx",
      "movement": "Suspension curl",
      "reps": "8–15",
      "cue": "Keep your upper arms high and curl your hands toward your forehead without bending at the hips.",
      "videoQuery": "TRX biceps curl proper form"
    },
    {
      "id": "trx-power-pull",
      "name": "TRX Power Pull",
      "split": "pull",
      "primary": "back",
      "emphasis": "single-arm thickness",
      "secondary": [
        "biceps",
        "shoulders",
        "core"
      ],
      "equipment": "trx",
      "movement": "Rotational row",
      "reps": "8–12 each",
      "cue": "Rotate under control, then drive your elbow back while your feet stay planted.",
      "videoQuery": "TRX power pull proper form"
    },
    {
      "id": "machine-pullover",
      "name": "Machine Pullover",
      "split": "pull",
      "primary": "back",
      "emphasis": "lat width",
      "secondary": [
        "triceps"
      ],
      "equipment": "machine",
      "movement": "Shoulder extension",
      "reps": "8–12",
      "cue": "Keep your ribs down and drive the pads or handles downward using your lats rather than your arms.",
      "videoQuery": "machine pullover proper form"
    },
    {
      "id": "machine-biceps-curl",
      "name": "Machine Biceps Curl",
      "split": "pull",
      "primary": "biceps",
      "emphasis": "overall biceps",
      "secondary": [
        "forearms"
      ],
      "equipment": "machine",
      "movement": "Elbow flexion",
      "reps": "8–12",
      "cue": "Keep your upper arms supported and curl through a controlled range without lifting your shoulders.",
      "videoQuery": "machine biceps curl proper form"
    },
    {
      "id": "bodyweight-squat",
      "name": "Bodyweight Squat",
      "split": "legs",
      "primary": "quads",
      "emphasis": "overall quadriceps",
      "secondary": [
        "glutes",
        "hamstrings",
        "core"
      ],
      "equipment": "bodyweight",
      "movement": "Squat",
      "reps": "12–20",
      "cue": "Keep your whole foot planted and sit between your hips while your knees track over your toes.",
      "videoQuery": "bodyweight squat proper form"
    },
    {
      "id": "reverse-lunge",
      "name": "Bodyweight Reverse Lunge",
      "split": "legs",
      "primary": "quads",
      "emphasis": "single-leg quadriceps",
      "secondary": [
        "glutes",
        "hamstrings",
        "core"
      ],
      "equipment": "bodyweight",
      "movement": "Lunge",
      "reps": "8–15 each",
      "cue": "Step back softly, keep your front foot flat, and push through the front leg to return.",
      "videoQuery": "bodyweight reverse lunge proper form"
    },
    {
      "id": "single-leg-glute-bridge",
      "name": "Single-Leg Glute Bridge",
      "split": "legs",
      "primary": "glutes",
      "emphasis": "glute max",
      "secondary": [
        "hamstrings",
        "core"
      ],
      "equipment": "bodyweight",
      "movement": "Hip extension",
      "reps": "8–15 each",
      "cue": "Keep your ribs down and lift by squeezing the working glute rather than arching your back.",
      "videoQuery": "single leg glute bridge proper form"
    },
    {
      "id": "walkout-hamstring-curl",
      "name": "Glute Bridge Walkout",
      "split": "legs",
      "primary": "hamstrings",
      "emphasis": "lengthened hamstrings",
      "secondary": [
        "glutes",
        "core"
      ],
      "equipment": "bodyweight",
      "movement": "Hamstring walkout",
      "reps": "6–12",
      "cue": "Hold your hips up and take small heel steps away and back without losing pelvic control.",
      "videoQuery": "glute bridge hamstring walkout proper form"
    },
    {
      "id": "single-leg-calf-raise",
      "name": "Single-Leg Calf Raise",
      "split": "legs",
      "primary": "calves",
      "emphasis": "gastrocnemius",
      "secondary": [],
      "equipment": "bodyweight",
      "movement": "Straight-knee calf raise",
      "reps": "12–20 each",
      "cue": "Use support for balance, rise through the ball of the foot, and lower slowly.",
      "videoQuery": "single leg calf raise proper form"
    },
    {
      "id": "trx-squat",
      "name": "TRX Squat",
      "split": "legs",
      "primary": "quads",
      "emphasis": "overall quadriceps",
      "secondary": [
        "glutes",
        "hamstrings",
        "core"
      ],
      "equipment": "trx",
      "movement": "Assisted squat",
      "reps": "10–20",
      "cue": "Use the straps for balance rather than pulling yourself up, and keep your feet firmly planted.",
      "videoQuery": "TRX squat proper form"
    },
    {
      "id": "trx-reverse-lunge",
      "name": "TRX Reverse Lunge",
      "split": "legs",
      "primary": "quads",
      "emphasis": "single-leg quadriceps",
      "secondary": [
        "glutes",
        "hamstrings",
        "core"
      ],
      "equipment": "trx",
      "movement": "Assisted lunge",
      "reps": "8–15 each",
      "cue": "Hold the straps lightly, step back under control, and drive through the front foot.",
      "videoQuery": "TRX reverse lunge proper form"
    },
    {
      "id": "trx-hamstring-curl",
      "name": "TRX Hamstring Curl",
      "split": "legs",
      "primary": "hamstrings",
      "emphasis": "knee-flexion hamstrings",
      "secondary": [
        "glutes",
        "core"
      ],
      "equipment": "trx",
      "movement": "Suspended leg curl",
      "reps": "8–15",
      "cue": "Keep your hips lifted as you draw your heels toward you, then extend slowly.",
      "videoQuery": "TRX hamstring curl proper form"
    },
    {
      "id": "trx-hip-hinge",
      "name": "TRX Hip Hinge",
      "split": "legs",
      "primary": "hamstrings",
      "emphasis": "lengthened hamstrings",
      "secondary": [
        "glutes",
        "core"
      ],
      "equipment": "trx",
      "movement": "Assisted hip hinge",
      "reps": "10–15",
      "cue": "Push your hips backward with a long spine and use the straps only for balance.",
      "videoQuery": "TRX hip hinge proper form"
    },
    {
      "id": "trx-glute-bridge",
      "name": "TRX Glute Bridge",
      "split": "legs",
      "primary": "glutes",
      "emphasis": "glute max",
      "secondary": [
        "hamstrings",
        "core"
      ],
      "equipment": "trx",
      "movement": "Suspended hip extension",
      "reps": "10–15",
      "cue": "Press through your heels and lift your hips without overextending your lower back.",
      "videoQuery": "TRX glute bridge proper form"
    },
    {
      "id": "trx-calf-raise",
      "name": "TRX Calf Raise",
      "split": "legs",
      "primary": "calves",
      "emphasis": "gastrocnemius",
      "secondary": [],
      "equipment": "trx",
      "movement": "Supported calf raise",
      "reps": "12–20",
      "cue": "Use the straps for balance and move through the ankles with a slow controlled descent.",
      "videoQuery": "TRX calf raise proper form"
    },
    {
      "id": "trx-knee-tuck",
      "name": "TRX Knee Tuck",
      "split": "legs",
      "primary": "core",
      "emphasis": "anti-extension and hip flexion",
      "secondary": [
        "shoulders",
        "quads"
      ],
      "equipment": "trx",
      "movement": "Suspended knee tuck",
      "reps": "8–15",
      "cue": "Keep your shoulders stacked over your hands and draw your knees in without letting your lower back sag.",
      "videoQuery": "TRX knee tuck proper form"
    },
    {
      "id": "dumbbell-reverse-lunge",
      "name": "Dumbbell Reverse Lunge",
      "split": "legs",
      "primary": "quads",
      "emphasis": "single-leg quadriceps",
      "secondary": [
        "glutes",
        "hamstrings",
        "core"
      ],
      "equipment": "dumbbell",
      "movement": "Loaded lunge",
      "reps": "8–12 each",
      "cue": "Step back under control and keep the front foot flat while you stand through the front leg.",
      "videoQuery": "dumbbell reverse lunge proper form"
    },
    {
      "id": "dumbbell-hip-thrust",
      "name": "Dumbbell Hip Thrust",
      "split": "legs",
      "primary": "glutes",
      "emphasis": "glute max",
      "secondary": [
        "hamstrings",
        "core"
      ],
      "equipment": "dumbbell",
      "movement": "Hip extension",
      "reps": "8–15",
      "cue": "Keep your chin tucked and finish by squeezing your glutes rather than arching your back.",
      "videoQuery": "dumbbell hip thrust proper form"
    },
    {
      "id": "dumbbell-calf-raise",
      "name": "Dumbbell Standing Calf Raise",
      "split": "legs",
      "primary": "calves",
      "emphasis": "gastrocnemius",
      "secondary": [
        "forearms"
      ],
      "equipment": "dumbbell",
      "movement": "Loaded calf raise",
      "reps": "12–20",
      "cue": "Rise high through the balls of your feet and lower slowly without bouncing.",
      "videoQuery": "dumbbell standing calf raise proper form"
    },
    {
      "id": "dumbbell-side-bend",
      "name": "Dumbbell Suitcase Hold",
      "split": "legs",
      "primary": "core",
      "emphasis": "anti-lateral flexion",
      "secondary": [
        "forearms"
      ],
      "equipment": "dumbbell",
      "movement": "Loaded carry hold",
      "reps": "20–45 sec each",
      "cue": "Stand tall with one dumbbell and resist leaning toward or away from the weight.",
      "videoQuery": "dumbbell suitcase hold proper form"
    },
    {
      "id": "cable-hamstring-curl",
      "name": "Standing Cable Hamstring Curl",
      "split": "legs",
      "primary": "hamstrings",
      "emphasis": "knee-flexion hamstrings",
      "secondary": [],
      "equipment": "cable",
      "movement": "Standing leg curl",
      "reps": "10–15 each",
      "cue": "Keep your thigh still and curl your heel toward your glute without arching your back.",
      "videoQuery": "standing cable hamstring curl ankle strap proper form"
    },
    {
      "id": "cable-glute-kickback",
      "name": "Cable Glute Kickback",
      "split": "legs",
      "primary": "glutes",
      "emphasis": "glute max",
      "secondary": [
        "hamstrings",
        "core"
      ],
      "equipment": "cable",
      "movement": "Hip extension",
      "reps": "10–15 each",
      "cue": "Keep your pelvis square and extend the hip without swinging or arching your lower back.",
      "videoQuery": "cable glute kickback proper form"
    },
    {
      "id": "cable-calf-raise",
      "name": "Cable Standing Calf Raise",
      "split": "legs",
      "primary": "calves",
      "emphasis": "gastrocnemius",
      "secondary": [],
      "equipment": "cable",
      "movement": "Loaded calf raise",
      "reps": "12–20",
      "cue": "Use the cable for load and balance while moving slowly through the ankle.",
      "videoQuery": "cable standing calf raise proper form"
    },
    {
      "id": "cable-wood-chop",
      "name": "Cable Wood Chop",
      "split": "legs",
      "primary": "core",
      "emphasis": "rotation control",
      "secondary": [
        "shoulders",
        "glutes"
      ],
      "equipment": "cable",
      "movement": "Cable rotation",
      "reps": "10–15 each",
      "cue": "Rotate through your torso and hips together while keeping the movement smooth and controlled.",
      "videoQuery": "cable wood chop proper form"
    },
    {
      "id": "smith-flat-bench-press",
      "name": "Smith Machine Bench Press",
      "split": "push",
      "primary": "chest",
      "emphasis": "middle chest",
      "secondary": [
        "triceps",
        "shoulders"
      ],
      "equipment": "smith",
      "movement": "Horizontal press",
      "reps": "8–12",
      "cue": "Set the bench so the bar reaches your mid-chest, keep your shoulder blades back, and press without bouncing.",
      "videoQuery": "smith machine bench press proper form"
    },
    {
      "id": "smith-incline-bench-press",
      "name": "Smith Machine Incline Press",
      "split": "push",
      "primary": "chest",
      "emphasis": "upper chest",
      "secondary": [
        "triceps",
        "shoulders"
      ],
      "equipment": "smith",
      "movement": "Incline press",
      "reps": "8–12",
      "cue": "Use a modest incline, keep your chest tall, and lower the bar under control toward the upper chest.",
      "videoQuery": "smith machine incline bench press proper form"
    },
    {
      "id": "smith-shoulder-press",
      "name": "Smith Machine Shoulder Press",
      "split": "push",
      "primary": "shoulders",
      "emphasis": "front and side deltoids",
      "secondary": [
        "triceps"
      ],
      "equipment": "smith",
      "movement": "Vertical press",
      "reps": "8–12",
      "cue": "Keep your ribs down, use a comfortable grip, and stop if the fixed bar path causes shoulder pain.",
      "videoQuery": "smith machine shoulder press proper form"
    },
    {
      "id": "smith-close-grip-press",
      "name": "Smith Close-Grip Press",
      "split": "push",
      "primary": "triceps",
      "emphasis": "overall triceps",
      "secondary": [
        "chest",
        "shoulders"
      ],
      "equipment": "smith",
      "movement": "Close-grip press",
      "reps": "8–12",
      "cue": "Keep your hands just inside shoulder width, elbows controlled, and lower the bar smoothly.",
      "videoQuery": "smith machine close grip bench press triceps proper form"
    },
    {
      "id": "smith-inverted-row",
      "name": "Smith Inverted Row",
      "split": "pull",
      "primary": "back",
      "emphasis": "middle-back thickness",
      "secondary": [
        "biceps",
        "shoulders",
        "forearms"
      ],
      "equipment": "smith",
      "movement": "Horizontal pull",
      "reps": "8–15",
      "cue": "Keep your body in a straight line and pull your chest toward the secured bar without shrugging.",
      "videoQuery": "smith machine inverted row proper form"
    },
    {
      "id": "smith-bent-over-row",
      "name": "Smith Bent-Over Row",
      "split": "pull",
      "primary": "back",
      "emphasis": "middle-back thickness",
      "secondary": [
        "biceps",
        "forearms",
        "hamstrings"
      ],
      "equipment": "smith",
      "movement": "Bent-over row",
      "reps": "8–12",
      "cue": "Hinge with a long spine, keep the bar close, and pull toward your lower ribs without jerking.",
      "videoQuery": "smith machine bent over row proper form"
    },
    {
      "id": "smith-underhand-row",
      "name": "Smith Underhand Row",
      "split": "pull",
      "primary": "back",
      "emphasis": "lat and lower-back width",
      "secondary": [
        "biceps",
        "forearms"
      ],
      "equipment": "smith",
      "movement": "Underhand row",
      "reps": "8–12",
      "cue": "Use an underhand grip, keep your torso stable, and drive your elbows toward your hips.",
      "videoQuery": "smith machine underhand row proper form"
    },
    {
      "id": "smith-rear-delt-row",
      "name": "Smith Rear-Delt Row",
      "split": "pull",
      "primary": "shoulders",
      "emphasis": "rear deltoid",
      "secondary": [
        "back",
        "biceps"
      ],
      "equipment": "smith",
      "movement": "Wide-elbow row",
      "reps": "10–15",
      "cue": "Use a light load, pull with elbows wide, and keep your shoulders down as you target the rear delts.",
      "videoQuery": "smith machine rear delt row proper form"
    },
    {
      "id": "smith-drag-curl",
      "name": "Smith Machine Drag Curl",
      "split": "pull",
      "primary": "biceps",
      "emphasis": "long-head emphasis",
      "secondary": [
        "forearms"
      ],
      "equipment": "smith",
      "movement": "Elbow flexion",
      "reps": "10–15",
      "cue": "Drag the bar close to your torso while your elbows move slightly behind you; avoid leaning back.",
      "videoQuery": "smith machine drag curl proper form"
    },
    {
      "id": "smith-shrug",
      "name": "Smith Machine Shrug",
      "split": "pull",
      "primary": "back",
      "emphasis": "upper traps",
      "secondary": [
        "forearms"
      ],
      "equipment": "smith",
      "movement": "Scapular elevation",
      "reps": "10–15",
      "cue": "Lift your shoulders straight up, pause briefly, and avoid rolling them forward or backward.",
      "videoQuery": "smith machine shrug proper form"
    },
    {
      "id": "smith-standing-calf-raise",
      "name": "Smith Standing Calf Raise",
      "split": "legs",
      "primary": "calves",
      "emphasis": "gastrocnemius",
      "secondary": [
        "core"
      ],
      "equipment": "smith",
      "movement": "Calf raise",
      "reps": "10–20",
      "cue": "Use a stable platform, lower your heels under control, and rise through the balls of your feet.",
      "videoQuery": "smith machine standing calf raise proper form"
    },
    {
      "id": "smith-split-squat",
      "name": "Smith Split Squat",
      "split": "legs",
      "primary": "quads",
      "emphasis": "single-leg quadriceps",
      "secondary": [
        "glutes",
        "hamstrings",
        "core"
      ],
      "equipment": "smith",
      "movement": "Split squat",
      "reps": "8–12",
      "cue": "Use a stance that keeps you balanced, lower straight down, and keep the front knee tracking with the toes.",
      "videoQuery": "smith machine split squat proper form"
    }
  ]
};
