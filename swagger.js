const swaggerJSDoc = require('swagger-jsdoc');
const dotenv = require('dotenv')
const path = require('path');
require('dotenv').config();
const PORT = process.env.PORT || 3000
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Simple Node.js API',
      version: '1.0.0',
      description: 'A basic Express API documented with Swagger',
    },
    servers: [
      {
        url: 'https://fitmatters-backend.onrender.com',
        description: 'Production Server (Render)',
      },
      {
        url: `http://localhost:${PORT}`,
        description: 'Live Production Server',
      },
    ],
  },
  apis: [path.resolve(__dirname, './routes/user.js'),
    path.resolve(__dirname, './routes/productRoutes.js')
  ],  
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
