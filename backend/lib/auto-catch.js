const autoCatch = (fn) => ((req, res, next) =>{
    Promise.resolve(fn(req, res, next))
    .then(result => result)
    .catch((err) => next(err));
});

module.exports = {
    autoCatch
}



