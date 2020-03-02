import md5 from 'md5';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import { Container } from 'typedi';
import PoiService from './poi';
import Config from '../config';

import stringify from 'csv-stringify/lib/sync';
import fs from 'fs';

@Service()
export default class ColissimoService {
    public constructor(
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    private buildLabelParams(targetFilename, firstName, lastName, orderEmail, shippingAddress)
    {
	    let params = [{
		    Reference : targetFilename,
		    Empty1: '',
		    CompanyName: '',
		    Desk: '',
		    firstName: firstName,
		    lastName: lastName,
		    floor: '',
		    building: '',
		    streetName: shippingAddress.street.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('-', ' ').toUpperCase(),
		    citySurname: '',
		    zipCode: shippingAddress.zipCode,
		    city: shippingAddress.city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('-', ' ').toUpperCase(),
		    countryCode: 'FR',
		    phoneNumber: '',
		    phoneNumber2: shippingAddress.phoneNumber,
		    email: orderEmail,
		    doorCode1: '',
		    doorCode2: '',
		    doorCode3: '',
		    specialInstructions: '',
		    sellerName: '',
	    }];
	    
	    return params;
    }
    
    async createLabel(targetFilename, firstName, lastName, orderEmail, shippingAddress)
    {
        const params = this.buildLabelParams(targetFilename, firstName, lastName, orderEmail, shippingAddress);

    	const targetFolder = 'uploads/labels';
    	
    	if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder);
        }
                
    	const targetPath =  targetFolder + '/' + targetFilename + '.csv';

        try
        {
	        const data = await stringify(params, {delimiter: ';'});
	        
	        fs.writeFile(targetPath, '\ufeff' + data, { encoding: 'utf8' }, (err) => {
			  if (err) {
				targetPath = false;
			    throw err;
			  }
			})
        
		}
		catch(e)
		{
			console.log(e);
		}
		
        return targetPath;
    }}
