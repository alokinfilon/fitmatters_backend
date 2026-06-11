const express = require('express');
const passport = require("./middleware/passport");
const config = require("./utils/config");

const morgan = require("morgan");

const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

const authRouter = require("./routes/auth");

const app = express();
const cors = require('cors');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { logReqRes } = require("./middleware");
const { connectMongoDb } = require("./connection");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require('./routes/cartRoutes')

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI
connectMongoDb(process.env.MONGO_URI)
    .then(() => console.log("mongodb connected"));

app.use(cors()); 
app.use(morgan("common"));
app.use(passport.initialize());

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));

app.use("/cart", cartRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/products", productRoutes);
app.use("/auth", authRouter); 
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);    

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
