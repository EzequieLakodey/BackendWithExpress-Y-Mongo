import { usersModel } from '../../models/users.model.js';

export class UsersMongo {
    constructor() {
        this.model = usersModel;
    }

    async save(user) {
        try {
            const userCreated = await this.model.create(user);
            return userCreated;
        } catch (error) {
            throw error;
        }
    }

    async getById(userId) {
        try {
            const user = await this.model.findById(userId);
            if (user) {
                return user;
            } else {
                throw new Error('Inexistent user');
            }
        } catch (error) {
            throw error;
        }
    }

    async getByEmail(userEmail) {
        try {
            const user = await this.model.findOne({ email: userEmail });
            if (user) {
                return user;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }
}
