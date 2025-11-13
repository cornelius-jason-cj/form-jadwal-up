import ShiftForm from "../components/ShiftForm";

export default function Home() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Input Jadwal Dokter</h1>
      <ShiftForm />
    </div>
  );
}
