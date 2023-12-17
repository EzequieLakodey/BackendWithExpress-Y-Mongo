import chai from 'chai';
import { usersMongo } from '../dao/controllers/mongo/users.mongo.js';
import { UserDTO } from '../dto/users.dto.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import { authState } from '../middlewares/auth.js';
import { logger } from '../middlewares/logger.js';
import { emailService } from '../services/email.services.js';
import Sinon from 'sinon';

// Create a mock of the EmailService
Sinon.stub(emailService, 'sendEmail').resolves();

// Mock only setTimeout and setInterval
Sinon.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'],
});

beforeEach(() => {});

// After each test
afterEach(() => {
    Sinon.restore();
});

const { expect } = chai;
let token, savedUser, testEmail;

describe('Sessions API', function () {
    before(async function () {
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

        // Set last_login to more than two days ago
        const moreThanTwoDaysAgo = new Date();
        moreThanTwoDaysAgo.setDate(moreThanTwoDaysAgo.getDate() - 3);
        savedUser.last_login = moreThanTwoDaysAgo;

        // Update the user in the database
        await usersMongo.update(savedUser);
        logger.info('updated user:', savedUser);

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
        Sinon.stub(emailService, 'sendEmail').resolves();

        // Mock the current time
        const clock = Sinon.useFakeTimers();

        // Make the user created to be inactive
        const moreThanTwoDaysAgo = new Date();
        moreThanTwoDaysAgo.setDate(moreThanTwoDaysAgo.getDate() - 3);
        savedUser.last_login = moreThanTwoDaysAgo;

        // Update the user in the database
        await usersMongo.update(savedUser);

        // Advance the clock to simulate the passage of two days
        clock.tick(172800000);

        // Call deleteInactiveUsers function directly
        const deletedUsers = await usersMongo.deleteInactiveUsers(emailService);

        // Check if any users were deleted
        expect(deletedUsers).to.be.an('array');
        expect(deletedUsers).to.have.lengthOf(1); // Expect one user to be deleted

        // Restore the original time
        clock.restore();
    });
});
