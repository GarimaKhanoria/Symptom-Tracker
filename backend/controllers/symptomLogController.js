const SymptomLog = require("../models/SymptomLog")
const Symptom = require("../models/Symptom")
const ErrorResponse = require("../utils/errorResponse")

// @desc    Get all symptom logs for current user
// @route   GET /api/symptom-logs
// @access  Private
exports.getMyLogs = async (req, res, next) => {
  try {
    const logs = await SymptomLog.find({ user: req.user.id })
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

// @desc    Get single symptom log
// @route   GET /api/symptom-logs/:id
// @access  Private
exports.getLog = async (req, res, next) => {
  try {
    const log = await SymptomLog.findById(req.params.id).populate({
      path: "symptoms.symptom",
      select: "name category",
      populate: {
        path: "category",
        select: "name",
      },
    })

    if (!log) {
      return next(new ErrorResponse(`Log not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the log or is admin
    if (log.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this log`, 401))
    }

    res.status(200).json({
      success: true,
      data: log,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Create new symptom log
// @route   POST /api/symptom-logs
// @access  Private
exports.createLog = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id

    // Check if user already has a log for this date
    const existingLog = await SymptomLog.findOne({
      user: req.user.id,
      date: new Date(req.body.date).setHours(0, 0, 0, 0),
    })

    if (existingLog) {
      return next(new ErrorResponse(`You have already submitted a log for this date`, 400))
    }

    // Validate symptoms
    if (!req.body.symptoms || req.body.symptoms.length === 0) {
      return next(new ErrorResponse(`Please add at least one symptom`, 400))
    }

    // Calculate total score
    let totalScore = 0
    for (const item of req.body.symptoms) {
      // Check if symptom exists
      const symptom = await Symptom.findById(item.symptom)
      if (!symptom) {
        return next(new ErrorResponse(`Symptom not found with id of ${item.symptom}`, 404))
      }

      totalScore += item.severity
    }

    req.body.totalScore = totalScore

    const log = await SymptomLog.create(req.body)

    res.status(201).json({
      success: true,
      data: log,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update symptom log
// @route   PUT /api/symptom-logs/:id
// @access  Private
exports.updateLog = async (req, res, next) => {
  try {
    let log = await SymptomLog.findById(req.params.id)

    if (!log) {
      return next(new ErrorResponse(`Log not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the log
    if (log.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this log`, 401))
    }

    // If symptoms are being updated, recalculate total score
    if (req.body.symptoms) {
      let totalScore = 0
      for (const item of req.body.symptoms) {
        // Check if symptom exists
        const symptom = await Symptom.findById(item.symptom)
        if (!symptom) {
          return next(new ErrorResponse(`Symptom not found with id of ${item.symptom}`, 404))
        }

        totalScore += item.severity
      }
      req.body.totalScore = totalScore
    }

    log = await SymptomLog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: log,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete symptom log
// @route   DELETE /api/symptom-logs/:id
// @access  Private
exports.deleteLog = async (req, res, next) => {
  try {
    const log = await SymptomLog.findById(req.params.id)

    if (!log) {
      return next(new ErrorResponse(`Log not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the log
    if (log.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this log`, 401))
    }

    await log.remove()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get logs by date range
// @route   GET /api/symptom-logs/range
// @access  Private
exports.getLogsByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return next(new ErrorResponse("Please provide start and end dates", 400))
    }

    const query = {
      user: req.user.id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }

    const logs = await SymptomLog.find(query)
      .populate({
        path: "symptoms.symptom",
        select: "name category",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .sort("date")

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get symptom trends
// @route   GET /api/symptom-logs/trends
// @access  Private
exports.getTrends = async (req, res, next) => {
  try {
    const { period, symptomId } = req.query

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

    const query = {
      user: req.user.id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }

    const logs = await SymptomLog.find(query).sort("date")

    // Process data for trends
    const trendData = []

    if (symptomId && symptomId !== "all") {
      // Specific symptom trend
      logs.forEach((log) => {
        const symptomData = log.symptoms.find((s) => s.symptom.toString() === symptomId)
        if (symptomData) {
          trendData.push({
            date: log.date.toISOString().split("T")[0],
            score: symptomData.severity,
          })
        }
      })
    } else {
      // Total score trend
      logs.forEach((log) => {
        trendData.push({
          date: log.date.toISOString().split("T")[0],
          score: log.totalScore,
        })
      })
    }

    res.status(200).json({
      success: true,
      data: trendData,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get baseline comparison
// @route   GET /api/symptom-logs/baseline
// @access  Private
exports.getBaseline = async (req, res, next) => {
  try {
    const { period, symptomId } = req.query

    // Get the first log as baseline
    const firstLog = await SymptomLog.findOne({ user: req.user.id }).sort("date")

    if (!firstLog) {
      return res.status(200).json({
        success: true,
        data: [],
      })
    }

    // Get logs for the period
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

    const query = {
      user: req.user.id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }

    const logs = await SymptomLog.find(query).sort("date")

    // Process data for baseline comparison
    const baselineData = []

    if (symptomId && symptomId !== "all") {
      // Specific symptom baseline
      const baselineSymptom = firstLog.symptoms.find((s) => s.symptom.toString() === symptomId)
      const baselineValue = baselineSymptom ? baselineSymptom.severity : 0

      logs.forEach((log) => {
        const symptomData = log.symptoms.find((s) => s.symptom.toString() === symptomId)
        if (symptomData) {
          baselineData.push({
            date: log.date.toISOString().split("T")[0],
            score: symptomData.severity - baselineValue,
          })
        }
      })
    } else {
      // Total score baseline
      const baselineValue = firstLog.totalScore

      logs.forEach((log) => {
        baselineData.push({
          date: log.date.toISOString().split("T")[0],
          score: log.totalScore - baselineValue,
        })
      })
    }

    res.status(200).json({
      success: true,
      data: baselineData,
    })
  } catch (err) {
    next(err)
  }
}
