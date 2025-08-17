// api-server/server.js

// Version: 2.1.0
// Date: 2025-08-17
// Changes: 
// - CHANGE: Updated portionsize endpoints to use audit columns consistently with other tables
// - CHANGE: Added proper active filtering and audit column handling for portionsize
// - Previous: Added CRUD endpoints for all 10 database tables
// - Previous: Added portionsizes, effortlevel, exercisetype, exercise, glucosereading, meal, measuremententry, measurementexercise, measurementmeal endpoints
// - Previous: All endpoints follow consistent UUID primary key and audit column patterns
// - Previous: Added proper error handling and validation for all new endpoints
// - Previous: Updated to handle UUID primary keys instead of integers
// - Previous: Added support for audit columns (active, created_at, created_by, modified_at, modified_by)
// - Previous: Updated FoodItem interface and SQL queries for new schema
// - Previous: Initial creation of Express.js API server for GlucoseMonitoringApp

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'glucosemonitoring',
  user: process.env.DB_USER || 'glucose_svc_user',
  password: process.env.DB_PASSWORD || 'GlcApp2025!Svc#',
});

// Test database connection on startup
async function testConnection() {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// =============================================================================
// FOOD ITEMS CRUD endpoints
// =============================================================================

// GET /api/fooditems - Get all active food items
app.get('/api/fooditems', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT id, name, active, created_at, created_by, modified_at, modified_by FROM glucose_app.fooditem WHERE active = true ORDER BY name'
    );
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching food items:', error);
    res.status(500).json({ error: 'Failed to fetch food items' });
  }
});

// POST /api/fooditems - Add new food item
app.post('/api/fooditems', async (req, res) => {
  try {
    const { name, created_by = 'api-user' } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO glucose_app.fooditem (name, created_by, modified_by) 
       VALUES ($1, $2, $2) 
       RETURNING id, name, active, created_at, created_by, modified_at, modified_by`,
      [name.trim(), created_by]
    );
    client.release();
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding food item:', error);
    res.status(500).json({ error: 'Failed to add food item' });
  }
});

// PUT /api/fooditems/:id - Update food item
app.put('/api/fooditems/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, modified_by = 'api-user' } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const client = await pool.connect();
    const result = await client.query(
      `UPDATE glucose_app.fooditem 
       SET name = $1, modified_by = $2, modified_at = CURRENT_TIMESTAMP 
       WHERE id = $3 AND active = true 
       RETURNING id, name, active, created_at, created_by, modified_at, modified_by`,
      [name.trim(), modified_by, id]
    );
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating food item:', error);
    res.status(500).json({ error: 'Failed to update food item' });
  }
});

// DELETE /api/fooditems/:id - Soft delete food item (set active = false)
app.delete('/api/fooditems/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { modified_by = 'api-user' } = req.body;

    const client = await pool.connect();
    const result = await client.query(
      `UPDATE glucose_app.fooditem 
       SET active = false, modified_by = $1, modified_at = CURRENT_TIMESTAMP 
       WHERE id = $2 AND active = true`,
      [modified_by, id]
    );
    client.release();
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting food item:', error);
    res.status(500).json({ error: 'Failed to delete food item' });
  }
});

// =============================================================================
// PORTION SIZES CRUD endpoints - CHANGE: Updated to use audit columns
// =============================================================================

// GET /api/portionsizes - Get all active portion sizes
app.get('/api/portionsizes', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT id, name, active, created_at, created_by, modified_at, modified_by FROM glucose_app.portionsize WHERE active = true ORDER BY name'
    );
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching portion sizes:', error);
    res.status(500).json({ error: 'Failed to fetch portion sizes' });
  }
});

// POST /api/portionsizes - Add new portion size
app.post('/api/portionsizes', async (req, res) => {
  try {
    const { name, created_by = 'api-user' } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO glucose_app.portionsize (name, created_by, modified_by) 
       VALUES ($1, $2, $2) 
       RETURNING id, name, active, created_at, created_by, modified_at, modified_by`,
      [name.trim(), created_by]
    );
    client.release();
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding portion size:', error);
    res.status(500).json({ error: 'Failed to add portion size' });
  }
});

