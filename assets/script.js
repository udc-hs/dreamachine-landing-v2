document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("backgroundVideo");

  let maxTime = 0;
  let scrollSpeedFactor = 50;
  let lastScrollY = window.scrollY;
  let playingNormally = true;
  let scrollVelocity = 0;
  let reverseMode = false;
  let userInteracted = false;
  let lastFrameTime = performance.now();
  let lastRestartAttempt = 0; // Prevent spamming restart function

  function startVideoPlayback() {
    if (!userInteracted) return;

    video.muted = true;
    video.loop = true;

    if (video.paused || video.readyState < 3) {
      video.play().catch(error => console.error("Autoplay blocked:", error));
    }
  }

  function forceRestartIfFrozen() {
    const now = performance.now();
    
    // Ensure we're not checking too frequently (every 5 seconds max)
    if (now - lastRestartAttempt < 5000) return;
    lastRestartAttempt = now;

    // If playbackRate is 0 or the video is paused, restart it
    if (video.playbackRate === 0 || video.paused || video.readyState < 3) {
      console.warn("Video appears frozen. Restarting playback...");
      video.currentTime += 0.01; // Small shift to force refresh
      video.play().catch(error => console.error("Autoplay blocked:", error));
    }
  }

  // Run freeze check every 5 seconds (prevents flooding console)
  setInterval(forceRestartIfFrozen, 5000);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      startVideoPlayback();
    }
  });

  video.addEventListener("loadedmetadata", () => {
    maxTime = video.duration;
    startVideoPlayback(); // Ensure playback starts after metadata loads
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
    let deltaTime = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    if (!userInteracted) return;

    scrollVelocity *= 0.95; // Apply gradual slowdown

    let speedMultiplier = Math.max(0.1, Math.min(4, 1 + Math.abs(scrollVelocity)));

    if (scrollVelocity < 0) {
      reverseMode = true;
      video.playbackRate = 1; // Keep playbackRate normal
      video.currentTime -= Math.abs(scrollVelocity) * deltaTime * 1.5;
    } else {
      reverseMode = false;
      video.playbackRate = speedMultiplier;
    }

    // Prevent excessive force restarts
    forceRestartIfFrozen();
  }

  requestAnimationFrame(smoothUpdate);

  document.addEventListener("scroll", () => {
    if (!userInteracted) return;

    const scrollDelta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;

    if (scrollDelta === 0) return;

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
