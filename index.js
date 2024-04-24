const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

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

app.use('/api/v1', require('./src/routes/v1/v1Router'));

app.listen(PORT, (error) => {
  if (!error) {
    console.log(process.env.DB_HOST);
    console.log(`Server is successfully running on PORT: ${PORT}`);
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
