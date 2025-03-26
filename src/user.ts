/*
 | ID | Username| password | Email                  | salt           |
---------------------------------------------------------------------
 | 100| foo     |  foobar  | something@example.com   |  df12233hfdse  |
*/

import { generateRawBytes } from "./auth";
import { createHmac } from 'node:crypto';


export class User {
  public id = 100;
  public username = "foo";
  public password = "foobar";
  public email = "something@example.com";
  public salt = "df12233hf34e34e6"

  constructor() { }

  public static findByUsername (name: string): User | null {
    const index = userTable.usernames[name];
    if (index !== undefined) {
      return userTable.users[index];
    }
    return null
  }

  public static findByToken (token: string): User | null {
    const pieces = token.split('.');
    if (pieces.length !== 3) {
      return null;
    }

    if (isNaN(+pieces[0])) {
      return null;
    }

    const index = userTable.ids[pieces[0]];

    if (index !== undefined) {
      const user = userTable.users[index];
      if (user.id == +pieces[0]) {
        return user
      }
    }


    return null
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
};

const defaultUser = new User();
userTable.users.push(defaultUser);
userTable.ids[defaultUser.id] = userTable.users.length - 1;
userTable.usernames[defaultUser.username] = userTable.users.length - 1;


