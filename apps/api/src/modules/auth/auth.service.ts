import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        phone: dto.phone,
      },
    });

    return this.generateTokens(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return { ...tokens, user: this.sanitizeUser(user) };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET') || 'dev-refresh-secret',
      });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return this.generateTokens(user.id, user.email, user.role);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return this.sanitizeUser(user);
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET') || 'dev-secret',
        expiresIn: this.config.get('JWT_EXPIRES_IN') || '15m',
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET') || 'dev-refresh-secret',
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN') || '7d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: { id: string; email: string; fullName: string; phone: string | null; role: string; createdAt: Date }) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
