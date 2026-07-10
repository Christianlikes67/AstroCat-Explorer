const API_KEY = "DEMO_KEY";

const facts = [
    "Space cats believe every star is a laser pointer.",
    "Cats would definitely become astronauts for free snacks.",
    "Commander Whiskers has visited over 900 galaxies.",
    "Every mission starts with a nap.",
    "The Moon is basically one giant cat bed.",
    "Zero gravity makes zoomies even faster.",
    "Cats secretly control black holes."
];

const elements = {
    image: document.getElementById("spaceImage"),
    title: document.getElementById("pictureTitle"),
    description: document.getElementById("pictureDescription"),
    pictureDate: document.getElementById("pictureDate"),
    status: document.getElementById("status"),
    searchButton: document.getElementById("searchButton"),
    randomButton: document.getElementById("randomButton"),
    datePicker: document.getElementById("datePicker"),
    catFact: document.getElementById("catFact"),
    missionCount: document.getElementById("missionCount"),
    catRank: document.getElementById("catRank"),
    xpFill: document.getElementById("xpFill"),
    achievement: document.getElementById("achievement")
};

let missions = Number(localStorage.getItem("missions")) || 0;

function newFact() {
    if (!elements.catFact) return;
    const random = Math.floor(Math.random() * facts.length);
    elements.catFact.textContent = facts[random];
}

function updateRank() {
    if (elements.missionCount) elements.missionCount.textContent = missions;

    if (!elements.catRank) return;

    if (missions < 5) elements.catRank.textContent = "Rookie Explorer";
    else if (missions < 15) elements.catRank.textContent = "Galaxy Hunter";
    else if (missions < 30) elements.catRank.textContent = "Nebula Captain";
    else elements.catRank.textContent = "Legendary Space Cat";
}

function updateXP() {
    if (!elements.xpFill) return;
    const xp = (missions % 20) * 5;
    elements.xpFill.style.width = `${xp}%`;
    elements.xpFill.parentElement?.setAttribute("aria-valuenow", String(xp));
}

function updateAchievement() {
    if (!elements.achievement) return;

    if (missions < 5) elements.achievement.textContent = "Moon Visitor";
    else if (missions < 15) elements.achievement.textContent = "Galaxy Hunter";
    else if (missions < 30) elements.achievement.textContent = "Nebula Master";
    else elements.achievement.textContent = "Legendary Space Cat";
}

function completedMission() {
    missions += 1;
    localStorage.setItem("missions", String(missions));
    updateRank();
    updateXP();
    updateAchievement();
}

async function loadPicture(date = "") {
    if (elements.status) elements.status.textContent = "Contacting NASA...";

    let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
    if (date) url += `&date=${date}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || "Unable to load mission data.");
        }

        if (elements.image) {
            elements.image.style.opacity = "0";
            setTimeout(() => {
                elements.image.src = data.url;
                elements.image.animate(
                    [{ transform: "scale(0.95)" }, { transform: "scale(1)" }],
                    { duration: 500 }
                );
                elements.image.style.opacity = "1";
            }, 300);
        }

        if (elements.title) elements.title.textContent = data.title;
        if (elements.description) elements.description.textContent = data.explanation;
        if (elements.pictureDate) elements.pictureDate.textContent = `📅 ${data.date}`;
        if (elements.status) elements.status.textContent = "Mission complete";

        completedMission();
        newFact();
    } catch (error) {
        if (elements.status) elements.status.textContent = "Connection lost";
        console.error(error);
    }
}

function pickRandomDate() {
    const start = new Date(1995, 5, 16);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const formatted = randomDate.toISOString().split("T")[0];

    if (elements.datePicker) elements.datePicker.value = formatted;
    return formatted;
}

function attachEvents() {
    elements.searchButton?.addEventListener("click", () => {
        loadPicture(elements.datePicker?.value || "");
    });

    elements.randomButton?.addEventListener("click", () => {
        loadPicture(pickRandomDate());
    });

    document.querySelector(".hero-image")?.addEventListener("click", () => {
        alert("🐱 Meow! Ready for another cosmic adventure?");
    });
}

function shootingStar() {
    const star = document.createElement("div");
    star.className = "shooting-star";
    star.style.top = `${Math.random() * 300}px`;
    star.style.left = `${window.innerWidth + 200}px`;
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 2000);
}

function initApp() {
    updateRank();
    updateXP();
    updateAchievement();
    newFact();
    attachEvents();
    loadPicture();
    setInterval(shootingStar, 5000);

    const rocket = document.createElement("div");
    rocket.id = "rocket";
    rocket.textContent = "🚀";
    document.body.appendChild(rocket);

    document.addEventListener("mousemove", (event) => {
        rocket.style.left = `${event.pageX + 15}px`;
        rocket.style.top = `${event.pageY + 10}px`;
    });
}

initApp();
