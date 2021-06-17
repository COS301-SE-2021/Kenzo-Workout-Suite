import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {WorkoutModule} from "./Workout/workout.module";
import {UserModule} from "./User/user.module";
//import { AuthModule } from './auth/auth.module';


@Module({
  imports: [WorkoutModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
