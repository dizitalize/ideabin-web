const fs = require('fs');
const content = fs.readFileSync('last_input.html', 'utf8');

const styleStart = content.indexOf('<style>');
const styleEnd = content.indexOf('</style>');
const bodyStart = content.indexOf('<body>');
const bodyEnd = content.indexOf('</body>');

if (styleStart !== -1 && bodyStart !== -1) {
    let css = content.slice(styleStart + 7, styleEnd);
    css = css.replace(/\.([a-zA-Z0-9_-]+)/g, '.$1');
    fs.writeFileSync('src/components/sections/BlogSection.module.css', css);

    let jsx = content.slice(bodyStart + 6, bodyEnd);
    jsx = jsx.replace(/class="([^"]+)"/g, (match, p1) => {
        const classes = p1.split(' ').map(c => 'styles[\'' + c + '\']').join(' + \' \' + ');
        return 'className={' + classes + '}';
    });
    jsx = jsx.replace(/<!--[\s\S]*?-->/g, '');
    jsx = jsx.replace(/<img([^>]*?[^\/])>/g, '<img$1 />');
    jsx = jsx.replace(/<br>/g, '<br />');
    jsx = jsx.replace(/<path([^>]*?[^\/])>/g, '<path$1 />');
    jsx = jsx.replace(/<circle([^>]*?[^\/])>/g, '<circle$1 />');
    
    // Some style attributes might exist, let's just strip them or convert to react object
    jsx = jsx.replace(/style="([^"]+)"/g, '');
    
    // SVG and rect fix
    jsx = jsx.replace(/<svg([^>]*?[^\/])>/g, (m) => m.includes('</svg>') ? m : m.replace(/\/?>$/, '>'));
    jsx = jsx.replace(/<rect([^>]*?[^\/])>/g, '<rect$1 />');
    jsx = jsx.replace(/<use([^>]*?[^\/])>/g, '<use$1 />');

    const tsx = `import React from 'react';
import styles from './BlogSection.module.css';

export default function BlogSection() {
  return (
    <section id="blog" className={styles.blogSection}>
      ${jsx}
    </section>
  );
}
`;
    fs.writeFileSync('src/components/sections/BlogSection.tsx', tsx);
    console.log('Successfully generated BlogSection');
} else {
    console.log('Regex failed');
}
