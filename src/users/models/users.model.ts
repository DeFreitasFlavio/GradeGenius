export class AccountJWT {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public jwt: string,
  ) {}
}
