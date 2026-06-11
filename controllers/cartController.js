const cartRepository = require('../repository/cartRepository');
const productRepository = require('../repository/repository');

exports.addItemToCart = async (req, res) => {
    const { productId } = req.body; 
    const quantity = Number.parseInt(req.body.quantity, 10);

    if (!productId || isNaN(quantity)) {
        return res.status(400).json({ type: "Invalid", msg: "Missing Product ID or Quantity" });
    }

    try {
        const carts = await cartRepository.cart();
        let cart = Array.isArray(carts) ? carts[0] : carts; 

        const productDetails = await productRepository.createCartProduct(productId);
        
        if (!productDetails) {
            return res.status(404).json({ type: "Not Found", msg: "Product not found" });
        }

        const productPrice = Number(productDetails.price) || 0;

        if (cart) {
            const indexFound = cart.items.findIndex(item => 
                item.productId && (item.productId._id || item.productId).toString() === productDetails._id.toString()
            );

            if (indexFound !== -1 && quantity <= 0) {
                cart.items.splice(indexFound, 1);
            } 
            else if (indexFound !== -1) {
                cart.items[indexFound].quantity += quantity;
                cart.items[indexFound].price = productPrice;
                cart.items[indexFound].total = cart.items[indexFound].quantity * productPrice;
            } 
            else if (quantity > 0) {
                cart.items.push({
                    productId: productDetails._id, 
                    quantity: quantity,
                    price: productPrice,
                    total: productPrice * quantity
                });
            } 
            else {
                return res.status(400).json({ type: "Invalid", msg: "Invalid quantity provided" });
            }

            cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0);

            let data = await cart.save();
            return res.status(200).json({ type: "success", msg: "Process Successful", data: data });
        } 
        else {
            if (quantity <= 0) {
                return res.status(400).json({ type: "Invalid", msg: "Cannot create cart with 0 items" });
            }

            const cartData = {
                items: [{
                    productId: productDetails._id, 
                    quantity: quantity,
                    price: productPrice,
                    total: productPrice * quantity
                }],
                subTotal: productPrice * quantity
            };

            const newCart = await cartRepository.addItem(cartData);
            return res.status(201).json({ type: "success", msg: "Cart Created", data: newCart });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ type: "Error", msg: "Something Went Wrong", error: err.message });
    }
};


exports.getCart = async (req, res) => {
    try {
        const carts = await cartRepository.cart();
        let cart = Array.isArray(carts) ? carts[0] : carts;

        if (!cart) {
            return res.status(404).json({ status: false, msg: "Cart not found" });
        }
        return res.status(200).json({ status: true, data: cart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ type: "Error", msg: "Something went wrong", error: err.message });
    }
};

exports.emptyCart = async (req, res) => {
    try {
        const carts = await cartRepository.cart();
        let cart = Array.isArray(carts) ? carts[0] : carts;

        if (!cart) {
            return res.status(404).json({ type: "Not Found", msg: "No active cart found to empty" });
        }

        cart.items = [];
        cart.subTotal = 0;
        let data = await cart.save();
        return res.status(200).json({ type: "Success", msg: "Cart has been emptied", data: data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ type: "Error", msg: "Something went wrong", error: err.message });
    }
};
