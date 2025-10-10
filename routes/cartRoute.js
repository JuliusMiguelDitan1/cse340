const express = require("express")
const router = new express.Router()
const cartController = require("../controllers/cartController")
const cartValidate = require("../utilities/cart-validation")
const utilities = require("../utilities/")

// Add item to cart
router.post(
  "/add",
  utilities.checkLogin,
  cartValidate.addToCartRules(),
  cartValidate.checkCartData,
  utilities.handleErrors(cartController.addToCart)
)

// View cart
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(cartController.viewCart)
)

router.post(
  "/remove",
  utilities.checkLogin,
  cartValidate.removeItemRules(),
  cartValidate.checkCartData,
  utilities.handleErrors(cartController.removeItem)
)


module.exports = router
