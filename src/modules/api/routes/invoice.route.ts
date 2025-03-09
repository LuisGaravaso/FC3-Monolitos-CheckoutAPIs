import express, {Request, Response} from 'express';
import InvoiceFacadeFactory from '../../invoice/factory/facade.factory';

export const invoiceRouter = express.Router();

invoiceRouter.get('/:id', async (req: Request, res: Response) => {

    try {
        const inputDTO = {
            id: req.params.id
        };
        const invoice = await InvoiceFacadeFactory.create().find(inputDTO);
        res.status(200).json(invoice);
        
    } catch (error) {
        if (error instanceof Error && error.message === 'Invoice with id ' + req.params.id + ' not found') {
            return res.status(404).json({ message: 'Invoice not found.' });
        }
        
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
    