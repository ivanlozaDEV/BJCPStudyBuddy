import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Line, Polyline, Circle } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing, Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/context/language-context';
import { BeerStyle, getBJCPStyles } from '@/data/bjcp2021';
import { generateQuiz, QuizMode, QuizQuestion } from '@/data/quiz-generator';

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

export default function FlashcardsScreen() {
  const theme = useTheme();
  const { language } = useTranslation();

  // Mode Selection
  const [studyMode, setStudyMode] = useState<StudyMode>('quiz');

  // ==========================================
  // FLASHCARDS STATE
  // ==========================================
  const [currentStyle, setCurrentStyle] = useState<BeerStyle | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [fcScore, setFcScore] = useState({ correct: 0, total: 0 });
  const [sessionStyles, setSessionStyles] = useState<BeerStyle[]>([]);
  const [answeredStyles, setAnsweredStyles] = useState<string[]>([]);

  // ==========================================
  // QUIZ STATE
  // ==========================================
  const [quizState, setQuizState] = useState<QuizState>('lobby');
  const [quizMode, setQuizMode] = useState<QuizMode>('mixed');
  const [quizCount, setQuizCount] = useState<number>(10);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const startNewFlashcardSession = () => {
    const stylesList = getBJCPStyles(language);
    const shuffled = [...stylesList].sort(() => Math.random() - 0.5);
    setSessionStyles(shuffled);
    setCurrentStyle(shuffled[0]);
    setIsFlipped(false);
    setFcScore({ correct: 0, total: 0 });
    setAnsweredStyles([]);
  };

  useEffect(() => {
    startNewFlashcardSession();
  }, [language]);

  const handleFlipCard = () => setIsFlipped(!isFlipped);
  const handleFcAnswer = (knewIt: boolean) => {
    if (!currentStyle) return;
    if (answeredStyles.includes(currentStyle.id)) {
      loadNextFcCard();
      return;
    }
    setFcScore(prev => ({ correct: prev.correct + (knewIt ? 1 : 0), total: prev.total + 1 }));
    setAnsweredStyles(prev => [...prev, currentStyle.id]);
    setIsFlipped(true);
  };
  
  const loadNextFcCard = () => {
    setIsFlipped(false);
    const currentIndex = sessionStyles.findIndex(s => s.id === currentStyle?.id);
    if (currentIndex + 1 < sessionStyles.length) {
      setTimeout(() => setCurrentStyle(sessionStyles[currentIndex + 1]), 150);
    } else {
      Alert.alert(language === 'es' ? '¡Sesión Completada!' : 'Session Completed!');
      startNewFlashcardSession();
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
        style={[styles.toggleBtn, studyMode === 'flashcards' && { backgroundColor: theme.tint, borderColor: theme.tint }]}
        onPress={() => setStudyMode('flashcards')}
      >
        <ThemedText style={{ color: studyMode === 'flashcards' ? '#FFF' : theme.text, fontSize: 14, fontWeight: '700' }}>
          Flashcards
        </ThemedText>
      </Pressable>
      <Pressable 
        style={[styles.toggleBtn, studyMode === 'quiz' && { backgroundColor: theme.tint, borderColor: theme.tint }]}
        onPress={() => setStudyMode('quiz')}
      >
        <ThemedText style={{ color: studyMode === 'quiz' ? '#FFF' : theme.text, fontSize: 14, fontWeight: '700' }}>
          Quiz Activo
        </ThemedText>
      </Pressable>
    </View>
  );

  const renderFlashcards = () => {
    if (!currentStyle) return null;
    const cardSrmColor = getSRMColor((currentStyle.srmMin + currentStyle.srmMax) / 2);
    const isCardAnswered = answeredStyles.includes(currentStyle.id);

    return (
      <>
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.title}>Estudio Libre</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Progreso: <ThemedText type="smallBold" style={{ color: theme.tint }}>{answeredStyles.length}</ThemedText>/{sessionStyles.length}
          </ThemedText>
        </View>

        <View style={styles.progressWrapper}>
          <View style={[styles.progressBarTrack, { backgroundColor: theme.backgroundElement }]}>
            <View style={[styles.progressBarFill, { backgroundColor: theme.tint, width: `${(answeredStyles.length / (sessionStyles.length || 1)) * 100}%` }]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Pressable 
            onPress={handleFlipCard}
            style={({ pressed }) => [
              styles.cardContainer,
              { backgroundColor: theme.backgroundElement, borderColor: isFlipped ? theme.tint : theme.border, borderWidth: isFlipped ? 2 : 1 },
              pressed && styles.cardPressed
            ]}
          >
            <View style={[styles.cardColorStripe, { backgroundColor: cardSrmColor }]} />

            {!isFlipped ? (
              <View style={styles.cardSide}>
                <View style={styles.cardHeader}>
                  <ThemedText type="code" style={[styles.cardBadge, { color: theme.tint }]}>¿QUÉ ESTILO SOY?</ThemedText>
                  <ThemedText type="smallBold" themeColor="textSecondary">Cat: {currentStyle.category.replace(/^\d+\.\s+/, '')}</ThemedText>
                </View>
                <View style={styles.questionSection}>
                  <ThemedText type="smallBold" style={styles.cardSectionLabel}>Impresión General:</ThemedText>
                  <ThemedText type="default" style={styles.cardImpression}>{currentStyle.overallImpression}</ThemedText>
                </View>
                <View style={styles.vitalCluesContainer}>
                  <ThemedText type="smallBold" style={styles.cardSectionLabel}>Estadísticas Vitales:</ThemedText>
                  <View style={styles.cluesRow}>
                    <View style={[styles.clueBadge, { backgroundColor: theme.backgroundSelected }]}><ThemedText type="code" style={styles.clueText}>ABV: {currentStyle.vitalStatistics.abv}</ThemedText></View>
                    <View style={[styles.clueBadge, { backgroundColor: theme.backgroundSelected }]}><ThemedText type="code" style={styles.clueText}>IBUs: {currentStyle.vitalStatistics.ibu}</ThemedText></View>
                    <View style={[styles.clueBadge, { backgroundColor: theme.backgroundSelected }]}><ThemedText type="code" style={styles.clueText}>SRM: {currentStyle.vitalStatistics.srm}</ThemedText></View>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.cardSide}>
                <View style={styles.cardHeader}>
                  <ThemedText type="code" style={[styles.cardBadge, { color: theme.success }]}>ESTILO REVELADO</ThemedText>
                  <ThemedText type="smallBold" style={[styles.backIdBadge, { color: '#FFF', backgroundColor: theme.tint }]}>ID: {currentStyle.id}</ThemedText>
                </View>
                <View style={styles.answerHeader}>
                  <ThemedText type="subtitle" style={styles.answerStyleName}>{currentStyle.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">{currentStyle.category}</ThemedText>
                </View>
                <View style={styles.answerSection}>
                  <ThemedText type="smallBold" style={styles.cardSectionLabel}>Ejemplos Comerciales:</ThemedText>
                  <View style={styles.examplesContainer}>
                    {currentStyle.commercialExamples.map((ex, i) => (
                      <View key={i} style={[styles.exampleItem, { backgroundColor: theme.backgroundSelected }]}>
                        <QuizIcon name="styles" color={theme.textSecondary} size={12} />
                        <ThemedText type="small">{ex}</ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </Pressable>

          <View style={styles.controlsContainer}>
            {!isCardAnswered ? (
              <View style={styles.answerButtonsRow}>
                <Pressable onPress={() => handleFcAnswer(false)} style={[styles.answerBtn, styles.incorrectBtn]}>
                  <View style={styles.btnContentRow}>
                    <QuizIcon name="cross" color="#FFF" size={16} />
                    <ThemedText type="smallBold" style={styles.btnTextWhite}>Lo dudé</ThemedText>
                  </View>
                </Pressable>
                <Pressable onPress={() => handleFcAnswer(true)} style={[styles.answerBtn, styles.correctBtn]}>
                  <View style={styles.btnContentRow}>
                    <QuizIcon name="check" color="#FFF" size={16} />
                    <ThemedText type="smallBold" style={styles.btnTextWhite}>¡Lo sabía!</ThemedText>
                  </View>
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={loadNextFcCard} style={[styles.nextCardBtn, { backgroundColor: theme.tint }]}>
                <View style={styles.btnContentRow}>
                  <ThemedText type="smallBold" style={{ color: '#FFF' }}>Siguiente Ficha</ThemedText>
                  <QuizIcon name="arrow" color="#FFF" size={16} />
                </View>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </>
    );
  };

  const renderQuizLobby = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <ThemedView style={[styles.lobbyCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <ThemedText type="title" style={{ textAlign: 'center', marginBottom: Spacing.four }}>BJCP Quiz</ThemedText>
        
        <ThemedText type="default" style={{ fontWeight: '600', marginBottom: Spacing.two }}>Modo de Estudio:</ThemedText>
        <View style={styles.modesContainer}>
          {[
            { id: 'mixed', label: 'Mixto (Todos)', desc: 'Examen simulado integral', icon: 'mixed' },
            { id: 'styles', label: 'Estilos', desc: 'Adivina estilos, IBU, ABV', icon: 'styles' },
            { id: 'glossary', label: 'Glosario', desc: 'Términos técnicos', icon: 'glossary' },
            { id: 'tags', label: 'Etiquetas', desc: 'Etiquetas BJCP', icon: 'tags' },
            { id: 'offflavors', label: 'Off-Flavors', desc: 'Defectos y causas', icon: 'offflavors' },
          ].map(m => (
            <Pressable 
              key={m.id}
              onPress={() => setQuizMode(m.id as QuizMode)}
              style={[styles.modeBtn, { borderColor: theme.border }, quizMode === m.id && { borderColor: theme.tint, backgroundColor: 'rgba(47, 93, 115, 0.08)' }]}
            >
              <View style={styles.modeBtnHeader}>
                <QuizIcon name={m.icon} color={quizMode === m.id ? theme.tint : theme.text} size={18} />
                <ThemedText style={{ fontWeight: '700', color: quizMode === m.id ? theme.tint : theme.text }}>{m.label}</ThemedText>
              </View>
              <ThemedText type="small" themeColor="textSecondary" style={{ marginLeft: 26 }}>{m.desc}</ThemedText>
            </Pressable>
          ))}
        </View>

        <ThemedText type="default" style={{ fontWeight: '600', marginTop: Spacing.four, marginBottom: Spacing.two }}>Cantidad de Preguntas:</ThemedText>
        <View style={styles.countContainer}>
          {[5, 10, 20, 50].map(c => (
            <Pressable
              key={c}
              onPress={() => setQuizCount(c)}
              style={[styles.countBtn, { borderColor: theme.border }, quizCount === c && { backgroundColor: theme.tint, borderColor: theme.tint }]}
            >
              <ThemedText style={{ color: quizCount === c ? '#FFF' : theme.text, fontWeight: '700' }}>{c}</ThemedText>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={startQuiz} style={[styles.startQuizBtn, { backgroundColor: theme.tint }]}>
          <View style={styles.btnContentRow}>
            <ThemedText style={{ color: '#FFF', fontWeight: '800', fontSize: 16 }}>Comenzar Quiz</ThemedText>
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.quizHeader}>
          <ThemedText type="default" style={{ fontWeight: '600', color: theme.textSecondary }}>Pregunta {currentQuestionIndex + 1} / {questions.length}</ThemedText>
          <View style={styles.streakBadge}>
            <QuizIcon name="fire" color={streak > 0 ? '#C45B0E' : theme.textSecondary} size={16} />
            <ThemedText type="default" style={{ fontWeight: '600', color: streak > 0 ? '#C45B0E' : theme.textSecondary }}>Racha: {streak}</ThemedText>
          </View>
        </View>
        
        <View style={[styles.progressBarTrack, { backgroundColor: theme.backgroundElement, marginBottom: Spacing.four, borderColor: theme.border, borderWidth: 1 }]}>
          <View style={[styles.progressBarFill, { backgroundColor: theme.tint, width: `${((currentQuestionIndex) / questions.length) * 100}%` }]} />
        </View>

        <ThemedView style={[styles.quizQuestionCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <View style={styles.quizCategoryHeader}>
            <QuizIcon name={q.category} color={theme.tint} size={16} />
            <ThemedText type="smallBold" style={{ color: theme.tint, textTransform: 'uppercase' }}>
              {q.category === 'mixed' ? 'General' : q.category}
            </ThemedText>
          </View>
          <ThemedText style={{ fontSize: 18, lineHeight: 26, fontWeight: '600' }}>{q.question}</ThemedText>
        </ThemedView>

        <View style={styles.optionsContainer}>
          {q.options.map((opt, i) => {
            const isCorrectOption = opt === q.options[q.correctIndex];
            const isSelected = selectedOption === opt;
            
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
                bgColor = '#8C2E0B'; // Muted Red
                borderColor = '#8C2E0B';
                textColor = '#FFF';
                iconName = 'cross';
              } else {
                // Dim other unselected incorrect options
                bgColor = 'transparent';
                borderColor = 'transparent';
                textColor = theme.textSecondary;
              }
            } else if (isSelected) {
              borderColor = theme.tint;
            }

            return (
              <Pressable 
                key={i} 
                onPress={() => handleQuizAnswer(opt)}
                style={[styles.optionBtn, { backgroundColor: bgColor, borderColor }]}
              >
                <ThemedText style={{ color: textColor, fontSize: 15, fontWeight: '500', flex: 1 }}>{opt}</ThemedText>
                {iconName !== '' && <QuizIcon name={iconName} color="#FFF" size={18} />}
              </Pressable>
            );
          })}
        </View>

        {hasAnswered && (
          <View style={[styles.explanationContainer, { backgroundColor: 'rgba(47, 93, 115, 0.08)', borderColor: theme.tint }]}>
            <ThemedText style={{ fontSize: 14, fontStyle: 'italic', color: theme.text, lineHeight: 22 }}>{q.explanation}</ThemedText>
            <Pressable onPress={nextQuizQuestion} style={[styles.nextQuizBtn, { backgroundColor: theme.tint }]}>
              <View style={styles.btnContentRow}>
                <ThemedText style={{ color: '#FFF', fontWeight: '700' }}>
                  {currentQuestionIndex + 1 === questions.length ? 'Ver Resultados' : 'Siguiente'}
                </ThemedText>
                <QuizIcon name={currentQuestionIndex + 1 === questions.length ? 'award' : 'arrow'} color="#FFF" size={16} />
              </View>
            </Pressable>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderQuizResults = () => {
    const percentage = Math.round((quizScore / questions.length) * 100);
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={[styles.lobbyCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border, alignItems: 'center', paddingVertical: Spacing.six }]}>
          <QuizIcon name="award" color={percentage >= 80 ? theme.success : theme.tint} size={64} />
          
          <ThemedText type="title" style={{ marginVertical: Spacing.four }}>Resultados Finales</ThemedText>
          
          <ThemedText style={{ fontSize: 56, fontWeight: '900', color: percentage >= 80 ? theme.success : theme.tint, marginVertical: Spacing.two }}>
            {percentage}%
          </ThemedText>
          
          <ThemedText type="subtitle" style={{ color: theme.textSecondary, marginBottom: Spacing.four }}>
            {quizScore} de {questions.length} respuestas correctas
          </ThemedText>
          
          <View style={styles.finalStreakBadge}>
            <QuizIcon name="fire" color="#C45B0E" size={24} />
            <ThemedText type="default" style={{ fontWeight: '700', fontSize: 18 }}>
              Racha Máxima: {maxStreak}
            </ThemedText>
          </View>

          <Pressable onPress={() => setQuizState('lobby')} style={[styles.startQuizBtn, { backgroundColor: theme.tint, width: '100%', marginTop: Spacing.five }]}>
            <ThemedText style={{ color: '#FFF', fontWeight: '800', fontSize: 16 }}>Volver al Menú</ThemedText>
          </Pressable>
        </ThemedView>
      </ScrollView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
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
  container: { flex: 1, justifyContent: 'center', flexDirection: 'row' },
  safeArea: { flex: 1, maxWidth: MaxContentWidth },
  toggleContainer: { flexDirection: 'row', padding: Spacing.four, gap: Spacing.two },
  toggleBtn: { flex: 1, paddingVertical: Spacing.two, alignItems: 'center', borderRadius: Spacing.two, borderWidth: 1, borderColor: 'rgba(128,128,128,0.2)' },
  
  // Flashcards
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.four },
  title: { fontSize: 24, fontWeight: '800' },
  progressWrapper: { paddingHorizontal: Spacing.four, paddingVertical: Spacing.two },
  progressBarTrack: { height: 8, borderRadius: 4, width: '100%', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  scrollContent: { paddingHorizontal: Spacing.four, paddingBottom: BottomTabInset + Spacing.six, gap: Spacing.four },
  
  cardContainer: { borderRadius: Spacing.four, minHeight: 380, elevation: 4, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  cardPressed: { transform: [{ scale: 0.99 }] },
  cardColorStripe: { height: 8, width: '100%' },
  cardSide: { flex: 1, padding: Spacing.four },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.three },
  cardBadge: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  backIdBadge: { fontSize: 12, fontWeight: '900', paddingHorizontal: Spacing.two, borderRadius: Spacing.one },
  cardSectionLabel: { fontSize: 11, color: 'rgba(128,128,128,0.7)', marginBottom: Spacing.one, textTransform: 'uppercase' },
  questionSection: { flex: 1, justifyContent: 'center' },
  cardImpression: { fontSize: 15, lineHeight: 22 },
  vitalCluesContainer: { marginTop: Spacing.three },
  cluesRow: { flexDirection: 'row', gap: Spacing.two },
  clueBadge: { paddingVertical: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: Spacing.two },
  clueText: { fontSize: 12 },
  answerHeader: { alignItems: 'center', marginVertical: Spacing.two },
  answerStyleName: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  answerSection: { marginVertical: Spacing.two },
  examplesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  exampleItem: { paddingVertical: Spacing.one, paddingHorizontal: Spacing.two, borderRadius: Spacing.one, flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  controlsContainer: { gap: Spacing.three, alignItems: 'center' },
  answerButtonsRow: { flexDirection: 'row', width: '100%', gap: Spacing.three },
  answerBtn: { flex: 1, borderRadius: Spacing.three, paddingVertical: Spacing.three, alignItems: 'center' },
  incorrectBtn: { backgroundColor: '#8C2E0B' },
  correctBtn: { backgroundColor: '#2D6A4F' },
  btnTextWhite: { color: '#FDFBF7' },
  nextCardBtn: { width: '100%', borderRadius: Spacing.three, paddingVertical: Spacing.three, alignItems: 'center' },
  btnContentRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, justifyContent: 'center' },

  // Quiz Lobby
  lobbyCard: { padding: Spacing.four, borderRadius: Spacing.three, borderWidth: 1 },
  modesContainer: { gap: Spacing.two },
  modeBtn: { padding: Spacing.three, borderRadius: Spacing.two, borderWidth: 1 },
  modeBtnHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.half },
  countContainer: { flexDirection: 'row', gap: Spacing.two },
  countBtn: { flex: 1, paddingVertical: Spacing.two, alignItems: 'center', borderRadius: Spacing.two, borderWidth: 1 },
  startQuizBtn: { marginTop: Spacing.five, paddingVertical: Spacing.three, borderRadius: Spacing.two, alignItems: 'center' },

  // Quiz Playing
  quizHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.two },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  quizCategoryHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginBottom: Spacing.two },
  quizQuestionCard: { padding: Spacing.four, borderRadius: Spacing.three, borderWidth: 1, marginBottom: Spacing.four },
  optionsContainer: { gap: Spacing.two },
  optionBtn: { padding: Spacing.four, borderRadius: Spacing.two, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  explanationContainer: { marginTop: Spacing.four, padding: Spacing.four, borderRadius: Spacing.two, borderWidth: 1 },
  nextQuizBtn: { marginTop: Spacing.three, paddingVertical: Spacing.three, borderRadius: Spacing.two, alignItems: 'center' },
  
  // Results
  finalStreakBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, backgroundColor: 'rgba(196, 91, 14, 0.1)', paddingHorizontal: Spacing.four, paddingVertical: Spacing.two, borderRadius: Spacing.two },
});
