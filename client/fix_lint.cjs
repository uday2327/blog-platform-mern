

const fs = require('fs');
const files = [
  'components/Navbar.jsx',
  'pages/BlogList.jsx',
  'pages/CreatePost.jsx'
];

files.forEach(f => {
  const p = 'c:/Users/dixit/OneDrive/Desktop/blog-plat/client/src/' + f;
  if (!fs.existsSync(p)) return;
  let code = fs.readFileSync(p, 'utf8');
  
  if (f === 'components/Navbar.jsx') {
    code = code.replace(/const \[menuOpen, setMenuOpen\] = useState\(false\);\r?\n?/g, '');
  }
  if (f === 'pages/BlogList.jsx') {
    code = code.replace(/const \[searchParams, setSearchParams\] = useSearchParams\(\);\r?\n?/g, "const [searchParams] = useSearchParams();\n");
    code = code.replace(/\(cat, i\) =>/g, "(cat) =>");
  }
  if (f === 'pages/CreatePost.jsx') {
    // We only remove the unused user from CreatePost, not everywhere
    code = code.replace(/const \{ user \} = useAuth\(\);\r?\n?/g, "");
  }
  
  fs.writeFileSync(p, code);
});
