const express = require("express")
const {
  getSymptoms,
  getSymptom,
  createSymptom,
  updateSymptom,
  deleteSymptom,
  getCategories,
  createCategory,
} = require("../controllers/symptomController")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// Routes that require authentication
router.use(protect)
router.route("/").get(getSymptoms)
router.route("/:id").get(getSymptom)
router.route("/categories").get(getCategories)

// Routes that require admin role
router.use(authorize("admin"))
router.route("/").post(createSymptom)
router.route("/:id").put(updateSymptom).delete(deleteSymptom)
router.route("/categories").post(createCategory)

module.exports = router
