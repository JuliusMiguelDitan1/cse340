/* ****************************************
 * Account routes
 * **************************************** */
const express = require("express")
const router = express.Router()
const utilities = require("../utilities/") 
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


// Default account management view (GET /account/)
router.get(
  "/", utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount)
)
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

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Deliver the account update view
router.get(
  "/update/:accountId",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
);

// Process the account update (name/email)
router.post(
  "/update",
  utilities.checkJWTToken,
  utilities.checkLogin,
  regValidate.accountUpdateRules(),
  regValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Process password change
router.post(
  "/update-password",
  utilities.checkJWTToken,
  utilities.checkLogin,
  regValidate.passwordUpdateRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);
// Alias for default account management view
router.get(
  "/manage",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount)
);

// Process logout
router.get(
  "/logout",
  (req, res) => {
    res.clearCookie("jwt"); // Delete the JWT cookie
    req.flash("notice", "You have been logged out."); // Optional message
    res.redirect("/"); // Redirect to home page
  }
);

module.exports = router
