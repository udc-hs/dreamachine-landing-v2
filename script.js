// Get video element references
const topVideo = document.getElementById("topVideo");
const bottomVideo = document.getElementById("bottomVideo");

// Define the reveal and feather radii (in pixels)
let revealRadius = 50;   // Fully revealed hard edge
let featherRadius = 300; // Soft, feathered edge

// Function to synchronize and start both videos together
function syncVideos() {
  // Reset to start
  topVideo.currentTime = 0;
  bottomVideo.currentTime = 0;

  // Attempt to play both videos simultaneously
  Promise.all([topVideo.play(), bottomVideo.play()])
    .then(() => {
      console.log("Both videos started in sync");
    })
    .catch(error => {
      console.error("Error playing videos:", error);
    });
}

// Restart both videos in sync when one ends
function restartVideos() {
  topVideo.currentTime = 0;
  bottomVideo.currentTime = 0;
  syncVideos();
}

// Match playback speeds to prevent drift over time
function matchPlaybackRates() {
  bottomVideo.playbackRate = topVideo.playbackRate;
}

// Start videos when metadata is loaded
topVideo.addEventListener("loadedmetadata", syncVideos);
bottomVideo.addEventListener("loadedmetadata", syncVideos);

// Continuously sync playback rates
topVideo.addEventListener("ratechange", matchPlaybackRates);
bottomVideo.addEventListener("ratechange", matchPlaybackRates);

// Restart videos together when either ends
topVideo.addEventListener("ended", restartVideos);
bottomVideo.addEventListener("ended", restartVideos);

// Update the reveal effect based on mouse movement
document.addEventListener("mousemove", (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // Create a radial gradient mask with a hard center and feathered edge
  const maskStyle = `radial-gradient(circle ${revealRadius + featherRadius}px at ${mouseX}px ${mouseY}px, 
                      rgba(0,0,0,1) ${revealRadius}px, 
                      rgba(0,0,0,0) ${revealRadius + featherRadius}px)`;

  // Apply the mask style to the top video
  topVideo.style.maskImage = maskStyle;
  topVideo.style.webkitMaskImage = maskStyle;
});
