const fs = require('fs');
let content = fs.readFileSync('src/components/sections/BlogSection.tsx', 'utf8');
content = content.replace(/src="data:image\/[^"]+"/g, 'src=""');
fs.writeFileSync('src/components/sections/BlogSection.tsx', content);
