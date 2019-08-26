import sgMail from '@sendgrid/mail';
import { MailData } from '@sendgrid/helpers/classes/mail';
import fs from 'fs';
import { ClientResponse } from '@sendgrid/client/src/response';
import log from '../helpers/WinstonLogger.class';

export interface MailerClassInterface {
  defaults: MailData;
  send(): Promise<[ClientResponse, {}]>;
  attachments(path: string, name: string): Promise<void>;
}

export interface MailOptions {
  to: string;
  from: string;
  subject: string;
  text: string;
}

export default class MailerClass implements MailerClassInterface {
  public readonly defaults: MailData;

  public constructor(config: MailOptions) {
    sgMail.setApiKey('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');
    this.defaults = Object.assign({
      to: config.to,
      from: config.from,
      subject: config.subject,
      text: config.text,
    });
  }

  public async attachments(path: string, name: string): Promise<void> {
    const file = await fs.readFileSync(`${path}/${name}`);
    const fileBase64 = await Buffer.from(file).toString('base64');
    this.defaults.attachments = [{
      content: fileBase64,
      filename: name,
      contentId: name,
    }];
  }

  public async send(): Promise<[ClientResponse, {}]> {
    log.info('Email SENT!');
    return sgMail.send(this.defaults);
  }
}
