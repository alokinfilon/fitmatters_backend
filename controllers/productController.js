const Product = require("../models/product");

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Retrieve a list of clothing products
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 200
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Success! Returns paginated products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 1 }
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems: { type: integer, example: 72 }
 *                     currentPage: { type: integer, example: 1 }
 *                     totalPages: { type: integer, example: 1 }
 *                     limit: { type: integer, example: 200 }
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer, example: 1 }
 *                       title: { type: string, example: "Zara Dress" }
 *                       price: { type: number, format: float, example: 121.08 }
 *                       dimensions:
 *                         type: object
 *                         properties:
 *                           width: { type: number, example: 34.5 }
 *                           height: { type: number, example: 39.9 }
 *                       reviews:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             rating: { type: integer, example: 3 }
 *                             comment: { type: string, example: "Nice" }
 *                       meta:
 *                         type: object
 *                         properties:
 *                           createdAt: { type: string, format: date-time }
 *                       images:
 *                         type: array
 *                         items: { type: string, format: uri }
 */
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

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get a single product by its unique ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The numeric ID of the product to retrieve
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 product:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 1 }
 *                     title: { type: string, example: "Zara Midnight Blue Linen Summer Dress" }
 *                     description: { type: string, example: "Experience ultimate style and comfort..." }
 *                     category: { type: string, example: "summer-dress" }
 *                     price: { type: number, format: float, example: 121.08 }
 *                     discountPercentage: { type: number, example: 20.1 }
 *                     rating: { type: number, example: 4.4 }
 *                     stock: { type: integer, example: 72 }
 *                     tags:
 *                       type: array
 *                       items: { type: string }
 *                       example: ["zara", "linen", "blue"]
 *                     sku: { type: string, example: "ZA-SUM-001-MID" }
 *                     weight: { type: number, example: 0.24 }
 *                     dimensions:
 *                       type: object
 *                       properties:
 *                         width: { type: number, example: 34.5 }
 *                         height: { type: number, example: 39.9 }
 *                         depth: { type: number, example: 2.5 }
 *                     warrantyInformation: { type: string, example: "No warranty" }
 *                     shippingInformation: { type: string, example: "Ships in 2-3 business days" }
 *                     availabilityStatus: { type: string, example: "In Stock" }
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           rating: { type: integer, example: 3 }
 *                           comment: { type: string, example: "Highly recommended." }
 *                           date: { type: string, format: date-time, example: "2026-04-19T09:36:46Z" }
 *                           reviewerName: { type: string, example: "Tanya Kapoor" }
 *                           reviewerEmail: { type: string, example: "tanya.k@example.com" }
 *                     returnPolicy: { type: string, example: "30 days return policy" }
 *                     minimumOrderQuantity: { type: integer, example: 1 }
 *                     meta:
 *                       type: object
 *                       properties:
 *                         createdAt: { type: string, format: date-time, example: "2026-03-02T09:36:46Z" }
 *                         updatedAt: { type: string, format: date-time, example: "2026-06-06T09:36:46Z" }
 *                     images:
 *                       type: array
 *                       items: { type: string, format: uri }
 *                       example: ["https://unsplash.com"]
 *                     thumbnail: { type: string, format: uri, example: "https://unsplash.com" }
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Product profile not found." }
 */
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
