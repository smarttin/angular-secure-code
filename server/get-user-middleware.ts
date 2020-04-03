import { Request, Response, NextFunction } from 'express';
import { decodeJwt } from './security.utils';

export function retrieveUserIdFromRequest(req: Request, res: Response, next: NextFunction) {
  const jwt = req.cookies['SESSIONID'];

  if (jwt) {
    handleSessionCookie(jwt, req)
      .then(() => next())
      .catch(err => {
        console.error(err);
        next();
      });
  } else {
    next();
  }
}

async function handleSessionCookie(jwt: string, req: Request) {
  try {
    const payload = await decodeJwt(jwt);
    // console.log('payload.sub from get-user middleware', payload.sub);
    req['userId'] = payload.sub;
    // console.log('req[userId] from get-user middleware', req['userId']);

  } catch (error) {
    console.log('Error: could not extract user', error.message);
  }
}
