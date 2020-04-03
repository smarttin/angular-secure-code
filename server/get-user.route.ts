import { Response, Request } from 'express';
import { db } from './database';

export function getUser(req: Request, res: Response) {
  // console.log('req[userId] from get-user route', req['userId']);
  const user = db.findUserById(req['userId']);
  // console.log('user from get-user route', user);
  if (user) {
    res.status(200).json({email: user.email, id: user.id});
  } else {
    res.status(204).json({message: 'No content found'});
  }
}
