export class Exercise {

  private _title:String;
  private _description:String;
  private _repRange:String;
  private _sets:Number;
  private _Posedescription:String;
  private _restPeriod:Number; //seconds
  private _difficulty:String;
  private _duratime:Number; //seconds


  constructor(title: String, description: String, repRange: String, sets: Number, Posedescription: String, restPeriod: Number, difficulty: String, duratime: Number) {
    this._title = title;
    this._description = description;
    this._repRange = repRange;
    this._sets = sets;
    this._Posedescription = Posedescription;
    this._restPeriod = restPeriod;
    this._difficulty = difficulty;
    this._duratime = duratime;
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

  get repRange(): String {
    return this._repRange;
  }

  set repRange(value: String) {
    this._repRange = value;
  }

  get sets(): Number {
    return this._sets;
  }

  set sets(value: Number) {
    this._sets = value;
  }

  get Posedescription(): String {
    return this._Posedescription;
  }

  set Posedescription(value: String) {
    this._Posedescription = value;
  }

  get restPeriod(): Number {
    return this._restPeriod;
  }

  set restPeriod(value: Number) {
    this._restPeriod = value;
  }

  get difficulty(): String {
    return this._difficulty;
  }

  set difficulty(value: String) {
    this._difficulty = value;
  }

  get duratime(): Number {
    return this._duratime;
  }

  set duratime(value: Number) {
    this._duratime = value;
  }
}
