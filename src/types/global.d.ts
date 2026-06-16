export {};

declare global {
  interface Window {
    Cypress?: unknown;
    db?: import('firebase/firestore').Firestore;
    disableNetwork?: typeof import('firebase/firestore').disableNetwork;
    enableNetwork?: typeof import('firebase/firestore').enableNetwork;
  }
}
