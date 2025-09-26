/* ****************************************
 * Account routes
 * **************************************** */
const express = require("express")
const router = express.Router()
const utilities = require("../utilities/") 
const accountController = require("../controllers/accountController")

// Route to build "My Account" (Login) view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)
router.post(
  '/register', utilities.handleErrors(accountController.registerAccount)
)


module.exports = router
