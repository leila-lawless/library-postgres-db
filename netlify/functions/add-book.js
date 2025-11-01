const { Pool } = require('pg');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const { title, author, year, description } = JSON.parse(event.body);
    
    // Simple insert query
    const result = await pool.query(
      'INSERT INTO books (title, author, year, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, author, year, description]
    );
    
    await pool.end();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result.rows[0])
    };
  } catch (error) {
    await pool.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
