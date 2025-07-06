// Инициализация Telegram Web App
let tg = null;

// Попытка инициализации Telegram Web App
try {
  tg = window.Telegram?.WebApp;
  if (tg) {
    console.log("Telegram Web App найден");
    tg.ready();
    tg.expand();
  } else {
    console.log("Telegram Web App не найден, работаем в обычном браузере");
  }
} catch (error) {
  console.log("Telegram Web App не доступен:", error);
}

// Состояние приложения
const appState = {
  theme: localStorage.getItem("theme") || "light",
  currentArticle: null,
};

// DOM элементы (будет инициализировано после загрузки DOM)
let elements = {};

// Базовые функции
function showNotification(message, type = "info") {
  try {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Создаем контейнер для уведомлений если его нет
    let container = document.getElementById("notifications");
    if (!container) {
      container = document.createElement("div");
      container.id = "notifications";
      container.className = "notifications";
      document.body.appendChild(container);
    }

    container.appendChild(notification);

    // Автоматическое удаление через 3 секунды
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  } catch (error) {
    console.error("Ошибка при показе уведомления:", error);
  }
}

function showError(message) {
  console.error("Ошибка:", message);
  // Показываем уведомление только если это не критическая ошибка
  try {
    showNotification(message, "error");
  } catch (error) {
    console.error("Не удалось показать уведомление об ошибке:", error);
  }
}

// Инициализация DOM элементов
function initElements() {
  elements = {
    articleTitle: document.getElementById("article-title"),
    articleAuthor: document.getElementById("article-author"),
    articleDate: document.getElementById("article-date"),
    articleContent: document.getElementById("article-content"),
    themeToggle: document.getElementById("theme-toggle"),
    greeting: document.getElementById("greeting"),
  };
  console.log("DOM элементы инициализированы:", elements);
  console.log("Элемент greeting найден:", !!elements.greeting);
  console.log("Элемент greeting:", elements.greeting);

  // Дополнительная проверка кнопки темы
  if (elements.themeToggle) {
    console.log("Кнопка темы найдена и инициализирована");
    console.log("Кнопка темы:", elements.themeToggle);
    console.log(
      "Кнопка темы кликабельна:",
      elements.themeToggle.style.pointerEvents !== "none"
    );
    console.log(
      "Кнопка темы видима:",
      elements.themeToggle.offsetParent !== null
    );
  } else {
    console.error("Кнопка темы НЕ найдена!");
  }
}

// Проверка существования элементов
function validateElements() {
  console.log("Проверка элементов DOM...");
  const requiredElements = [
    "articleTitle",
    "articleAuthor",
    "articleDate",
    "articleContent",
  ];
  const missingElements = requiredElements.filter((id) => !elements[id]);

  if (missingElements.length > 0) {
    console.warn("Отсутствуют элементы:", missingElements);
    return false;
  }

  console.log("Все необходимые элементы найдены");
  return true;
}

// Инициализация приложения
function initApp() {
  console.log("Начало инициализации приложения...");

  try {
    // Инициализируем DOM элементы
    initElements();

    // Проверяем существование элементов
    if (!validateElements()) {
      console.error(
        "Не удалось инициализировать приложение: отсутствуют необходимые элементы"
      );
      return;
    }

    console.log("Установка темы...");
    // Установка темы
    setTheme(appState.theme);

    console.log("Настройка обработчиков событий...");
    // Обработчики событий
    setupEventListeners();

    console.log("Отображение приветствия...");
    // Отображение приветствия (ПЕРЕД загрузкой статьи)
    showGreeting();

    console.log("Загрузка статьи...");
    // Загрузка статьи из URL параметров
    loadArticleFromURL();

    console.log("Обновление метаданных Telegram...");
    // Обновление метаданных для Telegram
    updateTelegramMeta();

    console.log("Настройка защиты от копирования...");
    // Настройка защиты от копирования
    setupCopyProtection();

    console.log("Настройка улучшений для чтения...");
    // Настройка улучшений для чтения
    setupReadingEnhancements();

    console.log("Приложение успешно инициализировано");
  } catch (error) {
    console.error("Ошибка при инициализации приложения:", error);
    showError("Произошла ошибка при загрузке приложения");
  }
}

