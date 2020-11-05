import "./addon-add-to-cart-enhanced.scss"
import data from './datalayer'

var PREVENT_BLUR = false

function processUpdateForm(productDiv, action = 'update') {
    const form = $('<form method="post" class="pr-action">')
    const formWrapper = productDiv.find('.form-container')
    let amount = productDiv.find('.cart-amount').val()
    form.attr('action', '/action/Cart/setCartItemAmount/')

    if (action == 'add' && amount > 0) {
        form.attr('action', '/action/Cart/addCartItem/')
    } else if (amount == 0) {
        action = 'delete'
        form.attr('action', '/action/Cart/deleteCartItem/')
        productDiv.find('.cart-amount').val(1)
    }
    const code = productDiv.attr('data-cart-code')
    const priceId = productDiv.attr('data-cart-priceid')
    const itemId = productDiv.attr('data-cart-itemid')

    form.append($('<input type="hidden" name="itemId" value="">').val(itemId))
    form.append($('<input type="hidden" name="priceId">').val(priceId))
    form.append($('<input type="hidden" name="amount">').val(amount))
    console.log('Injecting form: ', action)
    formWrapper.html(form)
    formWrapper.find('form').submit()
    formWrapper.html('')
}

function addElements(container) {
    container.find(".product").each(function () {
        const productDiv = $(this)
        if (productDiv.find('.addon.add-to-cart-enhanced').length > 0) return

        let wrapper = $('<div class="addon add-to-cart-enhanced">')
        wrapper.append('<div class="form-container">')
        const buttonsWrapper = $('<div class="cart-buttons-wrapper">')
        const buttonIncDecWrapper = $('<div class="cart-inc-dec-buttons-wrapper">')
        buttonIncDecWrapper
            .append($('<button class="cart-decrease-button">'))
            .append($('<button class="cart-increase-button">'))
        buttonsWrapper
            .append($('<input type="text" class="cart-amount" autocomplete="off" data-decimals="0" data-min="0" data-max="9999">'))
            .append($('<button class="cart-add-button">Koupit</button>'))
            .append($('<button class="cart-update-button">Nastavit</button>'))
            .append(buttonIncDecWrapper)
        wrapper.append(buttonsWrapper)
        productDiv.find('.p-bottom').append(wrapper)
        productDiv.find('.p').append($('<span class="in-cart-info">').append($('<span>')).append('ks v košíku'))

        let quantity = productDiv.attr('data-cart-quantity')
        productDiv.find('.cart-amount').val(quantity == 0 ? 1 : quantity)
        if (quantity > 0) {
            showIncDesButton(productDiv)
        } else {
            showAddButton(productDiv)
        }

        productDiv.find('.cart-amount')
            .on('focus', function (e) {
                e.preventDefault()
                const productDiv = $(this).closest('.product')
                PREVENT_BLUR = false
                const addButton = productDiv.find('.cart-add-button')
                if (!addButton.is(':visible')) {
                    productDiv.attr('data-prev-edit', $(this).val())
                    showUpdateButton(productDiv)
                } else {
                    productDiv.attr('data-prev-edit', 0)
                }
            })
            .on('blur', function (e) {
                if (PREVENT_BLUR) {
                    return
                }
                const productDiv = $(this).closest('.product')
                const dataAmount = productDiv.attr('data-prev-edit')
                if (dataAmount > 0) {
                    productDiv.find('.cart-amount').val(dataAmount)
                    showIncDesButton(productDiv)
                } else {
                    showAddButton(productDiv)
                }
            })
            .on('keypress', function (e) {
                const productDiv = $(this).closest('.product')
                if (e.which != 13) {
                    return
                }
                const addButton = productDiv.find('.cart-add-button')
                const updateButton = productDiv.find('.cart-update-button')
                if (addButton.is(':visible')) addButton.trigger('click')
                else updateButton.trigger('mousedown')
            })

        productDiv.find('.cart-add-button').click(function (e) {
            e.preventDefault()
            const productDiv = $(this).closest('.product')
            const val = productDiv.find('.cart-amount').val()
            processUpdateForm(productDiv, 'add')
            updateCartInfo(productDiv, val)
            showIncDesButton(productDiv)
        })

        productDiv.find('.cart-update-button').on('mousedown', function (e) {
            e.preventDefault()
            PREVENT_BLUR = true
            const productDiv = $(this).closest('.product')
            const val = productDiv.find('.cart-amount').val()
            const dataAmount = productDiv.find('.cart-inc-dec-buttons-wrapper').attr('data-amount')
            if (val == dataAmount) {
                e.preventDefault()
                return
            }
            processUpdateForm(productDiv)
            updateCartInfo(productDiv, val)
            if (val == 0) {
                showAddButton(productDiv)
            } else {
                showIncDesButton(productDiv)
            }
        })

        productDiv.find('.cart-inc-dec-buttons-wrapper').on('mouseenter', function (e) {
            e.preventDefault()
            const productDiv = $(this).closest('.product')
            $(this).attr('data-amount', productDiv.find('.cart-amount').val())
        })

        productDiv.find('.cart-inc-dec-buttons-wrapper').on('mouseleave', function (e) {
            e.preventDefault()
            const productDiv = $(this).closest('.product')
            productDiv.find('.cart-update-button').trigger('mousedown')
        })

        productDiv.find('.cart-increase-button').click(function (e) {
            e.preventDefault()
            const productDiv = $(this).closest('.product')
            const val = parseInt(productDiv.find('.cart-amount').val())
            const newVal = val + 1
            productDiv.find('.cart-amount').val(newVal)
            updateCartInfo(productDiv, newVal)
        })

        productDiv.find('.cart-decrease-button').click(function (e) {
            e.preventDefault()
            const productDiv = $(this).closest('.product')
            const val = parseInt(productDiv.find('.cart-amount').val())
            const newVal = val == 0 ? 0 : val - 1
            productDiv.find('.cart-amount').val(newVal)
            if (newVal == 0) {
                const updateButton = productDiv.find('.cart-update-button')
                updateButton.trigger('mousedown')
                return
            }
            updateCartInfo(productDiv, newVal)
        })
    })
}

function updateProductsData(container) {
    console.log('Updating products data')
    var items = []
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
        let quantity = 0,
            itemId = '',
            cartIndex = -1

        for (const [index, product] of data.getCart().entries()) {
            if (product.code == productCode) {
                itemId = $(items.get(index)).find('input[name="itemId"]').val()
                quantity = $(items.get(index)).find('input[name="amount"]').val()
                cartIndex = index
                break
            }
        }

        productDiv.attr('data-cart-code', productCode)
        productDiv.attr('data-cart-priceid', productPriceId)
        productDiv.attr('data-cart-index', cartIndex)
        productDiv.attr('data-cart-quantity', quantity)
        productDiv.attr('data-cart-itemid', itemId)

        productDiv.find('.cart-amount').val(quantity == 0 ? 1 : quantity)
        if (quantity == 0) showAddButton(productDiv)
        else showIncDesButton(productDiv)
        updateCartInfo(productDiv, quantity)
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
    addElements(CONTAINER)
    updateProductsData(CONTAINER)
})

$(document).on("ShoptetDOMContentLoaded", (event) => {
    var CONTAINER = $('.products:not(.products-top)')
    addElements(CONTAINER)
    updateProductsData(CONTAINER)
})


$(document).on("ShoptetCartUpdated", (event) => {
    var CONTAINER = $('.products:not(.products-top)')
    addElements(CONTAINER)
    updateProductsData(CONTAINER)

})