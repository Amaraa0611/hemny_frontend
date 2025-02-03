import { rest } from 'msw';
import { env } from '../config/environment';

export const handlers = [
  rest.get(`${env.API_URL}/cashback/stores`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          store: 'Nike',
          cashback: 8,
          wasRate: 4,
          image: '/images/stores/nike.png',
        },
        // Add more mock data...
      ])
    );
  }),
]; 