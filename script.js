function startTime()
{
    var today= new Date(),hours = today.getHours(), minutes = today.getMinutes(),
    date = today.getDate(), day = today.getDay(), month = today.getMonth();

    hours = (hours == 0) ? 12 : hours;
    hours = (hours > 12) ? hours - 12 : hours;

    hours = checkTime(hours);
    minutes = checkTime(minutes);

    var dia = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves" , "Vieres", "Sabado"],
    mes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

    var hr = document.getElementById('time').innerHTML = hours + ":" + minutes,
    dt = document.getElementById('date').innerHTML = dia [day] + " , " + date + " De " + mes [month];

    var time = setTimeout(function(){
        startTime();
    },500);
}

function checkTime(e){
    if( e < 10){
        e = "0" + e;
    }
    return e;
}

var time = new Date();
var deltaTime = 0;

if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(Init, 1);
}else{
    document.addEventListener("DOMContentLoaded", Init); 
}

function Init() {
    time = new Date();
    Start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

var sueloY = 22;
var velY = 0;
var impulso = 900;
var gravedad = 2500;
var roboPosX = 42;
var roboPosY = sueloY; 
var sueloX = 0;
var velEscenario = 1280/3;
var gameVel = 1;
var score = 0;
var parado = false;
var saltando = false;
var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];
var tiempoHastaNube = 0.5;
var tiempoNubeMin = 0.7;
var tiempoNubeMax = 2.7;
var maxNubeY = 270;
var minNubeY = 100;
var nube = [];
var velNube = 0.5;
var contenedor;
var robo;
var textoScore;
var suelo1;
var gameOver;

function Start() {
    gameOver = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    robo = document.querySelector(".robo");
    document.addEventListener("keydown", HandleKeyDown);
}

function Update() {
    if(parado) return;
    
    MoverRobo();
    MoverSuelo();
    DecidirCrearObstaculos();
    DecidirCrearNube();
    MoverObstaculos();
    MoverNube();
    DetectarColision();

    velY -= gravedad * deltaTime;
}

function HandleKeyDown(ev){
    if(ev.keyCode == 32){
        Saltar();
    }
}

function Saltar(){
    if(roboPosY === sueloY){
        saltando = true;
        velY = impulso;
        robo.classList.remove("robo-corriendo");
    }
}

function MoverRobo() {
    roboPosY += velY * deltaTime;
    if(roboPosY < sueloY){
        
        TocarSuelo();
    }
    robo.style.bottom = roboPosY+"px";
}

function TocarSuelo() {
    roboPosY = sueloY;
    velY = 0;
    if(saltando){
        robo.classList.add("robo-corriendo");
    }
    saltando = false;
}

function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

function Estrellarse() {
    robo.classList.remove("robo-corriendo");
    robo.classList.add("robo-estrellado");
    parado = true;
}

function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if(tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

function DecidirCrearNube() {
    tiempoHastaNube -= deltaTime;
    if(tiempoHastaNube <= 0) {
        CrearNube();
    }
}

function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("edificio");
    if(Math.random() > 0.5) obstaculo.classList.add("edificio2");
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth+"px";
    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax-tiempoObstaculoMin) / gameVel;
}

function CrearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth+"px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY-minNubeY)+"px";
   tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax-tiempoNubeMin) / gameVel;
}

function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if(obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        }else{
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX+"px";
        }
    }
}

function MoverNube() {
    for (var i = nube.length - 1; i >= 0; i--) {
        if(nube[i].posX < -nube[i].clientWidth) {
            nube[i].parentNode.removeChild(nube[i]);
            nube.splice(i, 1);
        }else{
            nube[i].posX -= CalcularDesplazamiento() * velNube;
            nube[i].style.left = nubes[i].posX+"px";
        }
    }
}

function GanarPuntos() {
    score++;
    textoScore.innerText = score;
    if(score == 5){
        gameVel = 1.5;
        contenedor.classList.add("mediodia");
    }else if(score == 10) {
        gameVel = 2;
        contenedor.classList.add("tarde");
    } else if(score == 20) {
        gameVel = 3;
        contenedor.classList.add("noche");
    }
    suelo.style.animationDuration = (3/gameVel)+"s";
}

function GameOver() {
    Estrellarse();
    gameOver.style.display = "block";
}

function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if(obstaculos[i].posX > roboPosX + robo.clientWidth) {
            
            break; 
        }else{
            if(IsCollision(robo, obstaculos[i], 10, 30, 15, 20)) {
                GameOver();
            }
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}
