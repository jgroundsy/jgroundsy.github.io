//----------------Variable Initialization----------------
var canvas = document.getElementById('game');
var width = document.body.clientWidth;
var height = document.body.clientHeight;
var keyMap = [];
var playerSpeed = 3;
var ballSpeed = 1;
var playerSize = 50;
var ballSize = 25;
var glowBlur = 15;
var gameBallBump = 50;
var toggleOptions = false;
var englishControl = false;

var speedSlider = document.getElementById('speed-slider');
var speedLabel = document.getElementById('speed-label');

var englishSlider = document.getElementById('english-slider');
var englishLabel = document.getElementById('english-label');

var buttonsSlider = document.getElementById('buttons-slider');
var buttonsLabel = document.getElementById('buttons-label');

var ballSpeedSlider = document.getElementById('ball-speed-slider');
var ballSpeedLabel = document.getElementById('ball-speed-label');

var gameBall = {
    x: width / 2 - ballSize,
    y: height / 2 - ballSize,
    vx: 0,
    vy: 0,
    heldBy: 0
}

var playerOne = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0
}

var playerTwo = {
    x: width - playerSize,
    y: height - playerSize,
    vx: 0,
    vy: 0
}

var flagColors = ['#A77D19', '#3D7A13', '#1E00A7', '#86281A', '#B2B621', '#9F1BA8', '#56A3BA', '#821C5F', '#5500A4', '#767F16'];

//----------------Game Logic----------------
//Setup canvas and context
if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    canvas.setAttribute('width', width + 'px');
    canvas.setAttribute('height', height + 'px');
}

//Update player position inside of the canvas
function drawPlayer(p) {

    if (p.vx > -.003 && p.vx < 0.003 && p.vx != 0) {
        p.vx = 0;
    }

    if (p.vy > -.003 && p.vy < 0.003 && p.vy != 0) {
        p.vy = 0;
    }

    p.vx *= .93;
    p.vy *= .93;
    p.x += p.vx;
    p.y += p.vy;
    ctx.fillStyle = 'white';
    ctx.shadowBlur = glowBlur;
    ctx.shadowColor = 'white';
    ctx.fillRect(p.x, p.y, playerSize, playerSize);
}

//Update ball position inside of the canvas
function drawBall() {
    if (gameBall.heldBy == 3 && !englishControl) {
        if (gameBall.vx > -.000000003 && gameBall.vx < 0.000000003 && gameBall.vx != 0) {
            gameBall.vx = 0;
        }

        if (gameBall.vy > -.000000003 && gameBall.vy < 0.000000003 && gameBall.vy != 0) {
            gameBall.vy = 0;
        }

        gameBall.vx *= .992;
        gameBall.vy *= .992;
        gameBall.x += gameBall.vx * ballSpeed;
        gameBall.y += gameBall.vy * ballSpeed;
    }

    //change ball behavior if the english control option is enabled
    if (gameBall.heldBy == 3 && englishControl) {
        if (gameBall.vx > -.000000003 && gameBall.vx < 0.000000003 && gameBall.vx != 0) {
            gameBall.vx = 0;
            gameBall.heldBy = 0;
        }

        if (gameBall.vy > -.000000003 && gameBall.vy < 0.000000003 && gameBall.vy != 0) {
            gameBall.vy = 0;
            gameBall.heldBy = 0;
        }

        if (keyMap[69] || keyMap[79]) { //E or O
            if (gameBall.vy > -ballSpeed) {
                gameBall.vy--;
            }
        }
        if (keyMap[81] || keyMap[85]) { //Q or U
            if (gameBall.vy < ballSpeed) {
                gameBall.vy++;
            }
        }

        gameBall.vx *= .994;
        gameBall.vy *= .994;
        gameBall.x += gameBall.vx;
        gameBall.y += gameBall.vy;
    }

    ctx.fillStyle = 'white';
    ctx.shadowBlur = glowBlur;
    ctx.shadowColor = 'white';
    ctx.fillRect(gameBall.x, gameBall.y, ballSize, ballSize);
}

//General function for collision
function isColliding(p, b) {
    if (p && b) {
        return !(
            ((p.y + playerSize) < (b.y)) ||
            (p.y > (b.y + ballSize + 25)) ||
            ((p.x + playerSize + 25) < b.x) ||
            (p.x > (b.x + ballSize + 25))
        );
    }
}

//Bump the ball away from the player based on the direction that they are going
function setCoordsFromDirection(b, p) {
    //Ordinal directions
    if (p.vx > 0 && p.vy > 0) {
        b.x += gameBallBump;
        b.y += gameBallBump + playerSize;
    }
    if (p.vx < 0 && p.vy < 0) {
        b.x -= gameBallBump;
        b.y -= gameBallBump;
    }
    if (p.vx > 0 && p.vy < 0) {
        b.x += gameBallBump;
        b.y -= gameBallBump;
    }
    if (p.vx < 0 && p.vy > 0) {
        b.x -= gameBallBump;
        b.y += gameBallBump + playerSize;
    }

    //Cardinal directions
    if (p.vx > 0 && p.vy == 0) {
        b.x += gameBallBump;
    }
    if (p.vx < 0 && p.vy == 0) {
        b.x -= gameBallBump;
    }
    if (p.vx == 0 && p.vy > 0) {
        b.y += gameBallBump + playerSize;
    }
    if (p.vx == 0 && p.vy < 0) {
        b.y -= gameBallBump;
    }

}

