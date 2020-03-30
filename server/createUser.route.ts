import { Request, Response } from 'express';
import { db } from './database';
import { USERS } from './database-data';
import * as argon2 from 'argon2';
import { validatePassword } from './password-validation';


export function createUser(req: Request, res: Response) {
  const { email, password } = req.body;

  const errors = validatePassword(password);

  if (errors.length > 0) {
    console.log(errors);
    res.status(400).json({errors});
  } else {
    argon2.hash(password)
    .then(hashedPassword => {
      const user = db.createUser(email, hashedPassword);

      console.log(USERS);

      res.status(200).json({id: user.id, email: user.email});

    });
  }

}

