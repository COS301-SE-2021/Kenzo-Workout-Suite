export class Client {
  private _firstName: string;
  private _lastName: string;
  private _phoneNumber: string;


  constructor(firstName: string, lastName: string, phoneNumber: string) {
      this._firstName = firstName;
      this._lastName = lastName;
      this._phoneNumber = phoneNumber;
  }


  get firstName(): string {
      return this._firstName;
  }

  set firstName(value: string) {
      this._firstName = value;
  }

  get lastName(): string {
      return this._lastName;
  }

  set lastName(value: string) {
      this._lastName = value;
  }

  get phoneNumber(): string {
      return this._phoneNumber;
  }

  set phoneNumber(value: string) {
      this._phoneNumber = value;
  }
}
