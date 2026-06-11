const Cart = require("../models/cartProduct");

exports.cart = async () => {
    const carts = await Cart.find().populate({
        path: "items.productId", 
        select: "name price total"
    });
    return carts[0]; 
};

exports.addItem = async (payload) => {
    const formattedPayload = {
        items: payload.products.map(product => ({
            productId: product.id,             
            quantity: 1,                       
                         
                     
        })),
        
        subTotal: payload.products.reduce((acc, prod) => acc + prod.price, 0) 
    };

    const newItem = await Cart.create(formattedPayload);
    return newItem;
};
