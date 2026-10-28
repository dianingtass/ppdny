module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');

(async () => {
  const counts = await prisma.guidebook_screenshot.groupBy({
    by: ['role'],
    _count: { id: true }
  });
  console.log('Guidebook Screenshots by Role:', JSON.stringify(counts, null, 2));

  const total = await prisma.guidebook_screenshot.count();
  console.log('Total Screenshots in Database:', total);
  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
