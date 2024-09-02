const express = require("express")
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
  updatePassword,
} = require("../controllers/userController")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// Routes that require authentication and admin role
router.use(protect)
router.route("/profile").put(updateProfile)
router.route("/updatepassword").put(updatePassword)

// Routes that require admin role
router.use(authorize("admin"))
router.route("/").get(getUsers)
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser)

module.exports = router
