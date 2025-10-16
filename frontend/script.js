"use strict";
let currentUser = null;
// async function register() {
//     const username = (document.getElementById("username") as HTMLInputElement)?.value;
//     const password = (document.getElementById("password") as HTMLInputElement)?.value;
//     const res = await fetch("/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password })
//     });
//     const data = await res.json();
//     alert(data.message);
// }
async function guess() {
    var _a;
    const guessInput = (_a = document.getElementById("guess")) === null || _a === void 0 ? void 0 : _a.value;
    if (guessInput) {
        //TODO: retry when guessInput is not a number
        let guess = +guessInput;
        const res = await fetch("/guess", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guess })
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
    }
    else {
        alert("need to enter a number first");
    }
}
// Event Listener erst setzen, wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", () => {
    var _a;
    (_a = document.getElementById("guessBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", guess);
    //document.getElementById("logoutBtn")?.addEventListener("click", logout);
});
