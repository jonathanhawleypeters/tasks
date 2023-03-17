
function chatlog(msg: string) {
  const chatelement = document.getElementById('chatlog');
  const newchatentry = document.createElement("p");
  newchatentry.textContent = '[' + new Date() + '] ' + msg;

  if (!chatelement) return;
  chatelement.appendChild(newchatentry);  
  chatelement.scrollTop = chatelement.scrollHeight
}

// @ts-expect-error whatever
export function createPeerConnection(lasticecandidate) {
  let peerConnection
  const configuration = {
    iceServers: [{
      urls: "stun:stunserver.stunprotocol.org"}]};
  try {
    peerConnection = new RTCPeerConnection(configuration);
  } catch(err) {
    chatlog('error: ' + err);
  }
  if (!peerConnection) return;

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
  console.log('datachannelopen');
  chatlog('connected');

  // @ts-expect-error whatever
  document.getElementById('chatinput').disabled = false;

  // @ts-expect-error whatever
  document.getElementById('chatbutton').disabled = false;
}

// @ts-expect-error whatever
export function datachannelmessage(message) {
  console.log('datachannelmessage');
  console.log(message);
  const text = message.data;
  chatlog(text);
}

export function chatbuttonclick() {
  console.log('chatbuttonclick');
  const textelement = document.getElementById('chatinput');

  // @ts-expect-error whatever
  const text = textelement.value

  // @ts-expect-error whatever
  window.dataChannel.send(text);
  chatlog(text);

  // @ts-expect-error whatever
  textelement.value = '';
}