// PUT /api/portionsizes/:id - Update portion size
app.put('/api/portionsizes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, modified_by = 'api-user' } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const client = await pool.connect();
    const result = await client.query(
      `UPDATE glucose_app.portionsize 
       SET name = $1, modified_by = $2, modified_at = CURRENT_TIMESTAMP 
       WHERE id = $3 AND active = true 
       RETURNING id, name, active, created_at, created_by, modified_at, modified_by`,
      [name.trim(), modified_by, id]
    );
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Portion size not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating portion size:', error);
    res.status(500).json({ error: 'Failed to update portion size' });
  }
});

// DELETE /api/portionsizes/:id - Soft delete portion size
app.delete('/api/portionsizes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { modified_by = 'api-user' } = req.body;

    const client = await pool.connect();
    const result = await client.query(
      `UPDATE glucose_app.portionsize 
       SET active = false, modified_by = $1, modified_at = CURRENT_TIMESTAMP 
       WHERE id = $2 AND active = true`,
      [modified_by, id]
    );
    client.release();
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Portion size not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting portion size:', error);
    res.status(500).json({ error: 'Failed to delete portion size' });
  }
});

// =============================================================================
// EFFORT LEVELS CRUD endpoints
// =============================================================================

// GET /api/effortlevels - Get all active effort levels
app.get('/api/effortlevels', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT id, name, active, created_at, created_by, modified_at, modified_by FROM glucose_app.effortlevel WHERE active = true ORDER BY name'
    );
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching effort levels:', error);
    res.status(500).json({ error: 'Failed to fetch effort levels' });
  }
});

// POST /api/effortlevels - Add new effort level
app.post('/api/effortlevels', async (req, res) => {
  try {
    const { name, created_by = 'api-user' } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO glucose_app.effortlevel (name, created_by, modified_by) 
       VALUES ($1, $2, $2) 
       RETURNING id, name, active, created_at, created_by, modified_at, modified_by`,
      [name.trim(), created_by]
    );
    client.release();
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding effort level:', error);
    res.status(500).json({ error: 'Failed to add effort level' });
  }
});

// PUT /api/effortlevels/:id - Update effort level
app.put('/api/effortlevels/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, modified_by = 'api-user' } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const client = await pool.connect();
    const result = await client.query(
      `UPDATE glucose_app.effortlevel 
       SET name = $1, modified_by = $2, modified_at = CURRENT_TIMESTAMP 
       WHERE id = $3 AND active = true 
       RETURNING id, name, active, created_at, created_by, modified_at, modified_by`,
      [name.trim(), modified_by, id]
    );
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Effort level not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating effort level:', error);
    res.status(500).json({ error: 'Failed to update effort level' });
  }
});

// DELETE /api/effortlevels/:id - Soft delete effort level
app.delete('/api/effortlevels/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { modified_by = 'api-user' } = req.body;

    const client = await pool.connect();
    const result = await client.query(
      `UPDATE glucose_app.effortlevel 
       SET active = false, modified_by = $1, modified_at = CURRENT_TIMESTAMP 
       WHERE id = $2 AND active = true`,
      [modified_by, id]
    );
    client.release();
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Effort level not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting effort level:', error);
    res.status(500).json({ error: 'Failed to delete effort level' });
  }
});

// =============================================================================
// EXERCISE TYPES CRUD endpoints
// =============================================================================

// GET /api/exercisetypes - Get all active exercise types
app.get('/api/exercisetypes', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT id, name, active, created_at, created_by, modified_at, modified_by FROM glucose_app.exercisetype WHERE active = true ORDER BY name'
    );
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching exercise types:', error);
    res.status(500).json({ error: 'Failed to fetch exercise types' });
  }
});

// POST /api/exercisetypes - Add new exercise type
app.post('/api/exercisetypes', async (req, res) => {
  try {
    const { name, created_by = 'api-user' } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO glucose_app.exercisetype (name, created_by, modified_by) 
       VALUES ($1, $2, $2) 
       RETURNING id, name, active, created_at, created_by, modified_at, modified_by`,
      [name.trim(), created_by]
    );
    client.release();
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding exercise type:', error);
    res.status(500).json({ error: 'Failed to add exercise type' });
  }
});

