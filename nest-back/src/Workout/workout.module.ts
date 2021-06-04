import {Module} from '@nestjs/common';
import {WorkoutController} from "./workout.controller";
import {WorkoutService} from "./workoutService";

@Module(
    {
        controllers:[WorkoutController],
        providers: [WorkoutService],
    }
)

//testing
export class UserModule{}

