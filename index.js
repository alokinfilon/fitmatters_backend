const express = require('express');
const app = express();
const cors = require('cors');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { logReqRes } = require("./middleware");
const { connectMongoDb } = require("./connection");
const userRouter = require("./routes/user");
const productRoutes = require("./routes/productRoutes");

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI
connectMongoDb(process.env.MONGO_URI)
    .then(() => console.log("mongodb connected"));

app.use(cors()); 

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/products", productRoutes);
app.use("/user", userRouter); 

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
