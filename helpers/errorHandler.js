function errorHandler(err, req, res, next){

    // jwt authentication error
    if(err.name === 'UnauthorizedError'){
        return res.status(401).json({message:'the user is not authorized'});
    }
    
    // validation error
    if(err.name === 'ValidationError'){
        return res.status(401).json(err); 
    }

    // default to 500 server error
    return res.status(500).json({error:err});
}

module.exports = errorHandler;