import { Module } from '@nestjs/common';
import {WorkoutModule} from "./Workout/workout.module";
import { UserModule } from './user/user.module';
import {GoogleStrategy} from "./user/google.strategy";

@Module({
  imports: [WorkoutModule, UserModule],
  providers: [GoogleStrategy],

})
export class AppModule {}
