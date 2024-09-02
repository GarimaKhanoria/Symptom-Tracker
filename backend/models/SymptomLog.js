const mongoose = require("mongoose")

const SymptomLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    symptoms: [
      {
        symptom: {
          type: mongoose.Schema.ObjectId,
          ref: "Symptom",
          required: true,
        },
        severity: {
          type: Number,
          required: true,
          min: 0,
          max: 10,
        },
      },
    ],
    totalScore: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot be more than 1000 characters"],
    },
  },
  {
    timestamps: true,
  },
)

// Prevent user from submitting more than one log per day
SymptomLogSchema.index({ user: 1, date: 1 }, { unique: true })

module.exports = mongoose.model("SymptomLog", SymptomLogSchema)
