# Скиллы Codex для Жанарыса

Жанарыс выбирает нужный скилл по таблице и сам запускает его команду в терминале. Если скилла ещё нет, ИИ сообщает его название, назначение и команду. Установка остаётся за Жанарысом.

## UI/UX и дизайн

| Скилл | За что отвечает | Приоритет | Источник |
| --- | --- | --- | --- |
| `ui-ux-pro-max` | Помогает подобрать стиль, цветовую палитру, шрифты и UX-паттерны для веба и мобильных приложений. | 10/10 | [NextLevelBuilder](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/SKILL.md) |
| `frontend-design` | Задаёт визуальное направление и помогает реализовать выразительные веб-страницы и компоненты. | 10/10 | [Anthropic](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) |
| `impeccable` | Находит слабые места готового интерфейса и помогает доработать иерархию, композицию и визуальные детали. | 10/10 | [Impeccable](https://github.com/pbakaus/impeccable/blob/main/.agents/skills/impeccable/SKILL.md) |
| `design-system-patterns` | Проектирует дизайн-токены, темы и API переиспользуемых компонентов. | 10/10 | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/ui-design/skills/design-system-patterns/SKILL.md) |
| `visual-design-foundations` | Помогает выстроить композицию, сетку, цвет, типографику и систему отступов. | 10/10 | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/ui-design/skills/visual-design-foundations/SKILL.md) |
| `accessibility-compliance` | Помогает проверять доступность по WCAG, включая контраст, навигацию с клавиатуры и работу скринридеров. | 10/10 | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/ui-design/skills/accessibility-compliance/SKILL.md) |
| `interaction-design` | Проектирует обратную связь, состояния компонентов, переходы и микроанимации. | 9/10 | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/ui-design/skills/interaction-design/SKILL.md) |
| `mobile-ios-design` | Помогает проектировать интерфейсы iOS по Apple Human Interface Guidelines и применять паттерны SwiftUI. | 9/10 | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/ui-design/skills/mobile-ios-design/SKILL.md) |
| `mobile-android-design` | Помогает проектировать интерфейсы Android по Material Design 3 и применять паттерны Jetpack Compose. | 9/10 | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/ui-design/skills/mobile-android-design/SKILL.md) |
| `responsive-design` | Помогает адаптировать сетки, компоненты и типографику к разной ширине экрана. | 9/10 | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/ui-design/skills/responsive-design/SKILL.md) |
| `web-design-guidelines` | Проверяет код веб-интерфейса по Web Interface Guidelines и указывает места для исправления. | 9/10 | [Vercel](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) |
| `react-native-design` | Помогает оформлять React Native-интерфейсы, учитывать различия iOS и Android и реализовывать анимации. | 9/10 | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/ui-design/skills/react-native-design/SKILL.md) |

## Мобильная разработка на React Native и Expo

| Скилл | За что отвечает | Источник |
| --- | --- | --- |
| `expo-native-ui` | Помогает оформлять нативные экраны в Expo, включая цвета, элементы управления, иконки и медиа. | [Expo](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-native-ui/SKILL.md) |
| `expo-design-system` | Задаёт токены темы и правила переиспользования компонентов в приложении Expo. | [Expo](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/SKILL.md) |
| `expo-animation` | Помогает реализовать жесты, тактильную обратную связь и плавные анимации. | [Expo](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-animation/SKILL.md) |
| `expo-router` | Настраивает файловые маршруты, глубокие ссылки, стеки, вкладки и модальные экраны. | [Expo](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-router/SKILL.md) |
| `expo-ui` | Помогает использовать нативные компоненты `@expo/ui`, включая варианты на SwiftUI и Jetpack Compose. | [Expo](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-ui/SKILL.md) |
| `expo-data-fetching` | Помогает организовать сетевые запросы, кеширование, обработку ошибок и работу без сети. | [Expo](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-data-fetching/SKILL.md) |
| `react-native-architecture` | Помогает выбрать структуру React Native-приложения, организовать навигацию, доступ к нативным API и синхронизацию данных. | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/frontend-mobile-development/skills/react-native-architecture/SKILL.md) |

## Архитектура, логика и безопасность

