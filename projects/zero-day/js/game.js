var startedSpriteAnimation = false;
var wave = 0;
var bugCount = 1;
var playerHP = 100;
var bugHP = 50;
var playerSpeed = 4;
var bugSpeed = .5;
var bugSpawnRate = 750;
var bugStrength = 2;
var gameInProgress = false;
var liveBugs = [];
var liveBullets = [];
var player;
var currentGame;
var gameArea;
var bulletsShot = 0;
var bulletsLanded = 0;
var bugsSpawned = 0;
var bugsKilled = 0;
var displayHPBar = false;
var finalWave = 0;
var accuracy = 0;
var toggleAdvancedStats = false;


function startGame(){
    //start a new game with the given settings
    currentGame = new gameSettings(wave, bugCount, playerHP, bugHP, playerSpeed, bugSpeed, bugStrength);
    //enable the game stats div
    $('#stats').fadeIn(500);
    //disable the start button
    $('#start-btn').css({display: 'none'});
}

//----------------------------------------------------
//----------------GAME ELEMENT CLASSES----------------
//----------------------------------------------------

class gameSettings{
    constructor(wave, bugCount, playerHP, bugHP, playerSpeed, bugSpeed, bugStrength){
        this.wave = wave;
        this.bugCount = bugCount;
        this.playerHP = playerHP;
        this.bugHP = bugHP;
        this.playerSpeed = playerSpeed;
        this.bugSpeed = bugSpeed;
        this.bugsKilled = 0;
        this.bugStrength = bugStrength;

        $('#wave-count').text(this.wave);
        $('#bug-count').text(this.bugCount);

        gameArea = $('#game-map');

        gameInProgress = true;

        player = new Player(400, 400, this.playerHP, this.playerSpeed);
    }
}

class Player{
    constructor(x, y, hp, speed){
        this.hp = hp;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = 38;
        this.height = 38;

        var newPlayer = document.createElement('div');
        newPlayer.id = 'player';
        document.getElementById('game-map').appendChild(newPlayer);

        var newProgressbar = document.createElement('progress');
        newProgressbar.id = ('pb-player');
        newProgressbar.className = 'player-hp';
        document.getElementById('player').appendChild(newProgressbar);

        this.pb = newProgressbar;
        this.pb.value = 100;
        this.pb.max = 100;

        //set positioning in the game area
        $('#player').css({
            left: this.x+'px',
            top: this.y+'px'
        })

        //Update player's initial coordinates to match div positioning
        this.x = parseInt($('#player').css('left'));
        this.y = parseInt($('#player').css('top'));

        //Initialize player's sprite animation
        $('#player').animateSprite({
            fps: 8,
             animations: {
                walkDown: [0, 1, 2, 3],
                walkUp: [4, 5, 6, 7],
                walkLeft: [9, 10, 10, 11],
                walkRight: [13, 14, 14, 15]
            },
            loop: true,
        });
    }
}

class Bullet{
    constructor(id, mousePosX, mousePosY){
        this.id = id;
        this.x = player.x;
        this.y = player.y;
        this.tx;
        this.ty;

        var binNum = Math.random() >= 0.5 ? 1 : 0;
        var toDirection = Math.atan2((mousePosY - this.y), (mousePosX - this.x));

        this.dx = Math.cos(toDirection);
        this.dy = Math.sin(toDirection);
        this.speed = 3;
        this.age = 0;
        this.width = 25;
        this.height = 25;

        var newBullet = document.createElement('h1');
        newBullet.id = ('bullet-'+this.id);
        newBullet.className ='bullet';
        newBullet.innerText = binNum.toString();
        document.getElementById('game-map').appendChild(newBullet);

        //Assign bullet's initial position
        $('#bullet-'+this.id).css({
            top: this.y+'px',
            left: this.x+'px'
        });
    }

    move(){
        //increment age and speed every step
        this.age++;
        this.tx = this.dx * this.speed;
        this.ty = this.dy * this.speed;
        this.x =  parseInt($('#bullet-'+this.id).css('left'));
        this.y = parseInt($('#bullet-'+this.id).css('top'));

        $('#bullet-'+this.id).css({
            left: '+='+this.tx+'px',
            top: '+='+this.ty+'px'
        });
    }
}

