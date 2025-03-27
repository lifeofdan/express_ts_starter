import { User } from "../user";
import { Permission } from "./role_permission";

export async function can (user: User | number, permission: Permission | null | string): Promise<boolean> {
  const userId = (user instanceof User) ? user.id : user;

  if (permission === null) {
    // fetch the user permission via their roles 
  }

  return new Promise((resolve, reject) => {

  });
}