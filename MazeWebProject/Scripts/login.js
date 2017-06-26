(function () {
    // We tie the login command to the submit button
    $("#btnSubmit").click(function () {
        // The url is constructed
        apiUrl = "../api/Members/" + $("#username").val() + "/" + $("#pwd").val();

        // The GET request is performed
        $.getJSON(apiUrl).done(function (data) {
            // If a successful action is returned, we redirect to the index
            sessionStorage.setItem("username", data);
            document.location.href = "/View/index.html";
        }).fail(function (data) {
            console.log(data);
            // If an invalid response is returned, we display the message
            if (data.status == 401 || data.status == 404) {
                alert("Invalid Username or Password. Try again.");
            }
        });
    })
})();