/**
 * Database Seeder
 * Populates the database with initial test users
 * 
 * Usage: node seeder.js
 * 
 * WARNING: This will delete all existing users and create new test accounts
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

/**
 * Seed initial users for testing
 * Creates admin, project lead, and developer test accounts
 */
const seedUsers = async () => {
    try {
        console.log('Starting database seeder...');
        
        // Validate MongoDB URI
        if (!process.env.MONGODB_URI) {
            console.error('Error: MONGODB_URI not set in environment variables');
            console.error('Please create a .env file with MONGODB_URI');
            process.exit(1);
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Clear existing users (for clean seed)
        await User.deleteMany({});
        console.log('✓ Cleared existing users');

        // Define test users
        // Note: Passwords will be automatically hashed by User model pre-save hook
        const users = [
            {
                username: 'admin',
                password: 'password123',
                role: 'admin'
            },
            {
                username: 'lead',
                password: 'password123',
                role: 'project_lead'
            },
            {
                username: 'dev1',
                password: 'password123',
                role: 'developer'
            },
            {
                username: 'dev2',
                password: 'password123',
                role: 'developer'
            }
        ];

        // Create users
        for (const userData of users) {
            await User.create(userData);
            console.log(`✓ Created user: ${userData.username} (${userData.role})`);
        }

        console.log('\n✓ Database seeding completed successfully!');
        console.log('\nTest credentials:');
        console.log('  Admin: admin / password123');
        console.log('  Lead: lead / password123');
        console.log('  Dev1: dev1 / password123');
        console.log('  Dev2: dev2 / password123');
        console.log('\n⚠️  WARNING: Change these passwords in production!');
        
        process.exit(0);
    } catch (error) {
        console.error('✗ Seeding failed:', error.message);
        process.exit(1);
    }
};

// Run seeder
seedUsers();
