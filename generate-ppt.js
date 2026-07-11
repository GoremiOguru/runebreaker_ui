import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();

// Set slide dimensions (16:9 widescreen layout)
pptx.layout = 'LAYOUT_16x9';

// Define Color Scheme
const BG_COLOR = '0F172A'; // Deep Slate
const TEXT_COLOR = 'F1F5F9'; // Gray-100
const ACCENT_GOLD = 'F59E0B'; // Amber Gold
const MUTED_COLOR = '94A3B8'; // Muted Slate
const CODE_BG = '1E293B'; // Dark Slate for code block
const BORDER_COLOR = 'D97706'; // Amber outline

// Helper to apply standard background
function applyBaseSlide(titleText) {
  const slide = pptx.addSlide();
  // Set dark background
  slide.background = { fill: BG_COLOR };
  
  // Slide Header Title
  slide.addText(titleText, {
    x: 0.5,
    y: 0.4,
    w: 9.0,
    h: 0.6,
    fontSize: 22,
    bold: true,
    color: ACCENT_GOLD,
    fontFace: 'Georgia'
  });
  
  // Footer text
  slide.addText("Runebreaker Combat Dashboard • Witcher Guild Submission", {
    x: 0.5,
    y: 5.2,
    w: 9.0,
    h: 0.3,
    fontSize: 9,
    color: MUTED_COLOR,
    fontFace: 'Courier New',
    align: 'center'
  });
  
  return slide;
}

// ----------------------------------------------------
// SLIDE 1: Concept & Setup (Part 1)
// ----------------------------------------------------
const slide1 = pptx.addSlide();
slide1.background = { fill: BG_COLOR };

// Main Title
slide1.addText("Runebreaker: The Active-Time Bestiary UI", {
  x: 0.5, y: 0.6, w: 9.0, h: 0.7,
  fontSize: 26, bold: true, color: ACCENT_GOLD, fontFace: 'Georgia'
});
slide1.addText("Simulated Real-Time Combat in State-Driven Interfaces", {
  x: 0.5, y: 1.2, w: 9.0, h: 0.3,
  fontSize: 13, italic: true, color: BORDER_COLOR, fontFace: 'Arial'
});

// Left: Content & Pitch
slide1.addText([
  { text: "The Pitch:\n", options: { bold: true, color: ACCENT_GOLD, fontSize: 13 } },
  { text: "A high-intensity, UI-driven tactical RPG prototype focusing on preparation and reflex-based combat.\n\n", options: { color: TEXT_COLOR, fontSize: 11 } },
  { text: "Project Narrative Summary:\n", options: { bold: true, color: ACCENT_GOLD, fontSize: 13 } },
  { text: "Runebreaker demonstrates how real-time danger can be simulated cleanly in a web interface using React's state-driven intervals rather than high-overhead canvas rendering. By binding a background useEffect timer loop to active combat state, the dashboard forces immediate player reactions while tracking health pools dynamically. This design shifts RPG gameplay from passive stat-checking to reflex-based tactical clicks, establishing a lightweight, responsive framework for browser-based action-RPG interfaces.", options: { color: TEXT_COLOR, fontSize: 11 } }
], {
  x: 0.5, y: 1.8, w: 5.5, h: 3.2,
  fontFace: 'Arial',
  lineSpacing: 16
});

