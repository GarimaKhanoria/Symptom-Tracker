const mongoose = require("mongoose")
const dotenv = require("dotenv")
const User = require("./models/User")
const SymptomCategory = require("./models/SymptomCategory")
const Symptom = require("./models/Symptom")

// Load env vars
dotenv.config()

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Initial data
const categories = [
  {
    name: "Behavioral",
    description: "Symptoms related to behavior and actions",
  },
  {
    name: "Emotional",
    description: "Symptoms related to emotions and feelings",
  },
  {
    name: "Physical",
    description: "Symptoms related to physical sensations and bodily functions",
  },
]

const createSymptoms = async () => {
  try {
    // Clear existing data
    await User.deleteMany()
    await SymptomCategory.deleteMany()
    await Symptom.deleteMany()

    console.log("Data cleared...")

    // Create admin user
    const admin = await User.create({
      fullName: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    })

    console.log("Admin user created...")

    // Create regular user
    const user = await User.create({
      fullName: "Test User",
      email: "user@example.com",
      password: "password123",
      dateOfBirth: "1990-01-01",
      gender: "male",
    })

    console.log("Regular user created...")

    // Create categories
    const createdCategories = await SymptomCategory.create(categories)
    console.log("Categories created...")

    // Map category names to IDs
    const categoryMap = {}
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id
    })

    // Create symptoms
    const symptoms = [
      {
        name: "Hyperactivity",
        description: "Excessive movement and restlessness",
        category: categoryMap["Behavioral"],
      },
      {
        name: "Impulsivity / acts without thinking",
        description: "Acting without considering consequences",
        category: categoryMap["Behavioral"],
      },
      {
        name: "Trouble paying attention / staying focused",
        description: "Difficulty maintaining focus on tasks",
        category: categoryMap["Behavioral"],
      },
      {
        name: "Forgetful / loses things",
        description: "Frequently misplacing items or forgetting important information",
        category: categoryMap["Behavioral"],
      },
      {
        name: "Anxiety / worry",
        description: "Excessive worry or nervousness",
        category: categoryMap["Emotional"],
      },
      {
        name: "Sad / moody",
        description: "Feelings of sadness or mood swings",
        category: categoryMap["Emotional"],
      },
      {
        name: "Irritable / angry",
        description: "Easily annoyed or prone to anger",
        category: categoryMap["Behavioral"],
      },
      {
        name: "Rude / cruel / hateful",
        description: "Displaying unkind behavior toward others",
        category: categoryMap["Behavioral"],
      },
      {
        name: "Tantrums",
        description: "Emotional outbursts",
        category: categoryMap["Behavioral"],
      },
      {
        name: "Physical aggression",
        description: "Physical actions toward others or objects",
        category: categoryMap["Behavioral"],
      },
      {
        name: "Disobedient / defiance",
        description: "Refusing to follow rules or directions",
        category: categoryMap["Behavioral"],
      },
      {
        name: "Sleep problems",
        description: "Difficulty falling asleep or staying asleep",
        category: categoryMap["Physical"],
      },
      {
        name: "Picky Eating",
        description: "Selective about food choices",
        category: categoryMap["Physical"],
      },
      {
        name: "Gut Symptoms - Gas or bloating",
        description: "Digestive discomfort",
        category: categoryMap["Physical"],
      },
      {
        name: "Gut Symptoms - Constipation",
        description: "Difficulty with bowel movements",
        category: categoryMap["Physical"],
      },
      {
        name: "Gut Symptoms - Diarrhea",
        description: "Loose or watery stools",
        category: categoryMap["Physical"],
      },
      {
        name: "Skin - Itching",
        description: "Itchy skin",
        category: categoryMap["Physical"],
      },
      {
        name: "Skin - Blushing / Flushing",
        description: "Redness in the face or skin",
        category: categoryMap["Physical"],
      },
      {
        name: "Skin - Eczema",
        description: "Dry, itchy, inflamed skin",
        category: categoryMap["Physical"],
      },
      {
        name: "Urinating more at night",
        description: "Increased urination during nighttime",
        category: categoryMap["Physical"],
      },
      {
        name: "Wheezing",
        description: "Breathing with a whistling or rattling sound",
        category: categoryMap["Physical"],
      },
    ]

    await Symptom.create(symptoms)
    console.log("Symptoms created...")

    console.log("Data seeded successfully!")
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

createSymptoms()
