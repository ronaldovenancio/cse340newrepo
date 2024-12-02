// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const regValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
//Week03
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId))

// Route to build details by InventoryID view
//Week03
router.get('/detail/:inventoryId', utilities.handleErrors(invController.buildByInventoryID))

// Route to build Inventory Management view
//Week04
router.get('/', utilities.handleErrors(invController.buildByInvManagement))

// Route to build Add Classification View
router.get('/add-classification', utilities.handleErrors(invController.buildByAddClassification))

// Route to handle Add Classification
//Week04
router.post(
    '/add-classification',
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// Route to build Add Inventory View
router.get('/add-inventory', utilities.handleErrors(invController.buildByAddInventory))

// Route to handle Add Inventory
//Week04
router.post(
    '/add-inventory',
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

module.exports = router;