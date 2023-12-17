const playBtn = document.querySelector("#mainPlayBtn");
const audio = document.querySelector("#audio");
const btnPrev = document.querySelector("#btnPrev");
const btnNext = document.querySelector("#btnNext");
const songTitle = document.querySelector(".song-title");
const artistName = document.querySelector(".artist-name");
const cover = document.querySelector(".cover");
const slider = document.querySelector(".slider");
const thumb = document.querySelector(".slider-thumb");
const progress = document.querySelector(".progress");
const time = document.querySelector(".time");
const fullTime = document.querySelector(".fullTime");
const volumeSlider = document.querySelector(".volume-slider .slider");
const volumeProgress = document.querySelector(
  ".volume-slider .volume-progress"
);
const volumeIcon = document.querySelector(".volume-icon");

//Global variables
//Is the song playing?

let songPlaying = false;

//Is the volume muted?
let volumeMuted = false;

//Which song is loaded?

let songId = 0;

//Song names
const songs = [
  "etoile et toi",
  "Crystal Cave",
  "MEGALOVANIA",
  "As you like it",
];

//Artists
const artists = ["Monogatari", "Panda eyes", "Undertale", "Eve"];

//Song thumbnail covers
const covers = ["thumbnail1", "thumbnail2", "thumbnail3", "thumbnail4"];

//Click event
playBtn.addEventListener("click", playSong);

function playSong() {
  //if song is not playing
  if (songPlaying === false) {
    //Start audio
    audio.play();
    //need to replace the icon with the pause icon
    playBtn.innerHTML = `
    <span class="material-symbols-outlined">
      pause
    </span>
    `;
    //change the state
    songPlaying = true;
    //Opposite
  } else {
    //pause the audio
    audio.pause();
    playBtn.innerHTML = `<span class="material-symbols-outlined"> play_arrow </span>`;
    songPlaying = false;
  }
}

//Switching songs
function switchSong() {
  //If there's audio
  if (songPlaying === true) {
    audio.play();
    //calling dynamic background color function
    handleImage();
  }
}

const songSrc = "media/" + songs[songId] + ".mp3";

function loadSong() {
  //setting audio source
  audio.src = "media/" + songs[songId] + ".mp3";
  //reloading the song
  audio.load();
  //change the song title
  songTitle.innerHTML = songs[songId];
  //artist name change
  artistName.innerHTML = artists[songId];
  //changing the cover
  cover.src = "media/" + covers[songId] + ".jpg";
  //return timeline to the start
  progress.style.width = 0;
  thumb.style.left = 0;

  //wait for the audio load
  audio.addEventListener("loadeddata", () => {
    //show new duration of song
    setTime(fullTime, audio.duration);
    //setting max value to the slider
    slider.setAttribute("max", audio.duration);

    handleImage();
  });
}

//initial load of the track
loadSong();

//previous button
btnPrev.addEventListener("click", () => {
  songId--;
  if (songId < 0) {
    songId = songs.length - 1;
  }

  loadSong();
  switchSong();
});

btnNext.addEventListener("click", nextSong);

function nextSong() {
  songId++;
  if (songId > songs.length - 1) {
    songId = 0;
  }

  loadSong();
  switchSong();
}

//When audio ends
audio.addEventListener("ended", function () {
  nextSong();
  handleImage();
});

//Music start/end
function setTime(output, input) {
  const minutes = Math.floor(input / 60);
  const seconds = Math.floor(input % 60);

  if (seconds < 10) {
    output.innerHTML = minutes + ":0" + seconds;
  } else {
    output.innerHTML = minutes + ":" + seconds;
  }
}

setTime(fullTime, audio.duration);

audio.addEventListener("timeupdate", () => {
  const currentAudioTime = Math.floor(audio.currentTime);
  const timePercentage = (currentAudioTime / audio.duration) * 100 + "%";

  setTime(time, currentAudioTime);

  progress.style.width = timePercentage;
  thumb.style.left = timePercentage;
});

//Configuring the slider for manual control

function customSlider() {
  const val = (slider.value / audio.duration) * 100 + "%";

  progress.style.width = val;
  thumb.style.left = val;

  setTime(time, slider.value);
  audio.currentTime = slider.value;
}

customSlider();

slider.addEventListener("input", customSlider);

//Audio volume slider control

let val;

function customVolumeSlider() {
  const maxVal = volumeSlider.getAttribute("max");
  val = (volumeSlider.value / maxVal) * 100 + "%";
  volumeProgress.style.width = val;
  audio.volume = volumeSlider.value / 100;

  //Changing icons
  if (audio.volume > 0.5) {
    volumeIcon.innerHTML = `
    <span class="material-symbols-outlined">
    volume_up
    </span>
    `;
  } else if (audio.volume === 0) {
    volumeIcon.innerHTML = `
    <span class="material-symbols-outlined">
    volume_off
    </span>
    `;
  } else {
    volumeIcon.innerHTML = `
    <span class="material-symbols-outlined">
    volume_down
    </span>
    `;
  }
}

customVolumeSlider();
volumeSlider.addEventListener("input", customVolumeSlider);

//one click mute button
volumeIcon.addEventListener("click", () => {
  if (volumeMuted === false) {
    volumeIcon.innerHTML = `
    <span class="material-symbols-outlined">
    volume_off
    </span>
    `;

    audio.volume = 0;
    volumeProgress.style.width = 0;
    volumeMuted = true;
  } else {
    volumeIcon.innerHTML = `
    <span class="material-symbols-outlined">
    volume_down
    </span>
    `;

    audio.volume = 0.5;
    volumeProgress.style.width = val;
    volumeMuted = false;
  }
});
