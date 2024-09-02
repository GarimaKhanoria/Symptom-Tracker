const Symptom = require("../models/Symptom")
const SymptomCategory = require("../models/SymptomCategory")
const ErrorResponse = require("../utils/errorResponse")

// @desc    Get all symptoms
// @route   GET /api/symptoms
// @access  Private
exports.getSymptoms = async (req, res, next) => {
  try {
    const symptoms = await Symptom.find({ isActive: true }).populate("category", "name")

    res.status(200).json({
      success: true,
      count: symptoms.length,
      data: symptoms,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get single symptom
// @route   GET /api/symptoms/:id
// @access  Private
exports.getSymptom = async (req, res, next) => {
  try {
    const symptom = await Symptom.findById(req.params.id).populate("category", "name")

    if (!symptom) {
      return next(new ErrorResponse(`Symptom not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
      success: true,
      data: symptom,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Create new symptom
// @route   POST /api/symptoms
// @access  Private/Admin
exports.createSymptom = async (req, res, next) => {
  try {
    // Check if category exists
    const category = await SymptomCategory.findById(req.body.category)

    if (!category) {
      return next(new ErrorResponse(`Category not found with id of ${req.body.category}`, 404))
    }

    const symptom = await Symptom.create(req.body)

    res.status(201).json({
      success: true,
      data: symptom,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update symptom
// @route   PUT /api/symptoms/:id
// @access  Private/Admin
exports.updateSymptom = async (req, res, next) => {
  try {
    let symptom = await Symptom.findById(req.params.id)

    if (!symptom) {
      return next(new ErrorResponse(`Symptom not found with id of ${req.params.id}`, 404))
    }

    // If category is being updated, check if it exists
    if (req.body.category) {
      const category = await SymptomCategory.findById(req.body.category)

      if (!category) {
        return next(new ErrorResponse(`Category not found with id of ${req.body.category}`, 404))
      }
    }

    symptom = await Symptom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: symptom,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete symptom
// @route   DELETE /api/symptoms/:id
// @access  Private/Admin
exports.deleteSymptom = async (req, res, next) => {
  try {
    const symptom = await Symptom.findById(req.params.id)

    if (!symptom) {
      return next(new ErrorResponse(`Symptom not found with id of ${req.params.id}`, 404))
    }

    // Instead of deleting, mark as inactive
    symptom.isActive = false
    await symptom.save()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get all symptom categories
// @route   GET /api/symptoms/categories
// @access  Private
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await SymptomCategory.find()

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Create new symptom category
// @route   POST /api/symptoms/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    const category = await SymptomCategory.create(req.body)

    res.status(201).json({
      success: true,
      data: category,
    })
  } catch (err) {
    next(err)
  }
}
