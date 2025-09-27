/* ****************************************
 * Account routes
 * **************************************** */
const express = require("express")
const router = express.Router()
const utilities = require("../utilities/") 
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build "My Account" (Login) view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.loginUser) // <-- implement in your controller
)


module.exports = router
