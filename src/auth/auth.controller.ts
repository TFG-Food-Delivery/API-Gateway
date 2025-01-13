import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import {
  CreateCourierDto,
  CreateCustomerDto,
  CreateRestaurantDto,
  LoginUserDto,
} from './dto';
import { catchError, map } from 'rxjs';
import { User } from './decorators';
import { CurrentUserInterface } from './interfaces/current-user.interface';
import { Token } from './decorators';
import { AuthGuard } from './guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}
  private readonly LOGGER = new Logger('AuthController - GW');
  @Post('register/customer')
  registerCustomer(
    @Body() registerUserDto: CreateCustomerDto,
    @Res() res: Response,
  ) {
    return this.client.send('createCustomerSaga', registerUserDto).pipe(
      map(({ user, token }) => {
        if (!token) {
          throw new RpcException('Token not provided');
        }

        // Configurar la cookie con el token
        res.cookie('authToken', token, {
          httpOnly: true, // Protege contra XSS
          secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Relaja SameSite en desarrollo
          maxAge: 24 * 60 * 60 * 1000, // 1 día
          path: '/', // Disponible en todas las rutas
        });

        // Responder con los datos del usuario
        return res.status(200).json({
          message: 'Registration successful',
          user,
        });
      }),
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('register/restaurant')
  registerRestaurant(
    @Body() registerUserDto: CreateRestaurantDto,
    @Res() res: Response,
  ) {
    return this.client.send('createRestaurantSaga', registerUserDto).pipe(
      map(({ user, token }) => {
        if (!token) {
          throw new RpcException('Token not provided');
        }

        // Configurar la cookie con el token
        res.cookie('authToken', token, {
          httpOnly: true, // Protege contra XSS
          secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Relaja SameSite en desarrollo
          maxAge: 24 * 60 * 60 * 1000, // 1 día
          path: '/', // Disponible en todas las rutas
        });

        // Responder con los datos del usuario
        return res.status(200).json({
          message: 'Registration successful',
          user,
        });
      }),
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @Post('register/courier')
  registerCourier(
    @Body() registerUserDto: CreateCourierDto,
    @Res() res: Response,
  ) {
    return this.client.send('createCourierSaga', registerUserDto).pipe(
      map(({ user, token }) => {
        if (!token) {
          throw new RpcException('Token not provided');
        }

        // Configurar la cookie con el token
        res.cookie('authToken', token, {
          httpOnly: true, // Protege contra XSS
          secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Relaja SameSite en desarrollo
          maxAge: 24 * 60 * 60 * 1000, // 1 día
          path: '/', // Disponible en todas las rutas
        });

        // Responder con los datos del usuario
        return res.status(200).json({
          message: 'Registration successful',
          user,
        });
      }),
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    return this.client.send('authLoginUser', loginUserDto).pipe(
      map(({ user, token }) => {
        if (!token) {
          throw new RpcException('Token not provided');
        }

        // Configurar la cookie con el token
        res.cookie('authToken', token, {
          httpOnly: true, // Protege contra XSS
          secure: false, // Solo HTTPS en producción
          sameSite: 'lax', // Relaja SameSite en desarrollo
          maxAge: 24 * 60 * 60 * 1000, // 1 día
          path: '/', // Disponible en todas las rutas
        });

        // Responder con los datos del usuario
        return res.status(200).json({
          message: 'Login successful',
          user, // Devuelve la información del usuario
        });
      }),
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('logout')
  logoutUser(@Res() res: Response) {
    res.clearCookie('authToken', { path: '/' }); // Asegúrate de usar el mismo 'path' que al crear la cookie
    return res.status(200).json({ message: 'Logout successful' });
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    if (!file) {
      throw new RpcException({
        statusCode: 400,
        message: 'No file provided',
      });
    }
    const payload = {
      userId,
      file: {
        originalname: file.originalname,
        mimetype: file.mimetype,
        buffer: file.buffer.toString('base64'),
      },
    };
    return this.client.send('uploadProfileImage', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('/exists')
  checkUserExists(
    @Query('email') email: string,
    @Query('phone') phone: string,
  ) {
    return this.client.send('checkUserExists', { email, phone }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyToken(
    @User() user: CurrentUserInterface,
    @Token() token: string,
    @Res() res: Response,
  ) {
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax', // Relaja SameSite en desarrollo
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });
    return res.status(200).json({
      message: 'Token verified',
      user,
    });
  }
}
