import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  Logger,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { catchError, firstValueFrom } from 'rxjs';
import {
  CreateDishDto,
  CreateMenuDto,
  CreateRestaurantDto,
  UpdateDishDto,
  UpdateRestaurantDto,
} from './dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { SearchPaginationDto } from 'src/common/dto/search-pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('restaurants')
export class RestaurantsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  private readonly LOGGER = new Logger('RestaurantsController-GW');

  /* -------------------------------------------------------------------------- */
  /*                                 Restaurant                                 */
  /* -------------------------------------------------------------------------- */
  @UseGuards(AuthGuard)
  @Post()
  createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.client.send('createRestaurant', createRestaurantDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('/:id/upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRestaurantImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new RpcException({
        statusCode: 400,
        message: 'No file provided',
      });
    }
    const payload = {
      restaurantId: id,
      file: {
        originalname: file.originalname,
        mimetype: file.mimetype,
        buffer: file.buffer.toString('base64'),
      },
    };

    const { url } = await firstValueFrom(
      this.client.send('uploadRestaurantImage', payload),
    ).catch((err) => {
      throw new RpcException(err);
    });

    return this.client.send('updateRestaurant', { id, image: url });
  }

  @UseGuards(AuthGuard)
  @Post('/:id')
  createRestaurantMenu(
    @Param('id') id: string,
    @Body() createMenuDto: CreateMenuDto,
  ) {
    return this.client
      .send('createRestaurantMenu', { id, ...createMenuDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Get()
  findAllRestaurants(@Query() searchPaginationDto: SearchPaginationDto) {
    return this.client.send('findAllRestaurants', searchPaginationDto);
  }

  @Get(':id')
  findOneRestaurant(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('findOneRestaurant', { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  patchRestaurant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.client
      .send('updateRestaurant', { id, ...updateRestaurantDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  removeRestaurant(@Param('id') id: string) {
    return this.client.send('removeRestaurant', +id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Dish                                    */
  /* -------------------------------------------------------------------------- */

  @UseGuards(AuthGuard)
  @Post('/:id/category')
  createCategory(@Param('id', ParseUUIDPipe) id: string, @Body() categoryName) {
    const { name } = categoryName;
    return this.client.send('createCategory', { id, categoryName: name }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Post('/:id/menu')
  createDish(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createDishDto: CreateDishDto,
  ) {
    return this.client.send('createDish', { id, createDishDto }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('/:id/menu/upload-image')
  @UseInterceptors(FileInterceptor('file'))
  uploadDishImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new RpcException({
        statusCode: 400,
        message: 'No file provided',
      });
    }
    const payload = {
      restaurantId: id,
      file: {
        originalname: file.originalname,
        mimetype: file.mimetype,
        buffer: file.buffer.toString('base64'),
      },
    };

    return this.client.send('uploadDishImage', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get(':id/menu')
  findAllDishes(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() searchPaginationDto: SearchPaginationDto,
  ) {
    return this.client.send('findAllDishes', { id, searchPaginationDto }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('/menu/:dishId')
  findOneDish(@Param('dishId', ParseUUIDPipe) dishId: string) {
    return this.client.send('findOneDish', { dishId }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Patch('/menu/:dishId')
  updateDish(
    @Param('dishId', ParseUUIDPipe) dishId: string,
    @Body() updateDishDto: UpdateDishDto,
  ) {
    return this.client.send('updateDish', { dishId, ...updateDishDto }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Delete('/menu/:dishId')
  deleteDish(@Param('dishId', ParseUUIDPipe) dishId: string) {
    return this.client.send('deleteDish', { dishId }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
