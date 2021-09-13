'use strict';

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

module.exports.formatDate = (date) => {
  return new Intl.DateTimeFormat(`sv-SE`, {
    year: `numeric`,
    month: `numeric`,
    day: `numeric`,
    hour: `numeric`,
    minute: `numeric`,
    second: `numeric`,
  }).format(date);
};

module.exports.ensureArray = (value) => Array.isArray(value) ? value : [value];

module.exports.getOrderedComments = (comments, count) => {
  return comments
    .slice()
    .sort((a, b) => b[`comments.id`] - a[`comments.id`])
    .slice(0, count);
};

module.exports.getOrderedArticles = (articles, count) => {
  return articles
    .filter((post) => post.comments.length > 0)
    .sort((a, b) => b.comments.length - a.comments.length)
    .slice(0, count);
};

module.exports.truncateText = (text) => {
  const shortText = text.length < 101 ? text : `${text.slice(0, 100)}...`;
  return shortText;
};
