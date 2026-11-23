import { Archivo_Black } from "next/font/google";

/** Poster display face shared by the home hero and the navbar. */
export const archivo = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo",
  display: "swap",
});
