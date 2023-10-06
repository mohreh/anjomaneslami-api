const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
const decode = async () => {
  const dec = jwt.verify(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MWRlNmI5MDU5M2UwYTAzYjA4NDc2MCIsImlhdCI6MTY5NjYwNTE2MCwiZXhwIjoxNjk2NjA1MTYwfQ.-1aW8L5I5xaApMUugwqmAtvWihpwzDwsRVuTLnxHNJk",
    "secret",
  );
  console.log(dec);
};

decode();