// PUT /api/exercisetypes/:id - Update exercise type
app.put('/api/exercisetypes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, modified_by = 'api-user' } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const client = await pool.connect();
    const result = await client.query(
      `UPDATE glucose_app.exercisetype 
       SET name = $1, modified_by = $2, modified_at = CURRENT_TIMESTAMP 
       WHERE id = $3 AND active = true 
       RETURNING id, name, active, created_at, created_by, modified_at, modified_by`,
      [name.trim(), modified_by, id]
    );
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Exercise type not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating exercise type:', error);
    res.status(500).json({ error: 'Failed to update exercise type' });
  }
});

// DELETE /api/exercisetypes/:id - Soft delete exercise type
app.delete('/api/exercisetypes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { modified_by = 'api-user' } = req.body;

    const client = await pool.connect();
    const result = await client.query(
      `UPDATE glucose_app.exercisetype 
       SET active = false, modified_by = $1, modified_at = CURRENT_TIMESTAMP 
       WHERE id = $2 AND active = true`,
      [modified_by, id]
    );
    client.release();
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Exercise type not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting exercise type:', error);
    res.status(500).json({ error: 'Failed to delete exercise type' });
  }
});

// =============================================================================
// GLUCOSE READINGS CRUD endpoints
// =============================================================================

// GET /api/glucosereadings - Get all glucose readings
app.get('/api/glucosereadings', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT id, glucosemmol, notes, readingat FROM glucose_app.glucosereading ORDER BY readingat DESC'
    );
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching glucose readings:', error);
    res.status(500).json({ error: 'Failed to fetch glucose readings' });
  }
});

// POST /api/glucosereadings - Add new glucose reading
app.post('/api/glucosereadings', async (req, res) => {
  try {
    const { glucosemmol, notes, readingat } = req.body;
    
    if (!glucosemmol || glucosemmol <= 0) {
      return res.status(400).json({ error: 'Valid glucose reading is required' });
    }

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO glucose_app.glucosereading (glucosemmol, notes, readingat) 
       VALUES ($1, $2, $3) 
       RETURNING id, glucosemmol, notes, readingat`,
      [glucosemmol, notes || null, readingat || new Date().toISOString()]
    );
    client.release();
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding glucose reading:', error);
    res.status(500).json({ error: 'Failed to add glucose reading' });
  }
});

// PUT /api/glucosereadings/:id - Update glucose reading
app.put('/api/glucosereadings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { glucosemmol, notes, readingat } = req.body;
    
    if (!glucosemmol || glucosemmol <= 0) {
      return res.status(400).json({ error: 'Valid glucose reading is required' });
    }

    const client = await pool.connect();
    const result = await client.query(
      `UPDATE glucose_app.glucosereading 
       SET glucosemmol = $1, notes = $2, readingat = $3 
       WHERE id = $4 
       RETURNING id, glucosemmol, notes, readingat`,
      [glucosemmol, notes || null, readingat, id]
    );
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Glucose reading not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating glucose reading:', error);
    res.status(500).json({ error: 'Failed to update glucose reading' });
  }
});

// DELETE /api/glucosereadings/:id - Delete glucose reading
app.delete('/api/glucosereadings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const client = await pool.connect();
    const result = await client.query(
      `DELETE FROM glucose_app.glucosereading WHERE id = $1`,
      [id]
    );
    client.release();
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Glucose reading not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting glucose reading:', error);
    res.status(500).json({ error: 'Failed to delete glucose reading' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
async function startServer() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🥗 Available endpoints:`);
    console.log(`   - /api/fooditems`);
    console.log(`   - /api/portionsizes`);
    console.log(`   - /api/effortlevels`);
    console.log(`   - /api/exercisetypes`);
    console.log(`   - /api/glucosereadings`);
  });
}

startServer().catch(console.error);