import { Request, Response } from 'express';
import { db } from './database';
import { USERS } from './database-data';

export function createUser(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = db.createUser(email, password);

  console.log(USERS);

  res.status(200).json({id: user.id, email: user.email});
}