class Bug{
    constructor(id, x, y){
        this.id = id;
        this.hp = 50;
        this.x = x;
        this.y = y;
        this.speed = .65;
        this.width = 38;
        this.height = 38;
        this.direction = 0;
        this.dx = 0;
        this.dy = 0;

        var newBug = document.createElement('div');
        newBug.id = ('bug-'+this.id);
        newBug.className = 'bug';
        document.getElementById('game-map').appendChild(newBug);

        $('#bug-'+this.id).css({
            top: (this.y+'px'),
            left: (this.x+'px')
        });

        var newProgressbar = document.createElement('progress');
        newProgressbar.id = ('pb-'+this.id);
        newProgressbar.className = 'enemy-hp';
        document.getElementById(newBug.id).appendChild(newProgressbar);

        this.pb = newProgressbar;
        this.pb.value = 50;
        this.pb.max = 50;
        this.pb.style.opacity = 0;

        $('#bug-'+this.id).animateSprite({
            fps:8,
            animations: {
                walkDown: [0,1,2,3],
                walkDownRight: [4,5,6,7],
                walkDownLeft: [8,9,10,11],
                walkUp: [12,13,14,15],
                walkUpLeft: [16,17,18,19],
                walkUpRight: [20,21,22,23],
                walkRight: [24,25,26,27],
                walkLeft: [28,29,30,31]
            },
            loop: true,
        });
        this.move();
    }
    move(){
        //check if bugs should be avoiding each other
        for(var i=0; i < liveBugs.length; i++){
            if(this.id != liveBugs[i].id){
                if(isInRadius(this, liveBugs[i])){
                    var midpoint = {
                        x: this.x + (liveBugs[i].x - this.x) / 2,
                        y: this.y + (liveBugs[i].y - this.y) / 2
                    }
                    this.direction = Math.atan2(this.y - midpoint.y, this.x - midpoint.x );
                }
            }else{
                this.direction = Math.atan2( parseInt($('#player').css('top')) - this.y, parseInt($('#player').css('left')) - this.x);
            }
        }
        this.dx = Math.round(Math.cos(this.direction));
        this.x += this.dx * this.speed;
        this.dy = Math.round(Math.sin(this.direction));
        this.y += this.dy * this.speed;

        if (this.dx == 1 && this.dy == 0){
            $('#bug-'+this.id).animateSprite('play', 'walkRight');
            $('#bug-'+this.id).finish().animate({
                left: this.x+'px'
            });
        }
        if(this.dx == -1 && this.dy == 0){
            $('#bug-'+this.id).animateSprite('play', 'walkLeft');
            $('#bug-'+this.id).finish().animate({
                left: this.x+'px'
            });
        }
        if(this.dx == 0 && this.dy == 1){
            $('#bug-'+this.id).animateSprite('play', 'walkDown');
            $('#bug-'+this.id).finish().animate({
                top: this.y+'px'
            });
        }
        if(this.dx == 0 && this.dy == -1){
            $('#bug-'+this.id).animateSprite('play', 'walkUp');
            $('#bug-'+this.id).finish().animate({
                top: this.y+'px'
            });
        }

        if(this.dx == 1 && this.dy == 1){
            $('#bug-'+this.id).animateSprite('play', 'walkDownRight');
            $('#bug-'+this.id).finish().animate({
                left: this.x+'px',
                top: this.y+'px'
            });
        }
        if(this.dx == -1 && this.dy == 1){
            $('#bug-'+this.id).animateSprite('play', 'walkDownLeft');
            $('#bug-'+this.id).finish().animate({
                left: this.x+'px',
                top: this.y+'px'
            });
        }
        if(this.dx == 1 && this.dy == -1){
            $('#bug-'+this.id).animateSprite('play', 'walkUpRight');
            $('#bug-'+this.id).finish().animate({
                left: this.x+'px',
                top: this.y+'px'
            });
        }
        if(this.dx == -1 && this.dy == -1){
            $('#bug-'+this.id).animateSprite('play', 'walkUpLeft');
            $('#bug-'+this.id).finish().animate({
                left: this.x+'px',
                top: this.y+'px'
            });
        }
    }
}

//-----------------------------------------------------------
//----------------GAME ELEMENT MOVEMENT LOOPS----------------
//-----------------------------------------------------------

//Loop for moving bugs to player
setInterval(function(){
    if(liveBugs.length > 0 && gameInProgress){
        for(i=0; i<liveBugs.length;i++){
            liveBugs[i].move();
        }
    }
});

