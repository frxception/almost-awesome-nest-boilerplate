import { hash } from 'bcrypt';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { posts, postTranslations, users, userSettings } from '../src/database/schema';

// Database connection for tests
const connectionString = `postgres://${process.env.DB_USERNAME || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_DATABASE || 'nest_boilerplate'}`;

let connection: any;
let db: any;

async function initializeDatabase() {
  connection = postgres(connectionString);
  db = drizzle(connection);
}

async function seedForTests() {
  console.log('🌱 Starting database seeding for tests...');

  if (!db) {
    await initializeDatabase();
  }

  try {
    // Clear existing data (in reverse order due to foreign key constraints)
    console.log('🧹 Cleaning existing data...');
    await db.delete(postTranslations).execute();
    await db.delete(posts).execute();
    await db.delete(userSettings).execute();
    await db.delete(users).execute();

    // Hash password for all users
    const hashedPassword = await hash('password123', 10);

    // Create dummy users
    console.log('👥 Creating users...');
    const insertedUsers = await db
      .insert(users)
      .values([
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: hashedPassword,
          phone: '+1234567890',
          role: 'ADMIN',
          avatar: null,
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          password: hashedPassword,
          phone: '+1234567891',
          role: 'USER',
          avatar: null,
        },
      ])
      .returning();

    console.log(`✅ Created ${insertedUsers.length} users`);

    // Create user settings for all users
    console.log('⚙️ Creating user settings...');
    const userSettingsData = insertedUsers.map((user, index) => ({
      userId: user.id,
      isEmailVerified: index % 2 === 0,
      isPhoneVerified: index % 3 === 0,
    }));

    const insertedSettings = await db.insert(userSettings).values(userSettingsData).returning();
    console.log(`✅ Created ${insertedSettings.length} user settings`);

    // Create a few posts
    console.log('📝 Creating posts...');
    const postData = [{ userId: insertedUsers[0]!.id }, { userId: insertedUsers[1]!.id }];

    const insertedPosts = await db.insert(posts).values(postData).returning();
    console.log(`✅ Created ${insertedPosts.length} posts`);

    // Create post translations
    console.log('🌐 Creating post translations...');
    const translationData = [
      {
        postId: insertedPosts[0]!.id,
        languageCode: 'en_US' as const,
        title: 'Test Post 1',
        description: 'This is a test post for e2e testing',
      },
      {
        postId: insertedPosts[1]!.id,
        languageCode: 'en_US' as const,
        title: 'Test Post 2',
        description: 'This is another test post for e2e testing',
      },
    ];

    const insertedTranslations = await db.insert(postTranslations).values(translationData).returning();
    console.log(`✅ Created ${insertedTranslations.length} post translations`);

    console.log('🎉 Database seeding for tests completed successfully!');

    return {
      users: insertedUsers,
      posts: insertedPosts,
    };
  } catch (error) {
    console.error('❌ Error seeding database for tests:', error);
    throw error;
  }
}

async function cleanupTestData() {
  if (!db) {
    await initializeDatabase();
  }

  try {
    console.log('🧹 Cleaning test data...');
    await db.delete(postTranslations).execute();
    await db.delete(posts).execute();
    await db.delete(userSettings).execute();
    await db.delete(users).execute();
    console.log('✅ Test data cleaned');
  } catch (error) {
    console.error('❌ Error cleaning test data:', error);
  }
}

async function cleanupDatabase() {
  await cleanupTestData();
  if (connection) {
    await connection.end();
  }
}

export { seedForTests, cleanupDatabase, cleanupTestData };
