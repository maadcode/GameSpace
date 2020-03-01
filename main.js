// Objetos importantes del canvas
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

// Crear objeto nave
var nave = {
    x: 100,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    cont: 0
}
var game = {
    state: 'iniciando'
}
var teclado = {}
var textAnswer = {
    cont : -1,
    title: '',
    subtitle: ''
}

// Array para los disparos
var disparos = []
var disparosEnemies = []

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
    if(nave.state == 'hit') {
        nave.cont++
        if(nave.cont >= 20) {
            nave.cont = 0
            nave.state = 'muerto'
            game.state = 'over'
            textAnswer.title = 'Game over'
            textAnswer.subtitle = 'Presionar R para continuar'
            textAnswer.cont = 0
        }
    }
}

function drawShootEnemy() {
    for(var i in disparosEnemies) {
        var disparo = disparosEnemies[i]
        ctx.save()
        ctx.fillStyle = 'yellow'
        ctx.fillRect(disparo.x, disparo.y, disparo.width, disparo.height)
        ctx.restore()
    }
}

function moveShootEnemies() {
    for(var i in disparosEnemies) {
        var disparo = disparosEnemies[i]
        disparo.y += 3
    }
    disparosEnemies = disparosEnemies.filter(function(disparo) {
        return disparo.y < canvas.height;
    })
}

function updateEnemy() {
    function addShootEnemies(enemy) {
        return {
            x: enemy.x,
            y: enemy.y,
            width: 10,
            height: 33,
            cont: 0
        }
    }
    if(game.state == 'iniciando') {
        for(var i = 0; i<10; i++) {
            enemies.push({
                x: 10 + (i*50),
                y: 10,
                width: 40,
                height: 40,
                state: 'vivo',
                cont: 0
            })
        }
        game.state = 'playing'
    }
    for(var i in enemies) {
        var enemy = enemies[i]
        if(!enemy) continue
        if(enemy && enemy.state == 'vivo') {
            enemy.cont++
            enemy.x += Math.sin(enemy.cont * Math.PI/90)*5

            if(aleatorio(0, enemies.length * 10) == 4) {
                disparosEnemies.push(addShootEnemies(enemy))
            }
        }
        if(enemy && enemy.state == 'hit') {
            enemy.cont++
            if(enemy.cont >= 20) {
                enemy.state = 'muerto'
                enemy.cont = 0
            }
        }
    }

    enemies = enemies.filter(function(enemy) {
        if(enemy && enemy.state != 'muerto') return true
        return false
    })
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

function drawText() {
    if(textAnswer.cont == -1) return
    var alpha = textAnswer.cont / 50.0
    if(alpha > 1) {
        for(var i in enemies) {
            delete enemies[i]
        }
    }
    ctx.save()
    ctx.globalAlpha = alpha
    if(game.state == 'over') {
        ctx.fillStyle = 'white'
        ctx.font = 'Bold 40pt Arial'
        ctx.fillText(textAnswer.title, 140, 200)
        ctx.font = '14pt Arial'
        ctx.fillText(textAnswer.subtitle, 190, 250)
    }
    if(game.state == 'win') {
        ctx.fillStyle = 'white'
        ctx.font = 'Bold 40pt Arial'
        ctx.fillText(textAnswer.title, 140, 200)
        ctx.font = '14pt Arial'
        ctx.fillText(textAnswer.subtitle, 190, 250)
    }
    ctx.restore()
}

function updateStateGame() {
    if(game.state == 'playing' && enemies.length == 0) {
        game.state = 'win'
        textAnswer.title = 'Venciste a todos los enemigos'
        textAnswer.subtitle = 'Presiona R para continuar'
        textAnswer.cont = 0
    }
    if(textAnswer.cont >= 0) {
        textAnswer.cont++
    }
    if((game.state == 'over' || game.state == 'win') && teclado[82]) {
        game.state = 'iniciando'
        nave.state = 'vivo'
        textAnswer.cont = -1
    }
}

function hit(a, b) {
    var hit = false
    if(b.x + b.width >= a.x && b.x < a.x + a.width) {
        if(b.y + b.height >= a.y && b.y < a.y + a.height) {
            hit = true
        }
    }   
    if(b.x <= a.x && b.x + b.width >= a.x + a.width) {
        if(b.y <= a.y && b.y + b.height >= a.y + a.height) {
            hit = true
        }
    }
    if(a.x <= b.x && a.x + a.width >= b.x + b.width) {
        if(a.y <= b.y && a.y + a.height >= b.y + b.height) {
            hit = true
        }
    }
    return hit
}

function verifyHit() {
    for(var i in disparos) {
        var disparo = disparos[i]
        for(j in enemies) {
            var enemy = enemies[j]
            if(hit(disparo, enemy)) {
                enemy.state = 'hit'
                enemy.cont = 0 
            }
        }
    }
    if(nave.state == 'hit' || nave.state == 'muerto') return
    for(var i in disparosEnemies) {
        var disparo = disparosEnemies[i]
        if(hit(disparo, nave)) {
            nave.state = 'hit'
        }
    }
}

function aleatorio(inferior, superior) {
    var posibility = superior - inferior
    var numberAleatorio = Math.random() * posibility
    numberAleatorio = Math.floor(numberAleatorio)
    return parseInt(inferior) + numberAleatorio
}

function frameLoop() {
    updateStateGame()
    moveSpaceShip()
    moveShoot()
    moveShootEnemies()
    updateEnemy()
    drawBackground()
    drawSpaceShip()
    drawShoot()
    drawEnemy()
    drawShootEnemy()
    drawText()
    verifyHit()
}

// Ejecucion de funciones
loadMedia()
addEventKeyboard()