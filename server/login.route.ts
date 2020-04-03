import { Request, Response } from 'express';
import { db } from './database';
import { DbUser } from './db-user';
import * as argon2 from 'argon2';
import { createSessionToken, createCsrfToken } from './security.utils';

export function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = db.findUserByEmail(email);

  if (!user) {
    res.sendStatus(403);
  } else {
    loginAndBUildResponse(password, user, res);
  }
}

async function loginAndBUildResponse(password, user: DbUser, res: Response) {
  try {
    const sessionId = await attemptLogin(password, user);

    const csrfToken = await createCsrfToken();

    res.cookie('SESSIONID', sessionId, {httpOnly: true, secure: true});

    res.cookie('XSRF-TOKEN', csrfToken);

    res.status(200).json({id: user.id, email: user.email});

  } catch (error) {
    res.sendStatus(403);
  }
}

async function attemptLogin(password, user: DbUser) {
  const isPasswordValid = await argon2.verify(user.hashedPassword, password);

  if (!isPasswordValid) {
    throw new Error('Password invalid');
  }

  return createSessionToken(user.id.toString());
}

