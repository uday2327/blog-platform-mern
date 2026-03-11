const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/dixit/OneDrive/Desktop/blog-plat/client/src';
const filesToProcess = [
  'pages/Home.jsx',
  'pages/BlogList.jsx',
  'pages/Profile.jsx',
  'pages/AdminDashboard.jsx',
  'pages/CreatePost.jsx',
  'pages/EditPost.jsx',
  'pages/PostDetail.jsx',
  'components/BlogCard.jsx',
  'context/AuthContext.jsx'
];

filesToProcess.forEach(f => {
  const file = path.join(dir, f);
  if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      if (content.includes('console.error')) {
        let replaced = content.replace(/console\.error\((.*?)\);/g, (match, p1) => {
          if (p1 === 'err') return "toast.error(err.message || 'An unexpected error occurred');";
          if (p1.includes('Failed to')) return "toast.error(" + p1.split(',')[1].trim() + ".message || " + p1.split(',')[0].trim() + ");";
          return match;
        });
        
        if (replaced !== content) {
          if (!replaced.includes("import toast")) {
             replaced = "import toast from 'react-hot-toast';\n" + replaced;
          }
          fs.writeFileSync(file, replaced, 'utf8');
        }
      }
  }
});
