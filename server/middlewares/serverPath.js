const serverPath = (req, res, next) => {
    // Set the domain for building the public URL
    const protocol = req.protocol;
    const host = req.get('host');
    req.domain = `${protocol}://${host}/`;
    next();
};

module.exports = serverPath;