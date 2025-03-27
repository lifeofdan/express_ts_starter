export class UserRole {
  constructor(private _userId: number, private _roleId: number) { }
  get userId () {
    return this._userId
  }

  get roleId () {
    return this._roleId
  }
}