// eslint-disable-next-line @typescript-eslint/no-var-requires
const mailchimp = require('@mailchimp/mailchimp_marketing');
import config from '../config';
import { IUser } from '../interfaces/IUser';
import Logger from '../loaders/logger';
import { validateSubscriber } from '../decorators/mailchimp';

class Mailchimp {
  constructor() {
    mailchimp.setConfig({
      apiKey: config.mailchimpToken,
      server: config.mailchimpServer,
    });
  }

  // this decorator checks if user is not unsubscribed consciously
  @validateSubscriber
  public async subscribe(user: Partial<IUser> & { hash?: string }) {
    try {
      await mailchimp.lists.setListMember(config.mailchimpAudience, user.hash, {
        email_address: user.email,
        status_if_new: 'subscribed',
        merge_fields: {
          FNAME: user.name,
        },
      });
    } catch (err) {
      Logger.error(err);
    }
  }
}

export default new Mailchimp();
