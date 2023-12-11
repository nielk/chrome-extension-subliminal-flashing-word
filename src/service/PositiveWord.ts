import { Console, Context, Effect } from "effect"

export interface PositiveWordService {
    get: () => Effect.Effect<never, never, void>
}
   
export const PositiveWordService = Context.Tag<PositiveWordService>()

export const PositiveWordServiceLive = PositiveWordService.of({
    get: Console.log
})