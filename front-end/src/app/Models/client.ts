export class Client {
  private _firstName: string;
  private _lastName: string;
  private _email: string;


  constructor(firstName: string, lastName: string, email: string) {
      this._firstName = firstName;
      this._lastName = lastName;
      this._email = email;
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

  get email(): string {
      return this._email;
  }

  set email(value: string) {
      this._email = value;
  }
}
