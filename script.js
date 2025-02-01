document.addEventListener("DOMContentLoaded", () => {
    const topVideo = document.getElementById("topVideo");
    const bottomVideo = document.getElementById("bottomVideo");
  
    let videosLoaded = 0;
  
    function checkVideosReady() {
      videosLoaded++;
      if (videosLoaded === 2) {
        syncVideos();
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
  
    topVideo.addEventListener("ended", restartVideos);
    bottomVideo.addEventListener("ended", restartVideos);
  
    // Mouse movement reveal effect (DOES NOT affect playback)
    document.addEventListener("mousemove", (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;
  
      // Adjust radial gradient so the center is fully revealed with only feathered edges
      const maskStyle = `radial-gradient(circle 400px at ${mouseX}px ${mouseY}px, 
                          rgba(0,0,0,1) 100px, 
                          rgba(0,0,0,0) 400px)`;
      
      topVideo.style.maskImage = maskStyle;
      topVideo.style.webkitMaskImage = maskStyle;
    });
  });
  