//Loop for moving bullets to click position
setInterval(function(){
    if(liveBullets.length > 0 && gameInProgress){
        for(i=0; i<liveBullets.length;i++){
            var currentBullet = liveBullets[i];
            currentBullet.move();
            if(currentBullet.age >= 300){
                $('#bullet-'+currentBullet.id).remove();
                liveBullets.splice(i,1);
            }
        }
    }
});

//Loop for keeping player within play area
setInterval(function(){
    if (parseInt($('#player').css('left')) < -5){
        $('#player').css('left','+=20px');
    }
    if (parseInt($('#player').css('left')) > 745){
        $('#player').css('left','-=20px');
    }
    if (parseInt($('#player').css('top')) < -5){
        $('#player').css('top','+=20px');
    }
    if (parseInt($('#player').css('top')) > 715){
        $('#player').css('top','-=20px');
    }
});

//loop for regenerating the players health
setInterval(function(){
    if(gameInProgress && player.hp < 100){
        player.hp += 5;
        if(player.hp > 100){
            player.hp = 100;
        }
        player.pb.value = player.hp;
    }
}, 2000);

//Detect when key is pressed in order to update the player's position/animation
$(document).keydown(function(e){
    if($('#player').length > 0){
        player.x = parseInt($('#player').css('left'));
        player.y = parseInt($('#player').css('top'));
        switch(e.which){
            case 65: //A
                if(player.x > -10){
                    $('#player').finish().animate({
                        left: '-=10'
                    });
                }
                if (!startedSpriteAnimation){
                    startedSpriteAnimation = true;
                    $('#player').animateSprite('play', 'walkLeft');
                }
                break;
            case 87: //W
                if(player.y > -10){
                    $('#player').finish().animate({
                        top: '-=10'
                    });
                }
                if (!startedSpriteAnimation){
                    startedSpriteAnimation = true;
                    $('#player').animateSprite('play', 'walkUp');
                }
                break;
            case 68: //D
                if(player.x < 740){
                    $('#player').finish().animate({
                        left: '+=10'
                    });
                }
                if (!startedSpriteAnimation){
                    startedSpriteAnimation = true;
                    $('#player').animateSprite('play', 'walkRight');
                }
            break;
            case 83: //S
                if(player.y < 720){
                    $('#player').finish().animate({
                        top: '+=10'
                    });
                }
                if (!startedSpriteAnimation){
                    startedSpriteAnimation = true;
                    $('#player').animateSprite('play', 'walkDown');
                }
            break;
        }
    }
});

//Detect when a key is unpressed in order to stop the player's sprite animation
$(document).keyup(function(e){
    startedSpriteAnimation = false;
    switch(e.which){
        case 65: //A
            $("#player").animateSprite('frame', 8);
            $("#player").animateSprite('stop');
            break;
        case 87: //W
            $("#player").animateSprite('frame', 4);
            $("#player").animateSprite('stop');
            break;
        case 68: //D
            $("#player").animateSprite('frame', 15);
            $("#player").animateSprite('stop');
            break;
        case 83: //S
            $("#player").animateSprite('frame', 0);
            $("#player").animateSprite('stop');
            break;
    }
});

//------------------------------------------------------------
//----------------GAME ELEMENT COLLISION LOOPS----------------
//------------------------------------------------------------

//Loop for collision detection between bullets and bugs
setInterval(function(){
    if(liveBullets.length > 0 && liveBugs.length > 0 && gameInProgress){
        for(i=0; i<liveBullets.length;i++){
            for(j=0; j<liveBugs.length;j++){
                if(isColliding(liveBullets[i], liveBugs[j]) && liveBugs[j].hp > 10){
                    liveBugs[j].hp -= 10;
                    liveBugs[j].pb.value = liveBugs[j].hp;
                    $('#bullet-'+liveBullets[i].id).remove();
                    liveBullets.splice(i,1);
                    bulletsLanded++;
                    $('#bullets-hit-count').text(bulletsLanded);
                    accuracy = Math.round((bulletsLanded / bulletsShot) * 100);
                    $('#current-accuracy-count').text(accuracy + '%');
                    break;
                }
                if(isColliding(liveBullets[i], liveBugs[j]) && liveBugs[j].hp <= 10){
                    $('#bug-'+liveBugs[j].id).remove();
                    liveBugs.splice(j,1);
                    $('#bullet-'+liveBullets[i].id).remove();
                    liveBullets.splice(i,1);
                    bulletsLanded++;
                    $('#bullets-hit-count').text(bulletsLanded);
                    $('#current-accuracy-count').text(accuracy + '%');
                    currentGame.bugsKilled++;
                    bugsKilled++;
                    $('#bugs-killed-count').text(bugsKilled);
                    $('#bug-count').text(currentGame.bugCount - currentGame.bugsKilled);
                    break;
                }
            }
        }
    }
    if(gameInProgress && currentGame.bugsKilled == currentGame.bugCount){
        nextWave();
        currentGame.bugStrength++;
    }
}, 20);

