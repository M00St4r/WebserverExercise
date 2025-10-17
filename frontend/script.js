"use strict";
let currentUser = null;
let currentID;
async function guess() {
    const guessInput = document.getElementById("guess");
    const scoreboard = document.querySelector("#scoreboard");
    if (!(guessInput.value === "")) {
        //TODO: retry when guessInput is not a number
        let guess = +guessInput.value;
        const res = await fetch("/guess", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guess: guess, id: currentID })
        });
        if (!res.ok) {
            const data = await res.json();
            alert(data.message);
            return;
        }
        const data = await res.json();
        const result = document.querySelector("#result");
        if (data.result) {
            result.innerText = "Guess was correct!!!";
        }
        else {
            result.innerText = "Guessed wrong. Goal was: " + data.number;
        }
        let scores = data.scores;
        //console.log(scores);
        scoreboard.innerHTML = "";
        for (var user of scores) {
            let p = document.createElement("p");
            p.innerText = user.username + "  " + user.games + "  " + user.wins;
            scoreboard.appendChild(p);
        }
        guessInput.value = "";
    }
    else {
        alert("need to enter a number first");
    }
}
//#region acount functionality
async function register() {
    var _a, _b;
    const username = (_a = document.getElementById("username")) === null || _a === void 0 ? void 0 : _a.value;
    const password = (_b = document.getElementById("password")) === null || _b === void 0 ? void 0 : _b.value;
    const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    alert(data.message);
}
async function login() {
    var _a, _b;
    const username = (_a = document.getElementById("username")) === null || _a === void 0 ? void 0 : _a.value;
    const password = (_b = document.getElementById("password")) === null || _b === void 0 ? void 0 : _b.value;
    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
        alert(data.message);
        return;
    }
    if (data.success) {
        currentUser = username;
        currentID = data.id;
        const greetingElem = document.getElementById("greeting");
        if (greetingElem)
            greetingElem.innerText = "Hello " + currentUser;
        const loginFormElem = document.getElementById("loginForm");
        if (loginFormElem)
            loginFormElem.style.display = "none";
        const welcomeElem = document.getElementById("welcome");
        if (welcomeElem)
            welcomeElem.style.display = "block";
        let scores = data.scores;
        //console.log(scores);
        for (var user of scores) {
            let p = document.createElement("p");
            p.innerText = user.username + "  " + user.games + "  " + user.wins;
            scoreboard.appendChild(p);
        }
    }
    else {
        alert(data.message);
    }
}
function logout() {
    currentUser = null;
    const loginFormElem = document.getElementById("loginForm");
    if (loginFormElem)
        loginFormElem.style.display = "block";
    const welcomeElem = document.getElementById("welcome");
    if (welcomeElem)
        welcomeElem.style.display = "none";
}
// Event Listener erst setzen, wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", () => {
    var _a, _b, _c, _d;
    (_a = document.getElementById("guessBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", guess);
    (_b = document.getElementById("loginBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", login);
    (_c = document.getElementById("registerBtn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", register);
    (_d = document.getElementById("logoutBtn")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", logout);
});
