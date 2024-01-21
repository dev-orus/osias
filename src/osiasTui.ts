import keypress from 'keypress';
import { stdin as input, stdout } from 'node:process';
import getCursorPos from 'get-cursor-position';
import { KeyObject } from 'node:crypto';
var keybinds = { tabs: {  }, menu: { 'up': 'up', 'down': 'down' } };
var theme = { menu: { 'selected': '[{*}]', 'normal': ' {*}' } }

function printToXY(x, y, text) {
    process.stdout.write(`\x1b[${y};${x}H${text}`);
}

keypress(process.stdin);

function insertCharAtIndex(str, index, char) {
    if (index > str.length) {
        // If the index is beyond the length of the string, append the character at the end
        return str + char;
    } else {
        // Insert the character at the specified index
        return str.slice(0, index) + char + str.slice(index);
    }
}

function readKey(): Promise<any> {
    return new Promise(resolve => {
        function returnOut(_, key) {
            resolve(key);
        }

        input.once('keypress', returnOut);
    });
}

async function menu(items:Array<string>, index:number=0, binds=keybinds) {
    let minIndex = getCursorPos.sync().row;
    var listen = true;
    for (var i=0; i<items.length; i++) {
        if (i===index) {
           console.log(theme['menu']['selected'].replace('{*}', items[i]));
        } else {
            console.log(theme['menu']['normal'].replace('{*}', items[i]));
        }
    }

    while (true) {
        let key = await readKey();
        let lastRow = theme['menu']['normal'].replace('{*}', items[index]);
        let lastRow0 = theme['menu']['selected'].replace('{*}', items[index]);
        if (binds.menu[key.name]==='down') {
            printToXY(0, minIndex+index, ' '.repeat(lastRow0.length));
            printToXY(0, minIndex+index, lastRow);
            if (index+1<items.length) {
                index++;
            } else {
                index = 0;
            }
            printToXY(0, minIndex+index, theme['menu']['selected'].replace('{*}', items[index]));
        } else if (binds.menu[key.name]==='up') {
            printToXY(0, minIndex+index, ' '.repeat(lastRow0.length));
            printToXY(0, minIndex+index, lastRow);
            if (index>0) {
                index--;
            } else {
                index = items.length-1;
            }
            printToXY(0, minIndex+index, theme['menu']['selected'].replace('{*}', items[index]));
        } else {
            printToXY(0, minIndex+items.length, '');
            return [index, key];
        }
    }
}

function removeEscape(str: string) {
    return str.replace(/\x1B\[[0-9;]*[A-Za-z]/g, '');//.replace(/\x1B\[[A-D]/g, '').replace(/[\x00-\x1F\x7F]/g, '');
}

process.stdin.setRawMode(true);
process.stdin.resume();

export { menu, readKey, removeEscape }