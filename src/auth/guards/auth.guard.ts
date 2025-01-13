import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { AuthMethods } from './auth-methods.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}
  private readonly LOGGER = new Logger('AuthGuard');
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);

    if (!token || token === '') {
      throw new UnauthorizedException();
    }
    try {
      const { user, newToken } = await firstValueFrom(
        this.client.send('authVerifyUser', token),
      );
      request['user'] = user;

      request['token'] = newToken;

      if (!this.isAllowed(user.role, request.url)) {
        throw new UnauthorizedException(
          'Access Denied: You do not have permission for this endpoint',
        );
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.authToken;
  }

  // private extractTokenFromHeader(request: Request): string[] | undefined {
  //   if (request.headers.authorization) {
  //     const [type, token] = request.headers.authorization.split(' ');

  //     // Si el token tiene un tipo explícito y es "Bearer"
  //     if (type === AuthMethods.BEARER && token) {
  //       return [AuthMethods.BEARER, token];
  //     }

  //     // Si no hay tipo explícito pero existe un token, asumimos que es de Firebase
  //     if (!token && type) {
  //       return [AuthMethods.FIREBASE, type];
  //     }
  //   }
  //   return undefined;
  // }

  private isAllowed(role: string, url: string): boolean {
    // Definir las reglas de acceso basadas en el rol y la URL
    const accessRules = {
      CUSTOMER: ['/api/customer/*'], // Accesible solo a CUSTOMER
      RESTAURANT: ['/api/restaurant/*'], // Accesible solo a RESTAURANT
      ADMIN: ['/api/admin/*'], // Accesible a ADMIN y RESTAURANT
      COURIER: ['/api/courier/*'], // Accesible solo a COURIER
    };

    // Verificar si la URL solicitada pertenece a /api/auth/*
    if (/^\/api\/auth\//.test(url)) {
      return true; // Cualquier usuario puede acceder a las rutas de autenticación
    }

    // Verificar si el rol tiene acceso a la URL solicitada
    const allowedUrls = accessRules[role] || [];

    // Verificar si la URL solicitada se encuentra dentro de las permitidas para el rol
    return allowedUrls.some((pattern) => new RegExp(pattern).test(url));
  }
}
