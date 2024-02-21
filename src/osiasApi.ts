/*
   ____   _____ _____           _____              _____ _____ 
  / __ \ / ____|_   _|   /\    / ____|       /\   |  __ \_   _|
 | |  | | (___   | |    /  \  | (___ ______ /  \  | |__) || |  
 | |  | |\___ \  | |   / /\ \  \___ \______/ /\ \ |  ___/ | |  
 | |__| |____) |_| |_ / ____ \ ____) |    / ____ \| |    _| |_ 
  \____/|_____/|_____/_/    \_\_____/    /_/    \_\_|   |_____|
                                                               
---------
-BY ORUS-
---------
Osias @ 2024 Owned by ORUS
----------------------------------------------------------------

Osias api is the TUI library for Osias and many more!

*/

import WebSocket from 'ws';
import { sleep } from './gameEngine.js';
import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async';

process.stdin.setEncoding('utf-8');

if (process.stdin.isTTY) {
  process.stdin.setRawMode!(true);
}

export function insertNewlines(text: string, x: number): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += text[i];
    if ((i + 1) % (x + 1) === 0) {
      result += '\n';
    }
  }
  return result;
}

function countNewlines(text: string): number {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\n') {
      count++;
    }
  }
  return count;
}

const SEQUENCE_TABLE: { [key: string]: string } = {
  '\x1b': 'escape',
  '\x1b[A': 'up',
  '\x1b[B': 'down',
  '\x1b[C': 'right',
  '\x1b[D': 'left',
  '\n': 'return',
  '\r': 'return',
  '\t': 'tab',
  '\x7F': 'backspace',
  ' ': 'space',
};

function removeByIndex(str: string, index: number) {
  return str.substring(0, index) + str.substring(index + 1);
}

function addByIndex(str: string, toAdd: string, index: number) {
  return str.substring(0, index) + toAdd + str.substring(index + 1);
}

function insertStringAt(
  original: string,
  index: number,
  toInsert: string
): string {
  return original.slice(0, index) + toInsert + original.slice(index);
}
export function formatStringDensity(
  str: string,
  index: number,
  charToFormat: string = '...'
): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    if (i == index) {
      result += charToFormat;
      break;
    } else {
      result += str[i];
    }
  }
  return result;
}

interface Key {
  sequence: string;
  name?: string | undefined;
  ctrl?: boolean | undefined;
  meta?: boolean | undefined;
  shift?: boolean | undefined;
}

export function readKey(): Promise<Key> {
  return new Promise((resolve) => {
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', (chunk) => {
      resolve({
        name: SEQUENCE_TABLE[chunk.toString()],
        sequence: chunk.toString(),
      });
    });
  });
}

export class ReadLine {
  result = '';
  index = 0;
  constructor() {}
  clean() {
    this.result = '';
    this.index = 0;
  }
  async input(): Promise<[string, Key]> {
    this.result = '';
    this.index = 0;
    while (true) {
      let key = await readKey();
      if (key.name === 'space') {
        this.index++;
        process.stdin.write(key.sequence);
        this.result += key.sequence;
      } else if (key.name === 'left') {
        if (this.index > 1) {
          this.index--;
          process.stdin.write(key.sequence);
        }
      } else if (key.name === 'right') {
        if (this.index < this.result.length) {
          this.index++;
          process.stdin.write(key.sequence);
        }
      } else if (key.name === 'backspace') {
        if (this.index > 0) {
          process.stdin.write('\b\x1b[P');
          this.result = removeByIndex(this.result, this.index - 1);
          this.index--;
        }
      } else if (key.name === 'up' || key.name === 'down') {
      } else if (key.name) {
        console.log('');
        return [this.result, key];
      } else {
        this.result = insertStringAt(this.result, this.index, key.sequence);
        this.index++;
        process.stdin.write(`\x1b[${this.index}D`);
        process.stdin.write(this.result);
        process.stdin.write(`\x1b[${this.result.length - 1 - this.index}D`);
      }
    }
  }
}

type MenuItem = {
  items?: { [key: string]: MenuItem };
  call: Function;
  handler: string;
};

