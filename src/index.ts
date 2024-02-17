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
import { Osias } from './osiasApi.js';

const osias = new Osias();

const game = new Game();

const player1 = new Entity(game, { main: '\x1b[31m█████\n\x1b[31m█████\n\x1b[31m█████' });

player1.render();

osias.menuItems.Game = {
  handler: 'GameEngine',
  call: async () => {
    let run = game.run(60, '');
    player1.velocity.x = 1;
    await sleep(1000);
    player1.velocity.x = -1;
    await sleep(1000);
    clearInterval(run);
  },
};

while (true) {
  let items = Object.keys(osias.menuItems);
  let [index, key] = await osias.menu(items);
  let item = osias.menuItems[items[index]];
  if (key.name === 'return') {
    await item.call();
  } else if (key.name === 'escape') {
    process.exit();
  }
}
