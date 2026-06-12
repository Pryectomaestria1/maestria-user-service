import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.GRPC_PORT ?? '50051';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(process.cwd(), '..', 'grpc-contracts', 'user.proto'),
      url: `0.0.0.0:${port}`,
    },
  });
  await app.listen();
  console.log(`User gRPC Service listening on ${port}`);
}
bootstrap();
