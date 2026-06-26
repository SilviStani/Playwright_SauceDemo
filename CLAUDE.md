# PracticeProject — Playwright Test Suite

## Proyecto

Proyecto de práctica de automatización de tests con Playwright y TypeScript. Sitio objetivo: **SauceDemo** (`https://www.saucedemo.com`), un e-commerce de práctica con usuarios y flujos predefinidos.

## Stack

- **Playwright** v1.61.1 con TypeScript
- **Node.js** con `commonjs`
- **Pattern**: Page Object Model (POM)
- **dotenv** para variables de entorno

## Estructura de carpetas

```
PracticeProject/
├── pages/
│   ├── Base/
│   │   └── BasePage.ts              # navigate(), getTitle(), waitForElement(), openMenu(), logout()
│   ├── Login/
│   │   └── LoginPage.ts             # login(), getErrorMessage(), closeErrorMessage(), isErrorVisible()
│   ├── Inventory/
│   │   └── InventoryPage.ts         # navigate(), getPageTitle(), getProductCount(), getProductNames(),
│   │                                # addToCart(), getCartCount(), goToCart(), sortBy(),
│   │                                # getFirstProductName(), getFirstProductPrice(),
│   │                                # goToProductDetail(), getProductImageSrcs()
│   ├── ProductDetail/
│   │   └── ProductDetailPage.ts     # getProductName(), getProductPrice(), getProductDescription(),
│   │                                # addToCart(), goBack()
│   ├── Cart/
│   │   └── CartPage.ts              # getCartItemCount(), getItemNames(), removeItem(),
│   │                                # proceedToCheckout(), continueShopping(), isCartBadgeVisible()
│   └── Checkout/
│       └── CheckoutPage.ts          # fillShippingInfo(), continue(), cancel(), getErrorMessage(),
│                                    # getSummaryItemNames(), getOrderTotal(), finish(), getConfirmationMessage()
├── tests/
│   ├── Login/
│   │   └── login.spec.ts            # 6 tests ✅
│   ├── Inventory/
│   │   └── inventory.spec.ts        # 6 tests ✅
│   ├── ProductDetail/
│   │   └── product-detail.spec.ts   # 5 tests ✅
│   ├── Cart/
│   │   └── cart.spec.ts             # 6 tests ✅
│   ├── Checkout/
│   │   └── checkout.spec.ts         # 5 tests ✅
│   ├── Logout/
│   │   └── logout.spec.ts           # 2 tests ✅
│   ├── ProblemUser/
│   │   └── problem-user.spec.ts     # 3 tests ✅
│   └── E2E/
│       └── e2e.spec.ts              # 1 test ✅
├── fixtures.ts                      # loginPage, inventoryPage, productDetailPage, cartPage, checkoutPage
├── global-setup.ts                  # Login único → guarda sesión en auth.json
├── playwright.config.ts
├── tsconfig.json
├── .env                             # Credenciales (NO commitear)
├── .env.example                     # Plantilla vacía (sí commitear)
└── CLAUDE.md
```

## Estado actual — 34 tests pasando en Chromium

| Área | Tests cubiertos |
|---|---|
| **Login** | login exitoso, usuario bloqueado, campos vacíos, password incorrecto, username vacío con password, cerrar mensaje de error |
| **Inventory** | título "Products", 6 productos visibles, badge al agregar, ordenar Z→A, precio low→high, precio high→low |
| **Product Detail** | navegar al detalle, nombre correcto, precio correcto, agregar al carrito, volver al inventario |
| **Cart** | producto aparece, eliminar item, continuar comprando, badge desaparece al eliminar, múltiples productos aparecen, badge refleja cantidad correcta |
| **Checkout** | formulario avanza, resumen correcto, confirmación final, formulario vacío da error, cancelar vuelve al carrito |
| **Logout** | logout redirige al login, campo de usuario visible tras logout |
| **Problem User** | imágenes rotas (todas iguales), sort sin efecto, last name no acepta input en checkout |
| **E2E** | flujo completo: login → 2 productos → carrito → checkout → confirmación |

## storageState