//Loop for collision detection between player and bugs
setInterval(function(){
    if(liveBugs.length > 0 && gameInProgress){
        for(i=0; i<liveBugs.length;i++){
            var currentBug = liveBugs[i];
            if(isColliding(player, currentBug)){
                player.hp -= currentGame.bugStrength;
                player.pb.value = player.hp;

                if(player.hp < 1){
                    gameOver();
                }
                //Check which direction the bug is coming from
                //Cardinal
                if(currentBug.dx == 0 && currentBug.dy == 1){
                    $('#player').css('top','+=20px');
                }
                if(currentBug.dx == 0 && currentBug.dy == -1 ){
                    $('#player').css('top','-=20px');
                }
                if(currentBug.dx == 1 && currentBug.dy == 0){
                    $('#player').css('left','+=20px');
                }
                if(currentBug.dx == -1 && currentBug.dy == 0){
                    $('#player').css('left','-=20px');
                }

                //Ordinal
                if(currentBug.dx == 1 && currentBug.dy == 1){
                    $('#player').css('top','+=20px');
                    $('#player').css('left','+=20px');
                }
                if(currentBug.dx == -1 && currentBug.dy == 1 ){
                    $('#player').css('top','+=20px');
                    $('#player').css('left','-=20px');
                }
                if(currentBug.dx == 1 && currentBug.dy == -1){
                    $('#player').css('left','+=20px');
                    $('#player').css('top','-=20px');
                }
                if(currentBug.dx == -1 && currentBug.dy == 1){
                    $('#player').css('left','-=20px');
                    $('#player').css('top','-=20px');
                }

                player.x = parseInt($('#player').css('left'));
                player.y = parseInt($('#player').css('top'));
            }
        }
    }
}, 100);

//---------------------------------------------------------------------------
//----------------GAME LOGIC FUNCTIONS, LOOPS, EVENT HANDLERS----------------
//---------------------------------------------------------------------------
//Spawn bug every n milliseconds
setInterval(function spawnBugs(){
    if(gameInProgress && liveBugs.length + currentGame.bugsKilled < currentGame.bugCount){
        var RandomX, RandomY;
        var spawnXOrY = Math.random() < 0.5;
        var spawnPositiveXOrY = Math.random() < 0.5;
        if(spawnXOrY && spawnPositiveXOrY){
            RandomX = Math.random() * 800;
            RandomY = -76;
        }
        if(spawnXOrY && !spawnPositiveXOrY){
            RandomX = Math.random() * 800;
            RandomY = 876;
        }
        if(!spawnXOrY && spawnPositiveXOrY){
            RandomX = -76
            RandomY = Math.random() * 800;
        }
        if(!spawnXOrY && !spawnPositiveXOrY){
            RandomX = 876
            RandomY = Math.random() * 800;
        }
        liveBugs.push(new Bug(bugsSpawned++, RandomX, RandomY));
        $('#total-bugs-count').text(bugsSpawned);
    }
}, bugSpawnRate);

//Click event listener for spawning player bullets
$(document).on('click', '#game-map', function(e){
    var event = e;
    if(gameInProgress){
        mousePos = getMousePos(event);
        liveBullets.push(new Bullet(bulletsShot++, mousePos.x, mousePos.y));
        $('#total-bullets-count').text(bulletsShot);
    }
});

//Returns cursor's coordinates within the game area
function getMousePos(e){
    return{
        x: e.pageX - $('#game-map').offset().left - 36,
        y: e.pageY - $('#game-map').offset().top - 36
    };
};

//General collision logic
function isColliding(a, b){
    if(a && b){
        return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }
}

