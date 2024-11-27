export const DYNAMIC = Symbol();

export interface Dynamic<T> {
  [DYNAMIC]<K extends keyof T>(name: K): T[K];
}

export function dynamic<O extends Dynamic<T>, T>(object: O): O & T {
  return new Proxy(object, {
    get(_, prop) {
      const value = (object as any)[prop];
      if (typeof value === "undefined") {
        return object[DYNAMIC](prop as any);
      } else {
        return value;
      }
    },
  }) as any as O & T;
}

export function missing<O extends object, T>(
  object: O,
  func: (prop: keyof T) => any,
): O & T {
  return new Proxy(object, {
    get(_, prop) {
      const value = (object as any)[prop];
      if (typeof value === "undefined") {
        return func(prop as any);
      } else {
        return value;
      }
    },
  }) as any as O & T;
}
