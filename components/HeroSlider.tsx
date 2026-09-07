"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface HeroSliderProps {
  title: string;
  subtitle: string;
  mainImageUrl?: string;
  imageUrl2?: string;
  imageUrl3?: string;
}

export default function HeroSlider({
  title,
  subtitle,
  mainImageUrl,
  imageUrl2,
  imageUrl3,
}: HeroSliderProps) {
  // Array gambar slider dari DB / Fallback foto kegiatan nyata
  const images = [
    mainImageUrl ||
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80",
    imageUrl2 ||
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    imageUrl3 ||
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1600&q=80",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative w-full h-[400px] sm:h-[480px] md:h-[550px] lg:h-[600px] overflow-hidden bg-gray-900 group">
      {/* Slider Images with Smooth Fade Transition */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
          style={{
            backgroundImage: `url('${img}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay gradient gelap di atas foto */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 backdrop-blur-[0.5px]"></div>
        </div>
      ))}

      {/* Konten Teks Overlay (Center Aligned) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-10 z-10 max-w-5xl mx-auto">
        {/* Judul Utama */}
        <h1
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(28px, 4.5vw, 56px)",
            lineHeight: 1.15,
          }}
          className="font-extrabold text-white mb-4 drop-shadow-lg tracking-tight"
        >
          {title || "Selamat Datang di Kelurahan Bonto Lebang"}
        </h1>

        {/* Sub-teks */}
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(14px, 1.8vw, 18px)",
          }}
          className="text-gray-100 dark:text-gray-200 max-w-2xl leading-relaxed mb-8 drop-shadow-md text-center"
        >
          {subtitle ||
            "Portal resmi yang menampilkan profil kelurahan, potensi unggulan, data kependudukan, berita, galeri, dan layanan pengaduan masyarakat."}
        </p>

        {/* Tombol CTA Merah */}
        <Link
          href="/profil"
          className="w-full sm:w-auto inline-flex items-center justify-center bg-[#A91D3A] hover:bg-[#6B1124] text-white font-bold px-9 py-3.5 rounded-full transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] text-base"
        >
          Lihat Profil
        </Link>
      </div>

      {/* Navigasi Panah Kiri & Kanan (Chevron) */}
      <button
        onClick={prevSlide}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/75 text-white transition-all duration-200 z-20 backdrop-blur-md border border-white/10 cursor-pointer"
        aria-label="Slide sebelumnya"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-5 h-5 md:w-6 md:h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/75 text-white transition-all duration-200 z-20 backdrop-blur-md border border-white/10 cursor-pointer"
        aria-label="Slide berikutnya"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-5 h-5 md:w-6 md:h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              index === currentIndex
                ? "bg-[#A91D3A] w-8 h-3 shadow-md"
                : "bg-white/50 hover:bg-white/90 w-3 h-3"
            }`}
            aria-label={`Ke slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
