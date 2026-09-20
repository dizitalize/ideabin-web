const https = require('https');

https.get('https://ui.aceternity.com/live-preview/faqs-with-dashed-lines', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', async () => {
    const scriptMatches = [...data.matchAll(/src="(\/_next\/static\/chunks\/[^"]+)"/g)].map(m => m[1]);
    for (const s of scriptMatches) {
      const content = await fetchText('https://ui.aceternity.com' + s);
      if (content.includes('border-dashed') || content.includes('How much does it cost') || content.includes('pricing')) {
        console.log('Found relevant script:', s);
        // Extract snippets around dashed
        const idx = content.indexOf('dashed');
        if (idx !== -1) {
          console.log(content.slice(Math.max(0, idx - 200), idx + 400));
        }
      }
    }
  });
});

function fetchText(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}
