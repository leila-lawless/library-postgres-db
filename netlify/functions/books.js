const { Pool } = require('pg');

exports.handler = async (event, context) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const result = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
    await pool.end();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result.rows)
    };
  } catch (error) {
    await pool.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
