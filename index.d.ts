export {};

declare global {
  interface Window {
    fallback: unknown;
    define: unknown;
  }
}
