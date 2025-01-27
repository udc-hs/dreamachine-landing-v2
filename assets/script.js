document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("backgroundVideo");

  let maxTime = 0;
  let scrollSpeedFactor = 50; // Higher = smoother acceleration/deceleration
  let lastScrollY = window.scrollY;
  let playingNormally = true; // Tracks if the video is playing at normal speed
  let scrollVelocity = 0; // Stores smoothed scroll speed
  let reverseMode = false; // Tracks if video is reversing
  let userInteracted = false; // Detects if the user has interacted

  function startVideoPlayback() {
    if (!userInteracted) return; // Ensure playback only starts after interaction

    video.muted = true; // Ensure muted for autoplay
    if (video.paused) {
      video.play().catch(error => console.error("Autoplay blocked:", error));
    }
  }

  video.addEventListener("loadedmetadata", () => {
    maxTime = video.duration;
  });

  // Start video after user interacts (click, scroll, touch)
  function handleUserInteraction() {
    userInteracted = true;
    startVideoPlayback();
  }
  
  document.addEventListener("click", handleUserInteraction);
  document.addEventListener("scroll", handleUserInteraction);
  document.addEventListener("touchstart", handleUserInteraction);

  document.addEventListener("scroll", () => {
    if (!userInteracted) return;

    const scrollDelta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;

    if (scrollDelta === 0) {
      return; // No scrolling, do nothing
    }

    // Smooth scroll effect
    scrollVelocity += (scrollDelta - scrollVelocity) / scrollSpeedFactor;

    // If scrolling UP, slow down first before reversing
    if (scrollVelocity < -0.5) {
      reverseMode = true;
      video.playbackRate = 1; // Reset rate to normal before reversing

      // Create a smooth reverse effect
      let reverseInterval = setInterval(() => {
        if (video.currentTime > 0.1) {
          video.currentTime -= 0.05;
        } else {
          video.currentTime = maxTime - 0.1; // Loop back to end if at start
        }
      }, 30);

      // Stop reverse when scrolling stops
      setTimeout(() => {
        clearInterval(reverseInterval);
        reverseMode = false;
        startVideoPlayback(); // Resume normal playback
      }, 1500);
    } else {
      // Forward playback with smooth speed adjustments
      video.playbackRate = Math.max(0.5, Math.min(4, 1 + scrollVelocity));
      reverseMode = false;
    }

    playingNormally = false;

    // Reset to normal playback after scrolling stops
    clearTimeout(video.resetSpeedTimeout);
    video.resetSpeedTimeout = setTimeout(() => {
      if (!reverseMode) {
        video.playbackRate = 1;
        playingNormally = true;
      }
    }, 1500);
  });

  // Seamless looping: when reaching the end or beginning, reset smoothly
  video.addEventListener("timeupdate", () => {
    if (video.currentTime >= maxTime - 0.1) {
      video.currentTime = 0;
      if (playingNormally) {
        startVideoPlayback();
      }
    }
    if (video.currentTime <= 0.1 && reverseMode) {
      video.currentTime = maxTime - 0.1;
    }
  });
});
