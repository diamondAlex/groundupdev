import { createConnection } from 'mysql2';
//this needs to go somewhere else
const connection = createConnection({
    port:3307,
    host:"localhost",
    user:"user",
    password:"password",
    database:"db"
})
export default connection;
