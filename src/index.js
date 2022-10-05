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

const stream1 =
  "https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8";

const stream2 =
  "https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.xhP3ExfcX8ON.m3u8";

const stream3 =
  "https://4c62a87c1810.us-west-2.playback.live-video.net/api/video/v1/us-west-2.049054135175.channel.y3mVQ6xJIgTu.m3u8";

const stream4 = "https://tv-trt1.medya.trt.com.tr/master_720.m3u8";

const stream5 = "https://tv-trt2.medya.trt.com.tr/master_720.m3u8";

const stream6 = "https://tv-trthaber.medya.trt.com.tr/master_720.m3u8";

const stream7 =
  "http://10.0.0.33/api/files/live/620f6e8a6d725c98e6b96722?accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inlhc2luIiwiaWF0IjoxNjQ2MDQwNTY3LCJleHAiOjE2NDYxMjY5NjcsInNlY3JldCI6ImVlZDU4ZWM3NzU4MWVmYmMiLCJwbGF0Zm9ybSI6MH0.HGyrkCtwEI0HDAHY0qP-ISuAISLXnXhdyM6XpI9Goyc";

const streams = [stream1, stream2, stream3, stream4, stream5, stream6, stream7];

// App
const videoPlayer = document.getElementById("video-player");
const playerOverlay = document.getElementById("overlay");
const playerControls = document.getElementById("player-controls");
const btnPlay = document.getElementById("play");
const btnMute = document.getElementById("mute");
const btnSettings = document.getElementById("settings");
const settingsMenu = document.getElementById("settings-menu");

// Btn icons
let setBtnPaused = function () {
  btnPlay.classList.remove("btn--play");
  btnPlay.classList.add("btn--pause");
};

let setBtnPlay = function () {
  btnPlay.classList.add("btn--play");
  btnPlay.classList.remove("btn--pause");
};

let setBtnMute = function () {
  btnMute.classList.remove("btn--mute");
  btnMute.classList.add("btn--unmute");
};

let setBtnUnmute = function () {
  btnMute.classList.add("btn--mute");
  btnMute.classList.remove("btn--unmute");
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

// Controls events
// Play/Pause
btnPlay.addEventListener(
  "click",
  function (e) {
    if (btnPlay.classList.contains("btn--play")) {
      // change to pause
      setBtnPaused();
      player.pause();
    } else {
      // change to play
      setBtnPlay();
      player.play();
    }
  },
  false
);

window.counter = -1;

// Mute/Unmute
btnMute.addEventListener(
  "click",
  (e) => {
    window.counter++;
    if (window.counter >= streams.length) window.counter = 0;
    console.log(window.counter);
    playStream(streams[window.counter]);
  },
  false
);

// Create Quality Options
let createQualityOptions = function (obj, i) {
  let q = document.createElement("a");
  let qText = document.createTextNode(obj.name);
  settingsMenu.appendChild(q);
  q.classList.add("settings-menu-item");
  q.appendChild(qText);

  q.addEventListener("click", (event) => {
    player.setQuality(obj);
    closeSettingsMenu();
    return false;
  });
};

// Close Settings menu
let closeSettingsMenu = function () {
  btnSettings.classList.remove("btn--settings-on");
  btnSettings.classList.add("btn--settings-off");
  settingsMenu.classList.remove("open");
};

// Settings
btnSettings.addEventListener(
  "click",
  function (e) {
    let qualities = player.getQualities();
    let currentQuality = player.getQuality();

    // Empty Settings menu
    while (settingsMenu.firstChild)
      settingsMenu.removeChild(settingsMenu.firstChild);

    if (btnSettings.classList.contains("btn--settings-off")) {
      for (var i = 0; i < qualities.length; i++) {
        createQualityOptions(qualities[i], i);
      }
      btnSettings.classList.remove("btn--settings-off");
      btnSettings.classList.add("btn--settings-on");
      settingsMenu.classList.add("open");
    } else {
      closeSettingsMenu();
    }
  },
  false
);

// Close Settings menu if user clicks outside the player
window.addEventListener("click", function (e) {
  if (playerOverlay.contains(e.target)) {
  } else {
    closeSettingsMenu();
  }
});

function playStream(stream) {
  // Setup stream and play
  player.setAutoplay(true);
  player.load(stream);

  // Setvolume
  player.setVolume(1);
}

function getBandwidthUsage() {
  const bitrate = player.getAverageBitrate();
  return (bitrate / (1024 * 1024)).toFixed(2) + " Mbps";
}

window.onload = function () {
  videoPlayer.setAttribute("poster", placehodler);
};
