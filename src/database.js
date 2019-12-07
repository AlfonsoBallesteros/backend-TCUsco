const mongoose = require('mongoose');

const URI = process.env.MONGOB_URI
            ? process.env.MONGOB_URI:
            'mongodb://localhost/tcusco';

mongoose.connect(URI,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("DB is connected");
});