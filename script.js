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

    myField = new component(960, 600, 'cornflowerblue', 0, 0)
    myRoad = new component(300, 600, 'img/myRoad.png', 330, 0, 'background')
    myCar = new component(55, 120, 'img/myCar.png', 415, 450, 'image')
    myScore = new component('30px', 'Consolas', 'black', 10, 40, 'text')

    leftField = new component(330, 600, 'img/crowd.png', 0, 0, 'background')
    rightField = new component(330, 600, 'img/rightCrowd.png', 630, 0, 'background')

    theVoidA = new component(300, 25, 'transparent', 330, 750)
    theVoidB = new component(300, 25, 'transparent', 330, -150)
}

var myGameArea = {
    canvas: document.createElement('canvas'),
    start: function() {
        document.getElementById('start').style.display = 'none'
        document.getElementById('game-ui').style.display = 'block'
        this.canvas.width = 960
        this.canvas.height = 600
        this.context = this.canvas.getContext('2d')
        document.body.insertBefore(this.canvas, document.body.childNodes[0])
        this.frameNo = 0
        this.interval = setInterval(updateGameArea, 20)

        window.addEventListener('keydown', function(e) {
            myGameArea.keys = (myGameArea.keys || [])
            myGameArea.keys[e.keyCode] = true
            console.log(myGameArea.keys)
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
        document.getElementById('game-over').style.display = 'flex'
        document.getElementById('res-name').innerHTML = document.getElementById('playerName').innerText
        document.getElementById('res-score').innerHTML = document.getElementById('score').innerText
        // document.getElementById('res-time').innerHTML = 'TIME: ' + Math.floor(myGameArea.frameNo / 45) + ' detik'
    }
}

function component(width, height, color, x, y, type) {
    this.type = type
    if(type == 'image' || type == 'background') {
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
        if(type == 'image' || type == 'background') {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
            if(type == 'background') {
                ctx.drawImage(this.image, this.x, this.y - this.height, this.width, this.height)
            }
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
        if(this.type == 'background') {
            if(this.y >= (this.height)) {
                this.y = 0
            }
        }
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
var maxSpeed = 15
var gear = 1

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
    // speed = -3
    myCar.speedX = mySpeed
    speed >= 0 ? speed -= 0.2 : ''

    if((myGameArea.frameNo == 1 || everyinterval(40)) && (speed >= 5)) {
        var random = Math.floor(Math.random() * 4)
        var x = [340, 415, 490, 565]

        myOpponent.push(new component(55, 120, 'img/myOpponent.png', x[random], -120, 'image'))
    }

    if(speed >= 5) {
        score += gear
    }

    myField.update()

    speed >= 0 ? myRoad.y += speed : myRoad.y += 0
    myRoad.newPost()
    myRoad.update()

    for(i = 0; i < myOpponent.length; i++) {
        myOpponent[i].y += speed - 7
        myOpponent[i].update()
    }

    // KURANG GIGI
    if(myGameArea.keys && myGameArea.keys[68]) {
        myGameArea.keys[68] = false
        maxSpeed += 5
        gear++
    }
    // TAMBAH GIGI
    if((maxSpeed >= 15) && (myGameArea.keys && myGameArea.keys[70])) {
        myGameArea.keys[70] = false
        maxSpeed -= 5
        gear--
    }

    if(myGameArea.keys && myGameArea.keys[37]) { 
        speed <= 0 ? myCar.speedX -= 2 : myCar.speedX -= 5
    }
    if(myGameArea.keys && myGameArea.keys[39]) { 
        speed <= 0 ? myCar.speedX += 2 : myCar.speedX += 5
    }
    if(myGameArea.keys && myGameArea.keys[38]) { 
        speed <= maxSpeed ? speed += 0.5 : ''
    }
    if(myGameArea.keys && myGameArea.keys[40]) { 
        speed >= 0 ? speed -= 0.5 : ''
    }

    speed >= 0 ? leftField.y += speed : leftField.y += 0
    leftField.newPost()
    leftField.update()

    speed >= 0 ? rightField.y += speed : rightField.y += 0
    rightField.newPost()
    rightField.update()

    myCar.newPost()
    myCar.update()

    document.getElementById('playerName').innerHTML = 'NAME: ' + document.getElementById('name').value
    document.getElementById('score').innerHTML = 'SCORE: ' + Math.floor(score / 10)
    document.getElementById('speed').innerHTML = 'SPEED: ' + (speed < 0 ? 0 : Math.floor(speed)) + '/' + gear + ' gear'
}

function everyinterval(n) {
    if((myGameArea.frameNo / n) % 1 == 0) {
        return true
    }
    return false
}