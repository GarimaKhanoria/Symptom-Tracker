const express = require("express")
const {
  getMyLogs,
  getLog,
  createLog,
  updateLog,
  deleteLog,
  getLogsByDateRange,
  getTrends,
  getBaseline,
} = require("../controllers/symptomLogController")
const { protect } = require("../middleware/auth")

const router = express.Router()

// Routes that require authentication
router.use(protect)
router.route("/").get(getMyLogs).post(createLog)
router.route("/:id").get(getLog).put(updateLog).delete(deleteLog)
router.route("/range").get(getLogsByDateRange)
router.route("/trends").get(getTrends)
router.route("/baseline").get(getBaseline)

module.exports = router
