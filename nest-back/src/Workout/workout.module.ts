import {Module} from '@nestjs/common';
import {WorkoutController} from "./workout.controller";
import {WorkoutService} from "./workout.service";
import {PrismaService} from "../Prisma/prisma.service";
import {Context} from "../../context";

@Module(
    {
        controllers:[WorkoutController],
        providers: [WorkoutService, PrismaService],
        exports: [WorkoutService]
    }
)

//testing
export class WorkoutModule{}

