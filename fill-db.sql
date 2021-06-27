INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar01.jpg'),
('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar02.jpg');

INSERT INTO categories(name) VALUES
('Программирование'),
('Музыка'),
('Кино'),
('Разное'),
('IT');

ALTER TABLE articles DISABLE TRIGGER ALL;

INSERT INTO articles(title, picture, announce, full_text, user_id) VALUES
('Как достигнуть успеха не вставая с кресла','forest@1x.jpg', 'Вы можете достичь всего. Стоит только немного постараться и запастись книгами', 'Как начать действовать? Для начала просто соберитесь.', 1),
('Обзор новейшего смартфона', 'skyscraper@1x.jpg', 'Этот смартфон — настоящая находка.', 'Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.', 1),
('Как начать программировать', 'see@1x.jpg', 'Программировать не настолько сложно, как об этом говорят.', 'Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.', 2);

ALTER TABLE articles ENABLE TRIGGER ALL;

ALTER TABLE article_categories DISABLE TRIGGER ALL;

INSERT INTO article_categories(article_id, category_id) VALUES
(1, 1),
(1, 5),
(2, 4),
(3, 2),
(3, 4);

ALTER TABLE article_categories ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;

INSERT INTO comments(text, user_id, article_id) VALUES
('Мне кажется или я уже читал это где-то?', 2, 1),
('Согласен с автором!', 1, 1),
('Планируете записать видосик на эту тему?', 2, 2),
('Согласен с автором!', 1, 2),
('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.', 1, 3),
('Согласен с автором!', 2, 3);

ALTER TABLE comments ENABLE TRIGGER ALL;
