"use client";

import DatePicker from "react-multi-date-picker";
import { Control, Controller } from "react-hook-form";
import useShiftForm from "@/hooks/useShiftForm";
import { ShiftData, ShiftFieldType } from "@/interfaces/shift";

function DateField({
  label,
  name,
  control,
}: {
  label: string;
  name: ShiftFieldType;
  control: Control<ShiftData>;
}) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold">{label}</label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            multiple
            value={field.value}
            onChange={(val) => field.onChange(val)}
            format="DD-MMMM-YYYY"
            render={(value, openCalendar) => (
              <div
                onClick={openCalendar}
                className="border p-2 rounded"
                style={{ minHeight: "40px", whiteSpace: "pre-wrap" }}
              >
                {value}
              </div>
            )}
          />
        )}
      />
    </div>
  );
}

export default function ShiftForm() {
  const {
    doctorList,
    register,
    handleSubmit,
    control,
    errors,
    isSubmitting,
    onSubmit,
  } = useShiftForm();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 bg-white rounded shadow space-y-6"
    >
      {/* Select Dokter */}
      <div>
        <label className="font-semibold">Nama Dokter</label>
        <select {...register("doctorId")} className="border p-2 w-full">
          <option value="">-- Pilih Dokter --</option>
          {doctorList.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
        {errors.doctorId && (
          <p className="text-red-600 text-sm mt-1">{errors.doctorId.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <DateField label="Shift Pagi (P)" name="pagi" control={control} />
        <DateField label="Shift Siang (S)" name="siang" control={control} />
        <DateField label="Shift Malam (M)" name="malam" control={control} />
        <DateField
          label="Shift Siang + Malam (SM)"
          name="siangMalam"
          control={control}
        />
        <DateField label="Lepas" name="lepas" control={control} />
        <DateField label="Libur" name="libur" control={control} />
        <DateField label="Cuti" name="cuti" control={control} />
      </div>

      {errors.root?.shifts && (
        <p className="text-red-600 text-sm">{errors.root.shifts.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {isSubmitting ? "Menyimpan..." : "Simpan Semua"}
      </button>
    </form>
  );
}
