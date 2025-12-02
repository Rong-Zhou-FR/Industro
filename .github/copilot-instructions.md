# GitHub Copilot Instructions for Industro

## Project Overview

Industro is a comprehensive Nuxt.js web application for industrial engineering calculations and procedures. The application provides tools for:
- Reliability calculations (exponential and linear models)
- Lockout/tagout (LOTO) procedures management
- Bilingual support (English and French)

## Technology Stack

- **Framework**: Nuxt.js 4 with Vue 3 Composition API
- **Language**: TypeScript
- **Styling**: Scoped CSS in Single File Components (SFCs)
- **Internationalization**: Vue I18n with locale files
- **Charting**: Chart.js for data visualization
- **Math Rendering**: KaTeX for mathematical equations
- **Markdown**: marked library for markdown rendering
- **Linting**: ESLint with Nuxt module
- **Package Manager**: npm

## Project Structure

```
app/
├── pages/              # Page components (file-based routing)
├── components/         # Reusable Vue components
├── plugins/            # Nuxt plugins (e.g., i18n setup)
├── assets/
│   └── css/           # Global styles
└── app.vue            # Root component

locales/               # Internationalization JSON files
public/                # Static assets
resources/             # Additional resources
```

## Code Style and Conventions

### Vue Component Structure

1. **Always use Vue 3 Composition API** with `<script setup>` syntax
2. **Use TypeScript** for type safety (add `lang="ts"` to script tags)
3. **Follow SFC order**: `<template>`, `<script setup>`, `<style scoped>`
4. **Component naming**: Use PascalCase for component files (e.g., `LanguageSwitcher.vue`)

### TypeScript and Type Safety

- Use explicit type annotations for function parameters and return types
- Define interfaces for complex data structures
- Use `as const` for readonly arrays and objects
- Avoid `any` type; use `unknown` or proper types instead

### Internationalization (i18n)

- **Always use translation keys** instead of hardcoded strings in templates
- Access translations via `useI18n()` composable: `const { t, locale } = useI18n()`
- Use `t('key.path')` or custom translate functions for translations
- Translation files are in `locales/` directory (en.json, fr.json)
- Store locale preference in localStorage when switching languages

### Styling Guidelines

- **Use scoped styles** in components to prevent style leakage
- Follow existing color scheme: primary color `#667eea` (purple-blue)
- Use existing CSS classes when available (`.btn`, `.card`, `.form-control`, etc.)
- Maintain responsive design with grid layouts (`.grid`, `.grid-cols-2`)
- Add smooth transitions for interactive elements (`transition: all 0.3s ease`)

### State Management and Reactivity

- Use Vue 3 reactivity: `ref()`, `reactive()`, `computed()`
- Use `onMounted()` and `onUnmounted()` for lifecycle hooks
- Clean up side effects (intervals, listeners) in `onUnmounted()`
- Use `watch()` for reactive side effects on locale changes

### Client-Side Only Code

- Always check for `typeof window !== 'undefined'` before accessing browser APIs
- Use localStorage with proper error handling:
  ```typescript
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('key', value)
    } catch (e) {
      console.error('localStorage not available:', e)
    }
  }
  ```
- This is important for SSR (Server-Side Rendering) compatibility

### Navigation

- Use `<NuxtLink>` component for internal navigation
- Page routing is file-based in `app/pages/` directory
- Add back-to-home links: `<NuxtLink to="/" class="back-btn">`

### Error Handling

- Display user-friendly error messages in the UI
- Use conditional rendering for error states: `v-if="errorMessage"`
- Validate user inputs before processing
- Clear error messages after successful operations

### Data Import/Export

- Support JSON import/export for data persistence
- Use file input with `accept=".json"` for JSON imports
- Provide PDF export where applicable (using jspdf)
- Handle file reading with proper error handling

## Build and Development Commands

```bash
# Install dependencies (always run first)
npm install

# Start development server (http://localhost:3000)
npm run dev

# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

## Linting and Code Quality

- **Always run `npm run lint`** before committing changes
- Fix linting errors with `npm run lint:fix` when possible
- Address TypeScript errors and warnings
- Common pitfalls to avoid:
  - Avoid `v-html` for XSS security (use sanitization if needed)
  - Avoid template variable shadowing (use unique variable names)
  - Remove unused variables and parameters

## Common Patterns

### Component Template

```vue
<template>
  <div class="container">
    <div class="card fade-in">
      <LanguageSwitcher />
      <h1>{{ t('section.title') }}</h1>
      <!-- Component content -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Component logic
</script>

<style scoped>
/* Scoped styles */
</style>
```

### Form Input Pattern

```vue
<div class="form-group">
  <label for="inputId">{{ t('form.label') }}</label>
  <input 
    id="inputId" 
    v-model.number="value" 
    type="number" 
    class="form-control"
  >
</div>
```

### File Import Pattern

```vue
<input 
  ref="fileInput" 
  type="file" 
  accept=".json" 
  @change="handleFileSelect"
>
<button class="btn" @click="importFile">
  {{ t('common.import') }}
</button>
```

## Security Considerations

- **Avoid using `v-html`** with user-generated content
- Sanitize any HTML or markdown before rendering
- Validate all user inputs before processing
- Don't expose sensitive data in client-side code
- Use proper CORS and CSP headers in production

## Testing

Currently, this project does not have automated tests. When adding tests:
- Use Vitest for unit testing (Nuxt-compatible)
- Use Vue Test Utils for component testing
- Focus on critical business logic (calculations, data transformations)
- Test i18n integration for bilingual support

## Important Notes

- The project uses **file-based routing** - pages in `app/pages/` become routes
- **Nuxt 4** is used with the `compatibilityDate: '2025-07-15'` configuration
- The `.nuxt` directory is auto-generated during development and should not be manually edited
- ESLint config imports from `.nuxt/eslint.config.mjs` (generated file, not from node_modules)
- Always include `<LanguageSwitcher />` component in page layouts for consistency

## When Making Changes

1. **Understand the context**: Read existing code in similar components
2. **Maintain consistency**: Follow existing patterns and naming conventions
3. **Keep it bilingual**: Update both en.json and fr.json locale files
4. **Test manually**: Run `npm run dev` and verify changes work in browser
5. **Lint before commit**: Run `npm run lint` to catch issues early
6. **Minimal changes**: Make the smallest changes necessary to achieve the goal
7. **Preserve functionality**: Don't break existing features when adding new ones

## Resources

- [Nuxt.js Documentation](https://nuxt.com/docs)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue I18n Documentation](https://vue-i18n.intlify.dev/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