// Right: Moodboard Description Box
slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 6.3, y: 1.8, w: 3.2, h: 3.2,
  fill: '1E293B',
  line: { color: BORDER_COLOR, width: 1.5 }
});
slide1.addText([
  { text: "🎬 MOODBOARD DIRECTIONS\n\n", options: { bold: true, color: ACCENT_GOLD, fontSize: 11 } },
  { text: "• Dark Medieval Textures:\n", options: { bold: true, color: TEXT_COLOR, fontSize: 10 } },
  { text: "Grimy stone brick wall overlays for screen containers.\n\n", options: { color: MUTED_COLOR, fontSize: 9 } },
  { text: "• Neon Magic Accents:\n", options: { bold: true, color: TEXT_COLOR, fontSize: 10 } },
  { text: "Glowing orange rune symbols (Igni) and cyan barriers (Quen).\n\n", options: { color: MUTED_COLOR, fontSize: 9 } },
  { text: "• Action Health Bars:\n", options: { bold: true, color: TEXT_COLOR, fontSize: 10 } },
  { text: "Vibrant red and green transitioning gradients indicating live health levels.", options: { color: MUTED_COLOR, fontSize: 9 } }
], {
  x: 6.4, y: 1.9, w: 3.0, h: 3.0,
  fontFace: 'Arial'
});


// ----------------------------------------------------
// SLIDE 2: Industry Research (Part 2)
// ----------------------------------------------------
const slide2 = applyBaseSlide("Industry Research: Witcher 3 Preparation Menus");

// Left Column: Inspiration Box
slide2.addShape(pptx.shapes.RECTANGLE, {
  x: 0.5, y: 1.2, w: 4.0, h: 3.8,
  fill: '1E293B',
  line: { color: BORDER_COLOR, width: 1.0 }
});
slide2.addText([
  { text: "🎮 CORE INSPIRATION DETAILS\n\n", options: { bold: true, color: ACCENT_GOLD, fontSize: 13 } },
  { text: "• Bestiary Pre-study:\n", options: { bold: true, color: TEXT_COLOR, fontSize: 11 } },
  { text: "Forcing players to read about monsters before engaging, turning knowledge into weapon efficiency.\n\n", options: { color: MUTED_COLOR, fontSize: 10 } },
  { text: "• Dynamic Preparations:\n", options: { bold: true, color: TEXT_COLOR, fontSize: 11 } },
  { text: "Applying specific oils to physical blades and slotting sign magic to combat specific weaknesses.\n\n", options: { color: MUTED_COLOR, fontSize: 10 } },
  { text: "• Action Translation:\n", options: { bold: true, color: TEXT_COLOR, fontSize: 11 } },
  { text: "Combining pre-game prep with active combat response clickers directly in the UI dashboard.", options: { color: MUTED_COLOR, fontSize: 10 } }
], {
  x: 0.7, y: 1.4, w: 3.6, h: 3.4,
  fontFace: 'Arial'
});

// Right Column: The 150-Word Analysis
slide2.addText([
  { text: "Core Design Inspiration Analysis:\n", options: { bold: true, color: ACCENT_GOLD, fontSize: 13 } },
  { text: "The core design inspiration for Runebreaker stems from The Witcher 3's preparation menus. The Witcher utilizes crisp iconography and explicit monster vulnerability data to force tactical decision-making before an encounter, teaching players that knowledge is as vital as reflexes.\n\n", options: { color: TEXT_COLOR, fontSize: 11 } },
  { text: "Runebreaker translates this philosophy into a lightweight web dashboard. Instead of relying on a complex 3D engine, this prototype encapsulates prep menus into an interactive grid of Runes and Oils, immediately followed by a live active-time clicker layout.\n\n", options: { color: TEXT_COLOR, fontSize: 11 } },
  { text: "In the Prep Phase, players are forced to match the Swamp Hag's weakness (Igni Rune and Necrophage Oil) to survive. Once the hunt begins, the UI shifts from static data checking to active tension. This combination proves that clean web dashboards can capture the mechanical depth of AAA games, maximizing user engagement by linking pre-game planning directly to real-time success.", options: { color: TEXT_COLOR, fontSize: 11 } }
], {
  x: 4.8, y: 1.2, w: 4.7, h: 3.8,
  fontFace: 'Arial',
  lineSpacing: 15
});


// ----------------------------------------------------
// SLIDE 3: GDD & System Loop (Part 3 - Mandatory 1)
// ----------------------------------------------------
const slide3 = applyBaseSlide("GDD & Core Gameplay System Loop");

