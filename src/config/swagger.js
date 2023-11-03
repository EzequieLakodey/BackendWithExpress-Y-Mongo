import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-commerce API',
            version: '1.0.0',
        },
    },
    apis: ['./src/docs/*.yaml'], // files containing annotations as above
};

export const swaggerSpecs = swaggerJsDoc(swaggerOptions);
