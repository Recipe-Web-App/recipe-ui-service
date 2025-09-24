'use client';

import React, { useState, useEffect } from 'react';
import {
  Progress,
  CookingStep,
  CookingProgress,
  UploadProgress,
  TimerProgress,
} from '@/components/ui/progress';

// Sample cooking steps for demo
const sampleRecipeSteps = [
  {
    id: 'prep',
    title: 'Prep ingredients',
    description: 'Wash vegetables, measure spices, and organize workspace',
    duration: '10 min',
    isCompleted: false,
    isSkipped: false,
  },
  {
    id: 'preheat',
    title: 'Preheat oven',
    description: 'Heat oven to 375°F (190°C)',
    duration: '5 min',
    isCompleted: false,
    isSkipped: false,
  },
  {
    id: 'saute',
    title: 'Sauté aromatics',
    description: 'Cook onions, garlic, and ginger until fragrant',
    duration: '8 min',
    isCompleted: false,
    isSkipped: false,
  },
  {
    id: 'combine',
    title: 'Combine ingredients',
    description: 'Mix all prepared ingredients in baking dish',
    duration: '5 min',
    isCompleted: false,
    isSkipped: false,
  },
  {
    id: 'bake',
    title: 'Bake the dish',
    description: 'Bake covered for 30 minutes, then uncovered for 15 minutes',
    duration: '45 min',
    isCompleted: false,
    isSkipped: false,
  },
  {
    id: 'rest',
    title: 'Rest and serve',
    description: 'Let cool for 5 minutes before serving',
    duration: '5 min',
    isCompleted: false,
    isSkipped: false,
  },
];

// Sample upload files for demo
const sampleUploads = [
  {
    id: '1',
    fileName: 'recipe-hero-image.jpg',
    fileSize: '3.2 MB',
    initialProgress: 0,
    state: 'uploading' as 'uploading' | 'completed' | 'error' | 'paused',
    speed: '2.1 MB/s',
  },
  {
    id: '2',
    fileName: 'cooking-video.mp4',
    fileSize: '15.7 MB',
    initialProgress: 0,
    state: 'uploading' as 'uploading' | 'completed' | 'error' | 'paused',
    speed: '1.8 MB/s',
  },
  {
    id: '3',
    fileName: 'ingredients-photo.png',
    fileSize: '850 KB',
    initialProgress: 0,
    state: 'uploading' as 'uploading' | 'completed' | 'error' | 'paused',
    speed: '3.2 MB/s',
  },
];

