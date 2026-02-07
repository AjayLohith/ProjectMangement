/**
 * Test Login Script
 * Verifies that users can be found and passwords work
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const testLogin = async () => {
    try {
        console.log('🔐 Testing login functionality...\n');
        
        if (!process.env.MONGODB_URI) {
            console.error('✗ Error: MONGODB_URI not set');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB\n');

        // Test users
        const testUsers = [
            { username: 'admin', password: 'password123' },
            { username: 'lead', password: 'password123' },
            { username: 'dev1', password: 'password123' }
        ];

        for (const testUser of testUsers) {
            const user = await User.findOne({ username: testUser.username });
            
            if (!user) {
                console.log(`✗ User "${testUser.username}" not found`);
                continue;
            }

            const isMatch = await user.matchPassword(testUser.password);
            
            if (isMatch) {
                console.log(`✓ Login test passed for: ${testUser.username} (${user.role})`);
            } else {
                console.log(`✗ Password mismatch for: ${testUser.username}`);
            }
        }

        console.log('\n✅ Login tests completed!');
        console.log('\n📝 You can now login with:');
        console.log('   Username: admin, Password: password123');
        console.log('   Username: lead,  Password: password123');
        console.log('   Username: dev1,  Password: password123');
        console.log('   Username: dev2,  Password: password123');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
};

testLogin();

