const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

// mongodb database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8bt64xk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const touristSpotCollection = client.db("touristSpot").collection("spots");

    app.get("/all-spots", async (req, res) => {
      const result = await touristSpotCollection.find().toArray();
      res.send(result);
    });

    app.get("/my-list", async (req, res) => {
      const result = await touristSpotCollection.find().toArray();
      res.send(result);
    });

    app.get("/all-spots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    });

    app.get("/my-list/:email", async (req, res) => {
      const email = req.params.email;
      const query = { user_email: email };
      const result = await touristSpotCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/all-spots", async (req, res) => {
      const newSpot = req.body;
      const result = await touristSpotCollection.insertOne(newSpot);
      res.json(result);
    });

    app.patch("/all-spots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateSpot = req.body;
      const spot = {
        $set: {
          tourists_spot_name: updateSpot.tourists_spot_name,
          country_Name: updateSpot.country_Name,
          location: updateSpot.location,
          short_description: updateSpot.short_description,
          average_cost: updateSpot.average_cost,
          seasonality: updateSpot.seasonality,
          travel_time: updateSpot.travel_time,
          total_visitors_per_year: updateSpot.total_visitors_per_year,
          image: updateSpot.image,
        },
      };
      const result = await touristSpotCollection.updateOne(
        query,
        spot,
        options
      );
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// testing server
app.get("/", (req, res) => {
  res.send("Tourism Management Server is running now!");
});

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
