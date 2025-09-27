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

    const vehicle = await invModel.getVehicleById(invId)
    console.log("Vehicle fetched:", vehicle)

    let nav = await utilities.getNav()

    if (!vehicle) {
      console.warn("No vehicle found for ID:", invId)
      return next({ status: 404, message: "Vehicle not found" })
    }

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

/* ****************************************
 *  Deliver Inventory Management View
 * *************************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      messages: req.flash()
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
 *  Deliver Add Classification View
 * *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    messages: req.flash()
  })
}

/* ****************************************
 *  Process Classification
 * *************************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  let nav = await utilities.getNav()

  try {
    const result = await invModel.addClassification(classification_name)

    if (result) {
      req.flash("notice", `Classification "${classification_name}" added successfully.`)
      nav = await utilities.getNav() // refresh nav
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
        messages: req.flash()
      })
    } else {
      req.flash("notice", "Failed to add classification.")
      res.status(501).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
        messages: req.flash()
      })
    }
  } catch (err) {
    next(err)
  }
}

// GET: build add inventory view
invCont.buildAddInventory = async (req, res, next) => {
  try {
    const classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      classificationList,
      messages: req.flash(),
      errors: null,
      // Sticky defaults
      inv_make: '',
      inv_model: '',
      inv_year: '',
      inv_description: '',
      inv_image: '/images/vehicles/no-image.png',
      inv_thumbnail: '/images/vehicles/no-image-tn.png',
      inv_price: '',
      inv_miles: '',
      inv_color: ''
    })
  } catch (err) {
    next(err)
  }
}

// POST: process add inventory
invCont.addInventory = async (req, res, next) => {
  try {

        // Set default images if empty
    if (!req.body.inv_image || req.body.inv_image.trim() === '') {
      req.body.inv_image = '/images/vehicles/no-image.png';
    }
    if (!req.body.inv_thumbnail || req.body.inv_thumbnail.trim() === '') {
      req.body.inv_thumbnail = '/images/vehicles/no-image.png';
    }

    const result = await invModel.addInventory(req.body)

    if (result) {
      req.flash("notice", `Vehicle "${req.body.inv_make} ${req.body.inv_model}" added successfully.`)
      const nav = await utilities.getNav()
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        messages: req.flash(),
        errors: null
      })
    } else {
      const classificationList = await utilities.buildClassificationList(req.body.classification_id)
      req.flash("notice", "Failed to add vehicle.")
      res.status(500).render("inventory/add-inventory", {
        title: "Add Inventory",
        classificationList,
        messages: req.flash(),
        errors: null,
        ...req.body
      })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = invCont
