
let currentSong = new Audio();

var songs ;
let currFolder ;
let cards = document.querySelector(".cards");
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
   currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${currFolder}/`);
    let response = await a.text();
    

    let div = document.createElement("div");
    div.innerHTML = response;

    
    
    let as = div.getElementsByTagName("a");

    songs = [];
for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href && element.href.endsWith(".mp3")) {
        const splitArray = element.href.split(`/${currFolder}/`);
        if (splitArray.length > 1) {
            songs.push(splitArray[1]);
        }
    }
}

    console.log(songs);

    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];

    songUl.innerHTML = "";
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" src="svgs/music.svg" alt="music">
        <div class="info">
            <div>${song.replaceAll("%20", " ").replaceAll(".mp3", "")}</div>
            
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img src="svgs/play.svg" class="invert" alt="play now">
        </div>                  
        </li>`;
    
}
Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
       
        playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    })

})
}



function playMusic( track, pause = false) {
    currentSong.src = `/${currFolder}/` + track + ".mp3";
    
    
    if (!pause) {
        currentSong.play();
        play.src = "svgs/pause.svg";
    }
    document.querySelector(".song-info").innerHTML = `${track}`;
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00";

}


async function displayAlbums(){
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
   
    for (const e of anchors) {
        if (e.href.includes("/songs/")) {
            const folder = e.href.split("/songs/")[1];
    let a = await fetch(`https://dwivedi-developer.github.io/MeloHub/songs/${folder}/info.json`);
    let resp = await a.json().catch(err => console.error(err));
    
    cards.innerHTML= cards.innerHTML + `<div data-folder='${folder}' class="card">

    <div class="play">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round" />
        </svg>

    </div>
    <img src="songs/${folder}/cover.jpg" alt="">
    <h2>${resp.title}</h2>
    <p>${resp.description}</p>
</div>`
    }}
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
       
        e.addEventListener("click", async item =>{
       
        await getSongs(`songs/${item.currentTarget.dataset.folder}`);
     
         
         })
         })
    
    
    }



 async function main() {

    
    await getSongs("songs/bhakti.mp3");
    playMusic(songs[0].replaceAll("%20", " ").replaceAll(".mp3", ""),true);
    
    
    displayAlbums();
    
    
    
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svgs/pause.svg";
        }

        else {
            currentSong.pause();
            play.src = "svgs/play.svg";
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        
        document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        if ((currentSong.currentTime / currentSong.duration) * 100 + "%" === "100%") {
            play.src = "svgs/play.svg";
            next.click();
        }
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        var percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    document.querySelector(".ham").addEventListener("click", e => {
        document.querySelector(".left").style.left = "0";
    });
    document.querySelector(".close").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-120%";
    })

    previous.addEventListener("click", () => {


        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1].replaceAll("%20", " ").replaceAll(".mp3", ""));
        }
        else {
            previous.style.Stroke = "grey";
        }
    })

    next.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {

            playMusic(songs[index + 1].replaceAll("%20", " ").replaceAll(".mp3", ""))
        }
        else{
            playMusic(songs[0].replaceAll("%20", " ").replaceAll(".mp3", ""));
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

        currentSong.volume = parseInt(e.target.value) / 100;
    });

   document.querySelector(".volume > img").addEventListener("click", e => {
    console.log(e);
    if (currentSong.volume === 0){
        e.target.src = "svgs/vol.svg";
        currentSong.volume = 0.20;
        document.querySelector(".range").getElementsByTagName("input")[0].value = (currentSong.volume)*100;
    }
    else{
        e.target.src = "svgs/mute.svg";
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = (currentSong.volume)*100;
    }
   });
    
    
}

main();




