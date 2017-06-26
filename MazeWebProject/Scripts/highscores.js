(function () {
    apiUrl = "../api/Members";
    var oneRow;
    $.getJSON(apiUrl).done(
        function (data) {
            $("#loading").css("display", "none");
            for (var i = 0; i < data.length; i++) {
                oneRow = '<tr><th scope="row">' + (i + 1) + '</th>';
                oneRow += '<td>' + data[i].Username + '</td>'
                oneRow += '<td>' + data[i].Wins + '</td>'
                oneRow += '<td>' + data[i].Losses + '</td></tr>\n'
                $("#listbody").append(oneRow);
            }
        }).fail(function (data) {
            $("#loading").style.display = 'none';
            alert("Failed to connect to server, try again later.");
            console.log(data);
        })

})();