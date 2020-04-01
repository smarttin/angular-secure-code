import { Request, Response } from 'express';
import { db } from './database';
import { DbUser } from './db-user';
import * as argon2 from 'argon2';
import { randomBytes } from './security.utils';
import { sessionStore } from './session.store';

export function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = db.findUserByEmail(email);

  if (!user) {
    res.sendStatus(403);
  } else {
    loginAndBUildResponse(password, user, res);
  }
}

// attemptLogin(password, user)
//       .then((sessionId) => {
//         res.cookie('SESSIONID', sessionId, {httpOnly: true, secure: true});

//         res.status(200).json({id: user.id, email: user.email});
//       })
//       .catch(() => res.sendStatus(403));

async function loginAndBUildResponse(password, user: DbUser, res: Response) {
  try {
    const sessionId = await attemptLogin(password, user);

    res.cookie('SESSIONID', sessionId, {httpOnly: true, secure: true});

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

  const sessionId = await randomBytes(32).then(bytes => bytes.toString('hex'));
  // console.log('sessionId', sessionId);

  sessionStore.createSession(sessionId, user);

  return sessionId;
}