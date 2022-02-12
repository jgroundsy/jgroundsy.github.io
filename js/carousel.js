var carouselIndex = 1;
displayItem(carouselIndex);

//prevent user from clicking too fast and skipping over projects when they didn't mean to
var nowTime;
var waitTime = 0;

function moveCarousel(n) {
    nowTime = new Date().getTime();
    if (nowTime - waitTime < 50) {
        return;
    } else {
        waitTime = nowTime;
    }
    displayItem(carouselIndex += n);
}

function currentItem(n) {
    nowTime = new Date().getTime();
    if (nowTime - waitTime < 50) {
        return;
    } else {
        waitTime = nowTime;
    }
    displayItem(carouselIndex = n);
}

function displayItem(n) {
    carouselIndex = n;
    var items = document.getElementsByClassName('carousel-item');
    var dots = document.getElementsByClassName('dot');

    //go back to the first item in the carousel
    if (n > items.length) {
        carouselIndex = 1;
    }
    //jump to the last item in the carousel
    if (n < 1) {
        carouselIndex = items.length;
    }
    //hide all carousel items
    $('.carousel-item').css('display', 'none');
    //deactivate all carousel indicator dots
    $('.dot').removeClass(' active');

    items[carouselIndex - 1].style.display = 'flex';
    dots[carouselIndex - 1].className += " active";
}