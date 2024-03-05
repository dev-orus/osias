/*
   ____  _____  _    _  _____              _____ _____ 
  / __ \|  __ \| |  | |/ ____|       /\   |  __ \_   _|
 | |  | | |__) | |  | | (___ ______ /  \  | |__) || |  
 | |  | |  _  /| |  | |\___ \______/ /\ \ |  ___/ | |  
 | |__| | | \ \| |__| |____) |    / ____ \| |    _| |_ 
  \____/|_|  \_\\____/|_____/    /_/    \_\_|   |_____|

---------
-BY ORUS-
---------
ORUS-API @ 2024 Owned by ORUS
----------------------------------------------------------------

ORUS-API is the api by orus for orus services with chat and forums, etc

*/

import WebSocket from 'ws';

export default class Api {
  ws: WebSocket;
  user: any;
  constructor() {
    this.ws = new WebSocket('ws://localhost:3000');
  }
  login(user: string, password: string) {
    this.user = {
      type: 'login',
      username: user,
      psw: password,
    };

    this.ws.on('open', () => {
      this.ws.send(JSON.stringify(this.user));
    });
  }
  sendMsg(msg: string, to: string) {
    this.ws.send(
      JSON.stringify({
        type: 'send-msg',
        from: this.user.username,
        psw: this.user.psw,
        to: to,
        msg: msg,
      })
    );
  }
  recv(): Promise<string> {
    return new Promise((r) => {
      this.ws.once('message', (d) => {
        r(d.toString());
      });
    });
  }
}
