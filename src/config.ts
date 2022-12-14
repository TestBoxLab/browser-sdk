import { LoginEvent, NavigateEvent } from "./messaging/incoming";

export interface TestBoxConfig {
  allowFullStory?: boolean;
  logLevel?: string;
  targetOrigin?: string;
  linkTargetLoopInterval?: number;
  healthCheckInterval?: number;
  window?: Window;

  navigateHandler?: (url: NavigateEvent) => Promise<void>;
  loginHandler?: (props: LoginEvent) => Promise<string | boolean>;
}

declare global {
  interface Window {
    __tbxConfig?: TestBoxConfig;
  }
}

export function getTargetOrigin() {
  return window.__tbxConfig?.targetOrigin || ".testbox.com";
}

export function getLogLevel() {
  return window.__tbxConfig.logLevel || "none";
}

export function getConfigItem<K extends keyof TestBoxConfig>(
  key: K,
  fallback?: TestBoxConfig[K]
): TestBoxConfig[K] {
  return (window.__tbxConfig ? window.__tbxConfig[key] : undefined) || fallback;
}
