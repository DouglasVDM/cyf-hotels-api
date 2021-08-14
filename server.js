const express = require("express");
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


const pool = new Pool({
  user: 'douglas',
  host: 'localhost',
  database: 'cyf_hotel',
  password: 'PeanutbutteR2020%',
  port: 5432
});


app.get('/', (req, res) => {
  res.send(`I feel like jumping into this POOL!`)
});

// app.get("/hotels", function (req, res) {
//   pool.query('SELECT * FROM hotels', (error, result) => {
//     res.json(result.rows);
//   });
// });

app.get("/customers", function (req, res) {
  pool.query('SELECT * FROM customers', (error, result) => {
    res.json(result.rows);
  });
});

// Create new Hotel
app.post("/hotels", function (req, res) {
  console.log(req.body);
  const newHotelName = req.body.name;
  const newHotelRooms = req.body.rooms;
  const newHotelPostcode = req.body.postcode;

  if (!Number.isInteger(newHotelRooms) || newHotelRooms <= 0) {
    return res
      .status(400)
      .send("The number of rooms should be a positive integer.");
  }

  pool
    .query("SELECT * FROM hotels WHERE name=$1", [newHotelName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("An hotel with the same name already exists!");
      } else {
        const query =
          "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3)";
        pool
          .query(query, [newHotelName, newHotelRooms, newHotelPostcode])
          .then(() => res.send("Hotel created!"))
          .catch((e) => console.error(e));
      }
    });
});

/*
// Create new Customer
app.post("/customers", function (req, res) {
  const {
    name,
    email,
    address,
    city,
    postcode,
    country
  } = req.body;

  pool
    .query("SELECT * FROM customers WHERE name=$1", [name, email, address, city, postcode, country])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("A customer with the same name already exists!");
      } else {
        const query =
          "INSERT INTO hotels ( email, address, city, postcode, country) VALUES ($1, $2, $3, $4, $5)";
        pool
          .query(query, [ name, email, address, city, postcode, country ])
          .then(() => res.send("Customer created!"))
          .catch((e) => console.error(e));
      }
    });
});
*/

app.get("/hotels", function (req, res) {
  const hotelNameQuery = req.query.name;
  let query = `SELECT * FROM hotels ORDER BY name`;

  if (hotelNameQuery) {
    query = `SELECT * FROM hotels WHERE name LIKE '%${hotelNameQuery}%' ORDER BY name`;
  }

  pool
    .query(query)
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

app.get("/hotels/:hotelId", function (req, res) {
  const hotelId = req.params.hotelId;

  pool
    .query("SELECT * FROM hotels WHERE id=$1", [hotelId])
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

app.get("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;

  pool
    .query("SELECT * FROM customers WHERE id=$1", [customerId])
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

app.get("/customers/:customerId/bookings", function (req, res) {
  const customerId = req.params.customerId;
  const customerBooking = req.params.customerBooking;

  pool
    .query("SELECT * FROM customers INNER JOIN bookings ON  WHERE id=$1", [customerId, customerBooking])
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});


app.listen(PORT, function () {
  console.log(`Server is listening on port ${PORT}. Ready to accept requests!`);
});