// Get references to the video elements
const topVideo = document.getElementById("topVideo");
const bottomVideo = document.getElementById("bottomVideo");

// Define reveal parameters (in pixels)
const revealRadius = 50;    // Hard edge radius
const featherRadius = 300;  // Feather (soft edge) size

// Function to synchronize and start both videos
function syncVideos() {
  topVideo.currentTime = 0;
  bottomVideo.currentTime = 0;

  Promise.all([topVideo.play(), bottomVideo.play()])
    .then(() => {
      console.log("Both videos started in sync");
    })
    .catch((error) => {
      console.error("Error playing videos:", error);
    });
}

// Restart both videos in sync when either ends
function restartVideos() {
  topVideo.currentTime = 0;
  bottomVideo.currentTime = 0;
  syncVideos();
}

// Ensure playback rates match (to prevent drift)
function matchPlaybackRates() {
  bottomVideo.playbackRate = topVideo.playbackRate;
}

// Start videos when metadata is loaded
topVideo.addEventListener("loadedmetadata", syncVideos);
bottomVideo.addEventListener("loadedmetadata", syncVideos);

// Monitor rate changes
topVideo.addEventListener("ratechange", matchPlaybackRates);
bottomVideo.addEventListener("ratechange", matchPlaybackRates);

// Restart videos when either ends
topVideo.addEventListener("ended", restartVideos);
bottomVideo.addEventListener("ended", restartVideos);

// Update the reveal mask on mouse movement
document.addEventListener("mousemove", (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // Build a radial gradient mask with a hard center and feathered edge
  const maskStyle = `radial-gradient(circle ${revealRadius + featherRadius}px at ${mouseX}px ${mouseY}px,
                      rgba(0,0,0,1) ${revealRadius}px,
                      rgba(0,0,0,0) ${revealRadius + featherRadius}px)`;

  topVideo.style.maskImage = maskStyle;
  topVideo.style.webkitMaskImage = maskStyle;
});
