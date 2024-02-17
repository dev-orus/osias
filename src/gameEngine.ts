import { setIntervalAsync } from 'set-interval-async';

export type Velocity = {
  x: number;
  y: number;
  setx: Function;
  sety: Function;
};

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
  isRunning: boolean = false;
  interval: any;
  run(framerate = 60, bg = '\x1b[42m') {
    this.isRunning = true;
    this.interval = setInterval(() => {
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
  stop() {
    if (this.isRunning) {
      clearInterval(this.interval);
    }
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
  // x and y positions
  x: number = 0;
  y: number = 0;
  velocity: Velocity = {
    // velocity x and velocity y (Do not change these values programaticaly. use setx or sety instead)
    x: 0,
    y: 0,
    // setx (The function for setting the velocity of x)
    setx: async (v: number) => {
      this.velocity.x = v;
      // if the velocity is positive
      if (v > 0) {
        let timeDelay = 100 / v;
        while (v === this.velocity.x) {
          this.x++;
          await sleep(timeDelay);
        }
        // if the velocity is negative
      } else if (v < 0) {
        let timeDelay = 100 / -v;
        while (v === this.velocity.x) {
          this.x--;
          await sleep(timeDelay);
        }
      }
    },
    // sety (The function for setting the velocity of y)
    sety: async (v: number) => {
      this.velocity.y = v;
      // if the velocity is positive
      if (v > 0) {
        let timeDelay = 100 / v;
        while (v === this.velocity.y) {
          this.y--;
          await sleep(timeDelay);
        }
        // if the velocity is negative
      } else if (v < 0) {
        let timeDelay = 100 / -v;
        while (v === this.velocity.y) {
          this.y++;
          await sleep(timeDelay);
        }
      }
    },
  };
  // displayObject is for animating and what the object looks like
  displayObject: { [key: string]: string } = {};
  // currentObject is for selecting the displayObject's type (default is main) and can change for animations
  currentObject: string = 'main';
  constructor(game: Game, displayObject: { [key: string]: string }) {
    this.displayObject = displayObject;
    game.entities.push(this);
  }
}
