import { Test, TestingModule } from '@nestjs/testing';
import { ResponseLoggingInterceptor } from './response-logging.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { createMockExecutionContext } from '../helpers/mock-execution-context.helper';
import { of } from 'rxjs';

describe('ResponseLogggingInterceptor', () => {
    let interceptor: ResponseLoggingInterceptor;

    beforeEach(async () => {
        const module: TestingModule = await Test
        .createTestingModule({
            providers: [ResponseLoggingInterceptor],
        }).compile();

        interceptor = module.get<ResponseLoggingInterceptor>(
            ResponseLoggingInterceptor
        );
    })

    it('should log and format the response', done => {
        const mockExecutionnContext: ExecutionContext =
        createMockExecutionContext('mock-token');

        const callHandler: CallHandler = {
            // Simulate a handler returning an observable with
            // data
            handle: () => of({ data: 'test' }),
        }

        interceptor.intercept(mockExecutionnContext, callHandler).subscribe(
            response => {
                expect(response).toHaveProperty('success', true);
                expect(response).toHaveProperty('data',
                { data: 'test' });
                expect(response).toHaveProperty('timestamp');
                done();
            }
        )
    })
})