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

console.log(await osias.menu(['a', 'b', 'c']));

process.exit();
