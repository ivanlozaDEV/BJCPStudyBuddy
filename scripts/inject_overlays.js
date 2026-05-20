const fs = require('fs');
const path = require('path');

const oldExplorePath = path.join(__dirname, 'old.tsx');
const styleScreenPath = path.join(__dirname, '../src/app/style/[id].tsx');

const oldTsx = fs.readFileSync(oldExplorePath, 'utf8');

// Find the overlays
const startMarker = '{/* Dynamic Link Choice Modal Overlay (Inside Main Modal) */}';
const endMarker = '            </View>\n          </SafeAreaProvider>\n        )}\n      </Modal>';

const startIdx = oldTsx.indexOf(startMarker);
const endIdx = oldTsx.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  let overlays = oldTsx.substring(startIdx, endIdx);
  // Need to fix setSelectedStyle(linkTargetStyle) -> router.push('/style/' + linkTargetStyle.id);
  overlays = overlays.replace(/setSelectedStyle\(linkTargetStyle\);/g, "router.push('/style/' + linkTargetStyle.id);");
  // Need to fix setDetailModalVisible(false);
  overlays = overlays.replace(/setDetailModalVisible\(false\);/g, "router.back();");

  let idTsx = fs.readFileSync(styleScreenPath, 'utf8');
  
  // Find where to inject
  const injectMarker = '            </SafeAreaView>\n      </View>\n    </SafeAreaProvider>';
  const targetIdx = idTsx.indexOf(injectMarker);
  
  if (targetIdx !== -1) {
    const newIdTsx = idTsx.substring(0, targetIdx) + 
                     '            </SafeAreaView>\n\n            ' + 
                     overlays + '\n' +
                     '      </View>\n    </SafeAreaProvider>' + 
                     idTsx.substring(targetIdx + injectMarker.length);
    fs.writeFileSync(styleScreenPath, newIdTsx);
    console.log('Overlays injected successfully');
  } else {
    console.log('Target injection marker not found in [id].tsx');
  }
} else {
  console.log('Overlays not found in old.tsx');
}
