
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

        // APOD can return images or videos. Handle both cleanly.
        if (data.media_type === 'image') {
            // remove any existing video iframe
            const oldVid = document.getElementById('apodVideo');
            if (oldVid) oldVid.remove();

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
        } else if (data.media_type === 'video') {
            // hide image and ensure a video iframe is present
            if (image) {
                image.style.opacity = "0";
                // optionally show a thumbnail if available
                if (data.thumbnail_url) image.src = data.thumbnail_url;
                else image.src = '';
            }

            let iframe = document.getElementById('apodVideo');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'apodVideo';
                iframe.style.width = '100%';
                iframe.style.height = '420px';
                iframe.style.borderRadius = '12px';
                iframe.style.border = 'none';
                iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
                iframe.setAttribute('allowfullscreen', '');
                const container = document.querySelector('.picture-card');
                if (container) container.insertBefore(iframe, container.querySelector('h2'));
            }
            iframe.src = data.url;
        } else {
            // Unknown media type: clear media area
            const oldVid = document.getElementById('apodVideo');
            if (oldVid) oldVid.remove();
            if (image) image.src = '';
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

// Cursor-following audio player (uses local MP3 or lets user pick a file)
;(function createCursorAudio(){
    const defaultSrc = 'media/your_new_home.mp3';

    const container = document.createElement('div');
    container.id = 'cursorPlayer';
    container.className = 'cursor-player';
    container.innerHTML = `
        <audio id="cursorAudio" preload="auto"></audio>
        <div class="cursor-controls">
            <button id="vp-play" aria-label="Play/Pause">⏯️</button>
            <button id="vp-mute" aria-label="Mute/Unmute">🔇</button>
            <input id="vp-file" type="file" accept="audio/*" style="display:none">
        </div>
    `;
    document.body.appendChild(container);

    const audio = container.querySelector('#cursorAudio');
    const playBtn = container.querySelector('#vp-play');
    const muteBtn = container.querySelector('#vp-mute');
    const fileInput = container.querySelector('#vp-file');

    function setSource(src, autoplay = false, muted = true){
        audio.src = src;
        audio.muted = muted;
        if (autoplay){
            const p = audio.play();
            if (p && typeof p.then === 'function') p.catch(()=>{});
        }
    }

    // Try default bundled file (user can drop one via file picker if not present)
    // Check if the file exists before trying to autoplay it.
    fetch(defaultSrc, { method: 'HEAD' }).then(res => {
        if (res.ok) setSource(defaultSrc, true, true);
    }).catch(() => {
        // file not present or fetch blocked — silently ignore
    });

    playBtn.addEventListener('click', () => {
        if (audio.paused) audio.play().catch(()=>{});
        else audio.pause();
    });

    muteBtn.addEventListener('click', (e) => {
        audio.muted = !audio.muted;
        e.currentTarget.textContent = audio.muted ? '🔇' : '🔊';
    });

    // Double-click the player to choose a local file to play
    container.addEventListener('dblclick', () => fileInput.click());
    fileInput.addEventListener('change', (ev) => {
        const f = ev.target.files && ev.target.files[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        setSource(url, true, false);
    });

    // Smooth follow cursor
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let px = mouseX, py = mouseY;
    document.addEventListener('mousemove', (e) => { mouseX = e.pageX; mouseY = e.pageY; });
    function animate(){
        px += (mouseX - px) * 0.18;
        py += (mouseY - py) * 0.18;
        container.style.left = (px + 18) + 'px';
        container.style.top = (py + 18) + 'px';
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
})();

