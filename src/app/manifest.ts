import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Husain Hakim | Offensive & Defensive Security Portfolio",
    short_name: "Husain Hakim",
    description:
      "Cybersecurity workspace & offensive/defensive security portfolio of Husain Hakim.",
    start_url: "/",
    display: "standalone",
    background_color: "#101114",
    theme_color: "#8b1e2f",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/husain.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
