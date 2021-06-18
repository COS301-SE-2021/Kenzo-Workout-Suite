export class KenzoTag {
  private _textColor:string;
  private _backgroundColor:string;
  private _label:string;
  private _selected:boolean;


  constructor(textColor: string, backgroundColor: string, label: string, selected: boolean) {
    this._textColor = textColor;
    this._backgroundColor = backgroundColor;
    this._label = label;
    this._selected = selected;
  }


  get textColor(): string {
    return this._textColor;
  }

  set textColor(value: string) {
    this._textColor = value;
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }

  set backgroundColor(value: string) {
    this._backgroundColor = value;
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }
}
