import { Controller, Request, Post, UseGuards, Get, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AppService } from './app.service';

@Controller('google')
export class AppController {
    constructor(private readonly appService: AppService) {}

}