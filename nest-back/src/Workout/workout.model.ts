import { ApiProperty } from "@nestjs/swagger"

import {
  Workout,
  Exercise,
  Tag
} from "@prisma/client"
export class CreateExerciseDTO {
    @ApiProperty({ type: String, description: "Title of exercises" })
    exerciseTitle: string;

    @ApiProperty({ type: String, description: "Description of exercise" })
    exerciseDescription: string;

    @ApiProperty({ type: String, description: "Rep range for exercise [Optional - \"\" can be passed in. ]" })
    repRange: string;

    @ApiProperty({ type: Number, description: "Number of Sets. [Optional - 0 can be passed in. ]" })
    sets: number;

    @ApiProperty({ type: String, description: "Description for Pose" })
    poseDescription: string;

    @ApiProperty({ type: Number, description: "Rest period [Optional - 0 can be passed in. ]" })
    restPeriod: number;

    @ApiProperty({ type: Array, description: "Tags for the workout." })
    tags: Tag[];

    @ApiProperty({ type: Number, description: "Duration of exercise [Optional - 0 can be passed in. ]" })
    duration: number;

    @ApiProperty({ type: Array, description: "Base64 Image Array of poses" })
    images: string[];
}

export class createTagDTO {
    @ApiProperty({ type: String, description: "label of the tag" })
    label: string;

    @ApiProperty({ type: String, description: "text colour of the label" })
    textColour: string;

    @ApiProperty({ type: String, description: "background colour of the label" })
    backgroundColour: string;
}

export class CreateWorkoutDTO {
    @ApiProperty({ type: String, description: "Title of Workout." })
    workoutTitle: string;

    @ApiProperty({ type: String, description: "Description of Workout." })
    workoutDescription: string;

    @ApiProperty({ type: Array, description: "Exercises part of the workout." })
    exercises: Exercise[];

    @ApiProperty({ type: Number, description: "Duration each each exercise pose in seconds." })
    loop: number;

    @ApiProperty({ type: String, description: "Genre choice for background track." })
    songChoice: string;

    @ApiProperty({ type: Number, description: "The width of the resolution." })
    resolutionWidth: number;

    @ApiProperty({ type: Number, description: "The height of the resolution." })
    resolutionHeight: number;
}

export class UpdateWorkoutDTO {
    @ApiProperty({ type: String, description: "ID of Workout." })
    workoutID: string;

    @ApiProperty({ type: String, description: "Title of Workout." })
    workoutTitle: string;

    @ApiProperty({ type: String, description: "Description of Workout." })
    workoutDescription: string;

    @ApiProperty({ type: Array, description: "Exercises part of the workout." })
    exercises: Exercise[];

    @ApiProperty({ type: Number, description: "Duration each each exercise pose in seconds." })
    loop: number;

    @ApiProperty({ type: String, description: "Genre choice for background track." })
    songChoice: string;

    @ApiProperty({ type: Number, description: "The width of the resolution." })
    resolutionWidth: number;

    @ApiProperty({ type: Number, description: "The height of the resolution." })
    resolutionHeight: number;
}

export class DeleteWorkoutDTO {
    @ApiProperty({ type: String, description: "ID of Workout." })
    workoutID: string;
}

export class updateExerciseDTO {
    @ApiProperty({ type: String, description: "id of exercises" })
    exerciseID: string;

    @ApiProperty({ type: String, description: "title of exercises" })
    exerciseTitle: string;

    @ApiProperty({ type: String, description: "description of exercise" })
    exerciseDescription: string;

    @ApiProperty({ type: String, description: "rep range for exercise" })
    repRange: string;

    @ApiProperty({ type: Number, description: "number of sets" })
    sets: number;

    @ApiProperty({ type: String, description: "description for pose" })

    poseDescription: string;

    @ApiProperty({ type: Number, description: "rest period" })
    restPeriod: number;

    @ApiProperty({ type: Array, description: "Tags for the exercise." })
    tags: Tag[];

    @ApiProperty({ type: Number, description: "duration of exercise" })
    duration: number;

    @ApiProperty({ type: Array, description: "Base64 Image Array of poses" })
    images: string[];
}

export class deleteExerciseDTO {
    @ApiProperty({ type: String, description: "ID of Exercise." })
    exerciseID: string;
}

export class createVideoDTO {
    @ApiProperty({ type: String, description: "Workout ID" })
    workoutID: string;
}

export class getWorkoutVideoDTO {
    @ApiProperty({ type: String, description: "Workout ID" })
    workoutID: string;
}
