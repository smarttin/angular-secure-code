import * as _ from 'lodash';
import { LESSONS, USERS } from './database-data';
import { DbUser } from './db-user';

class InMemoryDatabase {
  userCounter = 0;

  readAllLessons() {
    return _.values(LESSONS);
  }

  createUser(email: string, hashedPassword: string) {
    this.userCounter++;
    const id = this.userCounter;

    const user: DbUser = {
      id,
      email,
      hashedPassword
    };

    USERS[id] = user;

    return user;
  }

  findUserByEmail(email: string): DbUser {
    console.log('Finding user by email:', email);

    const users = _.values(USERS);

    const user = _.find(users, user => user.email === email);

    console.log('user retrieved:', user);

    return user;
  }

  findUserById(userId: string): DbUser {
    let user;

    if (userId) {
      console.log('looking for userId ', userId);

      const users = _.values(USERS);

      user = _.find(users, user => user.id.toString() === userId);

      console.log('user data found:', user);
    }

    return user;
  }
}

export const db = new InMemoryDatabase();