//Check if two elements are within a certain radius from each other
function isInRadius(a, b){
    if(a && b){
        return !(
            ((a.y + a.height + 50) < (b.y)) ||
            (a.y > (b.y + b.height + 50)) ||
            ((a.x + a.width + 50) < b.x) ||
            (a.x > (b.x + b.width + 50))
        );
    }
}

//Call when player has eliminated all of the spawned enemies
function nextWave(){
    gameInProgress = false;
    if(!gameInProgress){
        currentGame.wave++
        $('#wave-count').text(currentGame.wave.toString());
        currentGame.bugCount += 3;
        $('#bug-count').text(currentGame.bugCount.toString());
        currentGame.bugsKilled = 0;
        waveAlert();
        gameInProgress = true;
    }
}

function waveAlert(){
    $("#wave-alert").fadeIn(300).fadeOut(300).fadeIn(300).fadeOut(300).fadeIn(300).fadeOut(300).fadeIn(300).fadeOut(300);
    $('#wave-alert-text').animate({
        left: '+500px',
        easing: 'linear'
    }, 2400, function(){
        $('#wave-alert-text').css({
            left: '0px'
        });
    });
}

//get local scores from local database
function getLocalScores(){
    var localScoreList = $.parseJSON(localStorage.getItem('localScores'));
    //sort list in order of best score
    var localScores = sortJSON(localScoreList);
    if(localScores !== null){
        var scorecount = Object.keys(localScores).length;
        for(let i = 0; i < scorecount && i < 5; i++){
            if(localScores[i] !== null){
                var localname = localScores[i].name;
                var localpatch = localScores[i].patch;
                var localaccuracy = localScores[i].accuracy;
            }else{
                var localname = 'N/A'
                var localpatch = 'N/A'
                var localaccuracy = 'N/A'
            }

            $('#leaderboard-table-body').append(
            '<tr class="leaderboard-row">' +
                '<td>' +
                    localname.toUpperCase() + '</td> ' +
                '<td> v1.0.' +
                    localpatch.toString() + '</td> ' +
                '<td>' +
                    localaccuracy.toString() + '%</td> ' +
                '</tr>'
            );
        }
    }
}

//compare two values
function compareVals(x, y){
    return ((x > y) ? 1 : ((x < y) ? -1 : 0));
}

function sortJSON(array){
    return array.sort(function(a,b){
        return compareVals(
            [-compareVals(a.patch, b.patch), -compareVals(a.accuracy, b.accuracy)],
            [-compareVals(b.patch, a.patch), -compareVals(b.accuracy, a.accuracy)]
        );
    });
};

//Call when player has died
function gameOver(){
    gameInProgress = false;
    if(!gameInProgress){
        //remove all enemies from the document and clear the associated list
        for(i=0;i<liveBugs.length;i++){
            document.getElementById('bug-'+liveBugs[i].id).remove();
        }
        liveBugs = [];
        //remove all bullets from the document and clear the associated list
        for(j=0;j<liveBullets.length;j++){
            document.getElementById('bullet-'+liveBullets[j].id).remove();
        }
        liveBullets = [];
        //remove the player and map from the document 
        document.getElementById('player').remove();
        document.getElementById('game-map').remove();
        //Save last wave the player completed
        finalWave = currentGame.wave;
        //Unassign various variables related to the document elements
        delete player, currentGame, gameArea;
    //Update stats text
    $('#patch-count').text(finalWave);
    $('#accuracy-count').text(accuracy);
    $('#leaderboard-table-body').empty();
    //Remove any existing initials
    $('#initial1').val('');
    $('#initial2').val('');
    $('#initial3').val('');
    //Show the leaderboard
    $('#leaderboard').css({display: 'block'});

    //get existing players locally
    getLocalScores();

    //Get existing players from dreamlo data base
    //BLOCKED IN BROWSERS DUE TO NONSECURED DATABASE SITE
    // $.ajax({
    //     type: 'GET',
    //     url: 'http://dreamlo.com/lb/6194b44d8f40bb1278726e6d/xml/5',
    //     dataType: 'xml',
    //     success: function(xml){
    //         $(xml).find('entry').each(function(){
    //             $('#leaderboard-table-body').append(
    //                 '<tr class="leaderboard-row">' +
    //                     '<td>' +
    //                         $(this).find('name').text().toUpperCase() + '</td> ' +
    //                     '<td> v1.0.' +
    //                         $(this).find('score').text() + '</td> ' +
    //                     '<td>' +
    //                         $(this).find('seconds').text() + '%</td> ' +
    //                     '</tr>'
    //                 );
    //             });
    //         }
    //     });
    }
};

