import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditCarForm } from "./EditCarForm";

export const metadata = { title: "Edit Mobil - Admin" };

export default async function EditCarPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const car = await db.car.findUnique({
    where: { id },
    include: { images: { orderBy: { isPrimary: "desc" } } },
  });

  if (!car) notFound();

  // Gabungkan semua URL gambar menjadi satu string dipisah koma
  const imageUrlString = car.images.map(img => img.url).join(", ");

  // Siapkan data untuk dikirim ke client component
  const carData = {
    id: car.id,
    brand: car.brand,
    model: car.model,
    year: car.year,
    price: car.price,
    mileage: car.mileage,
    condition: car.condition,
    transmission: car.transmission,
    fuelType: car.fuelType,
    color: car.color,
    description: car.description || "",
    status: car.status,
    imageUrl: imageUrlString,
  };

  return <EditCarForm car={carData} />;
}
