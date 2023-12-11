import { BrandedType } from "../fp"

export const postiveWordList: ReadonlyArray<PositiveWord> = [
    PositiveWord('Amour'),
    PositiveWord('Compassion'),
    PositiveWord('Tendresse'),
    PositiveWord('Confiance'),
    PositiveWord('Affection'),
    PositiveWord('Partage'),
    PositiveWord('Sérenité')
]

type ValidPositiveWord<T extends string> = T extends `` | ` ${T[number]}` | `${T[number]} ` ? never : T

export type PositiveWord = BrandedType<string, 'PositiveWord'>

export function PositiveWord<T extends string>(word: ValidPositiveWord<T>): PositiveWord {
    return word as unknown as PositiveWord
}
