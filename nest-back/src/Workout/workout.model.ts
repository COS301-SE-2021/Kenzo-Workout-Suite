import { ApiProperty } from "@nestjs/swagger";
import {
    Workout,
    Exercise,
    User,
    Tag,
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
    @ApiProperty({type: Array, description: 'Tags for the workout.'})
    tags: Tag[];
    @ApiProperty({type: Number, description: 'duration of exercise'})
    duratime: number;
}

export class createTagDTO{
    @ApiProperty({type: String, description: 'label of the tag'})
    label: string;
    @ApiProperty({type: String, description: 'text colour of the label'})
    textColour: string;
    @ApiProperty({type: String, description: 'background colour of the label'})
    backgroundColour: string;
}

export class CreateWorkoutDTO{
    @ApiProperty({type: String, description: 'Title of Workout.'})
    workoutTitle: string;
    @ApiProperty({type: String, description: 'Description of Workout.'})
    workoutDescription: string;
    @ApiProperty({type: Array , description: 'Exercises part of the workout.'})
    exercises: Exercise[];
    @ApiProperty({type: Array, description: 'Tags for the workout.'})
    tags: Tag[];
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
    @ApiProperty({type: Array, description: 'Tags for the workout.'})
    tags: Tag[];
    @ApiProperty({type: String, description: 'ID of the planner who created the workout.'})
    planner_ID: string;

}

export class DeleteWorkoutDTO{
    @ApiProperty({type: String, description: 'ID of Workout.'})
    workoutID: string;

}