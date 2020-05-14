import { Service, Inject } from 'typedi';
import Crypto from 'crypto';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';

import stringify from 'csv-stringify/lib/sync';

import fs from 'fs';
const os = require('os');
const path = require('path');
 

@Service()
export default class ExportGeneratorService {
    public constructor(
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}
            
    public async generateCsv(items:any): Promise<{filepath: String}> {
    	try {
            const data = await stringify(items, {delimiter: ';'});
            
	        const fileName = Crypto.randomBytes(6).readUIntLE(0,6).toString(36);
	        
	        const tmpFile  = await this.tempFile(fileName, '\ufeff' + data);
	        
            return { tmpFile };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
	}
            
    public tempFile (name, data) {
	                     
	    return new Promise((resolve, reject) => {
	        const tempPath = path.join(os.tmpdir(), 'tmp-');
	        fs.mkdtemp(tempPath, (err, folder) => {
	            if (err) 
	                return reject(err)

	            const file_name = path.join(folder, name);

	            fs.writeFile(file_name, data, { encoding: 'utf8' }, error_file => {
	                if (error_file) 
	                    return reject(error_file);

	                resolve(file_name)
	            })
	        })
	    });
	}         
}
