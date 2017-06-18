var elements = ['Home', 'Single Game', 'Multiplayer Game', 'Settings', 'Highscores', 'Register', 'Login'];

var navbarHtml = '<nav class="navbar navbar-inverse" role="navigation"><div class="container-fluid"><ul class="nav navbar-nav">';
for (var i = 0; i < elements.length; i++) {
    if (i == elements.length - 2) {
        navbarHtml += '</ul><ul class="nav navbar-nav navbar-right">';
    }
    if (i != 0) {
        navbarHtml += '<li><a href="/View/' + elements[i].replace(" ", "_") + '.html">' + elements[i] + '</a></li>';
    }    
    else {
        navbarHtml += '<li class="navbar-header"><a class="navbar-brand" href="/View/index.html">' + elements[i] + '</a></li>';
    }
}

navbarHtml += '</ul></div></nav>'

$("#Maze-Navbar").html(navbarHtml);