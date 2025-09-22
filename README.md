# FlirtHelper Telegram Bot

Простейший Telegram-бот, который отвечает на любое сообщение текстом:

```
Новый бот для переписок - @VibeDatingBot
```

## Деплой на Vercel

1. Создайте новый проект на Vercel и импортируйте этот репозиторий.
2. В настройках проекта добавьте переменную окружения `TELEGRAM_BOT_TOKEN` со значением токена бота.
3. Задеплойте проект. После деплоя Vercel предоставит публичный URL.
4. Настройте webhook в Telegram:
   ```bash
   curl "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=https://<your-project>.vercel.app/api/webhook"
   ```
5. Отправьте сообщение боту в Telegram — он ответит заданной фразой.

## Локальное тестирование

Для отправки тестового запроса можно использовать `curl`:

```bash
curl -X POST \
  https://<your-project>.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"message":{"chat":{"id":12345}}}'
```

При развертывании в продакшн на Vercel дополнительная конфигурация не требуется.
