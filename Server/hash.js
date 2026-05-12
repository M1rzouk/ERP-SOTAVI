const bcrypt = require('bcrypt');

const password = 'monMotDePasse123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Hash :', hash);
});