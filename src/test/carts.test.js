import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'; // import your express app

chai.use(chaiHttp);
const { expect } = chai;

describe('Carts Router', () => {
    it('should list all carts', (done) => {
        chai.request(app)
            .get('/api/carts')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                done();
            });
    });

    // Add more tests here
});
