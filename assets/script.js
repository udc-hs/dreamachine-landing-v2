document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("backgroundVideo");

  let maxTime = 0;
  let scrollSpeedFactor = 5; // Adjust this value to control how much scrolling affects speed
  let lastScrollY = window.scrollY;
  let playingNormally = true; // Tracks if the video is playing at normal speed

  video.addEventListener("loadedmetadata", () => {
    maxTime = video.duration;
    video.play(); // Ensure the video starts playing normally
  });

  document.addEventListener("scroll", () => {
    const scrollDelta = window.scrollY - lastScrollY; // Difference in scroll position
    lastScrollY = window.scrollY;

    if (scrollDelta === 0) {
      video.playbackRate = 1; // If no scrolling, normal speed
      return;
    }

    // Adjust video speed based on scroll speed (scrolling faster increases playback speed)
    let newSpeed = 1 + (scrollDelta / scrollSpeedFactor);
    video.playbackRate = Math.max(0.1, newSpeed); // Prevent extreme values (min 0.1x speed)

    playingNormally = false; // Set to false to indicate user is controlling speed

    // Reset normal play mode after a delay when scrolling stops
    clearTimeout(video.resetSpeedTimeout);
    video.resetSpeedTimeout = setTimeout(() => {
      video.playbackRate = 1;
      playingNormally = true;
    }, 1000); // Delay in ms before returning to normal playback
  });

  // Seamless looping: when reaching the end, restart smoothly
  video.addEventListener("timeupdate", () => {
    if (video.currentTime >= maxTime - 0.1) {
      video.currentTime = 0;
      if (playingNormally) {
        video.play();
      }
    }
  });
});
