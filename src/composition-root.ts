import { UsersService } from './services/usersService';
import { UsersRepositories } from './repositories/users-repositories';
import { UsersController } from './controllers/usersController';

const usersRepositories = new UsersRepositories();
const usersService = new UsersService(usersRepositories);
export const usersController = new UsersController(usersService);
