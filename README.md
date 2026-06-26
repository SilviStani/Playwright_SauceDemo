# PracticeProject — Playwright Test Suite

Proyecto de práctica de automatización de tests E2E con **Playwright** y **TypeScript** sobre [SauceDemo](https://www.saucedemo.com), un e-commerce diseñado para testing con usuarios y flujos predefinidos.

## Stack

| | |
|---|---|
| **Framework** | Playwright v1.61.1 |
| **Lenguaje** | TypeScript (CommonJS) |
| **Patrón** | Page Object Model (POM) |
| **Auth** | storageState — sesión reutilizable entre tests |

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
npx playwright install chromium
```

## Configuración

Copiá `.env.example` a `.env` y completá las credenciales:

```bash
cp .env.example .env
```

```env
STANDARD_USER=standard_user
LOCKED_OUT_USER=locked_out_user
PROBLEM_USER=problem_user
PERFORMANCE_GLITCH_USER=performance_glitch_user
PASSWORD=secret_sauce
BASE_URL=https://www.saucedemo.com
```

## Ejecutar tests

```bash
npm test                                              # Todos los tests en Chromium
npx playwright test tests/Login/login.spec.ts         # Solo un archivo
npx playwright test tests/Inventory/                  # Solo una carpeta
npm run test:headed                                   # Con browser visible
npm run test:debug                                    # Modo debug paso a paso
npm run report                                        # Reporte HTML del último run
npm run codegen                                       # Grabador de acciones
```

## Cobertura de tests

| Área | Tests | Casos cubiertos |
|------|:-----:|-----------------|
| **Login** | 6 | Login exitoso, usuario bloqueado, campos vacíos, password incorrecto, username vacío, cerrar error |
| **Inventory** | 6 | Título, cantidad de productos, badge, ordenar Z→A, precio low→high, precio high→low |
| **Product Detail** | 5 | Navegación al detalle, nombre correcto, precio correcto, agregar al carrito, volver al inventario |
| **Cart** | 6 | Producto aparece, eliminar item, continuar comprando, badge desaparece, múltiples productos, cantidad correcta |
| **Checkout** | 5 | Formulario avanza, resumen correcto, confirmación, formulario vacío da error, cancelar vuelve al carrito |
| **Logout** | 2 | Redirección al login, campo de usuario visible post-logout |
| **Problem User** | 3 | Imágenes rotas, sort sin efecto, last name no acepta input en checkout |
| **E2E** | 1 | Flujo completo: login → productos → carrito → checkout → confirmación |

## Arquitectura

```
PracticeProject/
├── pages/
│   ├── Base/BasePage.ts              # navigate(), waitForElement(), logout()
│   ├── Login/LoginPage.ts
│   ├── Inventory/InventoryPage.ts
│   ├── ProductDetail/ProductDetailPage.ts
│   ├── Cart/CartPage.ts
│   └── Checkout/CheckoutPage.ts
├── tests/
│   ├── Login/login.spec.ts
│   ├── Inventory/inventory.spec.ts
│   ├── ProductDetail/product-detail.spec.ts
│   ├── Cart/cart.spec.ts
│   ├── Checkout/checkout.spec.ts
│   ├── Logout/logout.spec.ts
│   ├── ProblemUser/problem-user.spec.ts
│   └── E2E/e2e.spec.ts
├── fixtures.ts                       # Page Objects como fixtures de Playwright
├── global-setup.ts                   # Login único → guarda sesión en auth.json
└── playwright.config.ts
```

### storageState

`global-setup.ts` hace login una sola vez antes de todo el suite y guarda la sesión en `auth.json`. Los tests de Inventory, Cart, Checkout y Logout reutilizan esa sesión — sin login por cada test. Los tests de Login, Problem User y E2E limpian la sesión para testear desde cero.

> `auth.json` está en `.gitignore`. Nunca commitear tokens de sesión.

## CI — GitHub Actions

El suite corre automáticamente en cada `push` y `pull request` a `main` usando GitHub Actions.

El workflow está en [.github/workflows/playwright.yml](.github/workflows/playwright.yml) e incluye:
- Instalación de dependencias con `npm ci`
- Instalación de Chromium con sus dependencias del sistema
- Ejecución completa del suite
- Subida del reporte HTML como artefacto descargable (disponible 30 días)

### Configurar en un repo nuevo

Las credenciales se cargan como Secrets en GitHub — **nunca en el código**:

```
Repositorio → Settings → Secrets and variables → Actions → New repository secret
```

| Secret | Valor |
|---|---|
| `STANDARD_USER` | `standard_user` |
| `LOCKED_OUT_USER` | `locked_out_user` |
| `PROBLEM_USER` | `problem_user` |
| `PERFORMANCE_GLITCH_USER` | `performance_glitch_user` |
| `PASSWORD` | `secret_sauce` |
| `BASE_URL` | `https://www.saucedemo.com` |

Con los Secrets cargados, el primer `push` dispara el workflow automáticamente.

## Convenciones

- `getByRole()`, `getByLabel()`, `getByText()` sobre selectores CSS cuando sea posible
- SauceDemo usa `data-test` (no `data-testid`) — configurado en `testIdAttribute` del config
- Credenciales siempre desde `process.env` con `!` para TypeScript strict mode
- Screenshots y video se capturan automáticamente solo en failures
