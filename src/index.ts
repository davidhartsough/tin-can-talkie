import { getEl } from "./dom";
import { endMic, initMic, setTalking } from "./mic";
import { initOsc } from "./oscillator";
import { disconnect, initPeer } from "./peer";

const joinBtn = getEl("join") as HTMLButtonElement;
const dropBtn = getEl("drop") as HTMLButtonElement;
const talkBtn = getEl("talk") as HTMLButtonElement;
const roomEl = getEl("room") as HTMLDivElement;
const bannerEl = getEl("connecting") as HTMLParagraphElement;

async function join() {
  joinBtn.disabled = true;
  joinBtn.hidden = true;
  bannerEl.hidden = false;
  try {
    await initOsc();
    const micStream = await initMic();
    await initPeer(micStream);
    roomEl.hidden = false;
  } catch (err) {
    console.error(err);
    await leave();
    const message = err instanceof Error ? err.message : String(err);
    alert(`Couldn't join: ${message}`);
  } finally {
    bannerEl.hidden = true;
    joinBtn.disabled = false;
  }
}
async function leave(reload = false) {
  forceStopTalking();
  roomEl.hidden = true;
  joinBtn.hidden = false;
  joinBtn.disabled = false;
  endMic();
  try {
    await disconnect();
  } catch (err) {
    console.error(err);
  } finally {
    if (reload) window.location.reload();
  }
}

joinBtn.addEventListener("click", async () => {
  await join();
});
dropBtn.addEventListener("click", async () => {
  await leave(true);
});
let pointerId: number | null = null;
talkBtn.addEventListener("pointerdown", (e) => {
  if (!e.isPrimary) return;
  if (e.pointerType === "mouse" && e.button !== 0) return;
  e.preventDefault();
  pointerId = e.pointerId;
  talkBtn.setPointerCapture(e.pointerId);
  setTalking(true);
});
function releaseTalkPointer(event: PointerEvent) {
  if (event.pointerId !== pointerId) return;
  pointerId = null;
  setTalking(false);
}
talkBtn.addEventListener("pointerup", releaseTalkPointer);
talkBtn.addEventListener("pointercancel", releaseTalkPointer);
talkBtn.addEventListener("lostpointercapture", releaseTalkPointer);
talkBtn.addEventListener("contextmenu", (e) => e.preventDefault());
const talkKeys = new Set(["Enter", " "]);
talkBtn.addEventListener("keydown", (e) => {
  if (!talkKeys.has(e.key)) return;
  e.preventDefault();
  if (!e.repeat) setTalking(true);
});
talkBtn.addEventListener("keyup", (e) => {
  if (!talkKeys.has(e.key)) return;
  e.preventDefault();
  setTalking(false);
});
talkBtn.addEventListener("blur", () => {
  setTalking(false);
});
function forceStopTalking() {
  pointerId = null;
  setTalking(false);
}
window.addEventListener("blur", forceStopTalking);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) forceStopTalking();
});
window.addEventListener("beforeunload", async () => {
  await leave();
});
