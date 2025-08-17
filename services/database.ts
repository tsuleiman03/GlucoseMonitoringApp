// services/database.ts

// Version: 1.1.0
// Date: 2025-08-16
// Changes: 
// - CHANGE: Updated to use dedicated glucose_app schema
// - CHANGE: Updated to use service account credentials
// - Initial creation of database service for PostgreSQL integration

import { Pool } from 'pg';

// Database configuration with service account and dedicated schema
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'glucosemonitoring',
  user: 'glucose_svc_user',
  password: 'GlcApp2025!Svc#',
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('Database connected successfully');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Food Items CRUD operations
export interface FoodItem {
  id: number;
  name: string;
}

export async function getFoodItems(): Promise<FoodItem[]> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id, name FROM glucose_app.fooditem ORDER BY name');
    client.release();
    return result.rows;
  } catch (error) {
    console.error('Error fetching food items:', error);
    throw new Error('Failed to fetch food items');
  }
}

export async function addFoodItem(name: string): Promise<FoodItem> {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO glucose_app.fooditem (name) VALUES ($1) RETURNING id, name',
      [name]
    );
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error('Error adding food item:', error);
    throw new Error('Failed to add food item');
  }
}

export async function updateFoodItem(id: number, name: string): Promise<FoodItem> {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE glucose_app.fooditem SET name = $1 WHERE id = $2 RETURNING id, name',
      [name, id]
    );
    client.release();
    if (result.rows.length === 0) {
      throw new Error('Food item not found');
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error updating food item:', error);
    throw new Error('Failed to update food item');
  }
}

export async function deleteFoodItem(id: number): Promise<void> {
  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM glucose_app.fooditem WHERE id = $1', [id]);
    client.release();
    if (result.rowCount === 0) {
      throw new Error('Food item not found');
    }
  } catch (error) {
    console.error('Error deleting food item:', error);
    throw new Error('Failed to delete food item');
  }
}

// Close database connection pool (call this when app shuts down)
export async function closePool(): Promise<void> {
  await pool.end();
}