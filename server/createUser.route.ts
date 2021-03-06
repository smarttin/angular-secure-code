import { Request, Response } from 'express';
import { db } from './database';
import { USERS } from './database-data';
import * as argon2 from 'argon2';
import { validatePassword } from './password-validation';
import { createSessionToken, createCsrfToken } from './security.utils';


export function createUser(req: Request, res: Response) {
  const { email, password } = req.body;

  const errors = validatePassword(password);

  if (errors.length > 0) {
    console.log(errors);
    res.status(400).json({errors});
  } else {
    createUserAndSession(res, email, password)
      .catch(() => res.sendStatus(500));
  }

}

async function createUserAndSession(res: Response,email, password) {
  const hashedPassword = await argon2.hash(password);

  const user = db.createUser(email, hashedPassword);

  console.log(USERS);

  const sessionToken = await createSessionToken(user.id.toString());

  const csrfToken = await createCsrfToken();

  res.cookie('SESSIONID', sessionToken, {httpOnly: true, secure: true});

  res.cookie('XSRF-TOKEN', csrfToken);

  res.status(200).json({id: user.id, email: user.email});
}

