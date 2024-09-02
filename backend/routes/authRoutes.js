const express = require("express")
const { register, login, getMe, logout } = require("../controllers/authController")
const { protect } = require("../middleware/auth")
const { check } = require("express-validator")

const router = express.Router()

router.post(
  "/register",
  [
    check("fullName", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
  ],
  register,
)

router.post(
  "/login",
  [check("email", "Please include a valid email").isEmail(), check("password", "Password is required").exists()],
  login,
)

router.get("/me", protect, getMe)
router.get("/logout", protect, logout)

module.exports = router
