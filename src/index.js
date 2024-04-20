const ImageKit = require('imagekit');
const cors = require('cors');
const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

app.use(cors({ credentials: true, origin: true }));

app.get('/secret', (req, res) => {
  const imageKit = new ImageKit({
    publicKey: 'public_iILFPVBo5QbfK+36qOvA8VwUEzk=',
    privateKey: 'private_sJZIRCeXbZhjCPoTcFYloIhq6PY=',
    urlEndpoint: 'https://ik.imagekit.io/blogscape',
  });

  const authenticationParameters = imageKit.getAuthenticationParameters();
  console.log(authenticationParameters);
  res.send(authenticationParameters);
});

app.get('/v2/secret', (req, res) => {
  const token = crypto.randomUUID();
  const expire = parseInt(Date.now() / 1000) + 2400;
  const privateKey = 'private_sJZIRCeXbZhjCPoTcFYloIhq6PY=';
  const signature = crypto
    .createHmac('sha1', privateKey)
    .update(token + expire)
    .digest('hex');

  res.status(200).json({ token, expire, signature });
});

app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server is successfully running on PORT: ${PORT}`);
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
