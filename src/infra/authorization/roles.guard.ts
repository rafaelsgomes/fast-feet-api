import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from './roles.decorator'
import { PrismaService } from '../database/prisma.service'
import { Role as PrismaRole } from '@prisma/client'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) {
      return true
    }
    const { user } = context.switchToHttp().getRequest()

    const userOnDatabase = await this.prisma.user.findUnique({
      where: {
        id: user.sub,
      },
      select: {
        roles: true,
      },
    })

    const isAllowed = requiredRoles.some((role) =>
      userOnDatabase.roles?.includes(PrismaRole[role]),
    )

    return isAllowed
  }
}
