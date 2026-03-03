export type MapPin = {
  id: "about" | "education" | "projects" | "skills" | "experience" | "contact";
  x: number;
  y: number;
  zoomLevel: number;
};

export const mapPins: MapPin[] = [
  { id: "about", x: 270, y: 805, zoomLevel: 1.45 },
  { id: "education", x: 620, y: 488, zoomLevel: 1.5 },
  { id: "projects", x: 1090, y: 520, zoomLevel: 1.52 },
  { id: "skills", x: 845, y: 760, zoomLevel: 1.5 },
  { id: "experience", x: 1300, y: 845, zoomLevel: 1.46 },
  { id: "contact", x: 1320, y: 330, zoomLevel: 1.42 },
];
