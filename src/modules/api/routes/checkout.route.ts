import express, {Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import CheckoutFacadeFactory from '../../checkout/factory/checkout.facade.factory';

export const checkoutRouter = express.Router();

checkoutRouter.post('/', [
    body('clientId').isString().withMessage('Client id must be a string.'),
    body('products').isArray({ min: 1 }).withMessage('Products must be a non-empty array.'),
    body('products.*.productId').isString().withMessage('Product id must be a string.'),
], async (req: Request, res: Response) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: 'Invalid input format.',
            errors: errors.array()
        });
    }

    // Place order
    try {
        const order = await CheckoutFacadeFactory.create().placeOrder({
            clientId: req.body.clientId,
            products: req.body.products,
        });

        return res.status(201).json({ message: 'Order placed successfully.', order });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});