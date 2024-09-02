const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const morgan = require("morgan")
const connectDB = require("./config/db")
const errorHandler = require("./middleware/errorHandler")

// Load env vars
dotenv.config()

// Connect to database
connectDB()

// Route files
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const symptomRoutes = require("./routes/symptomRoutes")
const symptomLogRoutes = require("./routes/symptomLogRoutes")
const adminRoutes = require("./routes/adminRoutes")

const app = express()

// Body parser
app.use(express.json())

// Enable CORS
app.use(cors())

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Mount routers
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/symptoms", symptomRoutes)
app.use("/api/symptom-logs", symptomLogRoutes)
app.use("/api/admin", adminRoutes)

// Error handler middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`)
  // Close server & exit process
  server.close(() => process.exit(1))
})
