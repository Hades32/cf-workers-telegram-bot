import Commands from "./commands";
import TelegramBot from "./telegram_bot";
import { TelegramUpdate } from "./types";

export default class TelegramCommands extends Commands {
  static ping = async (
    bot: TelegramBot,
    update: TelegramUpdate,
    args: string[]
  ) => bot.ping(update, args);
  static _get = async (
    bot: TelegramBot,
    update: TelegramUpdate,
    args: string[]
  ) => bot._get(update, args);
  static _set = async (
    bot: TelegramBot,
    update: TelegramUpdate,
    args: string[]
  ) => bot._set(update, args);
  static code = async (
    bot: TelegramBot,
    update: TelegramUpdate,
    _args: string[]
  ) => bot.code(update);
  static commandList = async (
    bot: TelegramBot,
    update: TelegramUpdate,
    _args: string[]
  ) => bot.commandList(update);
  static defaultCommand = async (
    bot: TelegramBot,
    update: TelegramUpdate,
    _args: string[]
  ) => bot.defaultCommand(update);
}
