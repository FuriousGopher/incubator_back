import 'reflect-metadata';
import { UsersService } from './services/usersService';
import { UsersRepositories } from './repositories/users-repositories';
import { UsersController } from './controllers/usersController';
import { Container } from 'inversify';
export const container = new Container();
container.bind(UsersController).to(UsersController);
container.bind(UsersService).to(UsersService);
container.bind(UsersRepositories).to(UsersRepositories);
