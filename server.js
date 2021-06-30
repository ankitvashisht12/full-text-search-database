const express = require('express')
const { MongoClient } = require('mongodb')

const CONNECTION_URI = 'mongodb://localhost:27017/'

const app = express();
app.use(express.static('./static'));
const PORT = 3002;


const client = new MongoClient( CONNECTION_URI, { useUnifiedTopology: true }); 
client.connect();
app.get('/get', async (req, res, next) => {
    const db = await client.db('adoption');
    const collection = db.collection('pets');
    const pets = await collection.find({
        $text: { $search : req.query.search }
    }, { _id : 0 }).sort({score : { $meta : "textScore" }} ).limit(5).toArray();

    console.log("Result =>", pets)
    res.json( { status: 'ok', pets }).end()
})

app.listen(PORT, () => console.log(`listenting on port ${PORT}`))
