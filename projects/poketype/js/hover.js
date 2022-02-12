//use delegated hover event since divs are populated dynamically
$(document).on('mouseenter', '.pokemon-container', function(){
    $(this).animate({'opacity' : 1.0}, 200);
    $(this).css('box-shadow', '0 0 10px rgba(0,0, 0, 1)');
}).on('mouseleave', '.pokemon-container', function(){
    $(this).animate({'opacity' : 0.7}, 200);
    $(this).css('box-shadow', '');
});