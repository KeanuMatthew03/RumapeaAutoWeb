"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash, ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
}) => {
  const onUpload = (result: any) => {
    // result.info.secure_url adalah link foto yang baru diunggah
    onChange([...value, result.info.secure_url]);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Pratinjau Foto yang Terunggah */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {value.map((url) => (
          <div key={url} className="relative aspect-video rounded-lg overflow-hidden border border-zinc-200 group">
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                type="button" 
                onClick={() => onRemove(url)} 
                variant="destructive" 
                size="icon"
                className="h-8 w-8 shadow-lg"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Car Preview"
              src={url}
            />
          </div>
        ))}
        
        {/* Placeholder Kosong Jika Belum Ada Foto */}
        {value.length === 0 && (
          <div className="aspect-video rounded-lg border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50 text-zinc-400">
            <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-[10px] uppercase tracking-widest font-bold">Belum Ada Foto</p>
          </div>
        )}
      </div>

      {/* Tombol Upload (Cloudinary Widget) */}
      <CldUploadWidget 
        onUpload={onUpload} 
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "rumapea_preset"}
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={false}
              variant="outline"
              onClick={onClick}
              className="w-full h-24 border-2 border-dashed border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex flex-col gap-2"
            >
              <ImagePlus className="h-6 w-6 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Tambah Foto Mobil (Galeri)
              </span>
            </Button>
          );
        }}
      </CldUploadWidget>
      
      <p className="text-[10px] text-zinc-400 italic">
        * Foto pertama akan otomatis dijadikan foto utama (Thumbnail).
      </p>
    </div>
  );
};
