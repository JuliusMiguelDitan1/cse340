const { body, validationResult } = require("express-validator")
const { getNav } = require("./") // must be correct path
const utilities = require("./")

const validate = {}

validate.classificationRules = () => [
  body("classification_name")
    .trim()
    .escape()
    .notEmpty()
    .isAlphanumeric()
    .withMessage("Classification name must only contain letters and numbers.")
]

validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await getNav()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      messages: req.flash()
    })
  }
  next()
}

validate.inventoryRules = () => [
  body("classification_id").notEmpty().withMessage("Classification is required"),
  body("inv_make").trim().notEmpty().withMessage("Make is required"),
  body("inv_model").trim().notEmpty().withMessage("Model is required"),
  body("inv_year").isInt({ min: 1900 }).withMessage("Year must be valid"),
  body("inv_price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a positive number"),
  body("inv_color").trim().notEmpty().withMessage("Color is required")
]

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      classificationList,
      messages: req.flash(),
      errors,
      ...req.body // sticky values
    })
  }
  next()
}

validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  const { 
    inv_id, classification_id, inv_make, inv_model, inv_year,
    inv_description, inv_image, inv_thumbnail,
    inv_price, inv_miles, inv_color
  } = req.body

  if (!errors.isEmpty()) {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`

  return res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    classificationSelect,
    messages: req.flash(),
    errors,
    inv_id, classification_id,
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
})
  }
  next()
}

module.exports = validate
