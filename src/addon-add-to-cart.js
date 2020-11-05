import "./addon-add-to-cart.scss"

function updateProducts() {
    let container = $('.products:not(.products-top)')
    container.find(".product .pr-action:not(:has( .quantity.addons))")
        .prepend(`
        <span class="quantity addons">
            <input type="text" name="amount" value="1" class="amount" autocomplete="off" data-decimals="0" data-max="9999" data-min="1">
            <span class="increase" title="Zvýšit množství"></span>
            <span class="decrease" title="Snížit množství"></span>
        </span>
    `)

    $(".product").removeClass("in-cart")
    $(".product > .p .in-cart-info").remove()
    $(".product").attr("data-quantity", "0")

    var cart = dataLayer[0].shoptet.cart
    cart.forEach(function (product) {
        var product_div = container.find(
            '.product .p-code > span:contains("' + product.code + '")'
        ).closest(".product")
        product_div.find('.p').addClass("in-cart")
        product_div.attr("data-quantity", product.quantity)
        product_div.find('.p').append(
            '<span class="in-cart-info">' +
            product.quantity +
            " ks v košíku</span>"
        )
    })
}

function animateAddToCartButton(form) {
    var btn = $(form).find("button.add-to-cart-button")

    btn.animate(
        {
            opacity: "0.1",
        },
        1000,
        "linear",
        function () {
            $(this).addClass("added-to-cart")
            $(this).find("span").text("Přidáno")
        }
    )
    btn.animate(
        {
            opacity: "1",
        },
        2000,
        "linear"
    )

    setTimeout(function () {
        updateProducts()
        btn.animate(
            {
                opacity: "0.1",
            },
            1000,
            "linear",
            function () {
                btn.removeClass("added-to-cart")
                btn.find("span").text("Do košíku")
            }
        )
        btn.animate(
            {
                opacity: "1",
            },
            2000,
            "linear"
        )
    }, 2200)
}

$(document).ready(function () {
    updateProducts()
})

$(document).on("ShoptetDOMContentLoaded", (event) => {
    updateProducts()
})

$(document).on("ShoptetCartUpdated", (event) => {
    animateAddToCartButton(event.target)
})
