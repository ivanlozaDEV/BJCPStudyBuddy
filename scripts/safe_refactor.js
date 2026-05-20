const fs = require('fs');
const path = require('path');

const explorePath = path.join(__dirname, '../src/app/explore.tsx');
const stylePath = path.join(__dirname, '../src/app/style/[id].tsx');

// -------- FIX EXPLORE.TSX --------
let exLines = fs.readFileSync(explorePath, 'utf8').split('\n');

// 1. Delete SRM functions (lines 31-47)
exLines.splice(30, 18); // 30 is index for line 31, remove 18 lines
// Add imports
exLines.splice(13, 0, "import { getSRMColor, getSRMContrastColor } from '@/utils/srm';");

// 2. We need to find the start of `const [detailModalVisible` and the end of `renderTextWithGlossaryLinks`
const stateStart = exLines.findIndex(l => l.includes('const [detailModalVisible, setDetailModalVisible]'));
const logicEnd = exLines.findIndex(l => l.includes('  const renderStyleItem = ({ item }: { item: BeerStyle }) => {'));
exLines.splice(stateStart, logicEnd - stateStart);

// 3. We need to replace setSelectedStyle(...) with router.push('/style/' + item.id)
const onPressStart = exLines.findIndex(l => l.includes('setSelectedStyle(item);'));
if (onPressStart !== -1) {
  exLines[onPressStart] = "          router.push('/style/' + item.id);";
  // The next line is setDetailModalVisible(true);
  exLines.splice(onPressStart + 1, 1);
}

// 4. Delete the modal JSX.
const modalStart = exLines.findIndex(l => l.includes('{/* DETAIL MODAL (Visual Masterpiece Overlay) */}'));
const modalEnd = exLines.findIndex((l, i) => i > modalStart && l.includes('      </Modal>'));
if (modalStart !== -1 && modalEnd !== -1) {
  exLines.splice(modalStart, modalEnd - modalStart + 1);
}

fs.writeFileSync(explorePath, exLines.join('\n'));

// -------- FIX [id].TSX --------
let idLines = fs.readFileSync(stylePath, 'utf8').split('\n');

// 1. Delete SRM functions (lines 31-47)
idLines.splice(30, 18);
idLines.splice(13, 0, "import { getSRMColor, getSRMContrastColor } from '@/utils/srm';");

// 2. Rename component and change useLocalSearchParams
const compStart = idLines.findIndex(l => l.includes('export default function ExploreScreen() {'));
if (compStart !== -1) {
  idLines[compStart] = 'export default function StyleDetailScreen() {';
  // Add params
  idLines.splice(compStart + 1, 0, '  const { id } = useLocalSearchParams<{ id: string }>();');
}

// 3. Replace selectedStyle state with standard const
const styleState = idLines.findIndex(l => l.includes('const [selectedStyle, setSelectedStyle]'));
if (styleState !== -1) {
  idLines[styleState] = '  const selectedStyle = getBJCPStyles(language).find(s => s.id === id);';
}

// 4. Delete search states and filteredStyles logic
const searchStateStart = idLines.findIndex(l => l.includes('const [searchQuery, setSearchQuery]'));
const renderStyleItemEnd = idLines.findIndex(l => l.includes('return (')) - 1; // Find the main return (
if (searchStateStart !== -1 && renderStyleItemEnd !== -1) {
  idLines.splice(searchStateStart, renderStyleItemEnd - searchStateStart);
}

// 5. We need to keep the Detail Modal logic, but replace the main return statement.
const mainReturn = idLines.findIndex(l => l.trim() === 'return (');
const detailModalStart = idLines.findIndex(l => l.includes('{/* DETAIL MODAL (Visual Masterpiece Overlay) */}'));

if (mainReturn !== -1 && detailModalStart !== -1) {
  // Delete from mainReturn to detailModalStart
  idLines.splice(mainReturn, detailModalStart - mainReturn);
}

// 6. Delete the Modal wrapper tags
const newReturnIndex = idLines.findIndex(l => l.includes('{/* DETAIL MODAL (Visual Masterpiece Overlay) */}'));
// It was inside a Modal.
//       <Modal ...>
//         {selectedStyle && (
//           <SafeAreaProvider>
//             <View style={styles.modalContainer}>
//               <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>

idLines.splice(newReturnIndex, 10, 
`  if (!selectedStyle) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.text }}>Style not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.backgroundElement }]} edges={['top', 'bottom']}>
`);

// The close button onPress should be router.back()
const closeBtn = idLines.findIndex(l => l.includes('onPress={() => setDetailModalVisible(false)}'));
if (closeBtn !== -1) {
  idLines[closeBtn] = '                  onPress={() => router.back()}';
}

// Cross reference link should router.push
const crossRef = idLines.findIndex(l => l.includes('setSelectedStyle(linkTargetStyle);'));
if (crossRef !== -1) {
  idLines[crossRef] = "                            router.push('/style/' + linkTargetStyle.id);";
}

// Delete the end of the Modal wrapper tags
const mainReturnEnd = idLines.lastIndexOf('      </Modal>');
if (mainReturnEnd !== -1) {
  idLines.splice(mainReturnEnd - 3, 4, 
`    </SafeAreaView>
  );`);
}

// Delete the rest of explore screen return
const endScreen = idLines.findIndex((l, i) => i > mainReturnEnd && l.includes('    </ThemedView>'));
if (endScreen !== -1) {
  idLines.splice(endScreen - 2, 4); // Remove from {/ThemedView} to }
}

fs.writeFileSync(stylePath, idLines.join('\n'));