//get the user's initials, validate them, and submit to the leaderboard
function saveToLeaderboard(){
    var init1 = $('#initial1').val();
    var init2 = $('#initial2').val();
    var init3 = $('#initial3').val();
    var userInitials = (init1 + init2 + init3);

    var letterCheck = /^[a-zA-Z]+$/;
    if(init1.match(letterCheck) && init2.match(letterCheck) && init3.match(letterCheck)){
        $('#initials-text').fadeOut(300);
        $('#leaderboard-table-body').fadeOut(300, function(){
            $('#leaderboard-table-body').empty();

            $('#initial1').val('');
            $('#initial2').val('');
            $('#initial3').val('');

            //add player's score locally
            if(localStorage.getItem('localScores') === null){
                localStorage.setItem('localScores', '[]');
            }

            if(localStorage.getItem('localScores') !== null){
                var newDatabaseEntry = {
                    'name': userInitials.toUpperCase(),
                    'patch': finalWave,
                    'accuracy': accuracy
                };
            }

            //convert object to json
            parsedLocalScores = $.parseJSON(localStorage.getItem('localScores')); 
            parsedLocalScores.push(newDatabaseEntry);

            //add to local database
            localStorage.setItem('localScores', JSON.stringify(parsedLocalScores));
            getLocalScores();
    
            //add player's score to dreamlo database
            // $.get('http://dreamlo.com/lb/Z6xfJCrL-kS0mK6o30WtLAjgzzrNtecUi_KaafBb2Kuw/add/'+ userInitials + '/' + finalWave + '/' + accuracy, function( data ){
            //     //Attempt to get leaderboard data from Dreamlo
            //     $.ajax({
            //         type: 'GET',
            //         url: 'http://dreamlo.com/lb/6194b44d8f40bb1278726e6d/xml/5',
            //         dataType: 'xml',
            //         success: function(xml){
            //             $(xml).find('entry').each(function(){
            //                 $('#leaderboard-table-body').append(
            //                     '<tr class="leaderboard-row">' +
            //                         '<td>' +
            //                             $(this).find('name').text().toUpperCase() + '</td> ' +
            //                         '<td> v1.0.' +
            //                             $(this).find('score').text() + '</td> ' +
            //                         '<td>' +
            //                             $(this).find('seconds').text() + '%</td> ' +
            //                         '</tr>'
            //                 );
            //             });
            //         }
            //     });
            // });
            $('#leaderboard-table-body').fadeIn(300, function(){
                $("#continue-leaderboard-btn").fadeIn(300);
            });
        });
    }else{
        $('#initials-error-text').text('You must enter 3 letters');
    }
};

//------------------------------------------------------
//----------------GENERAL EVENT HANDLERS----------------
//------------------------------------------------------

//Hover event for start button css
$(document).on('mouseenter', '#start-btn', function(){
    $('#start-btn').css({
        border: '1px solid',
        'box-shadow':'inset 0 0 20px rgba(0,255,0,.5), 0 0 20px rgba(0,255,0,0.2)',
        'outline-color': 'rgba(0,255,0,0)',
        'outline-offset': '15px',
        'text-shadow': '1px 1px 2px #00ff00',
        cursor: 'pointer'
    });

}).on('mouseleave', '#start-btn', function(){
    $('#start-btn').css({
        border: '0px solid',
        'box-shadow':'inset 0 0 20px rgba(0,255,0,0)',
        outline: '1px solid',
        'outline-color': 'rgba(0,255,0,0.5)',
        'outline-offset': '0px',
        'text-shadow': 'none',
        transition: 'all 1250ms cubic-bezier(0.19, 1, 0.22, 1)',
        cursor: 'default'
    });
});

//Event handler for showing enemy hp when hovered over
$(document).on('mouseenter', '.bug', function(){
    $('#pb-'+this.id.substring(this.id.indexOf('-') + 1)).animate({'opacity' : 1.0}, 200);
}).on('mouseleave', '.bug', function(){
    $('#pb-'+this.id.substring(this.id.indexOf('-') + 1)).animate({'opacity' : 0.0}, 500);
});

