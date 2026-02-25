import { UserRole } from '@/domain/entities/user.entity';
import { AuthUser } from '../types/auth.types';

const parseTimeToSeconds = (timeStr: string): number => {
  const unit = timeStr.slice(-1).toLowerCase();
  const value = parseInt(timeStr.slice(0, -1));

  switch (unit) {
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      return Number(timeStr) || 86400; // Fallback para 24h se falhar
  }
};

function getTenant(user: AuthUser): string | null {
  if (user.roles.includes(UserRole.OWNER || UserRole.ADMIN)) {
    return user.id;
  }

  return user.tenantId || null;
}

function formatISOWithTimezone(timestamp: number): string {
  // Cria a data e subtrai 3 horas
  const date = new Date((timestamp - 3 * 60 * 60) * 1000);

  // Converte para ISO string mantendo o horário ajustado
  return date.toISOString();
}

export { parseTimeToSeconds, getTenant, formatISOWithTimezone };
