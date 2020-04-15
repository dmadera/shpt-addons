import "./addons-all.scss"
import data from './datalayer'
window.addonsData = data

$(document).ready(function () {
    // console.log(data)
    //shoptet.dev.enableEventsMonitoring()

})

require("./addon-user-status-bar.js")
require("./addon-cart-need-help.js")
// require("./addon-add-to-cart.js")
require("./addon-add-to-cart-enhanced.js")
require("./addon-disable-shoptet-logo.js")