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

function drawBackground() {
    ctx.drawImage(fondo, 0, 0)
}

function drawSpaceShip() {
    ctx.save()
    ctx.fillStyle = 'white'
    ctx.fillRect(nave.x, nave.y, nave.width, nave.height)
    ctx.restore()
}

function frameLoop() {
    drawBackground()
    drawSpaceShip()
}

// Ejecucion de funciones
loadMedia()