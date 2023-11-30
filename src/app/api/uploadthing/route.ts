import { createNextRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from './core';

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
  config: {
    callbackUrl:
      'https://nft-card-game-production.up.railway.app/api/uploadthing',
  },
});

// export const { GET, POST } = createNextRouteHandler({
//   router: ourFileRouter,
// });
