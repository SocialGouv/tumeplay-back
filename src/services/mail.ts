import { Service, Inject } from 'typedi';
import config from '../config';
import events from '../subscribers/events';
import nodemailer from 'nodemailer';
import pug from 'pug';
import striptags from 'striptags';
import fs from 'fs';

import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';

@Service()
export default class MailService {
    public constructor(
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public getLocalTemplate(localTemplate, fallbackTemplate)
    {
		if( fs.existsSync(__dirname + '/../pug/mail/'+localTemplate+'.pug') )
		{
			return localTemplate;
		}
		else
		{
			return fallbackTemplate;
		}
    }
    
    public async send(mailTo, subject, template, variables) {
        try {
            const mailerConfig = config.mailer;

            let transporter = nodemailer.createTransport({
                host: mailerConfig.host,
                port: mailerConfig.port,
                secure: mailerConfig.secure, // true for 465, false for other ports
                auth: {
                    user: mailerConfig.username,
                    pass: mailerConfig.password,
                },
            });
			
			const html = await pug.renderFile(__dirname + '/../pug/mail/'+template+'.pug', variables);
			const mailOptions = {
                from: 'contact.tumeplay@fabrique.social.gouv.fr',
                to: mailTo,
                subject: subject,
                text: striptags(html),
                html: html,
            };
			
			if( typeof variables.labelFile !== "undefined" )
			{
				mailOptions.attachments = [{
					filename: variables.labelFilename,
            		path: variables.labelFile,
				}];
			}
			
			if( typeof variables.labelFiles !== "undefined" )
			{
				mailOptions.attachments = variables.labelFiles;	
			}
            

            await transporter.sendMail(mailOptions);
        } catch (e) {
            this.logger.error('Error : ', e);
        }
    }
}
