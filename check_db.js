const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function main() {
  const res = await pool.query("SELECT * FROM search_history ORDER BY created_at DESC LIMIT 1");
  console.log("Search History:", res.rows);
  if (res.rows.length > 0) {
    const p = await pool.query("SELECT * FROM product_results WHERE search_id = $1", [res.rows[0].id]);
    console.log("Products:", p.rows);
  }
  pool.end();
}
main();
