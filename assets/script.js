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
  let lastLogTime = 0; // Prevent excessive logging

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
    if (video.paused || video.readyState < 3) {
      console.warn("Video appears frozen. Restarting playback...");
      video.currentTime += 0.01; 
      video.play().catch(error => console.error("Autoplay blocked:", error));
    }
  }

  setInterval(forceRestartIfFrozen, 5000);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      startVideoPlayback();
    }
  });

  video.addEventListener("loadedmetadata", () => {
    maxTime = video.duration;
    startVideoPlayback();
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

    scrollVelocity *= 0.95; 

    let speedMultiplier = Math.max(0.1, Math.min(4, 1 + Math.abs(scrollVelocity)));

    if (scrollVelocity < 0) {
      reverseMode = true;
      video.playbackRate = 1;
      video.currentTime -= Math.abs(scrollVelocity) * deltaTime * 1.5;
    } else {
      reverseMode = false;
      video.playbackRate = speedMultiplier;
    }

    const logInterval = 500; // Log only every 500ms
    if (now - lastLogTime > logInterval) {
      lastLogTime = now;
      console.log("Animation running, scroll velocity:", scrollVelocity);
    }
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
