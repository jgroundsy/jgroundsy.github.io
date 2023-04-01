var projectLimit = Math.floor((window.innerWidth / 365));
var mobile = (/android|iphone|ipad|ipod|blackberry|webos|iemobile|Opera mini/i.test(navigator.userAgent));
var viewingProject = false;


$(document).ready(function () {
    //resize carousel based on how many projects can fit on the screen
    $('#carousel-container').css('width', ((330 * projectLimit) + 'px'));
    $('.project-grid').css('width', $('#carousel-container').css('width'));
    loadProjects();

    if (mobile) {
        let xStart = 0;
        let xEnd = 0;

        $('#carousel-container').on('touchstart', e => {
            xStart = e.changedTouches[0].screenX
        });

        $('#carousel-container').on('touchend', e => {
            xEnd = e.changedTouches[0].screenX
            handleSwipe();
        });

        function handleSwipe() {
            if (xStart > xEnd) {
                moveCarousel(-1);
            }

            if (xStart < xEnd) {
                moveCarousel(1);
            }
        }
    }

    window.addEventListener('resize', function (e) {
        resizeProjects();
    }, true);
});

//detect when window size changes and update how many projects can be displayed.
function resizeProjects() {
    let newLimit = Math.floor((window.innerWidth / 365));

    if (newLimit > projectLimit || newLimit < projectLimit) {
        $('#carousel-container').html("<a class='prev no-select' onclick='moveCarousel(-1)'>&#10094;</a>" +
            "<a class='next no-select' onclick='moveCarousel(1)'>&#10095;</a>" +
            "<div id='carousel-dots'><span class='dot' onclick='displayItem(1)'></span></div>" +
            "<div id='grid-1' class='carousel-item project-grid'></div>");

        $('#carousel-container').css('width', ((330 * newLimit) + 'px'));
        $('.project-grid').css('width', $('#carousel-container').css('width'));
        loadProjects();
        displayItem(1);
    }

    projectLimit = newLimit;
}

function loadProjects() {
    $.getJSON('/js/projects.json', function (data) {
        let projectCount = Object.keys(data).length; //number of projects in json list
        let currentGrid = 0; //current set of projects that is being populated

        for (let i = 0; i < projectCount; i++) {
            let title = data[i].title;
            let subtitle = data[i].subtitle;
            let description = data[i].description;
            let bgImage = data[i].background_image;
            let tools = data[i].tools;
            let type = data[i].type;
            let url = data[i].url;

            //create project element
            let element = document.createElement('div');
            element.id = 'project-' + i;
            element.className = 'project-box';
            //add redirect link to project onclick
            element.setAttribute('onclick', "window.location.href = '" + url + "';");

            //add project information to the project
            element.innerHTML = ("<img class='project-image' src='" + bgImage + "'/>" +
                "<div class='project-info'>" +
                "<h1 class='project-header'>" + title + "</h1>" +
                "<h2 class='project-subheader'>" + subtitle + "</h2>" +
                "<p class='project-description'>" + description + "</p></div>"
            );


            //create tools element
            let toolsElement = document.createElement('div');
            toolsElement.id = 'tools-' + i;
            toolsElement.className = 'project-tools';

            element.appendChild(toolsElement);

            //add tool logo and text to the tools element
            for (let j = 0; j < tools.length; j++) {
                let toolSpan = document.createElement('img');
                toolSpan.id = 'tool-' + j;
                toolSpan.className = 'tool ' + tools[j].split(',')[0];
                toolSpan.src = '/images/tools/' + tools[j].split(',')[0] + '.png'

                let toolSpanText = document.createElement('p');
                toolSpanText.id = 'tooltext-' + j;
                toolSpanText.className = 'tool-text';
                toolSpanText.innerHTML = tools[j].split(',')[1];

                toolsElement.appendChild(toolSpan);
                toolsElement.appendChild(toolSpanText);
            }

            $('#project-' + i).append($('#tools-' + i));

            //check if this is the last project that can fit inside of the grid
            if ((i) % projectLimit == 0) {
                currentGrid++;
            }


            if (!$('#grid-' + currentGrid).length) {
                //increase number of project grids
                let newGrid = document.createElement('div');
                newGrid.id = 'grid-' + currentGrid;
                newGrid.className = 'project-grid carousel-item ';
                $('#carousel-container').append(newGrid);

                //increase number of carousel indicator dots
                let newCarouselDot = document.createElement('span');
                newCarouselDot.className = 'dot';
                newCarouselDot.setAttribute("onclick", "displayItem(" + currentGrid + ")");
                $('#carousel-dots').append(newCarouselDot)
                $('#carousel-dots').css('margin-left', "-" + $('#carousel-dots').width() / 2);
            }

            $('#grid-' + currentGrid).append(element);
        }

        //calculate how many additional projects are needed to fill the grid
        let remainder = (projectLimit * currentGrid) - projectCount;

        //add filler projects 
        if (remainder != 0) {
            for (let x = remainder; x > 0; x--) {
                let fillerElement = document.createElement('div');
                fillerElement.id = 'filler-' + (remainder - x);
                fillerElement.className = 'project-box filler';

                $('#grid-' + currentGrid).append(fillerElement);
            }
        }
    });
}