const https = require('https');

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
  const page = await fetchText('https://ui.aceternity.com/live-preview/faqs-with-dashed-lines');
  // find webpack chunk mapping
  const webpackScript = page.match(/src="(\/_next\/static\/chunks\/webpack-[^"]+)"/);
  console.log('Webpack script:', webpackScript ? webpackScript[1] : 'not found');
  if (webpackScript) {
    const wp = await fetchText('https://ui.aceternity.com' + webpackScript[1]);
    // find chunk 68169
    const match = wp.match(/68169:"([^"]+)"/);
    console.log('68169 hash:', match ? match[1] : 'not found');
    if (match) {
      const chunkUrl = `https://ui.aceternity.com/_next/static/chunks/68169-${match[1]}.js`;
      console.log('Fetching chunk:', chunkUrl);
      const code = await fetchText(chunkUrl);
      console.log('Chunk length:', code.length);
      // save to scratch/aceternity_faq_code.js
      require('fs').writeFileSync('scratch/aceternity_faq_code.js', code);
      console.log('Saved to scratch/aceternity_faq_code.js');
    }
  }
}
run();
