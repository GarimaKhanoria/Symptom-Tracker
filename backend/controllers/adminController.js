const User = require("../models/User")
const SymptomLog = require("../models/SymptomLog")
const Symptom = require("../models/Symptom")
const ErrorResponse = require("../utils/errorResponse")

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments()

    // Get total logs
    const totalLogs = await SymptomLog.countDocuments()

    // Get total symptoms
    const totalSymptoms = await Symptom.countDocuments({ isActive: true })

    // Get recent users
    const recentUsers = await User.find().sort("-createdAt").limit(5).select("fullName email gender createdAt")

    // Get recent logs
    const recentLogs = await SymptomLog.find()
      .sort("-createdAt")
      .limit(5)
      .populate("user", "fullName email")
      .select("date totalScore createdAt")

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalLogs,
        totalSymptoms,
        recentUsers,
        recentLogs,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
  try {
    const { period, userId } = req.query

    let startDate
    const endDate = new Date()

    // Calculate start date based on period
    switch (period) {
      case "week":
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 7)
        break
      case "month":
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case "3months":
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 3)
        break
      case "6months":
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 6)
        break
      case "year":
        startDate = new Date()
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      default:
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1)
    }

    // Build query
    const query = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }

    // Add user filter if provided
    if (userId) {
      query.user = userId
    }

    // Get logs for the period
    const logs = await SymptomLog.find(query).populate("user", "fullName").sort("date")

    // Calculate average scores per day
    const scoresByDate = {}
    logs.forEach((log) => {
      const dateStr = log.date.toISOString().split("T")[0]
      if (!scoresByDate[dateStr]) {
        scoresByDate[dateStr] = {
          totalScore: 0,
          count: 0,
        }
      }
      scoresByDate[dateStr].totalScore += log.totalScore
      scoresByDate[dateStr].count += 1
    })

    const averageScores = Object.keys(scoresByDate).map((date) => ({
      date,
      score: scoresByDate[date].totalScore / scoresByDate[date].count,
    }))

    // Calculate improvement percentage
    let improvementPercentage = 0
    if (averageScores.length >= 2) {
      const firstScore = averageScores[0].score
      const lastScore = averageScores[averageScores.length - 1].score

      if (firstScore > 0) {
        improvementPercentage = ((firstScore - lastScore) / firstScore) * 100
      }
    }

    // Get top symptoms by severity
    const symptomSeverity = {}
    logs.forEach((log) => {
      log.symptoms.forEach((symptomData) => {
        const symptomId = symptomData.symptom.toString()
        if (!symptomSeverity[symptomId]) {
          symptomSeverity[symptomId] = {
            totalSeverity: 0,
            count: 0,
          }
        }
        symptomSeverity[symptomId].totalSeverity += symptomData.severity
        symptomSeverity[symptomId].count += 1
      })
    })

    const topSymptoms = []
    for (const [symptomId, data] of Object.entries(symptomSeverity)) {
      const symptom = await Symptom.findById(symptomId).select("name")
      if (symptom) {
        topSymptoms.push({
          symptomId,
          name: symptom.name,
          averageSeverity: data.totalSeverity / data.count,
        })
      }
    }

    // Sort by average severity
    topSymptoms.sort((a, b) => b.averageSeverity - a.averageSeverity)

    res.status(200).json({
      success: true,
      data: {
        averageScores,
        improvementPercentage,
        topSymptoms: topSymptoms.slice(0, 5),
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get user logs
// @route   GET /api/admin/users/:userId/logs
// @access  Private/Admin
exports.getUserLogs = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.userId}`, 404))
    }

    const logs = await SymptomLog.find({ user: req.params.userId })
      .populate({
        path: "symptoms.symptom",
        select: "name category",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .sort("-date")

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Export user data
// @route   GET /api/admin/export
// @access  Private/Admin
exports.exportData = async (req, res, next) => {
  try {
    const { format, userId } = req.query

    // Build query
    const query = {}

    // Add user filter if provided
    if (userId) {
      query.user = userId
    }

    // Get all logs
    const logs = await SymptomLog.find(query)
      .populate("user", "fullName email")
      .populate({
        path: "symptoms.symptom",
        select: "name category",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .sort("-date")

    // Format data for export
    const exportData = logs.map((log) => {
      const formattedSymptoms = log.symptoms.map((s) => ({
        name: s.symptom.name,
        category: s.symptom.category.name,
        severity: s.severity,
      }))

      return {
        user: log.user.fullName,
        email: log.user.email,
        date: log.date.toISOString().split("T")[0],
        totalScore: log.totalScore,
        symptoms: formattedSymptoms,
        notes: log.notes,
      }
    })

    // Return data in requested format
    if (format === "csv") {
      // In a real app, you would convert to CSV here
      res.status(200).json({
        success: true,
        data: exportData,
        format: "csv",
      })
    } else {
      // Default to JSON
      res.status(200).json({
        success: true,
        data: exportData,
        format: "json",
      })
    }
  } catch (err) {
    next(err)
  }
}
