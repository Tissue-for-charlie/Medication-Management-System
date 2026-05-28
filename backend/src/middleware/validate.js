const { ApiError } = require('../lib/api-error');

function validate({ body, query, params }) {
    return (req, res, next) => {
        try {
            if (body) {
                const r = body.validate(req.body, { abortEarly: false, stripUnknown: true });
                if (r.error) throw new ApiError(400, 'Invalid request body', r.error.details.map(d => d.message));
                req.body = r.value;
            }
            if (query) {
                const r = query.validate(req.query, { abortEarly: false, stripUnknown: true });
                if (r.error) throw new ApiError(400, 'Invalid query parameters', r.error.details.map(d => d.message));
                req.query = r.value;
            }
            if (params) {
                const r = params.validate(req.params, { abortEarly: false, stripUnknown: true });
                if (r.error) throw new ApiError(400, 'Invalid route parameters', r.error.details.map(d => d.message));
                req.params = r.value;
            }
            next();
        } catch (e) {
            next(e);
        }
    };
}

module.exports = { validate };
