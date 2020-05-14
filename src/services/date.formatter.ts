import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';

@Service()
export default class DateFormatterService {
    public constructor(
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}
            
    public format(dateObject) {
    	const month = String(dateObject.getMonth()).padStart(2, '0');
	    const day 	= String(dateObject.getDate()).padStart(2, '0');
	    const year  = dateObject.getFullYear();
		
		return {
			day: day,
			month: month,
			year: year,
		}
	}         
}
