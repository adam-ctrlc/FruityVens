# FruityVens

A mobile point-of-sale app for fruit vendors and farmers. Track sales, manage inventory, monitor profit margins, restock supply, and identify fruit with on-device AI — all offline, all fast.

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Expo (React Native) | ~54.0.33 |
| Language | TypeScript | ~5.9.2 |
| UI Styling | NativeWind (Tailwind CSS) | ^4.2.3 / ^4.3.0 |
| Animations | React Native Reanimated | ^4.3.1 |
| ML Inference | ONNX Runtime React Native | ^1.24.3 |
| Camera | expo-camera | ~17.0.10 |
| Image Processing | expo-image-manipulator + jpeg-js | ~14.0.8 / ^0.4.4 |
| Safe Area | react-native-safe-area-context | ^5.7.0 |
| Package Manager | pnpm | — |
| Formatter | Prettier | ^3.8.3 |

---

## Architecture

FruityVens follows **Atomic Design** (extended with quarks) with a central state root.

```
App.tsx  ─── single state owner (fruits, transactions, restockEvents)
│            all handlers (handleAddSale, handleRestock, handleEditFruit)
│            all modal visibility flags
│
├── MainLayout (template)
│   ├── TabBar (organism) ─── 4 tabs + low-stock badge
│   └── Screen outlet
│       ├── DashboardScreen   ── revenue, profit, low-stock alerts
│       ├── InventoryScreen   ── fruit grid, 3 FABs (add/restock/scan)
│       ├── HistoryScreen     ── date-grouped transactions, filter toggle
│       └── AnalyticsScreen   ── revenue chart, weekly trend, share
│
└── Modals (rendered at root, stacked above MainLayout)
    ├── AddSaleModal       ── 2-step: pick fruit → enter qty
    ├── RestockModal       ── pick fruit → qty + cost/unit
    ├── EditFruitModal     ── update price & cost price
    ├── FruitDetailModal   ── info + last 3 sales + Add Sale shortcut
    └── CameraDetectModal  ── camera → ONNX inference → tap to add sale
```

### AI Detection Pipeline

```
CameraView capture
  → expo-image-manipulator (letterbox resize to 640×640)
  → jpeg-js (RGBA pixel decode)
  → Float32Array CHW tensor (normalized 0–1, pad=114)
  → YOLOv8n INT8 ONNX model (best_int8.onnx, 3.3 MB)
  → NMS decode → DetectionRow results → AddSaleModal pre-fill
```

Detectable fruits: **apple, banana, grape, mango, orange**

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Expo CLI (`pnpm add -g expo-cli`)
- Android Studio or Xcode (for device/emulator)

### Installation

```bash
git clone https://github.com/adam-ctrlc/FruityVens.git
cd FruityVens
pnpm install
```

### Running (Expo Go)

```bash
pnpm start          # Metro bundler
pnpm android        # Android emulator
pnpm ios            # iOS simulator
```

> **Note:** Camera fruit detection (`CameraDetectModal`) requires a **dev build** — `onnxruntime-react-native` is a native module not included in Expo Go.

### Dev Build (required for AI detection)

```bash
pnpm expo prebuild
pnpm expo run:android   # or run:ios
```

---

## Project Structure

