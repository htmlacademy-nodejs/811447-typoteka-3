'use strict';
const {Cli} = require(`./cli`);
const {getLogger} = require(`./lib/logger`);

const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode
} = require(`../constants`);

const logger = getLogger({name: `service`});
const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.SUCCESS);
}

if (userCommand === Cli[`generate`] && userArguments[1] > 1000) {
  logger.error(`Не больше 1000 объявлений`);
  process.exit(ExitCode.ERROR);
}

Cli[userCommand].run(userArguments.slice(1));