// Настройка обработчиков событий
function setupEventListeners() {
  try {
    console.log("Настройка обработчиков событий...");

    // Переключение темы
    if (elements.themeToggle) {
      console.log("Кнопка темы найдена:", elements.themeToggle);

      // Удаляем старый обработчик если есть
      elements.themeToggle.removeEventListener("click", toggleTheme);

      // Добавляем новый обработчик
      elements.themeToggle.addEventListener("click", (e) => {
        console.log("Клик по кнопке темы");
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      });

      // Добавляем обработчик для клавиатуры
      elements.themeToggle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          console.log("Нажатие клавиши на кнопке темы");
          e.preventDefault();
          toggleTheme();
        }
      });

      console.log("Обработчики для кнопки темы установлены");
    } else {
      console.error("Кнопка темы не найдена!");
    }

    // Обработка клавиатурных сокращений
    document.addEventListener("keydown", handleKeyboardShortcuts);

    // Защита от контекстного меню
    document.addEventListener("contextmenu", preventContextMenu);

    // Защита от выделения текста (НО НЕ ДЛЯ КНОПОК)
    document.addEventListener("selectstart", (e) => {
      // Разрешаем выделение для кнопок и интерактивных элементов
      if (
        e.target.closest(".nav-btn") ||
        e.target.closest("button") ||
        e.target.closest("input")
      ) {
        return true;
      }
      preventSelection(e);
    });

    document.addEventListener("mousedown", (e) => {
      // Разрешаем выделение для кнопок и интерактивных элементов
      if (
        e.target.closest(".nav-btn") ||
        e.target.closest("button") ||
        e.target.closest("input")
      ) {
        return true;
      }
      preventSelection(e);
    });

    // Защита от перетаскивания
    document.addEventListener("dragstart", preventDrag);

    // Защита от копирования
    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("paste", preventPaste);

    console.log("Все обработчики событий настроены");
  } catch (error) {
    console.error("Ошибка при настройке обработчиков событий:", error);
  }
}

// Защита от копирования
function setupCopyProtection() {
  // Отключаем выделение для всего документа
  document.body.style.webkitUserSelect = "none";
  document.body.style.mozUserSelect = "none";
  document.body.style.msUserSelect = "none";
  document.body.style.userSelect = "none";

  // Отключаем контекстное меню
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    return false;
  });

  // Отключаем выделение текста
  document.addEventListener("selectstart", (e) => {
    e.preventDefault();
    return false;
  });

  // Отключаем перетаскивание
  document.addEventListener("dragstart", (e) => {
    e.preventDefault();
    return false;
  });

  // Отключаем копирование
  document.addEventListener("copy", (e) => {
    e.preventDefault();
    showNotification("Копирование отключено", "warning");
    return false;
  });

  // Отключаем вставку
  document.addEventListener("paste", (e) => {
    e.preventDefault();
    return false;
  });

  // Отключаем вырезание
  document.addEventListener("cut", (e) => {
    e.preventDefault();
    return false;
  });

  // Дополнительная защита от выделения
  document.addEventListener("mousedown", (e) => {
    // Разрешаем выделение только для кнопок
    if (!e.target.closest(".nav-btn")) {
      e.preventDefault();
      return false;
    }
  });
}

// Улучшения для чтения
function setupReadingEnhancements() {
  // Автоматическая прокрутка для удобства чтения
  let scrollTimeout;

  document.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Плавная прокрутка при остановке
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 100) {
        // Показываем кнопку "наверх" если нужно
        showScrollToTop();
      } else {
        hideScrollToTop();
      }
    }, 150);
  });

  // Оптимизация для чтения на мобильных устройствах
  if (window.innerWidth <= 768) {
    // Увеличиваем размер шрифта для лучшего чтения
    document.body.style.fontSize = "16px";

    // Добавляем больше отступов между абзацами
    const paragraphs = document.querySelectorAll(".article-content p");
    paragraphs.forEach((p) => {
      p.style.marginBottom = "1.2em";
    });
  }
}

// Предотвращение контекстного меню
function preventContextMenu(e) {
  e.preventDefault();
  return false;
}

// Предотвращение выделения
function preventSelection(e) {
  // Разрешаем выделение только для кнопок
  if (!e.target.closest(".nav-btn")) {
    e.preventDefault();
    return false;
  }
}

// Предотвращение перетаскивания
function preventDrag(e) {
  e.preventDefault();
  return false;
}

// Предотвращение копирования
function preventCopy(e) {
  e.preventDefault();
  showNotification("Копирование отключено", "warning");
  return false;
}

