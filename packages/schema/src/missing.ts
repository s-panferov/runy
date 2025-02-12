export const DYNAMIC = Symbol();

export interface Dynamic<T> {
  [DYNAMIC]<K extends keyof T>(name: K): T[K];
}

export function dynamic<O extends Dynamic<T>, T>(object: O): O & T {
  return new Proxy(object, {
    get(_, prop) {
      return object[DYNAMIC](prop as any);
    },
  }) as any as O & T;
}

export function missing<O extends object, T>(
  object: O,
  func: (prop: keyof T) => any,
  allow: (string | symbol)[]
): O & T {
  return new Proxy(object, {
    get(_, prop) {
      if (allow.includes(prop)) {
        const value = (object as any)[prop];
        return value;
      } else {
        return func(prop as any);
      }
    },
  }) as any as O & T;
}
