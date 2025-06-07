import { Pool } from 'pg';
const password = String('1234');

const poolConfig = {
    user: 'postgres',
    password: password,
    host: '127.0.0.1',
    port: 5432,
    database: 'eCommerce',
};
const pool = new Pool(poolConfig);

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

async function checkConnection() {
    try {
        console.log('Attempting to connect to PostgreSQL...');
        const client = await pool.connect();
        console.log('Successfully connected to PostgreSQL!');
        client.release(); // Release the client back to the pool
        return true;
    } catch (error) {
        console.error('Error connecting to PostgreSQL:', error);
        return false;
    }
}

await checkConnection();

export const query = async (text, params) => {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('executed query', { text, duration, rows: res.rowCount })
    return res
}

export const getClient = () => pool.connect();