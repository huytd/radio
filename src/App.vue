<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue';
import { OVERLAYS, BACKGROUNDS } from './lib';

const randomOverlay = OVERLAYS.random();
const randomBg = BACKGROUNDS.random();
const backgroundImage = (url) => `background-image: url(${url})`;

const audioRef = ref(null);
const state = reactive({ playing: false, currentSong: '[Waiting...]' });
const socket = new WebSocket("wss://radio.0x97a.com/now-playing");

socket.addEventListener("open", (event) => {
  console.log("Connected to server");
});

socket.addEventListener("close", (event) => {
  console.log("Connection closed", event.code, event.reason);
});

socket.addEventListener("error", (event) => {
  console.log("Connection error", event);
});

socket.addEventListener("message", (event) => {

  if (event.data.length <= 1) {
    return
  }

  try {
    const payload = JSON.parse(event.data);
    state.currentSong = payload.title;
    document.title = "Radio Station | " + payload.title;
    setMediaTitle(payload.title);
  } catch {
    console.log('ERROR parsing data');
  }
});

const playButtonHandler = () => {
  audioRef.value?.play();
  state.playing = true;
}


const setMediaTitle = (title) => {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: "Radio Station",
      album: "#music",
      artwork: [
        {
          src: "https://raw.githubusercontent.com/duythinht/shout/master/static/radio-on-air.png",
          sizes: "96x96",
          type: "image/png",
        },
        {
          src: "https://raw.githubusercontent.com/duythinht/shout/master/static/radio-on-air.png",
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: "https://raw.githubusercontent.com/duythinht/shout/master/static/radio-on-air.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "https://raw.githubusercontent.com/duythinht/shout/master/static/radio-on-air.png",
          sizes: "256x256",
          type: "image/png",
        },
        {
          src: "https://raw.githubusercontent.com/duythinht/shout/master/static/radio-on-air.png",
          sizes: "384x384",
          type: "image/png",
        },
        {
          src: "https://raw.githubusercontent.com/duythinht/shout/master/static/radio-on-air.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    });
  }
};


onBeforeUnmount(() => {
  console.log("Close connection");
  socket.close();
});
</script>

<template>
  <div class="container" @click="playButtonHandler">
    <div class="background" :style="backgroundImage(randomBg)" />
    <div class="overlay" :style="backgroundImage(randomOverlay)" />
    <div v-if="state.playing" class="song-name">{{ state.currentSong }}</div>
    <div v-if="!state.playing" class="song-name">[Click on the screen to play]</div>
    <audio ref="audioRef" preload="auto">
      <source src="https://radio.0x97a.com/stream.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
  </div>
</template>
