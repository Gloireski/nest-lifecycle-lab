// logger.middleware.spec.ts
import { LoggerMiddleware } from './logger.middleware';

describe('LoggerMiddleware', () => {
    let middleware: LoggerMiddleware;
    beforeEach(() => {
        middleware = new LoggerMiddleware();
    });

    it('should log request details', () => {
        console.log = jest.fn(); // Mock console.log
        const req: any = {
            method: 'GET',
            originalUrl: '/users',
        };
        const res: any = {};
        const next = jest.fn();
        middleware.use(req, res, next);
        expect(console.log).toHaveBeenCalledWith(
            // expect.stringContaining('GET /users')
            expect.stringMatching(/\[.*\] \[GET\] \/users/)
        );
        expect(next).toHaveBeenCalled();
    });
})