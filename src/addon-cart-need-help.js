import "./addon-cart-need-help.scss"

$(document).ready(function () {
    let phone = $(".top-navigation-bar .top-navigation-contacts")
        .find(".project-phone span").clone().addClass('tel').attr('itemprop', "telephone")
    let email = $(".top-navigation-bar .top-navigation-contacts")
        .find(".project-email span").clone().addClass('mail').attr('itemprop', "email")
    let needHelpBtn = `
        <span class="btn btn-block btn-default toggle-contacts" data-original-text="Potřebujete pomoc?" 
            data-text="Skrýt kontakty">Potřebujete pomoc?</span>`

    let ulObj = $("<ul>")
    ulObj.append($("<li>").append(email))
    ulObj.append($("<li>").append(phone))

    let wrapperObj1 = $('<div class="contact-box no-image">')
    wrapperObj1.append(ulObj)

    let wrapperObj = $('<div class="box box-sm box-bg-default">')
    wrapperObj.append(wrapperObj1)

    let divObj = $('<div class="checkout-box addon need-help">');
    divObj.append(needHelpBtn).append(wrapperObj);

    $(".cart-inner .cart-row .cart-content.checkout-box-wrapper").html(divObj)
    $("#checkoutSidebar")
        .find(".order-summary")
        .prepend(divObj)
})