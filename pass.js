const bcrypt = require("bcryptjs");

let password = "";

const gen = async () => {
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash("99998888", salt);
};

const comp = async () => {
  let b = await bcrypt.compare("99998888", password);
  console.log(password, b);
};

const run = async () => {
  await gen();
  await comp();
};

run();
