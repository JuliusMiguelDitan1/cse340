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

    if (!data || data.length === 0) {
      return res.render("./inventory/classification", {
        title: "No vehicles found",
        nav,
        grid
      })
    }

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
    console.log("Requested invId:", invId)

    const vehicle = await invModel.getVehicleById(invId) // now directly a vehicle object
    console.log("Vehicle fetched:", vehicle)

    let nav = await utilities.getNav()

    if (!vehicle) {
      console.warn("No vehicle found for ID:", invId)
      return next({ status: 404, message: "Vehicle not found" })
    }

    // Format values
    vehicle.inv_price_fmt = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(vehicle.inv_price)

    vehicle.inv_miles_fmt = new Intl.NumberFormat("en-US").format(vehicle.inv_miles)

    res.render("./inventory/details", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      inv: vehicle
    })
  } catch (err) {
    console.error("buildByInvId error:", err)
    next(err)
  }
}




module.exports = invCont
