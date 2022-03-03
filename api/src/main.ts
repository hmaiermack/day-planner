import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { accessTokenGuard } from './common/guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  //globals can't use DI so must be passed to guard to access metadata
  //can also be provided via app.module.ts like so
  // providers: [
  //  {
  //    provide: APP_GUARD,
  //    useClass: accessTokenGuard
  //  }
  // ]
  const reflector = new Reflector();
  app.useGlobalGuards(new accessTokenGuard(reflector));
  await app.listen(3333);
}
bootstrap();
