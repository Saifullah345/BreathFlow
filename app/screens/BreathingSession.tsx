import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { BreathingCircle } from '../components/BreathingCircle';
import { BreathingPattern, VisualTheme } from '../types';
import { saveSession } from '../utils/storage';

interface BreathingSessionProps {
  pattern: BreathingPattern;
  theme: VisualTheme;
  onComplete: () => void;
  onExit: () => void;
}

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2' | 'idle';

export const BreathingSession: React.FC<BreathingSessionProps> = ({
  pattern,
  theme,
  onComplete,
  onExit,
}) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [currentCycle, setCurrentCycle] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const phases: Phase[] = ['inhale', 'hold1', 'exhale', 'hold2'].filter((p) => {
    if (p === 'hold1') return pattern.hold1 > 0;
    if (p === 'hold2') return pattern.hold2 > 0;
    return true;
  }) as Phase[];

  const getPhaseText = (p: Phase): string => {
    const texts = {
      inhale: 'Breathe In',
      hold1: 'Hold',
      exhale: 'Breathe Out',
      hold2: 'Hold',
      idle: 'Ready',
    };
    return texts[p];
  };

  const getPhaseDuration = (p: Phase): number => {
    const durations = {
      inhale: pattern.inhale,
      hold1: pattern.hold1,
      exhale: pattern.exhale,
      hold2: pattern.hold2,
      idle: 0,
    };
    return durations[p];
  };

  const triggerHaptic = async (p: Phase) => {
    if (p === 'inhale') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (p === 'exhale') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (p === 'hold1' || p === 'hold2') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  useEffect(() => {
    if (isActive && phase !== 'idle') {
      const duration = getPhaseDuration(phase);
      setTimeRemaining(duration);
      
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            moveToNextPhase();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [phase, isActive]);

  const moveToNextPhase = () => {
    const currentIndex = phases.indexOf(phase);
    
    if (currentIndex === phases.length - 1) {
      // Cycle complete
      const newCycle = currentCycle + 1;
      setCurrentCycle(newCycle);
      
      if (newCycle >= pattern.cycles) {
        // Session complete
        completeSession();
        return;
      }
      
      setPhase(phases[0]);
      triggerHaptic(phases[0]);
    } else {
      const nextPhase = phases[currentIndex + 1];
      setPhase(nextPhase);
      triggerHaptic(nextPhase);
    }
  };

  const completeSession = async () => {
    setIsActive(false);
    setPhase('idle');
    
    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    await saveSession({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      pattern: pattern.name,
      duration,
      cycles: pattern.cycles,
    });
    
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const startSession = () => {
    setIsActive(true);
    setCurrentCycle(0);
    setPhase(phases[0]);
    startTimeRef.current = Date.now();
    triggerHaptic(phases[0]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resumeSession = () => {
    setIsActive(true);
  };

  const exitSession = () => {
    setIsActive(false);
    setPhase('idle');
    if (timerRef.current) clearInterval(timerRef.current);
    onExit();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={exitSession} style={styles.exitButton}>
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.patternName}>{pattern.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.cycleCounter}>
          <Text style={styles.cycleText}>
            Cycle {currentCycle + 1} / {pattern.cycles}
          </Text>
        </View>

        <View style={styles.circleContainer}>
          <BreathingCircle phase={phase} theme={theme} duration={getPhaseDuration(phase)} />
        </View>

        <View style={styles.instructionContainer}>
          <Text style={styles.phaseText}>{getPhaseText(phase)}</Text>
          {isActive && (
            <Text style={styles.timerText}>{timeRemaining}s</Text>
          )}
        </View>

        <View style={styles.controls}>
          {!isActive && currentCycle === 0 ? (
            <TouchableOpacity style={styles.startButton} onPress={startSession}>
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          ) : !isActive ? (
            <TouchableOpacity style={styles.startButton} onPress={resumeSession}>
              <Text style={styles.startButtonText}>Resume</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.pauseButton} onPress={pauseSession}>
              <Text style={styles.pauseButtonText}>Pause</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1929',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  exitButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
  },
  patternName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 40,
  },
  cycleCounter: {
    paddingVertical: 12,
  },
  cycleText: {
    fontSize: 16,
    color: '#90CAF9',
    fontWeight: '500',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionContainer: {
    alignItems: 'center',
    minHeight: 100,
  },
  phaseText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '200',
    color: '#90CAF9',
  },
  controls: {
    width: '100%',
    paddingHorizontal: 40,
  },
  startButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: '#424242',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  pauseButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
