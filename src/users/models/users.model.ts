export class Account {
  constructor(
    public id: string,
    public name: string,
    public email: string,
  ) {}
}

export class AccountJWT {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public jwt: string,
  ) {}
}
