const https = require('https');
const fs = require('fs');

function fetchText(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const wp = await fetchText('https://ui.aceternity.com/_next/static/chunks/webpack-67455f6ed13fefa4.js');
  const chunkIds = [44277, 82766, 46605, 68169];
  for (const id of chunkIds) {
    const reg = new RegExp(`${id}:"([^"]+)"`);
    const match = wp.match(reg);
    if (match) {
      const url = `https://ui.aceternity.com/_next/static/chunks/${id}-${match[1]}.js`;
      const code = await fetchText(url);
      console.log(`Chunk ${id}: ${code.length} bytes`);
      if (code.includes('faqs-with-dashed-lines') || code.includes('How much does it cost') || code.includes('Pricing')) {
        console.log(`--> Found in Chunk ${id}`);
        fs.writeFileSync(`scratch/chunk_${id}.js`, code);
      }
    }
  }
}
run();
