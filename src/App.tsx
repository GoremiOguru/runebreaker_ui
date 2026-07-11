import { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Shield, 
  Sparkles, 
  Droplet, 
  Skull, 
  Swords, 
  BookOpen, 
  Trophy, 
  Heart, 
  Volume2, 
  VolumeX, 
  Scroll, 
  RotateCcw,
  Zap,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

// Type definitions
type Screen = 'prep' | 'combat' | 'victory' | 'gameover';
type Rune = 'Igni' | 'Quen' | 'Axii' | 'none';
type Oil = 'Necrophage' | 'Specter' | 'Draconid' | 'none';

interface LogEntry {
  id: string;
  text: string;
  type: 'player' | 'enemy' | 'system' | 'critical' | 'bonus' | 'neutral';
}

function App() {
  // Game states
  const [currentScreen, setCurrentScreen] = useState<Screen>('prep');
  const [equippedRune, setEquippedRune] = useState<Rune>('none');
  const [equippedOil, setEquippedOil] = useState<Oil>('none');
  const [playerHp, setPlayerHp] = useState(100);
  const [monsterHp, setMonsterHp] = useState(150);
  const [combatLogs, setCombatLogs] = useState<LogEntry[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Animation states
  const [isPlayerDmgFlash, setIsPlayerDmgFlash] = useState(false);
  const [isMonsterDmgFlash, setIsMonsterDmgFlash] = useState(false);
  const [isShake, setIsShake] = useState(false);
  const [criticalBadge, setCriticalBadge] = useState<string | null>(null);
  
  // Gameplay systems
  const [quenShieldActive, setQuenShieldActive] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);
  
  // Real MP3 background audio systems
  const introAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);

  // Audio synthesizer helper
  const playSound = (type: 'click' | 'start' | 'slash' | 'igni' | 'fizzle' | 'hit' | 'victory' | 'defeat' | 'shield-break') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const now = ctx.currentTime;
      
      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'start') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(250, now + 0.4);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'slash') {
        // Swoosh noise
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(120, now + 0.15);
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.1, now);
        noiseGain.gain.linearRampToValueAtTime(0, now + 0.15);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);
        noise.stop(now + 0.15);
      } else if (type === 'igni') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);

        // Add fire crackle noise
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(250, now);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.15, now);
        noiseGain.gain.linearRampToValueAtTime(0, now + 0.3);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);
        noise.stop(now + 0.3);
      } else if (type === 'fizzle') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(110, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'hit') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.linearRampToValueAtTime(25, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'shield-break') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'victory') {
        const notes = [261.63, 329.63, 392.00, 523.25]; // C chord
        notes.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + idx * 0.08);
          g.gain.setValueAtTime(0.08, now + idx * 0.08);
          g.gain.linearRampToValueAtTime(0, now + 0.5);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(now + idx * 0.08);
          o.stop(now + 0.5);
        });
      } else if (type === 'defeat') {
        const notes = [293.66, 277.18, 261.63, 220.00]; // descending minor/sad chord
        notes.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sawtooth';
          o.frequency.setValueAtTime(freq, now + idx * 0.12);
          g.gain.setValueAtTime(0.08, now + idx * 0.12);
          g.gain.linearRampToValueAtTime(0, now + 0.6);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(now + idx * 0.12);
          o.stop(now + 0.6);
        });
      }
    } catch (e) {
      console.warn('AudioContext not supported or suspended by user input constraint');
    }
  };

  // Add a combat log entry
  const addLog = (text: string, type: LogEntry['type']) => {
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      type
    };
    setCombatLogs(prev => [...prev, newEntry]);
  };

  // Autoscroll combat logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [combatLogs]);

  // Load and cache actual MP3 files on mount
  useEffect(() => {
    introAudioRef.current = new Audio('/game-intro-sound.mp3');
    introAudioRef.current.loop = true;
    introAudioRef.current.volume = 0.35; // Ambient volume level
    
    winAudioRef.current = new Audio('/player-win-audio.mp3');
    winAudioRef.current.volume = 0.5; // Triumphant volume level

    return () => {
      if (introAudioRef.current) {
        introAudioRef.current.pause();
        introAudioRef.current = null;
      }
      if (winAudioRef.current) {
        winAudioRef.current.pause();
        winAudioRef.current = null;
      }
    };
  }, []);

  // Control MP3 audio playback on screen routing changes and sound setting toggles
  useEffect(() => {
    if (!introAudioRef.current || !winAudioRef.current) return;

    if (soundEnabled && currentScreen === 'prep') {
      introAudioRef.current.play().catch(err => {
        console.warn('Autoplay blocked. Background intro audio will trigger upon first player interaction gesture.', err);
      });
    } else {
      introAudioRef.current.pause();
      if (currentScreen !== 'prep') {
        introAudioRef.current.currentTime = 0;
      }
    }

    if (soundEnabled && currentScreen === 'victory') {
      winAudioRef.current.play().catch(err => {
        console.warn('Win music failed to play.', err);
      });
    } else {
      winAudioRef.current.pause();
      winAudioRef.current.currentTime = 0;
    }
  }, [currentScreen, soundEnabled]);

  // Trigger background audio playback upon first player interaction gesture if blocked by autoplay
  useEffect(() => {
    const handleFirstGesture = () => {
      if (soundEnabled && currentScreen === 'prep' && introAudioRef.current && introAudioRef.current.paused) {
        introAudioRef.current.play().catch(() => {});
      }
    };
    window.addEventListener('click', handleFirstGesture);
    return () => window.removeEventListener('click', handleFirstGesture);
  }, [soundEnabled, currentScreen]);

  // Handle audio state on tab visibility change (e.g. backgrounding, switching tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (introAudioRef.current) introAudioRef.current.pause();
        if (winAudioRef.current) winAudioRef.current.pause();
      } else {
        if (soundEnabled) {
          if (currentScreen === 'prep' && introAudioRef.current) {
            introAudioRef.current.play().catch(() => {});
          } else if (currentScreen === 'victory' && winAudioRef.current) {
            winAudioRef.current.play().catch(() => {});
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentScreen, soundEnabled]);

  // COMBAT ENGINE: Enemy auto-attack interval loop
  useEffect(() => {
    if (currentScreen === 'combat') {
      // Setup initial Quen Shield if equipped
      if (equippedRune === 'Quen') {
        setQuenShieldActive(true);
        addLog("🛡️ Quen shield active! Ready to absorb the next incoming strike.", "system");
      }

      timerRef.current = setInterval(() => {
        // Evaluate shield state
        setQuenShieldActive(currShield => {
          if (currShield) {
            playSound('shield-break');
            addLog("💥 Swamp Hag attacks! Quen Shield absorbed the blow! (+0 DMG)", "system");
            return false; // Shield breaks
          } else {
            // Take damage
            setPlayerHp(currHp => {
              const nextHp = currHp - 15;
              if (nextHp <= 0) {
                // Player dead
                if (timerRef.current) clearInterval(timerRef.current);
                setCurrentScreen('gameover');
                playSound('defeat');
                return 0;
              }
              // Animate taking damage
              setIsPlayerDmgFlash(true);
              setIsShake(true);
              playSound('hit');
              addLog("🧟 Swamp Hag slashes you with muddy claws! (-15 HP)", "enemy");
              
              setTimeout(() => setIsPlayerDmgFlash(false), 500);
              setTimeout(() => setIsShake(false), 500);
              return nextHp;
            });
            return false;
          }
        });
      }, 1500); // 1.5 seconds auto-attack loop
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentScreen]);

  // Check Win/Loss conditions on state change
  useEffect(() => {
    if (currentScreen === 'combat' && monsterHp <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrentScreen('victory');
      playSound('victory');
    }
  }, [monsterHp, currentScreen]);

  // Action: Start game
  const beginHunt = () => {
    playSound('start');
    setPlayerHp(100);
    setMonsterHp(150);
    setQuenShieldActive(false);
    setCombatLogs([
      { id: '1', text: "⚔️ You enter the foggy Blackwater Bog. The Swamp Hag emerges!", type: 'system' },
      { id: '2', text: `🛡️ Loadout Prepped: Rune [${equippedRune.toUpperCase()}] | Oil [${equippedOil.toUpperCase()}]`, type: 'system' }
    ]);
    setCurrentScreen('combat');
  };

  // Action: Reset game
  const resetToPrep = () => {
    playSound('click');
    setEquippedRune('none');
    setEquippedOil('none');
    setPlayerHp(100);
    setMonsterHp(150);
    setCombatLogs([]);
    setQuenShieldActive(false);
    setCriticalBadge(null);
    setCurrentScreen('prep');
  };

  // Player Strike: Silver Slash
  const handleSilverSlash = () => {
    if (monsterHp <= 0 || playerHp <= 0) return;
    playSound('slash');

    // Base damage 10
    let damage = 10;
    let logMsg = "🗡️ You strike with your Silver Sword! (-10 DMG)";
    let logType: LogEntry['type'] = 'player';

    // Oil bonus check: Swamp Hag is a Necrophage
    if (equippedOil === 'Necrophage') {
      damage += 5;
      logMsg = `🗡️ Silver Sword Slash coated in Necrophage Oil! (+15 DMG)`;
      logType = 'bonus';
    }

    setIsMonsterDmgFlash(true);
    setTimeout(() => setIsMonsterDmgFlash(false), 500);

    setMonsterHp(prev => Math.max(0, prev - damage));
    addLog(logMsg, logType);
  };

  // Player Strike: Rune Blast
  const handleRuneBlast = () => {
    if (monsterHp <= 0 || playerHp <= 0) return;

    if (equippedRune === 'Igni') {
      // Weakness matched: Double base damage (30)
      playSound('igni');
      let damage = 30;
      let logMsg = "🔥 IGNI RUNE BLAST! The swamp hag's flesh ignites in chemical fury! (-30 DMG)";
      let logType: LogEntry['type'] = 'critical';

      // Coated oil bonus also helps magic efficiency
      if (equippedOil === 'Necrophage') {
        damage += 10;
        logMsg = "🔥 CRITICAL IGNI + NECOPHAGE OIL! An explosive reaction melts the beast! (-40 DMG)";
        logType = 'critical';
      }

      setCriticalBadge(`+${damage} CRITICAL HIT!`);
      setTimeout(() => setCriticalBadge(null), 1200);

      setIsMonsterDmgFlash(true);
      setTimeout(() => setIsMonsterDmgFlash(false), 500);

      setMonsterHp(prev => Math.max(0, prev - damage));
      addLog(logMsg, logType);
    } else {
      // Non-matching rune (Axii/Quen/none)
      playSound('fizzle');
      let damage = 10;
      let logMsg = `✨ Rune Blast (${equippedRune}) released. Standard kinetic force. (-10 DMG)`;
      let logType: LogEntry['type'] = 'player';

      if (equippedRune === 'Axii') {
        logMsg = "✨ Axii Rune Blast. The Swamp Hag screams in rage, immune to mind tricks! (-10 DMG)";
      } else if (equippedRune === 'none') {
        logMsg = "✨ No active Rune selected. Fists of kinetic magic released. (-10 DMG)";
      }

      setIsMonsterDmgFlash(true);
      setTimeout(() => setIsMonsterDmgFlash(false), 500);

      setMonsterHp(prev => Math.max(0, prev - damage));
      addLog(logMsg, logType);
    }
  };

  return (
    <div className="mobile-landscape-force">
      <div className={`game-layout-root bg-slate-950 text-gray-100 flex flex-col justify-between font-sans scanlines ${isShake ? 'animate-shake' : ''}`}>
        
        {/* HEADER BANNER */}
        <header className="border-b border-amber-900/40 bg-slate-950/80 backdrop-blur-md px-6 py-4 landscape-short:px-3 landscape-short:py-1 flex items-center justify-between">
          <div className="flex items-center gap-3 landscape-short:gap-1.5">
            <Skull className="h-6 w-6 landscape-short:h-4 landscape-short:w-4 text-amber-500 animate-pulse" />
            <div>
              <h1 className="text-xl md:text-2xl landscape-short:text-xs font-black tracking-wider text-amber-500 font-medieval uppercase">Runebreaker</h1>
              <p className="text-xs landscape-short:text-[8px] text-amber-600/80 font-mono tracking-widest uppercase">The Active-Time Bestiary UI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 landscape-short:gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const nextVal = !soundEnabled;
                setSoundEnabled(nextVal);
                
                if (!nextVal) {
                  if (introAudioRef.current) introAudioRef.current.pause();
                  if (winAudioRef.current) winAudioRef.current.pause();
                } else {
                  if (currentScreen === 'prep' && introAudioRef.current) {
                    introAudioRef.current.play().catch(() => {});
                  }
                  playSound('click');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 landscape-short:px-1.5 landscape-short:py-0 rounded bg-slate-900 border border-amber-900/30 hover:border-amber-600 text-xs landscape-short:text-[9px] text-amber-500 transition-all font-mono"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="h-4.5 w-4.5 landscape-short:h-3 landscape-short:w-3" />
                  <span>SOUND ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-4.5 w-4.5 landscape-short:h-3 landscape-short:w-3" />
                  <span>MUTED</span>
                </>
              )}
            </button>
          </div>
        </header>

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-6xl w-full mx-auto p-4 md:p-6 landscape-short:p-2 flex flex-col justify-center">
        
        {/* PREP SCREEN */}
        {currentScreen === 'prep' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 landscape-short:grid-cols-2 gap-6 landscape-short:gap-3 items-stretch">
            
            {/* LEFT COLUMN: BESTIARY PROFILE */}
            <div className="lg:col-span-5 landscape-short:col-span-1 flex flex-col bg-slate-900/70 border border-amber-900/30 rounded-lg p-5 landscape-short:p-2.5 medieval-border game-card-height">
              <div className="flex items-center gap-2 landscape-short:gap-1.5 border-b border-amber-900/30 pb-3 mb-4 landscape-short:pb-1 landscape-short:mb-2 shrink-0">
                <BookOpen className="h-5 w-5 landscape-short:h-4 landscape-short:w-4 text-amber-500" />
                <h2 className="text-lg landscape-short:text-xs font-bold font-medieval text-amber-500 tracking-wide uppercase">Bestiary Index: Necrophages</h2>
              </div>
              
              {/* Inner scrollable area for Bestiary */}
              <div className="flex-grow overflow-y-auto space-y-3 landscape-short:space-y-1.5 landscape-short:pr-1.5 medieval-scrollbar">
                {/* MONSTER GRAPHIC (SVG) */}
                <div className="relative w-full h-44 landscape-short:h-12 bg-slate-950 rounded border border-amber-900/20 overflow-hidden flex items-center justify-center mb-4 landscape-short:mb-2 shrink-0">
                  <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950 opacity-90 z-10"></div>
                  {/* SVG swamp landscape with glowing eyes */}
                  <svg className="absolute inset-0 w-full h-full object-cover opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Bog Background */}
                    <rect x="0" y="0" width="100" height="100" fill="#0f1e1a"/>
                    <path d="M0,80 Q25,65 50,85 T100,75 L100,100 L0,100 Z" fill="#06100c" />
                    <path d="M0,88 Q35,78 70,92 T100,85 L100,100 L0,100 Z" fill="#020805" />
                    {/* Gnarly Branches */}
                    <path d="M10,90 Q5,40 20,20 Q12,50 15,90" stroke="#000" strokeWidth="2.5" fill="none" />
                    <path d="M85,90 Q92,50 78,30 Q88,60 87,90" stroke="#000" strokeWidth="2" fill="none" />
                  </svg>
                  {/* Glowing hag eyes */}
                  <div className="absolute flex gap-6 z-20">
                    <div className="w-2.5 h-1.5 bg-rose-600 rounded-full shadow-[0_0_12px_#dc2626] animate-pulse"></div>
                    <div className="w-2.5 h-1.5 bg-rose-600 rounded-full shadow-[0_0_12px_#dc2626] animate-pulse"></div>
                  </div>
                  <div className="absolute bottom-2 left-2 landscape-short:bottom-1 landscape-short:left-1 z-20 bg-slate-950/80 px-2 py-0.5 border border-amber-900/30 rounded text-[10px] landscape-short:text-[8px] text-amber-500 font-mono tracking-wider">
                    CLASSIFIED: SWAMP HAG
                  </div>
                </div>

                {/* MONSTER STATS */}
                <div className="space-y-3 landscape-short:space-y-1.5 text-sm landscape-short:text-xs">
                  <div>
                    <h3 className="font-medieval text-amber-600 font-semibold landscape-short:text-[11px]">The Swamp Hag</h3>
                    <p className="text-xs landscape-short:text-[10px] landscape-short:leading-tight text-gray-400 font-lore leading-relaxed italic mt-1 landscape-short:mt-0.5">
                      "Lurks deep in toxic bog waters. Disguises itself as clumps of swamp moss, drowning unwary travelers in silt before tearing them apart. Only a silver blade coated in necrophage oil and the igniting spark of Igni can pierce its thick, mud-hardened hide."
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 landscape-short:gap-1.5 pt-2 landscape-short:pt-0">
                    <div className="bg-slate-950/60 p-2 landscape-short:p-1 rounded border border-amber-900/10">
                      <span className="text-[10px] landscape-short:text-[8px] text-amber-600 font-mono block uppercase">Vulnerabilities</span>
                      <span className="text-xs landscape-short:text-[10px] font-semibold text-emerald-400 font-mono">Igni Rune, Necrophage Oil</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 landscape-short:p-1 rounded border border-amber-900/10">
                      <span className="text-[10px] landscape-short:text-[8px] text-amber-600 font-mono block uppercase">Strengths</span>
                      <span className="text-xs landscape-short:text-[10px] font-semibold text-rose-400 font-mono">Axii Immune, High HP</span>
                    </div>
                  </div>

                  <div className="bg-amber-950/20 border border-amber-950/60 rounded p-2.5 landscape-short:p-1.5 flex items-start gap-2 landscape-short:gap-1">
                    <AlertTriangle className="h-4.5 w-4.5 landscape-short:h-3.5 landscape-short:w-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs landscape-short:text-[9px] landscape-short:leading-tight text-amber-300 font-mono">
                      <span className="font-bold">WITHERING INTELLIGENCE:</span> Equipping the <span className="underline">Igni Rune</span> will trigger 2x magical damage. Coating the sword in <span className="underline">Necrophage Oil</span> adds +5 DMG to strikes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: LOADOUT GRID */}
            <div className="lg:col-span-7 landscape-short:col-span-1 flex flex-col justify-between bg-slate-900/70 border border-amber-900/30 rounded-lg p-5 landscape-short:p-2.5 medieval-border game-card-height">
              <div>
                <div className="flex items-center gap-2 border-b border-amber-900/30 pb-3 mb-5 landscape-short:pb-1 landscape-short:mb-2 shrink-0">
                  <Swords className="h-5 w-5 landscape-short:h-4 landscape-short:w-4 text-amber-500" />
                  <h2 className="text-lg landscape-short:text-xs font-bold font-medieval text-amber-500 tracking-wide uppercase">Witcher Loadout Preparations</h2>
                </div>

                {/* Inner scrollable area for grids */}
                <div className="flex-grow overflow-y-auto game-card-scroll-height landscape-short:pr-1.5 medieval-scrollbar space-y-4 landscape-short:space-y-2">
                  {/* RUNES GRID */}
                  <div className="mb-6 landscape-short:mb-2">
                    <h3 className="text-xs landscape-short:text-[10px] text-amber-600 font-mono tracking-wider uppercase mb-3 landscape-short:mb-1.5 flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5" /> 1. Select Active Witcher Rune Sign
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 landscape-short:grid-cols-3 gap-3 landscape-short:gap-1.5">
                      
                      {/* IGNI */}
                      <button
                        onClick={() => { setEquippedRune('Igni'); playSound('click'); }}
                        className={`relative p-3.5 landscape-short:p-1.5 rounded-lg border text-left transition-all ${
                          equippedRune === 'Igni'
                            ? 'bg-amber-950/20 border-amber-500 ring-2 ring-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                            : 'bg-slate-950/50 border-amber-900/20 hover:border-amber-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 landscape-short:gap-1 mb-1.5 landscape-short:mb-0.5">
                          <Flame className={`h-4.5 w-4.5 landscape-short:h-3.5 landscape-short:w-3.5 ${equippedRune === 'Igni' ? 'text-orange-500' : 'text-gray-400'}`} />
                          <span className="text-sm landscape-short:text-xs font-medieval font-bold text-gray-200">IGNI</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-mono landscape-short:hidden">Fire burst magic. Target vulnerability matches.</p>
                        <span className="absolute bottom-1 right-2 landscape-short:bottom-0.5 landscape-short:right-1 text-[9px] landscape-short:text-[8px] text-orange-500 font-mono font-bold">2x DMG BONUS</span>
                      </button>

                      {/* QUEN */}
                      <button
                        onClick={() => { setEquippedRune('Quen'); playSound('click'); }}
                        className={`relative p-3.5 landscape-short:p-1.5 rounded-lg border text-left transition-all ${
                          equippedRune === 'Quen'
                            ? 'bg-cyan-950/20 border-cyan-500 ring-2 ring-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                            : 'bg-slate-950/50 border-amber-900/20 hover:border-amber-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 landscape-short:gap-1 mb-1.5 landscape-short:mb-0.5">
                          <Shield className={`h-4.5 w-4.5 landscape-short:h-3.5 landscape-short:w-3.5 ${equippedRune === 'Quen' ? 'text-cyan-400' : 'text-gray-400'}`} />
                          <span className="text-sm landscape-short:text-xs font-medieval font-bold text-gray-200">QUEN</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-mono landscape-short:hidden">Barrier shield. Absorbs first enemy claw attack.</p>
                        <span className="absolute bottom-1 right-2 landscape-short:bottom-0.5 landscape-short:right-1 text-[9px] landscape-short:text-[8px] text-cyan-400 font-mono font-bold">BLOCK EFFECT</span>
                      </button>

                      {/* AXII */}
                      <button
                        onClick={() => { setEquippedRune('Axii'); playSound('click'); }}
                        className={`relative p-3.5 landscape-short:p-1.5 rounded-lg border text-left transition-all ${
                          equippedRune === 'Axii'
                            ? 'bg-purple-950/20 border-purple-500 ring-2 ring-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                            : 'bg-slate-950/50 border-amber-900/20 hover:border-amber-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 landscape-short:gap-1 mb-1.5 landscape-short:mb-0.5">
                          <Sparkles className={`h-4.5 w-4.5 landscape-short:h-3.5 landscape-short:w-3.5 ${equippedRune === 'Axii' ? 'text-purple-400' : 'text-gray-400'}`} />
                          <span className="text-sm landscape-short:text-xs font-medieval font-bold text-gray-200">AXII</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-mono landscape-short:hidden">Mind hex. The target has mental immunity.</p>
                        <span className="absolute bottom-1 right-2 landscape-short:bottom-0.5 landscape-short:right-1 text-[9px] landscape-short:text-[8px] text-purple-400 font-mono font-bold">MUTED EFFECT</span>
                      </button>

                    </div>
                  </div>

                  {/* BLADE OILS GRID */}
                  <div>
                    <h3 className="text-xs landscape-short:text-[10px] text-amber-600 font-mono tracking-wider uppercase mb-3 landscape-short:mb-1.5 flex items-center gap-1.5">
                      <Droplet className="h-3.5 w-3.5" /> 2. Apply Blade Oil Coating
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 landscape-short:grid-cols-3 gap-3 landscape-short:gap-1.5">
                      
                      {/* NECROPHAGE OIL */}
                      <button
                        onClick={() => { setEquippedOil('Necrophage'); playSound('click'); }}
                        className={`relative p-3.5 landscape-short:p-1.5 rounded-lg border text-left transition-all ${
                          equippedOil === 'Necrophage'
                            ? 'bg-emerald-950/20 border-emerald-500 ring-2 ring-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                            : 'bg-slate-950/50 border-amber-900/20 hover:border-amber-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 landscape-short:gap-1 mb-1.5 landscape-short:mb-0.5">
                          <Droplet className={`h-4.5 w-4.5 landscape-short:h-3.5 landscape-short:w-3.5 ${equippedOil === 'Necrophage' ? 'text-emerald-400' : 'text-gray-400'}`} />
                          <span className="text-sm landscape-short:text-xs font-medieval font-bold text-gray-200">NECROPHAGE</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-mono landscape-short:hidden">Coating designed for corpse eaters. Match vulnerability.</p>
                        <span className="absolute bottom-1 right-2 landscape-short:bottom-0.5 landscape-short:right-1 text-[9px] landscape-short:text-[8px] text-emerald-400 font-mono font-bold">+5 PHYSICAL DMG</span>
                      </button>

                      {/* SPECTER OIL */}
                      <button
                        onClick={() => { setEquippedOil('Specter'); playSound('click'); }}
                        className={`relative p-3.5 landscape-short:p-1.5 rounded-lg border text-left transition-all ${
                          equippedOil === 'Specter'
                            ? 'bg-rose-950/20 border-rose-500 ring-2 ring-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                            : 'bg-slate-950/50 border-amber-900/20 hover:border-amber-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 landscape-short:gap-1 mb-1.5 landscape-short:mb-0.5">
                          <Droplet className={`h-4.5 w-4.5 landscape-short:h-3.5 landscape-short:w-3.5 ${equippedOil === 'Specter' ? 'text-rose-400' : 'text-gray-400'}`} />
                          <span className="text-sm landscape-short:text-xs font-medieval font-bold text-gray-200">SPECTER</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-mono landscape-short:hidden">Formulated for wraiths. Ineffective here.</p>
                        <span className="absolute bottom-1 right-2 landscape-short:bottom-0.5 landscape-short:right-1 text-[9px] landscape-short:text-[8px] text-rose-400 font-mono font-bold">NO EFFECT</span>
                      </button>

                      {/* DRACONID OIL */}
                      <button
                        onClick={() => { setEquippedOil('Draconid'); playSound('click'); }}
                        className={`relative p-3.5 landscape-short:p-1.5 rounded-lg border text-left transition-all ${
                          equippedOil === 'Draconid'
                            ? 'bg-blue-950/20 border-blue-500 ring-2 ring-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                            : 'bg-slate-950/50 border-amber-900/20 hover:border-amber-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 landscape-short:gap-1 mb-1.5 landscape-short:mb-0.5">
                          <Droplet className={`h-4.5 w-4.5 landscape-short:h-3.5 landscape-short:w-3.5 ${equippedOil === 'Draconid' ? 'text-blue-400' : 'text-gray-400'}`} />
                          <span className="text-sm landscape-short:text-xs font-medieval font-bold text-gray-200">DRACONID</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-mono landscape-short:hidden">Formulated for drakes. Ineffective here.</p>
                        <span className="absolute bottom-1 right-2 landscape-short:bottom-0.5 landscape-short:right-1 text-[9px] landscape-short:text-[8px] text-blue-400 font-mono font-bold">NO EFFECT</span>
                      </button>

                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BEGIN BUTTON */}
              <div className="mt-8 landscape-short:mt-2.5 pt-4 landscape-short:pt-1.5 border-t border-amber-900/20 flex flex-col md:flex-row landscape-short:flex-row items-center gap-4 landscape-short:gap-2 justify-between shrink-0">
                <div className="text-xs landscape-short:text-[9px] landscape-short:leading-tight font-mono text-gray-400 text-center md:text-left">
                  {equippedRune === 'none' || equippedOil === 'none' ? (
                    <span className="text-amber-600 animate-pulse block">⚠️ Recommended: Equip Rune & Oil before begining!</span>
                  ) : (
                    <span className="text-emerald-500 block">✨ Witcher is fully prepared. Hunt is ready!</span>
                  )}
                  Loadout: <span className="text-amber-500 font-bold">[{equippedRune}]</span> + <span className="text-amber-500 font-bold">[{equippedOil}]</span>
                </div>
                
                <button
                  onClick={beginHunt}
                  className="w-full md:w-auto landscape-short:w-auto px-10 py-3.5 landscape-short:px-4 landscape-short:py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black font-medieval text-sm landscape-short:text-xs uppercase rounded shadow-[0_0_20px_rgba(217,119,6,0.3)] transition-all transform hover:scale-105 active:scale-95"
                >
                  [ BEGIN HUNT ]
                </button>
              </div>
            </div>
          </div>
        )}

        {/* COMBAT SCREEN */}
        {currentScreen === 'combat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 landscape-short:grid-cols-3 gap-6 landscape-short:gap-2.5 items-stretch relative">
            
            {/* LEFT COLUMN: PLAYER STATS */}
            <div className={`lg:col-span-4 landscape-short:col-span-1 bg-slate-900/70 border border-amber-900/30 rounded-lg p-5 landscape-short:p-2.5 medieval-border flex flex-col justify-between transition-all game-card-height ${isPlayerDmgFlash ? 'animate-flash-red border-red-500' : ''}`}>
              {/* Inner scrollable area for Player Stats */}
              <div className="flex-grow overflow-y-auto space-y-3 landscape-short:space-y-1.5 landscape-short:pr-1.5 medieval-scrollbar">
                <div className="flex items-center justify-between border-b border-amber-900/30 pb-3 mb-4 landscape-short:pb-1 landscape-short:mb-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 landscape-short:h-4 landscape-short:w-4 text-red-500 animate-pulse" />
                    <h2 className="text-md landscape-short:text-xs font-bold font-medieval text-amber-500 uppercase">Witcher Status</h2>
                  </div>
                  {quenShieldActive && (
                    <span className="flex items-center gap-1 text-[10px] landscape-short:text-[8px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 border border-cyan-800 rounded animate-bounce">
                      <ShieldCheck className="h-3.5 w-3.5" /> QUEN
                    </span>
                  )}
                </div>
 
                {/* HEALTH BAR CONTAINER */}
                <div className="space-y-2 landscape-short:space-y-1">
                  <div className="flex justify-between text-xs landscape-short:text-[10px] font-mono">
                    <span className="text-gray-400 uppercase">VITALITY</span>
                    <span className="text-red-400 font-bold">{playerHp} / 100 HP</span>
                  </div>
                  <div className="w-full bg-slate-950 h-5 landscape-short:h-3 border border-amber-900/30 rounded p-0.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-red-800 to-red-600 h-full rounded transition-all duration-300 ease-out shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                      style={{ width: `${playerHp}%` }}
                    ></div>
                  </div>
                </div>
 
                {/* ACTIVE EQUIPMENT SUMMARY */}
                <div className="mt-6 landscape-short:mt-2 space-y-3 landscape-short:space-y-1.5 font-mono text-xs">
                  <span className="text-amber-600 block border-b border-amber-900/10 pb-1 landscape-short:pb-0.5 uppercase text-[10px] landscape-short:text-[9px]">ACTIVE COMBAT BUFFS</span>
                  <div className="flex items-center justify-between bg-slate-950/50 p-2 landscape-short:p-1.5 border border-amber-900/10 rounded">
                    <span className="text-gray-400">Rune Power:</span>
                    <span className={`font-bold ${equippedRune === 'Igni' ? 'text-orange-500' : equippedRune === 'Quen' ? 'text-cyan-400' : 'text-gray-300'}`}>
                      {equippedRune.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-950/50 p-2 landscape-short:p-1.5 border border-amber-900/10 rounded">
                    <span className="text-gray-400">Blade Coating:</span>
                    <span className={`font-bold ${equippedOil === 'Necrophage' ? 'text-emerald-400' : 'text-gray-300'}`}>
                      {equippedOil.toUpperCase()}
                    </span>
                  </div>
                </div>
 
                <div className="mt-6 landscape-short:mt-2 p-3 landscape-short:p-1.5 bg-red-950/20 border border-red-900/30 rounded text-center shrink-0">
                  <p className="text-[11px] landscape-short:text-[9px] landscape-short:leading-tight text-red-400 font-mono">
                    🚨 Enemy attacks automatically every <span className="font-bold underline">1.5s</span> dealing <span className="font-bold">15 damage</span>! Quick reflexes required.
                  </p>
                </div>
              </div>
            </div>
 
            {/* MIDDLE COLUMN: COMBAT FEEDBACK AND LOGS */}
            <div className="lg:col-span-4 bg-slate-900/70 border border-amber-900/30 rounded-lg p-5 landscape-short:p-2.5 medieval-border flex flex-col justify-between min-h-[350px] landscape-short:min-h-0 landscape-short:h-[calc(100vh-65px)]">
              
              <div className="flex items-center gap-2 border-b border-amber-900/30 pb-3 mb-4 landscape-short:pb-1 landscape-short:mb-2 shrink-0">
                <Scroll className="h-5 w-5 landscape-short:h-4 landscape-short:w-4 text-amber-500" />
                <h2 className="text-md landscape-short:text-xs font-bold font-medieval text-amber-500 uppercase">Chronicle of Combat</h2>
              </div>
 
              {/* CRITICAL SUCCESS BADGE OVERLAY */}
              <div className="relative flex-grow flex flex-col">
                {criticalBadge && (
                  <div className="absolute top-4 landscape-short:top-2 inset-x-0 mx-auto z-30 text-center animate-bounce">
                    <span className="px-3 py-1.5 landscape-short:px-2 landscape-short:py-0.5 bg-amber-500 text-slate-950 font-black text-xs landscape-short:text-[10px] rounded border-2 border-amber-300 shadow-[0_0_20px_#f59e0b] font-medieval uppercase">
                      💥 {criticalBadge} 💥
                    </span>
                  </div>
                )}
 
                {/* COMBAT LOGS SCROLL */}
                <div className="flex-grow h-48 landscape-short:h-20 overflow-y-auto medieval-scrollbar pr-2 space-y-2 select-none bg-slate-950/70 p-3 border border-amber-900/10 rounded">
                  {combatLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className={`text-xs font-mono border-l-2 pl-2 py-1 landscape-short:pl-1.5 landscape-short:py-0.5 leading-relaxed ${
                        log.type === 'player' ? 'border-gray-500 text-gray-200' :
                        log.type === 'enemy' ? 'border-red-600 text-red-300' :
                        log.type === 'critical' ? 'border-orange-500 text-orange-400 font-bold bg-orange-950/20' :
                        log.type === 'bonus' ? 'border-emerald-500 text-emerald-300 font-semibold bg-emerald-950/20' :
                        log.type === 'system' ? 'border-amber-600 text-amber-300 font-mono' :
                        'border-gray-700 text-gray-400'
                      }`}
                    >
                      {log.text}
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </div>
 
              {/* RETREAT ACTION */}
              <div className="mt-4 landscape-short:mt-2 border-t border-amber-900/20 pt-4 landscape-short:pt-1.5 text-center shrink-0">
                <button
                  onClick={resetToPrep}
                  className="px-4 py-1.5 landscape-short:px-3 landscape-short:py-1 bg-slate-950 hover:bg-slate-900 border border-red-900/30 hover:border-red-600 text-[10px] landscape-short:text-[9px] text-red-500 font-mono uppercase tracking-widest rounded transition-all"
                >
                  🏳️ Escape & Retreat
                </button>
              </div>
 
            </div>
 
            {/* RIGHT COLUMN: MONSTER STATUS */}
            <div className={`lg:col-span-4 landscape-short:col-span-1 bg-slate-900/70 border border-amber-900/30 rounded-lg p-5 landscape-short:p-2.5 medieval-border flex flex-col justify-between transition-all game-card-height ${isMonsterDmgFlash ? 'animate-flash-green border-emerald-500' : ''}`}>
              {/* Inner scrollable area for monster details */}
              <div className="flex-grow overflow-y-auto space-y-3 landscape-short:space-y-1.5 landscape-short:pr-1.5 medieval-scrollbar">
                <div className="flex items-center justify-between border-b border-amber-900/30 pb-3 mb-4 landscape-short:pb-1 landscape-short:mb-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <Skull className="h-5 w-5 landscape-short:h-4 landscape-short:w-4 text-emerald-500 animate-pulse" />
                    <h2 className="text-md landscape-short:text-xs font-bold font-medieval text-emerald-500 uppercase">Swamp Hag</h2>
                  </div>
                  <span className="text-[10px] landscape-short:text-[8px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-800 rounded">
                    NECROPHAGE
                  </span>
                </div>
 
                {/* MONSTER HEALTH BAR CONTAINER */}
                <div className="space-y-2 landscape-short:space-y-1">
                  <div className="flex justify-between text-xs landscape-short:text-[10px] font-mono">
                    <span className="text-gray-400 uppercase">VITALITY</span>
                    <span className="text-emerald-400 font-bold">{monsterHp} / 150 HP</span>
                  </div>
                  <div className="w-full bg-slate-950 h-5 landscape-short:h-3 border border-amber-900/30 rounded p-0.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-800 to-emerald-600 h-full rounded transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      style={{ width: `${(monsterHp / 150) * 100}%` }}
                    ></div>
                  </div>
                </div>
 
                {/* MONSTER GRAPHIC SILHOUETTE */}
                <div className="relative w-full h-28 landscape-short:h-8 bg-slate-950 rounded border border-amber-900/10 overflow-hidden flex items-center justify-center mt-5 landscape-short:mt-2 shrink-0">
                  <svg className="absolute inset-0 w-full h-full object-cover opacity-35" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <rect x="0" y="0" width="100" height="100" fill="#0f1e1a"/>
                    <path d="M0,80 Q25,65 50,85 T100,75 L100,100 L0,100 Z" fill="#06100c" />
                  </svg>
                  {/* Glowing red eyes representing the swamp monster during battle */}
                  <div className="absolute flex gap-4 landscape-short:gap-2 z-20">
                    <div className="w-2.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_12px_#dc2626] animate-pulse"></div>
                    <div className="w-2.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_12px_#dc2626] animate-pulse"></div>
                  </div>
                  <div className="absolute top-2 right-2 landscape-short:top-1 landscape-short:right-1 text-[8px] landscape-short:text-[7px] font-mono text-gray-500 uppercase tracking-widest">
                    Blackwater Bog
                  </div>
                </div>
              </div>
 
              {/* INTERACTIVE PLAYER ACTION BUTTONS */}
              <div className="mt-6 landscape-short:mt-2 space-y-3 landscape-short:space-y-1.5 shrink-0">
                <button
                  onClick={handleSilverSlash}
                  className="w-full py-3 landscape-short:py-1.5 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 border border-slate-600 hover:border-amber-600 text-gray-100 font-bold font-medieval text-xs landscape-short:text-[10px] uppercase rounded flex items-center justify-center gap-2 transition-all transform active:scale-95"
                >
                  <Swords className="h-4 w-4 landscape-short:h-3.5 landscape-short:w-3.5 text-amber-500" />
                  [SILVER SLASH]
                </button>
 
                <button
                  onClick={handleRuneBlast}
                  className="w-full py-3 landscape-short:py-1.5 bg-gradient-to-r from-slate-950 to-slate-900 hover:from-slate-900 hover:to-slate-800 border border-amber-900/30 hover:border-amber-500 text-amber-500 hover:text-amber-400 font-bold font-medieval text-xs landscape-short:text-[10px] uppercase rounded flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-[inset_0_0_10px_rgba(217,119,6,0.1)]"
                >
                  <Sparkles className="h-4 w-4 landscape-short:h-3.5 landscape-short:w-3.5 text-amber-500 animate-spin-slow" />
                  [RUNE BLAST]
                </button>
              </div>
 
            </div>
 
          </div>
        )}

        {/* VICTORY SCREEN */}
        {currentScreen === 'victory' && (
          <div className="max-w-md landscape-short:max-w-sm w-full mx-auto bg-slate-900/90 border-2 border-amber-500 rounded-lg p-8 landscape-short:p-3 text-center shadow-[0_0_40px_rgba(245,158,11,0.2)] medieval-border-active animate-fade-in">
            <Trophy className="h-16 w-16 landscape-short:h-8 landscape-short:w-8 text-amber-500 mx-auto mb-4 landscape-short:mb-1 animate-bounce" />
            <h2 className="text-2xl landscape-short:text-base font-black font-medieval text-amber-500 tracking-wider mb-2 landscape-short:mb-0.5 uppercase">The Beast Has Fallen</h2>
            <p className="text-xs landscape-short:text-[9px] text-amber-600 font-mono tracking-widest uppercase mb-6 landscape-short:mb-2">Swamp Hag Slain Successfully</p>
            
            <div className="bg-slate-950 p-4 landscape-short:p-2 rounded border border-amber-900/20 text-left space-y-3 landscape-short:space-y-1 mb-6 landscape-short:mb-2.5">
              <span className="text-[10px] text-amber-600 font-mono block uppercase border-b border-amber-900/10 pb-1">Trophy & Loot Claimed</span>
              <ul className="text-xs landscape-short:text-[10px] font-mono grid grid-cols-1 landscape-short:grid-cols-2 gap-1.5 landscape-short:gap-x-4 landscape-short:gap-y-0.5 text-gray-300">
                <li className="flex items-center gap-2 text-emerald-400">✔️ Swamp Hag Head</li>
                <li className="flex items-center gap-2">✔️ 2x Mutagens</li>
                <li className="flex items-center gap-2">✔️ 150x Crown Coins</li>
                <li className="flex items-center gap-2 text-amber-500">✔️ Reputation (+25)</li>
              </ul>
            </div>

            <button
              onClick={resetToPrep}
              className="px-8 py-3 landscape-short:px-4 landscape-short:py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black font-medieval text-xs uppercase rounded transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              <RotateCcw className="h-4 w-4 landscape-short:h-3.5 landscape-short:w-3.5" />
              [Hunt Again]
            </button>
          </div>
        )}

        {/* GAME OVER SCREEN */}
        {currentScreen === 'gameover' && (
          <div className="max-w-md landscape-short:max-w-sm w-full mx-auto bg-red-950/40 border-2 border-red-600 rounded-lg p-8 landscape-short:p-3 text-center shadow-[0_0_40px_rgba(220,38,38,0.2)] text-gray-200">
            <Skull className="h-16 w-16 landscape-short:h-8 landscape-short:w-8 text-red-600 mx-auto mb-4 landscape-short:mb-1 animate-pulse" />
            <h2 className="text-2xl landscape-short:text-base font-black font-medieval text-red-500 tracking-wider mb-2 landscape-short:mb-0.5 uppercase">You Have Slain No More</h2>
            <p className="text-xs landscape-short:text-[9px] text-red-600/80 font-mono tracking-widest uppercase mb-6 landscape-short:mb-2">Swallowed by Blackwater Bog</p>
            
            <div className="bg-slate-950/80 p-4 landscape-short:p-2 rounded border border-red-950/40 text-left space-y-2.5 landscape-short:space-y-1.5 mb-6 landscape-short:mb-2.5 text-gray-400 text-xs landscape-short:text-[10px] landscape-short:leading-tight font-mono">
              <p>💀 Your vitality reached 0. The Swamp Hag dragged your body into the deep mud.</p>
              <p className="text-red-400/80">Tip: Select <span className="underline font-bold text-red-400">Igni Rune</span> & coat blade with <span className="underline font-bold text-red-400">Necrophage Oil</span> before the fight!</p>
            </div>

            <button
              onClick={resetToPrep}
              className="px-8 py-3 landscape-short:px-4 landscape-short:py-1.5 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-gray-100 font-bold font-medieval text-xs uppercase rounded transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto border border-red-500/30"
            >
              <RotateCcw className="h-4 w-4 landscape-short:h-3.5 landscape-short:w-3.5" />
              [Try Again]
            </button>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-amber-900/20 bg-slate-950/80 py-4 landscape-short:py-1 flex items-center justify-center text-center text-[10px] landscape-short:text-[8px] text-amber-700/60 font-mono uppercase tracking-widest">
        Runebreaker Combat Dashboard • Designed for Witcher Guild Academic Submission
      </footer>
      </div>
    </div>
  );
}

export default App;
