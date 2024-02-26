/*
   ____   _____ _____           _____ 
  / __ \ / ____|_   _|   /\    / ____|
 | |  | | (___   | |    /  \  | (___  
 | |  | |\___ \  | |   / /\ \  \___ \ 
 | |__| |____) |_| |_ / ____ \ ____) |
  \____/|_____/|_____/_/    \_\_____/ 
                                      

---------
-BY ORUS-
---------
Osias @ 2024 Owned by ORUS
----------------------------------------------------------------

Osias is a TUI application that makes the TUI more fun. with chat and forums

*/

import { Entity, Game, sleep } from './gameEngine.js';
import { Osias, ReadLine } from './osiasLib.js';

const rl = new ReadLine();
const osias = new Osias();
osias.api.login('<username>', '<password>');
const game = new Game();
const player1 = new Entity(game, {
  main: '\x1b[31m█████\n\x1b[31m█████\n\x1b[31m█████',
});

osias.menuItems.Game = {
  handler: 'GameEngine',
  call: async () => {
    game.run(60, '');
    player1.velocity.sety(-5);
    player1.velocity.setx(5);
    await sleep(1000);
    player1.velocity.sety(5);
    player1.velocity.setx(-5);
    await sleep(1000);
    game.stop();
  },
};

osias.menuItems.Messages = {
  handler: 'osias',
  call: async () => {
    while (true) {
      let friends = ['alex', 'sean', 'leo'];
      let [idx, key] = await osias.menu(friends);
      if (key.name === 'return') {
        osias.usingChat = true;
        osias.chat = friends[idx];
        console.clear();
        while (true) {
          rl.clean();
          let [msgToSend, key] = await rl.input();
          process.stdin.write('\b\x1b[P'.repeat(rl.result.length));
          rl.clean();
          if (key.name === 'escape') break;
          if (msgToSend) {
            osias.api.sendMsg(msgToSend.toString(), friends[idx]);
          }
        }
        osias.usingChat = false;
      } else if (key.name === 'escape') {
        break;
      }
    }
  },
};

osias.ws.on('message', (d) => {
  let data = JSON.parse(d.toString());
  if (data.type === 'msg') {
    if (osias.usingChat && osias.chat === data.from) {
      process.stdin.write('\b\x1b[P'.repeat(rl.result.length));
      console.log(data.msg);
      process.stdout.write(rl.result);
      process.stdin.write(`\x1b[${rl.result.length - 1 - rl.index}D`);
    } else {
      osias.sendNotification(data.msg, data.from);
    }
  }
});

while (true) {
  let items = Object.keys(osias.menuItems);
  let [index, key] = await osias.menu(items);
  let item = osias.menuItems[items[index]];
  if (key.name === 'return') {
    await item.call();
  } else if (key.name === 'escape') {
    osias.ws.close();
    process.exit();
  }
}
