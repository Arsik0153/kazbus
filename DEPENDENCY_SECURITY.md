# Обновление зависимостей frontend

## Результат

- `package-lock.json` заново создан из `package.json`. До исправления `npm ci` завершался с `EUSAGE`, потому что в lockfile не было части прямых зависимостей.
- `npm audit` до обновления находил 17 уязвимостей: 2 critical, 12 high и 3 moderate. После обновления `npm audit` и `npm audit --omit=dev` находят 0 уязвимостей.
- Next.js обновлён с 14.2.3 до 15.5.25, React и React DOM до 19.3.0. Это минимальная поддерживаемая ветка Next.js после [security release за август 2026 года](https://nextjs.org/blog/august-2026-security-release).
- MapLibre GL обновлён с 5.24.0 до 6.10.0. Импорт переведён на ESM, а worker и shared module копируются из установленного пакета перед `dev` и `build`, как требует [руководство MapLibre 5 -> 6](https://maplibre.org/maplibre-gl-js/docs/guides/v5-to-v6-migration-guide/).
- Sharp обновлён до 0.35.4. Вложенный PostCSS закреплён на исправленной версии. Неиспользуемые `uuid`, старые mask packages и лишние type packages удалены.
- Проект использует npm 10 и Node.js 20.9 или новее. Удалён устаревший `bun.lockb`.
- GitHub Actions выполняет `npm ci`, тесты, typecheck, lint и production build.

## Проверка

Проверки выполнены после удаления `node_modules` и повторного `npm ci`:

- 19 тестов прошли;
- `tsc --noEmit` прошёл;
- lint прошёл с одним существующим предупреждением `jsx-a11y` в cargo registration;
- Next.js собрал все 80 маршрутов;
- полный и production-only audit вернули 0 уязвимостей.

## Условия интеграции

Next.js 15 использует асинхронные `params`, `searchParams` и request APIs. Новые страницы из параллельных веток должны принимать `Promise` и вызывать `await`; вызовы `cookies()` и `headers()` также требуют `await`. Старый default import MapLibre нужно заменить на namespace или named import. Ветка 15 меняет значения кеширования по умолчанию для `fetch` и GET route handlers, поэтому код, которому нужен кеш, должен указывать его явно. Полный список изменений есть в [официальном руководстве Next.js 15](https://nextjs.org/docs/app/guides/upgrading/version-15).
