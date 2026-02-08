# Тестирование авторизации

## Проверка сохранения токена

Для тестирования авторизации:

1. Откройте приложение в браузере
2. Используйте тестовые данные:
   - Логин: `kminchelle`
   - Пароль: `0lelplR`
3. Нажмите "Войти"
4. Проверьте в DevTools → Application → Local Storage/Session Storage:
   - Если "Запомнить данные" включено → токен должен быть в localStorage
   - Если "Запомнить данные" выключено → токен должен быть в sessionStorage

## API эндпоинты

- Логин: `POST https://dummyjson.com/auth/login`
- Проверка токена: `GET https://dummyjson.com/auth/me`

## Структура ответа API

```json
{
  "id": 1,
  "username": "kminchelle",
  "email": "kminchelle@qq.com",
  "firstName": "Kathryn",
  "lastName": "Minchelle",
  "gender": "female",
  "image": "https://robohash.org/kminchelle.png",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
