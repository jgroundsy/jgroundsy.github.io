$('document').ready(function(){
    if ($(this).find('h1').html() != null){
        var week = $(this).find('h1').html().replace(" ", "-");
        $("#header").css("background-image", ("url(/Projects/CGT116/" + week + "/banner.jpg)"));
    }
});
