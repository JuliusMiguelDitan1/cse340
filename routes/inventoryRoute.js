// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inv-validation")
const { checkEmployeeOrAdmin } = require("../utilities/account-check")

// =======================
// PUBLIC ROUTES (VISITORS)
// =======================

// Inventory by classification view
router.get(
  "/type/:classificationId", 
  utilities.handleErrors(invController.buildByClassificationId)
)

// Vehicle detail view
router.get(
  "/detail/:invId", 
  utilities.handleErrors(invController.buildByInvId)
)

// Return inventory JSON by classification
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)


// =======================
// ADMIN/EMPLOYEE ROUTES
// =======================

// Inventory management view
router.get(
  "/", 
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement)
)

// Add classification view
router.get(
  "/add-classification",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
)

// Process add classification
router.post(
  "/add-classification",
  checkEmployeeOrAdmin,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory view
router.get(
  "/add-inventory", 
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
)

// Process add inventory
router.post(
  "/add-inventory", 
  checkEmployeeOrAdmin,
  invValidate.inventoryRules(), 
  invValidate.checkInventoryData, 
  utilities.handleErrors(invController.addInventory)
)

// Edit inventory view
router.get(
  "/edit/:inv_id", 
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.editInventoryView)
)

// Process inventory update
router.post(
  "/update",
  checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.updateInventory)
)

// Delete confirmation view
router.get(
  "/delete/:inv_id",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteInventoryView)
)

// Process delete inventory
router.post(
  "/delete",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventory)
)
// routes/inventoryRoute.js
router.get(
  "/management",
  utilities.checkLogin,          // ensures user is logged in
  utilities.handleErrors(invController.buildManagement)
);

module.exports = router
