'use strict';
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

const {
  getRandomInt,
  shuffle,
  formatDate
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const MILLISECONDS_IN_THREE_MONTHS = 90 * 24 * 60 * 60 * 1000;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const MAX_COMMENTS = 4;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`).slice(0, -1);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (count, comments, postId) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    postId,
    text: shuffle(comments.slice(0, -1))
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generatePosts = (count, titles, categories, sentences, comments) => {

  return Array(count).fill({}).map(() => {
    const id = nanoid(MAX_ID_LENGTH);
    return {
      id,
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: shuffle(sentences).slice(0, getRandomInt(1, 5)).join(` `),
      fullText: shuffle(sentences).slice(0, getRandomInt(1, sentences.length - 1)).join(` `),
      createdDate: formatDate((new Date()) - getRandomInt(0, MILLISECONDS_IN_THREE_MONTHS)),
      category: shuffle(categories).slice(0, getRandomInt(1, 4)),
      comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments, id),
    };
  });
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const [count] = args;
    const countPost = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generatePosts(countPost, titles, categories, sentences, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Операция завершилась успешно. Файл создан.`));
    } catch (err) {
      console.error(chalk.red(`Не удалось записать данные в файл...`));
    }
  }
};
