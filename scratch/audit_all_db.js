module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');

(async () => {
  const screenshots = await prisma.guidebook_screenshot.findMany({
    orderBy: [{ role: 'asc' }, { id: 'asc' }]
  });

  const byRole = {};
  for (const s of screenshots) {
    if (!byRole[s.role]) byRole[s.role] = [];
    byRole[s.role].push(s);
  }

  for (const [role, items] of Object.entries(byRole)) {
    console.log(`\n=== Role: ${role} (${items.length} items) ===`);
    const urls = items.map(i => i.url);
    const cloudinaryCount = urls.filter(u => u && u.includes('cloudinary')).length;
    const localCount = urls.filter(u => u && !u.includes('cloudinary')).length;
    const nullCount = urls.filter(u => !u).length;
    console.log(`Cloudinary URLs: ${cloudinaryCount}, Local/Other URLs: ${localCount}, Null URLs: ${nullCount}`);
    
    // Sample first 2
    console.log('Sample URL:', items[0]?.key, '->', items[0]?.url);
  }

  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
