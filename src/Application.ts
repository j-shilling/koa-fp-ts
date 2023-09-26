/** @since 0.0.1 */

import Koa, { DefaultContext } from 'koa';
import { Middleware } from './Middleware';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

export interface Application<
    S1 = void,
    R1 = DefaultContext,
    E = Error,
    A1 = unknown,
    S2 extends S1 = S1,
    R2 extends R1 = R1,
    A2 extends A1 = A1
> {
    readonly _tag: 'Application';
    readonly middleware:
    [Middleware<S1, R1, E, A1, S2, R2, A2>]
    | Middleware<S1, R1, E, A1, S2, R2, A2>[]
};

export const of: <
    S1 = void,
    R1 = DefaultContext,
    E = Error,
    A1 = unknown,
    S2 extends S1 = S1,
    R2 extends R1 = R1,
    A2 extends A1 = A1
>(a: Middleware<S1, R1, E, A1, S2, R2, A2>) => Application<S1, R1, E, A1, S2, R2, A2> = (a) => ({
    _tag: 'Application',
    middleware: [a],
})

export const toKoa = <
    S1 = void,
    R1 = DefaultContext,
    E = Error,
    A1 = unknown,
    S2 extends S1 = S1,
    R2 extends R1 = R1,
    A2 extends A1 = A1
    >(ma: Application<S1, R1, E, A1, S2, R2, A2>): Koa<S2, R2> => {
        return ma.middleware.reduce(
            (app: Koa<any, any>, f: Middleware<any, any, any, any, any, any, any>) => app.use(
                (ctx, next) => {
                    const program = pipe(
                        f(ctx.state)(ctx),
                        TE.flatMapIO(([state, result]) => () => {
                            ctx.state = state;
                            ctx.status = result.status;
                        }),
                        TE.flatMapTask(_ => next),
                    );
                    return program();
                }
            ),
            new Koa<S1, R1>(),
        );
    };
