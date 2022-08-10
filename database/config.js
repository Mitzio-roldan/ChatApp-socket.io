
const mongoose = require('mongoose');

const dbConnection = async() => {

try{
    await mongoose.connect(process.env.MONGO_CNN)
    console.log('Base ok');
}
catch{
    throw new Error('Error DB')
}

}
module.exports = dbConnection