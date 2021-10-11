//Bring in the express server and create application
let express = require('express'); // require function resolves libraries and modules in the Node search path
let app = express();
let pieRepo = require('./repos/pieRepo');
let errorHelper = require('./helpers/errorHelpers');
let cors = require('cors');
//Use the express Router object
let router = express.Router();

//Configure middleware to support JSON data parsing in request object
app.use(express.json());

//https:expressjs.com/en/resources/middleware/cors.html
//Configure CORS
app.use(cors());

//Create GET to return a list of all pies
router.get('/', function (req, res, next){ // the foward slash / simply directs someone into this endpoint 
pieRepo.get(function (data){
    res.status(200).json({
        "status": 200,
        "statusText": "OK",
        "message": "All pies are retrieved.",
        "data": data
    });
}, function(err){
    next(err); 
});
});

//create GET/search?id=n&name=str to search for pies by 'id' and/or 'name'
router.get('/search', function (req, res, next){
    let searchObject = {
        "id": req.query.id,
        "name": req.query.name
    };

    pieRepo.search(searchObject, function(data){
        res.status(200).json({
            "status":200,
            "statusText": "OK",
            "message": "All pies retrieved",
            "data": data
        });
    }, function (err){
        next (err);
    });
});

//Create GET/id to return a single pie
router.get('/:id', function (req, res, next){
    pieRepo.getById(req.params.id, function (data){
        if (data) {
            res.status(200).json ({
                "status":200,
                "statusText":"OK",
                "message":"Single pie retrieved",
                "data": data
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The pie '" + req.params.id + "' could not be found."
                }

            });
        }
    }, function (err){
        next (err);
    });
});

router.post('/', function (req, res, next){
    pieRepo.insert(req.body, function(data){
        res.status(201).json({
            "status":201,
            "statusText":"Created",
            "message":"New Pie Added.",
            "data": data
        });
    }, function(err){
        next(err);
    });
})

router.put('/:id', function (req, res, next){
    pieRepo.getById(req.params.id, function (data){
        if (data){
            //Attempt to update the data
            pieRepo.update(req.body, req.params.id, function (data){
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message":"Pie '" +req.params.id + "' updated.",
                    "data": data
                });
            });
        }
        else {
            res.status(404).json({
                "status":404,
                "statusText":"Not Found",
                "message": "The pie '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The pie '" + req.params.id + "' could not be found."    
                }    
              });
        }
    }, function(err){
        next(err);
    });
});

router.delete('/:id', function (req, res, next){
    pieRepo.getById(req.params.id, function (data){
        if (data) {
            //Attempt to delete the data
            pieRepo.delete(req.params.id, function (data){
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message":"Pie '" +req.params.id + "' updated.",
                    "data": data               
                 });
            });
        }
        else {
            res.status(404).json({
                "status":404,
                "statusText":"Not Found",
                "message": "The pie '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The pie '" + req.params.id + "' could not be found."    
                }    
            });
        }
    }, function(err){
        next(err);
    });
});

router.patch('/:id', function (req, res, next){
    pieRepo.getById(req.params.id, function(data){
        if (data){
            //Attempt to update the data
            pieRepo.update(req.body, req.params.id, function (data){
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message":"Pie '" +req.params.id + "' updated.",
                    "data": data  
                });
            });
        }
        else {
            res.status(404).json({
                "status":404,
                "statusText":"Not Found",
                "message": "The pie '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The pie '" + req.params.id + "' could not be found."    
                }    
            });
        }
    }, function(err){
        next(err);
    });
});
//configure router so all routes are prefixed with /api/v1
app.use('/api/', router); // this lines simply means i want to add something here => /api (to the api)

//configure exception logger to console
app.use(errorHelper.logErrorsToConsole);
//configure the exception logger to file
app.use(errorHelper.logErrorsToFile);
//configure client error handler
app.use(errorHelper.clientErrorHandler);
//configure catch-all exception middleware last
app.use(errorHelper.errorHandler);


//Create server to listen to port 5000
let server = app.listen(5000, ()=> console.log("Listening to port 5000."));

//Dont forget to add start on your package.json "start": "nodemon index.js",