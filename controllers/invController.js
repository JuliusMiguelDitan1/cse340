const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const invId = req.params.invId
    const data = await invModel.getVehicleById(invId)
    let nav = await utilities.getNav()

    if (!data || data.length === 0) {
      return next({ status: 404, message: "Vehicle not found" })
    }

    // Format values for easy display in the view
    const vehicle = data[0]
    vehicle.inv_price_fmt = new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency: "USD" 
    }).format(vehicle.inv_price)

    vehicle.inv_miles_fmt = new Intl.NumberFormat("en-US").format(vehicle.inv_miles)

    res.render("./inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      inv: vehicle
    })
  } catch (err) {
    next(err)
  }
}

module.exports = invCont
