require("dotenv").config();
// const PORT = process.env.PORT || 8000
const {PORT = 8000, DATABASE_URL} = process.env 
const express = require("express");
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")


// DATABASE CONNECTION 
// establish connection
mongoose.connect(DATABASE_URL)

// CONNECTION EVENTS
mongoose.connection
.on("open", () => console.log("Mongoose connection successful."))
.on("close", () => console.log("Mongoose connection closed."))
.on("error", (error) => console.log(error))

// Models
const peopleSchema = new mongoose.Schema({
  name: String,
  image: String,
  title: String
})
const People = mongoose.model("People", peopleSchema )

// Middleware
// cors for preventing cors errors
app.use(cors())
// morgan for logging requests
app.use(morgan("dev"))
// express functionality to recognize incoming request objects as JSON objects
app.use(express.json())

// ROUTES
// test route
app.get("/", (req, res) => {
    res.json({hello: "world"})
})


// index, delete, update, create, show
// inducs - index, destroy, update, create, show (for an json api)

// INDEX - GET - /people - gets all people
// PEOPLE INDEX ROUTE
app.get("/people", async (req, res) => {
    try {
      // fetch all people from database
      const people = await People.find({});
      // send json of all people
      res.json(people);
    } catch (error) {
      // send error as JSON
      res.status(400).json({ error });
    }
  });

// CREATE - POST - /people - create a new person
// PEOPLE CREATE ROUTE
app.post("/people", async (req, res) => {
    try {
        // create the new person
        const person = await People.create(req.body)
        // send newly created person as JSON
        res.json(person)
    }
    catch(error){
        res.status(400).json({ error })
    }
})

// SHOW - GET - /people/:id - get a single person
// PEOPLE SHOW ROUTE
app.get("/people/:id", async (req, res) => {
    try {
      // get a person from the database
      const person = await People.findById(req.params.id);
      // return the person as json
      res.json(person);
    } catch (error) {
      res.status(400).json({ error });
    }
  });

// UPDATE - PUT - /people/:id - update a single person
// PEOPLE UPDATE ROUTE
app.put("/people/:id", async (req, res) => {
    try {
      // update the person
      const person = await People.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      // send the updated person as json
      res.json(person);
    } catch (error) {
      res.status(400).json({ error });
    }
  });

// PEOPLE DELETE ROUTE
app.delete("/people/:id", async (req, res) => {
    try {
        const person = await People.findByIdAndDelete(req.params.id)
        res.status(204).json(person)
    } catch (error) {
        res.status(400).json({ error });
    }
});

// LISTENER
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))