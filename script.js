var

myField,
myRoad,
myCar,

leftField,
rightField,

theVoidA,
theVoidB,

myOpponent = [],

myScore

function startGame() {
    myGameArea.start()

    myField = new component(960, 600, 'greenyellow', 0, 0)
    myRoad = new component(300, 600, 'gray', 330, 0)
    myCar = new component(55, 100, 'red', 415, 480)
    myScore = new component('30px', 'Consolas', 'black', 10, 40, 'text')

    leftField = new component(330, 600, 'transparent', 0, 0)
    rightField = new component(330, 600, 'transparent', 630, 0)

    theVoidA = new component(300, 25, 'transparent', 330, 700)
    theVoidB = new component(300, 25, 'transparent', 330, -125)

    // opponentA = new component(55, 100, 'green', 340, 10)
    // opponentB = new component(55, 100, 'green', 490, 10)
    // opponentC = new component(55, 100, 'green', 565, 10)
}

var myGameArea = {
    canvas: document.createElement('canvas'),
    start: function() {
        document.getElementById('container').style.display = 'none'
        this.canvas.width = 960
        this.canvas.height = 600
        this.context = this.canvas.getContext('2d')
        document.body.insertBefore(this.canvas, document.body.childNodes[0])
        this.frameNo = 0
        this.interval = setInterval(updateGameArea, 20)

        window.addEventListener('keydown', function(e) {
            myGameArea.keys = (myGameArea.keys || [])
            myGameArea.keys[e.keyCode] = true
        })
        window.addEventListener('keyup', function(e) {
            myGameArea.keys[e.keyCode] = false
        })
    },
    clear: function() {
        this.context.clearRect(0, 0, this.width, this.height)
    },
    stop: function() {
        clearInterval(this.interval)
    }
}

function component(width, height, color, x, y, type) {
    this.type = type
    if(type == 'image') {
        this.image = new Image()
        this.image.src = color
    }
    this.width = width
    this.height = height
    this.speedX = 0
    this.speedY = 0
    this.x = x
    this.y = y
    this.update = function() {
        ctx = myGameArea.context
        if(type == 'image') {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        } else if(type == 'text') {
            ctx.font = this.width + ' ' + this.height
            ctx.fillStyle = color
            ctx.fillText(this.text, this.x, this.y)
        } else {
            ctx.fillStyle = color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
    this.newPost = function() {
        this.x += this.speedX
        this.y += this.speedY
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x
        var myright = this.x + (this.width)
        var mytop = this.y
        var mybottom = this.y + (this.height)
        var otherleft = otherobj.x
        var otherright = otherobj.x + (otherobj.width)
        var othertop = otherobj.y
        var otherbottom = otherobj.y + (otherobj.height)
        var crash = true
        if((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false
        }
        return crash
    }
}

var score = 0

var speed = 0
var mySpeed = 0

function updateGameArea() {
    for(i = 0; i < myOpponent.length; i++) {
        if(myCar.crashWith(myOpponent[i])) {
            myGameArea.stop()
        }
        if(theVoidA.crashWith(myOpponent[i])) {
            myOpponent[i].y += 1000
        }
        if(theVoidB.crashWith(myOpponent[i])) {
            myOpponent[i].y += 1000
        }
    }

    if(myCar.crashWith(leftField)) {
        myGameArea.keys[37] = false
    }
    if(myCar.crashWith(rightField)) {
        myGameArea.keys[39] = false
    }

    myGameArea.clear()
    myGameArea.frameNo++

    if((myGameArea.frameNo == 1 || everyinterval(40)) && (speed >= 10)) {
        var random = Math.floor(Math.random() * 4)
        var x = [340, 415, 490, 565]

        myOpponent.push(new component(55, 100, 'green', x[random], -100))
    }

    if(speed >= 10) {
        score++
    }

    myField.update()
    myRoad.update()

    for(i = 0; i < myOpponent.length; i++) {
        myOpponent[i].y += speed
        myOpponent[i].update()
    }

    // speed = -3
    myCar.speedX = mySpeed

    if(myGameArea.keys && myGameArea.keys[37]) { 
        myCar.speedX -= 5
    }
    if(myGameArea.keys && myGameArea.keys[39]) { 
        myCar.speedX += 5
    }
    if(myGameArea.keys && myGameArea.keys[38]) { 
        speed = 10
    }
    if(myGameArea.keys && myGameArea.keys[40]) { 
        speed = -3
    }

    leftField.update()
    rightField.update()

    myScore.text = 'SCORE: ' + score
    myScore.update()

    myCar.newPost()
    myCar.update()
}

function everyinterval(n) {
    if((myGameArea.frameNo / n) % 1 == 0) {
        return true
    }
    return false
}