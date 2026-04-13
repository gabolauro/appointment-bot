export type AvailabilityStatus = "available" | "unavailable" | "unknown";

export enum EnumStatusType {
  ACTIVE = 0,
  NO_ACTIVE = 1,
  NO_WORKING_DAY = 2,
}

export interface ApiDay {
  dia: string; // e.g. "2026-04-13"
  estado: EnumStatusType | number;
}

export interface ApiPeriod {
  fecha_inicial: string;
  fecha_final: string;
  dias: number;
  id_periodo: number;
  nombre_centro: string;
  nombre_servicio: string;
}

export interface ApiPayload {
  dias: ApiDay[];
  periodos: ApiPeriod[];
}

export interface AppConfig {
  apiUrl: string;
  apiFieldPath: string;
  apiAvailableValue: string;
  pollTimeoutMs: number;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
  };
  email: {
    from: string;
    to: string;
  };
}

export interface ApiResult {
  raw: unknown;
  status: AvailabilityStatus;
}
