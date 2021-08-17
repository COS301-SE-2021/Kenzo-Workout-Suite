import {KenzoTag} from "./kenzo-tag";
import {Exercise} from "./exercise";

export class Workout {
  private _title:string;
  private _description:string;
  private _exercises:Exercise[];

  constructor(title: string, description: string, exercises: Exercise[]) {
    this._title = title;
    this._description = description;
    this._exercises = exercises;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get exercises(): Exercise[] {
    return this._exercises;
  }

  set exercises(value: Exercise[]) {
    this._exercises = value;
  }
}
