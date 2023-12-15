/* eslint-disable no-undef */
import chai from 'chai';
import UsersMongo from '../dao/controllers/mongo/users.mongo.js';
import { usersModel } from '../dao/models/users.model.js';
import { UserDTO } from '../dto/users.dto.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import { authState } from '../middlewares/auth.js';
import sessionsMongo from '../dao/controllers/mongo/sessions.mongo.js';

// Insalled sinon libraries to mock the time and don't depend on real time for the testing
import Sinon from 'sinon';

const { expect } = chai;
let usersMongo, token, savedUser, testEmail;

// eslint-disable-next-line no-undef
describe('Sessions API', function () {
    before(async function () {
        usersMongo = new UsersMongo();
        testEmail = `test${Date.now()}@example.com`;

        const userDto = new UserDTO({
            first_name: 'Test',
            email: testEmail,
            password: await bcrypt.hash('password', 10),
            role: 'user',
            last_login: new Date(Date.now() - 2 * 60 * 1000),
        });
        savedUser = await usersMongo.save(userDto);
    });

    it('should allow user to signup and login', async () => {
        expect(savedUser).to.be.an.instanceof(UserDTO);
        expect(savedUser.email).to.equal(testEmail);

        const loginUserDto = await usersMongo.getByEmail(testEmail);
        expect(loginUserDto.last_login).to.exist;

        if (!loginUserDto) {
            throw new Error('User not found');
        }
        const match = await bcrypt.compare('password', loginUserDto.password);
        expect(match).to.be.true;

        token = jwt.sign(
            {
                _id: loginUserDto._id,
                first_name: loginUserDto.first_name,
                email: loginUserDto.email,
                role: loginUserDto.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    });

    it('should allow access to profile with valid token', async () => {
        const userDto = await usersMongo.getByEmail(testEmail);
        if (!userDto) {
            throw new Error('User not found');
        }

        const res = await chai
            .request(app)
            .get('/api/sessions/profile')
            .set('Authorization', `Bearer ${token}`);

        expect(res).to.have.status(200);
    });

    it('should GET the login page', async () => {
        // Reset the authState.checkedUser
        authState.checkedUser = null;
        const res = await chai.request(app).get('/api/sessions/login');
        expect(res).to.have.status(200);
    });

    it('should not allow unauthorized access to profile', async () => {
        const res = await chai.request(app).get('/api/sessions/profile');

        expect(res).to.have.status(401);
    });

    it('should delete inactive users', async () => {
        // Mock the current time
        const now = new Date();
        const clock = Sinon.useFakeTimers(now.getTime());

        // Make the user created to be inactive
        const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
        const deletedUsers = await usersMongo.deleteInactiveUsers(oneMinuteAgo);
        expect(deletedUsers).to.be.an('array');
        deletedUsers.forEach((user) => {
            expect(user.last_login).to.be.below(oneMinuteAgo);
        });

        // Call the deleteUsers function
        await sessionsMongo.deleteUsers(null, null, 60 * 1000);

        // Restore the original time
        clock.restore();
    });

    after(async function () {
        await usersModel.deleteOne({ email: testEmail });
    });
});
