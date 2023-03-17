import { createPeerConnection, datachannelmessage, datachannelopen } from "./common";


let peerConnection: RTCPeerConnection | undefined;

export function clickofferpasted() {
  console.log('clickremoteoffer');
  // @ts-expect-error whatever
  document.getElementById('buttonofferpasted').disabled = true;
  peerConnection = createPeerConnection(lasticecandidate);

  if (!peerConnection) return;

  peerConnection.ondatachannel = handledatachannel;
  const textelement = document.getElementById('textoffer');

  // @ts-expect-error whatever
  textelement.readOnly = true;

  // @ts-expect-error whatever
  const offer = JSON.parse(textelement.value);
  const setRemotePromise = peerConnection.setRemoteDescription(offer);
  setRemotePromise.then(setRemoteDone(peerConnection), setRemoteFailed);
}

const setRemoteDone = (peerConnection: RTCPeerConnection) => () => {
  console.log('setRemoteDone');
  const createAnswerPromise = peerConnection.createAnswer();
  createAnswerPromise.then(createAnswerDone, createAnswerFailed);
}

function setRemoteFailed(reason: unknown) {
  console.log('setRemoteFailed');
  console.log(reason);
}

function createAnswerDone(answer: RTCSessionDescriptionInit) {
  if (!peerConnection) return;
  console.log('createAnswerDone');
  const setLocalPromise = peerConnection.setLocalDescription(answer);
  setLocalPromise.then(setLocalDone, setLocalFailed);
  document.getElementById('spananswer')?.classList.toggle('invisible');
}

function createAnswerFailed(reason: unknown) {
  console.log('createAnswerFailed');
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
  if (!peerConnection) return;
  console.log('lasticecandidate');
  const textelement = document.getElementById('textanswer');

  const answer = peerConnection.localDescription
  // @ts-expect-error whatever
  textelement.value = JSON.stringify(answer);
}

// @ts-expect-error whatever
function handledatachannel(event) {
  console.log('handledatachannel');
  const dataChannel = event.channel;
  dataChannel.onopen = datachannelopen;
  dataChannel.onmessage = datachannelmessage;
}
