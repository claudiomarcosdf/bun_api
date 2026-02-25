import { NotFoundError } from '@/core/errors/api-error';
import { UserController } from '@/presentation/controllers/user.controller';
import { authPlugin } from '@/presentation/middlewares/auth/auth.plugin';
import { getTenant } from '@/shared/utils/helper';
import { Elysia, t } from 'elysia';

const userController = new UserController();

export const subscriptionRoutes = new Elysia({ prefix: '/subscriptions' })
  .use(authPlugin)
  .put(
    '/checkout',
    ({ user, body }) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }

      //return link to Stripe checkout session
      return userController.subscriptionCheckout(user?.id!);
    },
    {
      requiredAuth: true,
      //requireRole: [UserRole.ADMIN],
      detail: {
        summary: 'Link para checkout de assinatura PRO',
        tags: ['Subscriptions']
      }
    }
  )
  .put(
    '/confirm',
    ({ user, body }) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return userController.subscriptionConfirm(body.sessionId, user?.id!);
    },
    {
      requiredAuth: true,
      body: t.Object({
        sessionId: t.String({
          minLength: 1,
          description: 'ID da sessão do Stripe'
        })
      }),
      detail: {
        summary: 'Confirmação de pagamento',
        tags: ['Subscriptions']
      }
    }
  );
