
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
// Cursor-following YouTube player (replaces the old rocket cursor)
;(function createCursorPlayer(){
    const videoId = 'N3IMpjiB0LQ';

    const container = document.createElement('div');
    container.id = 'cursorPlayer';
    container.className = 'cursor-player';
    container.innerHTML = `
        <div id="yt-player"></div>
        <div class="cursor-controls">
            <button id="vp-play" aria-label="Play/Pause">⏯️</button>
            <button id="vp-mute" aria-label="Mute/Unmute">🔇</button>
        </div>
    `;
    document.body.appendChild(container);

    let ytPlayer = null;
    let playerReady = false;

    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = function(){
        ytPlayer = new YT.Player('yt-player', {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                controls: 0,
                rel: 0,
                modestbranding: 1,
                playsinline: 1
            },
            events: {
                onReady: () => {
                    playerReady = true;
                    try{ ytPlayer.mute(); }catch(e){}
                    try{ ytPlayer.playVideo(); }catch(e){}
                }
            }
        });
    };

    // Controls
    container.querySelector('#vp-play')?.addEventListener('click', () => {
        if (!playerReady) return;
        const state = ytPlayer.getPlayerState();
        // 1 = playing, 2 = paused
        if (state === 1) ytPlayer.pauseVideo();
        else ytPlayer.playVideo();
    });

    container.querySelector('#vp-mute')?.addEventListener('click', (e) => {
        if (!playerReady) return;
        if (ytPlayer.isMuted()) { ytPlayer.unMute(); e.currentTarget.textContent = '🔊'; }
        else { ytPlayer.mute(); e.currentTarget.textContent = '🔇'; }
    });

    // Smooth follow cursor
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let px = mouseX, py = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.pageX;
        mouseY = e.pageY;
    });

    function animate() {
        px += (mouseX - px) * 0.18;
        py += (mouseY - py) * 0.18;
        container.style.left = (px + 18) + 'px';
        container.style.top = (py + 18) + 'px';
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
})();

