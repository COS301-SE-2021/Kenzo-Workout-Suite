import { Module } from '@nestjs/common';
import {WorkoutModule} from "./Workout/workout.module";
import {UserModule} from "./User/user.module";
//import { AuthModule } from './auth/auth.module';


@Module({
  imports: [WorkoutModule, UserModule],
})
export class AppModule {}
