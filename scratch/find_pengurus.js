module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');

(async () => {
  const penguruses = await prisma.user_role.findMany({
    where: { id_role: 2 }, // role 2 is pengurus
    include: { users: true, role: true }
  });
  console.log('Found pengurus users:', JSON.stringify(penguruses.map(p => ({
    id: p.users.id,
    nama: p.users.nama,
    email: p.users.email,
    nip: p.users.nip,
    is_active: p.users.is_active
  })), null, 2));
  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
