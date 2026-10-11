export const getEl = (id: string) => document.getElementById(id);

const peersEl = getEl("peers") as HTMLDivElement;

export function addPeerDiv(id: string) {
  const peerEl = document.createElement("div");
  peerEl.id = id;
  peerEl.hidden = true;
  peersEl.append(peerEl);
}

export function removePeerDiv(id: string) {
  const peerEl = getEl(id);
  if (peerEl) peerEl.remove();
}

export function addAudioEl(stream: MediaStream, peerId: string) {
  const audioEl = document.createElement("audio");
  audioEl.srcObject = stream;
  audioEl.autoplay = true;
  audioEl.id = stream.id;
  audioEl.dataset.peer = peerId;
  getEl(peerId)?.append(audioEl);
}
