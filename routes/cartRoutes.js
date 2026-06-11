const router = require("express").Router();
const cartController = require("../controllers/cartController");
router.post("/addItem", cartController.addItemToCart);
router.get("/getCartItem", cartController.getCart);
router.delete("/empty-cart", cartController.emptyCart);
module.exports = router;