import { createPeerConnection, datachannelmessage, datachannelopen } from "./common";

let peerConnection: RTCPeerConnection | undefined;

export function clickcreateoffer() {
  console.log('clickcreateoffer');
  // @ts-expect-error exists
  document.getElementById('buttoncreateoffer').disabled = true;
  document.getElementById('spanoffer')?.classList.toggle('invisible');
  peerConnection = createPeerConnection(lasticecandidate);

  if (!peerConnection) return;

  // @ts-expect-error whatever
  window.dataChannel = peerConnection.createDataChannel('chat');

  // @ts-expect-error whatever
  window.dataChannel.onopen = datachannelopen;

  // @ts-expect-error whatever
  window.dataChannel.onmessage = datachannelmessage;

  const createOfferPromise = peerConnection.createOffer();
  createOfferPromise.then(createOfferDone(peerConnection), createOfferFailed);
}

const createOfferDone = (peerConnection: RTCPeerConnection) => (offer: RTCSessionDescriptionInit) => {
  console.log('createOfferDone');
  const setLocalPromise = peerConnection.setLocalDescription(offer);
  setLocalPromise.then(setLocalDone, setLocalFailed);
}

function createOfferFailed(reason: unknown) {
  console.log('createOfferFailed');
  console.log(reason);
}

function setLocalDone() {
  console.log('setLocalDone');
}

function setLocalFailed(reason: unknown) {
  console.log('setLocalFailed');
  console.log(reason);
}

function lasticecandidate() {
  console.log('lasticecandidate');
  const textelement = document.getElementById('textoffer');
  if (!textelement) return;
  const offer = peerConnection?.localDescription;

  // @ts-expect-error whatever
  textelement.value = JSON.stringify(offer);
  // @ts-expect-error whatever
  document.getElementById('buttonoffersent').disabled = false;
}

export function clickoffersent() {
  console.log('clickoffersent');
  document.getElementById('spananswer')?.classList.toggle('invisible');
  // @ts-expect-error whatever
  document.getElementById('buttonoffersent').disabled = true;
}

export function clickanswerpasted() {
  console.log('clickanswerpasted');
  // @ts-expect-error whatever
  document.getElementById('buttonanswerpasted').disabled = true;
  const textelement = document.getElementById('textanswer');

  if (!textelement) return;

  // @ts-expect-error whatever
  textelement.readOnly = true;
  // @ts-expect-error whatever
  const answer = JSON.parse(textelement.value);
  const setRemotePromise = peerConnection?.setRemoteDescription(answer);
  setRemotePromise?.then(setRemoteDone, setRemoteFailed);
}

function setRemoteDone() {
  console.log('setRemoteDone');
}

function setRemoteFailed(reason: unknown) {
  console.log('setRemoteFailed');
  console.log(reason);
}

