/* eslint-disable no-undef */
import chai from 'chai';
import UsersMongo from '../dao/controllers/mongo/usersRepository.js';
import { usersModel } from '../dao/models/users.model.js';
import { UserDTO } from '../dto/users.dto.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../app.js';

const { expect } = chai;
let usersMongo, token, savedUser, testEmail;

describe('Sessions API', function () {
    before(async function () {
        usersMongo = new UsersMongo();
        testEmail = `test${Date.now()}@example.com`;

        const userDto = new UserDTO({
            first_name: 'Test',
            email: testEmail,
            password: await bcrypt.hash('password', 10),
            role: 'user',
        });
        savedUser = await usersMongo.save(userDto);
    });

    it('should allow user to signup and login', async () => {
        expect(savedUser).to.be.an.instanceof(UserDTO);
        expect(savedUser.email).to.equal(testEmail);

        const loginUserDto = await usersMongo.getByEmail(testEmail);
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
        const res = await chai.request(app).get('/api/sessions/login');
        expect(res).to.have.status(200);
    });

    it('should not allow unauthorized access to profile', async () => {
        const res = await chai.request(app).get('/api/sessions/profile');
        expect(res).to.have.status(401);
    });

    after(async function () {
        await usersModel.deleteOne({ email: testEmail });
    });
});
