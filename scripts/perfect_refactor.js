const fs = require('fs');
const path = require('path');

const explorePath = path.join(__dirname, '../src/app/explore.tsx');
const styleScreenPath = path.join(__dirname, '../src/app/style/[id].tsx');
let content = fs.readFileSync(explorePath, 'utf8');

// 1. Extract logic from explore.tsx
// Modals JSX
const modalJSXMatch = content.match(/<Modal[\s\S]*?visible=\{detailModalVisible\}[\s\S]*?<SafeAreaProvider>([\s\S]*?)<\/SafeAreaProvider>[\s\S]*?<\/Modal>/);
const modalJSX = modalJSXMatch ? modalJSXMatch[1] : '';

// Helper functions (renderTextWithStyleLinks etc)
const helpersMatch = content.match(/(const renderTextWithStyleLinks =[\s\S]*?const renderTextWithGlossaryLinks =[\s\S]*?\};\n  \};)/);
let helpers = helpersMatch ? helpersMatch[1] : '';

// The handleXPress functions
const handlersMatch = content.match(/(const handleGlossaryLinkPress =[\s\S]*?return OFF_FLAVORS_DATA\.find\(off => off\.id === termId\);\n  \};)/);
let handlers = handlersMatch ? handlersMatch[1] : '';

// 2. Build [id].tsx content
const idTsxContent = `import React, { useState } from 'react';
import { 
  StyleSheet, 
  Pressable, 
  View, 
  ScrollView, 
  Text
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';

import { DetailIcon } from '@/components/detail-icons';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing, Fonts, BottomTabInset } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/context/language-context';
import { 
  BeerStyle, 
  getBJCPStyles 
} from '@/data/bjcp2021';
import { GLOSSARY_DATA, GlossaryTerm, TAG_DEFINITIONS_DATA, TagDefinition } from '@/data/glossary';
import { OFF_FLAVORS_DATA, OffFlavor } from '@/data/offflavors';
import { getSRMColor, getSRMContrastColor } from '@/utils/srm';

export default function StyleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { t, language } = useTranslation();

  const selectedStyle = getBJCPStyles(language).find(s => s.id === id);

  // Modal States
  const [linkChoiceModalVisible, setLinkChoiceModalVisible] = useState(false);
  const [linkTargetStyle, setLinkTargetStyle] = useState<BeerStyle | null>(null);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<GlossaryTerm | null>(null);
  const [glossaryModalVisible, setGlossaryModalVisible] = useState(false);
  const [selectedOffFlavor, setSelectedOffFlavor] = useState<OffFlavor | null>(null);
  const [offFlavorModalVisible, setOffFlavorModalVisible] = useState(false);

  const handleStyleLinkPress = (targetStyle: BeerStyle, currentStyle: BeerStyle) => {
    setLinkTargetStyle(targetStyle);
    setLinkChoiceModalVisible(true);
  };

  ${handlers}

  ${helpers}

  if (!selectedStyle) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.text }}>Style not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.modalSafeArea, { backgroundColor: '#2F5D73' }]} edges={['top', 'bottom']}>
      ${modalJSX.replace("onPress={() => setDetailModalVisible(false)}", "onPress={() => router.back()}").replace("setSelectedStyle(linkTargetStyle);", "router.push('/style/' + linkTargetStyle.id);")}
    </SafeAreaView>
  );
}

// Extract styles from explore.tsx
${content.match(/const styles = StyleSheet\.create\(\{[\s\S]*?\}\);/)[0]}
`;

fs.writeFileSync(styleScreenPath, idTsxContent);

// 3. Clean up explore.tsx
let newExplore = content.replace("import { useLocalSearchParams, router } from 'expo-router';", "import { useLocalSearchParams, router } from 'expo-router';\nimport { getSRMColor, getSRMContrastColor } from '@/utils/srm';");

// Remove SRM functions
newExplore = newExplore.replace(/\/\/ SRM Color Mapping Helper[\s\S]*?return srm <= 12\.5 \? '#0A0C10' : '#FFFFFF';\n\}/, '');

// Remove modal states
newExplore = newExplore.replace(/const \[detailModalVisible[\s\S]*?setOffFlavorModalVisible\(false\);\n/g, '');

// Remove helpers and handlers
newExplore = newExplore.replace(helpers, '');
newExplore = newExplore.replace(handlers, '');
newExplore = newExplore.replace(/const handleStyleLinkPress =[\s\S]*?setLinkChoiceModalVisible\(true\);\n  \};/, '');

// Change the list press to use router
newExplore = newExplore.replace(/onPress=\{\(\) => \{\n\s*setSelectedStyle\(item\);\n\s*setDetailModalVisible\(true\);\n\s*\}\}/, "onPress={() => { router.push('/style/' + item.id); }}");

// Remove the detail modal JSX
newExplore = newExplore.replace(/\{\/\* DETAIL MODAL \(Visual Masterpiece Overlay\) \*\/\}[\s\S]*?<\/Modal>/, '');

fs.writeFileSync(explorePath, newExplore);
console.log('Perfect refactor complete');