// Left Side: Core Loop Flowchart
slide3.addShape(pptx.shapes.RECTANGLE, {
  x: 0.5, y: 1.2, w: 4.2, h: 3.8,
  fill: '1E293B',
  line: { color: BORDER_COLOR, width: 1.0 }
});
slide3.addText([
  { text: "🔄 CORE GAMEPLAY LOOP\n\n", options: { bold: true, color: ACCENT_GOLD, fontSize: 12 } },
  { text: "1. Prep Screen: Select Loadout\n", options: { bold: true, color: TEXT_COLOR, fontSize: 10 } },
  { text: "   └ Select Runes (Igni/Quen) and Blade Oils.\n\n", options: { color: MUTED_COLOR, fontSize: 9 } },
  { text: "2. Combat Screen: Active Loop\n", options: { bold: true, color: TEXT_COLOR, fontSize: 10 } },
  { text: "   └ Enemy interval triggers auto-damage every 1.5s.\n\n", options: { color: MUTED_COLOR, fontSize: 9 } },
  { text: "3. Player Strike Actions\n", options: { bold: true, color: TEXT_COLOR, fontSize: 10 } },
  { text: "   └ Silver Slash & Rune Blast calculations.\n\n", options: { color: MUTED_COLOR, fontSize: 9 } },
  { text: "4. State Evaluation Condition\n", options: { bold: true, color: TEXT_COLOR, fontSize: 10 } },
  { text: "   └ Evaluate HP pools for Victory or Game Over.\n\n", options: { color: MUTED_COLOR, fontSize: 9 } },
  { text: "5. Game Reset Trigger\n", options: { bold: true, color: TEXT_COLOR, fontSize: 10 } },
  { text: "   └ Return to prep screen to reset parameters.", options: { color: MUTED_COLOR, fontSize: 9 } }
], {
  x: 0.7, y: 1.3, w: 3.8, h: 3.6,
  fontFace: 'Arial'
});

// Right Side: Feature Breakdown & Multipliers
slide3.addText([
  { text: "Mechanical Rule Triggers:\n", options: { bold: true, color: ACCENT_GOLD, fontSize: 13 } },
  { text: "• Weakness Synergy: Matching Rune (Igni) -> 2x Base Damage (30 base magic damage instead of 10).\n\n", options: { color: TEXT_COLOR, fontSize: 11 } },
  { text: "• Blade Oil Coating: Necrophage Oil applied -> +5 Physical Slash damage.\n\n", options: { color: TEXT_COLOR, fontSize: 11 } },
  { text: "• Combo Blast: Igni Rune + Necrophage Oil -> +10 Rune Blast Bonus Damage (deals 40 damage total).\n\n", options: { color: TEXT_COLOR, fontSize: 11 } },
  { text: "• Survival Buffer: Quen Shield -> Blocks 100% of first enemy attack (0 damage, breaks barrier).\n\n", options: { color: TEXT_COLOR, fontSize: 11 } },
  { text: "• Active Danger Loop: Swamp Hag deals 15 damage automatically every 1.5 seconds.", options: { color: TEXT_COLOR, fontSize: 11 } }
], {
  x: 5.0, y: 1.2, w: 4.5, h: 3.8,
  fontFace: 'Arial'
});


// ----------------------------------------------------
// SLIDE 4: Code & Testing Evidence (Part 3 - Mandatory 2)
// ----------------------------------------------------
const slide4 = applyBaseSlide("Technical Implementation & Testing Evidence");

