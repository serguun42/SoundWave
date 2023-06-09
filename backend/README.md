# SoundWave Backend

Backend part for SoundWave.

## Config

See [configs.d.ts](./types/configs.d.ts) for type definitions of all parameters with extensive description, then edit an stub files:

- [api.json](./config/api.json)
- [db.json](./config/db.json)
- [hashing.json](./config/hashing.json)

## Commands

1. Install only necessary dependencies – `npm i --production`
2. Compile Typescript – `npm run compile`
3. Run in production mode – `npm run production`

## Development

- Install all dependencies – `npm i`
- Run in dev mode with watch-reload – `npm run dev`
- Check with ESLint – `npm run lint`

## API

OpenAPI docs available at [`api.yml`](./docs/api.yml). Both Swagger and Redoc flavor documenting pages are copied to web-server on build/publish. See [`build.yml`](../.github/workflows/build.yml)

---

### [Main readme](../README.md)
