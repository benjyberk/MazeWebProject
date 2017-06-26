/*
 * The navbar script generates the navbar html dynamically
 */
(function () {
    // A list of all navbar elements
    var elements = ['Home', 'Single Game', 'Multiplayer Game', 'Settings', 'Highscores', 'Register', 'Login'];
    var navbarHtml = '';
    var username, loggedIn;

    // If the user is logged in, a different navbar is shown
    if (sessionStorage.getItem("username") != null) {
        loggedIn = true;
        username = sessionStorage.getItem("username");
        var find = elements.indexOf("Register");
        elements.splice(find, 2);
    } else {
        loggedIn = false;
    }
    
    // The starting navbar elements
    navbarHtml += '<nav class="navbar navbar-inverse" role="navigation">'
    navbarHtml += '<div class="container-fluid">'
    navbarHtml += '<ul class="nav navbar-nav">';

    // We loop through every element and add it to the navbar
    for (var i = 0; i < elements.length; i++) {
        // If we get to register, we start adding elements on the right
        if (elements[i] == "Register") {
            navbarHtml += '</ul><ul class="nav navbar-nav navbar-right">';
        }
        if (i != 0) {
            navbarHtml += '<li><a href="/View/' + elements[i].replace(" ", "_") + '.html">' + elements[i] + '</a></li>';
        }
        else {
            navbarHtml += '<li class="navbar-header"><a class="navbar-brand" href="/View/index.html">' + elements[i] + '</a></li>';
        }
    }

    // If we are logged in, we add different elements
    if (loggedIn == true) {
        navbarHtml += '</ul><ul class="nav navbar-nav navbar-right">';
        navbarHtml += '<li><a>Hello ' + username + '</a></li>';
        navbarHtml += '<li><a href="javascript:;" onclick="logout()">Logout</a></li>'
    }

    navbarHtml += '</ul></div></nav>'

    $("#Maze-Navbar").html(navbarHtml);
})();

// The logout function needs to be global
function logout() {
    sessionStorage.removeItem("username");
    document.location.href = "/View/index.html";
}

