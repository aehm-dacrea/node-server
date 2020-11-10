// eslint-disable-next-line @typescript-eslint/no-var-requires
const mailchimp = require('@mailchimp/mailchimp_marketing');
import md5 from 'md5';
import config from '../config';
import { IUser } from '../interfaces/IUser';
import Logger from '../loaders/logger';

const validateSubscriber = (target, propertyKey, descriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args) {
    const [user]: Partial<IUser>[] & { hash: string }[] = args;
    user.hash = md5(user.email.toLowerCase());
    try {
      const result = await mailchimp.lists.getListMember(config.mailchimpAudience, user.hash);
      Logger.silly(`[Mailchimp] New user is already ${result.status}`);
      if (result.status !== ('pending' || 'unsubscribed' || 'cleaned')) {
        originalMethod.apply(this, [...args, user]);
      }
    } catch (err) {
      if (err.status === 404) {
        Logger.silly(`[Mailchimp] New user is subscribed`);
        originalMethod.apply(this, [...args, user]);
      }
      return err;
    }
  };
  return descriptor;
};

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
