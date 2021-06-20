import {KenzoTag} from "./kenzo-tag";

export class Exercise {

  private _title:string;
  private _description:string;
  private _repRange:string;
  private _sets:number;
  private _Posedescription:string;
  private _restPeriod:number; //seconds
  private _tags:KenzoTag[];
  private _duratime:number; //seconds


  constructor(title: string, description: string, repRange: string, sets: number, Posedescription: string, restPeriod: number, tags: KenzoTag[], duratime: number) {
    this._title = title;
    this._description = description;
    this._repRange = repRange;
    this._sets = sets;
    this._Posedescription = Posedescription;
    this._restPeriod = restPeriod;
    this._tags = tags;
    this._duratime = duratime;
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

  get repRange(): string {
    return this._repRange;
  }

  set repRange(value: string) {
    this._repRange = value;
  }

  get sets(): number {
    return this._sets;
  }

  set sets(value: number) {
    this._sets = value;
  }

  get Posedescription(): string {
    return this._Posedescription;
  }

  set Posedescription(value: string) {
    this._Posedescription = value;
  }

  get restPeriod(): number {
    return this._restPeriod;
  }

  set restPeriod(value: number) {
    this._restPeriod = value;
  }

  get tags(): KenzoTag[] {
    return this._tags;
  }

  set tags(value: KenzoTag[]) {
    this._tags = value;
  }

  get duratime(): number {
    return this._duratime;
  }

  set duratime(value: number) {
    this._duratime = value;
  }
}
