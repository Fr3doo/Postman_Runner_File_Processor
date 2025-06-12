# Contributing

Thank you for contributing to this project! To set up the development environment:

```bash
npm install
```

This automatically installs Git hooks via [husky](https://typicode.github.io/husky).

Before submitting a pull request, please make sure to:

1. Run the linter
   ```bash
   npm run lint
   ```
2. Run the tests
   ```bash
   npm test
   ```
3. Husky will automatically run `npm run lint && npm run format` on every commit.
   If the hook fails, fix the reported issues and recommit.

The project uses React with TypeScript, Tailwind CSS and icons from `lucide-react`. Please follow the existing code style and avoid adding additional UI libraries.
