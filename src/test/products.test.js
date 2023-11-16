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
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should get a product by id', (done) => {
        const pid = '651e0408df79a19825aa94d2'; // replace with a valid product id
        chai.request(app)
            .get(`/api/products/${pid}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id', pid);
                done();
            });
    });
});
