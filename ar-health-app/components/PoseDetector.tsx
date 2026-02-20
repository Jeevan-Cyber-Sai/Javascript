'use client';

import { useEffect, useRef, useState } from 'react';

interface PoseDetectorProps {
  onHandPosition: (isGoodPosition: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

// Minimal type descriptions for the parts of MediaPipe Pose we use
type PoseResults = {
  image: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement;
  poseLandmarks?: Array<{ x: number; y: number }> | undefined;
};

type PoseInstance = {
  setOptions: (options: Record<string, unknown>) => void;
  onResults: (callback: (results: PoseResults) => void) => void;
  send: (input: { image: HTMLVideoElement }) => Promise<void>;
  close: () => void;
};

type PoseModule = {
  Pose: new (config: { locateFile: (file: string) => string }) => PoseInstance;
};

export default function PoseDetector({ onHandPosition, videoRef }: PoseDetectorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<PoseInstance | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let rafId: number | null = null;
    let isCancelled = false;

    let localPose: PoseInstance | null = null;

    const initPose = async () => {
      try {
        const mpModule = (await import('@mediapipe/pose')) as PoseModule;
        const pose = new mpModule.Pose({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1635989137/${file}`,
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        pose.onResults((results: PoseResults) => {
          if (!ctx || !canvas) return;

          ctx.save();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

          if (results.poseLandmarks) {
            // Check hand position relative to chest
            // Landmarks: 11 = left shoulder, 12 = right shoulder, 23 = left hip, 24 = right hip
            // 15 = left wrist, 16 = right wrist
            const leftWrist = results.poseLandmarks[15];
            const rightWrist = results.poseLandmarks[16];
            const leftShoulder = results.poseLandmarks[11];
            const rightShoulder = results.poseLandmarks[12];
            const leftHip = results.poseLandmarks[23];
            const rightHip = results.poseLandmarks[24];

            if (
              leftWrist &&
              rightWrist &&
              leftShoulder &&
              rightShoulder &&
              leftHip &&
              rightHip
            ) {
              // Calculate chest center (midpoint between shoulders and hips)
              const chestCenterX =
                (leftShoulder.x + rightShoulder.x + leftHip.x + rightHip.x) / 4;
              const chestCenterY =
                (leftShoulder.y + rightShoulder.y + leftHip.y + rightHip.y) / 4;

              // Check if wrists are near chest center
              const leftDistance = Math.sqrt(
                Math.pow(leftWrist.x - chestCenterX, 2) +
                  Math.pow(leftWrist.y - chestCenterY, 2)
              );
              const rightDistance = Math.sqrt(
                Math.pow(rightWrist.x - chestCenterX, 2) +
                  Math.pow(rightWrist.y - chestCenterY, 2)
              );

              // Threshold for "good position" (adjust based on testing)
              const threshold = 0.15;
              const isGoodPosition =
                leftDistance < threshold && rightDistance < threshold;

              onHandPosition(isGoodPosition);
            }
          }

          ctx.restore();
        });

        poseRef.current = pose;
        localPose = pose;

        const syncCanvasSize = () => {
          const video = videoRef.current;
          if (!video) return;
          const w = video.videoWidth || 640;
          const h = video.videoHeight || 480;
          if (canvas.width !== w) canvas.width = w;
          if (canvas.height !== h) canvas.height = h;
        };

        const processFrame = async () => {
          if (isCancelled) return;
          const video = videoRef.current;
          const poseApi = poseRef.current;
          if (video && poseApi && video.readyState >= 2) {
            syncCanvasSize();
            try {
              await poseApi.send({ image: video });
              if (!isInitialized) setIsInitialized(true);
            } catch {
              // ignore transient frame errors
            }
          }
          rafId = requestAnimationFrame(processFrame);
        };

        rafId = requestAnimationFrame(processFrame);
      } catch (error) {
        // If MediaPipe fails to load, we silently disable pose detection
        console.error('Failed to initialize MediaPipe Pose', error);
      }
    };

    void initPose();

    return () => {
      isCancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (localPose) {
        localPose.close();
      }
    };
  }, [videoRef, onHandPosition, isInitialized]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: isInitialized ? 'block' : 'none' }}
    />
  );
}