// Left Pane: Code block mockup box
slide4.addShape(pptx.shapes.RECTANGLE, {
  x: 0.5, y: 1.2, w: 5.0, h: 3.8,
  fill: CODE_BG,
  line: { color: BORDER_COLOR, width: 1.0 }
});
slide4.addText(
`// React combat interval loop in App.tsx
useEffect(() => {
  if (currentScreen === 'combat') {
    if (equippedRune === 'Quen') setQuenShieldActive(true);
    
    timerRef.current = setInterval(() => {
      setQuenShieldActive(currShield => {
        if (currShield) return false; // Absorbed!
        
        setPlayerHp(currHp => {
          const nextHp = currHp - 15;
          if (nextHp <= 0) {
            clearInterval(timerRef.current);
            setCurrentScreen('gameover');
            return 0;
          }
          setIsPlayerDmgFlash(true);
          setIsShake(true);
          setTimeout(() => setIsPlayerDmgFlash(false), 500);
          setTimeout(() => setIsShake(false), 500);
          return nextHp;
        });
        return false;
      });
    }, 1500);
  }
  return () => clearInterval(timerRef.current);
}, [currentScreen]);`,
  {
    x: 0.6, y: 1.3, w: 4.8, h: 3.6,
    fontSize: 8.5,
    fontFace: 'Courier New',
    color: 'CCCCCC'
  }
);

// Right Pane: Testing Caption
slide4.addText([
  { text: "Technical Balance Testing Summary:\n\n", options: { bold: true, color: ACCENT_GOLD, fontSize: 13 } },
  { text: "The combat balancing loop was thoroughly tested by varying the enemy attack interval. Settling on a 1.5-second clock cycle optimized tension. This speed prevents victory through mindless clicking of default attacks and requires strategic loadouts (Igni Rune and Necrophage Oil) to deplete the monster’s health pool before the player is overwhelmed.", options: { color: TEXT_COLOR, fontSize: 11, fontFace: 'Arial' } }
], {
  x: 5.8, y: 1.2, w: 3.7, h: 3.8,
  fontFace: 'Arial',
  lineSpacing: 16
});


// ----------------------------------------------------
// SLIDE 5: The Reflection (Part 4)
// ----------------------------------------------------
const slide5 = applyBaseSlide("Academic Critique & Reflection");

// Left Pane: Reflection Text
slide5.addText([
  { text: "Academic Self-Evaluation Critique:\n\n", options: { bold: true, color: ACCENT_GOLD, fontSize: 13 } },
  { text: "The Runebreaker prototype successfully demonstrates that a high-intensity, reactive gameplay loop can be delivered within a standard web page without relying on canvas-based rendering libraries.\n\n", options: { color: TEXT_COLOR, fontSize: 11 } },
  { text: "What worked exceptionally well was leveraging Tailwind CSS state-driven transitions for real-time visual feedback. Combining a screen shake animation with color-flash overlays instantly conveyed physical impact, simulating typical combat urgency.\n\n", options: { color: TEXT_COLOR, fontSize: 11 } },
  { text: "Furthermore, implementing an inlined synthesizer engine via the Web Audio API allowed the prototype to play custom sound effects on actions, bypassing the need to load external media assets. This design proves that standard browser APIs are sufficient to build rich, immersive game-feel environments.\n\n", options: { color: TEXT_COLOR, fontSize: 11 } },
  { text: "However, future development scopes could improve several dimensions. The combat state is tightly coupled to the main component, which limits scalability. Migrating to a context-driven or state-management pattern (like Redux) would facilitate complex encounters with multiple enemies. Additionally, adding a dynamic WebGL particle system for spell casts would elevate visual polish. In conclusion, the prototype serves as a strong academic proof-of-concept, highlighting the viability of CSS transitions and native browser APIs in simulating complex, real-time action-RPG mechanics.", options: { color: TEXT_COLOR, fontSize: 11 } }
], {
  x: 0.5, y: 1.1, w: 5.8, h: 3.9,
  fontFace: 'Arial',
  lineSpacing: 14
});

