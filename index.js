const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// pass:HFAftfLwWXZgu3cr
// user:rainbosoft


app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://rainbosoft:HFAftfLwWXZgu3cr@cluster0.bvcdtsz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// collection 

const UserCollection = client.db("test").collection("user");
const fishChartCollection = client.db("test").collection("fishChart");




async function run() {


    try {

        //    all user  
        app.get('/user', async (req, res) => {
            const query = {};
            const result = UserCollection.find(query);
            const data = await result.toArray();
            res.send(data);
        })
            ;


        // single view user 
        app.get('/singleuser', async (req, res) => {
            const {_id} = req.query;
            // console.log(id);
            const query = {_id: new ObjectId(_id)}
            const result = await UserCollection.findOne(query);
            res.send(result);
          });

        // post user 
        app.post('/user', async (req, res) => {
            const data = req.body;
            const result = await UserCollection.insertOne(data);
            res.send(result);
            console.log(data)
        })


        app.put('/update-user', async (req, res)=>{
        const _id = req.query._id;
        const data = req.body;
        const query = { _id: new ObjectId(_id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                Batch_tag: data.batch,
                status: data.status,
                role: data.role,
            }
        };
        const result = await UserCollection.updateOne(query, updateDoc, options);
        res.send(result)
        console.log(data)
        });




        // get user by email 

        app.get('/user_email', async (req, res)=>{
            const email = req.query.email;
            const query = {email : email}
            const result = await UserCollection.findOne(query);
            res.send(result);
        })
        


        // fish chart collection 
        app.post('/fist_chart', async (req, res)=>{
            const data = req.body;
            const result = await fishChartCollection.insertOne(data);
            res.send(result)
        });

        app.get('/fist_chart', async (req, res)=>{
            const query = {};
            const data = fishChartCollection.find(query);
            const result =await data.toArray();
            res.send(result);
        })


        app.delete('/fish_chart_delete', async (req, res)=>{
            const id = req.query.id;
            const query = {_id: new ObjectId(id)};
            const result = await fishChartCollection.deleteOne(query);
            res.send(result)
            // console.log(id)
        })


    } finally {

    }
}


run();





app.listen(port, function () {
    console.log('Example app listening on port 3000!');
});
