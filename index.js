const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { response } = require('express');
const cors = require('cors')
require('dotenv').config()
const { json } = require('express/lib/response');
const port = process.env.PORT || 8000;

app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!')
})
const uri = "mongodb+srv://newTask:8OFaZKhXpwjLOcvl@cluster0.yuaxm5x.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});




async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        console.log('Your database is connected');
        app.get('/allTask', async (req, res) => {
            try {
                const taskCollection = client.db("TaskData").collection('AllTask');
                const query = {};
                const tasks = await taskCollection.find(query).toArray();
                res.send(tasks);
            } catch (error) {
                console.error('Error retrieving tasks:', error);
                res.status(500).json({ error: 'An error occurred while fetching tasks.' });
            }
        });


        app.post('/allTask', async (req, res) => {
            const taskCollection = client.db("TaskData").collection('AllTask');
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send({ success: true, result });


        });
        app.put('/allTask/start/:id', async (req, res) => {
            const taskCollection = client.db("TaskData").collection('AllTask');
            const id = req.params.id;
            //condition er maddome j request dicce she admin kina dekhsi,jodi tar role admin hoi ta hole she onno jon k admin dite parbe,,noito parbena...fornidden maessage dibe

            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: { status: 'Progress' },//database user role addmin hishebe set hobe
            }
            const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send({ result });
        });
        app.put('/allTask/complete/:id', async (req, res) => {
            const taskCollection = client.db("TaskData").collection('AllTask');
            const id = req.params.id;
            //condition er maddome j request dicce she admin kina dekhsi,jodi tar role admin hoi ta hole she onno jon k admin dite parbe,,noito parbena...fornidden maessage dibe

            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: { status: 'Complete' },//database user role addmin hishebe set hobe
            }
            const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send({ result });
        });

        app.get('/allTask/status', async (req, res) => {
            try {
                const task = req.params.status
                const taskCollection = client.db("TaskData").collection('AllTask');
                const query = { task: task };
                const tasks = await taskCollection.find(query).toArray();
                res.send(tasks);
            } catch (error) {
                console.error('Error retrieving tasks:', error);
                res.status(500).json({ error: 'An error occurred while fetching tasks.' });
            }
        });

        app.get('/myTask', async (req, res) => {

            const taskCollection = client.db("TaskData").collection('AllTask');
            const { email } = req.query
            const myTask = await taskCollection.find({ email }).toArray();
            res.send(myTask);

        });



    }
    finally {
    }

}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`Task manager listening on port ${port}`);
});
