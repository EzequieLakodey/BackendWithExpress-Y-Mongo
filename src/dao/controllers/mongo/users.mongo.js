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
            role: userDto.role,
            last_login: Date.now(),
        });
        return new UserDTO(user);
    }

    async getAll() {
        const users = await this.model.find();
        return users;
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
            return user.toObject();
        } else {
            return null;
        }
    }

    async deleteInactiveUsers(date) {
        const users = await this.model.find({
            last_login: { $lt: date },
        });
        const deletedUsers = [];
        for (const user of users) {
            deletedUsers.push(new UserDTO(user));
            await this.model.deleteOne({ _id: user._id });
        }
        return deletedUsers;
    }
    async update(userDto) {
        const user = await this.model.findByIdAndUpdate(userDto._id, userDto, {
            new: true,
        });
        return new UserDTO(user);
    }
}

export default UsersMongo;