| Скилл | За что отвечает | Источник |
| --- | --- | --- |
| `architecture-patterns` | Помогает определить границы модулей и разделить доменную логику, способы доступа к данным и внешние интерфейсы. | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/backend-development/skills/architecture-patterns/SKILL.md) |
| `api-design-principles` | Помогает проектировать контракты REST и GraphQL, форматы ответов, пагинацию и версионирование. | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/backend-development/skills/api-design-principles/SKILL.md) |
| `postgresql-table-design` | Помогает выбирать типы данных, ключи, ограничения, индексы и связи таблиц PostgreSQL. | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/database-design/skills/postgresql-table-design/SKILL.md) |
| `sql-optimization-patterns` | Помогает читать планы выполнения запросов, находить узкие места и подбирать индексы. | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/developer-essentials/skills/sql-optimization-patterns/SKILL.md) |
| `auth-implementation-patterns` | Помогает реализовать аутентификацию, управление сессиями и контроль доступа по ролям. | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/developer-essentials/skills/auth-implementation-patterns/SKILL.md) |
| `error-handling-patterns` | Помогает проектировать типы ошибок, обработку исключений и восстановление после сбоев. | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/developer-essentials/skills/error-handling-patterns/SKILL.md) |
| `security-requirement-extraction` | Формулирует проверяемые требования безопасности по рискам и бизнес-сценариям. | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/security-scanning/skills/security-requirement-extraction/SKILL.md) |
| `stride-analysis-patterns` | Помогает моделировать угрозы по STRIDE и выбирать меры защиты. | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/security-scanning/skills/stride-analysis-patterns/SKILL.md) |
| `e2e-testing-patterns` | Помогает строить сквозные тесты пользовательских сценариев с Playwright или Cypress. | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/developer-essentials/skills/e2e-testing-patterns/SKILL.md) |
| `code-review-excellence` | Помогает находить дефекты и объяснять замечания к коду с учётом их важности. | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/developer-essentials/skills/code-review-excellence/SKILL.md) |
| `openapi-spec-generation` | Помогает создавать и поддерживать спецификацию OpenAPI для документации и генерации клиентов. | [Wshobson](https://github.com/wshobson/agents/blob/main/plugins/documentation-generation/skills/openapi-spec-generation/SKILL.md) |

## Superpowers — процесс разработки

| Скилл | За что отвечает | Источник |
| --- | --- | --- |
| `brainstorming` | Уточняет задачу, сравнивает подходы и помогает согласовать дизайн решения. | [Superpowers](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md) |
| `writing-plans` | Превращает согласованное решение в план с шагами, файлами и проверками. | [Superpowers](https://github.com/obra/superpowers/blob/main/skills/writing-plans/SKILL.md) |
| `executing-plans` | Помогает выполнить согласованный план в текущей сессии и провести итоговое ревью. | [Superpowers](https://github.com/obra/superpowers/blob/main/skills/executing-plans/SKILL.md) |
| `test-driven-development` | Ведёт разработку через падающий тест, минимальное исправление и рефакторинг. | [Superpowers](https://github.com/obra/superpowers/blob/main/skills/test-driven-development/SKILL.md) |
| `systematic-debugging` | Помогает подтвердить причину ошибки, проверить гипотезу и исправить дефект. | [Superpowers](https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md) |
| `verification-before-completion` | Требует свежих результатов проверок перед утверждением, что работа завершена. | [Superpowers](https://github.com/obra/superpowers/blob/main/skills/verification-before-completion/SKILL.md) |
| `requesting-code-review` | Помогает подготовить контекст для ревью и запросить проверку изменений. | [Superpowers](https://github.com/obra/superpowers/blob/main/skills/requesting-code-review/SKILL.md) |
| `receiving-code-review` | Помогает проверить замечания ревью, разобраться в спорных рекомендациях и внести правки. | [Superpowers](https://github.com/obra/superpowers/blob/main/skills/receiving-code-review/SKILL.md) |
| `subagent-driven-development` | Делегирует задачи из плана субагентам и организует проверку требований и качества кода. | [Superpowers](https://github.com/obra/superpowers/blob/main/skills/subagent-driven-development/SKILL.md) |
| `dispatching-parallel-agents` | Распределяет независимые задачи между параллельными субагентами и помогает собрать результаты. | [Superpowers](https://github.com/obra/superpowers/blob/main/skills/dispatching-parallel-agents/SKILL.md) |
| `writing-skills` | Помогает писать, проверять и улучшать собственные скиллы. | [Superpowers](https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md) |

Для полного выполнения планов `executing-plans` и `subagent-driven-development` ссылаются на соседние скиллы Superpowers для работы с Git worktree и завершения ветки. В репозитории также есть справка по инструментам Codex, на которую ссылается `writing-skills`. [Каталог Superpowers](https://github.com/obra/superpowers/tree/main/skills)

## Команды для ручной установки

Нужны Node.js 22.20 или новее и `npx`. Копируй только строку нужного скилла и подтверждай установку в терминале. Флаг `-g` делает скилл доступным во всех проектах текущего пользователя, `-a codex` выбирает Codex, а `--skill` указывает конкретный скилл. [Справочник CLI](https://github.com/vercel-labs/skills/blob/main/docs/commands.md#skills-add)

### UI/UX и дизайн

```bash
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/main/.claude/skills/ui-ux-pro-max --skill ui-ux-pro-max -g -a codex
npx skills add anthropics/skills --skill frontend-design -g -a codex
npx skills add https://github.com/pbakaus/impeccable/tree/main/.agents/skills/impeccable --skill impeccable -g -a codex
npx skills add wshobson/agents --skill design-system-patterns -g -a codex
npx skills add wshobson/agents --skill visual-design-foundations -g -a codex
npx skills add wshobson/agents --skill accessibility-compliance -g -a codex
npx skills add wshobson/agents --skill interaction-design -g -a codex
npx skills add wshobson/agents --skill mobile-ios-design -g -a codex
npx skills add wshobson/agents --skill mobile-android-design -g -a codex
npx skills add wshobson/agents --skill responsive-design -g -a codex
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -g -a codex
```

Для поиска в `ui-ux-pro-max` нужен Python 3. В исходных примерах указан путь для Claude Code. После установки через `npx skills` используй путь к скрипту в глобальном каталоге Codex. [Требования UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill#prerequisites)

```bash
python3 "$HOME/.agents/skills/ui-ux-pro-max/scripts/search.py" "keyboard navigation" --domain ux
```

### Архитектура, логика и безопасность

```bash
npx skills add wshobson/agents --skill architecture-patterns -g -a codex
npx skills add wshobson/agents --skill api-design-principles -g -a codex
npx skills add wshobson/agents --skill postgresql-table-design -g -a codex
npx skills add wshobson/agents --skill sql-optimization-patterns -g -a codex
npx skills add wshobson/agents --skill auth-implementation-patterns -g -a codex
npx skills add wshobson/agents --skill error-handling-patterns -g -a codex
npx skills add wshobson/agents --skill security-requirement-extraction -g -a codex
npx skills add wshobson/agents --skill stride-analysis-patterns -g -a codex
npx skills add wshobson/agents --skill e2e-testing-patterns -g -a codex
npx skills add wshobson/agents --skill code-review-excellence -g -a codex
npx skills add wshobson/agents --skill openapi-spec-generation -g -a codex
```

### Superpowers

```bash
npx skills add obra/superpowers --skill brainstorming -g -a codex
npx skills add obra/superpowers --skill writing-plans -g -a codex
npx skills add obra/superpowers --skill executing-plans -g -a codex
npx skills add obra/superpowers --skill test-driven-development -g -a codex
npx skills add obra/superpowers --skill systematic-debugging -g -a codex
npx skills add obra/superpowers --skill verification-before-completion -g -a codex
npx skills add obra/superpowers --skill requesting-code-review -g -a codex
npx skills add obra/superpowers --skill receiving-code-review -g -a codex
npx skills add obra/superpowers --skill subagent-driven-development -g -a codex
npx skills add obra/superpowers --skill dispatching-parallel-agents -g -a codex
npx skills add obra/superpowers --skill writing-skills -g -a codex
```

### Если проект использует React Native или Expo

```bash
npx skills add wshobson/agents --skill react-native-design -g -a codex
npx skills add wshobson/agents --skill react-native-architecture -g -a codex

# Для проектов на Expo
npx skills add expo/skills --skill expo-native-ui -g -a codex
npx skills add expo/skills --skill expo-design-system -g -a codex
npx skills add expo/skills --skill expo-animation -g -a codex
npx skills add expo/skills --skill expo-router -g -a codex
npx skills add expo/skills --skill expo-ui -g -a codex
npx skills add expo/skills --skill expo-data-fetching -g -a codex
```

### Проверка установки

```bash
npx skills list -g -a codex
```

После установки начни новый чат Codex и попроси применить нужный скилл по имени.
