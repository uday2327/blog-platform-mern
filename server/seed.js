const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

// Load env vars
dotenv.config();

// Connect to DB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern_blog';
mongoose.connect(mongoURI);

const users = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        bio: 'Tech enthusiast and writer.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'admin',
        bio: 'Senior editor and blogger.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
    },
    {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        role: 'user',
        bio: 'Design lover and creator.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
    }
];

const posts = [
    {
        title: 'The Future of Web Development',
        content: 'Web development is evolving at an unprecedented pace. From new React frameworks to the rise of WebAssembly, the landscape is shifting dramatically. In this post, we explore the top trends that will shape the internet over the next decade. \n\n## 1. AI-Driven Development\nAI tools like Copilot are changing how we write code. They handle the boilerplate, allowing developers to focus on architecture and complex logic.\n\n## 2. Serverless Edge Computing\nDeploying code closer to the user reduces latency and improves performance globally.',
        category: 'Technology',
        tags: ['Web', 'React', 'Future'],
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
        isPublished: true
    },
    {
        title: 'Mastering Minimalism in Design',
        content: 'Minimalism is more than just a visual style; it is a philosophy of subtraction. By stripping away the unnecessary, we make room for the essential.\n\n### Why Minimalism Works\nUsers are overwhelmed by information. A clean, focused UI reduces cognitive load and directs attention exactly where it needs to go.',
        category: 'Education',
        tags: ['UI', 'UX', 'Minimalism'],
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop',
        isPublished: true
    },
    {
        title: 'How to Build a Morning Routine That Works',
        content: 'Your morning sets the tone for the rest of the day. A scattered morning leads to a scattered day. \n\nHere are three steps to build a routine that sticks:\n\n1. **Wake up at the same time:** Consistency is key.\n2. **Hydrate immediately:** Drink a large glass of water.\n3. **Avoid the phone:** Do not check notifications for the first hour.',
        category: 'Lifestyle',
        tags: ['Productivity', 'Health'],
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop',
        isPublished: true
    },
    {
        title: 'Understanding Artificial Intelligence in 2024',
        content: 'Artificial Intelligence has moved from science fiction to everyday utility. But what actually is it? At modern modern AI relies on Large Language Models (LLMs) and deep neural networks trained on massive datasets.\n\nThe implications for business, art, and society are profound. We are no longer just instructing computers; we are teaching them to understand context.',
        category: 'Technology',
        tags: ['AI', 'Tech', 'Future'],
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
        isPublished: true
    },
    {
        title: 'The Art of Writing Good Code',
        content: 'Good code reads like well-written prose. It is clear, concise, and intentional. \n\n> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler\n\nAlways optimize for readability first. Use descriptive variable names, keep functions small, and write comments only when the "why" is not obvious from the "what".',
        category: 'Technology',
        tags: ['Coding', 'Clean Code'],
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
        isPublished: true
    },
    {
        title: 'Traveling the World as a Digital Nomad',
        content: 'The digital nomad lifestyle promises ultimate freedom: work from a beach in Bali or a cafe in Paris. But the reality involves a lot of planning, unstable Wi-Fi, and time zone coordination.\n\nHere is what no one tells you about working remotely while traveling:\n- Routine is still important.\n- Loneliness is real.\n- Always have a backup internet connection.',
        category: 'Lifestyle',
        tags: ['Travel', 'Nomad', 'Work'],
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop',
        isPublished: true
    }
];

const importData = async () => {
    try {
        await User.deleteMany();
        await Post.deleteMany();
        await Comment.deleteMany();

        console.log('Old Data Destroyed...');

        const createdUsers = await User.create(users);

        const postsWithAuthors = posts.map((post, index) => {
            // Assign authors cyclically among the users
            const author = createdUsers[index % createdUsers.length]._id;
            return { ...post, author };
        });

        await Post.create(postsWithAuthors);

        console.log('Demo Data Imported!');
        process.exit();
    } catch (err) {
        console.error(`${err}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else {
    console.log('Provide -i flag to import');
    process.exit(1);
}
