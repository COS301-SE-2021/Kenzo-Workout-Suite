import { Module } from '@nestjs/common';
import {WorkoutModule} from "./Workout/workout.module";
import { UserModule } from './user/user.module';
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {GoogleStrategy} from "./user/google.strategy";

@Module({
  imports: [WorkoutModule, UserModule],
  providers: [AppService,GoogleStrategy],
  controllers: [AppController]
})
export class AppModule {}
