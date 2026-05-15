import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import jpeg from 'jpeg-js';
import { FruitDetection, FruitDetectionResult, FruitDetectionError } from '@/types/detection';

// Model classes — must match training order from fruit_detection_service.dart
export const DETECTION_LABELS: string[] = ['apple', 'banana', 'grape', 'mango', 'orange'];

// Maps detection label → our Fruit.id (only fruits the model was trained on)
export const LABEL_TO_FRUIT_ID: Record<string, string> = {
  apple: '1',
  mango: '2',
  banana: '3',
  orange: '4',
  grape: '5',
};

const MODEL_INPUT_SIZE = 640;
const PAD_VALUE = 114; // letterbox fill value used during training

export interface DetectionOptions {
  confidenceThreshold?: number;
  nmsThreshold?: number;
  maxDetections?: number;
}

let _session: InferenceSession | null = null;

async function getSession(): Promise<InferenceSession> {
  if (_session) return _session;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const modelAsset = require('../../assets/models/best_int8.onnx');
  _session = await InferenceSession.create(modelAsset);
  return _session;
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}

function buildInputTensor(
  rawPixels: Uint8Array,
  resizedW: number,
  resizedH: number,
  padX: number,
  padY: number,
): Float32Array {
  const channelSize = MODEL_INPUT_SIZE * MODEL_INPUT_SIZE;
  const input = new Float32Array(3 * channelSize);

  // Fill with pad value first (letterbox gray)
  const padNorm = PAD_VALUE / 255.0;
  input.fill(padNorm);

  // rawPixels is RGBA from jpeg-js, stride = 4 bytes per pixel
  for (let py = 0; py < resizedH; py++) {
    for (let px = 0; px < resizedW; px++) {
      const srcIdx = (py * resizedW + px) * 4;
      const dstIdx = (padY + py) * MODEL_INPUT_SIZE + (padX + px);
      input[dstIdx] = rawPixels[srcIdx] / 255.0;                   // R
      input[channelSize + dstIdx] = rawPixels[srcIdx + 1] / 255.0; // G
      input[channelSize * 2 + dstIdx] = rawPixels[srcIdx + 2] / 255.0; // B
    }
  }
  return input;
}

function iou(a: number[], b: number[]): number {
  const x1 = Math.max(a[0], b[0]);
  const y1 = Math.max(a[1], b[1]);
  const x2 = Math.min(a[2], b[2]);
  const y2 = Math.min(a[3], b[3]);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const areaA = (a[2] - a[0]) * (a[3] - a[1]);
  const areaB = (b[2] - b[0]) * (b[3] - b[1]);
  const union = areaA + areaB - inter;
  return union <= 0 ? 0 : inter / union;
}

function decodeYoloOutput(
  output: number[],
  originalW: number,
  originalH: number,
  scale: number,
  padX: number,
  padY: number,
  confidenceThreshold: number,
  nmsThreshold: number,
  maxDetections: number,
): FruitDetection[] {
  const numClasses = DETECTION_LABELS.length;
  const channelCount = 4 + numClasses;

  if (output.length % channelCount !== 0) {
    throw new FruitDetectionError(`Unexpected YOLO output size: ${output.length}`);
  }

  const boxCount = output.length / channelCount;
  const candidates: FruitDetection[] = [];

  for (let i = 0; i < boxCount; i++) {
    let bestClass = 0;
    let bestScore = output[4 * boxCount + i];
    for (let c = 1; c < numClasses; c++) {
      const score = output[(4 + c) * boxCount + i];
      if (score > bestScore) { bestScore = score; bestClass = c; }
    }
    if (bestScore < confidenceThreshold) continue;

    const cx = output[i];
    const cy = output[boxCount + i];
    const w = output[2 * boxCount + i];
    const h = output[3 * boxCount + i];

    const x1 = Math.max(0, ((cx - w / 2) - padX) / scale);
    const y1 = Math.max(0, ((cy - h / 2) - padY) / scale);
    const x2 = Math.min(originalW, ((cx + w / 2) - padX) / scale);
    const y2 = Math.min(originalH, ((cy + h / 2) - padY) / scale);

    candidates.push({
      label: DETECTION_LABELS[bestClass],
      confidence: bestScore,
      boundingBox: [x1, y1, x2, y2],
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2,
      width: x2 - x1,
      height: y2 - y1,
    });
  }

  candidates.sort((a, b) => b.confidence - a.confidence);

  const kept: FruitDetection[] = [];
  for (const candidate of candidates) {
    const overlaps = kept.some(
      e => e.label === candidate.label && iou(e.boundingBox as number[], candidate.boundingBox as number[]) > nmsThreshold,
    );
    if (!overlaps) {
      kept.push(candidate);
      if (kept.length >= maxDetections) break;
    }
  }
  return kept;
}

export async function detectFruitsFromUri(
  imageUri: string,
  options: DetectionOptions = {},
): Promise<FruitDetectionResult> {
  const {
    confidenceThreshold = 0.5,
    nmsThreshold = 0.45,
    maxDetections = 20,
  } = options;

  const t0 = Date.now();

  // Step 1: resize to MODEL_INPUT_SIZE keeping aspect ratio (letterbox)
  const { width: origW, height: origH, base64 } = await manipulateAsync(
    imageUri,
    [],
    { base64: true, format: SaveFormat.JPEG },
  );

  if (!base64) throw new FruitDetectionError('Image manipulation returned no base64 data');

  const scale = Math.min(MODEL_INPUT_SIZE / origW, MODEL_INPUT_SIZE / origH);
  const resizedW = Math.round(origW * scale);
  const resizedH = Math.round(origH * scale);
  const padX = Math.floor((MODEL_INPUT_SIZE - resizedW) / 2);
  const padY = Math.floor((MODEL_INPUT_SIZE - resizedH) / 2);

  const { base64: resizedB64 } = await manipulateAsync(
    imageUri,
    [{ resize: { width: resizedW, height: resizedH } }],
    { base64: true, format: SaveFormat.JPEG },
  );

  if (!resizedB64) throw new FruitDetectionError('Resize step returned no base64 data');

  // Step 2: decode JPEG → raw RGBA pixels
  const jpegBytes = base64ToUint8Array(resizedB64);
  const decoded = jpeg.decode(jpegBytes, { useTArray: true });

  // Step 3: build CHW float32 input tensor
  const inputData = buildInputTensor(
    decoded.data as Uint8Array,
    decoded.width,
    decoded.height,
    padX,
    padY,
  );

  // Step 4: run ONNX inference
  const session = await getSession();
  const inputTensor = new Tensor('float32', inputData, [1, 3, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE]);
  const feeds: Record<string, Tensor> = { [session.inputNames[0]]: inputTensor };
  const results = await session.run(feeds);
  const outputTensor = results[session.outputNames[0]];
  const rawOutput = Array.from(outputTensor.data as Float32Array);

  // Step 5: decode YOLO output
  const detections = decodeYoloOutput(
    rawOutput, origW, origH, scale, padX, padY,
    confidenceThreshold, nmsThreshold, maxDetections,
  );

  const counts: Record<string, number> = {};
  for (const d of detections) counts[d.label] = (counts[d.label] ?? 0) + 1;
  const summary = Object.keys(counts).length === 0
    ? 'No fruits detected'
    : Object.entries(counts).map(([k, v]) => `${v} ${k}${v > 1 ? 's' : ''}`).join(', ');

  return {
    detections,
    inferenceTimeMs: Date.now() - t0,
    imageWidth: origW,
    imageHeight: origH,
    summary,
  };
}
