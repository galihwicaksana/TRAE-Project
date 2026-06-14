import { getFuelOptionByName } from './fuel';
import type { FuelName, NotificationSeverity, VehicleType } from '../types/ecoroute';

const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const compactFormatter = new Intl.NumberFormat('id-ID', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const decimalFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number) {
  return idrFormatter.format(value);
}

export function formatCompactNumber(value: number) {
  return compactFormatter.format(value);
}

export function formatNumber(value: number, digits = 1) {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number, digits = 1) {
  return `${decimalFormatter.format(Number(value.toFixed(digits)))}%`;
}

export function formatDistance(value: number) {
  return `${formatNumber(value, 1)} km`;
}

export function formatLiters(value: number) {
  return `${formatNumber(value, 2)} L`;
}

export function formatCo2(value: number) {
  return `${formatNumber(value, 2)} kg CO2`;
}

export function formatDateTime(value?: string) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function getVehicleLabel(vehicleType: VehicleType) {
  const mapping: Record<VehicleType, string> = {
    motorcycle: 'Motor Kurir',
    pickup_gasoline: 'Pickup Bensin',
    pickup_diesel: 'Pickup Diesel',
  };

  return mapping[vehicleType];
}

export function getFuelLabel(fuelName: FuelName) {
  return getFuelOptionByName(fuelName).name;
}

export function getFuelDescription(fuelName: FuelName) {
  return getFuelOptionByName(fuelName).description;
}

export function getSeverityLabel(severity: NotificationSeverity) {
  const mapping: Record<NotificationSeverity, string> = {
    info: 'Info',
    warning: 'Warning',
    success: 'Success',
  };

  return mapping[severity];
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
