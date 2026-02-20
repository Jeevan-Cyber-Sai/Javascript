'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { getTranslation } from '@/lib/translations';
import { useAppStore, EmergencyType } from '@/lib/store';
import PoseDetector from './PoseDetector';

interface ARViewProps {
  emergencyType: EmergencyType;
  onClose: () => void;
  onHandPosition?: (isGoodPosition: boolean) => void;
}

export default function ARView({ emergencyType, onClose, onHandPosition }: ARViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(language, key);

  useEffect(() => {
    let animationFrameId: number;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let handOverlay: THREE.Group;

    const initAR = async () => {
      try {
        // Request camera permission
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });

        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }

        // Setup Three.js scene
        if (canvasRef.current && containerRef.current) {
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;

          scene = new THREE.Scene();
          camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
          renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true,
          });
          renderer.setSize(width, height);
          renderer.setPixelRatio(window.devicePixelRatio);

          // Create hand placement overlay for CPR
          if (emergencyType === 'cpr') {
            handOverlay = new THREE.Group();

            // Left hand
            const leftHandGeometry = new THREE.PlaneGeometry(0.3, 0.4);
            const leftHandMaterial = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.7,
              side: THREE.DoubleSide,
            });
            const leftHand = new THREE.Mesh(leftHandGeometry, leftHandMaterial);
            leftHand.position.set(-0.15, 0, 0);
            handOverlay.add(leftHand);

            // Right hand
            const rightHandGeometry = new THREE.PlaneGeometry(0.3, 0.4);
            const rightHandMaterial = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.7,
              side: THREE.DoubleSide,
            });
            const rightHand = new THREE.Mesh(rightHandGeometry, rightHandMaterial);
            rightHand.position.set(0.15, 0, 0);
            handOverlay.add(rightHand);

            // Center indicator
            const centerGeometry = new THREE.RingGeometry(0.1, 0.15, 32);
            const centerMaterial = new THREE.MeshBasicMaterial({
              color: 0xff0000,
              transparent: true,
              opacity: 0.8,
              side: THREE.DoubleSide,
            });
            const center = new THREE.Mesh(centerGeometry, centerMaterial);
            handOverlay.add(center);

            handOverlay.position.set(0, 0, -1);
            scene.add(handOverlay);

            // Animate hand overlay
            const animate = () => {
              if (handOverlay) {
                handOverlay.rotation.z += 0.01;
                center.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.1);
              }
              renderer.render(scene, camera);
              animationFrameId = requestAnimationFrame(animate);
            };
            animate();
          }

          camera.position.z = 1;
          setIsLoading(false);
        }
      } catch (err) {
        console.error('AR initialization error:', err);
        setError('Failed to access camera. Please grant camera permissions.');
        setIsLoading(false);
      }
    };

    initAR();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [emergencyType]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        // Resize logic would go here; renderer uses these dimensions on init
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div ref={containerRef} className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* MediaPipe Pose Detection for CPR */}
        {emergencyType === 'cpr' && onHandPosition !== undefined ? (
          <PoseDetector videoRef={videoRef} onHandPosition={onHandPosition!} />
        ) : null}
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
              <p>Initializing AR camera...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="text-center text-white p-6">
              <p className="text-xl mb-4">{error}</p>
              <button
                onClick={onClose}
                className="bg-red-600 text-white px-6 py-3 rounded-lg"
              >
                {t('back')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
