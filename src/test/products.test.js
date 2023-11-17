import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'; // import your express app
import ProductsManagerMongo from '../dao/controllers/mongo/products.mongo.js';

chai.use(chaiHttp);
const { expect } = chai;
let productId;

let mongoManager = new ProductsManagerMongo();

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

    mongoManager
        .addProduct(product)
        .then((savedProduct) => {
            console.log(savedProduct); // add this line
            productId = savedProduct._id; // save the id of the created product
            done();
        })
        .catch((error) => {
            console.log('Error while saving the product:', error);
            done(error);
        });
});

describe('Products Router', () => {
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

        mongoManager
            .addProduct(product)
            .then((savedProduct) => {
                console.log(savedProduct); // add this line
                productId = savedProduct._id; // save the id of the created product
                done();
            })
            .catch((error) => {
                console.log('Error while saving the product:', error);
                done(error);
            });
    });

    afterEach((done) => {
        // delete the created product
        mongoManager
            .deleteProduct(productId)
            .then(() => {
                done();
            })
            .catch((error) => {
                console.log('Error while deleting the product:', error);
                done(error);
            });
    });

    it('should list all products', (done) => {
        chai.request(app)
            .get('/api/test/products')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should get a product by id', (done) => {
        chai.request(app)
            .get(`/api/test/products/${productId}`) // use the id of the created product
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id', productId.toString()); // convert ObjectId to string
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

        // Check if the product exists before trying to update it
        mongoManager
            .getProductsById(productId)
            .then((product) => {
                if (product) {
                    chai.request(app)
                        .put(`/api/test/products/${productId}`) // use the id of the created product
                        .send(updatedProduct)
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body).to.have.property(
                                'title',
                                updatedProduct.title
                            );
                            done();
                        });
                } else {
                    done(new Error('Product not found'));
                }
            })
            .catch((error) => {
                console.log('Error while checking the product:', error);
                done(error);
            });
    });

    it('should delete a product by id', (done) => {
        // Check if the product exists before trying to delete it
        mongoManager
            .getProductsById(productId)
            .then((product) => {
                if (product) {
                    chai.request(app)
                        .delete(`/api/test/products/${productId}`) // use the id of the created product
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body).to.have.property('message');
                            done();
                        });
                } else {
                    done(new Error('Product not found'));
                }
            })
            .catch((error) => {
                console.log('Error while checking the product:', error);
                done(error);
            });
    });
});
