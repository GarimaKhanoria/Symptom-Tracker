const mongoose = require("mongoose")

const SymptomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a symptom name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "SymptomCategory",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Symptom", SymptomSchema)
