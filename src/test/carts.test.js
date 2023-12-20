import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Carts Router', () => {
    let productId, cartId;

    beforeEach((done) => {
        // Create a new product
        chai.request(app)
            .post('/api/products-test')
            .send({
                title: 'Test Product',
                description: 'This is a test product',
                code: 'Code-1',
                category: 'Games',
                price: 732,
                stock: 196,
            })
            .end((err, res) => {
                productId = res.body._id;

                // Create a new cart
                chai.request(app)
                    .post('/api/carts-test')
                    .end((err, res) => {
                        cartId = res.body._id;

                        // Add the product to the cart
                        chai.request(app)
                            .put(`/api/carts-test/${cartId}/products/${productId}`)
                            .send({ quantity: 1 })
                            .end(() => {
                                done();
                            });
                    });
            });
    });

    // Add a product to a cart
    it('should add a product to a cart', (done) => {
        chai.request(app)
            .put(`/api/carts-test/${cartId}/products/${productId}`)
            .send({ quantity: 1 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                done();
            });
    });

    it('should list all carts', (done) => {
        chai.request(app)
            .get('/api/carts-test')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should create a new cart', (done) => {
        chai.request(app)
            .post('/api/carts-test')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                done();
            });
    });

    it('should add a product to a cart', (done) => {
        chai.request(app)
            .put(`/api/carts-test/${cartId}/products/${productId}`)
            .send({ quantity: 1 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                done();
            });
    });

    it('should update a product quantity in a cart', (done) => {
        chai.request(app)
            .put(`/api/carts-test/${cartId}/products/${productId}/quantity`)
            .send({ quantity: 2 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                done();
            });
    });

    it('should remove a product from a cart', (done) => {
        chai.request(app)
            .delete(`/api/carts-test/${cartId}/products/${productId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                done();
            });
    });
});
