import * as readline from "readline";

readline.emitKeypressEvents(process.stdin);
process.stdin.setEncoding("utf8");

if (process.stdin.isTTY) {
  process.stdin.setRawMode!(true);
}

export function readKey() {
  return new Promise((resolve) => {
    process.stdin.once("keypress", (char: string, key: readline.Key) => {
      resolve(key);
    });
  });
}