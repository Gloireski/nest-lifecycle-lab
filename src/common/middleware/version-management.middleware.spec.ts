// version-management.middleware.spec.ts
import {
VersionManagementMiddleware
} from './version-management.middleware';

describe('VersionManagementMiddleware', () => {
    let middleware: VersionManagementMiddleware;
    beforeEach(() => {
        middleware = new VersionManagementMiddleware();
    });

    it('should prepend /v1 to requests without a version',
        () => {
            const req: any = {
                originalUrl: '/users',
            };
            const res: any = {
                locals: {},
            };

            const next = jest.fn();

            middleware.use(req, res, next);

            expect(req.originalUrl).toBe('/v1/users');
            expect(next).toHaveBeenCalled();
    });

    it('should correct invalid version to the latest supported version', () => {
        const req: any = {
            originalUrl: '/v3/users',
        };
        const res: any = {
            locals: {},
        };

        const next = jest.fn();

        middleware.use(req, res, next);
        expect(req.originalUrl).toBe('/v2/users');
        expect(res.locals.invalidVersion).toBe(true); // ✅ Vérifier le flag
        expect(next).toHaveBeenCalled();
    });
})