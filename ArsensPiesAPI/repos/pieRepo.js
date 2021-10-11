let fs = require('fs');
// fs is a built in nodemodule that knows how to work with reading and writing files
const FILE_NAME = './assets/pies.json';

let pieRepo = {
    get:function(resolve, reject){
        fs.readFile(FILE_NAME, function(err, data){
              if(err){
                reject(err);
            }
            else{
                resolve(JSON.parse(data));
            }
        });
    },
getById: function(id, resolve, reject){
    //Grabbing the data from our FILE_NAME, and then rejecting if an error occurs.
    fs.readFile(FILE_NAME, function(err,data){
        if(err){
            reject(err);
        }
        //Once the data is acquired, we JSON.parse that data to put it into a real JSON object.
        else{
            let pie = JSON.parse(data).find(p => p.id == id);
            // The (find) above has the function params of which its used to pass the data individually
            //By checking whether the pie's id is equal to the id passed in to the Get by id function
            resolve(pie);
        }
    });
},
//searching for items using different properties apart from id
search: function(searchObject, resolve, reject){
    fs.readFile(FILE_NAME, function(err, data){
        if(err){
            reject(err);
        }
        else{
            let pies = JSON.parse(data);
            //Perform search
            if (searchObject){
                //Example search object
                //let searchObject = {
                    //"id":1,
                    // "name": 'A
            //};
       pies = pies.filter(
           p => (searchObject.id ? p.id == searchObject.id : true)&&
           (searchObject.name ? p.name.toLowerCase().indexOf(searchObject.name.toLowerCase()) >= 0 : true))
          }
          resolve (pies);
    }
    })
},
//inserting a new data which is the pie object
insert: function (newData, resolve, reject) {
    fs.readFile(FILE_NAME, function (err, data){
        if (err) {
            reject (err);
        }
        else {
            // parsing and pushing the data into the pies array
            let pies = JSON.parse(data);
            pies.push(newData);
            
            fs.writeFile(FILE_NAME, JSON.stringify(pies), function (err) {
                if (err){
                    reject (err);
                }
                else {
                    resolve(newData);
                }
            });
        }
    });
},

update: function (newData, id, resolve, reject){ // here we are passing the new data then we are changing the data using the Id
    fs.readFile(FILE_NAME, function (err, data){ // we read the data from our file
        if (err){
            reject(err);
        }
        else {
            let pies = JSON.parse(data); // we then Grab the data and parse it to the pies array
            let pie = pies.find(p => p.id == id); // we find the value of the data based on the id 
            if(pie){
                Object.assign(pie, newData); //it will change the whole properties of the new/updated pie oject we are passing 
                fs.writeFile(FILE_NAME, JSON.stringify(pies), function (err){
                    if(err){
                        reject (err);
                    }
                    else{
                        resolve(newData);
                    }
                });
            }
        }
    });
},
delete: function(id, resolve, reject){
    fs.readFile(FILE_NAME, function(err, data){
        if (err){
            reject (err);
        }
        else {
            let pies = JSON.parse(data) //converting the data into a pies array
            let index = pies.findIndex(p => p.id == id);
            if(index != -1){
                pies.splice(index, 1); 
                fs.writeFile(FILE_NAME, JSON.stringify(pies), function (err){
                    if(err){
                        reject (err);
                    }
                    else{
                        resolve(index);
                    }

                });
             }
        }
    })
}




};

module.exports = pieRepo;

