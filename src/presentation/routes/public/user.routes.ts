import { Elysia } from 'elysia';
import { UserController } from '../../controllers/user.controller';
import { RegisterUserDTO } from '@/application/dtos/user.dto';

const userController = new UserController();

export const userRoutes = new Elysia({ prefix: '/users' }).post('/register', (context) => userController.register(context), {
  body: RegisterUserDTO,
  detail: {
    summary: 'Register a new user',
    tags: ['User']
  }
});
