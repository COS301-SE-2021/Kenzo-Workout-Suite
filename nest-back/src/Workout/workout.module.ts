import {Module} from '@nestjs/common';
import {WorkoutController} from "./workout.controller";
import {WorkoutService} from "./workoutService";
import {PrismaService} from "../Prisma/prisma.service";

@Module(
    {
        controllers:[WorkoutController],
        providers: [WorkoutService, PrismaService],
    }
)

//testing
export class WorkoutModule{}

