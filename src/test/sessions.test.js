import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'; // import your express app

chai.use(chaiHttp);
const { expect } = chai;

describe('Sessions API', () => {
    it('should GET the login page', (done) => {
        chai.request(app)
            .get('/api/sessions/login')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should not allow unauthorized access to profile', (done) => {
        chai.request(app)
            .get('/api/sessions/profile')
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('should allow user to signup', (done) => {
        const user = {
            email: 'myfirst@account.com',
            password: '123',
        };
        chai.request(app)
            .post('/api/sessions/signup')
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should allow user to login', (done) => {
        const user = {
            email: 'test@test.com',
            password: 'password',
        };
        chai.request(app)
            .post('/api/sessions/login')
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(200);
                token = res.body.token; // save the token for later tests
                done();
            });
    });

    it('should allow access to profile with valid token', (done) => {
        chai.request(app)
            .get('/api/sessions/profile')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
