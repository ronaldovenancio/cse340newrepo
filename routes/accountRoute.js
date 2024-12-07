/* *************************************
 *   Account Routes
 *************************************** */
// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route to build Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/**************************
* Process Login
* Unit 4, stickiness activity
* Modified in Unit 5, Login Process activity
******************************** */
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Route to build Registration View
router.get("/registration", utilities.handleErrors(accountController.buildRegistration))

/****************************
* Process Login
* Unit 4, stickiness activity
* Modified in Unit 5, Login Process activity
*
******************************** */
// Route to handle Registration
router.post(
    "/registration",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process Management view
router.get("/", utilities.checkLogin,
utilities.handleErrors(accountController.buildManagement))

/*
router.get("/update-account/:accountId", 
    utilities.checkLogin, 
    utilities.handleErrors(accountController.buildAccountUpdate))

router.get("/logout",
    utilities.handleErrors(accountController.buildLogoutView)
        )
*/

/* ***********************
 * Route to update account data
 *************************/
/*
router.post(
    "/update/",
    regValidate.accountUpdateRules(),
    regValidate.checkAccountUpdateData,
    utilities.handleErrors(accountController.processAccountUpdate)
)
*/

/* ***********************
 * Route to update account password
 *************************/
/*
router.post(
    "/update-password/",
    regValidate.passwordUpdateRules(),
    regValidate.checkPasswordUpdateData,
    utilities.handleErrors(accountController.processPasswordUpdate)
)
*/
module.exports = router