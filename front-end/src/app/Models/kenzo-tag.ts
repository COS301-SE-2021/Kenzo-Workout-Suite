export class KenzoTag {
  private _textColor:String;
  private _backgroundColor:String;
  private _label:String;
  private _selected:Boolean;

  constructor(textColor: String, backgroundColor: String, label: String, selected: Boolean) {
    this._textColor = textColor;
    this._backgroundColor = backgroundColor;
    this._label = label;
    this._selected = selected;
  }

  get textColor(): String {
    return this._textColor;
  }

  set textColor(value: String) {
    this._textColor = value;
  }

  get backgroundColor(): String {
    return this._backgroundColor;
  }

  set backgroundColor(value: String) {
    this._backgroundColor = value;
  }

  get label(): String {
    return this._label;
  }

  set label(value: String) {
    this._label = value;
  }

  get selected(): Boolean {
    return this._selected;
  }

  set selected(value: Boolean) {
    this._selected = value;
  }
}
