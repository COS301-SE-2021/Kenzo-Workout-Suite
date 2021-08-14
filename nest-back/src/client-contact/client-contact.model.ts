import { ApiProperty } from "@nestjs/swagger"

export class createContactDTO {
    @ApiProperty({ type: String, description: "Email of the contact that needs to be created" })
    contactEmail: string;

    @ApiProperty({ type: String, description: "Name of the contact that needs to be created" })
    name: string;

    @ApiProperty({ type: String, description: "Surname of the contact that needs to be created" })
    surname: string;
}

export class updateContactDTO {
    @ApiProperty({ type: String, description: "ID of the contact that needs to be updated" })
    contactID: string;

    @ApiProperty({ type: String, description: "Updated email" })
    email: string;

    @ApiProperty({ type: String, description: "Updated name" })
    name: string;

    @ApiProperty({ type: String, description: "Updated surname" })
    surname: string;
}

export class deleteContactDTO {
    @ApiProperty({ type: String, description: "ID of the contact that needs to be deleted" })
    contactID: string;
}
