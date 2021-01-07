const express = require('express');
const jwt = require('jsonwebtoken');

const app = new express();

const port = process.env.PORT || '6437';

app.get('/api', (req, res, next) => {
  res.json({
    message: 'Welcome to the API'
  });
});

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secret_key', (err, data) => {
    if(err) {
      res.status(403);
      res.json({ error: 'Forbidden error when creating a post ..' });
    } else {
      res.json({
        message: 'Post created ..',
        authData: data,
        created_at: new Date().getTime()
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  const mockUser = {
    id: 1,
    username: 'tester',
    email: 'tester@test.co'
  }; // normally we send username and password for authentication process, here just demo only

  jwt.sign({ user: mockUser }, 'secret_key', { expiresIn: '30s' }, (err, token) => {
    res.json({ token });
  });
});

// format token
// Authorization: Bearer <access_token>

function verifyToken(req, res, next) {
  // get the auth header value (step 1)
  const bearerHeader = req.headers['authorization'];
  // check if bearer Header is undefined (step 2)
  if (typeof bearerHeader !== 'undefined') {
    // get bearer token
    const bearerToken = bearerHeader.split(' ')[1];
    // set token
    req.token = bearerToken;
    // continue the program (API request)
    next();
  } else {
    // forbidden error
    res.status(403);
    res.json({ error: 'Forbidden error ..' });
  }
}

app.listen(port, () => {
  console.log(`App is starting with ${port}`);
});
