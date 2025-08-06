import { describe, expect, test, jest } from '@jest/globals';

describe('matchPlaybackRates', () => {
  test('updates bottom video without recursive events', () => {
    const topVideo = document.createElement('video');
    const bottomVideo = document.createElement('video');

    const matchPlaybackRates = jest.fn(() => {
      bottomVideo.playbackRate = topVideo.playbackRate;
    });

    topVideo.addEventListener('ratechange', matchPlaybackRates);

    topVideo.playbackRate = 1.5;

    // simulate browser firing ratechange on bottom video
    bottomVideo.dispatchEvent(new Event('ratechange'));

    expect(bottomVideo.playbackRate).toBe(1.5);
    expect(matchPlaybackRates).toHaveBeenCalledTimes(1);
  });
});
