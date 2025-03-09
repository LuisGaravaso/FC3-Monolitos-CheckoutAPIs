import express, {Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import ProductAdmFacadeFactory from '../../product-adm/factory/facade.factory';
import StoreCatalogFacadeFactory from '../../store-catalog/factory/facade.factory';

export const productRouter = express.Router();

productRouter.post('/', 
    [
        body('id').optional().isString().withMessage('Id must be a string.'),
        body('name').isString().withMessage('Name must be a string.'),
        body('description').isString().withMessage('Description must be a string.'),
        body('purchasePrice').isNumeric().withMessage('Purchase price must be a number.'),
        body('salesPrice').isNumeric().withMessage('Sales price must be a number.'),
        body('stock').isNumeric().withMessage('Stock must be a number.'),
    ]
    ,async (req: Request, res: Response) => {

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: 'Invalid input format.',
            errors: errors.array()
        });
    }

   try {
        const addedProduct = await ProductAdmFacadeFactory.create().addProduct({
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock
        });
    
        // Add product to store catalog
        await StoreCatalogFacadeFactory.create().add({
            id: addedProduct.id,
            name: req.body.name,
            description: req.body.description,
            salesPrice: req.body.salesPrice,
        })

        res.status(201).json({ message: 'Product added successfully.', productId: addedProduct.id});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


