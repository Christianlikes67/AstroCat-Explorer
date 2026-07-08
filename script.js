// ================================
// 🚀 Cosmic Cat Command
// ================================


const API_KEY = "JNYfA9aTzjtGDTaRmjuI1DRyX80A8eTwZlKbPFvD";

const image = document.getElementById("spaceImage");
const title = document.getElementById("pictureTitle");
const description = document.getElementById("pictureDescription");
const pictureDate = document.getElementById("pictureDate");
const status = document.getElementById("status");

const searchButton = document.getElementById("searchButton");
const randomButton = document.getElementById("randomButton");
const datePicker = document.getElementById("datePicker");

const catFact = document.getElementById("catFact");

// ================================
// 🐱 Cat Facts
// ================================

const facts = [

"Space cats believe every star is a laser pointer.",

"Cats would definitely become astronauts for free snacks.",

"Commander Whiskers has visited over 900 galaxies.",

"Every mission starts with a nap.",

"The Moon is basically one giant cat bed.",

"Zero gravity makes zoomies even faster.",

"Cats secretly control black holes."

];

// ================================
// Random Cat Fact
// ================================

function newFact(){

    const random = Math.floor(Math.random()*facts.length);

    catFact.textContent = facts[random];

}

// ================================
// NASA Fetch
// ================================

async function loadPicture(date=""){

    status.textContent="🛰️ Contacting NASA satellites...";

    let url=`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

    if(date){

        url+=`&date=${date}`;

    }

    try{

        const response=await fetch(url);

        const data=await response.json();

        image.style.opacity="0";

        setTimeout(()=>{

            image.src=data.url;

            image.animate(

[
{transform:"scale(.95)"},
{transform:"scale(1)"}
],

{
duration:500
}

);

        },300);

        title.textContent=data.title;

        description.textContent=data.explanation;

        pictureDate.textContent="📅 "+data.date;

        status.textContent="✅ Mission Complete";

completedMission();
updateAchievement();
updateXP();

newFact();

    }

    catch(error){

        status.textContent="❌ Houston...the space cats lost connection.";

        console.log(error);

    }

}

// ================================
// Search Button
// ================================

searchButton.addEventListener("click",()=>{

    loadPicture(datePicker.value);

});

// ================================
// Random Mission
// ================================

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

// ================================
// Easter Egg
// ================================

document.querySelector(".hero-image").addEventListener("click",()=>{

    alert("🐱 Meow! Ready for another cosmic adventure?");

});

// ================================
// Load Today's Picture
// ================================

loadPicture();
// ==================================
// Mission Counter
// ==================================

let missions = Number(localStorage.getItem("missions")) || 0;

const missionCount = document.getElementById("missionCount");

const catRank = document.getElementById("catRank");

function updateRank(){

    missionCount.textContent = missions;

    if(missions < 5){

        catRank.textContent="Rookie Explorer";

    }

    else if(missions < 15){

        catRank.textContent="Galaxy Hunter";

    }

    else if(missions < 30){

        catRank.textContent="Nebula Captain";

    }

    else{

        catRank.textContent="Legendary Space Cat";

    }

}

updateRank();

function completedMission(){

    missions++;

    localStorage.setItem("missions",missions);

    updateRank();

}
function shootingStar(){

    const star=document.createElement("div");

    star.className="shooting-star";

    star.style.top=Math.random()*300+"px";

    star.style.left=(window.innerWidth+200)+"px";

    document.body.appendChild(star);

    setTimeout(()=>{

        star.remove();

    },2000);

}

setInterval(shootingStar,5000);
const xpFill=document.getElementById("xpFill");

function updateXP(){

let xp=(missions%20)*5;

xpFill.style.width=xp+"%";

}

updateXP();
const achievement=document.getElementById("achievement");

function updateAchievement(){

if(missions<5){

achievement.textContent="🌙 Moon Visitor";

}

else if(missions<15){

achievement.textContent="☄️ Galaxy Hunter";

}

else if(missions<30){

achievement.textContent="🪐 Nebula Master";

}

else{

achievement.textContent="👑 Legendary Space Cat";

}

}

updateAchievement();
const rocket=document.createElement("div");

rocket.id="rocket";

rocket.innerHTML="🚀";

document.body.appendChild(rocket);

document.addEventListener("mousemove",(e)=>{

rocket.style.left=e.pageX+15+"px";

rocket.style.top=e.pageY+10+"px";

});