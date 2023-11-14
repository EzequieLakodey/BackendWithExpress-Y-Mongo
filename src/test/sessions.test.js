import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'; // import your express app

chai.use(chaiHttp);
const { expect } = chai;

let user, token;

beforeEach(() => {
    user = {
        first_name: 'Test',
        email: `myfirst${Date.now()}@account.com`,
        password: '123',
    };
});

it('should allow user to signup', (done) => {
    expect(res.body.message).to.equal('User registered');
    chai.request(app)
        .post('/api/sessions/signup')
        .send(user)
        .end((err, res) => {
            expect(res).to.have.status(200);
            setTimeout(done, 500);
        });
});

it('should allow user to login', (done) => {
    token = res.body.token;
    chai.request(app)
        .post('/api/sessions/login')
        .send(user)
        .end((err, res) => {
            expect(res).to.have.status(200);
            token = res.body.token; // store the token
            done();
        });
});

it('should allow access to profile with valid token', (done) => {
    if (!token) {
        throw new Error('Token not generated');
    }
    chai.request(app)
        .get('/api/sessions/profile')
        .set('Authorization', `Bearer ${token}`) // use the token
        .end((err, res) => {
            expect(res).to.have.status(200);
            done();
        });
});

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
        console.log(token);
        chai.request(app)
            .get('/api/sessions/profile')
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });

    chai.request(app)
        .post('/api/sessions/signup')
        .send(user)
        .end((err, res) => {
            expect(res).to.have.status(200);
            done();
        });
});
