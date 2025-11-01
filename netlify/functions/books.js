const { Pool } = require('@neondatabase/serverless');

exports.handler = async () => {
  try {
    const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });
    const result = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
    await pool.end();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(result.rows)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
