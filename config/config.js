require('dotenv').config();

const mongoUrI = process.env.DB_URI
const jwt_secret_key = process.env.JWT_SECRET_KEY

module.exports = {mongoUrI,jwt_secret_key}