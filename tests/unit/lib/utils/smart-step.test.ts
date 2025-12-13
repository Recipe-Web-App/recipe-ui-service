import {
  getSmartStep,
  roundToPrecision,
  snapToStep,
  incrementValue,
  decrementValue,
  DEFAULT_SMART_STEP_CONFIG,
  type SmartStepConfig,
} from '@/lib/utils/smart-step';

describe('smart-step utilities', () => {
  describe('getSmartStep', () => {
    describe('with default config', () => {
      it('should return 0.25 for values less than 10', () => {
        expect(getSmartStep(0)).toBe(0.25);
        expect(getSmartStep(0.5)).toBe(0.25);
        expect(getSmartStep(1)).toBe(0.25);
        expect(getSmartStep(5)).toBe(0.25);
        expect(getSmartStep(9.99)).toBe(0.25);
      });

      it('should return 0.5 for values between 10 and 100', () => {
        expect(getSmartStep(10)).toBe(0.5);
        expect(getSmartStep(25)).toBe(0.5);
        expect(getSmartStep(50)).toBe(0.5);
        expect(getSmartStep(75)).toBe(0.5);
        expect(getSmartStep(99.99)).toBe(0.5);
      });

      it('should return 1 for values 100 and above', () => {
        expect(getSmartStep(100)).toBe(1);
        expect(getSmartStep(150)).toBe(1);
        expect(getSmartStep(500)).toBe(1);
        expect(getSmartStep(1000)).toBe(1);
        expect(getSmartStep(10000)).toBe(1);
      });

      it('should handle boundary values correctly', () => {
        // Just below threshold
        expect(getSmartStep(9.99)).toBe(0.25);
        expect(getSmartStep(99.99)).toBe(0.5);

        // At threshold
        expect(getSmartStep(10)).toBe(0.5);
        expect(getSmartStep(100)).toBe(1);
      });
    });

    describe('with custom config', () => {
      const customConfig: SmartStepConfig = {
        smallStep: 0.1,
        mediumStep: 0.25,
        largeStep: 0.5,
        smallThreshold: 5,
        largeThreshold: 50,
      };

      it('should use custom step values', () => {
        expect(getSmartStep(2, customConfig)).toBe(0.1);
        expect(getSmartStep(20, customConfig)).toBe(0.25);
        expect(getSmartStep(100, customConfig)).toBe(0.5);
      });

      it('should use custom thresholds', () => {
        expect(getSmartStep(4.99, customConfig)).toBe(0.1);
        expect(getSmartStep(5, customConfig)).toBe(0.25);
        expect(getSmartStep(49.99, customConfig)).toBe(0.25);
        expect(getSmartStep(50, customConfig)).toBe(0.5);
      });
    });
  });

  describe('roundToPrecision', () => {
    it('should round to 2 decimal places by default', () => {
      expect(roundToPrecision(1.234)).toBe(1.23);
      expect(roundToPrecision(1.235)).toBe(1.24);
      expect(roundToPrecision(1.999)).toBe(2);
    });

    it('should handle floating-point arithmetic errors', () => {
      // Classic floating-point issue: 0.1 + 0.2 = 0.30000000000000004
      expect(roundToPrecision(0.1 + 0.2, 2)).toBe(0.3);
      expect(roundToPrecision(0.1 + 0.2 + 0.3, 2)).toBe(0.6);
    });

    it('should round to specified precision', () => {
      expect(roundToPrecision(1.23456, 0)).toBe(1);
      expect(roundToPrecision(1.23456, 1)).toBe(1.2);
      expect(roundToPrecision(1.23456, 2)).toBe(1.23);
      expect(roundToPrecision(1.23456, 3)).toBe(1.235);
      expect(roundToPrecision(1.23456, 4)).toBe(1.2346);
    });

    it('should handle negative numbers', () => {
      expect(roundToPrecision(-1.234, 2)).toBe(-1.23);
      expect(roundToPrecision(-1.235, 2)).toBe(-1.24);
    });

    it('should handle zero', () => {
      expect(roundToPrecision(0, 2)).toBe(0);
    });

    it('should handle whole numbers', () => {
      expect(roundToPrecision(5, 2)).toBe(5);
      expect(roundToPrecision(100, 2)).toBe(100);
    });
  });

  describe('snapToStep', () => {
    describe('snapping up', () => {
      it('should snap to next step multiple when not on boundary', () => {
        expect(snapToStep(0.01, 0.25, 'up')).toBe(0.25);
        expect(snapToStep(0.1, 0.25, 'up')).toBe(0.25);
        expect(snapToStep(0.26, 0.25, 'up')).toBe(0.5);
        expect(snapToStep(0.51, 0.5, 'up')).toBe(1);
      });

      it('should go to next step when already on boundary', () => {
        expect(snapToStep(0.25, 0.25, 'up')).toBe(0.5);
        expect(snapToStep(0.5, 0.25, 'up')).toBe(0.75);
        expect(snapToStep(1, 0.5, 'up')).toBe(1.5);
        expect(snapToStep(100, 1, 'up')).toBe(101);
      });

      it('should handle zero', () => {
        expect(snapToStep(0, 0.25, 'up')).toBe(0.25);
        expect(snapToStep(0, 0.5, 'up')).toBe(0.5);
      });
    });

    describe('snapping down', () => {
      it('should snap to previous step multiple when not on boundary', () => {
        expect(snapToStep(0.26, 0.25, 'down')).toBe(0.25);
        expect(snapToStep(0.49, 0.25, 'down')).toBe(0.25);
        expect(snapToStep(0.51, 0.5, 'down')).toBe(0.5);
        expect(snapToStep(100.5, 1, 'down')).toBe(100);
      });

      it('should go to previous step when already on boundary', () => {
        expect(snapToStep(0.5, 0.25, 'down')).toBe(0.25);
        expect(snapToStep(0.75, 0.25, 'down')).toBe(0.5);
        expect(snapToStep(1.5, 0.5, 'down')).toBe(1);
        expect(snapToStep(101, 1, 'down')).toBe(100);
      });

      it('should handle snapping to zero', () => {
        expect(snapToStep(0.25, 0.25, 'down')).toBe(0);
        expect(snapToStep(0.1, 0.25, 'down')).toBe(0);
      });
    });

    describe('precision handling', () => {
      it('should respect precision parameter', () => {
        expect(snapToStep(0.123, 0.25, 'up', 3)).toBe(0.25);
        expect(snapToStep(0.126, 0.25, 'down', 3)).toBe(0);
      });
    });
  });

  describe('incrementValue', () => {
    it('should increment values already on step boundary', () => {
      // On step boundary - should go to next step
      expect(incrementValue(1, 10000)).toBe(1.25);
      expect(incrementValue(5, 10000)).toBe(5.25);
      expect(incrementValue(9.75, 10000)).toBe(10);
    });

    it('should snap to next step when not on boundary (small values)', () => {
      // Not on step boundary - should snap up
      expect(incrementValue(0.01, 10000)).toBe(0.25);
      expect(incrementValue(0.1, 10000)).toBe(0.25);
      expect(incrementValue(0.26, 10000)).toBe(0.5);
      expect(incrementValue(1.1, 10000)).toBe(1.25);
    });

    it('should increment medium values by 0.5', () => {
      expect(incrementValue(10, 10000)).toBe(10.5);
      expect(incrementValue(50, 10000)).toBe(50.5);
      expect(incrementValue(99.5, 10000)).toBe(100);
    });

    it('should snap to next step when not on boundary (medium values)', () => {
      expect(incrementValue(10.1, 10000)).toBe(10.5);
      expect(incrementValue(50.25, 10000)).toBe(50.5);
    });

    it('should increment large values by 1', () => {
      expect(incrementValue(100, 10000)).toBe(101);
      expect(incrementValue(500, 10000)).toBe(501);
      expect(incrementValue(999, 10000)).toBe(1000);
    });

    it('should snap to next step when not on boundary (large values)', () => {
      expect(incrementValue(100.5, 10000)).toBe(101);
      expect(incrementValue(500.1, 10000)).toBe(501);
    });

    it('should not exceed max value', () => {
      expect(incrementValue(99.9, 100)).toBe(100);
      expect(incrementValue(100, 100)).toBe(100);
      expect(incrementValue(9999.5, 10000)).toBe(10000);
    });

    it('should handle custom config', () => {
      const config: SmartStepConfig = {
        smallStep: 0.1,
        mediumStep: 0.2,
        largeStep: 0.5,
        smallThreshold: 5,
        largeThreshold: 20,
      };
      expect(incrementValue(1, 100, config)).toBe(1.1);
      expect(incrementValue(10, 100, config)).toBe(10.2);
      expect(incrementValue(25, 100, config)).toBe(25.5);
    });
  });

  describe('decrementValue', () => {
    it('should decrement values already on step boundary', () => {
      // On step boundary - should go to previous step
      expect(decrementValue(2, 0.01)).toBe(1.75);
      expect(decrementValue(5, 0.01)).toBe(4.75);
      expect(decrementValue(1, 0.01)).toBe(0.75);
    });

    it('should snap to previous step when not on boundary (small values)', () => {
      // Not on step boundary - should snap down
      expect(decrementValue(0.26, 0.01)).toBe(0.25);
      expect(decrementValue(0.49, 0.01)).toBe(0.25);
      expect(decrementValue(1.1, 0.01)).toBe(1);
      expect(decrementValue(1.99, 0.01)).toBe(1.75);
    });

    it('should decrement medium values by 0.5', () => {
      expect(decrementValue(50, 0.01)).toBe(49.5);
      expect(decrementValue(20, 0.01)).toBe(19.5);
      expect(decrementValue(10.5, 0.01)).toBe(10);
    });

    it('should snap to previous step when not on boundary (medium values)', () => {
      expect(decrementValue(50.25, 0.01)).toBe(50);
      expect(decrementValue(20.1, 0.01)).toBe(20);
    });

    it('should decrement large values by 1', () => {
      expect(decrementValue(100, 0.01)).toBe(99);
      expect(decrementValue(500, 0.01)).toBe(499);
      expect(decrementValue(101, 0.01)).toBe(100);
    });

    it('should snap to previous step when not on boundary (large values)', () => {
      expect(decrementValue(100.5, 0.01)).toBe(100);
      expect(decrementValue(500.9, 0.01)).toBe(500);
    });

    it('should not go below min value', () => {
      expect(decrementValue(0.1, 0.01)).toBe(0.01);
      expect(decrementValue(0.01, 0.01)).toBe(0.01);
      expect(decrementValue(1, 1)).toBe(1);
    });

    it('should handle custom config', () => {
      const config: SmartStepConfig = {
        smallStep: 0.1,
        mediumStep: 0.2,
        largeStep: 0.5,
        smallThreshold: 5,
        largeThreshold: 20,
      };
      expect(decrementValue(2, 0.01, config)).toBe(1.9);
      expect(decrementValue(10, 0.01, config)).toBe(9.8);
      expect(decrementValue(25, 0.01, config)).toBe(24.5);
    });
  });

  describe('DEFAULT_SMART_STEP_CONFIG', () => {
    it('should have expected default values', () => {
      expect(DEFAULT_SMART_STEP_CONFIG).toEqual({
        smallStep: 0.25,
        mediumStep: 0.5,
        largeStep: 1,
        smallThreshold: 10,
        largeThreshold: 100,
      });
    });
  });
});
