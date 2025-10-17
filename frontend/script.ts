let currentUser: string | null = null;
let currentID: number;

async function guess() {
    const guessInput: HTMLInputElement = (document.getElementById("guess") as HTMLInputElement);
    
    const scoreboard: HTMLDivElement = document.querySelector("#scoreboard")!;

    if (!(guessInput.value === "")) {

        //TODO: retry when guessInput is not a number
        let guess: number = +guessInput.value;

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

        const result: HTMLParagraphElement = document.querySelector("#result")!;

        if (data.result) {
            result.innerText = "Guess was correct!!!";
        } else {
            result.innerText = "Guessed wrong. Goal was: " + data.number;
        }

        let scores = data.scores;
        //console.log(scores);
        scoreboard.innerHTML = "";
        for (var user of scores) {
            let p: HTMLParagraphElement = document.createElement("p");
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
    const username = (document.getElementById("username") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)?.value;

    const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    alert(data.message);
}

async function login() {
    const username = (document.getElementById("username") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)?.value;

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
        currentID = data.id

        const greetingElem = document.getElementById("greeting");
        if (greetingElem) greetingElem.innerText = "Hello " + currentUser;

        const loginFormElem = document.getElementById("loginForm");
        if (loginFormElem) loginFormElem.style.display = "none";

        const welcomeElem = document.getElementById("welcome");
        if (welcomeElem) welcomeElem.style.display = "block";

        let scores = data.scores;
        //console.log(scores);
        for (var user of scores) {
            let p: HTMLParagraphElement = document.createElement("p");
            p.innerText = user.username + "  " + user.games + "  " + user.wins;
            scoreboard.appendChild(p);
        }

    } else {
        alert(data.message);
    }
}

function logout() {
    currentUser = null;

    const loginFormElem = document.getElementById("loginForm");
    if (loginFormElem) loginFormElem.style.display = "block";

    const welcomeElem = document.getElementById("welcome");
    if (welcomeElem) welcomeElem.style.display = "none";
}

// Event Listener erst setzen, wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("guessBtn")?.addEventListener("click", guess);

    document.getElementById("loginBtn")?.addEventListener("click", login);
    document.getElementById("registerBtn")?.addEventListener("click", register);
    document.getElementById("logoutBtn")?.addEventListener("click", logout);
});
