export interface FruitDetection {
  label: string;
  confidence: number;
  boundingBox: [number, number, number, number]; // x1, y1, x2, y2
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FruitDetectionResult {
  detections: FruitDetection[];
  inferenceTimeMs: number;
  imageWidth: number;
  imageHeight: number;
  summary: string;
}

export class FruitDetectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FruitDetectionError';
  }
}
