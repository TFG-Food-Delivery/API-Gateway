import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const { user, token: newToken } = await firstValueFrom(
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

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isAllowed(role: string, url: string): boolean {
    // Definir las reglas de acceso basadas en el rol y la URL
    const accessRules = {
      CUSTOMER: ['/api/customer/*'], // Accesible solo a CUSTOMER
      RESTAURANT: ['/api/restaurant/*'], // Accesible solo a RESTAURANT
      ADMIN: ['/api/admin/*'], // Accesible a ADMIN y RESTAURANT
      COURIER: ['/api/courier/*'], // Accesible solo a COURIER
    };

    // Verificar si el rol tiene acceso a la URL solicitada
    const allowedUrls = accessRules[role] || [];

    // Verificar si la URL solicitada se encuentra dentro de las permitidas para el rol
    return allowedUrls.some((pattern) => new RegExp(pattern).test(url));
  }
}
