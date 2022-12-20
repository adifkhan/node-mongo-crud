const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// cross origin and middleware
app.use(cors());                //cross connection between client site and server site //
app.use(express.json());        // body parser for data that are sent from client //


// username: adifkhan
// password: PGTYK1f6Z4N2stQc



const uri = "mongodb+srv://adifkhan:PGTYK1f6Z4N2stQc@cluster0.f8j5awq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("foodExpress").collection("users");

        // post/insert user to the database //
        app.post('/user', async (req, res) => {
            const newUser = req.body;

            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });

        // put/update user //
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedUser = req.body;
            const options = { upsert: true };
            const updatedDoc = {
                // $set:updatedUser //
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                }
            };
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // get all users from database //
        app.get('/users', async (req, res) => {
            const quary = {};
            const cursor = userCollection.find(quary);
            const users = await cursor.toArray();
            res.send(users);
        });

        //get a specific user with id from database //
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        //delete a user //
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Node CRUD server is running');
});
app.listen(port, () => {
    console.log('CURD server in running');
});