export class Contact {
  private _name: string;
  private _surname: string;
  private _contactEmail: string;
  private _contactId: string;
  private _plannerID: string;

  constructor(contactID: string, contactEmail: string, name: string, surname: string, plannerID: string) {
      this._name = name;
      this._surname = surname;
      this._contactEmail = contactEmail;
      this._contactId = contactID;
      this._plannerID = plannerID;
  }

  get name(): string {
      return this._name;
  }

  set name(value: string) {
      this._name = value;
  }

  get surname(): string {
      return this._surname;
  }

  set surname(value: string) {
      this._surname = value;
  }

  get contactEmail(): string {
      return this._contactEmail;
  }

  set contactEmail(value: string) {
      this._contactEmail = value;
  }

  get contactID(): string {
      return this._contactId;
  }

  set contactID(value: string) {
      this._contactId = value;
  }

  get plannerID(): string {
      return this._plannerID;
  }

  set plannerID(value: string) {
      this._plannerID = value;
  }
}
