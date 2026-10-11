let micStream: MediaStream | null = null;
let micTrack: MediaStreamTrack | null = null;
export function setTalking(isTalking = false) {
  if (micTrack) {
    micTrack.enabled = isTalking;
  }
}
export async function initMic(): Promise<MediaStream> {
  if (micStream && micTrack) return micStream;
  micStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    video: false,
  });
  const track = micStream.getAudioTracks()[0];
  if (track) {
    micTrack = track;
    micTrack.enabled = false;
  }
  return micStream;
}
export function getMicStream() {
  return micStream;
}
export function endMic() {
  if (micStream) {
    micStream.getTracks().forEach((t) => {
      t.stop();
    });
  }
  micStream = null;
  micTrack = null;
}
