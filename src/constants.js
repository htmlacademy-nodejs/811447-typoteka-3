'use strict';

const DEFAULT_COMMAND = `--help`;

const USER_ARGV_INDEX = 2;
const MAX_ID_LENGTH = 6;

const ARTICLES_PER_PAGE = 8;
const ARTICLES_COUNT = 4;
const COMMENTS_COUNT = 4;

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MAX_ID_LENGTH,
  ARTICLES_PER_PAGE,
  ARTICLES_COUNT,
  COMMENTS_COUNT,
  ExitCode,
  HttpCode,
  HttpMethod,
  Env
};
