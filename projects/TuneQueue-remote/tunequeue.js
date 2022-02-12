import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getDatabase, ref, set, child, update, remove, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js"

$(document).ready(function () {
    var firebaseApiKey = new URLSearchParams(window.location.search).get('key');
    var playlistID = new URLSearchParams(window.location.search).get('playlist');
    var accessToken;

    //FIREBASE INITIALIZATION   
    const firebaseConfig = {
        apiKey: firebaseApiKey,
        authDomain: "tunequeue-56998.firebaseapp.com",
        databaseURL: "https://tunequeue-56998-default-rtdb.firebaseio.com",
        projectId: "tunequeue-56998",
        storageBucket: "tunequeue-56998.appspot.com",
        messagingSenderId: "724183987327",
        appId: "1:724183987327:web:71c582aa32401f29373b4a",
        measurementId: "G-41D8NGBHD8"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    const db = getDatabase();
    const dbRef = ref(getDatabase());

    get(child(dbRef, 'accessKey')).then((snapshot) => {
        if (snapshot.exists()) {
            window.localStorage.setItem('accessKey', snapshot.val());
            accessToken = localStorage.getItem('accessKey');
        } else {
            accessToken = localStorage.getItem('accessKey');
        }
    }).catch((error) => {
        console.error(error);
    });
    //END FIREBASE INITIALIZATION 

    //Search button click
    $('#submit-search').click(function () {

        //zoomout to initial device screen size after searching for a track
        $("meta[name='viewport']").attr('content', 'width=device-width,height=device-height,initial-scale=1.0,maximum-scale=1.0');
        $(window).resize();
        $('.track').remove();
        var searchString = $('#search-track').val();
        var searchQuery = encodeURI(searchString);

        $.ajax({
            url: `https://api.spotify.com/v1/search?q=${searchQuery}&type=track`,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            success: function (data) {
                var queryLength = data.tracks.items.length;
                var count = 0;
                const queryMax = 20;

                while (count < queryMax && count < queryLength) {
                    var id = data.tracks.items[count].id;
                    var image = data.tracks.items[count].album.images[0].url;
                    var name = data.tracks.items[count].name;
                    var artistCount = data.tracks.items[count].artists.length;
                    var artists = '';
                    var isExplicit = data.tracks.items[count].explicit;

                    for (var i = 0; i < artistCount; i++) {
                        artists += (", " + data.tracks.items[count].artists[i].name);
                    }

                    var trackElement = document.createElement('div');
                    trackElement.className = 'track'
                    trackElement.id = (id);

                    trackElement.innerHTML = ("<img class='track-img' src='" + image + "'> <h1>" + name + "</h1> <h2>" + artists.substring(2) + "</h2> <div class='track-indicator'></div>");

                    if (isExplicit) {
                        trackElement.innerHTML += "<img src='images/explicit.png' class='explicit-icon'/>";
                    }
                    $('#track-list').append(trackElement);

                    count++
                }

                //reposition track list for correct viewing on all devices
                $('#track-list').css({
                    'margin-left': $('#track-list').width() / -2
                });
            }
        });
    });

    //Add selected track to the current user's queue
    $(document).on('click', '.track', function () {
        var id = $(this).attr('id');
        var name = $(this).find('h1').text();
        var artists = $(this).find('h2').text();
        var image = $(this).find('img').attr('src');

        $.ajax({
            type: 'POST',
            url: 'https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%3A' + id,
            headers: { 'Authorization': "Bearer " + accessToken },
            success: function (data) {
                $('#' + id).find('div.track-indicator').animate({
                    left: '+=350px'
                }, 300, function () {
                    $('#' + id).find('div.track-indicator').animate({
                        opacity: 0
                    }, function () {
                        $('#' + id).find('div.track-indicator').css({
                            left: '-350px',
                            opacity: 1
                        });

                        $('.track').animate({
                            opacity: 0
                        }, function () {
                            $('.track').remove();
                            $('#search-track').val('');
                            $('.track').css('opacity', '1');
                        });
                    });
                });

                addTrackToPlaylist(id);
            }
        });
    });


    function addTrackToPlaylist(trackID) {
        $.ajax({
            type: 'POST',
            url: 'https://api.spotify.com/v1/playlists/' + playlistID + '/tracks?uris=spotify%3Atrack%3A' + trackID,
            headers: { 'Authorization': "Bearer " + accessToken }
        });
    }

    //Handle pressing enter button to click search button
    $('#search-track').keypress(function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $('#submit-search').click();
        }
    });

    //Handle pressing enter button to click search button (mobile)
    $('#search-track').keyup(function (event) {
        if (event.which == 13) {
            $('#submit-search').click();
        }
    });

    //Handle loading icon for the various ajax events
    $(document).on({
        ajaxStart: function () {
            $('#loading-icon-wrapper').css('display', 'block').promise().done(function () {
                $("#loading-icon-wrapper").animate({
                    opacity: 1
                }, 400);
            });
        },
        ajaxStop: function () {
            $('#loading-icon-wrapper').animate({
                opacity: 0
            }, 400).promise().done(function () {
                $('#loading-icon-wrapper').css('display', 'none');
            });
        }
    });

}); // End of document.ready
