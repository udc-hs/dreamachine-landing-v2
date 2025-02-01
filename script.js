document.addEventListener("DOMContentLoaded", function () {
    const topVideo = document.getElementById("topVideo");
    const bottomVideo = document.getElementById("bottomVideo");
  
    // Autoplay both videos.
    Promise.all([topVideo.play(), bottomVideo.play()]).catch(function (error) {
      console.error("Error starting videos:", error);
    });
  
    // Sync the videos to prevent drift.
    function syncVideos() {
      const threshold = 0.1; // seconds
      const diff = topVideo.currentTime - bottomVideo.currentTime;
      if (Math.abs(diff) > threshold) {
        bottomVideo.currentTime = topVideo.currentTime;
      }
      requestAnimationFrame(syncVideos);
    }
    requestAnimationFrame(syncVideos);
  
    // Update CSS variables based on mouse position.
    document.addEventListener("mousemove", function (e) {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--mouse-x", `${x}%`);
      document.documentElement.style.setProperty("--mouse-y", `${y}%`);
    });
  });
  