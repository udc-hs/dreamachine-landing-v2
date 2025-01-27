document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("backgroundVideo");
    let maxTime = 0;
  
    video.addEventListener("loadedmetadata", () => {
      maxTime = video.duration;
    });
  
    document.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY; // Current scroll position
      const maxScroll = document.body.scrollHeight - window.innerHeight; // Max scrollable height
      const scrollFraction = scrollPosition / maxScroll; // Normalize scroll (0 to 1)
      
      // Calculate the exact frame for the video
      const targetTime = maxTime * scrollFraction;
  
      // Use fast seek for better performance
      if (!video.seeking) {
        video.currentTime = targetTime;
      }
    });
  });
  