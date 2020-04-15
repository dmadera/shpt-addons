import "./addon-add-to-cart-enhanced.scss"
import data from './datalayer'

var PREVENT_BLUR = false

function appendUpdateForm(productDiv, action = 'update') {
    const form = $('<form method="post" class="pr-action">')
    let amount = productDiv.find('.cart-amount').val()
    form.attr('action', '/action/Cart/setCartItemAmount/')

    if (action == 'add') {
        form.attr('action', '/action/Cart/addCartItem/')
    } else if (amount == 0) {
        form.attr('action', '/action/Cart/deleteCartItem/')
    }
    const code = productDiv.attr('data-cart-code')
    const priceId = productDiv.attr('data-cart-priceid')
    const itemId = productDiv.attr('data-cart-itemid')
    form.append($('<input type="hidden" name="itemId" value="">').val(itemId))
    form.append($('<input type="hidden" name="priceId">').val(priceId))
    form.append($('<input type="hidden" name="amount">').val(amount))
    productDiv.find('.form-container').html(form)
    return form
}

function addElements(container) {
    if ($('.addon.add-to-cart-enhanced').length == 0) {
        let wrapper = $('<div class="addon add-to-cart-enhanced">')
        wrapper.append('<div class="form-container">')
        const buttonsWrapper = $('<div class="cart-buttons-wrapper">')
        const buttonIncDecWrapper = $('<div class="cart-inc-dec-buttons-wrapper">')
        buttonIncDecWrapper
            .append($('<button class="cart-increase-button">'))
            .append($('<button class="cart-decrease-button">'))
            .append($('<div class="clearfix">'))
        buttonsWrapper
            .append(buttonIncDecWrapper)
            .append($('<button class="cart-add-button">Do košíku</button>'))
            .append($('<button class="cart-update-button">Nastavit</button>'))
            .append($('<input type="text" class="cart-amount" autocomplete="off" data-decimals="0" data-min="0" data-max="9999">'))
        wrapper.append(buttonsWrapper)
        container.find('.ratings-wrapper').append(wrapper)
        container.find('.product').append($('<span class="in-cart-info">').append($('<span>')).append('ks v košíku'))

        container.find(".product").each(function () {
            const productDiv = $(this).closest('.product')
            let quantity = productDiv.attr('data-cart-quantity')
            productDiv.find('.cart-amount').val(quantity == 0 ? 1 : quantity)
            if (quantity > 0) {
                showIncDesButton(productDiv)
            } else {
                showAddButton(productDiv)
            }
            updateCartInfo(productDiv, quantity)
        })

        $('.cart-amount')
            .on('focus', function (e) {
                const productDiv = $(this).closest('.product')
                PREVENT_BLUR = false
                showUpdateButton(productDiv)
            })
            .on('blur', function (e) {
                const productDiv = $(this).closest('.product')
                if (PREVENT_BLUR) {
                    e.preventDefault();
                    return
                }
                productDiv.find('.cart-update-button').trigger('mousedown')
            })
            .on('keypress', function (e) {
                const productDiv = $(this).closest('.product')
                if (e.which != 13) {
                    return
                }
                const addButton = productDiv.find('.cart-add-button')
                const updateButton = productDiv.find('.cart-update-button')
                if (addButton.is(':visible')) addbutton.trigger('click')
                else updateButton.trigger('mousedown')
            })
        $('.cart-add-button').click(function (e) {
            const productDiv = $(this).closest('.product')
            const form = appendUpdateForm(productDiv, 'add')
            form.submit()
            showIncDesButton(productDiv)
        })
        $('.cart-update-button').on('mousedown', function (e) {
            PREVENT_BLUR = true
            const productDiv = $(this).closest('.product')
            const val = productDiv.find('.cart-amount').val()
            const dataAmount = productDiv.find('.cart-inc-dec-buttons-wrapper').attr('data-amount')
            if (val == dataAmount) {
                e.preventDefault()
                return
            }
            const form = appendUpdateForm(productDiv)
            form.submit()
            if (val == 0) {
                showAddButton(productDiv)
            } else {
                showIncDesButton(productDiv)
            }
        })
        $('.cart-inc-dec-buttons-wrapper').on('mouseenter', function () {
            const productDiv = $(this).closest('.product')
            $(this).attr('data-amount', productDiv.find('.cart-amount').val())
        })
        $('.cart-inc-dec-buttons-wrapper').on('mouseleave', function () {
            const productDiv = $(this).closest('.product')
            productDiv.find('.cart-update-button').trigger('mousedown')
        })
        $('.cart-increase-button').click(function (e) {
            const productDiv = $(this).closest('.product')
            const val = parseInt(productDiv.find('.cart-amount').val())
            const newVal = val + 1
            productDiv.find('.cart-amount').val(newVal)
            updateCartInfo(productDiv, newVal)
        })
        $('.cart-decrease-button').click(function (e) {
            const productDiv = $(this).closest('.product')
            const val = parseInt(productDiv.find('.cart-amount').val())
            const newVal = val == 0 ? 0 : val - 1
            productDiv.find('.cart-amount').val(newVal)
            updateCartInfo(productDiv, newVal)
        })
    }
}

