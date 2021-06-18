import {
    BadRequestException, ConflictException,
    Injectable,
    NotAcceptableException,
    NotFoundException
} from "@nestjs/common";
import { PrismaService } from "../Prisma/prisma.service";
import {Context} from "../../context";
const Filter = require('bad-words'), filter = new Filter();

@Injectable()
export class WorkoutService{

    constructor(private prisma: PrismaService) {
    }

    /**
     *Workout service - format
     *
     * @brief Function that formats a string so that every first letter of every word is a capital, eg: CoRE extreme to Core Extreme.
     * @param label This is the label that will be formatted.
     * @return  Re-formatted string.
     * @author Tinashe Chamisa
     *
     */
    format(label: string): string{
        let str = label.toLowerCase();
        const arr = str.split(" ");
        //loop through each element of the array and capitalize the first letter.
        for(let i=0; i<arr.length; i++){
            arr[i]= arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        //Join all the elements of the array back into a string using a blank space as a separator
        str = arr.join(" ");
        return str;
    }

    /**
     *Workout Service - Create Tag
     *
     * @param label This is the title of the tag.
     * @param textColour This is the text colour of the tag.
     * @param backgroundColour  This is the background colour of the tag.
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotAcceptableException if:
     *                               -There is any type of profanity found in the label, using npm 'bad-words'.
     * @throws ConflictException if:
     *                               -There is already a tag that exists in the database with the given label.
     * @throws BadRequestException if:
     *                               -There is a precondition net met, such as parameters not given.
     * @return  Promise tag object.
     * @author Tinashe Chamisa
     *
     */
    async createTag(label: string,textColour: string,backgroundColour: string, ctx: Context): Promise<any> {
        if(filter.isProfane(label)){
            throw new NotAcceptableException("Profanity contained in label title.");
        }
        try {
            label  = this.format(label);
            const find = await ctx.prisma.tag.findUnique({//search for tags that meet the requirement
                where: {
                    label
                },
                select: {
                    label: true
                }
            });

            if(find!=null){//if duplicates are detected, throw error
                throw new ConflictException("Duplicate", "Label already exists in database.")
            }

            const createdUser= await ctx.prisma.tag.create({
                data: {
                    label,
                    textColour,
                    backgroundColour
                },
            })
            if (!(Arrays.isArray(createdUser) && createdUser.length)) {//if JSON object is empty, send error code
                throw new BadRequestException("Could not create tag.");
            }

            return createdUser;
        } catch (err) {
            throw err;
        }
    }

    /**
     *Workout Service - Get Tags
     *
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No tags were found in the database.
     * @return  Promise array of tag object/s.
     * @author Tinashe Chamisa
     *
     */
    async getTags(ctx: Context): Promise<any> {
        try{
            const tags = await ctx.prisma.tag.findMany({//search and retrieve all tags
                select: {
                    label: true,
                    textColour: true,
                    backgroundColour: true,
                }
            });

            if(tags.length==0){//if JSON object is empty, send error code
                throw new NotFoundException("No tags were found in the database.");
            }

            return tags;
        }
        catch(err){
            throw err;
        }
    }

}