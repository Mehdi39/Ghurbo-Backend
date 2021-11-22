import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.axafy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri)

async function db_connect () {
    try {

        await client.connect();
        const ghurboDatabase = client.db('ghurbo')
        const tourCollections = ghurboDatabase.collection('tours')
        const vehicleCollections = ghurboDatabase.collection('vehicles')
        const hotelCollections = ghurboDatabase.collection('hotel')
        const orderCollections = ghurboDatabase.collection('order')


        // GET API geting all tour package
        app.get('/allpackage', async (req, res) => {
            const cursor = tourCollections.find({})
            const data = await cursor.toArray()
            res.json(data)
        })

        // GET API managing all orders
        app.get('/manageorders', async (req, res) => {
            const cursor = orderCollections.find({})
            const data = await cursor.toArray()
            res.json(data);
        })

        // GET API get single tour by id
        app.get("/allpackage/:id", async (req, res) => {
            const id = req.params.id
            const query = {_id: ObjectId(id)}

            const service = await tourCollections.findOne(query)

            res.send(service)
          });

        // GET API getting Car service
        app.get('/allcar', async (req, res) => {
            const cursor = vehicleCollections.find({})
            const data = await cursor.toArray()
            res.json(data)
        })

        // GET API getting Hotel Booking service
        app.get('/allhotel', async(req, res) => {
            const cursor = hotelCollections.find({})
            const data = await cursor.toArray()
            res.json(data)
        })

        app.get('/booking', async(req, res) => {
            const query = {email: req.query.email}
            const cursor = orderCollections.find(query)
            const service = await cursor.toArray();
            res.send(service)
        })

        // POST API adding tour package
        app.post('/addpackage', async(req, res) => {
            const data = req.body
            console.log(data)

            const result = await tourCollections.insertOne(data)
            res.send(result)
        })

        // POST API adding vehicles service
        app.post('/addcar', async(req, res) => {
            const data = req.body
            
            const result = await vehicleCollections.insertOne(data)
            res.send(result)
        })

        // POST API adding Hotel/room booking services
        app.post('/addhotel', async(req, res) => {
            const data = req.body
            const result = await hotelCollections.insertOne(data)
            res.send(result)
        })

        // POST API new order
        app.post('/addorder', async (req, res) => {
            const data = req.body
            console.log(data)
            const result = await orderCollections.insertOne(data)
            res.send(result)
        })

        // DELETE API deleting according to _id
        app.delete('/cancelOrder', async (req, res) => {
            const result = await orderCollections.deleteOne({
                _id: ObjectId(req.query.pdID),
            })
            res.send(result)
        })

        // PUT API updating order by _id
        app.put('/updateorder', async (req, res) => {
            const filter = { _id: ObjectId(req.query.pdID) }
            const data = req.body
            const options = { upsert: true}

            const update = { 
                $set: {
                    status: data.status
                }
            }

            const result = await orderCollections.updateOne(
                filter,
                update,
                options
            )
            res.send(result);
        })
       
    } finally {
        // await client.close()
    }
}

db_connect().catch(console.dir)

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("Welcome to Express.js")
})

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})