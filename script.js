document.addEventListener("DOMContentLoaded", () => {
    const topVideo = document.getElementById("topVideo");
    const bottomVideo = document.getElementById("bottomVideo");
    const startButton = document.getElementById("startButton");
  
    let videosLoaded = 0;
  
    function checkVideosReady() {
      videosLoaded++;
      if (videosLoaded === 2) {
        console.log("Videos preloaded.");
      }
    }
  
    topVideo.addEventListener("loadeddata", checkVideosReady);
    bottomVideo.addEventListener("loadeddata", checkVideosReady);
  
    function syncVideos() {
      topVideo.currentTime = 0;
      bottomVideo.currentTime = 0;
  
      Promise.all([topVideo.play(), bottomVideo.play()])
        .then(() => {
          console.log("Both videos started in sync");
        })
        .catch(error => {
          console.error("Error playing videos:", error);
        });
    }
  
    // Restart videos together
    function restartVideos() {
      topVideo.currentTime = 0;
      bottomVideo.currentTime = 0;
      syncVideos();
    }
  
    // Ensure videos stay in sync when ended
    topVideo.addEventListener("ended", restartVideos);
    bottomVideo.addEventListener("ended", restartVideos);
  
    // Start on user interaction
    startButton.addEventListener("click", () => {
      startButton.classList.add("hidden"); // Hide button
      syncVideos();
    });
  });
  