function updateProductsData(container) {
    console.log('Updating products data')
    var items = {}
    $.ajax({
        async: false,
        type: "GET",
        url: "action/Cart/GetCartContent/?simple_ajax_cart=1",
        success: function (data) {
            items = $(data.payload.content).find('.cart-widget-product')
        }
    });
    container.find(".product").each(function () {
        const productDiv = $(this)
        const productCode = productDiv.find('.p-code span').html()
        const productPriceId = productDiv.find('.p-tools input[name="priceId"]').val()

        productDiv.attr('data-cart-quantity', 0)
        productDiv.attr('data-cart-code', productCode)
        productDiv.attr('data-cart-priceid', productPriceId)
        productDiv.attr('data-cart-index', -1)
        productDiv.attr('data-cart-itemid', "")

        for (const [index, product] of data.getCart().entries()) {
            if (product.code == productCode) {
                const itemId = $(items.get(index)).find('input[name="itemId"]').val()
                const quantity = $(items.get(index)).find('input[name="amount"]').val()
                productDiv.attr('data-cart-quantity', quantity)
                productDiv.attr('data-cart-code', product.code)
                productDiv.attr('data-cart-index', index)
                productDiv.attr('data-cart-itemid', itemId)
                break
            }
        }
        updateCartButtons(productDiv)
    })
}

function showAddButton(productDiv) {
    const addonWrapper = productDiv.find('.addon.add-to-cart-enhanced')
    addonWrapper.find('button').hide()
    addonWrapper.find('.cart-add-button').show()
}

function showIncDesButton(productDiv) {
    const addonWrapper = productDiv.find('.addon.add-to-cart-enhanced')
    addonWrapper.find('button').hide()
    addonWrapper.find('.cart-increase-button').show()
    addonWrapper.find('.cart-decrease-button').show()
}

function showUpdateButton(productDiv) {
    const addonWrapper = productDiv.find('.addon.add-to-cart-enhanced')
    addonWrapper.find('button').hide()
    addonWrapper.find('.cart-update-button').show()
}

function updateCartButtons(productDiv, update = false) {
    const addonWrapper = productDiv.find('.addon.add-to-cart-enhanced')
    const dataQuantity = productDiv.attr('data-cart-quantity')
    const inputAmount = productDiv.find('.cart-amount').val()

    addonWrapper.find('button').hide()
    if (dataQuantity == 0) {
        addonWrapper.find('.cart-add-button').show()
        productDiv.find('.cart-amount').val(1)
    } else {
        if (update) {
            addonWrapper.find('button').hide()
            addonWrapper.find('.cart-update-button').show()
        } else {
            addonWrapper.find('.cart-increase-button').show()
            addonWrapper.find('.cart-decrease-button').show()
        }
    }
    if (!update)
        updateCartInfo(productDiv, dataQuantity)
}

function updateCartInfo(productDiv, amount) {
    if (amount == 0) {
        productDiv.find('.in-cart-info span').html('')
        productDiv.find('.in-cart-info').hide()
    } else if (amount > 0) {
        productDiv.find('.in-cart-info span').html(amount)
        productDiv.find('.in-cart-info').show()
    }
}

$(document).ready(function () {
    var CONTAINER = $('.products:not(.products-top)')
    updateProductsData(CONTAINER)
    addElements(CONTAINER)
})

$(document).on("ShoptetDOMContentLoaded", (event) => {
    var CONTAINER = $('.products:not(.products-top)')
    updateProductsData(CONTAINER)
    addElements(CONTAINER)
})


$(document).on("ShoptetCartUpdated", (event) => {
    var CONTAINER = $('.products:not(.products-top)')
    updateProductsData(CONTAINER)
})

