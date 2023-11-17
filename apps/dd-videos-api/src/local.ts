import { Logger } from '@nestjs/common';
import { bootstrap } from './app';

async function bootstrapLocal() {
  const app = await bootstrap();
  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    Logger.log(`🚀 Application is running on: http://localhost:${port}`);
  });
}

bootstrapLocal();
