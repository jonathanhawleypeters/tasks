import P2PCF from 'p2pcf';

let p2pcf;

export const start = (clientId: string, roomId: string) => {
  p2pcf = new P2PCF(clientId, roomId, {});

  p2pcf.start();

  p2pcf.on('msg', (peer, data) => {
    console.log('message recieved', peer.id, peer.client_id, new TextDecoder("utf-8").decode(data));
  });

  p2pcf.on('peerclose', (peer) => {
    console.log('connection closed', peer.id, peer.client_id);
  })

  p2pcf.on('peerconnect', peer => {
    console.log('peer connected', peer.id, peer.client_id);

    // @ts-expect-error typscript is wrong
    p2pcf.send(peer, new TextEncoder().encode("hello"));
  })
};

