let currentUser: string | null = null;

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
    const guessInput = (document.getElementById("guess") as HTMLInputElement)?.value;
    if (guessInput) {

        //TODO: retry when guessInput is not a number
        let guess: number = +guessInput;

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

        const result: HTMLParagraphElement = document.querySelector("#result")!;

        if (data.result) {
            result.innerText = "Guess was correct!!!";
        } else {
            result.innerText = "Guessed wrong. Goal was: " + data.number;
        }
    }
    else{
        alert("need to enter a number first");
    }
}

// Event Listener erst setzen, wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("guessBtn")?.addEventListener("click", guess);
    //document.getElementById("logoutBtn")?.addEventListener("click", logout);
});
