document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("backgroundVideo");

  let maxTime = 0;
  let scrollSpeedFactor = 50; // Higher = smoother acceleration/deceleration
  let lastScrollY = window.scrollY;
  let playingNormally = true; // Tracks if the video is playing at normal speed
  let scrollVelocity = 0; // Stores smoothed scroll speed
  let reverseMode = false; // Tracks if video is reversing
  let userInteracted = false; // Detects if the user has interacted
  let lastFrameTime = performance.now(); // Tracks time between frames

  function startVideoPlayback() {
    if (!userInteracted) return;

    video.muted = true;
    video.loop = true;

    if (video.paused) {
      video.play().catch(error => console.error("Autoplay blocked:", error));
    }
  }

  // Prevent browser from pausing video due to power-saving
  setInterval(() => {
    if (video.paused) {
      console.log("Restarting video playback to prevent browser pause.");
      video.play().catch(error => console.error("Autoplay blocked:", error));
    }
  }, 5000);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      startVideoPlayback();
    }
  });

  video.addEventListener("loadedmetadata", () => {
    maxTime = video.duration;
  });

  function handleUserInteraction() {
    userInteracted = true;
    startVideoPlayback();
  }
  
  document.addEventListener("click", handleUserInteraction);
  document.addEventListener("scroll", handleUserInteraction);
  document.addEventListener("touchstart", handleUserInteraction);

  function smoothUpdate() {
    requestAnimationFrame(smoothUpdate);

    let now = performance.now();
    let deltaTime = (now - lastFrameTime) / 1000; // Convert to seconds
    lastFrameTime = now;

    if (!userInteracted) return;

    // Apply gradual slowdown instead of instant change
    scrollVelocity *= 0.95; // Dampening factor to prevent sudden spikes

    // Prevent extreme values
    let speedMultiplier = Math.max(-2, Math.min(4, 1 + scrollVelocity));

    // Update playback rate smoothly
    video.playbackRate = speedMultiplier;

    // If scrolling fast, gradually change the time instead of instant jumps
    if (Math.abs(scrollVelocity) > 0.1) {
      video.currentTime += scrollVelocity * deltaTime * 2; // Adjust time gradually
    }
  }

  requestAnimationFrame(smoothUpdate);

  document.addEventListener("scroll", () => {
    if (!userInteracted) return;

    const scrollDelta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;

    if (scrollDelta === 0) return;

    // Smooth out the velocity
    scrollVelocity += (scrollDelta - scrollVelocity) / scrollSpeedFactor;

    playingNormally = false;

    clearTimeout(video.resetSpeedTimeout);
    video.resetSpeedTimeout = setTimeout(() => {
      if (!reverseMode) {
        video.playbackRate = 1;
        playingNormally = true;
      }
    }, 1500);
  });

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
