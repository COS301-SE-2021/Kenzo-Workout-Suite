export class Workout {
  private _title:String;
  private _description:String;
  private _plannerID:String;

  constructor(title: String, description: String, planner_ID: String) {
    this._title = title;
    this._description = description;
    this._plannerID = planner_ID;
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

  get planner_ID(): String {
    return this._plannerID;
  }

  set planner_ID(value: String) {
    this.planner_ID = value;
  }
}
