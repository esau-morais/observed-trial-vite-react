# Reading list

A small React app (Vite) that reads books from a separate JSON API.

> This repository is a disposable test fixture for [Observed](https://github.com/esau-morais/observed).

## Develop

```bash
npm install
npm run api   # API on http://127.0.0.1:4010 (set API_PORT to change it)
npm run dev   # Vite dev server
```

The frontend calls the API at `VITE_API_URL`, defaulting to `http://127.0.0.1:4010`.

## Build

```bash
npm run build
npm run preview
```
