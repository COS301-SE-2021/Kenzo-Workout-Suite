import { Module } from "@nestjs/common"
import { WorkoutModule } from "./Workout/workout.module"
import { UserModule } from "./User/user.module"
import { GoogleStrategy } from "./User/PassportStrategies/google.strategy"
import { ClientContactModule } from "./client-contact/client-contact.module"

@Module({
  imports: [WorkoutModule, UserModule, ClientContactModule],
  providers: [GoogleStrategy]
})
export class AppModule {}
