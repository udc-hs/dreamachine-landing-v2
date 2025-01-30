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
  let lastVideoTime = 0;
  let lastLogTime = 0;

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
    
    if (now - lastLogTime < 3000) return;

    if (Math.abs(video.currentTime - lastVideoTime) < 0.02) {
      console.warn("Video appears frozen. Restarting playback...");
      video.currentTime += 0.01;
      video.play().catch(error => console.error("Autoplay blocked:", error));
    }

    lastVideoTime = video.currentTime;
    lastLogTime = now;
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

    scrollVelocity *= 0.92;

    let speedMultiplier = 1 + Math.min(3, Math.abs(scrollVelocity) * 2);

    if (scrollVelocity < 0) {
      reverseMode = true;
      video.playbackRate = 1;
      video.currentTime -= Math.abs(scrollVelocity) * deltaTime * 1.5;
    } else {
      reverseMode = false;
      video.playbackRate = speedMultiplier;
    }

    if (now - lastLogTime > 2000) {
      console.log("Scroll velocity:", scrollVelocity, "Playback speed:", video.playbackRate);
      lastLogTime = now;
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
