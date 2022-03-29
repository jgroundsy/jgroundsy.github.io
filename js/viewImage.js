//user clicked on an image that is able to be viewed
$('.view').click(function () {
    var curtain = document.createElement("div");
    var image = document.createElement("img");
    image.className = "zoom-img";
    image.setAttribute('src', $(this).attr('src'));
    curtain.className = "curtain";
    curtain.appendChild(image);
    document.body.appendChild(curtain);

    $('.zoom-img').css({
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
    });

    $('.curtain').css({
        position: 'fixed',
        left: '0',
        top: '0',
        'background-color': 'rgba(0,0,0,0.8)',
        width: '100vw',
        height: '100vh',
        'z-index': '3',
        cursor: 'pointer'
    });
});
$(document).on('click', '.curtain', function () {
    $(this).remove();
});
