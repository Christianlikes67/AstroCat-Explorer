const API_KEY = "JNYfA9aTzjtGDTaRmjuI1DRyX80A8eTwZlKbPFvD";

const notes = [
    "The archive is full of calm, striking views that reward patience.",
    "A single image can tell a story about the sky, the planet, and the people studying it.",
    "Small changes in date can reveal very different moments in the same mission.",
    "Good observations often begin with a simple question: what changed?"
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
    achievement: document.getElementById("achievement"),
    recentMissionsList: document.getElementById("recentMissionsList"),
    moodText: document.getElementById("moodText")
};

let missions = Number(localStorage.getItem("missions")) || 0;
let recentMissions = JSON.parse(localStorage.getItem("recentMissions") || "[]");

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function newFact() {
    if (!elements.catFact) return;
    const random = Math.floor(Math.random() * notes.length);
    elements.catFact.textContent = notes[random];
}

function updateRank() {
    if (elements.missionCount) elements.missionCount.textContent = missions;

    if (!elements.catRank) return;

    if (missions < 5) elements.catRank.textContent = "Observer";
    else if (missions < 15) elements.catRank.textContent = "Archivist";
    else if (missions < 30) elements.catRank.textContent = "Orbit Tracker";
    else elements.catRank.textContent = "Deep Space Reader";
}

function updateXP() {
    if (!elements.xpFill) return;
    const xp = Math.min(100, missions * 5);
    elements.xpFill.style.width = `${xp}%`;
    elements.xpFill.parentElement?.setAttribute("aria-valuenow", String(xp));
}

function updateAchievement() {
    if (!elements.achievement) return;

    if (missions < 5) elements.achievement.textContent = "First mission logged";
    else if (missions < 15) elements.achievement.textContent = "A steady archive habit";
    else if (missions < 30) elements.achievement.textContent = "A reliable observer";
    else elements.achievement.textContent = "A dedicated space reader";
}

function updateMood() {
    if (!elements.moodText) return;

    if (missions < 3) elements.moodText.textContent = "The sky is quiet and patient.";
    else if (missions < 8) elements.moodText.textContent = "A steady thread is forming between each visit.";
    else if (missions < 15) elements.moodText.textContent = "The archive is starting to feel familiar in the best way.";
    else elements.moodText.textContent = "Your little history of sky-watching is beginning to feel real.";
}

function renderRecentMissions() {
    if (!elements.recentMissionsList) return;

    if (recentMissions.length === 0) {
        elements.recentMissionsList.innerHTML = "<li>Nothing logged yet.</li>";
        return;
    }

    elements.recentMissionsList.innerHTML = recentMissions
        .map((item) => `<li><span>${escapeHtml(item.date)}</span><strong>${escapeHtml(item.title)}</strong></li>`)
        .join("");
}

function saveRecentMission(date, title) {
    recentMissions = [{ date, title }, ...recentMissions.filter((item) => item.date !== date)].slice(0, 4);
    localStorage.setItem("recentMissions", JSON.stringify(recentMissions));
    renderRecentMissions();
}

function completedMission() {
    missions += 1;
    localStorage.setItem("missions", String(missions));
    updateRank();
    updateXP();
    updateAchievement();
    updateMood();
}

async function loadPicture(date = "") {
    if (elements.status) elements.status.textContent = "Loading NASA image...";

    const url = new URL("https://api.nasa.gov/planetary/apod");
    url.searchParams.set("api_key", API_KEY);
    if (date) url.searchParams.set("date", date);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || data.error?.message || "Unable to load mission data.");
        }

        if (elements.image) {
            elements.image.classList.remove("is-ready");
            const mediaUrl = data.media_type === "image" ? data.url : data.url;
            elements.image.src = mediaUrl;
            elements.image.alt = data.title || "NASA Astronomy Picture of the Day";
            elements.image.onload = () => {
                elements.image.classList.add("is-ready");
            };
        }

        if (elements.title) elements.title.textContent = data.title || "NASA Astronomy Picture";
        if (elements.description) elements.description.textContent = data.explanation || "";
        if (elements.pictureDate) elements.pictureDate.textContent = `Date: ${data.date}` + (data.copyright ? ` • © ${data.copyright}` : "");
        if (elements.status) elements.status.textContent = "Mission loaded";

        completedMission();
        saveRecentMission(data.date, data.title || "NASA Astronomy Picture");
        newFact();
    } catch (error) {
        if (elements.status) elements.status.textContent = "NASA request failed. Try another date.";
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
        document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

function initApp() {
    updateRank();
    updateXP();
    updateAchievement();
    updateMood();
    renderRecentMissions();
    newFact();
    attachEvents();
    loadPicture();
}

initApp();
