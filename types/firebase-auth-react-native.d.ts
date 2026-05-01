declare module "firebase/auth" {
  export * from "@firebase/auth";
  import type { Persistence } from "@firebase/auth";

  export function getReactNativePersistence(storage: unknown): Persistence;
}
