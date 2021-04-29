import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import { IUser, IUserInputDTO } from '../interfaces/IUser';

@Service()
export default class AddressValidatorService {
    public constructor(
        @Inject('logger') private logger
    ) {}

    public isZipCodeAllowed(zipCode){
	    const allowedZipCodes = [
		  	'16',
		  	'17',
		  	'19',
		  	'23',
		  	'24',
		  	'33',
		  	'40',
		  	'47',
		  	'64',
		  	'75',
		    '77',
		    '78',
		  	'79',
		  	'86',
		  	'87', 
		  	'91',
		    '93',
		    '94',
		    '95',
            '97',
		];
		const firstPart = zipCode.substring(0, 2);
		return ( allowedZipCodes.indexOf(firstPart) >= 0 );
    }
}
