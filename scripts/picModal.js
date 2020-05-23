function openModal(){
    document.getElementById("picModal").style.display = "block";
}

function closeModal(){
    document.getElementById("picModal").style.display = "none";
}

var slideIndex = 1;
showSlides(slideIndex);

function changeSlide(n){
    showSlides(slideIndex += n);
}

function currentSlide(n){
    showSlides(slideIndex = n);
}

function showSlides(n){
    var i;
    var slides = document.getElementsByClassName("picSlides");
    var dots = document.getElementsByClassName("thumbnail");
    var captionTxt = document.getElementById("caption");

    if(n > slides.length){
        slideIndex = 1;
    }

    if(n < 1){
        slideIndex = slides.length;
    }

    for (i = 0; i < slides.length; i++){
        slides[i].style.display = "none";
    }

    for(i = 0; i < dots.length; i++){
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    captionTxt.innerHTML = dots[slideIndex - 1].alt;
}