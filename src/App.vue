<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue';
import { OVERLAYS, BACKGROUNDS } from './lib';

const randomOverlay = OVERLAYS.random();
const randomBg = BACKGROUNDS.random();
const backgroundImage = (url) => `background-image: url(${url})`;

const audioRef = ref(null);
const state = reactive({ playing: false, currentSong: '[Waiting...]' });
const socket = new WebSocket("wss://radio.0x97a.com/now-playing");
let aliveTimer = null;

socket.addEventListener("open", (event) => {
  console.log("Connected to server");
  aliveTimer = setInterval(() => {
    // Ping the server every 30s to keep the connection 
    socket.send("ping");
  }, 30 * 1000);
});

socket.addEventListener("close", (event) => {
  console.log("Connection closed", event.code, event.reason);
  clearInterval(aliveTimer);
});

socket.addEventListener("error", (event) => {
  console.log("Connection error", event);
  clearInterval(aliveTimer);
});

socket.addEventListener("message", (event) => {
  try {
    const payload = JSON.parse(event.data);
    state.currentSong = payload.title;
    document.title = "Radio Station | " + payload.title;
  } catch {
    console.log('ERROR parsing data');
  }
});

const playButtonHandler = () => {
  audioRef.value?.play();
  state.playing = true;
}

onBeforeUnmount(() => {
  console.log("Close connection");
  socket.close();
  clearInterval(aliveTimer);
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
