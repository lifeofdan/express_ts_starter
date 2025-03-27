/*
 | ID | Username| password | Email                  | salt           |
---------------------------------------------------------------------
 | 100| foo     |  foobar  | something@example.com   |  df12233hfdse  |
*/

import { generateRawBytes } from "./auth";
import { createHmac } from 'node:crypto';
import bcrypt from 'bcrypt'


export class User {
  public id: number;

  constructor(
    private _username: string,
    private _password: string,
    private _email: string,
    private _salt: string,
  ) {
    this.password = _password;
    this.id = Date.now();
  }

  get username () {
    return this._username;
  }

  get password () {
    return this._password;
  }
  set password (pwd: string) {
    this._password = bcrypt.hashSync(pwd + this._salt, 10);
  }

  get email () {
    return this._email;
  }
  get salt () {
    return this._salt;
  }

  public validatePassword (password: string): boolean {
    return bcrypt.compareSync(password + this._salt, this._password)
  }

  public generateApiToken (): string {
    const raw = generateRawBytes(25);

    const secret = `${this.salt}`;
    const hash = createHmac('sha256', secret)
      .update(raw)
      .digest('hex');

    return `${this.id}.${hash}.${raw}`;
  }


  public validateToken (token: string): boolean {
    const pieces = token.split('.');
    if (pieces.length !== 3) {
      return false;
    }

    if (!isNaN(+pieces[0]) && +pieces[0] !== this.id) {
      return false;
    }

    const secret = `${this.salt}`;
    const hash = createHmac('sha256', secret)
      .update(pieces[2] || '.')
      .digest('hex');


    if (hash == pieces[1]) {
      return true;
    } else {
      return false;
    }


  }

  public toJSON () {
    return {
      id: this.id,
      username: this.username,
    }
  }

}

export function generateApiToken (user: User): string {
  const raw = generateRawBytes(25);

  const secret = `${user.salt}`;
  const hash = createHmac('sha256', secret)
    .update(raw)
    .digest('hex');

  return `${user.id}.${hash}.${raw}`;
}

const userTable = {
  users: [] as Array<User>,
  ids: {} as Record<number, number>,
  usernames: {} as Record<string, number>,
  async byToken (token: string): Promise<User | null> {
    return new Promise((resolve, _reject) => {
      // SELECT * FROM users where token = ? LIMIT = 1;
      const pieces = token.split('.');
      if (pieces.length !== 3) {
        return resolve(null);
      }
      const index = userTable.ids[+pieces[0]];

      if (index !== undefined) {
        const user = userTable.users[index];
        if (user.id == +pieces[0]) {
          return resolve(user)
        }
      }
      resolve(null);
    });
  },

  byUsername (name: string): Promise<User | null> {
    // SELECT * FROM users where username = ? LIMIT = 1
    return new Promise((resolve, reject) => {
      const index = this.usernames[name];
      if (index !== undefined) {
        return resolve(this.users[index]);
      }
      return resolve(null)

    })
  }
};

// we are mocking data
(() => {
  const defaultUser = new User("foo", "foobar", "something@example.com", "df12233hf34e34e6");
  userTable.users.push(defaultUser);
  userTable.ids[defaultUser.id] = userTable.users.length - 1;
  userTable.usernames[defaultUser.username] = userTable.users.length - 1;
})();


export const UserRepo = {
  connection: "the db connection we created when the app started",
  findByUsername: async function (name: string): Promise<User | null> {
    return await userTable.byUsername(name)
  },

  findByToken: async function (token: string): Promise<User | null> {
    return await userTable.byToken(token)
  }
}