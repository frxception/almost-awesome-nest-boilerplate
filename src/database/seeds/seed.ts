import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { hash } from 'bcrypt';

import { posts, postTranslations, users, userSettings } from '../schema/index.ts';

// Database connection
const connectionString = process.env.DATABASE_URL || 
  `postgres://${process.env.DB_USERNAME || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_DATABASE || 'nest_boilerplate'}`;

const connection = postgres(connectionString);
const db = drizzle(connection);

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data (in reverse order due to foreign key constraints)
    console.log('🧹 Cleaning existing data...');
    await db.delete(postTranslations);
    await db.delete(posts);
    await db.delete(userSettings);
    await db.delete(users);

    // Hash password for all users
    const hashedPassword = await hash('password123', 10);

    // Create dummy users
    console.log('👥 Creating users...');
    const insertedUsers = await db.insert(users).values([
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
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        password: hashedPassword,
        phone: '+1234567892',
        role: 'USER',
        avatar: null,
      },
      {
        firstName: 'Alice',
        lastName: 'Williams',
        email: 'alice.williams@example.com',
        password: hashedPassword,
        phone: '+1234567893',
        role: 'USER',
        avatar: null,
      },
      {
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie.brown@example.com',
        password: hashedPassword,
        phone: '+1234567894',
        role: 'USER',
        avatar: null,
      },
      {
        firstName: 'Diana',
        lastName: 'Davis',
        email: 'diana.davis@example.com',
        password: hashedPassword,
        phone: '+1234567895',
        role: 'ADMIN',
        avatar: null,
      },
      {
        firstName: 'Eva',
        lastName: 'Miller',
        email: 'eva.miller@example.com',
        password: hashedPassword,
        phone: '+1234567896',
        role: 'USER',
        avatar: null,
      },
      {
        firstName: 'Frank',
        lastName: 'Wilson',
        email: 'frank.wilson@example.com',
        password: hashedPassword,
        phone: '+1234567897',
        role: 'USER',
        avatar: null,
      },
      {
        firstName: 'Grace',
        lastName: 'Moore',
        email: 'grace.moore@example.com',
        password: hashedPassword,
        phone: '+1234567898',
        role: 'USER',
        avatar: null,
      },
      {
        firstName: 'Henry',
        lastName: 'Taylor',
        email: 'henry.taylor@example.com',
        password: hashedPassword,
        phone: '+1234567899',
        role: 'USER',
        avatar: null,
      },
    ]).returning();

    console.log(`✅ Created ${insertedUsers.length} users`);

    // Create user settings for all users
    console.log('⚙️ Creating user settings...');
    const userSettingsData = insertedUsers.map((user, index) => ({
      userId: user.id,
      isEmailVerified: index % 2 === 0, // Alternate verification status
      isPhoneVerified: index % 3 === 0,
    }));

    const insertedSettings = await db.insert(userSettings).values(userSettingsData).returning();
    console.log(`✅ Created ${insertedSettings.length} user settings`);

    // Create dummy posts
    console.log('📝 Creating posts...');
    const postData = [];
    let postIndex = 0;

    for (const user of insertedUsers) {
      // Create 2-3 posts per user
      const postsPerUser = Math.floor(Math.random() * 2) + 2; // 2-3 posts
      
      for (let i = 0; i < postsPerUser; i++) {
        postData.push({
          userId: user.id,
        });
        postIndex++;
      }
    }

    const insertedPosts = await db.insert(posts).values(postData).returning();
    console.log(`✅ Created ${insertedPosts.length} posts`);

    // Create post translations
    console.log('🌐 Creating post translations...');
    const postTitles = [
      'Getting Started with NestJS',
      'Advanced TypeScript Patterns',
      'Database Design Best Practices',
      'API Security Guidelines',
      'Microservices Architecture',
      'Frontend Development Tips',
      'DevOps for Beginners',
      'Machine Learning Basics',
      'Web Performance Optimization',
      'Clean Code Principles',
      'Docker Container Management',
      'GraphQL vs REST APIs',
      'Authentication Strategies',
      'Testing Best Practices',
      'Deployment Automation',
      'Monitoring and Logging',
      'Code Review Guidelines',
      'Agile Development Process',
      'System Design Patterns',
      'Cloud Computing Essentials',
    ];

    const postDescriptions = [
      'A comprehensive guide to building scalable applications',
      'Learn advanced techniques for better code organization',
      'Design efficient and maintainable database schemas',
      'Protect your APIs from common security vulnerabilities',
      'Build distributed systems that scale',
      'Improve user experience with modern frontend tools',
      'Deploy applications with confidence using DevOps practices',
      'Introduction to artificial intelligence and machine learning',
      'Optimize your web applications for better performance',
      'Write maintainable code that your team will love',
      'Containerize applications for consistent deployments',
      'Choose the right API architecture for your project',
      'Implement secure authentication in your applications',
      'Ensure code quality with comprehensive testing strategies',
      'Automate your deployment pipeline for faster releases',
      'Keep track of your application health and performance',
      'Conduct effective code reviews that improve team skills',
      'Implement agile methodologies for better project management',
      'Common patterns for designing scalable systems',
      'Leverage cloud services for modern application development',
    ];

    const translationData: Array<{
      postId: string;
      languageCode: 'en_US' | 'ru_RU';
      title: string;
      description: string;
    }> = [];
    
    insertedPosts.forEach((post, index) => {
      const titleIndex = index % postTitles.length;
      const title = postTitles[titleIndex]!;
      const description = postDescriptions[titleIndex]!;
      
      // Create English translation
      translationData.push({
        postId: post.id,
        languageCode: 'en_US' as const,
        title,
        description,
      });

      // Create Russian translation (for some posts)
      if (index % 3 === 0) {
        translationData.push({
          postId: post.id,
          languageCode: 'ru_RU' as const,
          title: `${title} (на русском)`,
          description: `${description} (описание на русском языке)`,
        });
      }
    });

    const insertedTranslations = await db.insert(postTranslations).values(translationData).returning();
    console.log(`✅ Created ${insertedTranslations.length} post translations`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Users: ${insertedUsers.length}`);
    console.log(`   • User Settings: ${insertedSettings.length}`);
    console.log(`   • Posts: ${insertedPosts.length}`);
    console.log(`   • Post Translations: ${insertedTranslations.length}`);
    console.log('\n🔐 Login credentials for all users:');
    console.log('   • Password: password123');
    console.log('   • Admin users: john.doe@example.com, diana.davis@example.com');
    console.log('   • Regular users: All other emails');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run seed if called directly
const isMainModule = process.argv[1] === new URL(import.meta.url).pathname;

if (isMainModule) {
  seed()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seed };