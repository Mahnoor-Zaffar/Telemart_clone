import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { Public, Roles, RolesGuard, JwtAuthGuard } from '../auth/guards';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

class VendorRegisterDto {
  @IsString() businessName!: string;
  @IsEmail() email!: string;
  @IsString() phone!: string;
  @IsString() cnic!: string;
  @IsString() address!: string;
  @IsString() city!: string;
  @IsOptional() @IsString() description?: string;
  @IsString() @MinLength(6) password!: string;
  @IsString() fullName!: string;
}

@Controller('vendors')
export class VendorsController {
  constructor(private vendorsService: VendorsService) {}

  @Public()
  @Post('register')
  register(@Body() dto: VendorRegisterDto) {
    return this.vendorsService.register(dto);
  }

  @Public()
  @Get()
  list() {
    return this.vendorsService.listApproved();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('pending')
  pending() {
    return this.vendorsService.getPending();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.vendorsService.approve(id);
  }
}