// Предотвращение вставки
function preventPaste(e) {
  e.preventDefault();
  return false;
}

// Показать кнопку "наверх"
function showScrollToTop() {
  let scrollBtn = document.getElementById("scroll-to-top");
  if (!scrollBtn) {
    scrollBtn = document.createElement("button");
    scrollBtn.id = "scroll-to-top";
    scrollBtn.className = "scroll-to-top";
    scrollBtn.innerHTML = "↑";
    scrollBtn.title = "Наверх";
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
    document.body.appendChild(scrollBtn);
  }
  scrollBtn.style.display = "block";
}

// Скрыть кнопку "наверх"
function hideScrollToTop() {
  const scrollBtn = document.getElementById("scroll-to-top");
  if (scrollBtn) {
    scrollBtn.style.display = "none";
  }
}

// Загрузка статьи из URL параметров
function loadArticleFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("article");

  if (articleId) {
    loadArticle(articleId);
  } else {
    // Демо статья если нет ID
    loadDemoArticle();
  }
}

// Загрузка статьи по ID
async function loadArticle(articleId) {
  try {
    // Здесь должна быть логика загрузки статьи с сервера
    // Пока используем демо данные
    const article = await fetchArticle(articleId);
    displayArticle(article);
  } catch (error) {
    console.error("Ошибка загрузки статьи:", error);
    showError("Не удалось загрузить статью");
  }
}

// Имитация загрузки статьи с сервера
async function fetchArticle(articleId) {
  // В реальном приложении здесь будет API запрос
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: articleId,
        title: `Статья ${articleId}`,
        author: "Автор статьи",
        date: new Date().toLocaleDateString("ru-RU"),
        content: generateDemoContent(articleId),
      });
    }, 500);
  });
}

// Генерация демо контента
function generateDemoContent(articleId) {
  return `
        <h2>Введение</h2>
        <p>Это демонстрационная статья с ID: <strong>${articleId}</strong>. Здесь вы можете увидеть, как выглядит контент в стиле Telegraph.</p>

        <h2>Основная часть</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

        <blockquote>
            <p>Это цитата, которая выделяется из основного текста и привлекает внимание читателя.</p>
        </blockquote>

        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

        <h3>Подзаголовок</h3>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>

        <ul>
            <li>Первый пункт списка</li>
            <li>Второй пункт списка</li>
            <li>Третий пункт списка</li>
        </ul>

        <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>

        <h2>Заключение</h2>
        <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
    `;
}

// Загрузка демо статьи
function loadDemoArticle() {
  const demoArticle = {
    id: "demo",
    title: "Демонстрационная статья в стиле Telegraph",
    author: "Демо Автор",
    date: new Date().toLocaleDateString("ru-RU"),
    content: generateDemoContent("demo"),
  };

  displayArticle(demoArticle);
}

// Отображение статьи
function displayArticle(article) {
  try {
    appState.currentArticle = article;

    // Обновление заголовка страницы
    document.title = article.title;

    // Обновление элементов (с проверкой существования)
    if (elements.articleTitle)
      elements.articleTitle.textContent = article.title;
    if (elements.articleAuthor)
      elements.articleAuthor.textContent = article.author;
    if (elements.articleDate) elements.articleDate.textContent = article.date;
    if (elements.articleContent)
      elements.articleContent.innerHTML = article.content;

    // Обновление метаданных для Telegram
    updateTelegramMeta();

    // Прокрутка в начало
    window.scrollTo(0, 0);

    // Применяем защиту к новому контенту
    setupCopyProtection();

    // НЕ показываем приветствие здесь, чтобы оно не перезаписывалось
  } catch (error) {
    console.error("Ошибка при отображении статьи:", error);
    showError("Не удалось отобразить статью");
  }
}

// Переключение темы
function toggleTheme() {
  try {
    console.log("Переключение темы...");
    console.log("Текущая тема:", appState.theme);

    const newTheme = appState.theme === "light" ? "dark" : "light";
    console.log("Новая тема:", newTheme);

    setTheme(newTheme);

    // Показываем уведомление о переключении
    showNotification(
      `Тема изменена на ${newTheme === "dark" ? "темную" : "светлую"}`,
      "success"
    );

    console.log("Тема успешно переключена");
  } catch (error) {
    console.error("Ошибка при переключении темы:", error);
    showError("Не удалось переключить тему");
  }
}

