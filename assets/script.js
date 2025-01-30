document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("backgroundVideo");
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  let userInteracted = false;
  let lastFrameTime = performance.now();
  let maxTime = 0;
  
  function startVideoPlayback() {
      if (!userInteracted) return;
      video.muted = true;
      video.loop = true;
      if (video.paused || video.readyState < 3) {
          video.play().catch(error => console.error("Autoplay blocked:", error));
      }
  }

  function forceRestartIfFrozen() {
      if (Math.abs(video.currentTime - lastFrameTime) < 0.02) {
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
      scrollVelocity *= 0.92;
      let speedMultiplier = 1 + Math.min(3, Math.abs(scrollVelocity) * 2);
      if (scrollVelocity < 0) {
          video.currentTime -= Math.abs(scrollVelocity) * deltaTime * 1.5;
      } else {
          video.playbackRate = speedMultiplier;
      }
  }

  requestAnimationFrame(smoothUpdate);

  document.addEventListener("scroll", () => {
      if (!userInteracted) return;
      const scrollDelta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (scrollDelta === 0) return;
      scrollVelocity += (scrollDelta - scrollVelocity) / 50;
  });

  video.addEventListener("timeupdate", () => {
      if (video.currentTime >= maxTime - 0.1) {
          video.currentTime = 0;
      }
  });
});
