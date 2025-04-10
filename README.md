# Проект на Node.js та Express.js & Auth(v1.2)

- Цей проект представляє собою сервер, який реалізує функціональність реєстрації, входу та захищених маршрутів з використанням Passport.js. Сервер дозволяє користувачам реєструватися, входити в акаунт, зберігати дані в базі MongoDB Atlas і використовувати захищені маршрути.

---

## Технології

- Node.js

- Express.js

- Passport.js (для авторизації)

- MongoDB Atlas (для зберігання даних)

- Mongoose (для роботи з MongoDB)

- EJS (шаблони для відображення даних на сторінці)

## Інструкція з встановлення та запуску

1. Клонуйте репозиторій:

   ```bash
   git clone <url-репозиторію>
   cd <каталог-проекту>
   ```

2. Встановіть залежності

   ```bash
   npm install
   npm install express express-session passport passport-local bcryptjs dotenv ejs connect-flash
   ```

3. Опис маршрутів

- 1.1 /register - Сторінка реєстрації
  Метод: GET

- Опис: Відображає форму для реєстрації нового користувача.

---

- 2.1 /register - Обробка реєстрації
  Метод: POST

- Опис: Приймає дані користувача, хешує пароль та зберігає його в базі MongoDB.

---

- 3.1 /login - Сторінка входу
  Метод: GET

- Опис: Відображає форму для входу в акаунт.

  ***

- 4.1 /login - Обробка входу
  Метод: POST

- Опис: Приймає дані для входу, перевіряє їх за допомогою Passport.js та редиректить на захищену сторінку при успішному вході.

  ***

- 5.1 /logout - Вихід з акаунту
  Метод: GET

- Опис: Виходить з акаунту та редиректить на сторінку входу.

  ***

- 6.1 /protected - Захищена сторінка
  Метод: GET

- Опис: Відображає захищену сторінку, доступну тільки для авторизованих користувачів. Також після входу на цю сторінку можна змінювати тему з білої на чорну і наоборт.

---

- 7.1 /data - Відображення даних з MongoDB
  Метод: GET

- Опис: Запитує дані з колекції в MongoDB та відображає їх на сторінці.

  ## Нові функціональності:

- Створення даних
  POST /data/add-one — додає один документ.
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
  ```

---

- POST /data/add-many — додає кілька документів.

```json
[
  { "name": "Alice", "email": "alice@example.com" },
  { "name": "Bob", "email": "bob@example.com" }
]
```

---

- Оновлення даних
  PUT /data/update-one/:id — оновлює один документ.

  ```json
  { "name": "John Smith" }
  ```

---

- PUT /data/update-many — оновлює кілька документів.

```json
{
  "filter": { "role": "user" },
  "update": { "role": "moderator" }
}
```

---

- **PUT /data/replace-one/:id** — замінює один документ за ID.

json
{
"firstName": "Jane",
"lastName": "Doe",
"email": "jane.doe@example.com",
"role": "admin",
"password": "newpassword"
}

---

- Замінює повністю об'єкт користувача за вказаним ID.

- PUT /data/replace-one/:id

---

#### Примітка:

- filter визначає, які документи будуть оновлені.
- update містить поля, які потрібно змінити.

---

- PUT /data/replace-one/:id — замінює один документ.

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "role": "admin",
  "password": "newpassword"
}
```

---

- Видалення одного користувача
  DELETE /data/delete-one/:id — видаляє один документ за його id.

---

- Видалення кількох користувачів
  DELETE /data/delete-many — видаляє кілька документів за критерієм.
  Формат тіла запиту:

```json
{
  "role": "user"
}
```

---

#### 📌 Примітка:

Можна використовувати будь-яке поле для фільтрації, наприклад:

```json
{
  "email": "test@example.com"
}
```

---

- Покращене читання даних

- GET /data — отримує всі документи.
- GET /data?fields=name,email — отримує тільки name і email.

---

#### Нові маршрути статистики

- Отримання користувачів за допомогою курсора
  GET /stats/users-cursor
- Опис: Отримує всіх користувачів з бази даних через cursor(), що дозволяє ефективно обробляти великі обсяги даних.

---

- Обчислення середнього віку користувачів
  GET /stats/users-stats
- Опис: Використовує агрегацію MongoDB для підрахунку середнього віку всіх користувачів у базі.

Відповідь (якщо є користувачі з age):

```json
{ "averageAge": 25.6 }
```

Відповідь (якщо немає користувачів з age):

```json
{ "averageAge": 0 }
```

---

### Валідація вхідних даних

Під час створення або оновлення користувачів виконується автоматична перевірка на коректність введених даних.

#### Приклад некоректного запиту:

```json
{
  "name": "Jo",
  "email": "wrongemail",
  "password": "123"
}
```

- {
  "error": "\"name\" length must be at least 3 characters long"
  }

---

#### Приклад правильного запиту:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword"
}
```
