# Latvian Trainer — локальный контекст

## Суть проекта
Тренажёр произношения латышского языка. Только говорение через микрофон.
Воронка: YouTube → триал 7 дней бесплатно → Уровень 2 за 50€/мес (YouTube спонсорство).

## Стек
- Статический сайт: HTML + Vanilla JS (без фреймворков)
- База данных: Supabase (PostgreSQL)
- Деплой: GitHub Pages (ветка main)
- Речь: Web Speech API (браузерный, без бэкенда)
- Доступ: Telegram бот на сервере 89.167.10.48

## Структура файлов
- `index.html` — главная страница тренажёра
- `trenazer.html` — основной тренажёр
- `admin.html` — админка (пароль: 7458admin)
- `supabase-config.js` — конфиг Supabase
- `package.json` — зависимости (только для локальной разработки)

## База данных
Таблица `lessons`: id, level (1/2/3), block (1-30), ru, lv
Таблица `users`: id, name, telegram_id, type, personal_code, max_level, access_expires
Таблица `feedback`: id, user_id, user_name, block, message, created_at

Уровень 1: блоки 1-4 (триал)
Уровень 2: блоки 1-30 (платный), заполнено 1-12, продолжать с блока 13

## Правила

### Обязательно:
- Перед любым изменением HTML/JS — предложи план
- После изменений — проверь через Playwright (открой сайт, скриншот)
- Деплой только после подтверждения пользователя
- Не менять структуру таблиц Supabase без явного запроса
- Не трогать данные Уровня 1 (level=1)

### Браузерная совместимость (КРИТИЧНО):
- iOS Safari: тап на кнопку для каждой фразы (Web Speech API не работает без жеста)
- iOS Chrome/Telegram: НЕ работает — показываем экран с инструкцией открыть Safari
- Android Chrome: работает, авто-старт
- Desktop Chrome/Safari/Edge: работает

### Git:
- Коммит после каждого изменения с осмысленным сообщением на русском
- Формат: `feat: описание` / `fix: описание` / `chore: описание`
- Push только по запросу пользователя

## Supabase
URL: https://jzguubjpvgzxcawmkxop.supabase.co
Anon key: sb_publishable_P4UaODx-ojzuuNKrd-zi9Q_yrJzey5X

## Деплой
```bash
git add -A
git commit -m "feat: описание"
git push origin main
```
GitHub Pages обновляется автоматически через ~1-2 минуты.
