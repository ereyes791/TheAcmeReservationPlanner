// server/db.js

const { Client } = require('pg');

const client = new Client({
    user: "esteban",
    password: "123456",
    host: "localhost",
    port: 5432,
    database: "acme_hr_db",
});

async function connect() {
  try {
    await client.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
}

async function createTables() {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS restaurants (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS reservations (
        id UUID PRIMARY KEY,
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
        customer_id UUID REFERENCES customers(id) NOT NULL
      );
    `);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables', error);
  }
}

async function seedData() {
  try {
    await client.query(`
      INSERT INTO customers (id, name) VALUES
      ('e93d6f53-57d3-40f7-8d9d-5d84e5c7fc4e', 'John Doe'),
      ('60905e7d-d887-42d3-b22c-25fca2905a21', 'Jane Smith');

      INSERT INTO restaurants (id, name) VALUES
      ('31d3c2e2-5ebf-4b7e-baa0-d8ed20ee39a3', 'Restaurant A'),
      ('33dd2fe9-d00d-4963-9c46-7c543788105c', 'Restaurant B');
    `);
    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data', error);
  }
}

async function createCustomer(name) {
  try {
    const result = await client.query('INSERT INTO customers (id, name) VALUES (uuid_generate_v4(), $1) RETURNING *', [name]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating customer', error);
  }
}

async function createRestaurant(name) {
  try {
    const result = await client.query('INSERT INTO restaurants (id, name) VALUES (uuid_generate_v4(), $1) RETURNING *', [name]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating restaurant', error);
  }
}

async function fetchCustomers() {
  try {
    const result = await client.query('SELECT * FROM customers');
    return result.rows;
  } catch (error) {
    console.error('Error fetching customers', error);
  }
}

async function fetchRestaurants() {
  try {
    const result = await client.query('SELECT * FROM restaurants');
    return result.rows;
  } catch (error) {
    console.error('Error fetching restaurants', error);
  }
}

async function createReservation(date, party_count, restaurant_id, customer_id) {
  try {
    const result = await client.query('INSERT INTO reservations (id, date, party_count, restaurant_id, customer_id) VALUES (uuid_generate_v4(), $1, $2, $3, $4) RETURNING *', [date, party_count, restaurant_id, customer_id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating reservation', error);
  }
}

async function destroyReservation(reservation_id) {
  try {
    await client.query('DELETE FROM reservations WHERE id = $1', [reservation_id]);
    console.log('Reservation deleted successfully');
  } catch (error) {
    console.error('Error deleting reservation', error);
  }
}

module.exports = {
  client,
  connect,
  createTables,
  seedData,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation,
};
