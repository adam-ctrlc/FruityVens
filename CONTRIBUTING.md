# Contributing to FruityVens

Thank you for taking the time to contribute. This document explains how to get set up, what the standards are, and how to submit changes.

---

## Before You Start

- Check existing [issues](https://github.com/adam-ctrlc/FruityVens/issues) before opening a new one — someone may already be working on it.
- For large changes, open an issue first to discuss the approach before writing code.
- All contributions are subject to the [Apache 2.0 License](LICENSE).

---

## Development Setup

```bash
git clone https://github.com/adam-ctrlc/FruityVens.git
cd FruityVens
pnpm install          # always pnpm — never npm or yarn
pnpm start --clear    # Metro with cleared cache
```

For camera/AI detection features, a dev build is required:

```bash
pnpm expo prebuild
pnpm expo run:android   # or run:ios
```

---

## Workflow

1. **Fork** the repository and clone your fork
2. Create a branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Make your changes following the standards below
4. Run checks locally:
   ```bash
   pnpm exec tsc --noEmit   # must pass with zero errors
   pnpm format:check         # must pass with zero diff
   ```
5. Commit with a clear message describing **why**, not just what
6. Push and open a **pull request** against `main`

---

## Code Standards

### General

- **TypeScript strict** — no `any`, all props typed, all return types inferred or explicit
- **pnpm only** — never run `npm install`, `npx`, or `yarn` commands
- **No emojis** — use `@expo/vector-icons` Ionicons for all icons; colored `FruitAvatar` initials for fruit identity
- **No comments** unless the WHY is genuinely non-obvious (hidden constraint, workaround, subtle invariant). Never explain what the code does — well-named identifiers do that.

### Architecture

Follow the **Atomic Design** hierarchy strictly — imports only flow downward:

```
quarks → atoms → molecules → organisms → templates → screens
```

Never import from a higher level (e.g. an atom must not import a molecule).

### State Management

All mutable state lives in `App.tsx`. Handlers are `useCallback`-wrapped and passed as props. Screens and modals are stateless recipients.

### Performance

| Rule | How |
|---|---|
| Memoize list item components | `React.memo` |
| Stabilize callbacks | `useCallback` |
| Memoize derived values | `useMemo` (filtered lists, aggregations, stats) |
| No inline arrow functions in `renderItem` | Extract to a `useCallback` |
| Dynamic widths | `style={{ width: \`${pct}%\` }}` — not Tailwind classes |

### Styling

- Use NativeWind (Tailwind) classes for static styles
- Use inline `style={{}}` only for runtime-computed values (percentages, dynamic sizes)
- All colors derive from `src/quarks/colors.ts` — do not hardcode hex values in components

---

## Adding a New Feature

1. Update `src/types/index.ts` if new data shapes are needed
2. Add seed data to `src/data/mockData.ts` for testing
3. Add a `useCallback` handler in `App.tsx`
4. Build bottom-up: atom → molecule → organism → screen
5. Wire modal visibility + handler props from `App.tsx` down

---

## Adding a New Fruit to AI Detection

The YOLOv8n model (`assets/models/best_int8.onnx`) currently detects: apple, banana, grape, mango, orange.

To add a new fruit class, the model must be retrained. The training source is the [FruityVens Flutter repo](https://github.com/adam-ctrlc/FruityVens). Once a new model is exported to ONNX INT8:

1. Replace `assets/models/best_int8.onnx`
2. Update `DETECTION_LABELS` and `LABEL_TO_FRUIT_ID` in `src/services/FruitDetectionService.ts`
3. Add the new fruit's `FruitAvatar` entry in `src/components/atoms/FruitAvatar.tsx`

---

## Pull Request Checklist

- [ ] `pnpm exec tsc --noEmit` passes with zero errors
- [ ] `pnpm format:check` passes with zero diff
- [ ] No emojis introduced in any file
- [ ] No `npm` / `npx` / `yarn` commands used
- [ ] All new components follow the Atomic Design level appropriate for their complexity
- [ ] All handlers passed as props are wrapped in `useCallback`
- [ ] PR description explains **why** the change is needed, not just what it does

---

## Reporting Bugs

Open a [GitHub issue](https://github.com/adam-ctrlc/FruityVens/issues/new) with:

- Device / emulator details (OS, Expo SDK version, dev build or Expo Go)
- Steps to reproduce
- Expected vs. actual behavior
- Relevant error output or screenshot

---

## Code of Conduct

Be respectful and constructive. Contributions of all experience levels are welcome.
