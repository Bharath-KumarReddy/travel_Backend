const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect('mongodb+srv://bharathkumar:bharathkumar@cluster0.xhxxcec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    }catch(err){
        console.log(err)
    }
}

module.exports = connectDB;
