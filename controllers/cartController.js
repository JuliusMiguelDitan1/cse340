const cartModel = require("../models/cart-model")
const utilities = require("../utilities/")

const cartController = {}

cartController.addToCart = async function (req, res, next) {
  try {
    const { inv_id, quantity } = req.body
    const account_id = res.locals.accountData.account_id
    const result = await cartModel.addItem(account_id, inv_id, quantity)

    if (result.rowCount < 1) {
      throw new Error("Failed to add item to cart.")
    }

    req.flash("success", "Item added to cart!")
    res.redirect("/cart")
  } catch (err) {
    next(err)
  }
}

cartController.viewCart = async function (req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id
    const cartItems = await cartModel.getItems(account_id)
    const nav = await utilities.getNav()

    res.render("cart/views", {
      title: "Your Shopping Cart",
      nav,
      cartItems,
      errors: null,
      messages: req.flash(),
    })
  } catch (err) {
    next(err)
  }
}

cartController.removeItem = async function (req, res, next) {
  try {
    const { inv_id } = req.body
    const account_id = res.locals.accountData.account_id
    const result = await cartModel.removeItem(account_id, inv_id)

    if (result.rowCount < 1) {
      throw new Error("Failed to remove item from cart.")
    }

    req.flash("success", "Item removed from cart.")
    res.redirect("/cart")
  } catch (err) {
    next(err)
  }
}


module.exports = cartController