`global-setup.ts` hace login una vez antes de todo el suite y guarda la sesión en `auth.json`. Los tests reutilizan esa sesión excepto Login, Problem User y E2E, que usan `test.use({ storageState: { cookies: [], origins: [] } })` para arrancar desde cero.

`auth.json` está en `.gitignore` — nunca commitear tokens de sesión.

## Roadmap

### Nivel 1 — Playwright intermedio
- **Tags y anotaciones**: `test.skip`, `test.fixme`, `test.slow`, `test.fail`
- **Tests parametrizados**: `for...of` sobre datasets — un test que corre con múltiples inputs
- **`performance_glitch_user`**: mismo patrón que Problem User, con timeouts extendidos
- **Precio total en checkout**: verificar que el total sea la suma correcta de los productos

### Nivel 2 — Playwright avanzado
- **Network interception**: `page.route()` para mockear respuestas o simular errores de red
- **API testing**: `request.get/post()` con `APIRequestContext`
- **Mobile viewports**: `devices['iPhone 13']` en el config
- **Visual regression**: `toHaveScreenshot()` — capturas de referencia y comparación pixel a pixel

### Nivel 3 — Infraestructura real (prioridad para portfolio)
- **GitHub Actions**: workflow de CI que corre el suite en cada push/PR ⭐
- **Cross-browser**: descomentar Firefox y WebKit — detectar diferencias entre browsers ⭐
- **Allure reporter**: reporte con historial de runs
- **Accesibilidad**: `@axe-core/playwright` — auditoría a11y integrada en los tests

## Tipos de tests

- **E2E**: flujos completos (login → navegación → acción → verificación)
- **UI / Visual**: verificar elementos, visibilidad, textos
- **Formularios**: llenado, validaciones, submit

## Page Object Model

Cada página tiene su carpeta en `pages/<Nombre>/` con su Page Object, y sus tests en `tests/<Nombre>/`.
Todos los Page Objects extienden `BasePage` e importan desde rutas relativas con `../Base/BasePage`.
El método `logout()` vive en `BasePage` porque el menú burger está disponible en cualquier página estando logueado.

## fixtures.ts

Extiende el `test` de Playwright con los Page Objects. Cada Page Object nuevo se registra acá.
Los tests importan `{ test, expect }` desde `fixtures.ts`, no desde `@playwright/test`.

## Variables de entorno

Credenciales en `.env` — cargadas automáticamente por `dotenv` desde `playwright.config.ts`:

```
STANDARD_USER=
LOCKED_OUT_USER=
PROBLEM_USER=
PERFORMANCE_GLITCH_USER=
PASSWORD=
BASE_URL=
```

Usuarios disponibles en SauceDemo:
| Usuario | Comportamiento |
|---|---|
| `standard_user` | Flujo normal |
| `locked_out_user` | Login bloqueado |
| `problem_user` | UI con problemas |
| `performance_glitch_user` | Login lento |

Contraseña para todos: `secret_sauce`

## Cómo correr los tests

```bash
npm test                                             # Todos los tests en Chromium
npx playwright test tests/Login/login.spec.ts        # Solo tests de login
npx playwright test tests/Inventory/                 # Solo tests de inventario
npm run test:headed                                  # Con browser visible
npm run test:debug                                   # Modo debug (paso a paso)
npm run report                                       # Abrir reporte HTML del último run
npm run codegen                                      # Grabador de acciones de Playwright
```

## Configuración de browsers

Por defecto solo corre **Chromium**. Firefox y WebKit están comentados en `playwright.config.ts` — descomentar para cross-browser testing.

## Convenciones

- `getByRole()`, `getByLabel()`, `getByText()` sobre selectores CSS cuando sea posible
- SauceDemo usa `data-test` (no `data-testid`) — configurado en `testIdAttribute` del config
- SauceDemo no siempre usa HTML semántico — usar `locator('.clase')` cuando `getByRole()` no funciona
- Los Page Objects reciben `page: Page` en el constructor y extienden `BasePage`
- Los tests usan `test.describe` para agrupar por funcionalidad
- Screenshots y video se capturan automáticamente solo en failures
- Credenciales siempre desde `process.env` con `!` para satisfacer TypeScript strict mode
