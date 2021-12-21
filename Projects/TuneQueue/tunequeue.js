$( document ).ready(function() {
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
   const accessToken = getUrlParameter('access_token');

   let client_id = '469bd5869aed44cea1231106e409a209';
   let redirect_uri = 'https%3A%2F%2Fjgroundsy.github.io%2FProjects%2FTuneQueue';

   const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=user-modify-playback-state&redirect_uri=${redirect_uri}`;

   if(accessToken == null || accessToken == "" || accessToken == undefined){
     window.location.replace(redirect);
   }

   ///Current logged in user information
   $.ajax({
    url: `https://api.spotify.com/v1/me`,
    type: 'GET',
    headers: {
        'Authorization' : 'Bearer ' + accessToken
    },
    success: function(data) {
        var displayName = data.display_name;
        var profileImage = data.images[0].url;

        $('#profile-name').text(displayName);
        $('#profile-image').attr('src',profileImage);
    }
});

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
                    trackElement.innerHTML += "<img src='/images/explicit.png' class='explicit-icon'/>";
                }
                $('#track-list').append(trackElement);

                count++
            }
        }
       });
   });

   //Add selected track to the current user's queue
   $(document).on('click', '.track', function(){
    var id = $(this).attr('id'); 
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

