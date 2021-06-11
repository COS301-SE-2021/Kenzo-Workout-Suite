import { Module } from '@nestjs/common';
import {WorkoutModule} from "./Workout/workout.module";
import { UserModule } from './auth/user.module';

@Module({
  imports: [WorkoutModule, UserModule]
})
export class AppModule {}
