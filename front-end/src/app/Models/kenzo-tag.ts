export class KenzoTag {
  public textColour:string;
  public backgroundColour:string;
  public label:string;
  public selected:boolean;


  constructor(textColour: string, backgroundColour: string, label: string, selected: boolean) {
    this.textColour = textColour;
    this.backgroundColour = backgroundColour;
    this.label = label;
    this.selected = selected;
  }
}
