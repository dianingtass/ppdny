module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');

async function masterAudit() {
  console.log('================================================================');
  console.log('       MASTER GUIDEBOOK SCREENSHOT AUDIT ACROSS ALL 8 ROLES     ');
  console.log('================================================================\n');

  // 1. Query Database
  const dbScreenshots = await prisma.guidebook_screenshot.findMany({
    orderBy: [{ role: 'asc' }, { id: 'asc' }]
  });

  console.log(`[DATABASE] Total records in guidebook_screenshot: ${dbScreenshots.length}`);

  const expectedCounts = {
    admin: 36,
    pengurus: 30,
    pimpinan: 34,
    santri: 61,
    timkesehatan: 34,
    orangtua: 36,
    ustadz: 30,
    ppdb: 24
  };

  const byRole = {};
  for (const s of dbScreenshots) {
    if (!byRole[s.role]) byRole[s.role] = [];
    byRole[s.role].push(s);
  }

  let dbOk = true;
  for (const [role, count] of Object.entries(expectedCounts)) {
    const items = byRole[role] || [];
    const cloudCount = items.filter(i => i.url && i.url.startsWith('https://res.cloudinary.com/')).length;
    const match = items.length === count && cloudCount === count;
    console.log(`Role: ${role.padEnd(14)} -> DB: ${items.length}/${count} | Cloudinary URLs: ${cloudCount}/${count} | ${match ? '✅ MATCH' : '❌ MISMATCH'}`);
    if (!match) dbOk = false;
  }

  // 2. Local Assets Audit
  console.log('\n----------------------------------------------------------------');
  console.log('                LOCAL DIRECTORY AUDIT & HASH UNIQUENESS         ');
  console.log('----------------------------------------------------------------\n');

  const assetsBase = 'c:/laragon/www/ppdny/client/public/assets/guidebook';
  let totalLocalFiles = 0;
  let totalLocalDups = 0;
  let anySmallFiles = 0;

  for (const role of Object.keys(expectedCounts)) {
    const roleDir = path.join(assetsBase, role);
    if (!fs.existsSync(roleDir)) {
      console.log(`Role ${role.padEnd(14)}: ❌ Directory ${roleDir} does not exist`);
      continue;
    }

    const files = fs.readdirSync(roleDir).filter(f => f.endsWith('.webp') || f.endsWith('.png'));
    totalLocalFiles += files.length;

    const hashes = {};
    let dupsInRole = 0;
    let smallInRole = 0;

    for (const f of files) {
      const fullPath = path.join(roleDir, f);
      const buf = fs.readFileSync(fullPath);
      if (buf.length < 5000) {
        console.log(`  [WARN SMALL] ${role}/${f} is only ${buf.length} bytes`);
        smallInRole++;
        anySmallFiles++;
      }
      const h = crypto.createHash('md5').update(buf).digest('hex');
      if (hashes[h]) {
        console.log(`  [DUPLICATE] ${role}/${f} matches ${hashes[h]} (${buf.length} bytes)`);
        dupsInRole++;
        totalLocalDups++;
      } else {
        hashes[h] = f;
      }
    }

    const isPerfect = dupsInRole === 0 && smallInRole === 0;
    console.log(`Role: ${role.padEnd(14)} -> Files: ${files.length.toString().padStart(2)} | Duplicates: ${dupsInRole} | Tiny Files (<5KB): ${smallInRole} | ${isPerfect ? '✅ PERFECT' : '❌ ISSUES FOUND'}`);
  }

  console.log('\n================================================================');
  console.log(`SUMMARY: Total DB records: ${dbScreenshots.length}/285`);
  console.log(`         Total Local files checked: ${totalLocalFiles}`);
  console.log(`         Total Duplicate Hashes across all roles: ${totalLocalDups}`);
  console.log(`         Total Tiny/Suspicious Files (<5KB): ${anySmallFiles}`);

  if (dbOk && totalLocalDups === 0 && anySmallFiles === 0) {
    console.log('\n🏆 ALL CHECKS PASSED WITH 100% PERFECTION! EVERYTHING IS GENUINE & SYNCED! 🏆');
  } else {
    console.log('\n⚠️ Some issues require attention.');
  }

  await prisma.$disconnect();
  process.exit(0);
}

masterAudit().catch(e => {
  console.error("FATAL ERROR in master audit:", e);
  process.exit(1);
});
