import { ApiProperty } from "@nestjs/swagger";

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

export class createTagDTO{
    @ApiProperty({type: String, description: 'label of the tag'})
    label: string;
    @ApiProperty({type: String, description: 'text colour of the label'})
    textColour: string;
    @ApiProperty({type: String, description: 'background colour of the label'})
    backgroundColour: string;
}