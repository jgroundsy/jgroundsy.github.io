$(document).ready(function(){
    window.scrollTo(0,0);
    $('#popup-curtain').animate({'opacity' : 0.8});

    $('#popup').animate({
        top: '+50%'
    });

    $('.btn').click(function(){
        event.preventDefault();
        $("#popup").animate({
            top: '-50%'
        });
        $('#popup-curtain').animate({
            'opacity' : '0'
        });
        $('#popup-curtain').promise().done(function(){
            $('#popup-curtain').css('display', 'none');
        });

        $('body').css('overflow', 'visible');
    });
});