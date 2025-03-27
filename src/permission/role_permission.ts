export class Permission {
  private _name = '';
  private constructor(private _label: string) {
    this._name = _label.split(' ').join('').toLocaleLowerCase();
  }
  public static fromString (permission: string) {
    return new Permission(permission)
  }

  get name () {
    return this._name;
  }

  get label () {
    return this._label;
  }
}

export class RolePermission {
  private _id = Date.now();
  constructor(private _roleId: number, private _permission: Permission) { }

  get id () {
    return this._id
  }

  get roleId () {
    return this._roleId
  }

  get permission () {
    return this._permission
  }
}

export const PermissionRepo = {
  async byUserId (id: number): Promise<Permission[]> {
    return new Promise((resolve, _reject) => {
      /*
      SELECT roles_permissions.permission FROM roles_permissions
      LEFT JOIN roles ON roles.id=roles_permissions.role_id
      WHERE roles.id IN(SELECT role_id FROM users_roles WHERE users_roles.user_id = 1);
      */

      resolve([]);
    });
  }
};