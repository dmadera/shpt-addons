export default {
    getCart() {
        return dataLayer[0].shoptet.cart
    },

    isUserLoggedIn() {
        return this.getUser() || false
    },

    getUser() {
        var user = null
        if (dataLayer[0].shoptet.customer.registered === true) {
            user = {
                name: $('.user-action-login').find('p:first-child strong').html()
            }
        }
        return user
    },

    isObjectEmpty(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object
    },

    setAmount(code, quantity) {
        const cart = dataLayer[0].shoptet.cart
        if (quantity == 0) {
            this.removeCartItem(code)
            return
        }

        cart.forEach(element => {
            if (element.code == code) {
                element.quantity = quantity
            }
        });
    },

    removeCartItem(code) {
        let cart = dataLayer[0].shoptet.cart
        for (let index = 0; index < cart.length; index++) {
            const element = cart[index];
            if (element.code == code) {
                cart.splice(index, 1);
                break;
            }
        }
    }
}
