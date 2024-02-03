/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// PlaybackURL

import "./style.css";
import placehodler from "./assets/placeholder.png";

window.counter = -1;

const streams = [];

streams.push("https://cakal.click/yayin1.m3u8");
streams.push("https://cakal.click/yayinzirve.m3u8");
streams.push("https://cakal.click/yayinb2.m3u8");
streams.push("https://cakal.click/yayinb3.m3u8");
streams.push("https://cakal.click/yayinb4.m3u8");
streams.push("https://cakal.click/yayinb5.m3u8");
streams.push("https://cakal.click/yayinbm1.m3u8");
streams.push("https://cakal.click/yayinbm2.m3u8");

// App
const videoPlayer = document.getElementById("video-player");
const playerOverlay = document.getElementById("overlay");
const btnPlay = document.getElementById("play");
const btnChange = document.getElementById("change");

// Btn icons
let setBtnPaused = function () {
  btnPlay.classList.remove("btn--play");
  btnPlay.classList.add("btn--pause");
};

let setBtnPlay = function () {
  btnPlay.classList.add("btn--play");
  btnPlay.classList.remove("btn--pause");
};

const PlayerState = IVSPlayer.PlayerState;
const PlayerEventType = IVSPlayer.PlayerEventType;

// Initialize player
const player = IVSPlayer.create();
player.attachHTMLVideoElement(videoPlayer);

// Attach event listeners
player.addEventListener(PlayerState.PLAYING, function () {
  console.log("Player State - PLAYING");
});
player.addEventListener(PlayerState.ENDED, function () {
  console.log("Player State - ENDED");
});
player.addEventListener(PlayerState.READY, function () {
  console.log("Player State - READY");
});
player.addEventListener(PlayerEventType.ERROR, function (err) {
  console.warn("Player Event - ERROR:", err);
});

player.addEventListener(PlayerEventType.TEXT_METADATA_CUE, function (cue) {
  const metadataText = cue.text;
  const position = player.getPosition().toFixed(2);
  console.log(
    `Player Event - TEXT_METADATA_CUE: "${metadataText}". Observed ${position}s after playback started.`
  );
});

// player.addEventListener(PlayerEventType.AUDIO_BLOCKED, function () {
//   setBtnMute();
// });

// Show/Hide player controls
playerOverlay.addEventListener(
  "mouseover",
  function (e) {
    playerOverlay.classList.add("player--hover");
  },
  false
);

playerOverlay.addEventListener("mouseout", function (e) {
  playerOverlay.classList.remove("player--hover");
});

playerOverlay.addEventListener("dblclick", function () {
  if (videoPlayer.requestFullscreen) {
    videoPlayer.requestFullscreen();
  } else if (videoPlayer.mozRequestFullScreen) {
    videoPlayer.mozRequestFullScreen();
  } else if (videoPlayer.webkitRequestFullscreen) {
    videoPlayer.webkitRequestFullscreen();
  } else if (videoPlayer.msRequestFullscreen) {
    videoPlayer.msRequestFullscreen();
  }
});

btnPlay.addEventListener(
  "click",
  function (e) {
    if (btnPlay.classList.contains("btn--play")) {
      setBtnPaused();
      player.pause();
    } else {
      setBtnPlay();
      player.play();
    }
  },
  false
);

btnChange.addEventListener(
  "click",
  (e) => {
    window.counter++;
    if (window.counter >= streams.length) {
      window.counter = -1;
      stopStream();
    } else playStream(streams[window.counter]);
  },
  false
);

function playStream(stream) {
  player.setAutoplay(true);
  player.load(stream);
  player.setVolume(1);
}

function stopStream() {
  player.load("");
  videoPlayer.setAttribute("poster", placehodler);
}

window.onload = function () {
  videoPlayer.setAttribute("poster", placehodler);
};
