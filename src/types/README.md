# Types

Types per domain live in `src/types/<domain>.d.ts`. The file `src/types/<domain>.ts` exists only to re-export from the `.d.ts` (and, when needed, from `constants/`). Do not add new type definitions in `.ts` files.

Import from the barrel: `from '@/types/<domain>'` or `from '../../types/<domain>'` (no `.d` in the path).
