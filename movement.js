let startScreen = document.querySelector("#startScreen");
let playGame = document.querySelector("#play");
let gameScreen = document.querySelector("#gameScreen");
let endScreen = document.querySelector("#endScreen");
let replay = document.querySelector("#replay");
document.querySelector("#startingHighValue").innerText = parseInt(localStorage.getItem("highScore")) || "0";

playGame.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    endScreen.style.display = 'none';
    startGame();
});

replay.addEventListener('click', () => {
    endScreen.style.display = 'none';
    gameScreen.style.display = 'block';
})

function startGame() {
    let board = document.querySelector("#snakeBoard");
    board.width = board.clientWidth;
    board.height = board.clientHeight;
    let speed = 200;
    let score = document.querySelector("#score");
    let level = document.querySelector("#level");
    let highScore = document.querySelector("#highScoreValue");
    highScore.innerText = parseInt(localStorage.getItem("highScore")) || "0";

    let snake = board.getContext("2d");
    let block = 20;
    let visualBlock = block - 4;
    let x = 50, y = 50;
    let bodyArr = [];
    let direction = 'right';
    let justAteFruit = false;
    let run;
    addBody();
    updateBody();

    let fruitX = Math.floor(Math.random() * (board.width / block)) * block;
    let fruitY = Math.floor(Math.random() * (board.height / block)) * block;
    drawFruit();

    window.addEventListener('keydown', () => {
        if (event.key === 'ArrowRight' && direction !== 'left') {
            direction = 'right';
        } else if (event.key === 'ArrowLeft' && direction !== 'right') {
            direction = 'left';
        } else if (event.key === 'ArrowUp' && direction !== 'down') {
            direction = 'up';
        } else if (event.key === 'ArrowDown' && direction !== 'up') {
            direction = 'down';
        }
    });

    function runGameLoop() {
        clearInterval(run);
        run = setInterval(() => {
            clearBody();
            moveSnake();
            drawFruit();

            if (isSnakeTouchingFruit()) {
                score.innerText = 5 + parseInt(score.innerText);
                level.innerText = Math.floor(parseInt(score.innerText) / 50) + 1;

                let newSpeed = 200 - parseInt(level.innerText) * 20;
                if (newSpeed < 20) newSpeed = 20;
                if (newSpeed !== speed) {
                    speed = newSpeed;
                    runGameLoop();
                }

                checkHighScore();
                addBody();
                generateNewFruit();
                justAteFruit = true;
            }

            if (!justAteFruit && checkSelfCollision()) {
                resetGame();
            }

            if (justAteFruit) {
                justAteFruit = false;
            }

            if (x < 0 || x >= board.width || y < 0 || y >= board.height) {
                resetGame();
            }

            updateBody();
            snake.fillStyle = 'blue';
            snake.fillRect(x + 2, y + 2, visualBlock, visualBlock);
        }, speed);
    }

    runGameLoop();

    function addBody() {
        bodyArr.push({ bodyX: x, bodyY: y });
    }

    function clearBody() {
        snake.clearRect(0, 0, board.width, board.height);
    }

    function updateBody() {
        for (let i = bodyArr.length - 1; i > 0; i--) {
            bodyArr[i].bodyX = bodyArr[i - 1].bodyX;
            bodyArr[i].bodyY = bodyArr[i - 1].bodyY;
        }

        if (bodyArr.length > 0) {
            bodyArr[0].bodyX = x;
            bodyArr[0].bodyY = y;
        }

        bodyArr.forEach(el => {
            snake.fillStyle = 'blue';
            snake.fillRect(el.bodyX + 2, el.bodyY + 2, visualBlock, visualBlock);
        });
    }

    function moveSnake() {
        switch (direction) {
            case 'right': x += block; break;
            case 'left': x -= block; break;
            case 'up': y -= block; break;
            case 'down': y += block; break;
        }
    }

    function generateNewFruit() {
        clearFruit();

        let maxX = board.width - block;
        let maxY = board.height - block;

        fruitX = Math.floor(Math.random() * (maxX / block)) * block;
        fruitY = Math.floor(Math.random() * (maxY / block)) * block;

        drawFruit();
    }

    function drawFruit() {
        snake.fillStyle = "red";
        snake.beginPath();
        snake.arc(fruitX + block / 2, fruitY + block / 2, block / 2, 0, 2 * Math.PI);
        snake.fill();
    }

    function clearFruit() {
        snake.clearRect(fruitX, fruitY, block, block);
    }

    function checkSelfCollision() {
        return bodyArr.some(el => el.bodyX === x && el.bodyY === y);
    }

    function isSnakeTouchingFruit() {
        let distX = x + block / 2 - (fruitX + block / 2);
        let distY = y + block / 2 - (fruitY + block / 2);
        let distance = Math.sqrt(distX * distX + distY * distY);

        return distance < block;
    }

    function checkHighScore() {
        if (parseInt(highScore.innerText) < parseInt(score.innerText)) {
            highScore.innerText = score.innerText;
            localStorage.setItem("highScore", highScore.innerText);
        }
    }

    function resetGame() {
        x = 50; y = 50;
        bodyArr = [];
        direction = 'right';
        level.innerText = "1";
        generateNewFruit();
        addBody();
        document.querySelector("#sValue").innerText = score.innerText;
        document.querySelector("#finalHighValue").innerText = highScore.innerText;
        document.querySelector("#startingHighValue").innerText = highScore.innerText;
        score.innerText = 0;
        gameScreen.style.display = 'none';
        endScreen.style.display = 'flex';
    }

}