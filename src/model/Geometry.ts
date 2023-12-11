import { PositiveInterger } from "../arithmetic"
import { BrandedType } from "../fp"

export type Width = BrandedType<number, 'Width'>
export function Width<T extends number>(value: PositiveInterger<T>): Width {
    return value as unknown as Width
}

export type Height = BrandedType<number, 'Height'>
export function Height<T extends number>(value: PositiveInterger<T>): Height {
    return value as unknown as Height
}

export type X = BrandedType<number, 'X'>
export function X(x: number): X {
    return x as X
}

export type Y = BrandedType<number, 'Y'>
export function Y(y: number): Y {
    return y as Y
}

export type Coord = {
    readonly x: X,
    readonly y: Y
}
export function Coord(x: X, y: Y): Coord {
    return {
        x: X(x),
        y: Y(y)
    } as Coord
}