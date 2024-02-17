import { setIntervalAsync } from 'set-interval-async';

export type Velocity = {
  x: number;
  y: number;
};

// export function replaceFromIndex(
//   inputString: string,
//   index: number,
//   replaceString: string
// ): string {
//   let result = '';
//   for (let i = 0; i < inputString.length; i++) {
//     if (
//       i >= index &&
//       i - index < replaceString.length &&
//       replaceString[i - index] !== ' '
//     ) {
//       result += replaceString[i - index];
//     } else {
//       result += inputString[i];
//     }
//   }
//   return result;
// }

export function replaceFromIndex(
  inputString: string,
  index: number,
  replaceString: string
): string {
  // If the inputString is all spaces and replaceString is not, then append replaceString
  if (inputString.trim() === '' && replaceString.trim() !== '') {
    return inputString.substring(0, index) + replaceString;
  }

  // If the inputString is not all spaces, replace characters after the index as before
  let result = '';
  for (let i = 0; i < inputString.length; i++) {
    if (
      i >= index &&
      i - index < replaceString.length &&
      replaceString[i - index] !== ' '
    ) {
      result += replaceString[i - index];
    } else {
      result += inputString[i];
    }
  }

  return result;
}

export class Game {
  entities: Array<Entity> = [];
  run(framerate = 60, bg = '\x1b[42m') {
    return setInterval(() => {
      let colFill = ' '.repeat(process.stdout.columns);
      let frame = Array(process.stdout.rows - 1).fill(colFill);
      this.entities.forEach((entity) => {
        entity.displayObject[entity.currentObject]
          .split('\n')
          .forEach((x, i) => {
            if (frame[i + entity.y]) {
              frame[i + entity.y] = replaceFromIndex(
                frame[i + entity.y],
                entity.x,
                x + bg
              );
            }
          });
      });
      frame = frame.map((i) => {
        return bg + i;
      });
      console.clear();
      console.log(frame.join('\n'));
    }, 1000 / framerate);
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function sizeify(arr: Array<string>): Array<number> {
  return arr.map((i) => {
    return i.length;
  });
}

export class Entity {
  x: number = 0;
  y: number = 0;
  velocity: Velocity = {
    x: 0,
    y: 0,
  };
  displayObject: { [key: string]: string } = {};
  currentObject: string = 'main';
  constructor(game: Game, displayObject: { [key: string]: string }) {
    this.displayObject = displayObject;
    game.entities.push(this);
  }

  render() {
    let maxRows =
      process.stdout.rows -
      this.displayObject[this.currentObject].split('\n').length;
    let maxCols = process.stdout.columns;

    // velocity handler for (X)
    setIntervalAsync(async () => {
      if (this.velocity.x > 0 && this.x < maxCols) {
        let timeDelay = 40 / this.velocity.x;
        await sleep(timeDelay);
        this.x++;
      } else if (this.velocity.x < 0 && this.x > 0) {
        let timeDelay = 40 / Math.abs(this.velocity.x);
        await sleep(timeDelay);
        this.x--;
      }
    }, 1);

    // velocity handler for (Y)
    setIntervalAsync(async () => {
      if (this.velocity.y < 0 && this.y < maxRows) {
        let timeDelay = 40 / Math.abs(this.velocity.y);
        await sleep(timeDelay);
        this.y++;
      } else if (this.velocity.y > 0 && this.y > 0) {
        let timeDelay = 40 / Math.abs(this.velocity.y);
        await sleep(timeDelay);
        this.y--;
      }
    }, 1);
  }
}
