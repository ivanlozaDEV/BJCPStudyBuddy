const fs = require('fs');
const path = require('path');

const explorePath = path.join(__dirname, '../src/app/explore.tsx');
const styleScreenPath = path.join(__dirname, '../src/app/style/[id].tsx');
const srmPath = path.join(__dirname, '../src/utils/srm.ts');

let srmCode = fs.readFileSync(srmPath, 'utf8');

// -------- CLEAN UP EXPLORE.TSX --------
let exploreCode = fs.readFileSync(explorePath, 'utf8');

// 1. Add SRM import
exploreCode = exploreCode.replace("import { useLocalSearchParams, router } from 'expo-router';", "import { useLocalSearchParams, router } from 'expo-router';\nimport { getSRMColor, getSRMContrastColor } from '@/utils/srm';");

// 2. Remove SRM functions from explore
exploreCode = exploreCode.replace(/\/\/ SRM Color Mapping Helper[\s\S]*?return srm <= 12\.5 \? '#0A0C10' : '#FFFFFF';\n\}/, '');

// 3. Remove Detail Modal states and functions
// Let's replace the whole section from "const [detailModalVisible" up to "return ("
const statesMatch = exploreCode.match(/const \[detailModalVisible[\s\S]*?return \(/);
if (statesMatch) {
  let cleanedStates = `
  // Render Style Item
  const renderStyleItem = ({ item }: { item: BeerStyle }) => {
    const avgSrm = (item.srmMin + item.srmMax) / 2;
    const cardSrmColor = getSRMColor(avgSrm);
    const contrastColor = getSRMContrastColor(avgSrm);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.styleCard,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          pressed && styles.pressed,
        ]}
        onPress={() => {
          router.push('/style/' + item.id);
        }}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.styleBadge, { backgroundColor: cardSrmColor }]}>
            <Text style={[styles.styleBadgeText, { color: contrastColor }]}>{item.id}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{item.name}</Text>
            <Text style={[styles.cardCategory, { color: theme.textSecondary }]}>
              {language === 'es' ? 'Categoría:' : 'Category:'} {item.category}
            </Text>
          </View>
        </View>
        <Text style={[styles.cardSummary, { color: theme.textSecondary }]} numberOfLines={2}>
          {item.overallImpression}
        </Text>
      </Pressable>
    );
  };

  return (`

  // We need to keep the states that ARE used in explore.tsx (search logic)
  const requiredExploreLogic = `
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'id' | 'name' | 'srm' | 'abv' | 'ibu'>('id');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const toggleSearch = () => {
    if (isSearchActive) {
      setIsSearchActive(false);
      setSearchQuery('');
      setDebouncedQuery('');
    } else {
      setIsSearchActive(true);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    searchInputRef.current?.focus();
  };

  const filteredStyles = useMemo(() => {
    let result = getBJCPStyles(language);

    if (selectedCategory !== 'All') {
      result = result.filter(s => s.category === selectedCategory);
    }

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortOrder === 'id') {
        const parseId = (id: string) => {
          const match = id.match(/(\d+)([A-Z])/);
          if (match) {
            return parseInt(match[1]) * 100 + match[2].charCodeAt(0);
          }
          return 9999; 
        };
        return parseId(a.id) - parseId(b.id);
      }
      if (sortOrder === 'name') return a.name.localeCompare(b.name);
      
      const aSrm = (a.srmMin + a.srmMax) / 2;
      const bSrm = (b.srmMin + b.srmMax) / 2;
      if (sortOrder === 'srm') return aSrm - bSrm;

      const getNum = (str: string) => parseFloat(str) || 0;
      if (sortOrder === 'abv') return getNum(a.vitalStatistics.abv) - getNum(b.vitalStatistics.abv);
      if (sortOrder === 'ibu') return getNum(a.vitalStatistics.ibu) - getNum(b.vitalStatistics.ibu);
      
      return 0;
    });

    return result;
  }, [debouncedQuery, selectedCategory, sortOrder, language]);
` + cleanedStates;

  exploreCode = exploreCode.replace(statesMatch[0], requiredExploreLogic);
}

// 4. Remove Modal JSX from explore.tsx
// From "{/* DETAIL MODAL (Visual Masterpiece Overlay) */}" to "</Modal>"
// But there are multiple modals in the file. They were inside a <SafeAreaProvider> wrapping the <View style={styles.modalContainer}> ... </SafeAreaProvider> ... </Modal>
exploreCode = exploreCode.replace(/\{\/\* DETAIL MODAL \(Visual Masterpiece Overlay\) \*\/\}[\s\S]*?<\/Modal>/, '');

fs.writeFileSync(explorePath, exploreCode);

// -------- CLEAN UP [id].tsx --------
let detailCode = fs.readFileSync(styleScreenPath, 'utf8');

// Rename component
detailCode = detailCode.replace('export default function ExploreScreen() {', 'export default function StyleDetailScreen() {\n  const { id } = useLocalSearchParams<{ id: string }>();');

// Change import
detailCode = detailCode.replace("import { useLocalSearchParams, router } from 'expo-router';", "import { useLocalSearchParams, router } from 'expo-router';\nimport { getSRMColor, getSRMContrastColor } from '@/utils/srm';");

// Replace selectedStyle state with local variable
detailCode = detailCode.replace(/const \[selectedStyle, setSelectedStyle\] = useState<BeerStyle \| null>\(null\);/, 'const selectedStyle = getBJCPStyles(language).find(s => s.id === id);');

// Remove search states
detailCode = detailCode.replace(/const \[searchQuery[\s\S]*?const filteredStyles = useMemo[\s\S]*?return result;\n  \}, \[.*?\]\);/m, '');

// We want the return to JUST be the modal content!
const modalMatch = detailCode.match(/\{\/\* DETAIL MODAL \(Visual Masterpiece Overlay\) \*\/\}[\s\S]*?<Modal[\s\S]*?>\s*\{selectedStyle && \([\s\S]*?<SafeAreaProvider>([\s\S]*?)<\/SafeAreaProvider>\s*\)\}\s*<\/Modal>/);

if (modalMatch) {
  let modalContent = modalMatch[1];
  
  // Clean up the modal close button to use router.back()
  modalContent = modalContent.replace("onPress={() => setDetailModalVisible(false)}", "onPress={() => router.back()}");
  
  // Render only this
  let returnReplacement = `
  if (!selectedStyle) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.text }}>Style not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.modalSafeArea, { backgroundColor: '#2F5D73' }]} edges={['top', 'bottom']}>
      ${modalContent}
    </SafeAreaView>
  );
  `;
  
  const returnMatch = detailCode.match(/return \([\s\S]*?\n\}/);
  if (returnMatch) {
    detailCode = detailCode.replace(returnMatch[0], returnReplacement + '\n}');
  }
}

// Ensure handleStyleLinkPress sets target correctly
detailCode = detailCode.replace(/const handleStyleLinkPress =[\s\S]*?setLinkChoiceModalVisible\(true\);\n  \};/, `const handleStyleLinkPress = (targetStyle: BeerStyle, currentStyle: BeerStyle) => {
    setLinkTargetStyle(targetStyle);
    setLinkChoiceModalVisible(true);
  };`);

// Remove old unused imports and styles in both files if we wanted to be perfectly clean,
// but they won't break anything. We'll leave them to save time.

fs.writeFileSync(styleScreenPath, detailCode);

console.log('Cleanup successful');
