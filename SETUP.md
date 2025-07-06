# Настройка GitHub Pages

## Автоматическая настройка

1. **Перейдите в настройки репозитория**:

   - Откройте ваш репозиторий на GitHub
   - Перейдите в `Settings` → `Pages`

2. **Настройте источник**:

   - В разделе "Source" выберите "GitHub Actions"
   - Это активирует автоматический деплой при пуше в main/master ветку

3. **Проверьте workflow**:
   - Перейдите в `Actions` вкладку
   - Убедитесь, что workflow `Deploy to GitHub Pages` запустился
   - Дождитесь завершения деплоя

## Ручная настройка (если автоматическая не работает)

1. **Создайте ветку gh-pages**:

   ```bash
   git checkout -b gh-pages
   git push origin gh-pages
   ```

2. **Настройте GitHub Pages**:

   - Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages`
   - Folder: `/ (root)`

3. **Активируйте GitHub Pages**:
   - Нажмите "Save"
   - Дождитесь активации (может занять несколько минут)

## Проверка работы

После настройки ваш сайт будет доступен по адресу:

```
https://yourusername.github.io/testgithubpages.github.io/
```

## Структура файлов

Убедитесь, что в корне репозитория есть:

- `index.html` - главная страница
- `styles.css` - стили
- `script.js` - JavaScript
- `example.html` - пример статьи

## Устранение проблем

### Сайт не загружается

1. Проверьте, что файл `index.html` находится в корне репозитория
2. Убедитесь, что GitHub Pages активированы
3. Подождите 5-10 минут после активации

### Workflow не запускается

1. Проверьте, что файл `.github/workflows/pages.yml` существует
2. Убедитесь, что вы пушите в ветку `main` или `master`
3. Проверьте вкладку `Actions` на наличие ошибок

### Ошибки в коде

1. Проверьте консоль браузера на наличие JavaScript ошибок
2. Убедитесь, что все файлы загружаются корректно
3. Проверьте сетевые запросы в DevTools

## Полезные ссылки

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Telegram Web Apps](https://core.telegram.org/bots/webapps)
