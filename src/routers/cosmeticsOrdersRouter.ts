import express from "express";
import cosmeticsOrdersController from "../controllers/CosmeticsOrdersController";

const ordersRouter = express.Router();

ordersRouter.post("/", (req, res, next) => {
    res.status(200).send("Works");
})

ordersRouter.post("/acceptOrder", (req, res, next) => {
    try {
        if(req.body.test) {
            res.status(200).send("ok");
        } else {
            cosmeticsOrdersController.processOrder(req, res);
        }
    } catch(e: any) {
        next(e);
    }
})

ordersRouter.post("/acceptPaymentStripe", async (req, res, next) => {
    try {
        await cosmeticsOrdersController.processPayment(req, res);
    } catch(e: any) {
        next(e)
    }
})

export default ordersRouter;