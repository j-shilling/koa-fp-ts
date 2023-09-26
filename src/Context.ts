/** @since 0.0.1 */

import { DefaultContext, ParameterizedContext } from "koa";

export type Context<R = DefaultContext, A = unknown> =
    Readonly<Omit<ParameterizedContext<never, R, A>, 'state'>>;