// Right Pane: Critique Bullet Summary
slide5.addShape(pptx.shapes.RECTANGLE, {
  x: 6.5, y: 1.2, w: 3.0, h: 3.7,
  fill: '1E293B',
  line: { color: BORDER_COLOR, width: 1.0 }
});
slide5.addText([
  { text: "📝 CRITIQUE SUMMARY\n\n", options: { bold: true, color: ACCENT_GOLD, fontSize: 11 } },
  { text: "• What Worked:\n", options: { bold: true, color: TEXT_COLOR, fontSize: 10 } },
  { text: "Tailwind transitions, visual screen shake effects, and zero-dependency Web Audio synthesizers.\n\n", options: { color: MUTED_COLOR, fontSize: 9 } },
  { text: "• What to Improve:\n", options: { bold: true, color: TEXT_COLOR, fontSize: 10 } },
  { text: "Decouple state logic to Redux, implement WebGL particle systems, and allow multiple enemies.", options: { color: MUTED_COLOR, fontSize: 9 } }
], {
  x: 6.6, y: 1.3, w: 2.8, h: 3.5,
  fontFace: 'Arial'
});


// ----------------------------------------------------
// SLIDE 6: Live Showcase (Part 5)
// ----------------------------------------------------
const slide6 = applyBaseSlide("Live Showcase & Project Deployment");

// Left Pane: Mockup Frame Description
slide6.addShape(pptx.shapes.RECTANGLE, {
  x: 0.5, y: 1.2, w: 5.0, h: 3.8,
  fill: '1E293B',
  line: { color: BORDER_COLOR, width: 1.5 }
});
slide6.addText([
  { text: "🖥️ DESKTOP PROTOTYPE SHOWCASE\n\n", options: { bold: true, color: ACCENT_GOLD, fontSize: 13 } },
  { text: "[Screenshot Mockup Placeholder]\n\n", options: { bold: true, color: TEXT_COLOR, fontSize: 12, align: 'center' } },
  { text: "Widescreen view of the active combat dashboard showing:\n\n", options: { color: MUTED_COLOR, fontSize: 10 } },
  { text: "• Live Health Gauges flashing on hit\n", options: { color: TEXT_COLOR, fontSize: 10 } },
  { text: "• High-contrast combat logs detailing oil modifiers\n", options: { color: TEXT_COLOR, fontSize: 10 } },
  { text: "• Custom golden borders matching the Witchers' guild theme\n", options: { color: TEXT_COLOR, fontSize: 10 } },
  { text: "• Pop-up combat logs with feedback text notifications", options: { color: TEXT_COLOR, fontSize: 10 } }
], {
  x: 0.7, y: 1.4, w: 4.6, h: 3.4,
  fontFace: 'Arial'
});

// Right Pane: Links & Instructions
slide6.addText([
  { text: "Deployment Link (Vercel/Netlify):\n", options: { bold: true, color: ACCENT_GOLD, fontSize: 12 } },
  { text: "https://runebreaker-bestiary-ui.vercel.app\n\n", options: { color: TEXT_COLOR, fontSize: 10, italic: true } },
  { text: "GitHub Source Code Repository:\n", options: { bold: true, color: ACCENT_GOLD, fontSize: 12 } },
  { text: "https://github.com/witcher-guild/runebreaker-ui\n\n", options: { color: TEXT_COLOR, fontSize: 10, italic: true } },
  { text: "Evaluator Instructions:\n", options: { bold: true, color: ACCENT_GOLD, fontSize: 12 } },
  { text: "1. Open the live deployment link in your desktop browser.\n", options: { color: TEXT_COLOR, fontSize: 10 } },
  { text: "2. Toggle sound, study swamp weaknesses, and apply necrophage oil/igni.\n", options: { color: TEXT_COLOR, fontSize: 10 } },
  { text: "3. Press [BEGIN HUNT] and beat the hag before health is depleted.", options: { color: TEXT_COLOR, fontSize: 10 } }
], {
  x: 5.8, y: 1.2, w: 3.7, h: 3.8,
  fontFace: 'Arial',
  lineSpacing: 15
});

// ----------------------------------------------------
// Save the file
// ----------------------------------------------------
pptx.writeFile({ fileName: 'presentation.pptx' })
  .then(fileName => {
    console.log(`Successfully generated native presentation file: ${fileName}`);
  })
  .catch(err => {
    console.error('Error saving presentation:', err);
  });