function checkCollision() {
    //Check if player one is colliding with the ball and player two doesnt have the ball
    if (isColliding(playerOne, gameBall) && gameBall.heldBy != 2) {
        gameBall.heldBy = 1;
        gameBall.x = playerOne.x + (ballSize / 2);
        gameBall.y = playerOne.y - ballSize;
    }

    //Check if player one is colliding with the ball and player two already has it
    if (isColliding(playerOne, gameBall) && gameBall.heldBy == 2 && gameBall.heldBy != 3) {
        gameBall.heldBy = 3;

        setCoordsFromDirection(gameBall, playerOne);

        gameBall.vx = playerOne.vx;
        gameBall.vy = playerOne.vy;
    }

    //Check if player two is colliding with the ball and player one doesnt have the ball
    if (isColliding(playerTwo, gameBall) && gameBall.heldBy != 1) {
        gameBall.heldBy = 2;
        gameBall.x = playerTwo.x + (ballSize / 2);
        gameBall.y = playerTwo.y - ballSize;
    }

    //Check if player two is colliding with the ball and player one already has it
    if (isColliding(playerTwo, gameBall) && gameBall.heldBy == 1 && gameBall.heldBy != 3) {
        gameBall.heldBy = 3;

        setCoordsFromDirection(gameBall, playerTwo);

        gameBall.vx = playerTwo.vx;
        gameBall.vy = playerTwo.vy;
    }
}

//Main canvas update/drawing loop
function draw() {
    //Player 1 Movement
    if (keyMap[87]) { //W
        if (playerOne.vy > -playerSpeed) {
            playerOne.vy--;
        }
    }
    if (keyMap[65]) { //A
        if (playerOne.vx > -playerSpeed) {
            playerOne.vx--;
        }
    }
    if (keyMap[83]) { //S
        if (playerOne.vy < playerSpeed) {
            playerOne.vy++;
        }
    }
    if (keyMap[68]) { //D
        if (playerOne.vx < playerSpeed) {
            playerOne.vx++;
        }
    }
    //Player 2 Movement
    if (keyMap[73]) { //I
        if (playerTwo.vy > -playerSpeed) {
            playerTwo.vy--;
        }
    }
    if (keyMap[74]) { //J
        if (playerTwo.vx > -playerSpeed) {
            playerTwo.vx--;
        }
    }
    if (keyMap[75]) { //K
        if (playerTwo.vy < playerSpeed) {
            playerTwo.vy++;
        }
    }
    if (keyMap[76]) { //L
        if (playerTwo.vx < playerSpeed) {
            playerTwo.vx++;
        }
    }
    //Reset board
    if (keyMap[82]) {
        resetBoard();
    }

    //Check for player/ball collision
    checkCollision();

    //Refresh frame for the next draw
    ctx.clearRect(0, 0, width, height);
    drawPlayer(playerOne);
    drawPlayer(playerTwo);
    drawBall();
    setTimeout(draw, 10);
}

//Draw the current frame after every loop
draw();

//----------------Event Handlers----------------
speedSlider.oninput = function () {
    playerSpeed = this.value;
    speedLabel.innerHTML = 'Speed: ' + this.value;
}


ballSpeedSlider.oninput = function () {
    ballSpeed = this.value;
    ballSpeedLabel.innerHTML = 'Ball Speed: ' + this.value;
}

englishSlider.onclick = function () {
    if (this.checked) {
        englishControl = true;
        englishLabel.innerHTML = 'English Control: ON'
    }

    if (!this.checked) {
        englishControl = false;
        englishLabel.innerHTML = 'English Control: OFF'
    }
}

buttonsSlider.onclick = function () {
    if (this.checked) {
        document.getElementsByClassName('btn-wrapper')[0].style.display = 'none';
        buttonsLabel.innerHTML = 'Hide Buttons: ON'
    }

    if (!this.checked) {
        document.getElementsByClassName('btn-wrapper')[0].style.display = 'block';
        buttonsLabel.innerHTML = 'Hide Buttons: OFF'
    }
}

document.body.addEventListener('keydown', function (e) {
    keyMap[e.keyCode] = true;
});
document.body.addEventListener('keyup', function (e) {
    keyMap[e.keyCode] = false;
});
//----------------UI Scripts----------------

//Show or hide the options side bar
function toggleOptionBar() {
    if (!toggleOptions) {
        toggleOptions = true;
        document.getElementsByClassName('sliders')[0].style.marginLeft = '-175px';
    } else if (toggleOptions) {
        toggleOptions = false;
        document.getElementsByClassName('sliders')[0].style.marginLeft = '0px';
    }
}

//Set color of button to a random color from the colors list when the button is clicked
function getRandomColor(playerInt) {
    let color = flagColors[Math.floor(Math.random() * flagColors.length)];
    document.getElementById('color' + playerInt + '-btn').style.backgroundColor = color;
}

//Load a custom overlay image from file
function loadOverlay(image) {
    if (image.files && image.files[0]) {
        var reader = new FileReader();
        reader.onload = function (event) {
            let overlay = new Image();
            overlay.src = event.target.result;

            overlay.onload = function () {
                console.log(event.target.result);
                canvas.style.backgroundImage = "url('" + event.target.result + "')";
            }
        }
        reader.readAsDataURL(image.files[0]);
    }
}

//Remove the custom overlay background
function clearOverlay() {
    canvas.style.backgroundImage = 'none';
}

//Reset the entire game board to its default state
function resetBoard() {
    keyMap = []
    playerOne = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0
    }
    playerTwo = {
        x: width - 50,
        y: height - 50,
        vx: 0,
        vy: 0
    }
    gameBall = {
        x: width / 2 - 50,
        y: height / 2 - 50,
        vx: 0,
        vy: 0,
        heldBy: 0
    }
    document.getElementById('color1-btn').style.backgroundColor = 'rgba(0,0,0,0.6)';
    document.getElementById('color2-btn').style.backgroundColor = 'rgba(0,0,0,0.6)';
}