//Automatically focuses on the next initial box when user is typing in leaderboard initials
$('.initials').keyup(function(){
    if(this.value.length == this.maxLength){
        $(this).next('.initials').focus();
    }
})

//Hover event for leaderboard names
$(document).on('mouseenter', '.leaderboard-row', function(){
    $(this).css({
        'box-shadow': '0 0.5em 0.5em -0.4em rgba(255,0,0,1)',
        transform: 'translateY(-0.15em)',

    });
}).on('mouseleave', '.leaderboard-row', function(){
    $(this).css({
        'box-shadow': 'none',
        transform: 'translateY(0.15em)',
    });
});

//Hover event for enter button css
$(document).on('mouseenter', '#send-initials-btn', function(){
    $('#send-initials-btn').css({
        color: '#000000',
        'background-color': '#ffffff',
        cursor: 'pointer'
    });
    $('#send-initials-btn').animate({opacity: '1.0'}, 200);

}).on('mouseleave', '#send-initials-btn', function(){
    $('#send-initials-btn').css({
        color: '#ffffff',
        'background-color': '#000000',
        cursor: 'default'
    });
    $('#send-initials-btn').animate({opacity: '0.5'}, 200);
});

//Hover event for continue button css
$(document).on('mouseenter', '#continue-leaderboard-btn', function(){
    $('#continue-leaderboard-btn').css({
        color: '#000000',
        'background-color': '#ffffff',
        cursor: 'pointer'
    });
    $('#continue-leaderboard-btn').animate({opacity: '1.0'}, 200);

}).on('mouseleave', '#continue-leaderboard-btn', function(){
    $('#continue-leaderboard-btn').css({
        color: '#ffffff',
        'background-color': '#000000',
        cursor: 'default'
    });
    $('#continue-leaderboard-btn').animate({opacity: '0.5'}, 200);
});

//Hover event for advanced statistics button css
$(document).on('mouseenter', '#stats-btn', function(){
    if($('#stats-btn').text() == 'SHOW'){
        $('#stats-btn').text('▼ SHOW ▼');
    }

    if($('#stats-btn').text() == 'HIDE'){
        $('#stats-btn').text('▲ HIDE ▲');
    }

    $('#stats-btn').css({
        color: '#ffffff',
        cursor: 'pointer'
    });

}).on('mouseleave', '#stats-btn', function(){
    if($('#stats-btn').text() == '▼ SHOW ▼'){
        $('#stats-btn').text('SHOW');
    }
    if($('#stats-btn').text() == '▲ HIDE ▲'){
        $('#stats-btn').text('HIDE');
    }
    $('#stats-btn').css({
        color: '#000000',
        cursor: 'default'
    });
});

//Click event for advanced statistics button
$(document).on('click', '#stats-btn', function(){
    if(toggleAdvancedStats){
        $('#stats').animate({
            height: '-=330px'
        }, function(){
            toggleAdvancedStats = false;
        });

        $('#stats-btn').animate({
            top: '-=330px'
        }, function(){
            $('#stats-btn').text('SHOW');
        });

        $('#bugs-killed-text').animate({opacity:'0.0'}, 100);
        $('#total-bugs-text').animate({opacity:'0.0'}, 200);
        $('#current-accuracy-text').animate({opacity:'0.0'}, 300);
        $('#bullets-hit-text').animate({opacity:'0.0'}, 400);
        $('#total-bullets-text').animate({opacity:'0.0'}, 500);
    }
    if(!toggleAdvancedStats){
        $('#stats').animate({
            height: '+=330px'
        }, function(){
            toggleAdvancedStats = true;
        });

        $('#total-bullets-text').animate({opacity:'1.0'}, 300);
        $('#bullets-hit-text').animate({opacity:'1.0'}, 600);
        $('#current-accuracy-text').animate({opacity:'1.0'}, 900);
        $('#total-bugs-text').animate({opacity:'1.0'}, 1200);
        $('#bugs-killed-text').animate({opacity:'1.0'}, 1500);

        $('#stats-btn').animate({
            top: '+=330px'
        }, function(){
            $('#stats-btn').text('HIDE');
        });
    }
});

//Hover event for leaderboard initials textbox
$(document).on('mouseenter', '.initials', function(){
    $('.initials').focus(function(){
        $(this).css({
            opacity: '1.0'
        });
    });
});
