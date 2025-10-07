export default class UserDTO {
  constructor(u) {
    this.id         = u._id?.toString?.() ?? u.id;
    this.first_name = u.first_name;
    this.last_name  = u.last_name;
    this.email      = u.email;
    this.role       = u.role;
    this.cart       = u.cart;
  }
}
