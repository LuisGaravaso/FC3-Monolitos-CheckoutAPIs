import express, {Request, Response} from 'express';
import ClientAdmFacadeFactory from '../../client-adm/factory/client-adm.facade.factory';
import Address from '../../@shared/domain/value-object/address';
import { body, validationResult } from 'express-validator';

export const customerRouter = express.Router();

type AddClientInputDto = {
  id?: string
  name: string
  email: string
  document: string
  address: Address
}

type FindClientInputDto = {
  id: string
}

customerRouter.post('/',
    [
        // Input validation using express-validator
        body('id').optional().isString().withMessage('Id must be a string.'),
        body('name').isString().withMessage('Name must be a string.'),
        body('email').isEmail().withMessage('Invalid email format.'),
        body('document').isString().withMessage('Document must be a string.'),
        body('address').isObject().withMessage('Address must be an object.'),
        body('address.street').isString().withMessage('Street must be a string.'),
        body('address.number').isString().withMessage('Number must be a string.'),
        body('address.complement').isString().withMessage('Complement must be a string.'),
        body('address.city').isString().withMessage('City must be a string.'),
        body('address.state').isString().withMessage('State must be a string.'),
        body('address.zipCode').isString().withMessage('ZipCode must be a string.'),
    ],
    async (req: Request, res: Response) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Invalid input format.',
                errors: errors.array()
            });
        }

        try {
            const InputDTO: AddClientInputDto = {
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                document: req.body.document,
                address: new Address(
                    req.body.address.street,
                    req.body.address.number,
                    req.body.address.complement,
                    req.body.address.city,
                    req.body.address.state,
                    req.body.address.zipCode,
                )
            };

            await ClientAdmFacadeFactory.create().add(InputDTO);
            res.status(201).json({ message: 'Client added successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
);

customerRouter.get('/:id', async (req: Request, res: Response) => {

    const InputDTO : FindClientInputDto = {
        id: req.params.id
    }

    try {
        const client = await ClientAdmFacadeFactory.create().find(InputDTO);
        res.status(200).json(client);
        
    } catch (error) {
        if (error instanceof Error && error.message === 'Client not found') {
            return res.status(404).json({ message: 'Client not found.' });
        }
        
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
    
});
