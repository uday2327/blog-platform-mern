const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Post = require('./models/Post');
const User = require('./models/User');
const Category = require('./models/Category');

const seedData = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/blog_app';
        await mongoose.connect(uri);
        console.log('Connected to DB for seeding...');

        // Clear existing data
        await Post.deleteMany();
        await User.deleteMany();
        console.log('Cleared existing data.');

        // 1. Create Users/Authors
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const usersData = [
            {
                name: 'Uday Dixit',
                email: 'uday@example.com',
                password: hashedPassword,
                role: 'admin',
                bio: 'Full-stack developer and tech enthusiast. Building the future one line at a time.'
            },
            {
                name: 'Sarah Chen',
                email: 'sarah@example.com',
                password: hashedPassword,
                role: 'author',
                bio: 'Design lead and minimalist. Obsessed with clean UI and user psychology.'
            },
            {
                name: 'Alex Rivera',
                email: 'alex@example.com',
                password: hashedPassword,
                role: 'author',
                bio: 'Business strategist and consultant. Helping startups scale with data-driven insights.'
            },
            {
                name: 'Emma Watson',
                email: 'emma@example.com',
                password: hashedPassword,
                role: 'author',
                bio: 'Education specialist focused on digital literacy and accessible learning.'
            },
            {
                name: 'Marcus Thorne',
                email: 'marcus@example.com',
                password: hashedPassword,
                role: 'author',
                bio: 'Health and wellness coach. Exploring the intersection of biotech and longevity.'
            }
        ];

        const createdUsers = await User.insertMany(usersData);
        console.log('Created 5 users.');

        const uday = createdUsers[0];
        const sarah = createdUsers[1];
        const alex = createdUsers[2];
        const emma = createdUsers[3];
        const marcus = createdUsers[4];

        // 2. Create Posts
        const postsData = [
            {
                title: 'The Future of AI in Modern Web Development',
                content: 'Artificial Intelligence is revolutionizing how we build, test, and deploy web applications. From Github Copilot to automated testing, the landscape is shifting towards a more agentic approach.\n\n### The Shift to Agentic AI\nWe are moving beyond simple auto-complete. Next-gen agents will understand context and business logic, performing complex refactors autonomously.',
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
                author: uday._id,
                category: 'Technology',
                tags: ['AI', 'WebDev', 'Future'],
                isPublished: true,
                likes: [sarah._id, alex._id]
            },
            {
                title: 'Mastering Minimalist Design in 2026',
                content: 'Minimalism isn\'t about lack of content; it\'s about clarity. In this guide, we explore how to use typography, whitespace, and subtle animations to create premium user experiences.\n\n> "Design is not just what it looks like and feels like. Design is how it works." - Steve Jobs',
                image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=2080&auto=format&fit=crop',
                author: sarah._id,
                category: 'Lifestyle',
                tags: ['Design', 'Minimalism', 'UI'],
                isPublished: true,
                likes: [uday._id]
            },
            {
                title: 'Remote Work Productivity: The 2026 Edition',
                content: 'Remote work is no longer a temporary solution; it is the default for high-performing teams. To succeed, you need more than just a good Wi-Fi connection. You need a system.\n\n1. Deep Work Blocks\n2. Async-first Communication\n3. Result-oriented Tracking',
                image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop',
                author: alex._id,
                category: 'Business',
                tags: ['Productivity', 'RemoteWork'],
                isPublished: true,
                likes: [emma._id, marcus._id]
            },
            {
                title: 'Sustainable Living: Small Changes, Big Impact',
                content: 'We often think sustainability requires radical lifestyle changes. But the real power lies in consistency and small, daily choices.\n\nFrom reducing digital waste to ethical consumption, here is how you can start today.',
                image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop',
                author: emma._id,
                category: 'Lifestyle',
                tags: ['Sustainability', 'Environment'],
                isPublished: true
            },
            {
                title: 'The Biohacking Guide to Longevity',
                content: 'Is aging a disease? Modern science suggests it might be. This post covers the latest protocols in metabolic health, sleep optimization, and cold exposure.\n\n### The Three Pillars\n- Intermittent Fasting\n- VO2 Max Training\n- Deep Sleep Recovery',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop',
                author: marcus._id,
                category: 'Health',
                tags: ['Longevity', 'Biohacking', 'Health'],
                isPublished: true,
                likes: [uday._id, sarah._id, alex._id]
            },
            {
                title: 'Scaling Startups in a Fragmented Market',
                content: 'Growth at any cost is dead. The new era is about efficient growth and customer retention. How do you scale when capital is expensive and attention is scarce?',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
                author: alex._id,
                category: 'Business',
                tags: ['Startup', 'Growth', 'Strategy'],
                isPublished: true
            },
            {
                title: 'Why Coding is the New Literacy',
                content: 'In an AI-driven world, understanding the logic behind the screens is a fundamental skill. We don\'t need everyone to be a software engineer, but we need everyone to be tech-literate.',
                image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
                author: emma._id,
                category: 'Education',
                tags: ['Coding', 'Education', 'Literacy'],
                isPublished: true
            },
            {
                title: 'Quantum Computing: Beyond the Hype',
                content: 'We are reaching the limits of silicon. Quantum computing promises to solve problems that would take classical computers millions of years. But where are we actually at?',
                image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop',
                author: uday._id,
                category: 'Technology',
                tags: ['Quantum', 'Computing', 'Tech'],
                isPublished: true
            }
        ];

        await Post.insertMany(postsData);
        console.log('Created 8 posts across all categories.');

        // 3. Seed some initial follows
        uday.following = [sarah._id, alex._id];
        sarah.following = [uday._id];
        alex.following = [uday._id, sarah._id];

        await uday.save();
        await sarah.save();
        await alex.save();
        console.log('Seeded initial user following states.');

        console.log('\x1b[32m%s\x1b[0m', 'Database Seeding Completed Successfully!');
        process.exit();
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedData();
