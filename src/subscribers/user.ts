import EventEmitter from 'eventemitter3';
import events from './events';
import Logger from '../loaders/logger';
import { IUser } from '../interfaces/IUser';
import Mailchimp from '../services/mailchimp';

const EE = new EventEmitter();

EE.on(events.user.signUp, (user: Partial<IUser>) => {
  Logger.silly(`one new user subscribed! ${JSON.stringify(user)}`);
  Mailchimp.subscribe(user);
});

export { events };
export default EE;
