'use client';

import { useState } from 'react';
import { RetryButton } from '@/components/error/RetryButton';
import { RetryStrategy } from '@/types/error/retry-button';
import type {
  RetryAnalyticsEvent,
  RetryAttempt,
} from '@/types/error/retry-button';

export default function RetryButtonDemoPage() {
  // Demo 1: Basic retry simulation
  const [demo1Status, setDemo1Status] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [demo1Attempts, setDemo1Attempts] = useState(0);

  const handleBasicRetry = async () => {
    setDemo1Status('loading');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 30% chance of success
    const success = Math.random() > 0.7;
    setDemo1Attempts(prev => prev + 1);

    if (success) {
      setDemo1Status('success');
    } else {
      setDemo1Status('error');
      throw new Error('Simulated failure');
    }
  };

  // Demo 2: Retry strategies comparison
  const [strategy, setStrategy] = useState<RetryStrategy>(
    RetryStrategy.CONSTANT
  );

  const handleStrategyRetry = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    throw new Error('Always fails to demonstrate strategy');
  };

  // Demo 3: Analytics tracking
  const [analyticsEvents, setAnalyticsEvents] = useState<RetryAnalyticsEvent[]>(
    []
  );

  const handleAnalyticsRetry = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    // 40% success rate
    if (Math.random() > 0.6) {
      return;
    }
    throw new Error('Failed attempt');
  };

  const handleAnalyticsEvent = (event: RetryAnalyticsEvent) => {
    setAnalyticsEvents(prev => [...prev, event].slice(-10)); // Keep last 10 events
  };

  // Demo 4: Lifecycle callbacks
  const [lifecycleLog, setLifecycleLog] = useState<string[]>([]);

  const addLifecycleLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLifecycleLog(prev => [`${timestamp}: ${message}`, ...prev].slice(0, 15));
  };

  const handleLifecycleRetry = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 25% success rate
    if (Math.random() > 0.75) {
      addLifecycleLog('✓ Retry succeeded!');
      return;
    }
    throw new Error('Lifecycle demo failure');
  };

  // Demo 5: Controlled mode
  const [controlledAttempt, setControlledAttempt] = useState(1);

  const handleControlledRetry = async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    throw new Error('Controlled demo failure');
  };

  const resetControlledAttempt = () => {
    setControlledAttempt(1);
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-12 py-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">RetryButton Component</h1>
        <p className="text-muted-foreground">
          Interactive demos showcasing retry functionality, strategies, and
          lifecycle management
        </p>
      </div>

      {/* Demo 1: Basic Retry */}
      <section className="space-y-4 rounded-lg border p-6">
        <div>
          <h2 className="mb-1 text-xl font-semibold">Basic Retry Simulation</h2>
          <p className="text-muted-foreground text-sm">
            Simulates an API call with a 30% success rate. Try clicking multiple
            times to see retry behavior.
          </p>
        </div>

        <div className="bg-muted/50 rounded-md p-4">
          <div className="mb-4 space-y-2">
            <div className="text-sm">
              <span className="font-medium">Status:</span>{' '}
              <span
                className={
                  demo1Status === 'success'
                    ? 'text-green-600'
                    : demo1Status === 'error'
                      ? 'text-red-600'
                      : demo1Status === 'loading'
                        ? 'text-blue-600'
                        : ''
                }
              >
                {demo1Status}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Total Attempts:</span>{' '}
              {demo1Attempts}
            </div>
          </div>

          <RetryButton
            onRetry={handleBasicRetry}
            maxAttempts={5}
            cooldownMs={2000}
            showAttemptCount
            showCooldown
          >
            Simulate API Call
          </RetryButton>

          <button
            onClick={() => {
              setDemo1Status('idle');
              setDemo1Attempts(0);
            }}
            className="bg-secondary hover:bg-secondary/80 ml-2 rounded-md px-4 py-2 text-sm transition-colors"
          >
            Reset Demo
          </button>
        </div>
      </section>

      {/* Demo 2: Retry Strategies */}
      <section className="space-y-4 rounded-lg border p-6">
        <div>
          <h2 className="mb-1 text-xl font-semibold">Retry Strategies</h2>
          <p className="text-muted-foreground text-sm">
            Compare different retry strategies: Constant, Exponential, Linear,
            and Immediate
          </p>
        </div>

        <div className="bg-muted/50 rounded-md p-4">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Select Strategy:
            </label>
            <select
              value={strategy}
              onChange={e => setStrategy(e.target.value as RetryStrategy)}
              className="border-input bg-background w-full max-w-xs rounded-md border px-3 py-2 text-sm"
            >
              <option value={RetryStrategy.CONSTANT}>
                Constant (1s, 1s, 1s)
              </option>
              <option value={RetryStrategy.EXPONENTIAL}>
                Exponential (1s, 2s, 4s, 8s)
              </option>
              <option value={RetryStrategy.LINEAR}>
                Linear (1s, 2s, 3s, 4s)
              </option>
              <option value={RetryStrategy.IMMEDIATE}>
                Immediate (no delay)
              </option>
            </select>
          </div>

          <div className="space-y-2">
            <RetryButton
              onRetry={handleStrategyRetry}
              retryStrategy={strategy}
              exponentialBackoff={strategy === RetryStrategy.EXPONENTIAL}
              cooldownMs={1000}
              maxAttempts={5}
              showAttemptCount
              showCooldown
              backoffMultiplier={2}
            >
              Test {strategy.charAt(0).toUpperCase() + strategy.slice(1)}{' '}
              Strategy
            </RetryButton>

            {strategy === RetryStrategy.EXPONENTIAL && (
              <p className="text-muted-foreground text-xs">
                Note: Delays double with each retry (capped at 30s)
              </p>
            )}
            {strategy === RetryStrategy.IMMEDIATE && (
              <p className="text-xs text-yellow-600">
                Warning: Use immediate retry carefully - may cause rate limiting
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Demo 3: Analytics Tracking */}
      <section className="space-y-4 rounded-lg border p-6">
        <div>
          <h2 className="mb-1 text-xl font-semibold">Analytics Tracking</h2>
          <p className="text-muted-foreground text-sm">
            Track all retry events for monitoring and analytics (40% success
            rate)
          </p>
        </div>

        <div className="bg-muted/50 rounded-md p-4">
          <div className="mb-4">
            <RetryButton
              onRetry={handleAnalyticsRetry}
              maxAttempts={5}
              cooldownMs={1500}
              showAttemptCount
              onAnalytics={handleAnalyticsEvent}
            >
              Try with Analytics
            </RetryButton>

            <button
              onClick={() => setAnalyticsEvents([])}
              className="bg-secondary hover:bg-secondary/80 ml-2 rounded-md px-4 py-2 text-sm transition-colors"
            >
              Clear Events
            </button>
          </div>

          {analyticsEvents.length > 0 && (
            <div className="bg-background rounded-md p-4">
              <h4 className="mb-2 text-sm font-semibold">
                Recent Events (last 10):
              </h4>
              <div className="max-h-60 space-y-2 overflow-y-auto">
                {analyticsEvents.map((event, index) => (
                  <div
                    key={index}
                    className="border-border rounded border p-2 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={
                          event.type.includes('success')
                            ? 'text-green-600'
                            : event.type.includes('failure')
                              ? 'text-red-600'
                              : 'text-blue-600'
                        }
                      >
                        {event.type}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-muted-foreground mt-1">
                      Attempt {event.attemptNumber}/{event.maxAttempts}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Demo 4: Lifecycle Callbacks */}
      <section className="space-y-4 rounded-lg border p-6">
        <div>
          <h2 className="mb-1 text-xl font-semibold">Lifecycle Callbacks</h2>
          <p className="text-muted-foreground text-sm">
            Hook into retry lifecycle events (25% success rate)
          </p>
        </div>

        <div className="bg-muted/50 rounded-md p-4">
          <div className="mb-4">
            <RetryButton
              onRetry={handleLifecycleRetry}
              maxAttempts={5}
              cooldownMs={2000}
              showAttemptCount
              showCooldown
              onBeforeRetry={attempt =>
                addLifecycleLog(`⚡ Starting attempt ${attempt}...`)
              }
              onAfterRetry={(result: RetryAttempt) =>
                addLifecycleLog(
                  result.success
                    ? `✓ Attempt ${result.attemptNumber} succeeded in ${result.durationMs}ms`
                    : `✗ Attempt ${result.attemptNumber} failed: ${result.error?.message}`
                )
              }
              onCooldownStart={ms =>
                addLifecycleLog(`⏳ Cooldown started (${ms}ms)`)
              }
              onCooldownEnd={() =>
                addLifecycleLog('✓ Cooldown ended - ready to retry')
              }
              onMaxAttemptsReached={() =>
                addLifecycleLog('🚫 Maximum attempts reached!')
              }
            >
              Test Lifecycle
            </RetryButton>

            <button
              onClick={() => setLifecycleLog([])}
              className="bg-secondary hover:bg-secondary/80 ml-2 rounded-md px-4 py-2 text-sm transition-colors"
            >
              Clear Log
            </button>
          </div>

          {lifecycleLog.length > 0 && (
            <div className="bg-background rounded-md p-4">
              <h4 className="mb-2 text-sm font-semibold">Event Log:</h4>
              <div className="max-h-60 space-y-1 overflow-y-auto font-mono text-xs">
                {lifecycleLog.map((entry, index) => (
                  <div key={index} className="border-border border-l-2 pl-2">
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Demo 5: Controlled Mode */}
      <section className="space-y-4 rounded-lg border p-6">
        <div>
          <h2 className="mb-1 text-xl font-semibold">Controlled Mode</h2>
          <p className="text-muted-foreground text-sm">
            Control the attempt number externally for custom retry logic
          </p>
        </div>

        <div className="bg-muted/50 rounded-md p-4">
          <div className="mb-4 text-sm">
            <span className="font-medium">Current Attempt:</span>{' '}
            {controlledAttempt}
          </div>

          <RetryButton
            onRetry={handleControlledRetry}
            currentAttempt={controlledAttempt}
            maxAttempts={5}
            cooldownMs={1500}
            showAttemptCount
            showCooldown
            onAfterRetry={() => setControlledAttempt(prev => prev + 1)}
          >
            Controlled Retry
          </RetryButton>

          <button
            onClick={resetControlledAttempt}
            className="bg-secondary hover:bg-secondary/80 ml-2 rounded-md px-4 py-2 text-sm transition-colors"
          >
            Reset Attempts
          </button>

          <div className="mt-4 rounded-md bg-blue-50 p-3 dark:bg-blue-950/20">
            <p className="text-xs text-blue-900 dark:text-blue-100">
              <strong>Tip:</strong> In controlled mode, you manage the attempt
              counter externally. This is useful when retry logic needs to be
              coordinated with other state.
            </p>
          </div>
        </div>
      </section>

      {/* Demo 6: Button Variants */}
      <section className="space-y-4 rounded-lg border p-6">
        <div>
          <h2 className="mb-1 text-xl font-semibold">
            Button Variants & Sizes
          </h2>
          <p className="text-muted-foreground text-sm">
            RetryButton supports all Button variants and sizes
          </p>
        </div>

        <div className="bg-muted/50 space-y-6 rounded-md p-4">
          <div>
            <h3 className="mb-3 text-sm font-medium">Variants</h3>
            <div className="flex flex-wrap gap-2">
              <RetryButton
                onRetry={async () => {
                  throw new Error('test');
                }}
                variant="default"
                cooldownMs={0}
              >
                Default
              </RetryButton>
              <RetryButton
                onRetry={async () => {
                  throw new Error('test');
                }}
                variant="destructive"
                cooldownMs={0}
              >
                Destructive
              </RetryButton>
              <RetryButton
                onRetry={async () => {
                  throw new Error('test');
                }}
                variant="outline"
                cooldownMs={0}
              >
                Outline
              </RetryButton>
              <RetryButton
                onRetry={async () => {
                  throw new Error('test');
                }}
                variant="secondary"
                cooldownMs={0}
              >
                Secondary
              </RetryButton>
              <RetryButton
                onRetry={async () => {
                  throw new Error('test');
                }}
                variant="ghost"
                cooldownMs={0}
              >
                Ghost
              </RetryButton>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium">Sizes</h3>
            <div className="flex flex-wrap items-center gap-2">
              <RetryButton
                onRetry={async () => {
                  throw new Error('test');
                }}
                size="sm"
                cooldownMs={0}
              >
                Small
              </RetryButton>
              <RetryButton
                onRetry={async () => {
                  throw new Error('test');
                }}
                size="default"
                cooldownMs={0}
              >
                Default
              </RetryButton>
              <RetryButton
                onRetry={async () => {
                  throw new Error('test');
                }}
                size="lg"
                cooldownMs={0}
              >
                Large
              </RetryButton>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium">Icon Positions</h3>
            <div className="flex flex-wrap gap-2">
              <RetryButton
                onRetry={async () => {
                  throw new Error('test');
                }}
                showIcon
                iconPosition="left"
                cooldownMs={0}
              >
                Icon Left
              </RetryButton>
              <RetryButton
                onRetry={async () => {
                  throw new Error('test');
                }}
                showIcon
                iconPosition="right"
                cooldownMs={0}
              >
                Icon Right
              </RetryButton>
              <RetryButton
                onRetry={async () => {
                  throw new Error('test');
                }}
                showIcon={false}
                cooldownMs={0}
              >
                No Icon
              </RetryButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
