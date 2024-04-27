// import { WebSocket } from 'ws';

// export class WebSocketClient {
//  private ws: WebSocket;

// constructor(url: string) {
//     this.ws = new WebSocket(url);

//     this.ws.on('open', () => {
//       console.log('Connected to server');
//       this.ws.send('Hello, server!');
//     });

//     this.ws.on('message', (message: string) => {
//       console.log(`Received message from server: ${message}`);
//     });

//     this.ws.on('close', () => {
//       console.log('Disconnected from server');
//     });
// }

//  sendMessage(message: string) {
//     this.ws.send(message);
//  }
// }

// 클라이언트 생성 및 메시지 전송
// const client = new WebSocketClient('ws://localhost:8765');
// client.sendMessage('Hello, server!');