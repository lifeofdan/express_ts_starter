class Role {
  private _name = '';
  private _id: number = Date.now();
  constructor(roleName: string, private _label?: string) {
    this.name = roleName;
  }

  get id (): number {
    return this._id;
  }
  set name (name: string) {
    this._name = name.split(' ').join().toLocaleLowerCase();
  }

  get name () {
    return this._name
  }

  get label () {
    return this._label || ''
  }
}
const roleTable = {
  roles: [] as Role[],
  ids: {} as Record<number, number>,
  names: {} as Record<string, number>,
  async save (role: Role) {
    this.roles.push(role);
    this.ids[role.id] = this.roles.length - 1;
    this.names[role.name] = this.roles.length - 1;
  },
  async byName (name: string): Promise<Role | null> {
    // SELECT * FROM roles where name = ? LIMIT = 1;
    return new Promise((resolve, reject) => {
      const index = this.names[name] || -1;
      if (index < 0) {
        return resolve(null);
      }
      resolve(this.roles[index]);
    });
  },

  async byId (id: number): Promise<Role | null> {
    // SELECT * FROM roles where id = ? LIMIT = 1;
    return new Promise((resolve, reject) => {
      const index = this.ids[id] || -1;
      if (index < 0) {
        return resolve(null);
      }
      resolve(this.roles[index]);
    });
  },
};


export const RoleRepo = {
  async byName (name: string): Promise<Role | null> {
    return roleTable.byName(name); // TODO: Remove "mock table" and make an real call to the DB
  },
  async byId (id: number): Promise<Role | null> {
    return roleTable.byId(id); // TODO: Remove "mock table" and make an real call to the DB
  }
};



// make mock data
(() => {
  roleTable.save(new Role('Admin'));
  roleTable.save(new Role('Customer'));
})()