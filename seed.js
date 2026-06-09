require('dotenv').config(); 
const program = require('commander');
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

const  Product  = require('./models/product');

program
    .version('1.0.0')
    .command('seed <filePath>')
    .alias('s')
    .description('Clear products collection and automatically upload data from a JSON file')
    .action(filePath => executeMigration(filePath));

const executeMigration = async (filePath) => {
    try {
        const absolutePath = path.join(process.cwd(), filePath);
        console.info('Reading target JSON file at:', absolutePath);
        
        const fileContent = await fs.readFile(absolutePath, 'utf-8');
        const parsedJSON = JSON.parse(fileContent);

        const productsArray = Array.isArray(parsedJSON) ? parsedJSON : parsedJSON.products;

        if (!productsArray || productsArray.length === 0) {
            throw new Error('Target JSON file does not contain a valid array of products.');
        }

        const connectionString = process.env.MONGO_URI || 'mongodb+srv://alokinfilon_db_user:iS9gfewUJ4JlfL0x@cluster0.qtrdtnn.mongodb.net/?appName=Cluster0';
        await mongoose.connect(connectionString);
        console.info('Connected to MongoDB database cluster.');

        await Product.deleteMany({});
        console.info('Database old records cleared successfully.');

        const insertResult = await Product.insertMany(productsArray);
        console.info(`Migration Completed! Successfully seeded ${insertResult.length} products.`);

    } catch (error) {
        console.error('An error occurred during execution:', error.message);
    } finally {
        await mongoose.connection.close();
        console.info('Database connection sockets shut down gracefully.');
    }
};

program.parse(process.argv);