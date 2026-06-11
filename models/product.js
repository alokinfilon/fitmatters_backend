const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    reviewerName: {
        type: String,
        required: true,
    },
    reviewerEmail: {
        type: String,
        required: true,
    }
});

const productSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true, 
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            index: true, 
        },
        price: {
            type: Number,
            required: true,
        },
        discountPercentage: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
        },
        stock: {
            type: Number,
            required: true,
        },
        tags: {
            type: [String], 
            default: [],
        },
        sku: {
            type: String,
            required: true,
            unique: true,
        },
        weight: {
            type: Number,
        },
        dimensions: {
            width: { type: Number },
            height: { type: Number },
            depth: { type: Number },
        },
        warrantyInformation: {
            type: String,
        },
        shippingInformation: {
            type: String,
        },
        availabilityStatus: {
            type: String,
        },
        reviews: [reviewSchema], 
        returnPolicy: {
            type: String,
        },
        minimumOrderQuantity: {
            type: Number,
            default: 1,
        },
        meta: {
            createdAt: { type: Date },
            updatedAt: { type: Date },
        },
        images: {
            type: [String], 
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        }
    },
    { timestamps: true } 
);

productSchema.index({ title: "text", description: "text" });


module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);