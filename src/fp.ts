export type Optional<T> = T | undefined

export type BrandedType<Type, Name extends string> = Type & { __type: Name }

type Fn = (a: any) => any

type Head<T extends any[]> = T extends [infer H, ...infer _] ? H : never

type Last<T extends any[]> = T extends [infer _]
  ? never
  : T extends [...infer _, infer Tl]
  ? Tl
  : never

type Allowed<T extends Fn[], Cache extends Fn[] = []> = T extends []
  ? Cache
  : T extends [infer Lst]
  ? Lst extends Fn
    ? Allowed<[], [...Cache, Lst]>
    : never
  : T extends [infer Fst, ...infer Lst]
  ? Fst extends Fn
    ? Lst extends Fn[]
      ? Head<Lst> extends Fn
        ? ReturnType<Fst> extends Head<Parameters<Head<Lst>>>
          ? Allowed<Lst, [...Cache, Fst]>
          : never
        : never
      : never
    : never
  : never

type FirstParameterOf<T extends Fn[]> = Head<T> extends Fn
  ? Head<Parameters<Head<T>>>
  : never

type Return<T extends Fn[]> = Last<T> extends Fn ? ReturnType<Last<T>> : never

export function pipe<
  T extends Fn,
  Fns extends T[],
  Allow extends {
    0: [never]
    1: [FirstParameterOf<Fns>]
  }[Allowed<Fns> extends never ? 0 : 1]
>(...args: [...Fns]): (...data: Allow) => Return<Fns>

export function pipe<T extends Fn, Fns extends T[], Allow extends unknown[]>(
  ...args: [...Fns]
) {
  return (...data: Allow) => args.reduce((acc, elem) => elem(acc), data)
}
