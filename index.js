const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
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

    app.post("/all-spots", async (req, res) => {
      const newSpot = req.body;
      const result = await touristSpotCollection.insertOne(newSpot);
      res.json(result);
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
