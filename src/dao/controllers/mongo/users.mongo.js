import { usersModel } from '../../models/users.model.js';
import { UserDTO } from '../../../dto/users.dto.js';
import { logger } from '../../../middlewares/logger.js';
import { emailService } from '../../../services/email.services.js';

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

        await user.save();
        return new UserDTO(user.toObject());
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

    async getCart(userId) {
        const user = await this.model.findById(userId).populate({
            path: 'cart',
            populate: {
                path: 'products.product',
            },
        });
        if (user && user.cart) {
            return user.cart;
        } else {
            throw new Error(`User with ID ${userId} not found`);
        }
    }

    async getByEmail(userEmail) {
        const user = await this.model.findOne({ email: userEmail });
        if (user) {
            await user.save();
            return user.toObject();
        } else {
            return null;
        }
    }

    async sendEmailToUsers(users) {
        const mailPromises = users.map((user) => {
            // Send email to the user
            return emailService.sendEmail(user);
        });

        // Wait for all emails to be sent
        await Promise.all(mailPromises);
    }

    async deleteInactiveUsers() {
        const inactiveDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
        const users = await this.model.find({
            last_login: { $lt: inactiveDate },
        });

        // Send an email to each user before deleting them
        await this.sendEmailToUsers(users);

        await this.model.deleteMany({
            last_login: { $lt: inactiveDate },
        });

        return users;
    }

    async update(userDto) {
        const user = await usersModel.findByIdAndUpdate(userDto._id, userDto, {
            new: true,
        });
        if (!user) {
            throw new Error(`User with ID ${userDto._id} not found`);
        }
        return new UserDTO(user);
    }

    async deleteUser(userId) {
        logger.info(`Deleting user with ID: ${userId}`);
        await this.model.findByIdAndDelete(userId);
    }

    async modifyRole(userId, newRole) {
        const user = await this.model.findById(userId);
        logger.info(`Changing role of user with ID: ${userId} to ${newRole}`);
        user.role = newRole;
        await user.save();
    }

    async makeUserPremium(userId) {
        const user = await this.model.findById(userId);
        if (!user) {
            logger.error(`User with ID ${userId} not found`);
            throw new Error(`User with ID ${userId} not found`);
        }
        user.premium = true;
        logger.info(`User with ID ${userId} is now premium`);
        await user.save();
        return new UserDTO(user);
    }
}

export const usersMongo = new UsersMongo();
