/* ****************************************
 *  Account Controller
 * **************************************** */
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 *  Deliver login view
 * **************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver account management (default) view
* *************************************** */
async function buildAccount(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/index", {
      title: "Account Management",
      nav,
      errors: null,
      messages: req.flash()
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(account_password, 10)

    // Insert into DB
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      )
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        messages: req.flash()
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      return res.status(501).render("account/register", {
        title: "Register",
        nav,
        errors: null,
        messages: req.flash()
      })
    }
  } catch (error) {
    console.error("registerAccount error:", error.message)
    req.flash("notice", "Sorry, there was an error processing the registration.")
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      messages: req.flash()
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.render("account/index", {
        title: "Account Management",
        nav,
        errors: null,
        messages: req.flash(),
        accountData
      })
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function buildUpdateAccount(req, res, next) {
  try {
    const accountId = req.params.accountId;
    const accountData = await accountModel.getAccountById(accountId);

    let nav = await utilities.getNav();
    res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData,
      errors: null,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
}

async function updateAccount(req, res, next) {
  try {
    const { account_id, account_firstname, account_lastname, account_email } = req.body;

    // Attempt to update
    const result = await accountModel.updateAccountInfo(account_id, account_firstname, account_lastname, account_email);

    if (result) {
      req.flash("notice", "Account information updated successfully.");
    } else {
      req.flash("notice", "No changes were made.");
    }

    // Always retrieve latest data from DB
    let accountData = await accountModel.getAccountById(account_id);

    // Fallback: if nothing found, use submitted data
    if (!accountData) {
      accountData = { account_id, account_firstname, account_lastname, account_email };
    }

    const nav = await utilities.getNav();
    res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData,
      errors: null,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
}


async function updatePassword(req, res, next) {
  try {
    const { account_id, account_password } = req.body;

    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(account_id); // fetch before doing anything

    // Check if password field is empty
    if (!account_password || account_password.trim() === "") {
      req.flash("notice", "No password entered. Please enter a new password to change it.");
      return res.render("account/update-account", {
        title: "Update Account",
        nav,
        accountData,
        errors: null,
        messages: req.flash()
      });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const result = await accountModel.updateAccountPassword(account_id, hashedPassword);

    if (result) {
      req.flash("notice", "Password updated successfully.");
    } else {
      req.flash("error", "Failed to update password.");
    }

    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData, // always pass current account data
      errors: null,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
}



module.exports = {
  buildLogin,
  buildRegister,
  buildAccount,
  registerAccount,
  accountLogin,
  buildUpdateAccount,
  updateAccount,
  updatePassword
};
