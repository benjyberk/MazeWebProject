(function () {
    // We place the default values in, if they exist
    var defaults = { "defaultRows": "#rows", "defaultCols": "#columns", "defaultAlgorithm": "#algorithm" };
    for (key in defaults) {
        if (localStorage.getItem(key) != null) {
            $(defaults[key]).val(localStorage.getItem(key));
        }
    }

    $("#btnSave").click(function () {
        // If valid data has been input, we save it
        if ($("#rows").val() > 0 && $("#columns").val() > 0) {
            localStorage.setItem("defaultRows", $("#rows").val());
            localStorage.setItem("defaultCols", $("#columns").val());
            localStorage.setItem("defaultAlgorithm", $("#algorithm").val());
            alert("Settings Saved");
        } else {
            // Otherwise, we alert that invalid data was entered
            alert("Row and column values must be non-negative integers, try again.");
        }
    })
})();