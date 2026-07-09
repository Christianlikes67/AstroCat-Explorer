
const API_KEY = "DEMO_KEY";

const image = document.getElementById("spaceImage");
const title = document.getElementById("pictureTitle");
const description = document.getElementById("pictureDescription");
const pictureDate = document.getElementById("pictureDate");
const status = document.getElementById("status");

const searchButton = document.getElementById("searchButton");
const randomButton = document.getElementById("randomButton");
const datePicker = document.getElementById("datePicker");

const catFact = document.getElementById("catFact");

const facts = [
    "Space cats believe every star is a laser pointer.",
    "Cats would definitely become astronauts for free snacks.",
    "Commander Whiskers has visited over 900 galaxies.",
    "Every mission starts with a nap.",
    "The Moon is basically one giant cat bed.",
    "Zero gravity makes zoomies even faster.",
    "Cats secretly control black holes."
];

function newFact() {
    const random = Math.floor(Math.random() * facts.length);
    if (catFact) catFact.textContent = facts[random];
}
async function loadPicture(date=""){

    if (status) status.textContent = "Contacting NASA...";

    let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
    if (date) url += `&date=${date}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (image) {
            image.style.opacity = "0";
            setTimeout(() => {
                image.src = data.url;
                image.animate(
                    [{ transform: "scale(.95)" }, { transform: "scale(1)" }],
                    { duration: 500 }
                );
                image.style.opacity = "1";
            }, 300);
        }

        if (title) title.textContent = data.title;
        if (description) description.textContent = data.explanation;
        if (pictureDate) pictureDate.textContent = "📅 " + data.date;
        if (status) status.textContent = "Mission complete";

        completedMission();
        updateAchievement();
        updateXP();
        newFact();

    } catch (error) {
        if (status) status.textContent = "Connection lost";
        console.error(error);
    }

}

searchButton.addEventListener("click",()=>{

    loadPicture(datePicker.value);

});

randomButton.addEventListener("click",()=>{

    const start=new Date(1995,5,16);

    const end=new Date();

    const randomDate=new Date(

        start.getTime()+Math.random()*(end.getTime()-start.getTime())

    );

    const formatted=randomDate.toISOString().split("T")[0];

    datePicker.value=formatted;

    loadPicture(formatted);

});

document.querySelector(".hero-image").addEventListener("click",()=>{

    alert("🐱 Meow! Ready for another cosmic adventure?");

});

loadPicture();

let missions = Number(localStorage.getItem("missions")) || 0;
const missionCount = document.getElementById("missionCount");
const catRank = document.getElementById("catRank");

function updateRank() {
    if (missionCount) missionCount.textContent = missions;

    if (catRank) {
        if (missions < 5) catRank.textContent = "Rookie Explorer";
        else if (missions < 15) catRank.textContent = "Galaxy Hunter";
        else if (missions < 30) catRank.textContent = "Nebula Captain";
        else catRank.textContent = "Legendary Space Cat";
    }
}

updateRank();

function completedMission() {
    missions++;
    localStorage.setItem("missions", missions);
    updateRank();
}
function shootingStar() {
    const star = document.createElement("div");
    star.className = "shooting-star";
    star.style.top = Math.random() * 300 + "px";
    star.style.left = (window.innerWidth + 200) + "px";
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 2000);
}

setInterval(shootingStar, 5000);

const xpFill = document.getElementById("xpFill");
function updateXP() {
    if (!xpFill) return;
    let xp = (missions % 20) * 5;
    xpFill.style.width = xp + "%";
}

updateXP();

const achievement = document.getElementById("achievement");
function updateAchievement() {
    if (!achievement) return;
    if (missions < 5) achievement.textContent = "Moon Visitor";
    else if (missions < 15) achievement.textContent = "Galaxy Hunter";
    else if (missions < 30) achievement.textContent = "Nebula Master";
    else achievement.textContent = "Legendary Space Cat";
}

updateAchievement();
const rocket = document.createElement("div");
rocket.id = "rocket";
rocket.textContent = "🚀";
document.body.appendChild(rocket);
document.addEventListener("mousemove", (e) => {
    rocket.style.left = e.pageX + 15 + "px";
    rocket.style.top = e.pageY + 10 + "px";
});