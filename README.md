# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Cloudflare Pages Active Integration Documentation

To enable AI-powered features (such as candidate-to-event matching in `src/lib/openrouter.ts` and fraud detection in `src/lib/fraudSentinel.ts`) when deploying to Cloudflare Pages:

1. Log in to your Cloudflare dashboard and select your Pages project.
2. Go to **Settings** > **Environment variables**.
3. Add a new variable named `VITE_OPENROUTER_API_KEY` and set its value to your OpenRouter API key for both **Production** and **Preview** environments.
4. Note that Vite requires the `VITE_` prefix to make the environment variable available to the bundled client application.
5. Create a new deployment or re-deploy the latest commit for the environment variables to take effect.

### Robust Fallbacks
Both `src/lib/openrouter.ts` and `src/lib/fraudSentinel.ts` are configured with robust fallback strings (`import.meta.env.VITE_OPENROUTER_API_KEY || ""`) and graceful fallback behaviors. If the API key is not configured in Cloudflare Pages or is missing during runtime, the system logs a descriptive warning and safely falls back to default values (e.g., a match score of `0` or a valid check-in status) without crashing the application.
