"use client";

import useDeleteForm from "@/hooks/useDeleteForm";

export default function DeleteShiftPage() {
  const {
    doctorList,
    shifts,
    selectedDoctor,
    setSelectedDoctor,
    handleDelete,
    handleGoToCalendar,
    handleLogout,
    loading,
    errorMsg,
    successMsg,
  } = useDeleteForm();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex flex-row w-full justify-between">
        <div>
          <h3 className={`text-lg mb-4 cursor-default`}>
            Delete Jadwal Dokter
          </h3>
        </div>
        <div onClick={handleGoToCalendar}>
          <h3 className={`text-lg mb-4 cursor-pointer hover:underline`}>
            Lihat Jadwal Dokter
          </h3>
        </div>
        <button
          onClick={handleLogout}
          className="text-lg mb-4 cursor-pointer hover:underline text-red-600"
        >
          Logout
        </button>
      </div>
      {errorMsg && (
        <div className="mb-4 bg-red-100 text-red-600 p-2 rounded">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 bg-green-100 text-green-600 p-2 rounded">
          {successMsg}
        </div>
      )}

      <select
        className="border p-2 mb-4 rounded"
        value={selectedDoctor}
        onChange={(e) => setSelectedDoctor(e.target.value)}
      >
        <option value="">-- Pilih Dokter --</option>
        {doctorList.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      {loading && <div>Loading...</div>}

      {!loading && shifts.length > 0 && (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Tanggal</th>
              <th className="border p-2">Shift</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.date}</td>
                <td className="border p-2">{s.shift}</td>
                <td className="border p-2">
                  <button
                    onClick={() => {
                      if (confirm("Yakin ingin menghapus jadwal ini?")) {
                        handleDelete(s.id);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedDoctor && !loading && shifts.length === 0 && (
        <div className="mt-4 text-gray-500">Tidak ada jadwal.</div>
      )}
    </div>
  );
}
