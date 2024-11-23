/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const Util = require("./utilities/");
const utilities = require("./utilities/");

const app = express();

/* ****************************
 * View Engine and Templates
 ******************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);
// Index route

//app.get("/", baseController.buildHome);
//app.get("/", Util.handleErrors(baseController.buildHome));
app.get("/", utilities.handleErrors(baseController.buildHome));
// Inventory routes
app.use("/inv", utilities.handleErrors(inventoryRoute));
// Error routes
app.use("/error", utilities.handleErrors(baseController.buildError));
//app.use("/inv", inventoryRoute);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  const heading = 'You seem to have lost a few parts?'
  const quote = `Sorry, we couldn't find the page you're looking for :) <br> But you could try any of the pages in the menu-bar.`
  next({ status: 404, message: utilities.buildErrorMessage(heading, quote) })
})

/*
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

utilities.handleErrors(baseController.buildHome); */

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  let title
  let message
  console.error(`Error at: "${req.originalUrl}": ${err.status || 500}`)
  if (err.status === 404) {
      title = `${err.status} - PAGE NOT FOUND`
      message = err.message
  } else {
      title = `500 - INTERNAL SERVER ERROR`
      const heading = 'Oh no! There was a crash!'
      const quote = ` Maybe try watching where you are going next time?`
      message = utilities.buildErrorMessage(heading, quote)
  }
  res.render('errors/error', {
      title,
      message,
      nav,
  })
})


/*
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  let title;
  let message;
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})
*/




/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
});