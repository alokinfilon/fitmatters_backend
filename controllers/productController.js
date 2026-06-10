const  Product  = require("../models/product");

exports.getProducts = async (req, res) => {
    try {
        const { category, page = 1, limit = 200 } = req.query;
        const queryFilter = {};

        if (category) {
            queryFilter.category = category;
        }

        const skipIndex = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(queryFilter)
            .sort({ id: 1 }) 
            .skip(skipIndex)
            .limit(parseInt(limit));

        const totalMatchingProducts = await Product.countDocuments(queryFilter);

        res.status(200).json({
            success: true,
            count: products.length,
            pagination: {
                totalItems: totalMatchingProducts,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalMatchingProducts / limit),
                limit: parseInt(limit)
            },
            products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product profile not found." });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};