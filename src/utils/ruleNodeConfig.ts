/**
 * Centralized helpers for parsing and serializing rule node `config`.
 * Node config is stored as a JSON string on the wire. All parse/stringify
 * operations on it should go through these two functions so the schema can
 * be changed in one place.
 */

export function parseNodeConfig<T = unknown>(raw: string | object): T {
  if (typeof raw === 'string') {
    return JSON.parse(raw) as T;
  }
  return raw as T;
}

export function serializeNodeConfig(config: unknown): string {
  if (typeof config === 'string') return config;
  return JSON.stringify(config);
}
