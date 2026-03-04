## script.js — обзор структуры

- **Импорты**
  - `stickySidebar` — фиксация сайдбаров.
  - `bodyLock`, `bodyLockToggle`, `bodyUnlock`, `debounce`, `getDigFromString`, `getRandomString`, `isMobile` — общие утилиты из `functions.js`.
  - `mhzModules` — реестр модулей (в т.ч. `popup`) из `modules.js`.
  - `PincodeInput` — пин-код ввод.
  - `formValidate` — валидация форм.
  - `Inputmask` — маски ввода.
  - `Toastify` (+ css) — всплывающие уведомления.

- **Глобальные слушатели**
  - `DOMContentLoaded`:
    - Инициализация поиска в шапке: `headerSearchActions`.
    - Инициализация каталога в шапке: `headerCatalogActions`.
    - Инициализация пин-кода: `pininputsInit`.
    - Выравнивание высот блоков: `setMaxHeight`.
    - Инициализация полной корзины: `mhzFullCartActions`, `checkCartClearBtnVisible`.
    - Инициализация сравнения товаров: `new MhzComparsion`.
    - Установка состояний кнопок товаров: `setProductsButtons`.
    - Запрет сохранения картинок правым кликом: `disablecontext`.
  - `click` (делегирование по документу):
    - Триггер открытия/закрытия каталога в шапке и фильтров.
    - Навигация по верхнему меню: `onTopHeaderLinkClick`, сброс `_active`.
    - Закрытие каталога при клике вне: `checkCatalog`.
    - Кнопки избранного / сравнения: `favComparsionBtnAction`.
    - Кнопки «в корзину»: `onAddToBasketClick`.
    - Очистка отмеченных товаров в корзине: `delCheckedFromCart`.
  - `formSent`:
    - Обработка ответов авторизационных форм: `authActions` → `onPhoneAuthSubmit`, `onPhonePinSubmit`, `onRegisterSubmit`, `onEmailAuthSubmit`, `onRestorePassSubmit`.
  - `watcherCallback`:
    - Показ / скрытие фиксированного блока корзины при скролле.
  - `change`:
    - Изменение доп. услуг в корзине: `onBasketServicesChange`.
    - Обновление корзины: `onBasketChange` (из внешнего кода).
  - `load`:
    - Фиксация блока фильтров: `setFiltersPosition`.
    - Фиксация сайдбара карточки товара: `stickySidebar` для `.sidebar-productfull`.
  - `scroll`:
    - Обновление CSS-переменной `--scrollY`.
  - `resize`:
    - Пересчёт максимальной высоты элементов: `setMaxHeight`.

- **Утилитарные функции**
  - `headerSearchActions` — управление дропдауном поиска в шапке.
  - `headerCatalogActions` — поведение хедера-каталога по hover/click, работа в мобильной версии.
  - `onTopHeaderLinkClick` — переход к подменю и дублирование выбранного пункта в дропдауне.
  - `checkCatalog` — закрытие каталога при клике вне.
  - `setMaxHeight` / `setMinHeight` — выставление CSS-переменных высоты по максимальному / минимальному значению среди элементов.
  - `pininputsInit`, `onPinInputInput` — инициализация и запись значения пин-кода в скрытое поле формы.
  - `setFiltersPosition` — sticky фильтры каталога.
  - `disablecontext` — блокировка контекстного меню на изображениях.

- **Логика корзины**
  - `window.mhzFullCartActions` — управление чекбоксами «выбрать всё» и отдельные позиции.
  - `window.checkCartClearBtnVisible` — показ/скрытие кнопки «удалить выбранные».
  - `delCheckedFromCart` — клик по скрытым кнопкам удаления битриксовой корзины + обработка `BX.onAjaxSuccess`.
  - `onBasketServicesChange` — AJAX-отправка формы с доп. услугами, лоадер через `bodyLock`/`_pen`.

- **Избранное / сравнение / добавление в корзину**
  - `favComparsionBtnAction` — AJAX-добавление/удаление товара в избранное/сравнение, обновление `window.favorites` и `window.comparsion`, вызов `setProductsButtons`.
  - `onAddToBasketClick` — AJAX-добавление оффера в корзину, обновление `window.basketData`, вызов `setProductsButtons`.
  - `setProductsButtons` — синхронизация состояний кнопок (иконки, счётчики в шапке, тексты кнопок) по `window.favorites`, `window.comparsion`, `window.basketData`.
  - `clearFavComparsionBtns` — сброс `_active` на всех кнопках избранного/сравнения.
  - `setBasketButtons` — подстановка «В корзине» / скрытие/показ активных кнопок для товаров уже в корзине.

- **Сравнение товаров — класс `MhzComparsion`**
  - Поля:
    - `parent` — корневой контейнер сравнения (`[data-comparsion]`).
    - `md1`, `md3` — медиазапросы для адаптивного поведения.
    - `needArrows` — флаг необходимости стрелок.
  - Основные методы:
    - `init` — поиск элементов, создание «летающей» шапки, проверка стрелок, подписка на события.
    - `getEls` — кэш всех нужных DOM-элементов.
    - `createFlyHead` / `createFlyHeadItems` / `createFlyHeadItem` — построение HTML фиксированной шапки сравнения.
    - `checkArrows`, `showArrows`, `hideArrows` — логика показа/скрытия стрелок и колонок в зависимости от количества товаров и ширины экрана.
    - `hideItem`, `showItem` — синхронное скрытие/показ основного блока, колонок и элемента в «flyhead».
    - `checkFlyHead` — показ/скрытие плавающей шапки при прокрутке (по `_watcher-view`).
    - `setHandlers` — подписка на `watcherCallback` и глобальный `click`.
    - `onClick` — обработка кликов по стрелкам, переключение видимых карточек влево/вправо.

- **Авторизация/регистрация**
  - `authActions` — общий роутер по формам (телефон, пин-код, регистрация, e-mail, восстановление).
  - `onPhoneAuthSubmit` — заполнение попапа ввода пин-кода и его открытие.
  - `onPhonePinSubmit` — показ попапа «успешный вход», при необходимости перезагрузка.
  - `onRegisterSubmit` — успешная регистрация (разные попапы, текст из `DATA.TEXT`).
  - `onEmailAuthSubmit` — успешный вход по e-mail.
  - `onRestorePassSubmit` — успешный запрос на восстановление пароля, подстановка e-mail.

- **Глобальные объекты**
  - `window.Toastify` — экспорт Toastify в глобальную область.
  - `window.mhzModules` — экспорт реестра модулей.

---

Если нужно, могу детализировать любую из секций (например, только сравнение товаров или только авторизацию) с разбором шагов и DOM-структуры.
