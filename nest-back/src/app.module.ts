import { Module } from "@nestjs/common"
import { WorkoutModule } from "./Workout/workout.module"
import { UserModule } from "./User/user.module"
import { GoogleStrategy } from "./User/PassportStrategies/google.strategy"

@Module({
  imports: [WorkoutModule, UserModule],
  providers: [GoogleStrategy]

})
export class AppModule {}
