import Message from '../models/message';
import User from '../models/user';
import TelegramBot from 'node-telegram-bot-api';
import config from '../config';

export default class TelegramBotService {
  bot: TelegramBot;
  constructor() {
    this.bot = new TelegramBot(config.telegramToken, { polling: true });
  }
  echo(): void {
    this.bot.onText(/\/echo (.+)/, (msg, match) => {
      const chatId = msg.chat.id;
      const resp = match[1];

      const user = new User({
        name: 'Artiom',
        email: 'duca.artiom@gmail.com',
        password: 'test_password',
      });
      // user.save();
      // User.findOne({ name: 'Artiom' }, (e, item) => {
      //   console.log(item);
      // });
      const message = new Message({
        user: user,
        content: resp,
      });
      this.bot.sendMessage(chatId, message.toString());
    });
  }
}