export default function ProgressDemo() {
  const [basicProgress, setBasicProgress] = useState(65);
  const [cookingSteps, setCookingSteps] = useState(sampleRecipeSteps);
  const [currentCookingStep, setCurrentCookingStep] = useState(0);
  type UploadItem = {
    id: string;
    fileName: string;
    fileSize: string;
    initialProgress: number;
    state: 'uploading' | 'completed' | 'error' | 'paused';
    speed: string;
    progress: number;
  };

  const [uploads, setUploads] = useState<UploadItem[]>(
    sampleUploads.map(upload => ({
      ...upload,
      progress: upload.initialProgress,
    }))
  );
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timerTime, setTimerTime] = useState(300); // 5 minutes

  // Simulate basic progress changes
  useEffect(() => {
    const interval = setInterval(() => {
      setBasicProgress(prev => {
        const newValue = prev + Math.random() * 10 - 5;
        return Math.min(Math.max(newValue, 0), 100);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Simulate upload progress
  useEffect(() => {
    const interval = setInterval(() => {
      setUploads(prev =>
        prev.map(upload => {
          if (upload.state === 'uploading' && upload.progress < 100) {
            const increment = Math.random() * 15;
            const newProgress = Math.min(upload.progress + increment, 100);
            return {
              ...upload,
              progress: newProgress,
              state: newProgress >= 100 ? 'completed' : 'uploading',
            };
          }
          return upload;
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timerRunning && !timerPaused && timerTime > 0) {
      const interval = setInterval(() => {
        setTimerTime(prev => Math.max(prev - 1, 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timerRunning, timerPaused, timerTime]);

  const handleCookingStepClick = (stepIndex: number) => {
    setCurrentCookingStep(stepIndex);
  };

  const handleCompleteStep = () => {
    setCookingSteps(prev =>
      prev.map((step, index) => {
        if (index === currentCookingStep) {
          return { ...step, isCompleted: true };
        }
        return step;
      })
    );
    if (currentCookingStep < cookingSteps.length - 1) {
      setCurrentCookingStep(prev => prev + 1);
    }
  };

  const handleSkipStep = () => {
    setCookingSteps(prev =>
      prev.map((step, index) => {
        if (index === currentCookingStep) {
          return { ...step, isSkipped: true };
        }
        return step;
      })
    );
    if (currentCookingStep < cookingSteps.length - 1) {
      setCurrentCookingStep(prev => prev + 1);
    }
  };

  const handleResetCooking = () => {
    setCookingSteps(sampleRecipeSteps);
    setCurrentCookingStep(0);
  };

  const handleResetUploads = () => {
    setUploads(
      sampleUploads.map(upload => ({
        ...upload,
        progress: 0,
        state: 'uploading',
      }))
    );
  };

  const handleUploadAction = (uploadId: string, action: string) => {
    setUploads(prev =>
      prev.map(upload => {
        if (upload.id === uploadId) {
          switch (action) {
            case 'pause':
              return { ...upload, state: 'paused' };
            case 'resume':
              return { ...upload, state: 'uploading' };
            case 'cancel':
              return { ...upload, state: 'error', progress: 0 };
            case 'retry':
              return { ...upload, state: 'uploading', progress: 0 };
            default:
              return upload;
          }
        }
        return upload;
      })
    );
  };

  const handleTimerStart = () => {
    setTimerRunning(true);
    setTimerPaused(false);
  };

  const handleTimerPause = () => {
    setTimerPaused(!timerPaused);
  };

  const handleTimerReset = () => {
    setTimerRunning(false);
    setTimerPaused(false);
    setTimerTime(300);
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="space-y-12">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Progress Component Demo</h1>
          <p className="text-gray-600">
            Interactive examples of progress indicators for upload progress,
            cooking timers, and multi-step workflows in the Recipe App.
          </p>
        </div>

        {/* Basic Progress Examples */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Basic Progress Bars</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-medium">Animated Progress</h3>
                <Progress
                  value={basicProgress}
                  label="Recipe Analysis"
                  showLabel
                  showPercentage
                />
                <div className="text-sm text-gray-600">
                  Progress value changes automatically:{' '}
                  {Math.round(basicProgress)}%
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Different Variants</h3>
                <div className="space-y-3">
                  <Progress
                    value={85}
                    barVariant="success"
                    showPercentage
                    size="sm"
                  />
                  <Progress value={60} barVariant="cooking" showPercentage />
                  <Progress value={40} barVariant="warning" showPercentage />
                  <Progress value={20} barVariant="error" showPercentage />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Animated Effects</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <span className="text-sm text-gray-600">Shimmer</span>
                  <Progress value={45} barAnimation="shimmer" showPercentage />
                </div>
                <div>
                  <span className="text-sm text-gray-600">Pulse</span>
                  <Progress value={65} barAnimation="pulse" showPercentage />
                </div>
                <div>
                  <span className="text-sm text-gray-600">Glow</span>
                  <Progress value={75} barAnimation="glow" showPercentage />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Progress */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold">File Upload Progress</h2>
          <div className="max-w-2xl">
            <div className="mb-4 flex gap-2">
              <button
                onClick={handleResetUploads}
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Reset Uploads
              </button>
            </div>
            <div className="space-y-4">
              {uploads.map(upload => (
                <UploadProgress
                  key={upload.id}
                  fileName={upload.fileName}
                  fileSize={upload.fileSize}
                  progress={upload.progress}
                  state={upload.state}
                  speed={
                    upload.state === 'uploading' ? upload.speed : undefined
                  }
                  timeRemaining={
                    upload.state === 'uploading' && upload.progress < 100
                      ? `${Math.ceil((100 - upload.progress) / 10)}s`
                      : undefined
                  }
                  onPause={() => handleUploadAction(upload.id, 'pause')}
                  onResume={() => handleUploadAction(upload.id, 'resume')}
                  onCancel={() => handleUploadAction(upload.id, 'cancel')}
                  onRetry={() => handleUploadAction(upload.id, 'retry')}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Cooking Progress */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold">
            Cooking Progress Tracker
          </h2>
          <div className="max-w-3xl">
            <div className="mb-6 flex gap-2">
              <button
                onClick={handleCompleteStep}
                disabled={currentCookingStep >= cookingSteps.length}
                className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:bg-gray-400"
              >
                Complete Current Step
              </button>
              <button
                onClick={handleSkipStep}
                disabled={currentCookingStep >= cookingSteps.length}
                className="rounded bg-yellow-600 px-4 py-2 text-sm text-white hover:bg-yellow-700 disabled:bg-gray-400"
              >
                Skip Current Step
              </button>
              <button
                onClick={handleResetCooking}
                className="rounded bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700"
              >
                Reset Progress
              </button>
            </div>
            <CookingProgress
              steps={cookingSteps}
              currentStep={currentCookingStep}
              onStepClick={handleCookingStepClick}
            />
          </div>
        </section>

        {/* Individual Cooking Steps */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold">
            Individual Cooking Steps
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-medium">Step States</h3>
              <CookingStep
                stepNumber={1}
                title="Completed Step"
                description="This step has been finished"
                duration="5 min"
                isCompleted={true}
              />
              <CookingStep
                stepNumber={2}
                title="Active Step"
                description="Currently working on this step"
                duration="10 min"
                isActive={true}
              />
              <CookingStep
                stepNumber={3}
                title="Pending Step"
                description="This step is coming up next"
                duration="15 min"
              />
              <CookingStep
                stepNumber={4}
                title="Skipped Step"
                description="This optional step was skipped"
                duration="5 min"
                isSkipped={true}
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Different Sizes</h3>
              <CookingStep
                stepNumber={1}
                title="Small Step"
                description="Compact version"
                duration="3 min"
                size="sm"
                isActive={true}
              />
              <CookingStep
                stepNumber={2}
                title="Default Step"
                description="Standard size"
                duration="8 min"
                size="default"
                isCompleted={true}
              />
              <CookingStep
                stepNumber={3}
                title="Large Step"
                description="Prominent version"
                duration="15 min"
                size="lg"
              />
            </div>
          </div>
        </section>

        {/* Cooking Timers */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Cooking Timers</h2>
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 font-medium">Interactive Timer</h3>
              <div className="flex items-center gap-6">
                <TimerProgress
                  totalTime={300}
                  remainingTime={timerTime}
                  isRunning={timerRunning}
                  isPaused={timerPaused}
                  label="Cooking Timer"
                  size="lg"
                  onComplete={() => {
                    setTimerRunning(false);
                    alert('Timer completed!');
                  }}
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleTimerStart}
                    disabled={timerRunning && !timerPaused}
                    className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:bg-gray-400"
                  >
                    Start
                  </button>
                  <button
                    onClick={handleTimerPause}
                    disabled={!timerRunning}
                    className="rounded bg-yellow-600 px-4 py-2 text-sm text-white hover:bg-yellow-700 disabled:bg-gray-400"
                  >
                    {timerPaused ? 'Resume' : 'Pause'}
                  </button>
                  <button
                    onClick={handleTimerReset}
                    className="rounded bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-medium">Multiple Timer States</h3>
              <div className="flex flex-wrap gap-8">
                <TimerProgress
                  totalTime={600}
                  remainingTime={420}
                  isRunning={true}
                  label="Marinating"
                  size="default"
                />
                <TimerProgress
                  totalTime={180}
                  remainingTime={25}
                  isRunning={true}
                  label="Almost Done!"
                  size="default"
                />
                <TimerProgress
                  totalTime={300}
                  remainingTime={150}
                  isPaused={true}
                  label="Paused"
                  size="default"
                />
                <TimerProgress
                  totalTime={120}
                  remainingTime={0}
                  label="Completed"
                  size="default"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-medium">Different Timer Sizes</h3>
              <div className="flex flex-wrap items-center gap-6">
                <TimerProgress
                  totalTime={300}
                  remainingTime={180}
                  isRunning={true}
                  label="Small"
                  size="sm"
                />
                <TimerProgress
                  totalTime={300}
                  remainingTime={180}
                  isRunning={true}
                  label="Default"
                  size="default"
                />
                <TimerProgress
                  totalTime={300}
                  remainingTime={180}
                  isRunning={true}
                  label="Large"
                  size="lg"
                />
                <TimerProgress
                  totalTime={300}
                  remainingTime={180}
                  isRunning={true}
                  label="Extra Large"
                  size="xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Recipe-Specific Examples */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Recipe App Use Cases</h2>
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 font-medium">Bread Baking Progress</h3>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-3 rounded-lg border p-4">
                  <h4 className="font-medium">First Rise</h4>
                  <TimerProgress
                    totalTime={7200}
                    remainingTime={3600}
                    isRunning={true}
                    showMinutes={true}
                  />
                  <p className="text-sm text-gray-600">
                    Dough should double in size
                  </p>
                </div>
                <div className="space-y-3 rounded-lg border p-4">
                  <h4 className="font-medium">Second Rise</h4>
                  <TimerProgress
                    totalTime={3600}
                    remainingTime={1800}
                    isRunning={true}
                    showMinutes={true}
                  />
                  <p className="text-sm text-gray-600">
                    Shape and let rise again
                  </p>
                </div>
                <div className="space-y-3 rounded-lg border p-4">
                  <h4 className="font-medium">Baking</h4>
                  <TimerProgress
                    totalTime={2400}
                    remainingTime={600}
                    isRunning={true}
                    showMinutes={true}
                    size="lg"
                  />
                  <p className="text-sm text-gray-600">
                    Internal temp should reach 190°F
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-medium">Batch Upload Progress</h3>
              <div className="rounded-lg border p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-medium">Uploading Recipe Collection</h4>
                  <span className="text-sm text-gray-600">
                    3 of 5 files complete
                  </span>
                </div>
                <Progress
                  value={60}
                  barVariant="upload"
                  size="lg"
                  showPercentage
                />
                <div className="mt-4 text-sm text-gray-600">
                  Uploading recipes, images, and nutritional data...
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guidelines */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Usage Guidelines</h2>
          <div className="rounded-lg border p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 font-medium text-green-600">
                  ✅ Best Practices
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Use appropriate variants for different contexts</li>
                  <li>• Provide clear time estimates and labels</li>
                  <li>• Show meaningful progress states</li>
                  <li>• Use animations sparingly for active processes</li>
                  <li>
                    • Include pause/resume functionality for long operations
                  </li>
                  <li>• Display remaining time for cooking timers</li>
                  <li>• Group related progress indicators logically</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 font-medium text-red-600">❌ Avoid</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Using progress bars for instantaneous operations</li>
                  <li>• Overusing animations that distract from content</li>
                  <li>• Missing error states and recovery options</li>
                  <li>• Unclear or misleading progress labels</li>
                  <li>• Too many simultaneous animated progress bars</li>
                  <li>• Missing accessibility attributes</li>
                  <li>• Inconsistent progress indicator styles</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
