// fn received own arguments and if promise is reject, error is caught and propagated

module.exports = (fn) => (req, res, next) => fn(req, res, next).catch(next);
