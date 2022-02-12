var canvas = document.getElementById('game');
var width = document.body.clientWidth;
var height = document.body.clientHeight;
var keyMap = [];
var playerSpeed = 3;
var ballSpeed = 3;
var playerSize = 50;
var ballSize = 25;
var hasBall = 0;
var glowBlur = 10;

var gameBall = {
    x: width / 2 - 50,
    y: height / 2 - 50,
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


if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    canvas.setAttribute('width', width + 'px');
    canvas.setAttribute('height', height + 'px');
}

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

function drawBall() {
    if (gameBall.heldBy == 3) {
        if (gameBall.vx > -.000000003 && gameBall.vx < 0.000000003 && gameBall.vx != 0) {
            gameBall.vx = 0;
        }

        if (gameBall.vy > -.000000003 && gameBall.vy < 0.000000003 && gameBall.vy != 0) {
            gameBall.vy = 0;
        }

        gameBall.vx *= .99;
        gameBall.vy *= .99;
        gameBall.x += gameBall.vx;
        gameBall.y += gameBall.vy;

        console.log(gameBall.vx);
    }

    ctx.fillStyle = 'white';
    ctx.shadowBlur = glowBlur;
    ctx.shadowColor = 'white';
    ctx.fillRect(gameBall.x, gameBall.y, ballSize, ballSize);
}

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

    //Check if player one is colliding with the ball
    if (isColliding(playerOne, gameBall) && gameBall.heldBy != 2) {
        gameBall.heldBy = 1;
        gameBall.x = playerOne.x + (ballSize / 2);
        gameBall.y = playerOne.y - ballSize;
    }
    if (isColliding(playerOne, gameBall) && gameBall.heldBy == 2) {
        gameBall.heldBy = 2;
        gameBall.x = playerOne.x + (ballSize / 2);
        gameBall.y = playerOne.y - ballSize;
    }

    //Check if player two is colliding with the ball
    if (isColliding(playerTwo, gameBall) && gameBall.heldBy != 1) {
        gameBall.heldBy = 2;
        gameBall.x = playerTwo.x + (ballSize / 2);
        gameBall.y = playerTwo.y - ballSize;
    }
    if (isColliding(playerTwo, gameBall) && gameBall.heldBy == 1) {
        gameBall.heldBy = 1;
        gameBall.x = playerTwo.x + (ballSize / 2);
        gameBall.y = playerTwo.y - ballSize;
    }

    //Refresh frame for the next draw
    ctx.clearRect(0, 0, width, height);
    drawPlayer(playerOne);
    drawPlayer(playerTwo);
    drawBall();
    setTimeout(draw, 10);
}

draw();

document.body.addEventListener('keydown', function (e) {
    keyMap[e.keyCode] = true;
});
document.body.addEventListener('keyup', function (e) {
    keyMap[e.keyCode] = false;
});

//----------------UI Scripts----------------

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
    hasBall = 0;
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
        vy: 0
    }
    document.getElementById('color1-btn').style.backgroundColor = 'black';
    document.getElementById('color2-btn').style.backgroundColor = 'black';
}