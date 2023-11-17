import serverlessExpress from '@vendia/serverless-express';
import { Context, Handler } from 'aws-lambda';
import { bootstrap } from './app';

let cachedServer: Handler;

async function bootstrapLambda() {
  if (!cachedServer) {
    const expressApp = await bootstrap();
    cachedServer = serverlessExpress({
      app: expressApp.getHttpAdapter().getInstance(),
    });
  }
  return cachedServer;
}

export const handler = async (event: any, context: Context, callback: any) => {
  const server = await bootstrapLambda();
  return server(event, context, callback);
};
