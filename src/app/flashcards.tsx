import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, View, ScrollView, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Line, Polyline, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { recordAnswer, getHistory, sortByDifficulty, clearHistory } from '@/hooks/use-flashcard-history';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing, Colors, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/context/language-context';
import { BeerStyle, getBJCPStyles } from '@/data/bjcp2021';
import { GLOSSARY_DATA, GlossaryTerm } from '@/data/glossary';
import { OFF_FLAVORS_DATA, OffFlavor } from '@/data/offflavors';
import { generateQuiz, QuizMode, QuizQuestion } from '@/data/quiz-generator';
import { usePersistentState } from '@/hooks/use-persistent-state';

// ==========================================
// SVG ICONS (Premium Harmonized Style)
// ==========================================
function QuizIcon({ name, color = '#FFF', size = 20 }: { name: string, color?: string, size?: number }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case 'mixed': return <Svg {...props}><Path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></Svg>;
    case 'styles': return <Svg {...props}><Path d="M17 11h1a3 3 0 0 1 0 6h-1M9 12v6M13 12v6M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5z" /><Path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" /></Svg>;
    case 'glossary': return <Svg {...props}><Path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></Svg>;
    case 'tags': return <Svg {...props}><Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><Line x1="7" y1="7" x2="7.01" y2="7" /></Svg>;
    case 'offflavors': return <Svg {...props}><Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><Path d="M8 9h.01M16 9h.01M9 15c.5 1 2 2 3 2s2.5-1 3-2" /></Svg>;
    case 'fire': return <Svg {...props}><Path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></Svg>;
    case 'cross': return <Svg {...props}><Line x1="18" y1="6" x2="6" y2="18" /><Line x1="6" y1="6" x2="18" y2="18" /></Svg>;
    case 'check': return <Svg {...props}><Polyline points="20 6 9 17 4 12" /></Svg>;
    case 'arrow': return <Svg {...props}><Line x1="5" y1="12" x2="19" y2="12" /><Polyline points="12 5 19 12 12 19" /></Svg>;
    case 'award': return <Svg {...props}><Circle cx="12" cy="8" r="7" /><Polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></Svg>;
    default: return null;
  }
}

// SRM Color Mapping Helper
function getSRMColor(srm: number): string {
  if (srm <= 2.5) return '#F8F753';
  if (srm <= 4.5) return '#F2C75C';
  if (srm <= 7.5) return '#E9A13B';
  if (srm <= 12.5) return '#C47632';
  if (srm <= 18.5) return '#944C25';
  if (srm <= 24.5) return '#60310F';
  if (srm <= 35.0) return '#241208';
  return '#080402';
}

type StudyMode = 'flashcards' | 'quiz';
type QuizState = 'lobby' | 'playing' | 'results';
type FcState = 'lobby' | 'playing';

