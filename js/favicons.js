let favicons = [
    { href: "/images/favicons/apple-touch-icon.png", sizes: "152x152", rel: "apple-touch-icon" },
    { href: "/images/favicons/favicon-32x32.png", sizes: "32x32", rel: "icon", type: "image/png" },
    { href: "/images/favicons/favicon-16x16.png", sizes: "16x16", rel: "icon", type: "image/png" },
    { href: "/images/favicons/site.webmanifest", rel: "apple-touch-icon" }

]

$(document).ready(function () {
    let docHead = document.querySelector("head"); //select document head

    $(".header").load("/scripts/header.html"); //import navigation bar

    // $("footer").load("/scripts/footer.html"); //import page footer

    for (let i = 0; i < favicons.length; i++) { //apply favicon to the document head
        let icon = document.createElement("link");

        if (favicons[i].rel) {
            icon.setAttribute("rel", favicons[i].rel);
        }
        if (favicons[i].href) {
            icon.setAttribute("href", favicons[i].href);
        }
        if (favicons[i].sizes) {
            icon.setAttribute("sizes", favicons[i].sizes);
        }
        if (favicons[i].type) {
            icon.setAttribute("type", favicons[i].type);
        }

        docHead.appendChild(icon);
    }
});