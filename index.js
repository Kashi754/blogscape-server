const ImageKit = require('imagekit');
const cors = require('cors');
const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
  })
);

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('common'));
}

app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server is successfully running on PORT: ${PORT}`);
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
