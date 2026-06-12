const Product = require("../models/product"); 

exports.getAllCartProducts = async () => {
    return await Product.find();
};

exports.cartProductById = async (id) => {
    return await Product.findById(id);
};

exports.createCartProduct = async (numericId) => {
    const searchId = numericId && typeof numericId === 'object' ? numericId.id : numericId;
    return await Product.findOne({ id: searchId });
};

exports.removeCartProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};
