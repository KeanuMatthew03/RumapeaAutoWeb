"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  name: string;
  desc: string;
};

export function CategoryCard({ name, desc }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/cars?category=${name}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block px-8 py-10 bg-white border border-stone-200 transition-all duration-300"
      style={{
        borderColor: hovered ? "#1A3A2A" : "",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 24px rgba(26,58,42,0.10)" : "none",
      }}
    >
      <p
        className="text-2xl font-bold uppercase tracking-tight transition-colors duration-300"
        style={{ color: hovered ? "#1A3A2A" : "#111827" }}
      >
        {name}
      </p>
      <p className="text-base text-gray-500 mt-2">{desc}</p>
      <p
        className="text-base mt-6 font-medium transition-colors duration-300"
        style={{ color: hovered ? "#C8961A" : "#D1D5DB" }}
      >
        Lihat →
      </p>
    </Link>
  );
}
