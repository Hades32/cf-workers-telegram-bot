////////////////////////////////////////////////////////////////////
////           Telegram Bot using Cloudflare Worker             ////
////////////////////////////////////////////////////////////////////
////  Author: Nikhil John                                       ////
////  Repo: https://github.com/nikhiljohn10/telegram-bot-worker ////
////  License: MIT                                              ////
////                                                            ////
////  Author: Sean Behan                                        ////
////  Repo: https://github.com/codebam/cf-workers-telegram-bot  ////
////  License: Apache-2.0                                       ////
////////////////////////////////////////////////////////////////////

import {
  TelegramCommands,
  Handler,
  TelegramWebhook,
  TelegramBot,
} from '../../main/src/main';
import { Command } from '../../main/src/types';

interface Environment {
  SECRET_TELEGRAM_API_TOKEN: string;
  KV_BOT_STORAGE: KVNamespace;
}

export default {
  fetch: async (request: Request, env: Environment) =>
    new Handler([
      {
        bot_name: 'cf-workers-telegram-bot',
        api: TelegramBot,
        webhook: new TelegramWebhook(
          new URL(
            `https://api.telegram.org/bot${env.SECRET_TELEGRAM_API_TOKEN}`
          ),
          env.SECRET_TELEGRAM_API_TOKEN,
          new URL(new URL(request.url).origin)
        ),
        commands: {
          '/ping': TelegramCommands.ping as Command,
          '/start': TelegramCommands.commandList as Command,
          default: TelegramCommands.defaultCommand as Command,
        },
        kv: env.KV_BOT_STORAGE,
      },
    ]).handle(request),
};
