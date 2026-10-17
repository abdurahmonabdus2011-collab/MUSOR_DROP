const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = 'mongodb+srv://abdurahmonabdus2011_db_user:7Ebp0tbrwZa5B6y8@cluster0.fm6gm0q.mongodb.net/skins_app';

async function run() {
  await mongoose.connect(uri);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);

  const usersCol = mongoose.connection.collection('users');

  // 1. Create or update admin@example.com
  const existingAdmin = await usersCol.findOne({ email: 'admin@example.com' });
  if (existingAdmin) {
    await usersCol.updateOne(
      { email: 'admin@example.com' },
      { $set: { role: 'admin', password: hashedPassword, wallet: 999999 } }
    );
    console.log('Updated existing admin@example.com');
  } else {
    // Check if username 'admin' is taken
    const existingUserAdmin = await usersCol.findOne({ username: 'admin' });
    const username = existingUserAdmin ? 'admin_main' : 'admin';
    await usersCol.insertOne({
      username: username,
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      wallet: 999999,
      createdAt: new Date()
    });
    console.log(`Created new admin user (${username} / admin@example.com)`);
  }

  // 2. Also make Abduraksmon (abdurahmonabdus2011@gmail.com) an admin with password admin123
  await usersCol.updateOne(
    { email: 'abdurahmonabdus2011@gmail.com' },
    { $set: { role: 'admin', password: hashedPassword, wallet: 999999 } }
  );
  console.log('Made abdurahmonabdus2011@gmail.com an admin as well');

  const all = await usersCol.find({}, { projection: { password: 0 } }).toArray();
  console.log('ALL_USERS:', JSON.stringify(all, null, 2));
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
