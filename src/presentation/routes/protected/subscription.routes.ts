import { BadRequestError, NotFoundError } from '@/core/errors/api-error';
import { Logger } from '@/core/logger/logger';
import { SubscriptionController } from '@/modules/billing/http/subscription.controller';
import { authPlugin } from '@/plugins/auth.plugin';
import { getTenant } from '@/shared/utils/helper';
import { Elysia, t } from 'elysia';

const subscriptionController = new SubscriptionController();

export const subscriptionRoutes = new Elysia({ prefix: '/subscriptions' })
  .use(authPlugin)
  .put(
    '/checkout',
    ({ user, body }) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }

      //return link to Stripe checkout session
      return subscriptionController.subscriptionCheckout(user?.id!);
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
      return subscriptionController.subscriptionConfirm(body.sessionId, user?.id!);
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
  )
  .post(
    '/webhook',
    async ({ request, set }) => {
      try {
        const arrayBuffer = await request.arrayBuffer();
        const payload = Buffer.from(arrayBuffer);
        const sig = request.headers.get('stripe-signature');

        if (!sig) {
          Logger.error('Missing Stripe signature in webhook request');
          set.status = 400;
          return { error: 'Missing Stripe signature' };
        }

        const result = await subscriptionController.subscriptionWebhook(payload, sig);
        set.status = 200;
        // Se foi um evento ignorado, retorna sucesso mas com indicação
        if (result && result.status === 'ignored') {
          return { received: true, status: 'ignored' };
        }

        return { received: true, data: result };
      } catch (error: any) {
        Logger.error(`Webhook processing failed: ${error.message}`);
        set.status = 400;
        return { error: error.message };
      }
    },
    {
      requiredAuth: false,
      detail: {
        summary: 'Confirmação de pagamento via webhook',
        tags: ['Subscriptions']
      }
    }
  )
  .delete(
    '/cancel',
    ({ user }) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return subscriptionController.cancelSubscription(user?.id!);
    },
    {
      requiredAuth: true,
      detail: {
        summary: 'Cancelar assinatura PRO',
        tags: ['Subscriptions']
      }
    }
  );
