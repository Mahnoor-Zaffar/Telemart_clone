import { Controller, Get } from '@nestjs/common';
import { Public } from './modules/auth/guards';

@Controller('health')
@Public()
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