export class Osias {
  // Logic (bool)
  usingChat = false;
  chat = '';
  notificationQueue = false;
  // Theme
  theme = {
    menu: {
      selected: '\x1b[32m❯ {*}',
      title: '[{*}]',
      normal: '\x1b[31m{*}',
    },
    notification: { title: '({0}) - {1}', contents: '{*}' },
    // notification: {
    // top: '┌------------------------┐',
    // bottom: '└------------------------┘',
    // side: '|',
    // title: '',
    // },
  };
  // The menu items (Any plugin or mod should add items here by indexing)
  menuItems: { [key: string]: MenuItem } = {
    // Servers menu
    Servers: {
      items: {},
      handler: 'root',
      call: () => {
        console.log('Feature Comming soon!');
      },
    },
    // Themes and configs Menu
    'Customizations & Options': {
      items: {},
      handler: 'root',
      call: async () => {
        await this.menu(['Themes', 'Config', 'Keybindings']);
      },
    },
  };
  api = {
    sendMsg: (msg: string, to: string) => {
      this.ws.send(
        JSON.stringify({
          type: 'send-msg',
          from: this.user.username,
          psw: this.user.psw,
          to: to,
          msg: msg,
        })
      );
    },
    recv: (): Promise<string> => {
      return new Promise((r) => {
        this.ws.once('message', (d) => {
          r(d.toString());
        });
      });
    },
  };
  user: any;
  ws: WebSocket;
  constructor(user: string, password: string) {
    this.ws = new WebSocket('ws://localhost:3000');

    this.user = {
      type: 'login',
      username: user,
      psw: password,
    };

    this.ws.on('open', () => {
      this.ws.send(JSON.stringify(this.user));
    });
  }
  // moveCursor function (For placing the cursor at specific x and y)
  moveCursor(x: number, y: number) {
    process.stdout.write(`\x1b[${y};${x}H`);
  }
  async sendNotification(msg: string, from: string) {
    let formattedMsg = this.theme.notification.title.replace(
      '{0}',
      formatStringDensity(from, 24)
    );

    formattedMsg = formattedMsg.replace(
      '{1}',
      insertNewlines(formatStringDensity(msg, 100), 25)
        .split('\n')
        .map((i) => {
          return this.theme.notification.contents.replace('{*}', i);
        })
        .join('\n')
    );
    let inv = setIntervalAsync(async () => {
      if (!this.notificationQueue) {
        formattedMsg.split('\n').forEach((i, b) => {
          this.moveCursor(process.stdout.columns - i.length, b);
          console.log('\x1b[0m' + i);
        });

        // let l = this.theme.notification.top.length;
        // let l2 = l - this.theme.notification.side.length * 2;
        // this.notificationQueue = true;
        // if (from) {
        //   this.moveCursor(
        //     process.stdout.columns - (this.theme.notification.top.length - 2),
        //     0
        //   );
        //   console.log('\x1b[0m' + this.theme.notification.title + from);
        // }
        // this.moveCursor(process.stdout.columns - 25, from ? 2 : 0);
        // console.log('\x1b[0m' + this.theme.notification.top);
        // formattedMsg.forEach((i, y) => {
        //   this.moveCursor(process.stdout.columns - 25, 3 + y);
        //   console.log(
        //     this.theme.notification.side +
        //       '\x1b[0m' +
        //       i +
        //       ' '.repeat(l2 - i.length) +
        //       this.theme.notification.side
        //   );
        // });
        // this.moveCursor(process.stdout.columns - 25, 8);
        // console.log('\x1b[0m' + this.theme.notification.bottom);
        // console.log('└' + this.theme.notification.bottom.repeat(24) + '┘');
        await sleep(3000);
        this.notificationQueue = false;
        clearIntervalAsync(inv);
      }
    }, 10);
  }
  // Menu function (for menu selection with arrow keys)
  async menu(
    items: Array<string>,
    index: number = 0,
    title: string = ''
  ): Promise<[number, Key]> {
    // create constant cursorSpaces for defining the left part of the theme menu selected item
    const cursorSpaces = ' '.repeat(
      this.theme.menu.selected
        .replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, '')
        .split('{*}')[0].length
    );
    // create minIndex (for the minimum index for titles) & lastIndex (for storing the last index to remove it)
    let minIndex = 1;
    let lastIndex = index;
    console.clear();
    // if there is a title passed as an argument
    if (title) {
      minIndex =
        1 +
        countNewlines(
          insertNewlines(
            this.theme.menu.title.replace('{*}', title),
            process.stdout.columns
          )
        );
      // print the title
      console.log('\x1b[0m' + this.theme.menu.title.replace('{*}', title));
    }

    // Pre-render
    for (let i = 0; i < items.length; i++) {
      if (i == index) {
        // if the items is the index selected
        console.log(
          '\x1b[0m' + this.theme.menu.selected.replace('{*}', items[i])
        );
      } else {
        // if the items is normal and not selected
        console.log(
          cursorSpaces +
            '\x1b[0m' +
            this.theme.menu.normal.replace('{*}', items[i])
        );
      }
    }

    // The render function for rendering the items (This is not for pre-rendering that is above)
    const render = () => {
      // remove the last selected line
      process.stdout.write(
        `\x1b[${minIndex + lastIndex};0H` +
          '\x1b[0m' +
          ' '.repeat(
            this.theme.menu.selected.replace('{*}', items[lastIndex]).length
          ) +
          '\x1b[0m'
      );
      // make the last selected line normal
      process.stdout.write(
        `\x1b[${minIndex + lastIndex};0H` +
          cursorSpaces +
          '\x1b[0m' +
          this.theme.menu.normal.replace('{*}', items[lastIndex])
      );
      // remove the new selected line
      process.stdout.write(
        `\x1b[${minIndex + index};0H` +
          '\x1b[0m' +
          ' '.repeat((cursorSpaces + items[index]).length)
      );
      // make the new selected line with the selected state
      process.stdout.write(
        `\x1b[${minIndex + index};0H` +
          '\x1b[0m' +
          this.theme.menu.selected.replace('{*}', items[index]) +
          '\x1b[0m'
      );
      // make the lastIndex set to the current index
      lastIndex = index;
    };
    // The menu logic
    while (true) {
      // get the key
      let key = await readKey();
      // arrow keys
      if (key.name == 'up') {
        if (index > 0) index--;
        else index = items.length - 1;
        render();
      } else if (key.name == 'down') {
        if (index < items.length - 1) index++;
        else index = 0;
        render();
      } else {
        // if the keys is anything else (return, escape, eg)
        process.stdout.write(`\x1b[${minIndex + items.length};0H\x1b[0m\n`);
        return [index, key];
      }
    }
  }
}
