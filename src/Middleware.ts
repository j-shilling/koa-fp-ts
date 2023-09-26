/** @since 0.0.1 */

import { TaskEither } from "fp-ts/lib/TaskEither";
import { DefaultContext } from "koa";
import { Context } from "./Context";

export type Middleware<
    S1 = void,
    R1 = DefaultContext,
    E = Error,
    A1 = unknown,
    S2 extends S1 = S1,
    R2 extends R1 = R1,
    A2 extends A1 = A1
> = (state: S1) => (context: Context<R1, A1>) => TaskEither<E, [S2, Context<R2, A2>]>;
