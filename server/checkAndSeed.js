/**
 * Check and Seed Users Script
 * Checks if users exist, if not, creates them
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkAndSeed = async () => {
    try {
        console.log('🔍 Checking database for users...');
        
        // Validate MongoDB URI
        if (!process.env.MONGODB_URI) {
            console.error('✗ Error: MONGODB_URI not set in environment variables');
            console.error('Please create a .env file in the server directory with:');
            console.error('MONGODB_URI=your_mongodb_connection_string');
            process.exit(1);
        }

        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000
        });
        console.log('✓ Connected to MongoDB');

        // Check existing users
        const userCount = await User.countDocuments();
        console.log(`📊 Found ${userCount} existing user(s)`);

        if (userCount === 0) {
            console.log('\n📝 No users found. Creating test users...\n');
            
            // Define test users
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
                try {
                    const user = await User.create(userData);
                    console.log(`✓ Created user: ${user.username} (${user.role})`);
                } catch (error) {
                    if (error.code === 11000) {
                        console.log(`⚠ User ${userData.username} already exists, skipping...`);
                    } else {
                        console.error(`✗ Failed to create user ${userData.username}:`, error.message);
                    }
                }
            }

            console.log('\n✅ Database seeding completed!');
        } else {
            console.log('\n✅ Users already exist in database.');
            
            // List existing users
            const users = await User.find({}).select('username role');
            console.log('\n📋 Existing users:');
            users.forEach(user => {
                console.log(`   - ${user.username} (${user.role})`);
            });
        }

        console.log('\n🔑 Test Credentials:');
        console.log('   Admin: admin / password123');
        console.log('   Lead:  lead / password123');
        console.log('   Dev1:  dev1 / password123');
        console.log('   Dev2:  dev2 / password123');
        console.log('\n⚠️  WARNING: Change these passwords in production!');
        
        await mongoose.disconnect();
        console.log('\n✓ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        if (error.message.includes('IP')) {
            console.error('\n💡 Solution: Whitelist your IP address in MongoDB Atlas');
            console.error('   1. Go to MongoDB Atlas → Network Access');
            console.error('   2. Click "Add IP Address"');
            console.error('   3. Click "Add Current IP Address"');
        }
        process.exit(1);
    }
};

// Run
checkAndSeed();

