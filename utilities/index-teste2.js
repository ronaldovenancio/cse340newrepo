const invModel = require('../models/inventory-model-teste');
//const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    // console.log(data)
    let list = '<ul>'
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += '<li>'
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            '</a>'
        list += '</li>'
    })
    list += '</ul>'
    return list;
}

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach((vehicle) => {
            grid += '<li>'
            grid +=
                '<a href="../../inv/detail/' +
                vehicle.inv_id +
                '" title="View ' +
                vehicle.inv_make +
                ' ' +
                vehicle.inv_model +
                'details"><img src="' +
                vehicle.inv_thumbnail +
                '" alt="Image of ' +
                vehicle.inv_make +
                ' ' +
                vehicle.inv_model +
                ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid +=
                '<a href="../../inv/detail/' +
                vehicle.inv_id +
                '" title="View ' +
                vehicle.inv_make +
                ' ' +
                vehicle.inv_model +
                ' details">' +
                vehicle.inv_make +
                ' ' +
                vehicle.inv_model +
                '</a>'
            grid += '</h2>'
            grid += '<span>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid;
}

/* **************************************
 * Build the details view HTML
 * ************************************ */
Util.buildDetailsGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<article id="details-display">'
        grid +=
            '<img src="' +
            data[0].inv_image +
            '" alt="Image of ' +
            data[0].inv_make +
            ' ' +
            data[0].inv_model +
            ' on CSE Motors" />'
        grid += '<div id="details-info">'
        grid += '<h2>' + data[0].inv_make + ' ' + data[0].inv_model + ' ' + 'Details</h2>'
        grid += '<p class="price">Price: $' + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</p>'
        grid += '<p class="description"><strong>Description:</strong> ' + data[0].inv_description + '</p>'
        grid += '<ul class="details-list">'
        grid += '<li><span class="checkbox"></span><strong>Year:</strong> &nbsp;' + data[0].inv_year + '</li>'
        grid += '<li><span class="checkbox"></span><strong>Make:</strong> &nbsp;' + data[0].inv_make + '</li>'
        grid += '<li><span class="checkbox"></span><strong>Model:</strong> &nbsp;' + data[0].inv_model + '</li>'
        grid += '<li><span class="checkbox"></span><strong>Color:</strong> &nbsp;' + data[0].inv_color + '</li>'
        grid +=
            '<li><span class="checkbox"></span><strong>Mileage:</strong> &nbsp;' +
            new Intl.NumberFormat('en-US').format(data[0].inv_miles) +
            '</li>'
        grid +=
            '<li><span class="checkbox"></span><strong>Classification:</strong> &nbsp;' +
            data[0].classification_name +
            '</li>'
        grid += '</ul>'
        grid += '</div>'
        grid += '</article>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles details could be found.</p>'
    }
    return grid
}

/* **************************************
 * Build Error view HTML
<image src="/images/site/pexels-pixabay-78793.jpg" alt="404 Error Image - broken car" /> 
 * ************************************ */
Util.buildErrorMessage = (heading, quote) => `<section id="error-page">
    <image src="/images/site/pexels-chrofit-the-man-to-call-2515393-5612021.webp" alt="404 Error Image - broken car" />
    <div class="error-message">
    <h2>${heading}</h2>
    <p class="notice">${quote}</p>
    </div>
    </section>`

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
      jwt.verify(
        req.cookies.jwt,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, accountData) {
          if (err) {
            req.flash("Please log in");
            res.clearCookie("jwt");
            return res.redirect("/account/login");
          }
          res.locals.accountData = accountData;
          res.locals.loggedin = 1;
          next();
        }
      );
    } else {
      next();
    }
  };
  

/*
 * Function to update the browser cookie.
 * @param {object} accountData
 * @param {import("express").Response} res
 */

Util.updateCookie = (accountData, res) => {
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600,
    });
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      });
    }
  };
  


/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
      next();
    } else {
      req.flash("notice", "Please log in.");
      return res.redirect("/account/login");
    }
  };
  


/* ****************************************
 *  Check authorization
 * ************************************ */
Util.checkAuthorizationManager = (req, res, next) => {
    if (req.cookies.jwt) {
      jwt.verify(
        req.cookies.jwt,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, accountData) {
          if (err) {
            req.flash("Please log in");
            res.clearCookie("jwt");
            return res.redirect("/account/login");
          }
          if (
            accountData.account_type == "Employee" ||
            accountData.account_type == "Admin"
          ) {
            next();
          } else {
            req.flash("notice", "You are not authorized to modify inventory.");
            return res.redirect("/account/login");
          }
        }
      );
    } else {
      req.flash("notice", "You are not authorized to modify inventory.");
      return res.redirect("/account/login");
    }
  };


/**
 * Build an html table string from the message array
 * @param {Array<Message>} messages 
 * @returns 
 */
Util.buildInbox = (messages) => {
    inboxList = `
    <table>
      <thead>
        <tr>
          <th>Received</th><th>Subject</th><th>From</th><th>Read</th>
        </tr>
      </thead>
      <tbody>`;
  
    messages.forEach((message) => {
      inboxList += `
      <tr>
        <td>${message.message_created.toLocaleString()}</td>
        <td><a href="/message/view/${message.message_id}">${message.message_subject}</a></td>
        <td>${message.account_firstname} ${message.account_type}</td>
        <td>${message.message_read ? "✓" : " "}</td>
      </tr>`;
    });
  
    inboxList += `
    </tbody>
    </table> `;
    return inboxList;
  };
  
  Util.buildRecipientList = (recipientData, preselected = null) => {
    let list = `<select name="message_to" required>`;
    list += '<option value="">Select a recipient</option>';
  
    recipientData.forEach((recipient) => {
      list += `<option ${preselected == recipient.account_id ? "selected" : ""} value="${recipient.account_id}">${recipient.account_firstname} ${recipient.account_lastname}</option>`
    });
    list += "</select>"
  
    return list;
  
  };

module.exports = Util;