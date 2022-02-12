
var projectLimit = 4;
var mobileDevice;
var viewingProject = false;

//check if user is viewing on mobile device
if (/Mobi|Android/i.test(navigator.userAgent)) {
    //lower the amount of projects that can be listed on one slide of carousel
    //may need to update this based on the resolution of the current device browser. (ipads vs iphones)
    if ($(window).height() == 1080 && $(window).width() == 810) {
        mobileDevice = 'tablet';
        projectLimit = 2;
        loadProjects();
    } else {
        mobileDevice = 'phone';
        projectLimit = 1;
        loadProjects();
    }
} else {
    loadProjects();
}

function loadMobileStyling() {

    if (mobileDevice == 'iphone') {
        $('.project-grid').css('margin-left', '.5em');
        $('.prev').css('margin-left', '-3.5%');
        $('.next').css('margin-left', '-5%');

        $('#defaultCanvas0').css({
            'width': '110%',
            'height': '110%',
            top: '60%'
        });
    }

    if (mobileDevice == 'tablet') {
        $('.project-grid').css('margin-left', '3em');
        $('.prev').css('margin-left', '-.5%');
        $('.next').css('margin-left', '-4%');

        $('#defaultCanvas0').css({
            'width': '110%',
            'height': '110%',
            top: '60%'
        });
    }

}

function loadProjects() {
    $.getJSON('/js/projects.json', function (data) {
        let projectCount = Object.keys(data).length;
        let currentGrid = 0;

        for (let i = 0; i < projectCount; i++) {
            let title = data[i].title;
            let subtitle = data[i].subtitle;
            let description = data[i].description;
            let bgImage = data[i].background_image;
            let tools = data[i].tools;
            let type = data[i].type;
            let url = data[i].url;

            let element = document.createElement('div');
            element.id = 'project-' + i;
            element.className = 'project-box';
            element.setAttribute('onclick', "viewProject('" + url + "')");

            element.innerHTML = ("<img class='project-image' src='" + bgImage + "'/>" +
                "<div class='project-info'>" +
                "<h1 class='project-header'>" + title + "</h1>" +
                "<h2 class='project-subheader'>" + subtitle + "</h2>" +
                "<p class='project-description'>" + description + "</p></div>"
            );

            let toolsElement = document.createElement('div');
            toolsElement.id = 'tools-' + i;
            toolsElement.className = 'project-tools';

            element.appendChild(toolsElement);

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

        let remainder = (projectLimit * currentGrid) - projectCount;

        if (remainder != 0) {
            for (let x = remainder; x > 0; x--) {
                let fillerElement = document.createElement('div');
                fillerElement.id = 'filler-' + (remainder - x);
                fillerElement.className = 'project-box filler';

                $('#grid-' + currentGrid).append(fillerElement);
            }
        }

        if (mobileDevice) {
            loadMobileStyling(mobileDevice);
        }
    });
}

$(window).scroll(function () {
    if (viewingProject == true) {
        closeProject();
    }
});

function viewProject(url) {
    viewingProject = true;
    $('#project-iframe').attr('src', url);

    $('#navbar').css('background-image', 'url(./images/navbg.png)');

    $('#project-iframe').css('display', 'block');
    $('#project-iframe').animate({
        opacity: 1
    }, 500);

    $('#project-close').css('display', 'block');
    $('#project-close').animate({
        opacity: 1
    }, 500);
}

function closeProject() {
    viewingProject = false;
    $('#project-iframe').animate({
        opacity: 0
    }, 500).promise().done(function () {
        $('#project-iframe').css('display', 'none');
    });

    $('#project-iframe').attr('src', '');

    $('#navbar').css('background-image', 'none');

    $('#project-close').animate({
        opacity: 0
    }, 500).promise().done(function () {
        $('#project-close').css('display', 'none');
    })
}

$(document).on('click', '#project-close', function () {
    closeProject();
});