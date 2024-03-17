// server/index.js

const express = require('express');
const bodyParser = require('body-parser');
const { connect, createTables, seedData, createCustomer, createRestaurant, fetchCustomers, fetchRestaurants, createReservation, destroyReservation } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Initialize database connection
connect()
  .then(() => createTables())
  .then(() => seedData()) // Call seedData function after tables are created
  .catch(err => console.error('Error initializing application', err));

// Routes
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await fetchCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/customers', async (req, res) => {
    try {
        const { name } = req.body;
        const customer = await createCustomer(name);
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await fetchRestaurants();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/reservations', async (req, res) => {
  // Implement fetching reservations

});

app.post('/api/customers/:id/reservations', async (req, res) => {
  // Implement creating reservation
  try {
    const { date, party_count, restaurant_id } = req.body;
    const reservation = await createReservation(date, party_count, restaurant_id, req.params.id);
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/customers/:customer_id/reservations/:id', async (req, res) => {
  // Implement deleting reservation
    try {
        await destroyReservation(req.params.id);
        res.json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Error handling route
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
