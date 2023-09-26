import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';

import request from 'supertest';

import * as A from '../src/Application';
import { Context } from '../src/Context';


describe('Application', () => {
    it('starts a server', (done) => {
        const app = pipe(
            A.of((s: void) => (ctx: Context) => TE.of([s, { ...ctx, status: 200 }])),
            A.toKoa,
        );

        return request(app.callback())
            .get('/')
            .expect(200, done);
    })
})
