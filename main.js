// Objetos importantes del canvas
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

// Crear objeto nave
var nave = {
    x: 100,
    y: canvas.height - 100,
    width: 50,
    height: 50
}
var game = {
    state: 'iniciando'
}
var teclado = {}

// Array para los disparos
var disparos = []

// Array para almacenar enemigos
var enemies = []

// Definir variables para imagenes
var fondo

// Definir funciones
function loadMedia() {
    fondo = new Image()
    fondo.src = './assets/space.jpg'
    fondo.onload = function() {
        var intervalo = window.setInterval(frameLoop, 1000/55)
    }
}

function drawEnemy() {
    for(var i in enemies) {
        var enemy = enemies[i]
        ctx.save()
        if(enemy.state == 'vivo') {
            ctx.fillStyle = 'red'
        }
        if(enemy.state == 'muerto') {
            ctx.fillStyle = 'black'
        }
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
    }
}

function drawBackground() {
    ctx.drawImage(fondo, 0, 0)
}

function drawSpaceShip() {
    ctx.save()
    ctx.fillStyle = 'white'
    ctx.fillRect(nave.x, nave.y, nave.width, nave.height)
    ctx.restore()
}

function addEventKeyboard() {

    addEvents(document, "keydown", function(e) {
        //Colocamos true la tecla presionada
        teclado[e.keyCode] = true;
    })

    addEvents(document, "keyup", function(e) {
        //Colocamos false la tecla soltada
        teclado[e.keyCode] = false;
    })

    function addEvents(elemento, nombreEvento, funcion) {
        if(elemento.addEventListener) {
            //Chrome
            elemento.addEventListener(nombreEvento, funcion, false)
        }
        else if(elemento.attachEvent) {
            //Explorer
            elemento.attachEvent(nombreEvento, funcion)
        }
    }
}

function moveSpaceShip() {
    //Movimiento a la izquierda
    if(teclado[37]) {
        nave.x -= 10
        if(nave.x < 0) nave.x = 0

    }
    //Movimiento a la derecha
    if(teclado[39]) {
        nave.x += 10
        if(nave.x > canvas.width - nave.width) nave.x = canvas.width - nave.width
        
    }
    //Disparar
    if(teclado[32]) {
        if(!teclado.fire) {
            fire()
            teclado.fire = true
        }
    }
    else {
        teclado.fire = false
    }
}

function updateEnemy() {
    if(game.state == 'iniciando') {
        for(var i = 0; i<10; i++) {
            enemies.push({
                x: 10 + (i*50),
                y: 10,
                width: 40,
                height: 40,
                state: 'vivo'
            })
        }
        game.state = 'jugando'
    }
}

function moveShoot() {
    for(var i in disparos) {
        var disparo = disparos[i]
        disparo.y -= 2
    }
    disparos = disparos.filter(function(disparo) {
        return disparo.y > 0
    })
}

function fire() {
    disparos.push({
        x: nave.x + 20,
        y: nave.y - 10,
        width: 10,
        height: 30
    })
}

function drawShoot() {
    ctx.save()
    ctx.fillStyle = 'white'
    for(var i in disparos) {
        var disparo = disparos[i]
        ctx.fillRect(disparo.x, disparo.y, disparo.width, disparo.height)
    }
    ctx.restore()
}

function frameLoop() {
    moveSpaceShip()
    moveShoot()
    updateEnemy()
    drawBackground()
    drawSpaceShip()
    drawShoot()
    drawEnemy()
}

// Ejecucion de funciones
loadMedia()
addEventKeyboard()