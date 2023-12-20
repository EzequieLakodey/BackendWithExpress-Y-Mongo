export class UserDTO {
    constructor(user) {
        this._id = user._id;
        this.first_name = user.first_name;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
        this.premium = user.premium;
        this.cart = user.cart;
        this.last_login = user.last_login;
    }
}