export default function FlashcardsScreen() {
  const theme = useTheme();
  const { language } = useTranslation();
  const router = useRouter();

  // Mode Selection
  const [studyMode, setStudyMode] = usePersistentState<StudyMode>('@bjcp_study_mode', 'quiz');

  // ==========================================
  // FLASHCARDS STATE
  // ==========================================
  const [fcState, setFcState] = useState<FcState>('lobby');
  const [fcStudyMode, setFcStudyMode] = useState<'styles' | 'glossary' | 'offflavors'>('styles');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Styles Mode State
  const [currentStyle, setCurrentStyle] = useState<BeerStyle | null>(null);
  const [sessionStyles, setSessionStyles] = useState<BeerStyle[]>([]);
  const [answeredStyles, setAnsweredStyles] = useState<string[]>([]);
  const [revealedClues, setRevealedClues] = useState({
    aroma: false,
    appearance: false,
    flavor: false,
    mouthfeel: false,
  });

  // Glossary Mode State
  const [sessionGlossary, setSessionGlossary] = useState<GlossaryTerm[]>([]);
  const [currentGlossary, setCurrentGlossary] = useState<GlossaryTerm | null>(null);
  const [answeredGlossary, setAnsweredGlossary] = useState<string[]>([]);

  // Off-Flavors Mode State
  const [sessionOffFlavors, setSessionOffFlavors] = useState<OffFlavor[]>([]);
  const [currentOffFlavor, setCurrentOffFlavor] = useState<OffFlavor | null>(null);
  const [answeredOffFlavors, setAnsweredOffFlavors] = useState<string[]>([]);
  const [revealedOffClues, setRevealedOffClues] = useState({
    sensation: false,
    causes: false,
    prevention: false,
  });

  const [isFlipped, setIsFlipped] = useState(false);
  const [fcScore, setFcScore] = useState({ correct: 0, total: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  // History displayed in the lobby (reloaded when mode changes)
  const [lobbyHistory, setLobbyHistory] = useState<Record<string, { correct: number; incorrect: number; lastSeen: number }>>({});

  // ==========================================
  // QUIZ STATE
  // ==========================================
  const [quizState, setQuizState] = usePersistentState<QuizState>('@bjcp_quiz_state', 'lobby');
  const [quizMode, setQuizMode] = usePersistentState<QuizMode>('@bjcp_quiz_mode', 'mixed');
  const [quizCount, setQuizCount] = usePersistentState<number>('@bjcp_quiz_count', 10);
  const [questions, setQuestions] = usePersistentState<QuizQuestion[]>('@bjcp_quiz_questions', []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = usePersistentState<number>('@bjcp_quiz_index', 0);
  const [quizScore, setQuizScore] = usePersistentState<number>('@bjcp_quiz_score', 0);
  const [streak, setStreak] = usePersistentState<number>('@bjcp_quiz_streak', 0);
  const [maxStreak, setMaxStreak] = usePersistentState<number>('@bjcp_quiz_max_streak', 0);
  const [selectedOption, setSelectedOption] = usePersistentState<string | null>('@bjcp_quiz_selected', null);

  const startNewFlashcardSession = async (category = 'all') => {
    let stylesList = getBJCPStyles(language);
    if (category !== 'all') {
      stylesList = stylesList.filter(s => s.category === category);
    }
    if (stylesList.length === 0) {
      stylesList = getBJCPStyles(language); // Fallback
    }
    // Sort hardest cards first, then shuffle unseen
    const history = await getHistory('styles');
    const sortedIds = sortByDifficulty(stylesList.map(s => s.id), history);
    const sorted = sortedIds.map(id => stylesList.find(s => s.id === id)!).filter(Boolean);
    setSessionStyles(sorted);
    setCurrentStyle(sorted[0] || null);
    setIsFlipped(false);
    setFcScore({ correct: 0, total: 0 });
    setAnsweredStyles([]);
    setRevealedClues({
      aroma: false,
      appearance: false,
      flavor: false,
      mouthfeel: false,
    });
  };

  const startGlossarySession = async () => {
    const history = await getHistory('glossary');
    const sortedIds = sortByDifficulty(GLOSSARY_DATA.map(g => g.id), history);
    const sorted = sortedIds.map(id => GLOSSARY_DATA.find(g => g.id === id)!).filter(Boolean);
    setSessionGlossary(sorted);
    setCurrentGlossary(sorted[0] || null);
    setIsFlipped(false);
    setFcScore({ correct: 0, total: 0 });
    setAnsweredGlossary([]);
  };

  const startOffFlavorsSession = async () => {
    const history = await getHistory('offflavors');
    const sortedIds = sortByDifficulty(OFF_FLAVORS_DATA.map(o => o.id), history);
    const sorted = sortedIds.map(id => OFF_FLAVORS_DATA.find(o => o.id === id)!).filter(Boolean);
    setSessionOffFlavors(sorted);
    setCurrentOffFlavor(sorted[0] || null);
    setIsFlipped(false);
    setFcScore({ correct: 0, total: 0 });
    setAnsweredOffFlavors([]);
    setRevealedOffClues({
      sensation: false,
      causes: false,
      prevention: false,
    });
  };

  // Load saved progress from AsyncStorage on mount
  useEffect(() => {
    const loadSavedProgress = async () => {
      try {
        const keys = [
          '@BJCPStudyBuddy:fcStudyMode',
          '@BJCPStudyBuddy:selectedCategory',
          '@BJCPStudyBuddy:answeredStyles',
          '@BJCPStudyBuddy:answeredGlossary',
          '@BJCPStudyBuddy:answeredOffFlavors',
          '@BJCPStudyBuddy:fcScore',
          '@BJCPStudyBuddy:sessionStylesIds',
          '@BJCPStudyBuddy:currentStyleId',
          '@BJCPStudyBuddy:sessionGlossaryIds',
          '@BJCPStudyBuddy:currentGlossaryId',
          '@BJCPStudyBuddy:sessionOffFlavorsIds',
          '@BJCPStudyBuddy:currentOffFlavorId',
        ];
        const results = await AsyncStorage.multiGet(keys);
        const data = Object.fromEntries(results);

        const savedFcStudyMode = data['@BJCPStudyBuddy:fcStudyMode'] as any;
        const savedSelectedCategory = data['@BJCPStudyBuddy:selectedCategory'];
        const savedAnsweredStyles = data['@BJCPStudyBuddy:answeredStyles'];
        const savedAnsweredGlossary = data['@BJCPStudyBuddy:answeredGlossary'];
        const savedAnsweredOffFlavors = data['@BJCPStudyBuddy:answeredOffFlavors'];
        const savedFcScore = data['@BJCPStudyBuddy:fcScore'];
        const savedSessionStylesIds = data['@BJCPStudyBuddy:sessionStylesIds'];
        const savedCurrentStyleId = data['@BJCPStudyBuddy:currentStyleId'];
        const savedSessionGlossaryIds = data['@BJCPStudyBuddy:sessionGlossaryIds'];
        const savedCurrentGlossaryId = data['@BJCPStudyBuddy:currentGlossaryId'];
        const savedSessionOffFlavorsIds = data['@BJCPStudyBuddy:sessionOffFlavorsIds'];
        const savedCurrentOffFlavorId = data['@BJCPStudyBuddy:currentOffFlavorId'];

        if (savedFcStudyMode) {
          setFcStudyMode(savedFcStudyMode);
        }
        if (savedSelectedCategory) {
          setSelectedCategory(savedSelectedCategory);
        }
        if (savedAnsweredStyles) {
          setAnsweredStyles(JSON.parse(savedAnsweredStyles));
        }
        if (savedAnsweredGlossary) {
          setAnsweredGlossary(JSON.parse(savedAnsweredGlossary));
        }
        if (savedAnsweredOffFlavors) {
          setAnsweredOffFlavors(JSON.parse(savedAnsweredOffFlavors));
        }
        if (savedFcScore) {
          setFcScore(JSON.parse(savedFcScore));
        }

        // Reconstruct active sessions
        const allStyles = getBJCPStyles(language);
        if (savedSessionStylesIds) {
          const ids: string[] = JSON.parse(savedSessionStylesIds);
          const reconstructed = ids.map(id => allStyles.find(s => s.id === id)).filter(Boolean) as BeerStyle[];
          setSessionStyles(reconstructed);
          if (savedCurrentStyleId) {
            setCurrentStyle(reconstructed.find(s => s.id === savedCurrentStyleId) || reconstructed[0] || null);
          } else {
            setCurrentStyle(reconstructed[0] || null);
          }
        } else {
          // Initialize default shuffle
          const category = savedSelectedCategory || 'all';
          const filtered = category === 'all' ? allStyles : allStyles.filter(s => s.category === category);
          const shuffled = [...filtered].sort(() => Math.random() - 0.5);
          setSessionStyles(shuffled);
          setCurrentStyle(shuffled[0] || null);
        }

        if (savedSessionGlossaryIds) {
          const ids: string[] = JSON.parse(savedSessionGlossaryIds);
          const reconstructed = ids.map(id => GLOSSARY_DATA.find(g => g.id === id)).filter(Boolean) as GlossaryTerm[];
          setSessionGlossary(reconstructed);
          if (savedCurrentGlossaryId) {
            setCurrentGlossary(reconstructed.find(g => g.id === savedCurrentGlossaryId) || reconstructed[0] || null);
          } else {
            setCurrentGlossary(reconstructed[0] || null);
          }
        } else {
          const shuffled = [...GLOSSARY_DATA].sort(() => Math.random() - 0.5);
          setSessionGlossary(shuffled);
          setCurrentGlossary(shuffled[0] || null);
        }

        if (savedSessionOffFlavorsIds) {
          const ids: string[] = JSON.parse(savedSessionOffFlavorsIds);
          const reconstructed = ids.map(id => OFF_FLAVORS_DATA.find(o => o.id === id)).filter(Boolean) as OffFlavor[];
          setSessionOffFlavors(reconstructed);
          if (savedCurrentOffFlavorId) {
            setCurrentOffFlavor(reconstructed.find(o => o.id === savedCurrentOffFlavorId) || reconstructed[0] || null);
          } else {
            setCurrentOffFlavor(reconstructed[0] || null);
          }
        } else {
          const shuffled = [...OFF_FLAVORS_DATA].sort(() => Math.random() - 0.5);
          setSessionOffFlavors(shuffled);
          setCurrentOffFlavor(shuffled[0] || null);
        }
      } catch (e) {
        console.error('Failed to load study progress:', e);
      } finally {
        setIsInitialized(true);
      }
    };

    loadSavedProgress();
  }, []);

  // Save progress dynamically whenever related states change
  useEffect(() => {
    if (!isInitialized) return;
    const saveProgress = async () => {
      try {
        await AsyncStorage.multiSet([
          ['@BJCPStudyBuddy:fcStudyMode', fcStudyMode],
          ['@BJCPStudyBuddy:selectedCategory', selectedCategory],
          ['@BJCPStudyBuddy:answeredStyles', JSON.stringify(answeredStyles)],
          ['@BJCPStudyBuddy:answeredGlossary', JSON.stringify(answeredGlossary)],
          ['@BJCPStudyBuddy:answeredOffFlavors', JSON.stringify(answeredOffFlavors)],
          ['@BJCPStudyBuddy:fcScore', JSON.stringify(fcScore)],
          ['@BJCPStudyBuddy:sessionStylesIds', JSON.stringify(sessionStyles.map(s => s.id))],
          ['@BJCPStudyBuddy:currentStyleId', currentStyle?.id || ''],
          ['@BJCPStudyBuddy:sessionGlossaryIds', JSON.stringify(sessionGlossary.map(g => g.id))],
          ['@BJCPStudyBuddy:currentGlossaryId', currentGlossary?.id || ''],
          ['@BJCPStudyBuddy:sessionOffFlavorsIds', JSON.stringify(sessionOffFlavors.map(o => o.id))],
          ['@BJCPStudyBuddy:currentOffFlavorId', currentOffFlavor?.id || ''],
        ]);
      } catch (e) {
        console.error('Failed to save study progress:', e);
      }
    };
    saveProgress();
  }, [
    fcStudyMode,
    selectedCategory,
    answeredStyles,
    answeredGlossary,
    answeredOffFlavors,
    fcScore,
    sessionStyles,
    currentStyle,
    sessionGlossary,
    currentGlossary,
    sessionOffFlavors,
    currentOffFlavor,
    isInitialized,
  ]);

  // Dynamically sync translations when language changes, preserving shuffle order
  useEffect(() => {
    if (!isInitialized) return;
    const allStyles = getBJCPStyles(language);
    setSessionStyles(prev => {
      const updated = prev.map(oldStyle => allStyles.find(s => s.id === oldStyle.id) || oldStyle);
      if (currentStyle) {
        const updatedCurrent = allStyles.find(s => s.id === currentStyle.id);
        if (updatedCurrent) {
          setCurrentStyle(updatedCurrent);
        }
      }
      return updated;
    });
  }, [language]);

  // Load lobby history whenever study mode changes
  useEffect(() => {
    const type = fcStudyMode === 'styles' ? 'styles' : fcStudyMode === 'glossary' ? 'glossary' : 'offflavors';
    getHistory(type).then(setLobbyHistory);
  }, [fcStudyMode, fcState]); // reload when returning to lobby so badges reflect latest answers

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    const allStyles = getBJCPStyles(language);
    const categoryStyles = category === 'all' ? allStyles : allStyles.filter(s => s.category === category);
    const history = await getHistory('styles');
    const sortedIds = sortByDifficulty(categoryStyles.map(s => s.id), history);
    const sorted = sortedIds.map(id => categoryStyles.find(s => s.id === id)!).filter(Boolean);
    setSessionStyles(sorted);

    const categoryAnswered = answeredStyles.filter(id => categoryStyles.some(s => s.id === id));
    const firstUnanswered = sorted.find(s => !categoryAnswered.includes(s.id)) || sorted[0] || null;
    setCurrentStyle(firstUnanswered);
  };

  const handleResetProgress = async () => {
    if (fcStudyMode === 'styles') {
      const allStyles = getBJCPStyles(language);
      const categoryStyles = selectedCategory === 'all' ? allStyles : allStyles.filter(s => s.category === selectedCategory);
      const targetIds = categoryStyles.map(s => s.id);
      setAnsweredStyles(prev => prev.filter(id => !targetIds.includes(id)));
      await clearHistory('styles', targetIds);
      const history = await getHistory('styles');
      const sortedIds = sortByDifficulty(targetIds, history);
      const sorted = sortedIds.map(id => categoryStyles.find(s => s.id === id)!).filter(Boolean);
      setSessionStyles(sorted);
      setCurrentStyle(sorted[0] || null);
      setLobbyHistory(history);
    } else if (fcStudyMode === 'glossary') {
      setAnsweredGlossary([]);
      const ids = GLOSSARY_DATA.map(g => g.id);
      await clearHistory('glossary', ids);
      const history = await getHistory('glossary');
      const sortedIds = sortByDifficulty(ids, history);
      const sorted = sortedIds.map(id => GLOSSARY_DATA.find(g => g.id === id)!).filter(Boolean);
      setSessionGlossary(sorted);
      setCurrentGlossary(sorted[0] || null);
      setLobbyHistory(history);
    } else {
      setAnsweredOffFlavors([]);
      const ids = OFF_FLAVORS_DATA.map(o => o.id);
      await clearHistory('offflavors', ids);
      const history = await getHistory('offflavors');
      const sortedIds = sortByDifficulty(ids, history);
      const sorted = sortedIds.map(id => OFF_FLAVORS_DATA.find(o => o.id === id)!).filter(Boolean);
      setSessionOffFlavors(sorted);
      setCurrentOffFlavor(sorted[0] || null);
      setLobbyHistory(history);
    }
    setFcScore({ correct: 0, total: 0 });
    setIsFlipped(false);
  };

  const handleFlipCard = () => setIsFlipped(!isFlipped);

  const handleFcAnswer = (knewIt: boolean) => {
    if (fcStudyMode === 'styles') {
      if (!currentStyle) return;
      if (answeredStyles.includes(currentStyle.id)) {
        loadNextFcCard();
        return;
      }
      recordAnswer('styles', currentStyle.id, knewIt);
      setFcScore(prev => ({ correct: prev.correct + (knewIt ? 1 : 0), total: prev.total + 1 }));
      setAnsweredStyles(prev => [...prev, currentStyle.id]);
    } else if (fcStudyMode === 'glossary') {
      if (!currentGlossary) return;
      if (answeredGlossary.includes(currentGlossary.id)) {
        loadNextFcCard();
        return;
      }
      recordAnswer('glossary', currentGlossary.id, knewIt);
      setFcScore(prev => ({ correct: prev.correct + (knewIt ? 1 : 0), total: prev.total + 1 }));
      setAnsweredGlossary(prev => [...prev, currentGlossary.id]);
    } else {
      if (!currentOffFlavor) return;
      if (answeredOffFlavors.includes(currentOffFlavor.id)) {
        loadNextFcCard();
        return;
      }
      recordAnswer('offflavors', currentOffFlavor.id, knewIt);
      setFcScore(prev => ({ correct: prev.correct + (knewIt ? 1 : 0), total: prev.total + 1 }));
      setAnsweredOffFlavors(prev => [...prev, currentOffFlavor.id]);
    }
    // Auto-advance to next card after a brief delay
    setTimeout(() => {
      loadNextFcCard();
    }, 250);
  };
  
  const loadNextFcCard = () => {
    setIsFlipped(false);
    setRevealedClues({
      aroma: false,
      appearance: false,
      flavor: false,
      mouthfeel: false,
    });
    setRevealedOffClues({
      sensation: false,
      causes: false,
      prevention: false,
    });

    if (fcStudyMode === 'styles') {
      const currentIndex = sessionStyles.findIndex(s => s.id === currentStyle?.id);
      if (currentIndex + 1 < sessionStyles.length) {
        setTimeout(() => setCurrentStyle(sessionStyles[currentIndex + 1]), 150);
      } else {
        const allStyles = getBJCPStyles(language);
        const isGlobalCompleted = allStyles.every(s => s.id === currentStyle?.id || answeredStyles.includes(s.id));
        
        if (isGlobalCompleted) {
          Alert.alert(
            language === 'es' ? '¡Sesión Completada!' : 'Session Completed!',
            language === 'es' 
              ? '¡Felicidades! Has completado todos los estilos. El progreso general se reiniciará.'
              : 'Congratulations! You have completed all styles. Your general progress will be reset.'
          );
          setAnsweredStyles([]);
          setFcScore({ correct: 0, total: 0 });
          const shuffled = [...allStyles].sort(() => Math.random() - 0.5);
          setSessionStyles(shuffled);
          setCurrentStyle(shuffled[0] || null);
        } else {
          Alert.alert(
            language === 'es' ? 'Categoría Completada' : 'Category Completed',
            language === 'es'
              ? 'Has terminado de estudiar esta categoría.'
              : 'You have finished studying this category.'
          );
        }
        setFcState('lobby');
      }
    } else if (fcStudyMode === 'glossary') {
      const currentIndex = sessionGlossary.findIndex(s => s.id === currentGlossary?.id);
      if (currentIndex + 1 < sessionGlossary.length) {
        setTimeout(() => setCurrentGlossary(sessionGlossary[currentIndex + 1]), 150);
      } else {
        const isGlobalCompleted = GLOSSARY_DATA.every(g => g.id === currentGlossary?.id || answeredGlossary.includes(g.id));
        if (isGlobalCompleted) {
          Alert.alert(
            language === 'es' ? '¡Sesión Completada!' : 'Session Completed!',
            language === 'es'
              ? '¡Felicidades! Has completado todos los términos. El progreso general se reiniciará.'
              : 'Congratulations! You have completed all glossary terms. Your general progress will be reset.'
          );
          setAnsweredGlossary([]);
          setFcScore({ correct: 0, total: 0 });
          const shuffled = [...GLOSSARY_DATA].sort(() => Math.random() - 0.5);
          setSessionGlossary(shuffled);
          setCurrentGlossary(shuffled[0] || null);
        } else {
          Alert.alert(
            language === 'es' ? 'Sesión Completada' : 'Session Completed',
            language === 'es'
              ? 'Has terminado de estudiar este bloque de glosario.'
              : 'You have finished studying this block of glossary terms.'
          );
        }
        setFcState('lobby');
      }
    } else {
      const currentIndex = sessionOffFlavors.findIndex(s => s.id === currentOffFlavor?.id);
      if (currentIndex + 1 < sessionOffFlavors.length) {
        setTimeout(() => setCurrentOffFlavor(sessionOffFlavors[currentIndex + 1]), 150);
      } else {
        const isGlobalCompleted = OFF_FLAVORS_DATA.every(o => o.id === currentOffFlavor?.id || answeredOffFlavors.includes(o.id));
        if (isGlobalCompleted) {
          Alert.alert(
            language === 'es' ? '¡Sesión Completada!' : 'Session Completed!',
            language === 'es'
              ? '¡Felicidades! Has completado todos los off-flavors. El progreso general se reiniciará.'
              : 'Congratulations! You have completed all off-flavors. Your general progress will be reset.'
          );
          setAnsweredOffFlavors([]);
          setFcScore({ correct: 0, total: 0 });
          const shuffled = [...OFF_FLAVORS_DATA].sort(() => Math.random() - 0.5);
          setSessionOffFlavors(shuffled);
          setCurrentOffFlavor(shuffled[0] || null);
        } else {
          Alert.alert(
            language === 'es' ? 'Sesión Completada' : 'Session Completed',
            language === 'es'
              ? 'Has terminado de estudiar los defectos.'
              : 'You have finished studying the off-flavors.'
          );
        }
        setFcState('lobby');
      }
    }
  };

  const startQuiz = () => {
    const q = generateQuiz(quizMode, language, quizCount);
    setQuestions(q);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setStreak(0);
    setMaxStreak(0);
    setSelectedOption(null);
    setQuizState('playing');
  };

  const handleQuizAnswer = (option: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    
    const currentQ = questions[currentQuestionIndex];
    const isCorrect = option === currentQ.options[currentQ.correctIndex];
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  };

  const nextQuizQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizState('results');
    }
  };

  // ----------------------------------------------------
  // RENDER HELPERS
  // ----------------------------------------------------

  const renderToggle = () => (
    <View style={styles.toggleContainer}>
      <Pressable 
        style={[
          styles.toggleBtn, 
          studyMode === 'flashcards' 
            ? { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundElement } 
            : { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.2)' }
        ]}
        onPress={() => setStudyMode('flashcards')}
      >
        <Text style={{ color: studyMode === 'flashcards' ? theme.tint : '#FFFFFF', fontSize: 13, fontWeight: '700', fontFamily: Fonts.manropeBold }}>
          Flashcards
        </Text>
      </Pressable>
      <Pressable 
        style={[
          styles.toggleBtn, 
          studyMode === 'quiz' 
            ? { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundElement } 
            : { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.2)' }
        ]}
        onPress={() => setStudyMode('quiz')}
      >
        <Text style={{ color: studyMode === 'quiz' ? theme.tint : '#FFFFFF', fontSize: 13, fontWeight: '700', fontFamily: Fonts.manropeBold }}>
          {language === 'es' ? 'Quiz Activo' : 'Active Quiz'}
        </Text>
      </Pressable>
    </View>
  );

  const renderFcLobby = () => {
    const categories = Array.from(new Set(getBJCPStyles(language).map(s => s.category))).sort((a, b) => {
      const numA = parseInt(a.match(/^(\d+)/)?.[1] || '0');
      const numB = parseInt(b.match(/^(\d+)/)?.[1] || '0');
      return numA - numB;
    });

    // History for current mode (loaded into state on mount)
    const historyKey = fcStudyMode === 'styles' ? '@bjcp_fc_history_styles'
      : fcStudyMode === 'glossary' ? '@bjcp_fc_history_glossary'
      : '@bjcp_fc_history_offflavors';

    let activePoolCount = 0;
    if (fcStudyMode === 'styles') {
      activePoolCount = selectedCategory === 'all' 
        ? getBJCPStyles(language).length 
        : getBJCPStyles(language).filter(s => s.category === selectedCategory).length;
    } else if (fcStudyMode === 'glossary') {
      activePoolCount = GLOSSARY_DATA.length;
    } else {
      activePoolCount = OFF_FLAVORS_DATA.length;
    }

    let progressCount = 0;
    let totalCount = 0;
    if (fcStudyMode === 'styles') {
      const allStyles = getBJCPStyles(language);
      totalCount = allStyles.length;
      progressCount = answeredStyles.length;
    } else if (fcStudyMode === 'glossary') {
      totalCount = GLOSSARY_DATA.length;
      progressCount = answeredGlossary.length;
    } else {
      totalCount = OFF_FLAVORS_DATA.length;
      progressCount = answeredOffFlavors.length;
    }

    // Helper: count SEEN cards only.
    // ✓ known  = seen cards where correct > incorrect
    // ~ unsure = seen cards where incorrect >= correct
    // Unseen cards (no history) are NOT counted → both badges show 0 before any study.
    const getHistoryStats = (ids: string[]) => {
      let known = 0;
      let unsure = 0;
      ids.forEach(id => {
        const s = lobbyHistory[id];
        if (!s || (s.correct + s.incorrect) === 0) return; // unseen → skip
        if (s.correct > s.incorrect) known++;
        else unsure++;
      });
      return { correct: known, incorrect: unsure };
    };

    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedView style={[styles.lobbyCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <Text style={{ textAlign: 'center', marginBottom: Spacing.three, fontSize: 22, fontWeight: '900', fontFamily: Fonts.spaceGroteskBold, color: theme.text }}>
            {language === 'es' ? 'Fichas de Estudio' : 'Study Flashcards'}
          </Text>
          <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.textSecondary, textAlign: 'center', marginBottom: Spacing.four, lineHeight: 18 }}>
            {language === 'es' 
              ? 'Practica el reconocimiento activo de estilos, terminología o defectos sensoriales.'
              : 'Practice active recall of beer styles, terminology, or off-flavors.'}
          </Text>

          <Text style={{ fontWeight: '700', marginBottom: Spacing.two, fontSize: 14, fontFamily: Fonts.manropeBold, color: theme.text }}>
            {language === 'es' ? 'Tema a Estudiar:' : 'Subject to Study:'}
          </Text>
          <View style={{ flexDirection: 'row', gap: Spacing.two, marginBottom: Spacing.four }}>
            {[
              { id: 'styles', label: language === 'es' ? 'Estilos' : 'Styles' },
              { id: 'glossary', label: language === 'es' ? 'Glosario' : 'Glossary' },
              { id: 'offflavors', label: 'Off-Flavors' }
            ].map(m => (
              <Pressable
                key={m.id}
                onPress={() => setFcStudyMode(m.id as any)}
                style={[
                  styles.countBtn,
                  { borderColor: theme.border, flex: 1 },
                  fcStudyMode === m.id && { backgroundColor: theme.gold, borderColor: theme.gold }
                ]}
              >
                <Text style={{ color: theme.text, fontWeight: '700', fontFamily: Fonts.manropeBold, fontSize: 13 }}>{m.label}</Text>
              </Pressable>
            ))}
          </View>

          {fcStudyMode === 'styles' && (
            <>
              <Text style={{ fontWeight: '700', marginBottom: Spacing.two, fontSize: 14, fontFamily: Fonts.manropeBold, color: theme.text }}>
                {language === 'es' ? 'Seleccionar Categoría:' : 'Select Category:'}
              </Text>
              
              <ScrollView style={{ maxHeight: 180, borderWidth: 1.5, borderColor: theme.border, borderRadius: Spacing.two, padding: Spacing.two, marginBottom: Spacing.three }} nestedScrollEnabled={true}>
                <Pressable
                  onPress={() => handleCategorySelect('all')}
                  style={[
                    styles.modeBtn,
                    { borderColor: 'transparent', paddingVertical: Spacing.two, marginBottom: Spacing.one },
                    selectedCategory === 'all' && { borderColor: theme.gold, backgroundColor: theme.backgroundSelected }
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.two }}>
                    <Text style={{ fontWeight: '700', fontFamily: Fonts.manropeBold, color: theme.text, fontSize: 13, flex: 1 }}>
                      {answeredStyles.length === getBJCPStyles(language).length && <Text style={{ color: theme.tint }}>✓ </Text>}
                      {language === 'es' ? '✨ Todos los Estilos' : '✨ All Styles'} ({getBJCPStyles(language).length})
                    </Text>
                    {(() => {
                      const stats = getHistoryStats(getBJCPStyles(language).map(s => s.id));
                      if (stats.correct + stats.incorrect === 0) return null;
                      return (
                        <View style={{ flexDirection: 'row', gap: 4 }}>
                          <View style={{ backgroundColor: 'rgba(76,175,80,0.15)', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }}>
                            <Text style={{ fontSize: 10, fontFamily: Fonts.manropeBold, color: theme.success }}>✓ {stats.correct}</Text>
                          </View>
                          <View style={{ backgroundColor: '#D99B26', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }}>
                            <Text style={{ fontSize: 10, fontFamily: Fonts.manropeBold, color: '#000' }}>~ {stats.incorrect}</Text>
                          </View>
                        </View>
                      );
                    })()}
                  </View>
                </Pressable>
                {categories.map((cat, idx) => {
                  const catStyles = getBJCPStyles(language).filter(s => s.category === cat);
                  const count = catStyles.length;
                  const answeredCount = answeredStyles.filter(id => catStyles.some(s => s.id === id)).length;
                  const isCompleted = answeredCount === count;
                  const stats = getHistoryStats(catStyles.map(s => s.id));
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => handleCategorySelect(cat)}
                      style={[
                        styles.modeBtn,
                        { borderColor: 'transparent', paddingVertical: Spacing.two, marginBottom: Spacing.one },
                        selectedCategory === cat && { borderColor: theme.gold, backgroundColor: theme.backgroundSelected }
                      ]}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.two }}>
                        <Text style={{ fontWeight: '700', fontFamily: Fonts.manropeBold, color: theme.text, fontSize: 13, flex: 1 }}>
                          {isCompleted && <Text style={{ color: theme.tint }}>✓ </Text>}{cat.replace(/^\d+\.\s+/, '')} ({answeredCount}/{count})
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 4 }}>
                            <View style={{ backgroundColor: 'rgba(76,175,80,0.15)', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }}>
                              <Text style={{ fontSize: 10, fontFamily: Fonts.manropeBold, color: theme.success }}>✓ {stats.correct}</Text>
                            </View>
                            <View style={{ backgroundColor: '#D99B26', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }}>
                              <Text style={{ fontSize: 10, fontFamily: Fonts.manropeBold, color: '#000' }}>~ {stats.incorrect}</Text>
                            </View>
                          </View>
                        </View>
                      </Pressable>
                  );
                })}
              </ScrollView>
            </>
          )}

          {fcStudyMode === 'glossary' && (() => {
            const ids = GLOSSARY_DATA.map(g => g.id);
            const stats = getHistoryStats(ids);
            return (
              <View style={{ backgroundColor: theme.background, padding: Spacing.three, borderRadius: Spacing.two, borderWidth: 1, borderColor: theme.border, marginBottom: Spacing.four }}>
                <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, lineHeight: 20, marginBottom: Spacing.three }}>
                  {language === 'es'
                    ? 'Aprende los términos técnicos más importantes de la guía BJCP. Verás la definición y deberás recordar el término.'
                    : 'Study key BJCP technical terminology. You\'ll see the definition and must recall the term.'}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, fontFamily: Fonts.manropeBold, color: theme.textSecondary }}>
                    {language === 'es' ? 'Historial:' : 'History:'}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <View style={{ backgroundColor: 'rgba(76,175,80,0.15)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ fontSize: 11, fontFamily: Fonts.manropeBold, color: theme.success }}>✓ {stats.correct} {language === 'es' ? 'lo sabía' : 'knew it'}</Text>
                    </View>
                    <View style={{ backgroundColor: '#D99B26', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ fontSize: 11, fontFamily: Fonts.manropeBold, color: '#000' }}>~ {stats.incorrect} {language === 'es' ? 'lo dudé' : 'unsure'}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })()}

          {fcStudyMode === 'offflavors' && (() => {
            const ids = OFF_FLAVORS_DATA.map(o => o.id);
            const stats = getHistoryStats(ids);
            return (
              <View style={{ backgroundColor: theme.background, padding: Spacing.three, borderRadius: Spacing.two, borderWidth: 1, borderColor: theme.border, marginBottom: Spacing.four }}>
                <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, lineHeight: 20, marginBottom: Spacing.three }}>
                  {language === 'es'
                    ? 'Domina los perfiles de defectos sensoriales habituales en la cerveza. Usa las pistas progresivas para recordar sus sensaciones y causas antes de revelar.'
                    : 'Master common off-flavor sensory profiles. Use progressive clues to recall their sensation and causes before flipping the card.'}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, fontFamily: Fonts.manropeBold, color: theme.textSecondary }}>
                    {language === 'es' ? 'Historial:' : 'History:'}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <View style={{ backgroundColor: 'rgba(76,175,80,0.15)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ fontSize: 11, fontFamily: Fonts.manropeBold, color: theme.success }}>✓ {stats.correct} {language === 'es' ? 'lo sabía' : 'knew it'}</Text>
                    </View>
                    <View style={{ backgroundColor: '#D99B26', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ fontSize: 11, fontFamily: Fonts.manropeBold, color: '#000' }}>~ {stats.incorrect} {language === 'es' ? 'lo dudé' : 'unsure'}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })()}

          {/* Lobby Progress Visualization */}
          <View style={{ marginBottom: Spacing.four, marginTop: Spacing.two, paddingHorizontal: Spacing.one }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.two }}>
              <Text style={{ fontFamily: Fonts.manropeBold, fontSize: 13, color: theme.textSecondary }}>
                {language === 'es' ? 'Progreso Global de Estudio:' : 'Global Study Progress:'}
              </Text>
              <Text style={{ fontFamily: Fonts.spaceGroteskBold, fontSize: 13, color: theme.gold }}>
                {progressCount} / {totalCount} ({Math.round((progressCount / (totalCount || 1)) * 100)}%)
              </Text>
            </View>
            <View style={[styles.progressBarTrack, { backgroundColor: 'rgba(255, 255, 255, 0.15)', height: 8 }]}>
              <View style={[styles.progressBarFill, { backgroundColor: theme.gold, width: `${(progressCount / (totalCount || 1)) * 100}%` }]} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: Spacing.three }}>
            <View style={{ backgroundColor: theme.background, paddingVertical: Spacing.one, paddingHorizontal: Spacing.three, borderRadius: Spacing.two, borderWidth: 1, borderColor: theme.border }}>
              <Text style={{ fontFamily: Fonts.manropeBold, fontSize: 12, color: theme.textSecondary }}>
                {language === 'es' ? 'Fichas en el grupo:' : 'Flashcards in pool:'} <Text style={{ color: theme.gold, fontWeight: 'bold' }}>{activePoolCount}</Text>
              </Text>
            </View>
          </View>

          <Pressable 
            onPress={async () => {
              if (fcStudyMode === 'styles') {
                const allStyles = getBJCPStyles(language);
                const catStyles = selectedCategory === 'all'
                  ? allStyles
                  : allStyles.filter(s => s.category === selectedCategory);
                const catIds = catStyles.map(s => s.id);
                const allAnswered = catIds.every(id => answeredStyles.includes(id));

                if (allAnswered) {
                  const history = await getHistory('styles');
                  const unsureIds = catIds.filter(id => { const h = history[id]; return !h || h.incorrect >= h.correct; });
                  if (unsureIds.length === 0) {
                    Alert.alert(
                      language === 'es' ? '¡Puntuación perfecta!' : 'Perfect Score!',
                      language === 'es'
                        ? 'Dominas todas las tarjetas de esta categoría. ¿Quieres reiniciar?'
                        : 'You have mastered all cards in this category. Reset to practice again?',
                      [{ text: language === 'es' ? 'Cancelar' : 'Cancel', style: 'cancel' },
                       { text: language === 'es' ? 'Reiniciar' : 'Reset', onPress: handleResetProgress }]
                    );
                    return;
                  }
                  setAnsweredStyles(prev => prev.filter(id => !unsureIds.includes(id)));
                  const sorted = sortByDifficulty(unsureIds, history).map(id => catStyles.find(s => s.id === id)!).filter(Boolean);
                  setSessionStyles(sorted);
                  setCurrentStyle(sorted[0] || null);
                  setIsFlipped(false);
                  setFcScore({ correct: 0, total: 0 });
                } else if (progressCount === 0) {
                  handleCategorySelect(selectedCategory);
                }

              } else if (fcStudyMode === 'glossary') {
                const allAnswered = GLOSSARY_DATA.every(g => answeredGlossary.includes(g.id));
                if (allAnswered) {
                  const history = await getHistory('glossary');
                  const unsureIds = GLOSSARY_DATA.map(g => g.id).filter(id => { const h = history[id]; return !h || h.incorrect >= h.correct; });
                  if (unsureIds.length === 0) {
                    Alert.alert(
                      language === 'es' ? '¡Puntuación perfecta!' : 'Perfect Score!',
                      language === 'es'
                        ? 'Dominas todos los términos del glosario. ¿Quieres reiniciar?'
                        : 'You have mastered all glossary terms. Reset to practice again?',
                      [{ text: language === 'es' ? 'Cancelar' : 'Cancel', style: 'cancel' },
                       { text: language === 'es' ? 'Reiniciar' : 'Reset', onPress: handleResetProgress }]
                    );
                    return;
                  }
                  setAnsweredGlossary(prev => prev.filter(id => !unsureIds.includes(id)));
                  const history2 = await getHistory('glossary');
                  const sorted = sortByDifficulty(unsureIds, history2).map(id => GLOSSARY_DATA.find(g => g.id === id)!).filter(Boolean);
                  setSessionGlossary(sorted);
                  setCurrentGlossary(sorted[0] || null);
                  setIsFlipped(false);
                  setFcScore({ correct: 0, total: 0 });
                } else if (progressCount === 0) {
                  startGlossarySession();
                }

              } else {
                // offflavors
                const allAnswered = OFF_FLAVORS_DATA.every(o => answeredOffFlavors.includes(o.id));
                if (allAnswered) {
                  const history = await getHistory('offflavors');
                  const unsureIds = OFF_FLAVORS_DATA.map(o => o.id).filter(id => { const h = history[id]; return !h || h.incorrect >= h.correct; });
                  if (unsureIds.length === 0) {
                    Alert.alert(
                      language === 'es' ? '¡Puntuación perfecta!' : 'Perfect Score!',
                      language === 'es'
                        ? 'Dominas todos los off-flavors. ¿Quieres reiniciar?'
                        : 'You have mastered all off-flavors. Reset to practice again?',
                      [{ text: language === 'es' ? 'Cancelar' : 'Cancel', style: 'cancel' },
                       { text: language === 'es' ? 'Reiniciar' : 'Reset', onPress: handleResetProgress }]
                    );
                    return;
                  }
                  setAnsweredOffFlavors(prev => prev.filter(id => !unsureIds.includes(id)));
                  const history2 = await getHistory('offflavors');
                  const sorted = sortByDifficulty(unsureIds, history2).map(id => OFF_FLAVORS_DATA.find(o => o.id === id)!).filter(Boolean);
                  setSessionOffFlavors(sorted);
                  setCurrentOffFlavor(sorted[0] || null);
                  setIsFlipped(false);
                  setFcScore({ correct: 0, total: 0 });
                } else if (progressCount === 0) {
                  startOffFlavorsSession();
                }
              }
              setFcState('playing');
            }}
            style={[styles.startQuizBtn, { backgroundColor: theme.tint, marginTop: 0 }]}
          >
            <View style={styles.btnContentRow}>
              <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 16, fontFamily: Fonts.manropeBold }}>
                {(() => {
                  // Styles
                  if (fcStudyMode === 'styles') {
                    const allStyles = getBJCPStyles(language);
                    const catStyles = selectedCategory === 'all' ? allStyles : allStyles.filter(s => s.category === selectedCategory);
                    const catIds = catStyles.map(s => s.id);
                    if (catIds.every(id => answeredStyles.includes(id))) {
                      const hasDoubts = catIds.some(id => { const h = lobbyHistory[id]; return !h || h.incorrect >= h.correct; });
                      if (hasDoubts) return language === 'es' ? '🔁 Resolver Dudas' : '🔁 Resolve Doubts';
                      return language === 'es' ? '✨ Puntuación Perfecta' : '✨ Perfect Score';
                    }
                  }
                  // Glossary
                  if (fcStudyMode === 'glossary') {
                    if (GLOSSARY_DATA.every(g => answeredGlossary.includes(g.id))) {
                      const hasDoubts = GLOSSARY_DATA.some(g => { const h = lobbyHistory[g.id]; return !h || h.incorrect >= h.correct; });
                      if (hasDoubts) return language === 'es' ? '🔁 Resolver Dudas' : '🔁 Resolve Doubts';
                      return language === 'es' ? '✨ Puntuación Perfecta' : '✨ Perfect Score';
                    }
                  }
                  // Off-Flavors
                  if (fcStudyMode === 'offflavors') {
                    if (OFF_FLAVORS_DATA.every(o => answeredOffFlavors.includes(o.id))) {
                      const hasDoubts = OFF_FLAVORS_DATA.some(o => { const h = lobbyHistory[o.id]; return !h || h.incorrect >= h.correct; });
                      if (hasDoubts) return language === 'es' ? '🔁 Resolver Dudas' : '🔁 Resolve Doubts';
                      return language === 'es' ? '✨ Puntuación Perfecta' : '✨ Perfect Score';
                    }
                  }
                  if (progressCount > 0) return language === 'es' ? 'Reanudar Estudio' : 'Resume Study';
                  return language === 'es' ? 'Comenzar Estudio' : 'Start Study';
                })()}
              </Text>
              <QuizIcon name="arrow" color="#FFF" size={18} />
            </View>
          </Pressable>

          {/* Manual Reset Button */}
          {progressCount > 0 && (
            <Pressable 
              onPress={() => {
                Alert.alert(
                  language === 'es' ? 'Reiniciar Progreso' : 'Reset Progress',
                  language === 'es' 
                    ? '¿Estás seguro de que deseas reiniciar tu progreso en este tema?'
                    : 'Are you sure you want to reset your progress for this subject?',
                  [
                    { text: language === 'es' ? 'Cancelar' : 'Cancel', style: 'cancel' },
                    { text: language === 'es' ? 'Reiniciar' : 'Reset', style: 'destructive', onPress: handleResetProgress }
                  ]
                );
              }}
              style={({ pressed }) => [
                {
                  paddingVertical: Spacing.two,
                  backgroundColor: pressed ? 'rgba(242, 184, 36, 0.12)' : 'transparent',
                  borderColor: theme.gold,
                  borderWidth: 1.5,
                  borderRadius: Spacing.two,
                  alignItems: 'center',
                  marginTop: Spacing.three,
                  width: '100%',
                }
              ]}
            >
              <Text style={{ color: theme.gold, fontFamily: Fonts.manropeBold, fontSize: 13, fontWeight: '700' }}>
                {language === 'es' ? '🔄 Reiniciar Progreso del Tema' : '🔄 Reset Topic Progress'}
              </Text>
            </Pressable>
          )}
        </ThemedView>
      </ScrollView>
    );
  };

  const renderStylesFront = () => {
    if (!currentStyle) return null;
    return (
      <>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardBadge, { color: theme.tint }]}>{language === 'es' ? '¿QUÉ ESTILO SOY?' : 'WHAT STYLE AM I?'}</Text>
          <Text style={{ fontSize: 12, fontFamily: Fonts.spaceGroteskBold, color: theme.textSecondary }}>{language === 'es' ? 'Cat:' : 'Cat:'} {currentStyle.category.replace(/^\d+\.\s+/, '')}</Text>
        </View>
        
        <ScrollView style={{ flex: 1, maxHeight: 380 }} showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
          <View style={styles.questionSection}>
            <Text style={styles.cardSectionLabel}>{language === 'es' ? 'Impresión General:' : 'Overall Impression:'}</Text>
            <Text style={styles.cardImpression}>{currentStyle.overallImpression}</Text>
          </View>
          
          <View style={styles.vitalCluesContainer}>
            <Text style={styles.cardSectionLabel}>{language === 'es' ? 'Estadísticas Vitales:' : 'Vital Statistics:'}</Text>
            <View style={styles.cluesRow}>
              <View style={[styles.clueBadge, { backgroundColor: theme.backgroundSelected }]}><Text style={styles.clueText}>ABV: {currentStyle.vitalStatistics.abv}</Text></View>
              <View style={[styles.clueBadge, { backgroundColor: theme.backgroundSelected }]}><Text style={styles.clueText}>IBUs: {currentStyle.vitalStatistics.ibu}</Text></View>
              <View style={[styles.clueBadge, { backgroundColor: theme.backgroundSelected }]}><Text style={styles.clueText}>SRM: {currentStyle.vitalStatistics.srm}</Text></View>
            </View>
          </View>

          <View style={{ marginTop: Spacing.three, gap: Spacing.two, paddingBottom: Spacing.two }}>
            <Text style={styles.cardSectionLabel}>{language === 'es' ? 'Pistas Adicionales:' : 'Additional Clues:'}</Text>
            
            {/* Aroma Hint */}
            <View style={{ borderBottomWidth: 1, borderColor: 'rgba(128,128,128,0.1)', paddingBottom: Spacing.one }}>
              {revealedClues.aroma ? (
                <View>
                  <Text style={{ fontSize: 11, fontFamily: Fonts.manropeBold, color: theme.textSecondary, textTransform: 'uppercase' }}>{language === 'es' ? 'Aroma:' : 'Aroma:'}</Text>
                  <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, marginTop: 2 }}>{currentStyle.aroma}</Text>
                </View>
              ) : (
                <Pressable 
                  onPress={() => setRevealedClues(prev => ({ ...prev, aroma: true }))}
                  style={{ paddingVertical: 4 }}
                >
                  <Text style={{ fontSize: 12, fontFamily: Fonts.manropeBold, color: theme.tint }}>👁️ {language === 'es' ? 'Revelar Aroma' : 'Reveal Aroma'}</Text>
                </Pressable>
              )}
            </View>

            {/* Aspecto Hint */}
            <View style={{ borderBottomWidth: 1, borderColor: 'rgba(128,128,128,0.1)', paddingBottom: Spacing.one }}>
              {revealedClues.appearance ? (
                <View>
                  <Text style={{ fontSize: 11, fontFamily: Fonts.manropeBold, color: theme.textSecondary, textTransform: 'uppercase' }}>{language === 'es' ? 'Aspecto:' : 'Appearance:'}</Text>
                  <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, marginTop: 2 }}>{currentStyle.appearance}</Text>
                </View>
              ) : (
                <Pressable 
                  onPress={() => setRevealedClues(prev => ({ ...prev, appearance: true }))}
                  style={{ paddingVertical: 4 }}
                >
                  <Text style={{ fontSize: 12, fontFamily: Fonts.manropeBold, color: theme.tint }}>👁️ {language === 'es' ? 'Revelar Aspecto' : 'Reveal Appearance'}</Text>
                </Pressable>
              )}
            </View>

            {/* Sabor Hint */}
            <View style={{ borderBottomWidth: 1, borderColor: 'rgba(128,128,128,0.1)', paddingBottom: Spacing.one }}>
              {revealedClues.flavor ? (
                <View>
                  <Text style={{ fontSize: 11, fontFamily: Fonts.manropeBold, color: theme.textSecondary, textTransform: 'uppercase' }}>{language === 'es' ? 'Sabor:' : 'Flavor:'}</Text>
                  <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, marginTop: 2 }}>{currentStyle.flavor}</Text>
                </View>
              ) : (
                <Pressable 
                  onPress={() => setRevealedClues(prev => ({ ...prev, flavor: true }))}
                  style={{ paddingVertical: 4 }}
                >
                  <Text style={{ fontSize: 12, fontFamily: Fonts.manropeBold, color: theme.tint }}>👁️ {language === 'es' ? 'Revelar Sabor' : 'Reveal Flavor'}</Text>
                </Pressable>
              )}
            </View>

            {/* Sensación en Boca Hint */}
            <View style={{ paddingBottom: Spacing.one }}>
              {revealedClues.mouthfeel ? (
                <View>
                  <Text style={{ fontSize: 11, fontFamily: Fonts.manropeBold, color: theme.textSecondary, textTransform: 'uppercase' }}>{language === 'es' ? 'Sensación en Boca:' : 'Mouthfeel:'}</Text>
                  <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, marginTop: 2 }}>{currentStyle.mouthfeel}</Text>
                </View>
              ) : (
                <Pressable 
                  onPress={() => setRevealedClues(prev => ({ ...prev, mouthfeel: true }))}
                  style={{ paddingVertical: 4 }}
                >
                  <Text style={{ fontSize: 12, fontFamily: Fonts.manropeBold, color: theme.tint }}>👁️ {language === 'es' ? 'Revelar Sensación en Boca' : 'Reveal Mouthfeel'}</Text>
                </Pressable>
              )}
            </View>
          </View>
        </ScrollView>
      </>
    );
  };

  const renderStylesBack = () => {
    if (!currentStyle) return null;
    return (
      <>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardBadge, { color: theme.success }]}>{language === 'es' ? 'ESTILO REVELADO' : 'STYLE REVEALED'}</Text>
          <Text style={[styles.backIdBadge, { color: '#FFF', backgroundColor: theme.tint }]}>ID: {currentStyle.id}</Text>
        </View>
        
        <ScrollView style={{ flex: 1, maxHeight: 380 }} showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
          <View style={styles.answerHeader}>
            <Text style={styles.answerStyleName}>{currentStyle.name}</Text>
            <Text style={{ fontSize: 13, fontFamily: Fonts.spaceGrotesk, color: theme.textSecondary, textAlign: 'center' }}>{currentStyle.category}</Text>
          </View>

          <View style={{ gap: Spacing.three, marginTop: Spacing.two, paddingBottom: Spacing.two }}>
            {/* Impresión General */}
            <View>
              <Text style={styles.cardSectionLabel}>{language === 'es' ? 'Impresión General:' : 'Overall Impression:'}</Text>
              <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, lineHeight: 18 }}>{currentStyle.overallImpression}</Text>
            </View>

            {/* Aroma */}
            {currentStyle.aroma ? (
              <View>
                <Text style={styles.cardSectionLabel}>{language === 'es' ? 'Aroma:' : 'Aroma:'}</Text>
                <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, lineHeight: 18 }}>{currentStyle.aroma}</Text>
              </View>
            ) : null}

            {/* Aspecto */}
            {currentStyle.appearance ? (
              <View>
                <Text style={styles.cardSectionLabel}>{language === 'es' ? 'Aspecto:' : 'Appearance:'}</Text>
                <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, lineHeight: 18 }}>{currentStyle.appearance}</Text>
              </View>
            ) : null}

            {/* Sabor */}
            {currentStyle.flavor ? (
              <View>
                <Text style={styles.cardSectionLabel}>{language === 'es' ? 'Sabor:' : 'Flavor:'}</Text>
                <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, lineHeight: 18 }}>{currentStyle.flavor}</Text>
              </View>
            ) : null}

            {/* Sensación en Boca */}
            {currentStyle.mouthfeel ? (
              <View>
                <Text style={styles.cardSectionLabel}>{language === 'es' ? 'Sensación en Boca:' : 'Mouthfeel:'}</Text>
                <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, lineHeight: 18 }}>{currentStyle.mouthfeel}</Text>
              </View>
            ) : null}

            {/* Comparación de Estilo */}
            {currentStyle.comparison ? (
              <View>
                <Text style={styles.cardSectionLabel}>{language === 'es' ? 'Comparación de Estilo:' : 'Style Comparison:'}</Text>
                <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, lineHeight: 18 }}>{currentStyle.comparison}</Text>
              </View>
            ) : null}

            {/* Historia */}
            {currentStyle.history ? (
              <View>
                <Text style={styles.cardSectionLabel}>{language === 'es' ? 'Historia:' : 'History:'}</Text>
                <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, lineHeight: 18 }}>{currentStyle.history}</Text>
              </View>
            ) : null}

            {/* Ingredientes */}
            {currentStyle.ingredients ? (
              <View>
                <Text style={styles.cardSectionLabel}>{language === 'es' ? 'Ingredientes Característicos:' : 'Characteristic Ingredients:'}</Text>
                <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, lineHeight: 18 }}>{currentStyle.ingredients}</Text>
              </View>
            ) : null}

            {/* Ejemplos Comerciales */}
            <View style={{ marginBottom: Spacing.three }}>
              <Text style={styles.cardSectionLabel}>{language === 'es' ? 'Ejemplos Comerciales:' : 'Commercial Examples:'}</Text>
              <View style={styles.examplesContainer}>
                {currentStyle.commercialExamples.map((ex, i) => (
                  <View key={i} style={[styles.exampleItem, { backgroundColor: theme.backgroundSelected }]}>
                    <QuizIcon name="styles" color={theme.textSecondary} size={12} />
                    <Text style={{ fontSize: 12, fontFamily: Fonts.inter, color: theme.text }}>{ex}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </>
    );
  };

  const renderGlossaryFront = () => {
    if (!currentGlossary) return null;
    const def = language === 'es' ? currentGlossary.definition_es : currentGlossary.definition_en;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: Spacing.four, paddingHorizontal: Spacing.three }}>
        <Text style={[styles.cardBadge, { color: theme.tint, marginBottom: Spacing.four }]}>{language === 'es' ? '¿CUÁL ES EL TÉRMINO?' : 'WHAT IS THE TERM?'}</Text>
        <Text style={{ fontSize: 15, fontFamily: Fonts.inter, color: theme.text, textAlign: 'center', lineHeight: 22, paddingHorizontal: Spacing.two }}>
          {def}
        </Text>
        <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.textSecondary, marginTop: Spacing.five, textAlign: 'center', opacity: 0.8 }}>
          {language === 'es' ? 'Toca la ficha para revelar el término' : 'Tap card to reveal the term'}
        </Text>
      </View>
    );
  };

  const renderGlossaryBack = () => {
    if (!currentGlossary) return null;
    const name = language === 'es' ? currentGlossary.name_es : currentGlossary.name_en;
    const def = language === 'es' ? currentGlossary.definition_es : currentGlossary.definition_en;
    return (
      <>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardBadge, { color: theme.success }]}>{language === 'es' ? 'TÉRMINO REVELADO' : 'TERM REVEALED'}</Text>
        </View>
        <ScrollView style={{ flex: 1, maxHeight: 380 }} showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
          <View style={styles.answerHeader}>
            <Text style={styles.answerStyleName}>{name}</Text>
          </View>
          <View style={{ marginTop: Spacing.three, paddingBottom: Spacing.two }}>
            <Text style={styles.cardSectionLabel}>{language === 'es' ? 'Definición:' : 'Definition:'}</Text>
            <Text style={{ fontSize: 15, fontFamily: Fonts.inter, color: theme.text, lineHeight: 22 }}>{def}</Text>
          </View>
        </ScrollView>
      </>
    );
  };

  const renderOffFlavorsFront = () => {
    if (!currentOffFlavor) return null;
    const name_en = currentOffFlavor.name_en;
    const name_es = currentOffFlavor.name_es ?? name_en;
    const sensation = language === 'es' ? currentOffFlavor.sensation_es : currentOffFlavor.sensation_en;
    const causes = language === 'es' ? currentOffFlavor.causes_es : currentOffFlavor.causes_en;
    const prevention = language === 'es' ? currentOffFlavor.prevention_es : currentOffFlavor.prevention_en;

    // Censor the defect name wherever it appears in causes/prevention text
    const censor = (text: string) => {
      let result = text;
      [name_en, name_es].forEach(n => {
        if (!n) return;
        // Escape special regex chars, then replace case-insensitively
        const escaped = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        result = result.replace(new RegExp(escaped, 'gi'), '___');
      });
      return result;
    };

    return (
      <>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardBadge, { color: theme.tint }]}>{language === 'es' ? '¿QUÉ DEFECTO ES?' : 'WHAT OFF-FLAVOR IS IT?'}</Text>
        </View>
        
        <ScrollView style={{ flex: 1, maxHeight: 380 }} showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
          <View style={[styles.answerHeader, { marginBottom: Spacing.four }]}>
            <Text style={{ fontSize: 48, fontWeight: '900', fontFamily: Fonts.spaceGroteskBold, color: theme.textSecondary, textAlign: 'center', opacity: 0.5 }}>
              ???
            </Text>
          </View>

          <View style={{ gap: Spacing.two, paddingBottom: Spacing.two }}>
            <Text style={styles.cardSectionLabel}>{language === 'es' ? 'Pistas Adicionales:' : 'Additional Clues:'}</Text>

            {/* Sensation Hint — always visible */}
            <View style={{ borderBottomWidth: 1, borderColor: 'rgba(128,128,128,0.1)', paddingBottom: Spacing.one }}>
              <Text style={{ fontSize: 11, fontFamily: Fonts.manropeBold, color: theme.textSecondary, textTransform: 'uppercase' }}>{language === 'es' ? 'Sensación Organoléptica:' : 'Organoleptic Sensation:'}</Text>
              <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, marginTop: 2 }}>{censor(sensation)}</Text>
            </View>

            {/* Causes Hint — collapsed by default, tap to reveal */}
            <Pressable
              onPress={() => setRevealedOffClues(prev => ({ ...prev, causes: !prev.causes }))}
              style={{ borderBottomWidth: 1, borderColor: 'rgba(128,128,128,0.1)', paddingBottom: Spacing.one }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontFamily: Fonts.manropeBold, color: theme.tint, textTransform: 'uppercase' }}>
                  {language === 'es' ? 'Causas Comunes:' : 'Common Causes:'}
                </Text>
                <Text style={{ fontSize: 11, fontFamily: Fonts.manropeBold, color: theme.tint }}>
                  {revealedOffClues.causes ? '▲' : '▼ ' + (language === 'es' ? 'revelar' : 'reveal')}
                </Text>
              </View>
              {revealedOffClues.causes && (
                <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, marginTop: 2 }}>{censor(causes)}</Text>
              )}
            </Pressable>

            {/* Prevention Hint — always visible */}
            <View style={{ paddingBottom: Spacing.one }}>
              <Text style={{ fontSize: 11, fontFamily: Fonts.manropeBold, color: theme.textSecondary, textTransform: 'uppercase' }}>{language === 'es' ? 'Prevención:' : 'Prevention:'}</Text>
              <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, marginTop: 2 }}>{censor(prevention)}</Text>
            </View>
          </View>

        </ScrollView>
      </>
    );
  };

  const renderOffFlavorsBack = () => {
    if (!currentOffFlavor) return null;
    const name = language === 'es' ? currentOffFlavor.name_es : currentOffFlavor.name_en;
    const sensation = language === 'es' ? currentOffFlavor.sensation_es : currentOffFlavor.sensation_en;
    const causes = language === 'es' ? currentOffFlavor.causes_es : currentOffFlavor.causes_en;
    const prevention = language === 'es' ? currentOffFlavor.prevention_es : currentOffFlavor.prevention_en;

    return (
      <>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardBadge, { color: theme.success }]}>{language === 'es' ? 'DEFECTO REVELADO' : 'OFF-FLAVOR REVEALED'}</Text>
        </View>
        
        <ScrollView style={{ flex: 1, maxHeight: 380 }} showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
          <View style={styles.answerHeader}>
            <Text style={styles.answerStyleName}>{name}</Text>
          </View>
        </ScrollView>
      </>
    );
  };

  const renderFlashcards = () => {
    if (fcState === 'lobby') {
      return renderFcLobby();
    }

    let progressCount = 0;
    let totalCount = 0;
    let isCardAnswered = false;

    if (fcStudyMode === 'styles') {
      if (!currentStyle) return null;
      progressCount = answeredStyles.length;
      totalCount = sessionStyles.length;
      isCardAnswered = answeredStyles.includes(currentStyle.id);
    } else if (fcStudyMode === 'glossary') {
      if (!currentGlossary) return null;
      progressCount = answeredGlossary.length;
      totalCount = sessionGlossary.length;
      isCardAnswered = answeredGlossary.includes(currentGlossary.id);
    } else {
      if (!currentOffFlavor) return null;
      progressCount = answeredOffFlavors.length;
      totalCount = sessionOffFlavors.length;
      isCardAnswered = answeredOffFlavors.includes(currentOffFlavor.id);
    }

    return (
      <>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two }}>
            <Pressable 
              onPress={() => setFcState('lobby')}
              style={({ pressed }) => [
                { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.12)' },
                pressed && { opacity: 0.7 }
              ]}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>←</Text>
            </Pressable>
            <Text style={styles.title}>{language === 'es' ? 'Estudio' : 'Study'}</Text>
          </View>
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, fontFamily: Fonts.manropeBold }}>
            {language === 'es' ? 'Progreso:' : 'Progress:'} <Text style={{ color: theme.gold, fontWeight: 'bold' }}>{progressCount}</Text>/{totalCount}
          </Text>
        </View>

        <View style={styles.progressWrapper}>
          <View style={[styles.progressBarTrack, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
            <View style={[styles.progressBarFill, { backgroundColor: theme.gold, width: `${(progressCount / (totalCount || 1)) * 100}%` }]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View 
            style={[
              styles.cardContainer,
              { backgroundColor: theme.backgroundElement, borderColor: isFlipped ? theme.gold : theme.border, borderWidth: isFlipped ? 2 : 1.5 }
            ]}
          >
            <View style={[styles.cardColorStripe, { backgroundColor: theme.gold }]} />

            {!isFlipped ? (
              <View style={styles.cardSide}>
                {fcStudyMode === 'styles' && renderStylesFront()}
                {fcStudyMode === 'glossary' && renderGlossaryFront()}
                {fcStudyMode === 'offflavors' && renderOffFlavorsFront()}
              </View>
            ) : (
              <View style={styles.cardSide}>
                {fcStudyMode === 'styles' && renderStylesBack()}
                {fcStudyMode === 'glossary' && renderGlossaryBack()}
                {fcStudyMode === 'offflavors' && renderOffFlavorsBack()}
              </View>
            )}
          </View>

          <View style={styles.controlsContainer}>
            {isCardAnswered ? (
              <Pressable onPress={loadNextFcCard} style={[styles.nextCardBtn, { backgroundColor: theme.gold }]}>
                <View style={styles.btnContentRow}>
                  <Text style={{ color: theme.text, fontWeight: '700', fontSize: 14, fontFamily: Fonts.manropeBold }}>
                    {language === 'es' ? 'Siguiente Ficha' : 'Next Card'}
                  </Text>
                  <QuizIcon name="arrow" color={theme.text} size={16} />
                </View>
              </Pressable>
            ) : !isFlipped ? (
              <Pressable onPress={() => setIsFlipped(true)} style={[styles.nextCardBtn, { backgroundColor: theme.gold }]}>
                <View style={styles.btnContentRow}>
                  <Text style={{ color: theme.text, fontWeight: '700', fontSize: 14, fontFamily: Fonts.manropeBold }}>
                    {fcStudyMode === 'styles' 
                      ? (language === 'es' ? 'Revelar Estilo' : 'Reveal Style') 
                      : fcStudyMode === 'glossary' 
                        ? (language === 'es' ? 'Revelar Definición' : 'Reveal Definition') 
                        : (language === 'es' ? 'Revelar Defecto' : 'Reveal Off-Flavor')}
                  </Text>
                  <QuizIcon name="arrow" color={theme.text} size={16} />
                </View>
              </Pressable>
            ) : (
              <View style={styles.answerButtonsRow}>
                <Pressable onPress={() => handleFcAnswer(false)} style={[styles.answerBtn, { backgroundColor: theme.gold }]}>
                  <View style={styles.btnContentRow}>
                    <QuizIcon name="cross" color={theme.text} size={16} />
                    <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13, fontFamily: Fonts.manropeBold }}>{language === 'es' ? 'Lo dudé' : 'Unsure'}</Text>
                  </View>
                </Pressable>
                <Pressable onPress={() => handleFcAnswer(true)} style={[styles.answerBtn, { backgroundColor: theme.success }]}>
                  <View style={styles.btnContentRow}>
                    <QuizIcon name="check" color="#FFF" size={16} />
                    <Text style={[styles.btnTextWhite, { fontWeight: '700', fontSize: 13, fontFamily: Fonts.manropeBold }]}>{language === 'es' ? '¡Lo sabía!' : 'Knew it!'}</Text>
                  </View>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </>
    );
  };

  const renderQuizLobby = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <ThemedView style={[styles.lobbyCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <Text style={{ textAlign: 'center', marginBottom: Spacing.four, fontSize: 24, fontWeight: '900', fontFamily: Fonts.spaceGroteskBold, color: theme.text }}>BJCP Quiz</Text>
        
        <Text style={{ fontWeight: '700', marginBottom: Spacing.two, fontSize: 14, fontFamily: Fonts.manropeBold, color: theme.text }}>{language === 'es' ? 'Modo de Estudio:' : 'Study Mode:'}</Text>
        <View style={styles.modesContainer}>
          {[
            { id: 'mixed', label: language === 'es' ? 'Mixto (Todos)' : 'Mixed (All)', desc: language === 'es' ? 'Examen simulado integral' : 'Comprehensive mock exam', icon: 'mixed' },
            { id: 'styles', label: language === 'es' ? 'Estilos' : 'Styles', desc: language === 'es' ? 'Adivina estilos, IBU, ABV' : 'Guess styles, IBU, ABV', icon: 'styles' },
            { id: 'glossary', label: language === 'es' ? 'Glosario' : 'Glossary', desc: language === 'es' ? 'Términos técnicos' : 'Technical terms', icon: 'glossary' },
            { id: 'offflavors', label: language === 'es' ? 'Off-Flavors' : 'Off-Flavors', desc: language === 'es' ? 'Defectos y causas' : 'Defects and causes', icon: 'offflavors' },
          ].map(m => (
            <Pressable 
              key={m.id}
              onPress={() => setQuizMode(m.id as QuizMode)}
              style={[styles.modeBtn, { borderColor: theme.border }, quizMode === m.id && { borderColor: theme.gold, backgroundColor: theme.backgroundSelected }]}
            >
              <View style={styles.modeBtnHeader}>
                <QuizIcon name={m.icon} color={quizMode === m.id ? theme.gold : theme.textSecondary} size={18} />
                <Text style={{ fontWeight: '700', fontFamily: Fonts.manropeBold, color: theme.text, fontSize: 14 }}>{m.label}</Text>
              </View>
              <Text style={{ fontSize: 12, fontFamily: Fonts.inter, color: theme.textSecondary, marginLeft: 26 }}>{m.desc}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={{ fontWeight: '700', marginTop: Spacing.four, marginBottom: Spacing.two, fontSize: 14, fontFamily: Fonts.manropeBold, color: theme.text }}>{language === 'es' ? 'Cantidad de Preguntas:' : 'Number of Questions:'}</Text>
        <View style={styles.countContainer}>
          {[5, 10, 20, 50].map(c => (
            <Pressable
              key={c}
              onPress={() => setQuizCount(c)}
              style={[styles.countBtn, { borderColor: theme.border }, quizCount === c && { backgroundColor: theme.gold, borderColor: theme.gold }]}
            >
              <Text style={{ color: theme.text, fontWeight: '700', fontFamily: Fonts.manropeBold, fontSize: 14 }}>{c}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={startQuiz} style={[styles.startQuizBtn, { backgroundColor: theme.tint }]}>
          <View style={styles.btnContentRow}>
            <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 16, fontFamily: Fonts.manropeBold }}>{language === 'es' ? 'Comenzar Quiz' : 'Start Quiz'}</Text>
            <QuizIcon name="arrow" color="#FFF" size={18} />
          </View>
        </Pressable>
      </ThemedView>
    </ScrollView>
  );

  const renderQuizPlaying = () => {
    const q = questions[currentQuestionIndex];
    const hasAnswered = selectedOption !== null;

    return (
      <>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two }}>
            <Pressable 
              onPress={() => {
                Alert.alert(
                  language === 'es' ? 'Salir del Quiz' : 'Exit Quiz',
                  language === 'es' 
                    ? '¿Estás seguro de que deseas salir del quiz en curso? Perderás tu progreso actual.'
                    : 'Are you sure you want to exit the current quiz? You will lose your current progress.',
                  [
                    { text: language === 'es' ? 'Cancelar' : 'Cancel', style: 'cancel' },
                    { text: language === 'es' ? 'Salir' : 'Exit', style: 'destructive', onPress: () => setQuizState('lobby') }
                  ]
                );
              }}
              style={({ pressed }) => [
                { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.12)' },
                pressed && { opacity: 0.7 }
              ]}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>←</Text>
            </Pressable>
            <Text style={styles.title}>{language === 'es' ? 'Quiz' : 'Quiz'}</Text>
          </View>
          <View style={styles.streakBadge}>
            <QuizIcon name="fire" color={streak > 0 ? theme.gold : 'rgba(255, 255, 255, 0.8)'} size={16} />
            <Text style={{ fontWeight: '700', color: streak > 0 ? theme.gold : 'rgba(255, 255, 255, 0.8)', fontSize: 13, fontFamily: Fonts.manropeBold }}>{language === 'es' ? 'Racha:' : 'Streak:'} {streak}</Text>
          </View>
        </View>

        <View style={styles.progressWrapper}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, fontFamily: Fonts.manropeBold }}>
              {language === 'es' ? 'Pregunta' : 'Question'} {currentQuestionIndex + 1} / {questions.length}
            </Text>
          </View>
          <View style={[styles.progressBarTrack, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
            <View style={[styles.progressBarFill, { backgroundColor: theme.gold, width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {(() => {
          const parts = q.question.split('\n\n');
          const mainQuestion = parts[0];
          const subInfo = parts.slice(1).join('\n\n');
          return (
            <ThemedView style={[styles.quizQuestionCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <View style={styles.quizCategoryHeader}>
                <QuizIcon name={q.category} color={theme.gold} size={16} />
                <Text style={{ color: theme.gold, textTransform: 'uppercase', fontFamily: Fonts.spaceGroteskBold, fontSize: 11, letterSpacing: 1 }}>
                  {q.category === 'mixed' ? (language === 'es' ? 'General' : 'General') : (q.category === 'styles' ? (language === 'es' ? 'Estilos' : 'Styles') : q.category === 'glossary' ? (language === 'es' ? 'Glosario' : 'Glossary') : q.category === 'offflavors' ? (language === 'es' ? 'Off-Flavors' : 'Off-Flavors') : q.category)}
                </Text>
              </View>
              <Text style={{ fontSize: 16, lineHeight: 22, fontWeight: '700', fontFamily: Fonts.spaceGroteskBold, color: theme.tint }}>
                {mainQuestion}
              </Text>
              {subInfo ? (
                <Text style={{ fontSize: 14, lineHeight: 20, fontFamily: Fonts.inter, color: theme.text, marginTop: Spacing.two }}>
                  {subInfo}
                </Text>
              ) : null}
            </ThemedView>
          );
        })()}

        <View style={styles.optionsContainer}>
          {q.options.map((opt, i) => {
            const isCorrectOption = opt === q.options[q.correctIndex];
            const isSelected = selectedOption === opt;
            const optionLetter = String.fromCharCode(65 + i);
            
            let bgColor: string = theme.backgroundElement;
            let borderColor: string = theme.border;
            let textColor: string = theme.text;
            let iconName = '';

            if (hasAnswered) {
              if (isCorrectOption) {
                bgColor = theme.success;
                borderColor = theme.success;
                textColor = '#FFF';
                iconName = 'check';
              } else if (isSelected && !isCorrectOption) {
                bgColor = theme.gold; // Brand Gold for incorrect selection
                borderColor = theme.gold;
                textColor = theme.text;
                iconName = 'cross';
              } else {
                // Keep option card but dim it
                bgColor = theme.backgroundElement;
                borderColor = theme.border;
                textColor = theme.textSecondary;
              }
            } else if (isSelected) {
              borderColor = theme.tint;
            }

            return (
              <Pressable 
                key={i} 
                onPress={() => handleQuizAnswer(opt)}
                disabled={hasAnswered}
                style={[
                  styles.optionBtn, 
                  { backgroundColor: bgColor, borderColor },
                  hasAnswered && !isSelected && !isCorrectOption && { opacity: 0.6 }
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flex: 1 }}>
                  <View 
                    style={[
                      styles.optionLetterBadge, 
                      { 
                        backgroundColor: isCorrectOption && hasAnswered 
                          ? 'rgba(255,255,255,0.2)' 
                          : isSelected && !isCorrectOption && hasAnswered 
                            ? 'rgba(0,0,0,0.1)' 
                            : theme.backgroundSelected,
                        borderColor: isCorrectOption && hasAnswered 
                          ? '#FFF' 
                          : theme.border
                      }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.optionLetterText, 
                        { 
                          color: isCorrectOption && hasAnswered 
                            ? '#FFF' 
                            : theme.textSecondary 
                        }
                      ]}
                    >
                      {optionLetter}
                    </Text>
                  </View>
                  <Text style={{ color: textColor, fontSize: 14, fontFamily: Fonts.manrope, flex: 1 }}>
                    {opt}
                  </Text>
                </View>
                {iconName !== '' && (
                  <QuizIcon name={iconName} color={bgColor === theme.success ? '#FFF' : theme.text} size={18} />
                )}
              </Pressable>
            );
          })}
        </View>

        {hasAnswered && (
          <View style={[styles.explanationContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Text style={{ fontSize: 13, fontFamily: Fonts.inter, color: theme.text, lineHeight: 20 }}>{q.explanation}</Text>
            <Pressable onPress={nextQuizQuestion} style={[styles.nextQuizBtn, { backgroundColor: theme.gold }]}>
              <View style={styles.btnContentRow}>
                <Text style={{ color: theme.text, fontWeight: '700', fontSize: 14, fontFamily: Fonts.manropeBold }}>
                  {currentQuestionIndex + 1 === questions.length 
                    ? (language === 'es' ? 'Ver Resultados' : 'View Results') 
                    : (language === 'es' ? 'Siguiente' : 'Next')}
                </Text>
                <QuizIcon name={currentQuestionIndex + 1 === questions.length ? 'award' : 'arrow'} color={theme.text} size={16} />
              </View>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </>
  );
};

  const renderQuizResults = () => {
    const percentage = Math.round((quizScore / questions.length) * 100);
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={[styles.lobbyCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border, alignItems: 'center', paddingVertical: Spacing.six }]}>
          <QuizIcon name="award" color={percentage >= 80 ? theme.success : theme.tint} size={64} />
          
          <Text style={{ fontSize: 24, fontWeight: '900', fontFamily: Fonts.spaceGroteskBold, color: theme.text, marginVertical: Spacing.four }}>{language === 'es' ? 'Resultados Finales' : 'Final Results'}</Text>
          
          <Text style={{ fontSize: 48, fontWeight: '900', fontFamily: Fonts.spaceGroteskBold, color: percentage >= 80 ? theme.success : theme.tint, marginVertical: Spacing.two }}>
            {percentage}%
          </Text>
          
          <Text style={{ fontSize: 15, fontFamily: Fonts.inter, color: theme.textSecondary, marginBottom: Spacing.four }}>
            {language === 'es' 
              ? `${quizScore} de ${questions.length} respuestas correctas` 
              : `${quizScore} of ${questions.length} correct answers`}
          </Text>
          
          <View style={[styles.finalStreakBadge, { backgroundColor: theme.background, borderColor: theme.border, borderWidth: 1 }]}>
            <QuizIcon name="fire" color={theme.gold} size={24} />
            <Text style={{ fontWeight: '700', fontSize: 16, color: theme.text, fontFamily: Fonts.manropeBold }}>
              {language === 'es' ? 'Racha Máxima:' : 'Max Streak:'} {maxStreak}
            </Text>
          </View>

          <Pressable onPress={() => setQuizState('lobby')} style={[styles.startQuizBtn, { backgroundColor: theme.tint, width: '100%', marginTop: Spacing.five }]}>
            <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 16, fontFamily: Fonts.manropeBold }}>
              {language === 'es' ? 'Volver al Menú' : 'Back to Menu'}
            </Text>
          </Pressable>
        </ThemedView>
      </ScrollView>
    );
  };

  const isLobby = (studyMode === 'flashcards' && fcState === 'lobby') || (studyMode === 'quiz' && quizState === 'lobby');

  return (
    <ThemedView type="tint" style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {isLobby && (
          <View style={styles.lobbyHeader}>
            <Pressable 
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/');
                }
              }} 
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
              <Text style={styles.backText}>←</Text>
            </Pressable>
            <ThemedText style={styles.headerTitle}>
              {language === 'es' ? 'Sección de Estudio' : 'Study Section'}
            </ThemedText>
            <View style={{ width: 40 }} />
          </View>
        )}
        {renderToggle()}
        {studyMode === 'flashcards' && renderFlashcards()}
        {studyMode === 'quiz' && quizState === 'lobby' && renderQuizLobby()}
        {studyMode === 'quiz' && quizState === 'playing' && renderQuizPlaying()}
        {studyMode === 'quiz' && quizState === 'results' && renderQuizResults()}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', flexDirection: 'row', backgroundColor: '#2F5D73' },
  safeArea: { flex: 1, maxWidth: MaxContentWidth },
  lobbyHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.three, paddingTop: Spacing.two, paddingBottom: Spacing.two, height: 48 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.12)' },
  backText: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  pressed: { opacity: 0.7 },
  headerTitle: { fontSize: 20, color: '#FFFFFF', fontWeight: '900', fontFamily: Fonts.spaceGroteskBold, flex: 1, textAlign: 'center' },
  toggleContainer: { flexDirection: 'row', padding: Spacing.three, gap: Spacing.two },
  toggleBtn: { flex: 1, paddingVertical: Spacing.three, alignItems: 'center', borderRadius: Spacing.two, borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.2)' },
  
  // Flashcards
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.three, marginBottom: Spacing.two },
  title: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', fontFamily: Fonts.spaceGroteskBold },
  progressWrapper: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.three },
  progressBarTrack: { height: 6, borderRadius: 3, width: '100%', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  scrollContent: { paddingHorizontal: Spacing.three, paddingBottom: BottomTabInset + Spacing.six, gap: Spacing.three },
  
  cardContainer: { borderRadius: Spacing.three, minHeight: 360, elevation: 4, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  cardPressed: { transform: [{ scale: 0.99 }] },
  cardColorStripe: { height: 8, width: '100%' },
  cardSide: { flex: 1, padding: Spacing.three },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.three },
  cardBadge: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, fontFamily: Fonts.spaceGroteskBold },
  backIdBadge: { fontSize: 12, fontWeight: '900', paddingHorizontal: Spacing.two, borderRadius: Spacing.one, fontFamily: Fonts.spaceGroteskBold },
  cardSectionLabel: { fontSize: 10, color: 'rgba(128,128,128,0.7)', marginBottom: Spacing.one, textTransform: 'uppercase', fontFamily: Fonts.manropeBold, letterSpacing: 1 },
  questionSection: { flex: 1, justifyContent: 'center' },
  cardImpression: { fontSize: 14, lineHeight: 20, fontFamily: Fonts.inter, color: '#2A313C' },
  vitalCluesContainer: { marginTop: Spacing.three },
  cluesRow: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  clueBadge: { paddingVertical: Spacing.one, paddingHorizontal: Spacing.two, borderRadius: Spacing.two },
  clueText: { fontSize: 11, fontFamily: Fonts.ibmPlexBold, color: '#2A313C' },
  answerHeader: { alignItems: 'center', marginVertical: Spacing.two },
  answerStyleName: { fontSize: 20, fontWeight: '800', textAlign: 'center', fontFamily: Fonts.spaceGroteskBold, color: '#0A0C10' },
  answerSection: { marginVertical: Spacing.two },
  examplesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  exampleItem: { paddingVertical: Spacing.one, paddingHorizontal: Spacing.two, borderRadius: Spacing.one, flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  controlsContainer: { gap: Spacing.two, alignItems: 'center', marginTop: Spacing.two },
  answerButtonsRow: { flexDirection: 'row', width: '100%', gap: Spacing.two },
  answerBtn: { flex: 1, borderRadius: Spacing.two, paddingVertical: Spacing.three, alignItems: 'center' },
  btnTextWhite: { color: '#FFFFFF', fontFamily: Fonts.manropeBold },
  nextCardBtn: { width: '100%', borderRadius: Spacing.two, paddingVertical: Spacing.three, alignItems: 'center' },
  btnContentRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, justifyContent: 'center' },

  // Quiz Lobby
  lobbyCard: { padding: Spacing.three, borderRadius: Spacing.three, borderWidth: 1.5 },
  modesContainer: { gap: Spacing.two },
  modeBtn: { padding: Spacing.three, borderRadius: Spacing.two, borderWidth: 1.5 },
  modeBtnHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.half },
  countContainer: { flexDirection: 'row', gap: Spacing.two },
  countBtn: { flex: 1, paddingVertical: Spacing.two, alignItems: 'center', borderRadius: Spacing.two, borderWidth: 1.5 },
  startQuizBtn: { marginTop: Spacing.four, paddingVertical: Spacing.three, borderRadius: Spacing.two, alignItems: 'center' },

  // Quiz Playing
  quizHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.two },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  quizCategoryHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginBottom: Spacing.two },
  quizQuestionCard: { padding: Spacing.three, borderRadius: Spacing.three, borderWidth: 1.5, marginBottom: Spacing.three },
  optionsContainer: { gap: Spacing.two },
  optionBtn: { paddingVertical: Spacing.three, paddingHorizontal: Spacing.three, borderRadius: Spacing.two, borderWidth: 1.5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  optionLetterBadge: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  optionLetterText: { fontSize: 12, fontFamily: Fonts.spaceGroteskBold, fontWeight: '700' },
  explanationContainer: { marginTop: Spacing.three, padding: Spacing.three, borderRadius: Spacing.two, borderWidth: 1.5 },
  nextQuizBtn: { marginTop: Spacing.two, paddingVertical: Spacing.three, borderRadius: Spacing.two, alignItems: 'center' },
  
  // Results
  finalStreakBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingHorizontal: Spacing.four, paddingVertical: Spacing.two, borderRadius: Spacing.two },
});
