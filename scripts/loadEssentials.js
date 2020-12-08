let favicons = [
    {href: "/images/favicons/apple-touch-icon-57x57.png", sizes: "57x57", rel: "apple-touch-icon-precomposed"},
    {href: "/images/favicons/apple-touch-icon-60x60.png", sizes: "60x60", rel: "apple-touch-icon-precomposed"},
    {href: "/images/favicons/apple-touch-icon-72x72.png", sizes: "72x72", rel: "apple-touch-icon-precomposed"},
    {href: "/images/favicons/apple-touch-icon-76x76.png", sizes: "76x76", rel: "apple-touch-icon-precomposed"},
    {href: "/images/favicons/apple-touch-icon-114x114.png", sizes: "114x114", rel: "apple-touch-icon-precomposed"},
    {href: "/images/favicons/apple-touch-icon-120x120.png", sizes: "120x120", rel: "apple-touch-icon-precomposed"},
    {href: "/images/favicons/apple-touch-icon-144x144.png", sizes: "144x144", rel: "apple-touch-icon-precomposed"},
    {href: "/images/favicons/apple-touch-icon-152x152.png", sizes: "152x152", rel: "apple-touch-icon-precomposed"},
    {href: "/images/favicons/favicon-16x16.png", sizes: "16x16", rel: "icon"},
    {href: "/images/favicons/favicon-32x32.png", sizes: "32x32", rel: "icon"},
    {href: "/images/favicons/favicon-96x96png", sizes: "96x96", rel: "icon"},
    {href: "/images/favicons/favicon-128.png", sizes: "128x128", rel: "icon"},
    {href: "/images/favicons/favicon-196x196.png", sizes: "196,196", rel: "icon"}
]

$( document ).ready(function(){
    let docHead = document.querySelector("head"); //select document head

    $(".navbar").load("/scripts/navbar.html"); //import navigation bar
    $("footer").load("/scripts/footer.html"); //import page footer

    for(let i = 0; i < favicons.length; i++){ //apply favicon to the document head
        let icon = document.createElement("link");

        icon.setAttribute("rel", favicons[i].rel);
        icon.setAttribute("href", favicons[i].href);
        icon.setAttribute("sizes", favicons[i].sizes);
        icon.setAttribute("type", favicons[i].href);

        docHead.appendChild(icon); 
    }
});