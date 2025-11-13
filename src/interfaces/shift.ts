import { DateObject } from "react-multi-date-picker";

export interface GetShiftResponse {
  date: string;
  shift: string;
  doctors: {
    name: string;
  };
  created_at: string;
}
export interface GroupedShiftItem {
  doctor: string;
  shift: string;
  created_at: string;
}

export type GroupedShift = Record<string, GroupedShiftItem[]>;

export interface ShiftData {
  doctorId: string;
  pagi: DateObject[];
  siang: DateObject[];
  malam: DateObject[];
  siangMalam: DateObject[];
  lepas: DateObject[];
  libur: DateObject[];
  cuti: DateObject[];
}

export type shiftType = "P" | "S" | "M" | "SM" | "LEPAS" | "LIBUR" | "CUTI";

export interface ShiftPayload {
  doctor_id: string;
  date: string;
  shift: shiftType;
}

export interface GetDoctorListResponse {
  id: string;
  name: string;
  is_active: boolean;
}

export type ShiftFieldType =
  | "pagi"
  | "siang"
  | "malam"
  | "siangMalam"
  | "lepas"
  | "libur"
  | "cuti";
