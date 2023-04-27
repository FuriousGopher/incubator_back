import { CreateUserDto, UserModel } from '../types/userType';
import bcrypt from 'bcrypt';
import { _generateHash } from '../helpFunction';
import { usersCollection } from '../models/dbCollections';
import { uuid } from 'uuidv4';

export const usersRepositories = {
  async createNewUser(data: CreateUserDto) {
    const passwordSalt = await bcrypt.genSalt(4);
    const passwordHash = await _generateHash(data.password, passwordSalt);
    const newUser: UserModel = {
      id: uuid(),
      login: data.login,
      email: data.email,
      password: passwordHash,
      createdAt: new Date().toISOString(),
    };
    await usersCollection.insertOne({ ...newUser });
    return newUser;
  },

  async deleteUserById(id: string) {
    const result = await usersCollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },

  async getAllUsers(pageNumber: number, nPerPage: number, sortBy: string, sortDirection: 1 | -1, searchEmailTerm: string, searchLoginTerm: string) {
    const filter: any = {};
    if (searchLoginTerm || searchEmailTerm) {
      filter.$or = [];
    }
    if (searchEmailTerm) {
      filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
    }
    if (searchLoginTerm) {
      filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
    }
    console.log(filter);
    const foundUsers = await usersCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(nPerPage)
      .project({ _id: false, password: false })
      .toArray();
    const totalNumberOfPosts = await usersCollection.countDocuments(filter);
    return {
      users: foundUsers,
      totalNumberOfPosts: totalNumberOfPosts,
      currentPage: pageNumber,
      totalNumberOfPages: Math.ceil(totalNumberOfPosts / nPerPage),
      pageSize: nPerPage,
    };
  },

  async findByLoginOrEmail(loginOrEmail: string) {
    return await usersCollection.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
  },
  async findUserById(id: string) {
    try {
      return await usersCollection.findOne({ id });
    } catch (e) {
      console.error(e);
    }
  },
};

class MainClass {
  private readonly id: string;
  constructor(id: string) {
    this.id = id;
  }
  protected getId() {
    return this.id;
  }
}
class SecondClass extends MainClass {
  private readonly name: string;
  constructor(id: string, name: string) {
    super(id);
    this.name = name;
  }

  public getIdWithName() {
    const id = this.getId();
    return `${this.name}/${id}`;
  }
}

const classExempl = new SecondClass('1', 'IvanLoh');
const str = classExempl.getIdWithName();
