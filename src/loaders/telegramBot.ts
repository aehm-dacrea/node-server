import TelegramBot from '../services/telegramBot';

export default (): void => {
  const bot = new TelegramBot();
  bot.echo();
  console.log('Telegram bot loaded');
};
