import chai from 'chai';
import UsersMongo from '../dao/controllers/mongo/usersRepository.js';
import { usersModel } from '../dao/models/users.model.js';
import { UserDTO } from '../dto/users.dto.js';
import { before } from 'mocha';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../app.js';

const expect = chai.expect;
let usersMongo, token;

console.log('Connected to MongoDB');

describe('Sessions API', function () {
    before(async function () {
        usersMongo = new UsersMongo();
        console.log('🚀 ~ file: sessions.test.js:18 ~ UsersMongo:', UsersMongo);
    });

    beforeEach(async () => {
        await usersModel.deleteMany({});
    });

    it('should allow user to signup', async () => {
        const userDto = new UserDTO({
            first_name: 'Test',
            email: 'test@example.com',
            password: await bcrypt.hash('password', 10),
            role: 'user',
        });
        const savedUser = await usersMongo.save(userDto);
        expect(savedUser).to.be.an.instanceof(UserDTO);
        expect(savedUser.email).to.equal('test@example.com');
    });

    it('should allow user to login', async () => {
        const userDto = await usersMongo.getByEmail('test@example.com');
        if (!userDto) {
            throw new Error('User not found');
        }
        const match = await bcrypt.compare('password', userDto.password);
        expect(match).to.be.true;
        token = jwt.sign(
            {
                _id: userDto._id,
                first_name: userDto.first_name,
                email: userDto.email,
                role: userDto.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    });

    it('should allow access to profile with valid token', async () => {
        const userDto = await usersMongo.getByEmail('test@example.com');
        const token = jwt.sign(
            {
                _id: userDto._id,
                first_name: userDto.first_name,
                email: userDto.email,
                role: userDto.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        chai.request(app)
            .get('/api/sessions/profile')
            .set('Authorization', `Bearer ${token}`) // use the token
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should GET the login page', (done) => {
        chai.request(app)
            .get('/api/sessions/login')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should not allow unauthorized access to profile', (done) => {
        console.log(token);
        chai.request(app)
            .get('/api/sessions/profile')
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });
});
