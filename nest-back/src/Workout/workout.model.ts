import { ApiProperty } from "@nestjs/swagger";

export class createTagDTO{
    @ApiProperty({type: String, description: 'label of the tag'})
    label: string;
    @ApiProperty({type: String, description: 'text colour of the label'})
    textColour: string;
    @ApiProperty({type: String, description: 'background colour of the label'})
    backgroundColour: string;
}