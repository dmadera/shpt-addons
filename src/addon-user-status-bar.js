import "./addon-user-status-bar.scss"
import data from './datalayer'

function updateUserStatus() {
    var phone = $(
        ".top-navigation-bar .top-navigation-contacts .project-phone"
    ).clone()
    var email = $(
        ".top-navigation-bar .top-navigation-contacts .project-email"
    ).clone()
    var login = $(".top-navigation-bar .top-navigation-tools .login").clone()
    login.addClass("addon")
    phone.removeAttr("href")
    email.attr("target", "_blank")
    var container = $("<div>")
    container.addClass("top-navigation-contacts addon")
    container.append(phone)
    container.append(email)

    var loginContainer = $('<div class="addon">')

    if (data.isUserLoggedIn()) {
        loginContainer.append($('<span>').append(data.getUser().name))
        loginContainer.append('<span class="separator">|</span>')
        loginContainer.append(
            $('<a href="/klient/" title="Klientské centrum">Můj účet</a>')
        )
    } else {
        loginContainer.append($('<a href="/login/" class="login">Přihlášení</a>'))
        loginContainer.append('<span class="separator">|</span>')
        loginContainer.append(
            $('<a href="/registrace/" class="register">Registrace</a>')
        )
    }

    $("#header .search").prepend(container)
    $("#header .navigation-buttons").prepend(loginContainer)
}

$(document).ready(function () {
    dataLayer[0].shoptet.customer.name = $('.user-action-login').find('p:first-child strong').html()
    updateUserStatus()
})
