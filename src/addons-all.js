import "./addons-all.scss"
import data from './datalayer'
window.addonsData = data

$(document).ready(function () {
    console.log('Document ready event callback.')
    console.log("Turn off cache for debug: shoptet.cookie.create('debugTimestamp', 1, {days: 3})");
    //shoptet.dev.enableEventsMonitoring()

})

require("./addon-user-status-bar.js")
require("./addon-cart-need-help.js")
// require("./addon-add-to-cart.js")
require("./addon-add-to-cart-enhanced.js")
require("./addon-disable-shoptet-logo.js")