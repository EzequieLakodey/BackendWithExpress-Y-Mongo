export class UserDTO {
    constructor(user) {
        this.first_name = user.first_name;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
        // include other necessary fields...
    }
}
