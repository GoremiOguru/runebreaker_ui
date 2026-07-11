# PowerPoint Presentation Deck Outline: Runebreaker: The Active-Time Bestiary UI

---

## Slide 1: Concept & Setup (Part 1)

### Slide Header
* **Main Title:** Runebreaker: The Active-Time Bestiary UI
* **Sub-Title:** Simulated Real-Time Combat in State-Driven Interfaces
* **Presenter Name:** Academic Candidate

### Slide Layout & Visual Guidelines
* **Theme:** Dark theme with high contrast. Deep charcoal (#0B0F19) solid background, thin gold divider line.
* **Left Column (Key Content):**
  * **The Pitch:** A high-intensity, UI-driven tactical RPG prototype focusing on preparation and reflex-based combat.
  * **Core Theme:** Simulating tactical danger in traditional web pages.
* **Right Column (Moodboard Description):**
  * Multi-image moodboard collage description:
    * *Image 1:* Dark medieval stone brick textures representing dungeon walls.
    * *Image 2:* Glowing magical runes shining neon orange and cyan against slate.
    * *Image 3:* High-contrast action-RPG health layouts (like Diablo or Dark Souls) with glowing red values.
* **Bottom Panel (Project Write-up - 78 Words):**
  > **Project Narrative Summary:**
  > Runebreaker demonstrates how real-time danger can be simulated cleanly in a web interface using React's state-driven intervals rather than high-overhead canvas rendering. By binding a background `useEffect` timer loop to active combat state, the dashboard forces immediate player reactions while tracking health pools dynamically. This design shifts RPG gameplay from passive stat-checking to reflex-based tactical clicks, establishing a lightweight, responsive framework for browser-based action-RPG interfaces.

---

## Slide 2: Industry Research (Part 2)

### Slide Header
* **Title:** Industry Inspiration: The Witcher 3 Preparation Menus

### Slide Layout & Visual Guidelines
* **Theme:** Grimy, leather-texture background simulation with two main panels.
* **Left Column:** High-res layout description showing Geralt's preparation screen (swords, oils, and bestiary description).
* **Right Column (The 150-Word Analysis - Exactly 150 Words):**
  > **Core Design Inspiration Analysis:**
  > The core design inspiration for Runebreaker stems from *The Witcher 3*'s preparation menus. *The Witcher* utilizes crisp iconography and explicit monster vulnerability data to force tactical decision-making before an encounter, teaching players that knowledge is as vital as reflexes. 
  > 
  > Runebreaker translates this philosophy into a lightweight web dashboard. Instead of relying on a complex 3D engine, this prototype encapsulates prep menus into an interactive grid of Runes and Oils, immediately followed by a live active-time clicker layout. 
  > 
  > In the Prep Phase, players are forced to match the Swamp Hag's weakness (Igni Rune and Necrophage Oil) to survive. Once the hunt begins, the UI shifts from static data checking to active tension. This combination proves that clean web dashboards can capture the mechanical depth of AAA games, maximizing user engagement by linking pre-game planning directly to real-time success.

---

## Slide 3: GDD & System Loop (Part 3 - Mandatory 1)

### Slide Header
* **Title:** Game Design Document & Core Loops

### Slide Layout & Visual Guidelines
* **Theme:** Minimalist design, clean flowcharts, amber border highlight.
* **Top Half (Core Game Loop Diagram):**
  ```
  +--------------------------------+
  |    PREP SCREEN: LOADOUT        |
  |  (Select Runes & Blade Oils)   |
  +---------------+----------------+
                  |
                  v
  +---------------+----------------+
  |    COMBAT SCREEN ACTIVE        | <------+
  |  (1.5s Enemy Damage Interval)  |        | Update
  +---------------+----------------+        | Action
                  |                         | Logs &
                  v                         | Status
  +---------------+----------------+        |
  |  PLAYER / MONSTER INTERACTION  | -------+
  | (Silver Slash vs. Rune Blast)  |
  +---------------+----------------+
                  |
                  v
  +---------------+----------------+
  |     STATE CHECK CONDITION      |
  |   (HP <= 0 Win/Loss Checked)   |
  +-------+----------------+-------+
          |                |
          v (Loss)         v (Win)
  +-------+--------+ +-----+-------+
  | GAME OVER VIEW | |  VICTORY    |
  | (Retry Loop)   | | (Claim Loot)|
  +-------+--------+ +-----+-------+
          |                |
          +-------+--------+
                  |
                  v
  +---------------+----------------+
  |        RESET SYSTEM STATE      |
  |    (Return to Prep Screen)     |
  +--------------------------------+
  ```

### Bottom Half (Mechanical Feature Breakdown)
* **Pre-combat Multipliers & Rule Triggers:**
  * **Weakness Synergy:** $\text{Matching Rune (Igni)} \rightarrow 2 \times \text{Base Damage}$ (deals 30 base magic damage instead of 10).
  * **Blade Oil Coating:** $\text{Necrophage Oil applied} \rightarrow +5 \text{ Physical Slash Damage}$.
  * **Combo Blast:** $\text{Igni Rune} + \text{Necrophage Oil} \rightarrow +10 \text{ Rune Blast Bonus Damage}$ (deals 40 damage total).
  * **Survival Buffer:** $\text{Quen Shield} \rightarrow \text{Absorbs } 100\% \text{ of first enemy attack}$ (deals 0 damage, breaks barrier).
  * **Enemy Attack Interval:** 15 damage ticked against player vitality every 1.5 seconds.

---

## Slide 4: Code & Testing Evidence (Part 3 - Mandatory 2)

### Slide Header
* **Title:** Code Implementation & Technical Testing

### Slide Layout & Visual Guidelines
* **Theme:** Two-pane split screen. Left side houses the code snippet; right side houses the testing caption.

### Left Pane: Combat Loop Code Implementation
```typescript
// Active combat auto-attack interval loop in App.tsx
useEffect(() => {
  if (currentScreen === 'combat') {
    if (equippedRune === 'Quen') {
      setQuenShieldActive(true);
      addLog("🛡️ Quen shield active! Ready to absorb.", "system");
    }
    timerRef.current = setInterval(() => {
      setQuenShieldActive(currShield => {
        if (currShield) {
          addLog("💥 Swamp Hag attacks! Quen Shield absorbed the blow!", "system");
          return false; // Shield breaks
        } else {
          setPlayerHp(currHp => {
            const nextHp = currHp - 15;
            if (nextHp <= 0) {
              if (timerRef.current) clearInterval(timerRef.current);
              setCurrentScreen('gameover');
              return 0;
            }
            setIsPlayerDmgFlash(true);
            setIsShake(true);
            addLog("🧟 Swamp Hag slashes you! (-15 HP)", "enemy");
            setTimeout(() => setIsPlayerDmgFlash(false), 500);
            setTimeout(() => setIsShake(false), 500);
            return nextHp;
          });
          return false;
        }
      });
    }, 1500);
  }
  return () => { if (timerRef.current) clearInterval(timerRef.current); };
}, [currentScreen]);
```

### Right Pane (Testing Caption - Exactly 50 Words):
> **Technical Balance Testing Summary:**
> The combat balancing loop was thoroughly tested by varying the enemy attack interval. Settling on a 1.5-second clock cycle optimized tension. This speed prevents victory through mindless clicking of default attacks and requires strategic loadouts (Igni Rune and Necrophage Oil) to deplete the monster’s health pool before the player is overwhelmed.

---

## Slide 5: The Reflection (Part 4)

### Slide Header
* **Title:** Academic Critique & Reflection

### Slide Layout & Visual Guidelines
* **Theme:** Professional evaluation layout. Clean slate theme with two distinct segments.

### The Reflection & Self-Evaluation (Exactly 200 Words)
> **Academic Self-Evaluation Critique:**
> The Runebreaker prototype successfully demonstrates that a high-intensity, reactive gameplay loop can be delivered within a standard web page without relying on canvas-based rendering libraries. 
> 
> What worked exceptionally well was leveraging Tailwind CSS state-driven transitions for real-time visual feedback. Combining a screen shake animation with color-flash overlays instantly conveyed physical impact, simulating typical combat urgency. 
> 
> Furthermore, implementing an inlined synthesizer engine via the Web Audio API allowed the prototype to play custom sound effects on actions, bypassing the need to load external media assets. This design proves that standard browser APIs are sufficient to build rich, immersive game-feel environments.
> 
> However, future development scopes could improve several dimensions. The combat state is tightly coupled to the main component, which limits scalability. Migrating to a context-driven or state-management pattern (like Redux) would facilitate complex encounters with multiple enemies. 
> 
> Additionally, adding a dynamic WebGL particle system for spell casts would elevate visual polish. In conclusion, the prototype serves as a strong academic proof-of-concept, highlighting the viability of CSS transitions and native browser APIs in simulating complex, real-time action-RPG mechanics.

---

## Slide 6: Live Showcase (Part 5)

### Slide Header
* **Title:** Live Showcase & Project Deployment

### Slide Layout & Visual Guidelines
* **Theme:** Golden trim, screenshot mockups side-by-side, high contrast links.

### Main Content Panels
* **Left Panel: Desktop Mockup Showcase:**
  * [Screenshot Placeholder: Desktop view showing the Active Combat Screen in action, highlighting the flashing red screen shake, the green glow on the monster, the combat logs populated with messages, and the active health bars.]
* **Right Panel: Deployment Details:**
  * **Live Build Url:** `https://runebreaker-bestiary-ui.vercel.app` *(Placeholder for Vercel/Netlify Deployment)*
  * **Source Repository:** `https://github.com/witcher-guild/runebreaker-ui`
* **Evaluator Testing Instructions:**
  1. Open the live deployment link in any modern desktop web browser.
  2. Read the Bestiary Index on the Swamp Hag to note weaknesses.
  3. Select **Igni** as the Rune Sign and **Necrophage Oil** as the blade coating.
  4. Click **[BEGIN HUNT]** to enter the Blackwater Bog.
  5. Fire **Rune Blast** and strike with **Silver Slash** to slay the beast before vitality hits zero.
