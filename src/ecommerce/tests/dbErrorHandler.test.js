const { errorHandler } = require('../helpers/dbErrorHandler');

describe('errorHandler', () => {
    it('returns a friendly "already exists" message for duplicate key errors (code 11000)', () => {
        const dupError = {
            code: 11000,
            message:
                'E11000 duplicate key error index: users.$email_1 dup key: { : "a@b.com" }'
        };
        expect(errorHandler(dupError)).toBe('Email already exists');
    });

    it('falls back to a generic unique message when the field name cannot be parsed', () => {
        const dupError = { code: 11000 }; // no message -> parsing throws -> fallback
        expect(errorHandler(dupError)).toBe('Unique field already exists');
    });

    it('returns "Something went wrong" for an unrecognized error code', () => {
        expect(errorHandler({ code: 9999, message: 'boom' })).toBe(
            'Something went wrong'
        );
    });

    it('returns an empty string when there is no code and no validation errors', () => {
        expect(errorHandler({})).toBe('');
    });
});
