(function () {
    $("#submit").click(function () {
        // Before submitting the registration, we check that the password matches the validation
        if ($("#confirmpwd").val() != $("#pwd").val()) {
            alert("Password and Password Confirmation must match!");
        } else {
            apiUrl = "../api/Members/";
            // We perform an HTTP-POST request
            $.post(apiUrl,
            {
                Username: $("#username").val(),
                Password: $("#pwd").val(),
                Email: $("#email").val(),
            },
            // We set the username returned from the server
            function (data) {
                console.log(data);
                sessionStorage.setItem("username", data.Username);
                document.location.href = "/View/index.html";
            }).fail(function (data) {
                var errorString = "Error creating new user. Error code was " + data.status + " (" + data.statusText + ")";
                alert(errorString);
            });
        }
    })
})();