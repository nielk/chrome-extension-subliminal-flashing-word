import { Console, Effect, Schedule, pipe } from "effect"
import { PositiveInterger, Whole } from "./arithmetic"
import { PositiveWord, postiveWordList } from "./model/PositiveWord"
import { Coord, Height, Width, X, Y } from "./model/Geometry"

const SUBLIMINAL_DURATION = PositiveInterger(33.33)
const WAIT_DURATION = PositiveInterger(3000)

function randInt<N extends number, R extends number>(value: PositiveInterger<N>): Whole<PositiveInterger<R>> {
    const rand = Math.round(Math.random() * value) as R
    return rand
}

function generatePositiveWord(dict: ReadonlyArray<PositiveWord>) {
    const nb = randInt(dict.length - 1)
    const word = dict[nb]

    if(word) {
        return Effect.succeed(word)
    } else {
        return Effect.fail('No positive word found')
    }
}

function createDIVWithText(text: string) {
    return Effect.try({
        try: () => {
            const newDiv = document.createElement('div')
            const newContent = document.createTextNode(text)
        
            newDiv.appendChild(newContent)
            return newDiv
        },
        catch: (unknown) => new Error(`something went wrong ${unknown}`)
    })
}

function appendDivIntoDiv(child: HTMLDivElement) {
    return Effect.try({
        try: () => document.body.appendChild(child),
        catch: (unknown) => new Error(`something went wrong ${unknown}`)
      })
}

function removeDivFromDiv(element: HTMLDivElement) {
    return Effect.try({
        try: () => element.remove(),
        catch: (unknown) => new Error(`something went wrong ${unknown}`)
    })
}

function generateRandomCoord({ width, height }: { width: Width, height: Height }) {
    return Effect.try({
        try: () => {
            const randX = X(randInt(width))
            const randY = Y(randInt(height))
        
            return Coord(randX, randY)
        },
        catch: (unknown) => new Error(`something went wrong ${unknown}`)
    })
}

function setCoordOfDiv(element: HTMLDivElement, { x, y }: Coord) {
    return Effect.try({
        try: () => {
            element.style.position = 'fixed'
            element.style.top = `${y}px`
            element.style.left = `${x}px`
        
            return element
        },
        catch: (unknown) => new Error(`something went wrong ${unknown}`)
    })
}

const colors = [
    'red',
    'blue',
    'green',
    'yellow',
    'pink',
    'orange'
]

function setWordStyle(element: HTMLDivElement) {
    return Effect.try({
        try: () => {
            const rand = randInt(colors.length - 1)
            element.style.color = colors[rand]
            element.style.fontSize = '1.5rem'
        
            return element
        },
        catch: (unknown) => new Error(`something went wrong ${unknown}`)
    })
}

const setDivPosition = (child: HTMLDivElement) => pipe(
    Effect.succeed({ width: Width(window.innerWidth), height: Height(window.innerHeight) }),
    Effect.flatMap(generateRandomCoord),
    Effect.flatMap(setCoordOfDiv.bind(null, child)),
)

const flashPositiveWord = Effect.Do.pipe(
    Effect.flatMap(() => Effect.succeed(postiveWordList)),
    Effect.flatMap(generatePositiveWord),
    Effect.flatMap(createDIVWithText),
    Effect.flatMap(setWordStyle),
    Effect.tap(setDivPosition),
    Effect.flatMap((element) => 
        pipe(
            appendDivIntoDiv(element),
            Effect.tap((e) => Effect.repeat(Effect.succeed(e), flashDelay)),
            Effect.flatMap(removeDivFromDiv),
        )
    ),
    Effect.flatMap(Console.log)
)

const flashDelay = Schedule.addDelay(
    Schedule.recurs(1),
    () => `${SUBLIMINAL_DURATION} millis`
)

const waitDelay = Schedule.addDelay(Schedule.forever, () => `${WAIT_DURATION} millis`)

export const infiniteFlashingPositiveWord = Effect.repeat(flashPositiveWord, waitDelay)