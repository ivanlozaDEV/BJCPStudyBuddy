import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { BeerStyle, BJCP_2021_DATA } from '@/data/bjcp2021';

// SRM Color Mapping Helper for Visual SRM scale on flashcards
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

export default function FlashcardsScreen() {
  const theme = useTheme();

  // Game State
  const [currentStyle, setCurrentStyle] = useState<BeerStyle | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [sessionStyles, setSessionStyles] = useState<BeerStyle[]>([]);
  const [answeredStyles, setAnsweredStyles] = useState<string[]>([]);

  // Initialize new study session
  const startNewSession = () => {
    // Shuffle the styles array
    const shuffled = [...BJCP_2021_DATA].sort(() => Math.random() - 0.5);
    setSessionStyles(shuffled);
    setCurrentStyle(shuffled[0]);
    setIsFlipped(false);
    setScore({ correct: 0, total: 0 });
    setAnsweredStyles([]);
  };

  useEffect(() => {
    startNewSession();
  }, []);

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (knewIt: boolean) => {
    if (!currentStyle) return;

    // Avoid double counting if already answered this specific card
    if (answeredStyles.includes(currentStyle.id)) {
      loadNextCard();
      return;
    }

    setScore(prev => ({
      correct: prev.correct + (knewIt ? 1 : 0),
      total: prev.total + 1
    }));
    
    setAnsweredStyles(prev => [...prev, currentStyle.id]);
    setIsFlipped(true); // Ensure back is visible when answering
  };

  const loadNextCard = () => {
    setIsFlipped(false);
    const currentIndex = sessionStyles.findIndex(s => s.id === currentStyle?.id);
    
    if (currentIndex + 1 < sessionStyles.length) {
      // Load next style in shuffled queue
      setTimeout(() => {
        setCurrentStyle(sessionStyles[currentIndex + 1]);
      }, 150);
    } else {
      // Reached the end of the styles list, restart and shuffle again
      alert('¡Completaste todos los estilos de la sesión! Reiniciando con un nuevo orden aleatorio. 🍻');
      startNewSession();
    }
  };

  if (!currentStyle) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText>Cargando sesión de estudio...</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const cardSrmColor = getSRMColor((currentStyle.srmMin + currentStyle.srmMax) / 2);
  const isCardAnswered = answeredStyles.includes(currentStyle.id);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* Header and Progress Bar */}
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.title}>Estudio Activo</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.scoreText}>
            Puntuación: <ThemedText type="smallBold" style={{ color: theme.tint }}>{score.correct}</ThemedText> de {score.total}
          </ThemedText>
        </View>

        <View style={styles.progressWrapper}>
          <View style={[styles.progressBarTrack, { backgroundColor: theme.backgroundElement }]}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  backgroundColor: theme.tint,
                  width: `${(answeredStyles.length / BJCP_2021_DATA.length) * 100}%` 
                }
              ]} 
            />
          </View>
          <ThemedText type="code" style={styles.progressText}>
            Ficha {answeredStyles.length + 1} de {BJCP_2021_DATA.length}
          </ThemedText>
        </View>

        {/* Scrollable container for cards and buttons */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Main Flashcard Container */}
          <Pressable 
            onPress={handleFlipCard}
            style={({ pressed }) => [
              styles.cardContainer,
              { 
                backgroundColor: theme.backgroundElement,
                borderColor: isFlipped ? theme.tint : 'rgba(128,128,128,0.1)',
                borderWidth: isFlipped ? 2 : 1
              },
              pressed && styles.cardPressed
            ]}
          >
            {/* SRM color stripe at the top */}
            <View style={[styles.cardColorStripe, { backgroundColor: cardSrmColor }]} />

            {!isFlipped ? (
              /* CARD FRONT (The Question) */
              <View style={styles.cardSide}>
                <View style={styles.cardHeader}>
                  <ThemedText type="code" style={[styles.cardBadge, { color: theme.tint }]}>
                    ¿QUÉ ESTILO SOY?
                  </ThemedText>
                  <ThemedText type="smallBold" themeColor="textSecondary">
                    Categoría: {currentStyle.category.replace(/^\d+\.\s+/, '')}
                  </ThemedText>
                </View>

                <View style={styles.questionSection}>
                  <ThemedText type="smallBold" style={styles.cardSectionLabel}>Impresión General:</ThemedText>
                  <ThemedText type="default" style={styles.cardImpression}>
                    {currentStyle.overallImpression}
                  </ThemedText>
                </View>

                {/* Clues (Technical Stats) */}
                <View style={styles.vitalCluesContainer}>
                  <ThemedText type="smallBold" style={styles.cardSectionLabel}>Estadísticas Vitales (Pistas):</ThemedText>
                  
                  <View style={styles.cluesRow}>
                    <View style={[styles.clueBadge, { backgroundColor: theme.backgroundSelected }]}>
                      <ThemedText type="code" style={styles.clueText}>
                        ABV: {currentStyle.vitalStatistics.abv}
                      </ThemedText>
                    </View>
                    <View style={[styles.clueBadge, { backgroundColor: theme.backgroundSelected }]}>
                      <ThemedText type="code" style={styles.clueText}>
                        IBUs: {currentStyle.vitalStatistics.ibu}
                      </ThemedText>
                    </View>
                    <View style={[styles.clueBadge, { backgroundColor: theme.backgroundSelected }]}>
                      <ThemedText type="code" style={styles.clueText}>
                        SRM: {currentStyle.vitalStatistics.srm}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                <View style={styles.tapToFlipPrompt}>
                  <ThemedText type="code" style={{ color: theme.textSecondary }}>
                    👉 Toca la ficha para revelar la respuesta
                  </ThemedText>
                </View>
              </View>
            ) : (
              /* CARD BACK (The Answer) */
              <View style={styles.cardSide}>
                <View style={styles.cardHeader}>
                  <ThemedText type="code" style={[styles.cardBadge, { color: theme.success }]}>
                    ¡RESPUESTA!
                  </ThemedText>
                  <ThemedText type="smallBold" style={[styles.backIdBadge, { color: '#100E0D', backgroundColor: theme.tint }]}>
                    ID: {currentStyle.id}
                  </ThemedText>
                </View>

                <View style={styles.answerHeader}>
                  <ThemedText type="subtitle" style={styles.answerStyleName}>
                    {currentStyle.name}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {currentStyle.category}
                  </ThemedText>
                </View>

                {/* Review commercial examples */}
                <View style={styles.answerSection}>
                  <ThemedText type="smallBold" style={styles.cardSectionLabel}>Ejemplos Comerciales Clave:</ThemedText>
                  <View style={styles.examplesContainer}>
                    {currentStyle.commercialExamples.map((ex, i) => (
                      <View key={i} style={[styles.exampleItem, { backgroundColor: theme.backgroundSelected }]}>
                        <ThemedText type="small">🍺 {ex}</ThemedText>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Additional Study Info */}
                <View style={styles.answerSection}>
                  <ThemedText type="smallBold" style={styles.cardSectionLabel}>Historia/Ingredientes:</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.answerHistory} numberOfLines={4}>
                    {currentStyle.history}
                  </ThemedText>
                </View>

                <View style={styles.tapToFlipPrompt}>
                  <ThemedText type="code" style={{ color: theme.tint }}>
                    👉 Toca para volver a la pregunta
                  </ThemedText>
                </View>
              </View>
            )}
          </Pressable>

          {/* Gamified Action Buttons */}
          <View style={styles.controlsContainer}>
            {!isCardAnswered ? (
              <View style={styles.answerButtonsRow}>
                <Pressable
                  onPress={() => handleAnswer(false)}
                  style={({ pressed }) => [
                    styles.answerBtn,
                    styles.incorrectBtn,
                    pressed && styles.btnPressed
                  ]}
                >
                  <ThemedText type="smallBold" style={styles.btnTextWhite}>
                    ❌ Lo dudé
                  </ThemedText>
                </Pressable>

                <Pressable
                  onPress={() => handleAnswer(true)}
                  style={({ pressed }) => [
                    styles.answerBtn,
                    styles.correctBtn,
                    pressed && styles.btnPressed
                  ]}
                >
                  <ThemedText type="smallBold" style={styles.btnTextWhite}>
                    ✅ ¡Lo sabía!
                  </ThemedText>
                </Pressable>
              </View>
            ) : (
              <View style={styles.nextButtonContainer}>
                <Pressable
                  onPress={loadNextCard}
                  style={({ pressed }) => [
                    styles.nextCardBtn,
                    { backgroundColor: theme.tint },
                    pressed && styles.btnPressed
                  ]}
                >
                  <ThemedText type="smallBold" style={{ color: '#100E0D' }}>
                    Siguiente Ficha ➔
                  </ThemedText>
                </Pressable>
                
                <ThemedText type="code" style={styles.answeredFeedback}>
                  Ficha calificada. ¡Sigue así! 🚀
                </ThemedText>
              </View>
            )}

            {/* Restart Session link */}
            <Pressable onPress={startNewSession} style={styles.restartSessionBtn}>
              <ThemedText type="code" style={{ color: theme.textSecondary, textDecorationLine: 'underline' }}>
                Reiniciar sesión y barajar fichas 🔄
              </ThemedText>
            </Pressable>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  scoreText: {
    fontSize: 14,
  },
  progressWrapper: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    gap: Spacing.half,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 9,
    textAlign: 'right',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: BottomTabInset + Spacing.six,
    gap: Spacing.four,
  },
  cardContainer: {
    borderRadius: Spacing.four,
    minHeight: 380,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    overflow: 'hidden',
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
  },
  cardColorStripe: {
    height: 8,
    width: '100%',
  },
  cardSide: {
    flex: 1,
    padding: Spacing.four,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  cardBadge: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  backIdBadge: {
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.one,
  },
  cardSectionLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
    color: 'rgba(128,128,128,0.7)',
    marginBottom: Spacing.one,
    textTransform: 'uppercase',
  },
  questionSection: {
    flex: 1,
    justifyContent: 'center',
  },
  cardImpression: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  vitalCluesContainer: {
    marginTop: Spacing.three,
  },
  cluesRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  clueBadge: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
  },
  clueText: {
    fontSize: 12,
  },
  tapToFlipPrompt: {
    alignItems: 'center',
    marginTop: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.06)',
    paddingTop: Spacing.two,
  },
  answerHeader: {
    alignItems: 'center',
    marginVertical: Spacing.two,
  },
  answerStyleName: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  answerSection: {
    marginVertical: Spacing.two,
  },
  examplesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  exampleItem: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.one,
  },
  answerHistory: {
    fontSize: 13,
    lineHeight: 18,
  },
  controlsContainer: {
    gap: Spacing.three,
    marginTop: Spacing.two,
    alignItems: 'center',
  },
  answerButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: Spacing.three,
  },
  answerBtn: {
    flex: 1,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  incorrectBtn: {
    backgroundColor: '#8C2E0B', // Rich amber red for mistake
  },
  correctBtn: {
    backgroundColor: '#2D6A4F', // Hop green for success
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  btnTextWhite: {
    color: '#FDFBF7',
  },
  nextButtonContainer: {
    width: '100%',
    gap: Spacing.one,
    alignItems: 'center',
  },
  nextCardBtn: {
    width: '100%',
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  answeredFeedback: {
    fontSize: 10,
    color: '#2D6A4F',
    fontWeight: '700',
    marginTop: Spacing.half,
  },
  restartSessionBtn: {
    marginTop: Spacing.two,
    paddingVertical: Spacing.one,
  },
});
