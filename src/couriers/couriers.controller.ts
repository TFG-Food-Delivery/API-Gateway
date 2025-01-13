import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';

import { CreateCourierDto } from './dto/create-courier.dto';
import { UpdateCourierDto } from './dto/update-courier.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';

@Controller('couriers')
export class CouriersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createCourierDto: CreateCourierDto) {
    return this.client.send('createCourier', createCourierDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.client.send('findAllCouriers', paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('findOneCourier', { id });
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourierDto: UpdateCourierDto,
  ) {
    return this.client.send('updateCourier', { id, ...updateCourierDto });
  }

  @Patch(':id/availability')
  updateAvailability(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('updateCourierAvailability', { id });
  }
}
