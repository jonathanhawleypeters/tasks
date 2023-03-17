import { writable } from "svelte/store";

const messageStore = writable<string[]>([]);

export const messages = {
  subscribe: messageStore.subscribe,

  addLine: (line: unknown) => {
    messageStore.update(lines => [...lines, String(line)]);
  }
}

let dataChannel: RTCDataChannel | undefined;

let peerConnection: RTCPeerConnection | undefined;

// @ts-expect-error whatever
export function createPeerConnection(lasticecandidate) {
  let peerConnection
  const configuration = {
    iceServers: [
      { urls: "stun:stunserver.stunprotocol.org" }
    ]
  };

  try {
    peerConnection = new RTCPeerConnection(configuration);
  } catch(err) {
    messages.addLine('error: ' + err);
    return;
  }

  peerConnection.onicecandidate = handleicecandidate(lasticecandidate);
  peerConnection.onconnectionstatechange = handleconnectionstatechange;
  peerConnection.oniceconnectionstatechange = handleiceconnectionstatechange;
  return peerConnection;
}

function handleicecandidate(lasticecandidate: () => void) {
  // @ts-expect-error whatever
  return function(event) {
    if (event.candidate != null) {
      console.log('new ice candidate');
    } else {
      console.log('all ice candidates');
      lasticecandidate();
    }
  }
}

// @ts-expect-error whatever
function handleconnectionstatechange(event) {
  console.log('handleconnectionstatechange');
  console.log(event);
}

// @ts-expect-error whatever
function handleiceconnectionstatechange(event) {
  console.log('ice connection state: ' + event.target.iceConnectionState);
}

export function datachannelopen() {
  messages.addLine('connected');
}

// @ts-expect-error whatever
export function datachannelmessage(message) {
  messages.addLine(message.data);
}

export function sendMessage(text: string) {
  dataChannel?.send(text);
  messages.addLine(text);
}

// offer

export async function createOffer() {
  peerConnection = createPeerConnection(lasticecandidate);

  if (!peerConnection) return;

  dataChannel = peerConnection.createDataChannel('chat');

  dataChannel.onopen = datachannelopen;
  dataChannel.onmessage = datachannelmessage;

  let offer;
  try {
    offer = await peerConnection.createOffer();
  } catch (error) {
    messages.addLine(`create offer failed: ${String(error)}`)
    return;
  }
  
  await peerConnection.setLocalDescription(offer)
    .then(() => messages.addLine('set local done'))
    .catch(reason => messages.addLine(`let local failed: ${reason}`));

  return JSON.stringify(peerConnection.localDescription);
}

// this is called at a dead end
// the offer needs to be turned into a QR code
function lasticecandidate() {
  console.log('lasticecandidate');

  // this is the same for the call and the response
  const offer = peerConnection?.localDescription;

  return JSON.stringify(offer);
}

export function handleAnswer(answer: RTCSessionDescriptionInit) {
  // handle answer
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

// Answer

export async function handleOffer(offerText: string) {
  peerConnection = createPeerConnection(lasticecandidate);

  if (!peerConnection) return;

  peerConnection.ondatachannel = handledatachannel;

  const offer = JSON.parse(offerText);
  const answer = await peerConnection.setRemoteDescription(offer)
    .then(setRemoteOfferDone, setRemoteFailed);

  return JSON.stringify(answer);
}

const setRemoteOfferDone = () => {
  messages.addLine('set remote done')
  return peerConnection?.createAnswer()
   ?.then(createAnswerDone, createAnswerFailed);
}

function createAnswerDone(answer: RTCSessionDescriptionInit) {
  messages.addLine('create answer done')
  peerConnection?.setLocalDescription(answer)
    ?.then(
      () => messages.addLine('set local done'),
      (reason: unknown) => messages.addLine(`set local failed ${String(reason)}`),
    );
  return answer;
}

function createAnswerFailed(reason: unknown) {
  console.log('createAnswerFailed');
  console.log(reason);
}

// @ts-expect-error whatever
function handledatachannel(event) {
  console.log('handledatachannel');
  const dataChannel = event.channel;
  dataChannel.onopen = datachannelopen;
  dataChannel.onmessage = datachannelmessage;
}



