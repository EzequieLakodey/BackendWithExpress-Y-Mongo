import { usersModel } from '../../models/users.model.js';
import { UserDTO } from '../../../dto/users.dto.js';

class UsersMongo {
    constructor() {
        this.model = usersModel;
    }

    async save(userDto) {
        const user = await this.model.create({
            first_name: userDto.first_name,
            email: userDto.email,
            password: userDto.password,
            role: userDto.role, // Add this line
            // include other necessary fields...
        });
        return new UserDTO(user);
    }
    async getById(userId) {
        const user = await this.model.findById(userId);
        if (user) {
            return new UserDTO(user);
        } else {
            throw new Error(`User with ID ${userId} not found`);
        }
    }

    async getByEmail(userEmail) {
        const user = await this.model.findOne({ email: userEmail });
        if (user) {
            return new UserDTO(user);
        } else {
            return null;
        }
    }
}

export default UsersMongo;
