import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'; // import your express app

chai.use(chaiHttp);
const { expect } = chai;

describe('Products Router', () => {
    it('should list all products', (done) => {
        chai.request(app)
            .get('/api/products')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                done();
            });
    });

    // Add more tests here
});