```
FruityVens/
├── App.tsx                        # Root state, handlers, modal orchestration
├── app.json                       # Expo config (plugins, asset patterns)
├── global.css                     # NativeWind / Tailwind v4 CSS entry
├── assets/
│   └── models/
│       └── best_int8.onnx         # YOLOv8n INT8 (3.3 MB, bundled)
└── src/
    ├── quarks/                    # Design tokens (colors, spacing, typography)
    ├── components/
    │   ├── atoms/                 # Button, Input, ThemedText, FruitAvatar, Skeleton, Badge
    │   ├── molecules/             # StatCard, FruitCard, FilterToggle, BarChartRow, …
    │   ├── organisms/             # FruitGrid, HistoryList, AddSaleModal, CameraDetectModal, …
    │   └── templates/             # MainLayout
    ├── screens/                   # DashboardScreen, InventoryScreen, HistoryScreen, AnalyticsScreen
    ├── services/
    │   └── FruitDetectionService.ts   # Full ONNX inference pipeline
    ├── hooks/
    │   └── useFirstLoad.ts        # Skeleton gating on first mount
    ├── data/
    │   └── mockData.ts            # Seed fruits, transactions, restock events
    └── types/
        ├── index.ts               # Fruit, Transaction, RestockEvent, FruitStat, DaySection
        └── detection.ts           # FruitDetection, FruitDetectionResult, FruitDetectionError
```

---

## Key Features

- **Dashboard** — today's revenue, profit, transaction count, top fruit; low-stock alert banners
- **Inventory** — searchable fruit grid with cost price, stock level, and profit margin per unit
- **Add Sale** — 2-step modal: pick fruit → enter quantity → live total preview → confirm; decrements stock
- **Restock** — log incoming supply with cost per unit; weighted-average cost price update
- **Edit Fruit** — update selling price and cost price directly from inventory
- **History** — transactions grouped by day with daily revenue and profit totals; Today / Week / All filter
- **Analytics** — horizontal revenue chart with profit margin %, 7-day weekly trend, share daily summary
- **Fruit Detail** — bottom sheet with fruit stats, last 3 transactions, and Add Sale shortcut
- **AI Camera Scan** — point camera at fruit → YOLOv8 identifies it → tap result to open Add Sale
- **Skeleton loading** — Reanimated shimmer on first screen mount
- **Low-stock alerts** — critical (<10 kg) / low (10–30 kg) badges on Inventory tab and Dashboard

---

## Development Workflow

```bash
pnpm start --clear      # Start Metro with cache cleared
pnpm format             # Format all src/**/*.{ts,tsx} with Prettier
pnpm format:check       # CI format check (no writes)
pnpm exec tsc --noEmit  # TypeScript type check
```

All state lives in `App.tsx`. To add a new feature:

1. Update types in `src/types/index.ts` if needed
2. Add seed data to `src/data/mockData.ts`
3. Add handler in `App.tsx` inside `useCallback`
4. Build atoms → molecules → organisms → screen
5. Wire modal visibility and handlers through props

---

## Coding Standards

- **TypeScript strict mode** — no `any`, all props explicitly typed
- **pnpm only** — never `npm install` or `npx` for package operations
- **No emojis** — all icons via `@expo/vector-icons` Ionicons; `FruitAvatar` uses colored initials
- **Atomic Design hierarchy** — quarks → atoms → molecules → organisms → templates → screens; imports only flow downward
- **No inline styles for dynamic values** — NativeWind classes for static; `style={{ width: \`${pct}%\` }}` for runtime-computed values (Tailwind cannot handle these)
- **Performance** — `React.memo` on list items; `useCallback` on all handlers and `renderItem`; `useMemo` on derived lists and aggregations
- **No comments** — only when WHY is non-obvious (hidden constraint, workaround, subtle invariant)
- **No backwards-compat hacks** — delete unused code outright

### Naming

| Layer | Convention |
|---|---|
| Components | PascalCase (`FruitCard.tsx`) |
| Hooks | camelCase prefixed `use` (`useFirstLoad.ts`) |
| Services | PascalCase (`FruitDetectionService.ts`) |
| Types | PascalCase interfaces, no `I` prefix |
| Barrel exports | `index.ts` in each layer folder |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

Quick summary:

1. Fork the repo and create a branch from `main`
2. Follow the coding standards above
3. Run `pnpm exec tsc --noEmit` and `pnpm format:check` before pushing
4. Open a pull request with a clear description of what changed and why

---

## License

Apache License 2.0 — see [LICENSE](LICENSE) for the full text.
