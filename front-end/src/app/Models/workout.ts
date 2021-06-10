export class Workout {
  private _title:String;
  private _description:String;
  private _difficulty:String;

  constructor(title: String, description: String, difficulty: String) {
    this._title = title;
    this._description = description;
    this._difficulty = difficulty;
  }

  get title(): String {
    return this._title;
  }

  set title(value: String) {
    this._title = value;
  }

  get description(): String {
    return this._description;
  }

  set description(value: String) {
    this._description = value;
  }

  get difficulty(): String {
    return this._difficulty;
  }

  set difficulty(value: String) {
    this._difficulty = value;
  }
}
