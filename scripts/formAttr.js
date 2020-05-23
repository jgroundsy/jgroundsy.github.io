$(document).ready(function(){
    $("#form-message").on("input", function(){
        var charCount = $("#form-message").val().length;
        $("#charcount").html("Characters left: " + (255 - charCount));

    })
})