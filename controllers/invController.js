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

/* ****************************************
 *  Deliver Inventory Management View
 * *************************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
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

/* ****************************************
 *  Build Add Inventory View
 * *************************************** */
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

/* ****************************************
 *  Process Add Inventory
 * *************************************** */
invCont.addInventory = async (req, res, next) => {
  try {
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
      const classificationSelect = await utilities.buildClassificationList() // <-- define it
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build Edit Inventory View
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
 *  Process Update Inventory
 * *************************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    // Ensure default images if empty
    if (!req.body.inv_image || req.body.inv_image.trim() === '') {
      req.body.inv_image = '/images/vehicles/no-image.png';
    }
    if (!req.body.inv_thumbnail || req.body.inv_thumbnail.trim() === '') {
      req.body.inv_thumbnail = '/images/vehicles/no-image.png';
    }

    const result = await invModel.updateInventory(req.body);

    if (result) {
      req.flash("notice", `Vehicle "${req.body.inv_make} ${req.body.inv_model}" updated successfully.`);
      res.redirect("/inv"); // back to management page
    } else {
      const classificationList = await utilities.buildClassificationList(req.body.classification_id);
      req.flash("notice", "Failed to update vehicle.");
      res.status(500).render("inventory/edit-inventory", {
        title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
        classificationSelect,
        messages: req.flash(),
        errors: null,
        ...req.body
      });
    }
  } catch (err) {
    next(err);
  }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()

    const vehicle = await invModel.getVehicleById(inv_id)
    if (!vehicle) {
      req.flash("notice", "Vehicle not found.")
      return res.redirect("/inv")
    }

    const itemName = `${vehicle.inv_make} ${vehicle.inv_model}`
    res.render("inventory/delete-inventory", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      messages: req.flash(),
      // values for the readonly fields in the delete form
      inv_id: vehicle.inv_id,
      inv_make: vehicle.inv_make,
      inv_model: vehicle.inv_model,
      inv_year: vehicle.inv_year,
      inv_price: vehicle.inv_price
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Process delete inventory
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)

    const result = await invModel.deleteInventory(inv_id) // model function you will add

    if (result) {
      req.flash("notice", `Vehicle removed successfully.`)
      return res.redirect("/inv")
    } else {
      req.flash("notice", "Sorry, the delete failed.")
      return res.redirect(`/inv/delete/${inv_id}`)
    }
  } catch (err) {
    next(err)
  }
}


module.exports = invCont
