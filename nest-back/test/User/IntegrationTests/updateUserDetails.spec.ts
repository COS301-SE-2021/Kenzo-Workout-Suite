import {MockContext, Context, createMockContext, ActualPrisma} from "../../../context";
import {UserService} from "../../../src/User/user.service";
import { JwtService } from '@nestjs/jwt';
import {userType} from "@prisma/client";

let mockCtx: MockContext
let ctx: Context

let userService: UserService
let Jwt : JwtService

describe('Integration tests of the function updateUserDetails in the UserService', () => {

beforeEach(async () => {
    userService=new UserService(Jwt)
    ctx = ActualPrisma()
    await ctx.prisma.user.deleteMany();
})

test('Invalid emails passed in, should throw NotFoundException', async () => {

    const myUser={
        userId:"123456",
        email: "test@gmail.com",
        firstName: "test",
        lastName: "tester",
        password:"thePassword2000#",
        userType: userType.PLANNER,
        dateOfBirth: null
    }

    const user= await ctx.prisma.user.create({
        data:myUser
    })

    let date;

   await expect(userService.updateUserDetails("updatedTest","updatedLast",date,"12345",ctx)).rejects.toThrow("Could not update User")

})


test('Valid details passed in, User details should be updated and should reflect update in the database', async () => {

    const myUser={
        userId:"123456",
        email: "test@gmail.com",
        firstName: "test",
        lastName: "tester",
        password:"thePassword2000#",
        userType: userType.PLANNER,
        dateOfBirth: null
    }

   const user= await ctx.prisma.user.create({
        data:myUser
    })

    let date;

    await userService.updateUserDetails("updatedTest","updatedLast",date,"123456",ctx)

    let response;

    response=await ctx.prisma.user.findUnique({
        where:{
            email:"test@gmail.com"
        }
    })

    expect(response.firstName).toBe("updatedTest");
    expect(response.lastName).toBe("updatedLast");

})
});