var post;

function openZoom(name){
    document.getElementById("picZoom").style.display = "block";
    post = document.getElementById(name);

    post.style.display = "block";
}

function closeZoom(){
    document.getElementById("picZoom").style.display = "none";
    post.style.display = "none";
    
}