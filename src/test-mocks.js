'use strict';

module.exports.mockUsers = [
  {
    firstName: `Иван`,
    lastName: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: `12345`,
    avatar: `avatar-1.jpg`
  },
  {
    firstName: `Пётр`,
    lastName: `Петров`,
    email: `petrov@example.com`,
    passwordHash: `12345`,
    avatar: `avatar-2.jpg`
  }
];

module.exports.mockCategories = [
  `IT`,
  `Кино`,
  `Музыка`
];

module.exports.mockArticles = [
  {
    "userId": 1,
    "picture": `forest`,
    "title": `Ёлки. История деревьев`,
    "announce": `Это один из лучших рок-музыкантов.`,
    "fullText": `Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Как начать действовать? Для начала просто соберитесь. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "categories": [1, 2],
    "comments": [
      {"text": `Согласен с автором!`, "userId": 1},
      {"text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты?`, "userId": 1},
      {"text": `Хочу такую же футболку :-) Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то?`, "userId": 2},
      {"text": `Совсем немного... Согласен с автором!`, "userId": 1}
    ]
  },
  {
    "userId": 1,
    "picture": `forest`,
    "title": `Как перестать беспокоиться и начать жить`,
    "announce": `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "fullText": `Это один из лучших рок-музыкантов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Простые ежедневные упражнения помогут достичь успеха. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно, как об этом говорят. Из под его пера вышло 8 платиновых альбомов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Собрать камни бесконечности легко, если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Он написал больше 30 хитов. Освоить вёрстку несложно. Возьмите новую книгу и закрепите все упражнения на практике. Ёлки — это не просто красивое дерево. Это прочная древесина. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "categories": [1, 2, 3, 4],
    "comments": [
      {"text": `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного...`, "userId": 1},
      {"text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Это где ж такие красоты?`, "userId": 2},
      {"text": `Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`, "userId": 1}
    ]
  },
  {
    "userId": 2,
    "picture": `sea`,
    "title": `Ёлки. История деревьев`,
    "announce": `Первая большая ёлка была установлена только в 1938 году.`,
    "fullText": `Программировать не настолько сложно, как об этом говорят. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Как начать действовать? Для начала просто соберитесь. Он написал больше 30 хитов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Это один из лучших рок-музыкантов. Достичь успеха помогут ежедневные повторения. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "categories": [1, 2, 3],
    "comments": [
      {"text": `Плюсую, но слишком много буквы! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`, "userId": 1},
      {"text": `Согласен с автором! Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`, "userId": 1}
    ]
  },
  {
    "userId": 1,
    "picture": `forest`,
    "title": `Лучшие рок-музыканты 20-го века`,
    "announce": `Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году.`,
    "fullText": `Он написал больше 30 хитов. Как начать действовать? Для начала просто соберитесь. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Собрать камни бесконечности легко, если вы прирожденный герой. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Освоить вёрстку несложно. Возьмите новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Простые ежедневные упражнения помогут достичь успеха. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения. Это один из лучших рок-музыкантов.`,
    "categories": [1, 2],
    "comments": [
      {"text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы!`, "userId": 2},
      {"text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`, "userId": 1},
      {"text": `Хочу такую же футболку :-)`, "userId": 2}
    ]
  },
  {
    "userId": 2,
    "picture": `skyscraper`,
    "title": `Как достигнуть успеха не вставая с кресла`,
    "announce": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Простые ежедневные упражнения помогут достичь успеха. Программировать не настолько сложно, как об этом говорят.`,
    "categories": [3],
    "comments": [
      {"text": `Хочу такую же футболку :-) Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`, "userId": 1},
      {"text": `Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы!`, "userId": 1},
      {"text": `Хочу такую же футболку :-)`, "userId": 1},
      {"text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`, "userId": 2}
    ]
  }
];
