---
trigger: always_on
---

При изменении проекта нужно вносить описание архитектуры в этот файл и использовать его как руководство для дальнейшей разработки.

## Архитектура React приложения

### Общая структура
Приложение построено по принципу разделения на слои:
- **API layer** - работа с API (mock функции в Redux слайсах)
- **Store layer** - управление состоянием через Redux Toolkit
- **Components layer** - UI компоненты

### Структура папок
```
src/
├── components/     # Переиспользуемые UI компоненты
├── pages/         # Страницы приложения
├── store/         # Redux store и слайсы
│   ├── slices/    # Redux слайсы
│   └── index.ts   # Конфигурация store
├── types/         # TypeScript типы
├── hooks/         # Custom hooks (Redux)
├── utils/         # Утилиты
└── styles/        # Стили
```

### Redux Store
Централизованное состояние с четырьмя слайсами:
- **authSlice** - аутентификация, управление токенами
- **productsSlice** - товары, пагинация, поиск, сортировка
- **addProductModalSlice** - состояние модального окна добавления
- **toastSlice** - система уведомлений

### Компоненты
- **App** - корневой компонент с роутингом и темой
- **LoginPage** - форма входа с валидацией
- **ProductsPage** - основная страница с товарами
- **ProductList** - таблица товаров с пагинацией
- **SearchBar** - поиск с дебаунсингом
- **AddProductModal** - модальное окно добавления товара
- **Toast** - уведомления

### Custom Hooks
- **useAuth** - управление аутентификацией и сессиями
- **useProducts** - управление товарами, пагинацией, поиском и сортировкой

### Типизация
Строгая типизация TypeScript с интерфейсами для:
- User, AuthState
- Product, ProductsState
- AddProductModalState, ToastState
- LoginCredentials, AddProductForm

### Конфигурация
- **TypeScript**: строгая типизация, verbatimModuleSyntax
- **Material-UI**: тема с основной цветовой схемой
- **React Router**: защищенные маршруты
- **Redux Toolkit**: middleware для сериализации

### Управление сессиями
- localStorage при "Запомнить меня"
- sessionStorage без чекбокса
- Автоматическая проверка токена при загрузке
