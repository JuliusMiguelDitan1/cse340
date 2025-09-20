const express = require("express")
const router = express.Router()
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")

// Route to trigger the intentional error
router.get("/trigger", utilities.handleErrors(errorController.throwError))

module.exports = router
