import { ApiProperty } from "@nestjs/swagger";
import {
    Workout,
    Exercise,
    User,
    Difficulty,
    Prisma
} from '@prisma/client';
export class CreateExerciseDTO{
    @ApiProperty({type: String, description: 'title of exercises'})
    title: string;
    @ApiProperty({type: String, description: 'description of exercise'})
    description: string;
    @ApiProperty({type: String, description: 'rep range for exercise'})
    repRange: string;
    @ApiProperty({type: Number, description: 'number of sets'})
    sets: number;
    @ApiProperty({type: String, description: 'description for pose'})
    poseDescription: string;
    @ApiProperty({type: Number, description: 'rest period'})
    restPeriod: number;
    @ApiProperty({type: String, description: 'difficulty'})
    difficulty: string;
    @ApiProperty({type: Number, description: 'duration of exercise'})
    duratime: number;
}

export class CreateWorkoutDTO{
    @ApiProperty({type: String, description: 'Title of Workout.'})
    workoutTitle: string;
    @ApiProperty({type: String, description: 'Description of Workout.'})
    workoutDescription: string;
    @ApiProperty({type: Array , description: 'Exercises part of the workout.'})
    exercises: Exercise[];
    @ApiProperty({enum: ['EASY','MEDIUM','HARD','EXTREME'], description: 'Difficulty of the workout.'})
    difficulty: Difficulty;
    @ApiProperty({type: String, description: 'ID of the planner who created the workout.'})
    planner_ID: string;

}

export class UpdateWorkoutDTO{
    @ApiProperty({type: String, description: 'ID of Workout.'})
    workoutID: string;
    @ApiProperty({type: String, description: 'Title of Workout.'})
    workoutTitle: string;
    @ApiProperty({type: String, description: 'Description of Workout.'})
    workoutDescription: string;
    @ApiProperty({type: Array , description: 'Exercises part of the workout.'})
    exercises: Exercise[];
    @ApiProperty({enum: ['EASY','MEDIUM','HARD','EXTREME'], description: 'Difficulty of the workout.'})
    difficulty: Difficulty;
    @ApiProperty({type: String, description: 'ID of the planner who created the workout.'})
    planner_ID: string;

}

export class DeleteWorkoutDTO{
    @ApiProperty({type: String, description: 'ID of Workout.'})
    workoutID: string;

}