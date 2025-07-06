# Telegraph Mini App

Мини-приложение для Telegram, которое отображает статьи в стиле Telegraph. Адаптивный дизайн для мобильных устройств и Telegram Web App.

## Особенности

- 📱 **Адаптивный дизайн** - оптимизирован для мобильных устройств и Telegram
- 🌙 **Темная/светлая тема** - автоматическое переключение в зависимости от настроек Telegram
- 📤 **Интеграция с Telegram** - поддержка Telegram Web App API
- 🎨 **Стиль Telegraph** - чистый и современный дизайн в стиле Telegraph
- ⚡ **Быстрая загрузка** - оптимизированная производительность

## Использование

### Просмотр статьи

Откройте страницу с параметром `article` в URL:

```
https://yourdomain.github.io/?article=article-id
```

### Примеры

- Демо статья: `https://yourdomain.github.io/`
- Статья с ID: `https://yourdomain.github.io/?article=my-article`

## Структура файлов

```
├── index.html          # Основная HTML страница
├── styles.css          # CSS стили в стиле Telegraph
├── script.js           # JavaScript функциональность
└── README.md           # Документация
```

## Настройка для Telegram Bot

Для интеграции с Telegram Bot API, добавьте в вашего бота:

```javascript
// Пример кнопки для открытия статьи
const articleButton = {
  text: "Читать статью",
  web_app: {
    url: "https://yourdomain.github.io/?article=article-id",
  },
};
```

## Кастомизация

### Изменение стилей

Отредактируйте переменные CSS в `styles.css`:

```css
:root {
  --primary-color: #0088cc; /* Основной цвет */
  --text-color: #333; /* Цвет текста */
  --background-color: #ffffff; /* Цвет фона */
}
```

### Добавление новых статей

1. Создайте API endpoint для загрузки статей
2. Обновите функцию `fetchArticle()` в `script.js`
3. Передавайте ID статьи через URL параметр

## Поддерживаемые браузеры

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Лицензия

MIT License
