import Handler from './handler';
import {
  preTagString,
  prettyJSON,
  addSearchParams,
  responseToJSON,
} from './libs';
import TelegramApi from './telegram_api';
import {
  Joke,
  Bored,
  TelegramInlineQueryResultArticle,
  TelegramInlineQueryResultPhoto,
  TelegramUpdate,
  Config,
  DDGQueryResponse,
  Webhook,
  Commands,
} from './types';

export default class TelegramBot extends TelegramApi {
  kv: KVNamespace;
  url: URL;

  constructor(config: Config) {
    super(
      config.commands as Commands,
      config.webhook as Webhook,
      config.handler as Handler
    );
    this.kv = config.kv as KVNamespace;
    this.url = config.url;
  }

  // bot command: /code
  code = async (update: TelegramUpdate): Promise<Response> =>
    ((url) =>
      (update.inline_query &&
        this.answerInlineQuery(update.inline_query.id, [
          new TelegramInlineQueryResultArticle(url),
        ])) ??
      this.sendMessage(update.message?.chat.id ?? 0, url))(
      'https://github.com/codebam/cf-workers-telegram-bot'
    );

  // bot command: /get
  _get = async (update: TelegramUpdate, args: string[]): Promise<Response> =>
    this.kv.get &&
    ((key) =>
      this.kv
        .get(key)
        .then(
          (value) =>
            (update.inline_query &&
              this.answerInlineQuery(
                update.inline_query.id,
                [new TelegramInlineQueryResultArticle(value ?? '')],
                0
              )) ??
            this.sendMessage(update.message?.chat.id ?? 0, value ?? '')
        ))(args[1]);

  // bot command: /set
  _set = async (update: TelegramUpdate, args: string[]): Promise<Response> => {
    const key = args[1];
    const value = args.slice(2).join(' ');
    const message = `set ${key} to ${value}`;
    this.kv.put(key, value).then((response) => {
      if (update.inline_query) {
        return this.answerInlineQuery(
          update.inline_query.id,
          [new TelegramInlineQueryResultArticle(message)],
          0
        );
      }
      return this.sendMessage(update.message?.chat.id ?? 0, message);
    });
    return new Response();
  };

  _average = (numbers: number[]): number =>
    parseFloat(
      (
        numbers.reduce((prev, cur) => prev + cur, 0) / numbers.length || 0
      ).toFixed(2)
    );

  // bot command: /commandList
  commandList = async (update: TelegramUpdate): Promise<Response> =>
    this.sendMessage(
      update.message?.chat.id ?? 0,
      `<pre>${JSON.stringify(Object.keys(this.commands))}</pre>`,
      'HTML'
    );

  // bot command: /commandList
  defaultCommand = async (update: TelegramUpdate): Promise<Response> =>
    this.sendMessage(
      update.message?.chat.id ?? 0,
      `<pre>${JSON.stringify(Object.keys(this.commands))}</pre>`,
      'HTML'
    );

  // bot command: /toss
  toss = async (update: TelegramUpdate): Promise<Response> =>
    this.sendMessage(
      update.message?.chat.id ?? 0,
      Math.floor(Math.random() * 2) == 0 ? 'heads' : 'tails'
    );

  // bot command: /ping
  ping = async (update: TelegramUpdate, args: string[]): Promise<Response> =>
    this.sendMessage(
      update.message?.chat.id ?? 0,
      args.length === 1 ? 'pong' : args.slice(1).join(' ')
    );

  // bot command: /chatInfo
  getChatInfo = async (update: TelegramUpdate): Promise<Response> =>
    this.sendMessage(
      update.message?.chat.id ?? 0,
      preTagString(prettyJSON(update.message?.chat ?? 0)),
      'HTML'
    );
}
