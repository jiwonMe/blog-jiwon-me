# @jiwonme/jds

A React component library built with TypeScript and Tailwind CSS.

## Features

- 🚀 **Automated Build System**: Uses tsup for fast, optimized builds
- 📦 **Tree-shakable**: Individual component exports for optimal bundle size
- 🎨 **Tailwind CSS**: Styled with Tailwind CSS for consistent design
- 📝 **TypeScript**: Full TypeScript support with generated type definitions
- 🔄 **Auto-generated Exports**: Automatically manages package exports and build entries

## Installation

```bash
npm install @jiwonme/jds
```

## Usage

### Import the entire library
```typescript
import { Button } from "@jiwonme/jds";
```

### Import individual components (recommended for tree-shaking)
```typescript
import { Button } from "@jiwonme/jds/components/ui/button";
import { cn } from "@jiwonme/jds/lib/utils";
```

### Import styles
```css
@import "@jiwonme/jds/globals.css";
```

## Development

### Adding New Components

1. Create your component file in the `src/` directory
2. Run the update script to automatically generate exports:
   ```bash
   npm run update-exports
   ```
3. Build the package:
   ```bash
   npm run build
   ```

The `update-exports` script will automatically:
- Scan the `src/` directory for TypeScript files
- Update `package.json` exports
- Update `tsup.config.ts` entry points

### Available Scripts

- `npm run build` - Build the package with tsup and generate CSS
- `npm run dev` - Start development mode with file watching (rebuilds on changes)
- `npm run check-types` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run update-exports` - Auto-generate exports and entries
- `npm run generate:component` - Generate a new component with Turbo

### Development Workflow

#### Watch Mode Development

The package includes a watch mode that automatically rebuilds when files change:

```bash
# Run just the jds package in watch mode
cd packages/jds && npm run dev

# Or run all packages in development mode (recommended)
npm run dev  # from project root
```

When you run `npm run dev` from the project root, Turbo will automatically start:
- **Web app** on `http://localhost:3000`
- **Docs app** on `http://localhost:3001` 
- **JDS package** in watch mode (rebuilds on file changes)

This means any changes to components in the `@jds` package will automatically rebuild and be available to the apps that depend on it.

#### Complete Development Workflow Example

Here's a complete example of adding a new component and seeing it work in development:

```bash
# 1. Start development mode (from project root)
npm run dev

# 2. In another terminal, add a new component
cd packages/jds/src/components/ui
# Create your new component file (e.g., input.tsx)

# 3. Update exports automatically
cd packages/jds
npm run update-exports

# 4. The component is now automatically:
#    - Added to tsup build entries
#    - Added to package.json exports
#    - Available for import in your apps
#    - Rebuilt automatically when you make changes (thanks to watch mode)
```

The watch mode will automatically detect your changes and rebuild the package, making your new components immediately available to any apps that depend on the package.

### Project Structure

```
src/
├── components/
│   └── ui/
│       └── button.tsx
├── lib/
│   └── utils.ts
├── styles/
│   └── globals.css
└── index.ts
```

### Build Output

The build process generates:
- **ESM modules** (`.js`) for modern bundlers
- **CommonJS modules** (`.cjs`) for Node.js compatibility
- **Type definitions** (`.d.ts`) for TypeScript support
- **Source maps** for debugging
- **Compiled CSS** from Tailwind

### Exports Structure

The package automatically generates exports based on your file structure:

```json
{
  ".": "./dist/index.js",
  "./components/ui/button": "./dist/components/ui/button.js",
  "./lib/utils": "./dist/lib/utils.js",
  "./globals.css": "./dist/globals.css"
}
```

## Contributing

1. Add your component to the appropriate directory in `src/`
2. Export it from `src/index.ts` if it should be part of the main export
3. Run `npm run update-exports` to update the build configuration
4. Run `npm run build` to test the build
5. Run `npm run check-types` to ensure type safety

## License

MIT 