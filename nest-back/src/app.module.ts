import { Module } from '@nestjs/common';
import {WorkoutModule} from "./Workout/workout.module";
import { UserModule } from './user/user.module';
import {AppController} from "./app.controller";

@Module({
  imports: [WorkoutModule, UserModule],
  controllers: [AppController]
})
export class AppModule {}
