import { NestFactory } from "@nestjs/core"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app.module"
import * as bodyParser from "body-parser"

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  app.use(bodyParser.json({ limit: "50mb" }))
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
  const config = new DocumentBuilder()
    .setTitle("Kenzo-Workout Suite")
    .setDescription("Description of Kenzo-Workout Suite API")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, document)

  app.enableCors()
  await app.listen(3000)
}
bootstrap()
