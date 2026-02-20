'use client';

import { useState, useEffect, useRef } from 'react';
import { getTranslation } from '@/lib/translations';
import { useAppStore } from '@/lib/store';
import ARView from './ARView';
import { Phone, RotateCcw, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface CPRGuideProps {
  onClose: () => void;
}

export default function CPRGuide({ onClose }: CPRGuideProps) {
  const [showAR, setShowAR] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(110);
  const [isCompressing, setIsCompressing] = useState(false);
  const [helpArriving, setHelpArriving] = useState(false);
  const [minutesRemaining, setMinutesRemaining] = useState(10);
  const [handPositionGood, setHandPositionGood] = useState<boolean | null>(null);
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(language, key);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const steps = [
    t('cprInstructions.step1'),
    t('cprInstructions.step2'),
    t('cprInstructions.step3'),
    t('cprInstructions.step4'),
    t('cprInstructions.step5'),
  ];

  useEffect(() => {
    synthRef.current = window.speechSynthesis;

    // Start help arrival countdown
    const countdownInterval = setInterval(() => {
      setMinutesRemaining((prev) => {
        if (prev <= 1) {
          setHelpArriving(true);
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => {
      clearInterval(countdownInterval);
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (showAR && synthRef.current) {
      speakInstructions();
    }
  }, [showAR, currentStep, language]);

  const speakInstructions = () => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    const text = steps[currentStep];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const handleRepeatInstructions = () => {
    speakInstructions();
  };

  const handleEmergencyCall = () => {
    window.location.href = 'tel:112';
  };

  const handleStartAR = () => {
    setShowAR(true);
    setCurrentStep(0);
  };

  // BPM visual indicator
  useEffect(() => {
    if (showAR && currentStep >= 3) {
      const interval = setInterval(() => {
        setIsCompressing(true);
        setTimeout(() => setIsCompressing(false), 300);
      }, (60 / bpm) * 1000);

      return () => clearInterval(interval);
    }
  }, [showAR, currentStep, bpm]);

  if (showAR) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <ARView 
          emergencyType="cpr" 
          onClose={() => setShowAR(false)}
          onHandPosition={setHandPositionGood}
        />
        
        {/* Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
            <button
              onClick={() => setShowAR(false)}
              className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70"
            >
              <X size={24} />
            </button>
            <button
              onClick={handleRepeatInstructions}
              className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70"
            >
              <RotateCcw size={24} />
            </button>
          </div>

          {/* Step Instructions Panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-6 pointer-events-auto">
            <div className="max-w-4xl mx-auto">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-600 px-3 py-1 rounded-full text-sm font-bold">
                    Step {currentStep + 1} / {steps.length}
                  </span>
                  {currentStep >= 3 && (
                    <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                      {bpm} BPM
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2">{steps[currentStep]}</h3>
              </div>

              {/* Compression Indicator */}
              {currentStep >= 3 && (
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-4">
                    <div
                      className={`w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold transform transition-transform ${
                        isCompressing ? 'scale-90' : 'scale-100'
                      }`}
                    >
                      {isCompressing ? '↓' : '↑'}
                    </div>
                    <div className="text-lg">
                      {isCompressing ? 'Compress' : 'Release'}
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Steps */}
              <div className="flex gap-2 mb-4">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`flex-1 h-2 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-red-600'
                        : index < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600"
                  >
                    Previous
                  </button>
                )}
                {currentStep < steps.length - 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Next Step
                  </button>
                )}
                {currentStep === steps.length - 1 && (
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                  >
                    Restart
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Help Arriving Indicator */}
          {helpArriving && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg pointer-events-auto">
              <p className="font-bold text-lg">
                {t('helpArriving')} {minutesRemaining} {t('minutes')}
              </p>
            </div>
          )}

          {/* Hand Position Feedback */}
          {currentStep >= 2 && handPositionGood !== null && (
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 pointer-events-auto">
              <div
                className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-lg ${
                  handPositionGood
                    ? 'bg-green-600 text-white'
                    : 'bg-orange-600 text-white'
                }`}
              >
                {handPositionGood ? (
                  <>
                    <CheckCircle2 size={24} />
                    <span className="font-bold text-lg">{t('goodPosition')}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={24} />
                    <span className="font-bold text-lg">{t('moveHands')}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4 text-center">
            {t('cpr')} {t('startAR')}
          </h1>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Instructions Preview:</h2>
            <ol className="list-decimal list-inside space-y-3 text-lg">
              {steps.map((step, index) => (
                <li key={index} className="p-3 bg-gray-50 rounded-lg">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleStartAR}
              className="flex-1 bg-red-600 text-white py-4 rounded-lg font-bold text-xl hover:bg-red-700 transition-colors"
            >
              {t('startAR')}
            </button>
            <button
              onClick={handleEmergencyCall}
              className="flex-1 bg-red-700 text-white py-4 rounded-lg font-bold text-xl hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
            >
              <Phone size={24} />
              {t('emergencyCall')}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-4 rounded-lg font-bold text-xl hover:bg-gray-600 transition-colors"
            >
              {t('back')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
