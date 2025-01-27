document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("backgroundVideo");

  let maxTime = 0;
  let scrollSpeedFactor = 50; // Higher = smoother acceleration/deceleration
  let lastScrollY = window.scrollY;
  let playingNormally = true; // Tracks if the video is playing at normal speed
  let scrollVelocity = 0; // Stores smoothed scroll speed

  video.addEventListener("loadedmetadata", () => {
    maxTime = video.duration;
    video.play(); // Ensure the video starts playing normally
  });

  document.addEventListener("scroll", () => {
    const scrollDelta = window.scrollY - lastScrollY; // Change in scroll position
    lastScrollY = window.scrollY;

    if (scrollDelta === 0) {
      return; // No scrolling, do nothing
    }

    // Smooth the scroll speed transition to prevent lag
    scrollVelocity += (scrollDelta - scrollVelocity) / scrollSpeedFactor;

    // Allow reverse playback (negative values)
    let newSpeed = 1 + scrollVelocity;
    video.playbackRate = Math.max(-2, Math.min(newSpeed, 4)); // Limit between -2x (reverse) and 4x (fast)

    playingNormally = false;

    // Reset to normal playback after scrolling stops
    clearTimeout(video.resetSpeedTimeout);
    video.resetSpeedTimeout = setTimeout(() => {
      video.playbackRate = 1;
      playingNormally = true;
    }, 1500); // Delay before returning to normal speed
  });

  // Seamless looping: when reaching the end or beginning, reset smoothly
  video.addEventListener("timeupdate", () => {
    if (video.currentTime >= maxTime - 0.1) {
      video.currentTime = 0;
      if (playingNormally) {
        video.play();
      }
    }
    if (video.currentTime <= 0.1 && video.playbackRate < 0) {
      video.currentTime = maxTime;
    }
  });
});
