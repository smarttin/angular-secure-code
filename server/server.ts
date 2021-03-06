import * as express from 'express';
import { Application } from 'express';
import * as fs from 'fs';
import * as https from 'https';
import { readAllLessons } from './read-all-lessons.route';
import { createUser } from './createUser.route';
import { getUser } from './get-user.route';
import { logout } from './logout.route';
import { login } from './login.route';
import { retrieveUserIdFromRequest } from './get-user-middleware';
import { isAuthenticated } from './isAuth.middleware';
import { checkCsrfToken } from './csrf.middleware';
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app: Application = express();

app.use(cookieParser());
app.use(retrieveUserIdFromRequest);
app.use(bodyParser.json());

const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'secure', type: String, defaultOption: true }
];

const options = commandLineArgs(optionDefinitions);

// REST API
app.route('/api/lessons').get(isAuthenticated, readAllLessons);
app.route('/api/signup').post(createUser);
app.route('/api/user').get(getUser);
app.route('/api/logout').post(isAuthenticated, checkCsrfToken, logout);
app.route('/api/login').post(login);


// console.log(options);

if (options.secure) {
  const httpsServer: any = https.createServer(
    {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    },
    app
  );

  // launch an HTTPS Server. Note: this does NOT mean that the application is secure
  httpsServer.listen(9000, () =>
    console.log(
      'HTTPS Secure Server running at https://localhost:' +
        httpsServer.address().port
    )
  );
} else {
  // launch an HTTP Server
  const httpServer: any = app.listen(9000, () => {
    console.log(
      'HTTP Server running at http://localhost:' + httpServer.address().port
    );
  });
}

