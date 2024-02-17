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

import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
};

interface Key {
  sequence?: string | undefined;
  name?: string | undefined;
  ctrl?: boolean | undefined;
  meta?: boolean | undefined;
  shift?: boolean | undefined;
}

function readKey(): Promise<Key> {
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

type MenuItem = {
  items?: { [key: string]: MenuItem };
  call: Function;
  handler: string;
};

export class Osias {
  // Theme
  theme = {
    menu: {
      selected: '\x1b[32m❯ {*}',
      title: '[{*}]',
      normal: '\x1b[31m{*}',
    },
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
  constructor() {}
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
