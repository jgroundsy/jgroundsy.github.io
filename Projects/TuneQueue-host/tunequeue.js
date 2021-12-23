import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import {getDatabase, ref, set, child, update, remove, get} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js"

$( document ).ready(function() {
    //FIREBASE INITIALIZATION
          
    const firebaseConfig = {
        apiKey: "AIzaSyDQg6bOj4VTcTXh66AbRUrN9GS9aWQBcaI",
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

    //END FIREBASE INITIALIZATION 

   const getUrlParameter = (sParam) => {
     let sPageURL = window.location.search.substring(1),
         sURLVariables = sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split('#') : [],
         sParameterName,
         i;
     let split_str = window.location.href.length > 0 ? window.location.href.split('#') : [];
     sURLVariables = split_str != undefined && split_str.length > 1 && split_str[1].length > 0 ? split_str[1].split('&') : [];
     for (i = 0; i < sURLVariables.length; i++) {
         sParameterName = sURLVariables[i].split('=');
         if (sParameterName[0] === sParam) {
             return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
         }
     }
 };

   // Get Access Token
   var accessToken;
   localStorage.setItem('accessToken', getUrlParameter('access_token'));
   set(ref(db, 'accessKey'), localStorage.getItem('accessToken'));

   let client_id = '469bd5869aed44cea1231106e409a209';
   let redirect_uri = 'https%3A%2F%2Fjgroundsy.github.io%2FProjects%2FTuneQueue-host%2Findex.html'; //https%3A%2F%2Fjgroundsy.github.io%2FProjects%2FTuneQueue%2Findex.html' 'http%3A%2F%2Flocalhost%3A5500%2F'

   const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=user-modify-playback-state&redirect_uri=${redirect_uri}`;

    if(!localStorage.getItem('accessToken') || localStorage.getItem('accessToken') == null || localStorage.getItem('accessToken') == undefined || localStorage.getItem('accessToken') == "" || localStorage.getItem('accessToken') == "undefined"){
        window.location.replace(redirect);
    }else{
        accessToken = localStorage.getItem('accessToken');

        console.log(accessToken);
    }

   //Search button click
   $('#submit-search').click(function(){
       var searchString = $('#search-track').val();
       var searchQuery = encodeURI(searchString);

       $.ajax({
        url: `https://api.spotify.com/v1/search?q=${searchQuery}&type=track`,
        type: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + accessToken
        },
        success: function(data) {
            $('.track').remove();
            var queryLength = data.tracks.items.length;
            var count = 0;
            const queryMax = 20;

            while(count < queryMax && count < queryLength){
                var id = data.tracks.items[count].id;
                var image = data.tracks.items[count].album.images[0].url;
                var name = data.tracks.items[count].name;
                var artistCount = data.tracks.items[count].artists.length;
                var artists = '';
                var isExplicit = data.tracks.items[count].explicit;

                for(var i = 0; i < artistCount; i++){
                    artists += (", " + data.tracks.items[count].artists[i].name);
                }

                var trackElement = document.createElement('div');
                trackElement.className = 'track'
                trackElement.id = (id);

                trackElement.innerHTML = ("<img class='track-img' src='" + image + "'> <h1>" + name + "</h1> <h2>" + artists.substring(2) + "</h2> <div class='track-indicator'></div>");

                if(isExplicit){
                    trackElement.innerHTML += "<img src='images/explicit.png' class='explicit-icon'/>";
                }
                $('#track-list').append(trackElement);

                count++
            }
        }
       });
   });

   //Add selected track to the current user's queue
   $(document).on('click touchend', '.track', function(){
    var id = $(this).attr('id');
    var name = $(this).find('h1').text();
    var artists = $(this).find('h2').text();
    var image = $(this).find('img').attr('src');
    
    $.ajax({
        type: 'POST',
        url:'https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%3A'+id,
        headers: {'Authorization': "Bearer " + accessToken},
        success: function(data) {
            $('#'+id).find('div.track-indicator').animate({
                left: '+=350px'
            },300, function(){
            $('#'+id).find('div.track-indicator').animate({
                opacity: 0
            }, function(){
            $('#'+id).find('div.track-indicator').css({
                left: '-350px',
                opacity: 1
            });
            $('.track').animate({
                opacity: 0
            }, function(){
                $('.track').remove();
                $('#search-track').val('');
                $('.track').css('opacity','1');
            });
        });
        });
    }
    });
});

//Handle pressing enter button to click search button
$('#search-track').keypress(function(event){
    if(event.keyCode === 13){
        event.preventDefault();
        $('#submit-search').click();
    }
});
}); // End of document.ready
