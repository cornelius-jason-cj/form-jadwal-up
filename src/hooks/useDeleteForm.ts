import { GetDoctorListResponse, GetShiftResponse } from "@/interfaces/shift";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

function useDeleteForm() {
  const router = useRouter();
  const [doctorList, setDoctorList] = useState<GetDoctorListResponse[]>([]);
  const [shifts, setShifts] = useState<GetShiftResponse[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadDoctors = useCallback(async () => {
    setErrorMsg("");
    const { data, error } = await supabase
      .from("doctors")
      .select("id, name")
      .order("name")
      .returns<GetDoctorListResponse[]>();

    if (error) {
      setErrorMsg("Gagal mengambil daftar dokter");
      return;
    }

    return data;
  }, []);

  useEffect(() => {
    (async () => {
      const data = await loadDoctors();
      if (data) setDoctorList(data);
      return;
    })();
  }, [loadDoctors]);

  const loadShifts = useCallback(async (doctorId: string) => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { data, error } = await supabase
      .from("shifts")
      .select("id, date, shift")
      .eq("doctor_id", doctorId)
      .order("date")
      .returns<GetShiftResponse[]>();

    if (error) {
      setErrorMsg("Gagal mengambil jadwal");
      setLoading(false);
      return;
    }

    setLoading(false);
    return data;
  }, []);

  useEffect(() => {
    if (!selectedDoctor) return;

    (async () => {
      const data = await loadShifts(selectedDoctor);
      if (data) setShifts(data);
      return;
    })();
  }, [selectedDoctor, loadShifts]);

  const handleDelete = useCallback(async (id: string) => {
    setErrorMsg("");
    setSuccessMsg("");

    const { error } = await supabase.from("shifts").delete().eq("id", id);

    if (error) {
      setErrorMsg("Gagal menghapus data");
      return;
    }

    setShifts((prev) => prev.filter((x) => x.id !== id));

    setSuccessMsg("Berhasil dihapus");
  }, []);

  const handleGoToCalendar = () => {
    router.push("/calendar");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return {
    doctorList,
    shifts,
    selectedDoctor,

    setSelectedDoctor,
    loadShifts,
    handleDelete,
    handleGoToCalendar,
    handleLogout,

    loading,
    errorMsg,
    successMsg,
  };
}

export default useDeleteForm;
