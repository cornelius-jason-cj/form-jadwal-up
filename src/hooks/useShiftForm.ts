import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {
  GetDoctorListResponse,
  ShiftData,
  ShiftFieldType,
  ShiftPayload,
} from "@/interfaces/shift";
import { DateObject } from "react-multi-date-picker";

function useShiftForm() {
  const [doctorList, setDoctorList] = useState<GetDoctorListResponse[]>([]);
  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      doctorId: "",
      pagi: [],
      siang: [],
      malam: [],
      siangMalam: [],
      lepas: [],
      libur: [],
      cuti: [],
    },
  });

  const convertDates = (dates: DateObject[]): string[] => {
    return dates.map((d) => d.format("YYYY-MM-DD"));
  };

  const onSubmit = async (data: ShiftData) => {
    if (!data.doctorId) {
      setError("doctorId", { message: "Pilih dokter" });
      return;
    } else {
      clearErrors("doctorId");
    }

    const shiftFields: ShiftFieldType[] = [
      "pagi",
      "siang",
      "malam",
      "siangMalam",
      "lepas",
      "libur",
      "cuti",
    ];
    const hasAny = shiftFields.some((f) => data[f]?.length > 0);

    if (!hasAny) {
      setError("root.shifts", { message: "Isi minimal 1 shift" });
      return;
    } else {
      clearErrors("root.shifts");
    }

    const shiftMap = {
      P: data.pagi,
      S: data.siang,
      M: data.malam,
      SM: data.siangMalam,
      LEPAS: data.lepas,
      LIBUR: data.libur,
      CUTI: data.cuti,
    } as const;

    const payload: ShiftPayload[] = Object.entries(shiftMap).flatMap(
      ([shift, dates]) =>
        convertDates(dates).map((date) => ({
          doctor_id: data.doctorId,
          date,
          shift: shift as ShiftPayload["shift"],
        })),
    );

    try {
      const { error } = await supabase.from("shifts").insert(payload);
      if (error) throw error;
      alert("Berhasil disimpan!");
      reset();
    } catch (err) {
      if (err instanceof Error) {
        alert("Error: " + err.message);
      } else {
        alert("Error Server");
      }
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("is_active", true)
        .order("name")
        .returns<GetDoctorListResponse[]>();

      if (error) {
        alert("Gagal fetch list dokter!");
      } else {
        setDoctorList(data);
      }
    };
    fetchDoctors();
  }, []);

  return {
    doctorList,
    register,
    handleSubmit,
    control,
    errors,
    isSubmitting,
    onSubmit,
  };
}

export default useShiftForm;
