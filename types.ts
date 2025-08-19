
export interface Project {
  id: string;
  projectName: string;
  shortDescription: string;
  longDescription: string;
  mainImage: string;
  galleryImages: string[];
  location: string;
  year: string;
  category: string;
  client: string;
  status: string;
  architects: string;
  area: number;
  awards: string;
  completionPercentage: number;
  recamaras: number;
  banos: number;
  cocina: number;
  estacionamiento: number;
  areaDistribution: { name: string; value: number }[];
  // New fields for detailed view
  costPerSqMeter?: string; // Cost per Square Meter (e.g., "$2,150")
  executionTime?: string;  // Execution Time (e.g., "14 Meses")
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface GeminiResponse {
    text: string;
}