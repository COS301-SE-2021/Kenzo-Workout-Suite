import {KenzoTag} from "./kenzo-tag";

export class Workout {
  private _title:string;
  private _description:string;
  private _tags:KenzoTag[];

  constructor(title: string, description: string, tags: KenzoTag[]) {
    this._title = title;
    this._description = description;
    this._tags = tags;
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

  get tags(): KenzoTag[] {
    return this._tags;
  }

  set tags(value: KenzoTag[]) {
    this._tags = value;
  }
}
