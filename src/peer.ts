import { MeteredPeer } from "@metered-ca/realtime";
import { addAudioEl, addPeerDiv, getEl, removePeerDiv } from "./dom";
import { getMicStream } from "./mic";
import { playTone } from "./oscillator";

const bannerEl = getEl("reconnecting") as HTMLParagraphElement;

const mp = new MeteredPeer({
  apiKey: "pk_live_2c20266a70883be5d4866ed36ce029094a35b409",
});

let timeout: number | null = null;
let ready = true;
function debouncePlayTone(up = true) {
  if (!ready) return;
  playTone(up);
  ready = false;
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    ready = true;
  }, 500);
}

mp.on("error", console.error);
mp.on("data", console.log);
mp.on("peer-joined", ({ peer }) => {
  console.log("peer joined:", peer.id);
  if (!getEl(peer.id)) addPeerDiv(peer.id);
  peer.on("stream-added", ({ stream }) => {
    console.log("stream added:", stream.id);
    addAudioEl(stream, peer.id);
    debouncePlayTone();
  });
  peer.on("stream-removed", ({ stream }) => {
    console.log("stream removed:", stream.id);
    const audioEl = getEl(stream.id);
    if (audioEl) audioEl.remove();
    debouncePlayTone(false);
  });
  peer.on("state-change", ({ to }) => {
    console.log("peer state change:", peer.id, to);
    // if (to === "connected") debouncePlayTone();
    // if (to === "closed") debouncePlayTone(false);
  });
});
mp.on("peer-left", ({ peer }) => {
  console.log("peer left:", peer.id);
  removePeerDiv(peer.id);
  debouncePlayTone(false);
});
let bannerTimer: number | null = null;
mp.on("state-change", ({ to }) => {
  console.log("state change:", to);
  if (to === "reconnecting") {
    bannerTimer = setTimeout(() => {
      bannerEl.hidden = false;
    }, 1000);
  } else {
    if (bannerTimer) clearTimeout(bannerTimer);
    bannerEl.hidden = true;
  }
});

export async function initPeer(micStream: MediaStream) {
  mp.addStream(micStream);
  await mp.join("call");
  playTone();
}
export async function disconnect() {
  const micStream = getMicStream();
  if (micStream) mp.removeStream(micStream);
  await mp.close();
  playTone(false);
}
