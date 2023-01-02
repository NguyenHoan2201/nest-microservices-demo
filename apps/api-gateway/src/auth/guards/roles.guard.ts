import {
    Injectable,
    CanActivate,
    ExecutionContext,
  } from "@nestjs/common";
  import { Reflector } from "@nestjs/core";
  import { Role } from "@microservices-demo/shared/interfaces";
  import { ROLES_KEY } from "../decorators/role.decorator";
  import { RequestWithUser } from "../interfaces/auth.interface";
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      if (!requiredRoles) return true;
  
      const { user } = context.switchToHttp().getRequest<RequestWithUser>();
  
      return requiredRoles.some((role) => user.roles?.includes(role));
    }
  }