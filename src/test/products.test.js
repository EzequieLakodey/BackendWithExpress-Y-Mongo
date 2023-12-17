import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'; // import your express app
import { productsManager } from '../dao/controllers/mongo/products.mongo.js';

chai.use(chaiHttp);
const { expect } = chai;
let productId;

beforeEach((done) => {
    // create a new product
    const product = {
        title: 'Test Product',
        description: 'This is a test product',
        code: 'Code-1',
        category: 'Games',
        price: 732,
        stock: 196,
    };

    productsManager
        .addProduct(product)
        .then((savedProduct) => {
            productId = savedProduct._id;
            done();
        })
        .catch((error) => {
            [];
            done(error);
        });
});

it('should list all products', (done) => {
    chai.request(app)
        .get('/api/products-test')
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array'); // Assertion error here
            done();
        });
});

it('should get a product by id', (done) => {
    chai.request(app)
        .get(`/api/products-test/${productId}`)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object'); // Assertion error here
            expect(res.body).to.have.property('_id', productId.toString());
            done();
        });
});

it('should update a product by id', (done) => {
    const updatedProduct = {
        title: 'Updated Product',
        description: 'This is an updated product',
        code: 'Code-2',
        category: 'Games',
        price: 1000,
        stock: 200,
    };

    chai.request(app)
        .put(`/api/products-test/${productId}`)
        .send(updatedProduct)
        .end((err, res) => {
            expect(res).to.have.status(200); // Assertion error here
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('title', updatedProduct.title);
            done();
        });
});

it('should delete a product by id', (done) => {
    chai.request(app)
        .delete(`/api/products-test/${productId}`)
        .end((err, res) => {
            expect(res).to.have.status(200); // Assertion error here
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            done();
        });
});
