export type Length<T extends any[]> =
    [...T]['length'] extends number ? [...T]['length'] : never

export type BuildTuple<L extends number, T extends any[] = []> =
    T extends { length: L } ? T : BuildTuple<L, [...T, any]>

type Add<A extends number, B extends number> =
    Length<[...BuildTuple<A>, ...BuildTuple<B>]>

type Subtract<A extends number, B extends number> =
    BuildTuple<A> extends [...(infer U), ...BuildTuple<B>]
        ? Length<U>
        : never

type MultiAdd<N extends number, A extends number, I extends number> =
    I extends 0 ? A : MultiAdd<N, Add<N, A>, Subtract<I, 1>>

type EQ<A, B> =
    A extends B
        ? (B extends A ? true : false)
        : false

export type SafeEQ<A extends number, B extends number> = AreValid<A, B> extends true ? EQ<A, B> : never

type AtTerminus<A extends number, B extends number> =
    A extends 0
        ? true
        : (B extends 0 ? true : false)

type LT<A extends number, B extends number> =
    AtTerminus<A, B> extends true
        ? EQ<A, B> extends true
            ? false
            : (A extends 0 ? true : false)
        : LT<Subtract<A, 1>, Subtract<B, 1>>

export type SafeLT<A extends number, B extends number> = AreValid<A, B> extends true ? LT<A, B> : never
    
type MultiSub<
    N extends number, D extends number, Q extends number
> = LT<N, D> extends true
    ? Q
    : MultiSub<Subtract<N, D>, D, Add<Q, 1>>

type Multiply<A extends number, B extends number> =
    MultiAdd<A, 0, B>

type Divide<A extends number, B extends number> =
    MultiSub<A, B, 0>

type Modulo<A extends number, B extends number> =
    LT<A, B> extends true ? A : Modulo<Subtract<A, B>, B>

export type PositiveInterger<T extends number> =
    `${T}` extends `-${string}` ? never : T

export function PositiveInterger<N extends number>(n:PositiveInterger<N>): PositiveInterger<N> {
    return n
}

export type Whole<T extends number> =
    `${T}` extends `${string}.${string}` ? never : T

export type IsPositive<N extends number> =
    `${N}` extends `-${number}` ? false : true
    
export type IsWhole<N extends number> =
    `${N}` extends `${number}.${number}` ? false : true

type IsValid<N extends number> =
    IsPositive<N> extends true
        ? (IsWhole<N> extends true ? true : false)
        : false

type AreValid<A extends number, B extends number> =
    IsValid<A> extends true
        ? (IsValid<B> extends true ? true : false)
        : false;

export type SafeAdd<A extends number, B extends number> =
    AreValid<A, B> extends true ? Add<A, B> : never

export type SafeSubtract<A extends number, B extends number> =
    AreValid<A, B> extends true ? Subtract<A, B> : never

export type SafeMultiply<A extends number, B extends number> =
    AreValid<A, B> extends true ? Multiply<A, B> : never

export type SafeDivide<A extends number, B extends number> =
    AreValid<A, B> extends true ? Divide<A, B> : never

export type SafeModulo<A extends number, B extends number> =
    AreValid<A, B> extends true ? Modulo<A, B> : never

export function randInt<N extends number, R extends number>(value: PositiveInterger<N>): Whole<PositiveInterger<R>> {
    const rand = Math.round(Math.random() * value) as R
    return rand
}