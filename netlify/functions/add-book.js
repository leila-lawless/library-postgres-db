const { Pool } = require('pg');

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const { title, author_first, author_last, year, genre, format, book_type, isbn, publisher, description } = JSON.parse(event.body);
    
    // Using our UDT method with composite type
    const result = await pool.query(
      `SELECT add_book_with_metadata($1, ROW($2, $3, $4::date, 'English', 0), $5::book_format, $6, $7, $8) as item_id`,
      [title, isbn || null, publisher || 'Unknown', `${year}-01-01`, format, genre, description, book_type]
    );
    
    await pool.end();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        item_id: result.rows[0].item_id,
        title,
        author_first,
        author_last,
        year,
        genre,
        format,
        book_type,
        message: 'Added using PostgreSQL UDT methods!'
      })
    };
  } catch (error) {
    await pool.end();
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
