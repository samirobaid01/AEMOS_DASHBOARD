/// <reference types="vite/client" />

/**
 * These declarations help Vite understand how to better bundle our components
 */
interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  readonly VITE_API_URL?: string;
  readonly VITE_MIXPANEL_TOKEN?: string;
  readonly VITE_ENABLE_TELEMETRY_PERSISTENCE?: string;
  readonly VITE_SOCKET_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly hot: {
    readonly data: any;
    accept(): void;
    accept(cb: (newModule: any) => void): void;
    accept(dep: string, cb: (newModule: any) => void): void;
    accept(deps: string[], cb: (newModules: any[]) => void): void;
    prune(cb: () => void): void;
    dispose(cb: (data: any) => void): void;
    decline(): void;
    invalidate(): void;
    on(event: string, cb: (...args: any[]) => void): void;
  };
  readonly glob: (pattern: string) => Record<string, () => Promise<any>>;
}
