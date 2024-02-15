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

import { Osias } from './osiasApi.js';

const osias = new Osias();

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

process.exit();
