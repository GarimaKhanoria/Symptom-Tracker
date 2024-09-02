const express = require("express")
const { getStats, getAnalytics, getUserLogs, exportData } = require("../controllers/adminController")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// All routes require authentication and admin role
router.use(protect)
router.use(authorize("admin"))

router.route("/stats").get(getStats)
router.route("/analytics").get(getAnalytics)
router.route("/users/:userId/logs").get(getUserLogs)
router.route("/export").get(exportData)

module.exports = router