// Установка темы
function setTheme(theme) {
  try {
    appState.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Обновление иконки (с проверкой существования)
    if (elements.themeToggle) {
      const icon = elements.themeToggle.querySelector(".icon");
      if (icon) {
        icon.textContent = theme === "light" ? "🌙" : "☀️";
      }
    }

    // Обновление Telegram Web App
    if (tg) {
      tg.setHeaderColor(theme === "dark" ? "#1a1a1a" : "#ffffff");
      tg.setBackgroundColor(theme === "dark" ? "#1a1a1a" : "#ffffff");
    }
  } catch (error) {
    console.error("Ошибка при установке темы:", error);
  }
}

// Обработка клавиатурных сокращений
function handleKeyboardShortcuts(event) {
  // Ctrl/Cmd + K - переключение темы
  if ((event.ctrlKey || event.metaKey) && event.key === "k") {
    event.preventDefault();
    toggleTheme();
  }

  // Блокируем Ctrl+C, Ctrl+X, Ctrl+A
  if (
    (event.ctrlKey || event.metaKey) &&
    (event.key === "c" || event.key === "x" || event.key === "a")
  ) {
    event.preventDefault();
    showNotification("Копирование отключено", "warning");
    return false;
  }
}

// Обновление метаданных для Telegram
function updateTelegramMeta() {
  try {
    if (tg && appState.currentArticle) {
      tg.setHeaderColor(appState.theme === "dark" ? "#1a1a1a" : "#ffffff");
      tg.setBackgroundColor(appState.theme === "dark" ? "#1a1a1a" : "#ffffff");
    }
  } catch (error) {
    console.error("Ошибка при обновлении метаданных Telegram:", error);
  }
}

// Обработка изменения размера окна
window.addEventListener("resize", () => {
  if (tg) {
    tg.expand();
  }
});

// Обработка видимости страницы
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && tg) {
    tg.expand();
  }
});

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM загружен, инициализация приложения...");

  // Небольшая задержка для гарантии полной загрузки
  setTimeout(() => {
    initApp();
  }, 100);
});

// Обработка ошибок
window.addEventListener("error", (event) => {
  console.error("Глобальная ошибка приложения:", event.error);
  // Не показываем уведомление об ошибке, чтобы избежать рекурсии
  console.error(
    "Ошибка:",
    event.message,
    "в файле:",
    event.filename,
    "строка:",
    event.lineno
  );
});

// Обработка необработанных промисов
window.addEventListener("unhandledrejection", (event) => {
  console.error("Необработанная ошибка промиса:", event.reason);
  // Не показываем уведомление об ошибке, чтобы избежать рекурсии
});

// Экспорт функций для использования в консоли разработчика
window.TelegraphApp = {
  loadArticle,
  toggleTheme,
  showNotification,
  showGreeting,
  setTheme,
  initApp,
  // Тестовые функции для отладки
  testThemeButton: () => {
    console.log("Тестирование кнопки темы...");
    if (elements.themeToggle) {
      console.log("Кнопка найдена, симулируем клик");
      elements.themeToggle.click();
    } else {
      console.error("Кнопка темы не найдена!");
    }
  },
  getElements: () => elements,
  getAppState: () => appState,
};

// Показать приветствие с именем пользователя
function showGreeting() {
  try {
    console.log("Показ приветствия...");
    console.log("Элемент greeting:", elements.greeting);

    let userName = "Анонимус";

    // Получаем имя пользователя из Telegram Web App
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const user = tg.initDataUnsafe.user;
      console.log("Данные пользователя из Telegram:", user);
      if (user.first_name) {
        userName = user.first_name;
        if (user.last_name) {
          userName += " " + user.last_name;
        }
      }
    } else {
      console.log("Telegram Web App недоступен, используем Анонимус");
    }

    console.log("Имя пользователя:", userName);

    // Отображаем приветствие
    if (elements.greeting) {
      const greetingText = `
                Привет, <span class="user-name">${userName}</span>! 👋<br>
                Рады видеть вас в нашем приложении для чтения статей.
            `;
      console.log("Устанавливаем приветствие:", greetingText);
      elements.greeting.innerHTML = greetingText;
    } else {
      console.error("Элемент greeting не найден!");
    }
  } catch (error) {
    console.error("Ошибка при отображении приветствия:", error);
  }
}
