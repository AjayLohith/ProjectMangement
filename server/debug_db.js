/**
 * Database Debug Script
 * WARNING: This file contains sensitive information and should not be committed to version control
 * This is a utility script for debugging database connections
 * 
 * SECURITY NOTE: Remove hardcoded credentials before committing to production
 */

const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

/**
 * Debug database connection and user creation
 * This script should only be used in development
 */
const debug = async () => {
    try {
        // Use environment variable for MongoDB URI
        const URI = process.env.MONGODB_URI;
        
        if (!URI) {
            console.error('Error: MONGODB_URI not set in environment variables');
            process.exit(1);
        }

        console.log('Connecting to database...');
        await mongoose.connect(URI);
        console.log('Database connected successfully.');

        // Check existing users
        const count = await User.countDocuments();
        console.log(`Found ${count} existing users.`);

        // Note: This script is for debugging only
        // Use seeder.js for proper database seeding

        process.exit(0);
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

// Only run if called directly
if (require.main === module) {
    debug();
}

module.exports = debug;
