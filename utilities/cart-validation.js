const { body, validationResult } = require("express-validator")
const utilities = require("./")

const cartValidate = {}

/* ***************************
 *  Validation rules for adding to cart
 * ************************** */
cartValidate.addToCartRules = () => {
  return [
    body("inv_id")
      .trim()
      .notEmpty()
      .withMessage("Missing product ID.")
      .isInt({ gt: 0 })
      .withMessage("Invalid product ID."),
    body("quantity")
      .trim()
      .notEmpty()
      .withMessage("Quantity is required.")
      .isInt({ gt: 0 })
      .withMessage("Quantity must be a positive number."),
  ]
}

/* ***************************
 *  Check data and return errors
 * ************************** */
cartValidate.checkCartData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const cartItem = req.body // preserve user input

    return res.render("errors/error", {
      title: "Cart Error",
      message: "Please correct the following errors:",
      errors: errors.array(),
      nav,
      cartItem,
    })
  }
  next()
}

cartValidate.removeItemRules = () => {
  return [
    body("inv_id")
      .trim()
      .notEmpty()
      .withMessage("Missing product ID to remove.")
      .isInt({ gt: 0 })
      .withMessage("Invalid product ID."),
  ]
}


module.exports = cartValidate
