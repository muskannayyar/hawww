import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nvseblgyejvcexdnpzcx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52c2VibGd5ZWp2Y2V4ZG5wemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NzY5MTgsImV4cCI6MjA5MDM1MjkxOH0.djNjrEqC-a0ZahdL1lWtKhgzwpEU8JbCrYB2J_4QwsE";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── CONSTANTS ──
const AVATARS = ["🧑‍💻","🧕","🧙","🦸","🧜","🧚","🐺","🦊","🐻","🐼","🦁","🐯","🐸","🦋","🐙"];
const NUDGE_MSGS = ["hey put the phone down 👀","skill issue 💀","touch grass challenge unlocked 🌱","your screen time is giving 😬","bet you can't go 30 mins without looking 👾"];
const ROASTS = ["bro is COOKED 💀","skill issue detected 📡","your thumbs need a break fr","this is not the way 😔","touch grass. NOW. 🌱","ur phone called. it says pls stop.","even your screen is tired of you","chronically online ahh behaviour","your ancestors are disappointed 💀","log off bestie. we're begging."];

const POPULAR_APPS = [
  { app:"Instagram", icon:"📸", color:"#E91E8C" },
  { app:"TikTok", icon:"🎵", color:"#6D28D9" },
  { app:"YouTube", icon:"▶️", color:"#EF4444" },
  { app:"Twitter / X", icon:"🐦", color:"#1DA1F2" },
  { app:"WhatsApp", icon:"💬", color:"#25D366" },
  { app:"Snapchat", icon:"👻", color:"#FBBF24" },
  { app:"Reddit", icon:"🤖", color:"#FF4500" },
  { app:"LinkedIn", icon:"💼", color:"#0077B5" },
  { app:"Netflix", icon:"📺", color:"#E50914" },
  { app:"Spotify", icon:"🎧", color:"#1DB954" },
  { app:"Discord", icon:"🎮", color:"#5865F2" },
  { app:"BeReal", icon:"📷", color:"#000" },
  { app:"Pinterest", icon:"📌", color:"#E60023" },
  { app:"Twitch", icon:"🟣", color:"#9146FF" },
  { app:"Messages", icon:"💌", color:"#34D399" },
  { app:"Safari", icon:"🌐", color:"#3B82F6" },
  { app:"Gmail", icon:"📧", color:"#EA4335" },
  { app:"News", icon:"📰", color:"#6B7280" },
];

const PRESET_TIMES = [
  { label:"15m", mins:15 },
  { label:"30m", mins:30 },
  { label:"45m", mins:45 },
  { label:"1h", mins:60 },
  { label:"1h30", mins:90 },
  { label:"2h", mins:120 },
  { label:"3h", mins:180 },
];

const fmt = (m) => {
  if (!m) return "0m";
  return m >= 60 ? `${Math.floor(m/60)}h ${m%60>0?m%60+"m":""}`.trim() : `${m}m`;
};
const genCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({length:6}, () => chars[Math.floor(Math.random()*chars.length)]).join("");
};

// ── THEME ──
const C = {
  bg:"#080810", surface:"#0F0F1C", surface2:"#161625", surface3:"#1E1E30",
  border:"rgba(255,255,255,0.07)", accent:"#6D28D9", accent2:"#A78BFA",
  accentGlow:"rgba(109,40,217,0.35)", green:"#34D399", red:"#F87171",
  yellow:"#FBBF24", text:"#EEE9FF", textMuted:"#6B6B8A", textDim:"#3A3A55",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=JetBrains+Mono:wght@300;400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#080810;color:#EEE9FF;font-family:'Bricolage Grotesque',sans-serif;overflow-x:hidden;}
  ::-webkit-scrollbar{width:0;}
  input,textarea,button{font-family:'Bricolage Grotesque',sans-serif;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes popIn{0%{transform:scale(0.7);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-8px) rotate(-2deg)}30%{transform:translateX(8px) rotate(2deg)}45%{transform:translateX(-6px)}60%{transform:translateX(6px)}75%{transform:translateX(-3px)}}
  @keyframes bigPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.08);opacity:0.85}}
  @keyframes glitch{0%,100%{clip-path:inset(0 0 100% 0);transform:translate(0)}10%{clip-path:inset(10% 0 60% 0);transform:translate(-4px,0)}20%{clip-path:inset(50% 0 20% 0);transform:translate(4px,0)}30%{clip-path:inset(20% 0 70% 0);transform:translate(-2px,0)}40%{clip-path:inset(0 0 100% 0);transform:translate(0)}}
  @keyframes interventionIn{from{opacity:0;transform:scale(1.05)}to{opacity:1;transform:scale(1)}}
  @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
  @keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
  @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
  .fade-up{animation:fadeUp 0.35s cubic-bezier(.22,1,.36,1) forwards;}
  .pop-in{animation:popIn 0.4s cubic-bezier(.34,1.56,.64,1) forwards;}
  .slide-up{animation:slideUp 0.3s cubic-bezier(.22,1,.36,1) forwards;}
  button:active{transform:scale(0.96)!important;transition:transform 0.08s;}
  .confetti-particle{position:fixed;top:-12px;width:10px;height:10px;border-radius:2px;animation:confettiFall linear forwards;pointer-events:none;z-index:9999;}
`;

// ── UTILS ──
function fireConfetti() {
  const colors = ["#A78BFA","#34D399","#FBBF24","#F87171","#60A5FA","#F472B6"];
  for (let i=0;i<60;i++) {
    const el = document.createElement("div");
    el.className = "confetti-particle";
    el.style.left = Math.random()*100+"vw";
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.width = (8+Math.random()*8)+"px";
    el.style.height = (8+Math.random()*8)+"px";
    el.style.borderRadius = Math.random()>0.5?"50%":"2px";
    el.style.animationDuration = (1.5+Math.random()*2)+"s";
    el.style.animationDelay = (Math.random()*0.6)+"s";
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),4000);
  }
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    [0,0.15,0.3].forEach(delay => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 440; osc.type = "square";
      gain.gain.setValueAtTime(0.15, ctx.currentTime+delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+delay+0.25);
      osc.start(ctx.currentTime+delay); osc.stop(ctx.currentTime+delay+0.25);
    });
  } catch(e){}
}

function playSuccess() {
  try {
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq; osc.type = "sine";
      const t = ctx.currentTime + i*0.12;
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t+0.3);
      osc.start(t); osc.stop(t+0.3);
    });
  } catch(e){}
}

// ── SMALL COMPONENTS ──
function Spinner() {
  return <div style={{width:20,height:20,border:`2px solid rgba(255,255,255,0.1)`,borderTop:`2px solid ${C.accent2}`,borderRadius:"50%",animation:"spin 0.7s linear infinite"}} />;
}

function Toast({ msg, show }) {
  return (
    <div style={{position:"fixed",bottom:100,left:"50%",transform:`translateX(-50%) translateY(${show?0:14}px)`,opacity:show?1:0,transition:"all 0.35s cubic-bezier(.34,1.56,.64,1)",background:C.surface3,color:C.text,border:`1px solid ${C.border}`,borderRadius:16,padding:"11px 22px",fontSize:14,fontWeight:700,zIndex:9999,whiteSpace:"nowrap",boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}}>
      {msg}
    </div>
  );
}

function BackBtn({ onBack }) {
  return (
    <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",color:C.textMuted,fontSize:13,fontWeight:600,cursor:"pointer",padding:"8px 0",marginBottom:8}}>
      ← back
    </button>
  );
}

function AvatarEl({ emoji, photo, size=40, glow=false, greyed=false }) {
  const style = {width:size,height:size,borderRadius:"50%",border:`2px solid ${glow?C.accent:C.border}`,flexShrink:0,boxShadow:glow?`0 0 16px ${C.accentGlow}`:"none",opacity:greyed?0.4:1};
  if (photo) return <div style={{...style,overflow:"hidden"}}><img src={photo} alt="dp" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>;
  return <div style={{...style,background:C.surface3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.45}}>{emoji}</div>;
}

function PrimaryBtn({ children, onClick, loading, style={} }) {
  return (
    <button onClick={onClick} disabled={!!loading} style={{background:`linear-gradient(135deg,${C.accent},${C.accent2})`,color:"#fff",border:"none",borderRadius:16,padding:"15px 28px",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",width:"100%",boxShadow:`0 8px 24px ${C.accentGlow}`,opacity:loading?0.7:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:-0.3,...style}}>
      {loading?<Spinner/>:children}
    </button>
  );
}

function GhostBtn({ children, onClick, style={} }) {
  return (
    <button onClick={onClick} style={{background:C.surface2,color:C.text,border:`1px solid ${C.border}`,borderRadius:16,padding:"14px 24px",fontSize:14,fontWeight:600,cursor:"pointer",width:"100%",...style}}>
      {children}
    </button>
  );
}

function Card({ children, style={}, glow=false }) {
  return (
    <div style={{background:C.surface,border:`1px solid ${glow?C.accent+"55":C.border}`,borderRadius:20,padding:"18px 20px",boxShadow:glow?`0 0 28px ${C.accentGlow}`:"none",...style}}>
      {children}
    </div>
  );
}

function ProgressBar({ value, max, color=C.accent }) {
  const pct = Math.min((value/max)*100,100);
  return (
    <div style={{height:6,background:C.surface3,borderRadius:10,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${pct}%`,background:value>max?C.red:color,borderRadius:10,transition:"width 0.8s cubic-bezier(.34,1.56,.64,1)"}}/>
    </div>
  );
}

function Badge({ children, color=C.accent }) {
  return <span style={{display:"inline-flex",alignItems:"center",background:`${color}18`,color,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,border:`1px solid ${color}30`}}>{children}</span>;
}

function InviteCard({ roomCode }) {
  const [copied,setCopied] = useState(false);
  const link = `${window.location.origin}?room=${roomCode}`;
  const copy = () => { navigator.clipboard?.writeText(link); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  return (
    <div style={{background:`linear-gradient(135deg,${C.accent}22,${C.accent2}11)`,border:`1px solid ${C.accent}44`,borderRadius:20,padding:"16px 18px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div>
        <div style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.5,marginBottom:4}}>room code</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:500,color:C.text,letterSpacing:4}}>{roomCode}</div>
        <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>share link to invite friends</div>
      </div>
      <button onClick={copy} style={{background:copied?`${C.green}20`:`${C.accent}30`,border:`1px solid ${copied?C.green:C.accent}`,borderRadius:12,padding:"10px 16px",color:copied?C.green:C.accent2,fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap"}}>
        {copied?"✓ copied":"copy link"}
      </button>
    </div>
  );
}

function PhotoUpload({ onPhoto, label="upload photo", size=80 }) {
  const ref = useRef();
  const [preview,setPreview] = useState(null);
  const handle = (e) => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setPreview(ev.target.result); onPhoto(ev.target.result); };
    reader.readAsDataURL(file);
  };
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
      <div onClick={()=>ref.current.click()} style={{width:size,height:size,borderRadius:"50%",border:`2px dashed ${C.accent}`,background:C.surface2,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",position:"relative"}}>
        {preview?<img src={preview} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="dp"/>:<span style={{fontSize:28,opacity:0.5}}>📷</span>}
        {preview&&<div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,0.5)",textAlign:"center",fontSize:9,fontWeight:700,padding:"3px 0",color:"#fff"}}>change</div>}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={handle}/>
      {!preview&&<div style={{fontSize:11,color:C.textMuted,fontWeight:600}}>{label}</div>}
    </div>
  );
}

// ── SCREEN TIME PICKER MODAL ──
function ScreenTimePicker({ target, currentMins, onSave, onClose }) {
  const [mins, setMins] = useState(currentMins || 0);
  const max = Math.max(target.limit_mins * 2, 180);

  const setPreset = (m) => setMins(m);
  const overLimit = mins > target.limit_mins;

  return (
    <div style={{position:"fixed",inset:0,zIndex:9000,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      {/* backdrop */}
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)"}}/>
      <div className="slide-up" style={{position:"relative",background:C.surface,borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",border:`1px solid ${C.border}`}}>
        {/* handle */}
        <div style={{width:40,height:4,background:C.surface3,borderRadius:10,margin:"0 auto 20px"}}/>

        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <div style={{width:40,height:40,borderRadius:12,background:`${target.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{target.icon}</div>
          <div>
            <div style={{fontWeight:700,fontSize:16}}>{target.app}</div>
            <div style={{fontSize:12,color:C.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>limit: {fmt(target.limit_mins)}</div>
          </div>
        </div>

        {/* Big time display */}
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:48,fontWeight:500,color:overLimit?C.red:C.accent2,transition:"color 0.3s"}}>
            {fmt(mins)}
          </div>
          {overLimit && <div style={{fontSize:12,color:C.red,fontWeight:700,marginTop:4}}>+{fmt(mins-target.limit_mins)} over limit 🔥</div>}
        </div>

        {/* Slider */}
        <div style={{marginBottom:20,padding:"0 4px"}}>
          <input
            type="range" min={0} max={max} step={5} value={mins}
            onChange={e => setMins(Number(e.target.value))}
            style={{width:"100%",accentColor:overLimit?C.red:C.accent,cursor:"pointer"}}
          />
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.textMuted,marginTop:4,fontFamily:"'JetBrains Mono',monospace"}}>
            <span>0m</span><span>{fmt(max)}</span>
          </div>
        </div>

        {/* Quick presets */}
        <div style={{marginBottom:24}}>
          <div style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>quick set</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {PRESET_TIMES.map(p => (
              <button key={p.mins} onClick={()=>setPreset(p.mins)} style={{padding:"7px 14px",borderRadius:20,fontSize:13,fontWeight:700,cursor:"pointer",border:`1px solid ${mins===p.mins?C.accent:C.border}`,background:mins===p.mins?`${C.accent}30`:C.surface2,color:mins===p.mins?C.accent2:C.textMuted,transition:"all 0.15s"}}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <PrimaryBtn onClick={()=>onSave(mins)} style={{background:overLimit?`linear-gradient(135deg,${C.red},#ef4444aa)`:`linear-gradient(135deg,${C.accent},${C.accent2})`}}>
          save {fmt(mins)}
        </PrimaryBtn>
      </div>
    </div>
  );
}

// ── APP PICKER MODAL ──
function AppPicker({ onSelect, onClose, existingApps=[] }) {
  const [search, setSearch] = useState("");
  const filtered = POPULAR_APPS.filter(a =>
    !existingApps.includes(a.app) &&
    a.app.toLowerCase().includes(search.toLowerCase())
  );
  const isCustom = search.trim() && !POPULAR_APPS.find(a=>a.app.toLowerCase()===search.toLowerCase());

  return (
    <div style={{position:"fixed",inset:0,zIndex:9000,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)"}}/>
      <div className="slide-up" style={{position:"relative",background:C.surface,borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",border:`1px solid ${C.border}`,maxHeight:"80vh",display:"flex",flexDirection:"column"}}>
        <div style={{width:40,height:4,background:C.surface3,borderRadius:10,margin:"0 auto 20px"}}/>
        <div style={{fontWeight:800,fontSize:18,marginBottom:16}}>add an app</div>

        {/* Search */}
        <div style={{position:"relative",marginBottom:16,flexShrink:0}}>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16,pointerEvents:"none"}}>🔍</span>
          <input
            autoFocus
            value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="search or type app name..."
            style={{width:"100%",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 14px 12px 42px",fontSize:14,color:C.text,outline:"none"}}
          />
        </div>

        {/* Custom entry */}
        {isCustom && (
          <button onClick={()=>onSelect({app:search.trim(),icon:"📱",color:C.accent})} style={{width:"100%",background:`${C.accent}20`,border:`1px dashed ${C.accent}`,borderRadius:14,padding:"12px 16px",color:C.accent2,fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:12,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <span style={{fontSize:20}}>📱</span>
            <div style={{textAlign:"left"}}>
              <div>add "{search.trim()}"</div>
              <div style={{fontSize:11,color:C.textMuted,fontWeight:400}}>custom app</div>
            </div>
          </button>
        )}

        {/* App grid */}
        <div style={{overflowY:"auto",flex:1}}>
          {!search && <div style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>popular apps</div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {filtered.map(a => (
              <button key={a.app} onClick={()=>onSelect(a)} style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",textAlign:"left"}}>
                <div style={{width:36,height:36,borderRadius:10,background:`${a.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{a.icon}</div>
                <div style={{fontWeight:600,fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.app}</div>
              </button>
            ))}
          </div>
          {filtered.length===0&&!isCustom&&<div style={{textAlign:"center",color:C.textMuted,fontSize:13,padding:"20px 0"}}>no apps found</div>}
        </div>
      </div>
    </div>
  );
}

// ── INTERVENTION SCREEN ──
function HawwwIntervention({ target, used, members, onDismiss }) {
  const [roast] = useState(ROASTS[Math.floor(Math.random()*ROASTS.length)]);
  const [tick,setTick] = useState(0);
  const overBy = used - target.limit_mins;
  useEffect(()=>{ const t=setInterval(()=>setTick(x=>x+1),800); return()=>clearInterval(t); },[]);
  useEffect(()=>{ playBeep(); },[]);

  return (
    <div style={{position:"fixed",inset:0,zIndex:99999,background:"#000",animation:"interventionIn 0.3s ease forwards",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",opacity:0.07}}>
        <div style={{position:"absolute",width:"100%",height:3,background:"#fff",animation:"scanline 2s linear infinite"}}/>
      </div>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 40%, #FF000044 0%, transparent 70%)",animation:"bigPulse 0.8s ease-in-out infinite",pointerEvents:"none"}}/>
      <div style={{fontSize:"22vw",fontWeight:800,letterSpacing:-4,lineHeight:0.85,color:"#fff",animation:`shake 0.6s ease-in-out ${tick%2===0?"":"reverse"} both`,fontFamily:"'Bricolage Grotesque',sans-serif",textAlign:"center",position:"relative",userSelect:"none"}}>
        <div style={{position:"absolute",inset:0,color:"#FF3B30",animation:"glitch 1.5s steps(1) infinite",fontFamily:"inherit",fontSize:"inherit",fontWeight:"inherit"}}>HAWWW</div>
        <div style={{position:"absolute",inset:0,color:"#5E5CE6",animation:"glitch 1.5s steps(1) infinite 0.5s",fontFamily:"inherit",fontSize:"inherit",fontWeight:"inherit"}}>HAWWW</div>
        HAWWW
      </div>
      <div style={{fontSize:"10vw",marginTop:8,animation:"bigPulse 0.6s ease-in-out infinite"}}>👋</div>
      <div style={{marginTop:24,background:"#FF3B30",borderRadius:20,padding:"10px 24px",fontSize:18,fontWeight:800,color:"#fff",animation:"shake 1.2s ease-in-out infinite",fontFamily:"'JetBrains Mono',monospace"}}>
        +{fmt(overBy)} over on {target.icon} {target.app}
      </div>
      <div style={{marginTop:16,fontSize:16,fontWeight:700,color:"rgba(255,255,255,0.7)",textAlign:"center",padding:"0 32px",lineHeight:1.5}}>{roast}</div>
      {members.filter(m=>m.status!=="left").length>1&&(
        <div style={{marginTop:20,fontSize:12,color:"rgba(255,255,255,0.4)",fontWeight:600}}>your crew is watching 👀</div>
      )}
      <button onClick={onDismiss} style={{marginTop:40,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:16,padding:"14px 32px",color:"rgba(255,255,255,0.5)",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Bricolage Grotesque',sans-serif"}}>
        ok ok i get it 🙈
      </button>
    </div>
  );
}

// ── ONBOARDING ──
function Onboarding({ onDone }) {
  const [step,setStep] = useState(0);
  const [name,setName] = useState("");
  const [avatar,setAvatar] = useState(AVATARS[0]);
  const [photo,setPhoto] = useState(null);
  const [mode,setMode] = useState(null);
  const [roomCode,setRoomCode] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const code = params.get("room");
    if(code){ setRoomCode(code.toUpperCase()); setMode("join"); setStep(1); }
  },[]);

  const createRoom = async()=>{
    if(!name.trim()) return setError("Add your name first!");
    setLoading(true); setError("");
    try{
      const code = genCode();
      const {error:re} = await supabase.from("rooms").insert({code,name:`${name}'s Room`});
      if(re) throw re;
      const {data:user,error:ue} = await supabase.from("users").insert({name:name.trim(),avatar,photo:photo||null,room_code:code,xp:0,status:"active"}).select().single();
      if(ue) throw ue;
      await supabase.from("targets").insert([
        {room_code:code,app:"Instagram",icon:"📸",limit_mins:60,color:"#E91E8C"},
        {room_code:code,app:"YouTube",icon:"▶️",limit_mins:90,color:"#EF4444"},
        {room_code:code,app:"TikTok",icon:"🎵",limit_mins:45,color:C.accent},
      ]);
      await supabase.from("challenges").insert([
        {room_code:code,title:"Morning Move",description:"Log a 15-min walk or run before noon",type:"fitness",icon:"🏃",xp:50,color:C.green},
        {room_code:code,title:"Screen Break",description:"Put phone down for 30 minutes",type:"mindful",icon:"🧘",xp:40,color:C.accent},
        {room_code:code,title:"Hydration Check",description:"Drink 8 glasses of water",type:"fitness",icon:"💧",xp:25,color:"#3B82F6"},
      ]);
      localStorage.setItem("hawww_user", JSON.stringify(user));
      onDone(user);
    }catch(e){ setError(e.message); }
    setLoading(false);
  };

  const joinRoom = async()=>{
    if(!name.trim()) return setError("Add your name first!");
    if(!roomCode.trim()) return setError("Enter a room code!");
    setLoading(true); setError("");
    try{
      const {data:room} = await supabase.from("rooms").select().eq("code",roomCode.toUpperCase()).single();
      if(!room) throw new Error("Room not found. Check the code!");
      const {count} = await supabase.from("users").select("*",{count:"exact",head:true}).eq("room_code",roomCode.toUpperCase()).neq("status","left");
      if(count>=5) throw new Error("Room is full (max 5 people)!");
      const {data:user,error:ue} = await supabase.from("users").insert({name:name.trim(),avatar,photo:photo||null,room_code:roomCode.toUpperCase(),xp:0,status:"active"}).select().single();
      if(ue) throw ue;
      localStorage.setItem("hawww_user",JSON.stringify(user));
      onDone(user);
    }catch(e){ setError(e.message); }
    setLoading(false);
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:`radial-gradient(circle,${C.accentGlow} 0%,transparent 70%)`,top:"-15%",left:"50%",transform:"translateX(-50%)",pointerEvents:"none"}}/>
      <div style={{width:"100%",maxWidth:380,position:"relative",zIndex:1}}>
        <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:44}}>
          {[0,1,2].map(i=>(
            <div key={i} style={{width:i===step?32:8,height:8,borderRadius:10,background:i<=step?C.accent:C.surface3,transition:"all 0.35s ease"}}/>
          ))}
        </div>

        {step===0&&(
          <div className="fade-up">
            <div style={{fontSize:72,textAlign:"center",marginBottom:20}}>👋👋👋</div>
            <h1 style={{fontSize:42,fontWeight:800,textAlign:"center",marginBottom:10,letterSpacing:-2,lineHeight:1.1}}>
              welcome to{" "}
              <span style={{background:`linear-gradient(135deg,${C.accent},${C.accent2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>hawww</span>
            </h1>
            <p style={{color:C.textMuted,textAlign:"center",fontSize:15,lineHeight:1.75,marginBottom:44}}>accountability meets your crew. screen time, but make it social.</p>
            <PrimaryBtn onClick={()=>setStep(1)}>let's go →</PrimaryBtn>
          </div>
        )}

        {step===1&&(
          <div className="fade-up">
            <h2 style={{fontSize:28,fontWeight:800,marginBottom:4}}>who are you?</h2>
            <p style={{color:C.textMuted,fontSize:14,marginBottom:20}}>set your vibe</p>
            {mode==="join"&&roomCode&&(
              <div style={{background:`${C.green}15`,border:`1px solid ${C.green}30`,borderRadius:14,padding:"10px 14px",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16}}>🔗</span>
                <div><div style={{fontSize:12,fontWeight:700,color:C.green}}>joining room {roomCode}</div><div style={{fontSize:11,color:C.textMuted}}>set up your profile first</div></div>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:20}}>
              <PhotoUpload onPhoto={setPhoto} label="add profile photo" size={80}/>
            </div>
            <p style={{fontSize:12,color:C.textMuted,fontWeight:600,marginBottom:8}}>or pick an emoji avatar</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:20}}>
              {AVATARS.map(a=>(
                <button key={a} onClick={()=>{setAvatar(a);setPhoto(null);}} style={{aspectRatio:"1",borderRadius:14,border:`2px solid ${avatar===a&&!photo?C.accent:C.border}`,background:avatar===a&&!photo?`${C.accent}20`:C.surface,fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:avatar===a&&!photo?`0 0 12px ${C.accentGlow}`:"none",transition:"all 0.2s"}}>
                  {a}
                </button>
              ))}
            </div>
            <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(name.trim()?setStep(2):setError("Need a name!"))} placeholder="your name..." style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:"14px 18px",fontSize:16,color:C.text,outline:"none",marginBottom:12}}/>
            {error&&<p style={{color:C.red,fontSize:13,marginBottom:12}}>{error}</p>}
            <PrimaryBtn onClick={()=>{if(!name.trim()) return setError("Need a name!"); setError(""); setStep(2);}}>{mode==="join"?"continue →":"next →"}</PrimaryBtn>
          </div>
        )}

        {step===2&&!mode&&(
          <div className="fade-up">
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
              <AvatarEl emoji={avatar} photo={photo} size={52} glow/>
              <div><div style={{fontSize:20,fontWeight:800}}>{name}</div><div style={{color:C.textMuted,fontSize:13}}>ready to go ✦</div></div>
            </div>
            <h2 style={{fontSize:24,fontWeight:800,marginBottom:4}}>join or create?</h2>
            <p style={{color:C.textMuted,fontSize:14,marginBottom:24}}>start fresh or join your crew</p>
            <PrimaryBtn onClick={()=>setMode("create")} style={{marginBottom:10}}>create a room ✦</PrimaryBtn>
            <GhostBtn onClick={()=>setMode("join")}>join with a code</GhostBtn>
          </div>
        )}

        {step===2&&mode==="create"&&(
          <div className="fade-up">
            <BackBtn onBack={()=>setMode(null)}/>
            <h2 style={{fontSize:24,fontWeight:800,marginBottom:4}}>create your room</h2>
            <p style={{color:C.textMuted,fontSize:14,marginBottom:20}}>invite up to 4 friends after</p>
            <Card style={{marginBottom:16}}>
              <div style={{fontSize:10,color:C.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,marginBottom:8}}>creator</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <AvatarEl emoji={avatar} photo={photo} size={36}/>
                <span style={{fontSize:15,fontWeight:700}}>{name}</span>
              </div>
            </Card>
            {error&&<p style={{color:C.red,fontSize:13,marginBottom:12}}>{error}</p>}
            <PrimaryBtn onClick={createRoom} loading={loading}>create room 🚀</PrimaryBtn>
          </div>
        )}

        {step===2&&mode==="join"&&(
          <div className="fade-up">
            <BackBtn onBack={()=>{setMode(null);const p=new URLSearchParams(window.location.search);if(p.get("room"))window.history.replaceState({},"",window.location.pathname);}}/>
            <h2 style={{fontSize:24,fontWeight:800,marginBottom:4}}>join a room</h2>
            <p style={{color:C.textMuted,fontSize:14,marginBottom:20}}>enter the code your friend shared</p>
            <input value={roomCode} onChange={e=>setRoomCode(e.target.value.toUpperCase())} placeholder="XXXXXX" style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:"14px 18px",fontSize:24,color:C.text,outline:"none",marginBottom:16,letterSpacing:6,textAlign:"center",fontFamily:"'JetBrains Mono',monospace"}}/>
            {error&&<p style={{color:C.red,fontSize:13,marginBottom:12}}>{error}</p>}
            <PrimaryBtn onClick={joinRoom} loading={loading}>join room →</PrimaryBtn>
          </div>
        )}
      </div>
    </div>
  );
}

// ── HOME ──
function HomeTab({ user, members, targets, challenges, progress, completions, setScreen }) {
  const myProgress = progress.filter(p=>p.user_id===user.id);
  const myCompletions = completions.filter(c=>c.user_id===user.id);
  const onTrack = targets.filter(t=>{const p=myProgress.find(x=>x.target_id===t.id);return!p||p.minutes_used<=t.limit_mins;}).length;
  const activeMembers = members.filter(m=>m.status!=="left");

  return(
    <div style={{padding:"16px 16px 0"}} className="fade-up">
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[{l:"on track",v:`${onTrack}/${targets.length}`,c:C.green,i:"🎯"},{l:"challenges",v:`${myCompletions.length}/${challenges.length}`,c:C.accent2,i:"⚡"},{l:"streak",v:"7d",c:C.yellow,i:"🔥"}].map(s=>(
          <div key={s.l} style={{flex:1,background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:"12px 8px",textAlign:"center"}}>
            <div style={{fontSize:18,marginBottom:4}}>{s.i}</div>
            <div style={{fontSize:16,fontWeight:800,color:s.c}}>{s.v}</div>
            <div style={{fontSize:10,fontWeight:600,color:C.textMuted,marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>

      <InviteCard roomCode={user.room_code}/>

      {/* Members */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.5,marginBottom:10}}>in this room</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {members.map(m=>{
            const left = m.status==="left";
            return(
              <div key={m.id} style={{display:"flex",alignItems:"center",gap:8,background:C.surface,border:`1px solid ${left?"rgba(255,255,255,0.03)":C.border}`,borderRadius:30,padding:"6px 12px 6px 6px",opacity:left?0.45:1}}>
                <AvatarEl emoji={m.avatar} photo={m.photo} size={26} glow={m.id===user.id} greyed={left}/>
                <span style={{fontSize:13,fontWeight:700,color:m.id===user.id?C.accent2:left?C.textMuted:C.text}}>{m.id===user.id?"you":m.name}</span>
                {left?<span style={{fontSize:9,color:C.textMuted,fontWeight:600}}>left</span>:<span style={{fontSize:10,color:C.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>{m.xp}xp</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Targets */}
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:16,fontWeight:800}}>targets</span>
          <button onClick={()=>setScreen("targets")} style={{background:"none",border:"none",color:C.accent2,fontWeight:700,fontSize:13,cursor:"pointer"}}>see all →</button>
        </div>
        {targets.slice(0,3).map(t=>{
          const p=myProgress.find(x=>x.target_id===t.id);
          const used=p?.minutes_used||0;
          return(
            <Card key={t.id} style={{marginBottom:8,borderLeft:`3px solid ${t.color}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:18}}>{t.icon}</span>
                  <span style={{fontWeight:700,fontSize:14}}>{t.app}</span>
                </div>
                <Badge color={used>t.limit_mins?C.red:C.green}>{used>t.limit_mins?`+${used-t.limit_mins}m over`:"✓ good"}</Badge>
              </div>
              <ProgressBar value={used} max={t.limit_mins} color={t.color}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textMuted,marginTop:5,fontFamily:"'JetBrains Mono',monospace"}}>
                <span>{fmt(used)} used</span><span>{fmt(t.limit_mins)} limit</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Challenges */}
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:16,fontWeight:800}}>challenges</span>
          <button onClick={()=>setScreen("challenges")} style={{background:"none",border:"none",color:C.accent2,fontWeight:700,fontSize:13,cursor:"pointer"}}>see all →</button>
        </div>
        {challenges.slice(0,2).map(c=>{
          const done=completions.find(x=>x.challenge_id===c.id&&x.user_id===user.id);
          return(
            <Card key={c.id} style={{marginBottom:8,display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:42,height:42,borderRadius:14,background:`${c.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{c.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{c.title}</div>
                <div style={{display:"flex",gap:6}}><Badge color={done?C.green:C.accent}>{done?"✓ done":"pending"}</Badge></div>
              </div>
              <span style={{fontFamily:"'JetBrains Mono',monospace",color:C.accent2,fontSize:13}}>+{c.xp}</span>
            </Card>
          );
        })}
      </div>
      <div style={{height:20}}/>
    </div>
  );
}

// ── TARGETS ──
function TargetsTab({ user, members, targets, setTargets, progress, setProgress, onBack }) {
  const [pickerTarget, setPickerTarget] = useState(null);
  const [showAppPicker, setShowAppPicker] = useState(false);
  const [intervention, setIntervention] = useState(null);

  const getUsed = (targetId,userId) => progress.find(x=>x.target_id===targetId&&x.user_id===userId)?.minutes_used||0;

  const saveProgress = async(targetId, mins) => {
    setPickerTarget(null);
    const existing = progress.find(x=>x.target_id===targetId&&x.user_id===user.id);
    if(existing){
      await supabase.from("target_progress").update({minutes_used:mins}).eq("id",existing.id);
      setProgress(p=>p.map(x=>x.id===existing.id?{...x,minutes_used:mins}:x));
    }else{
      const {data} = await supabase.from("target_progress").insert({target_id:targetId,user_id:user.id,minutes_used:mins}).select().single();
      if(data) setProgress(p=>[...p,data]);
    }
    const target = targets.find(t=>t.id===targetId);
    if(target&&mins>target.limit_mins) setIntervention({target,used:mins});
  };

  const addApp = async(appData) => {
    setShowAppPicker(false);
    const {data} = await supabase.from("targets").insert({room_code:user.room_code,app:appData.app,icon:appData.icon,limit_mins:60,color:appData.color}).select().single();
    if(data) setTargets(t=>[...t,data]);
  };

  const existingApps = targets.map(t=>t.app);

  return(
    <div style={{padding:"16px 16px 0"}} className="fade-up">
      {intervention&&<HawwwIntervention target={intervention.target} used={intervention.used} members={members} onDismiss={()=>setIntervention(null)}/>}
      {pickerTarget&&<ScreenTimePicker target={pickerTarget} currentMins={getUsed(pickerTarget.id,user.id)} onSave={mins=>saveProgress(pickerTarget.id,mins)} onClose={()=>setPickerTarget(null)}/>}
      {showAppPicker&&<AppPicker onSelect={addApp} onClose={()=>setShowAppPicker(false)} existingApps={existingApps}/>}

      <BackBtn onBack={onBack}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:4}}>screen time</h2>
      <p style={{color:C.textMuted,fontSize:13,marginBottom:12}}>tap your time to log it</p>

      {/* iOS note */}
      <Card style={{marginBottom:12,background:`${C.yellow}08`,border:`1px solid ${C.yellow}25`}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{fontSize:18,flexShrink:0}}>📱</span>
          <div style={{fontSize:12,color:C.textMuted,lineHeight:1.6}}>
            <b style={{color:C.yellow}}>iOS Screen Time</b> — Apple doesn't allow third-party apps to read this directly. Go to <b style={{color:C.text}}>Settings → Screen Time</b>, check your totals, then tap to log them here.
          </div>
        </div>
      </Card>

      {targets.map(t=>(
        <Card key={t.id} style={{marginBottom:12,borderLeft:`3px solid ${t.color}`}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
            <div style={{width:40,height:40,borderRadius:12,background:`${t.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{t.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:15}}>{t.app}</div>
              <div style={{fontSize:11,color:C.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>limit · {fmt(t.limit_mins)}/day</div>
            </div>
          </div>

          {members.map(m=>{
            const used=getUsed(t.id,m.id);
            const isMe=m.id===user.id;
            const left=m.status==="left";
            return(
              <div key={m.id} style={{marginBottom:10,opacity:left?0.4:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <AvatarEl emoji={m.avatar} photo={m.photo} size={20}/>
                    <span style={{fontSize:12,fontWeight:700,color:isMe?C.accent2:C.text}}>{isMe?"you":m.name}{left?" (left)":""}</span>
                  </div>
                  <button
                    onClick={()=>isMe&&setPickerTarget(t)}
                    style={{background:used>t.limit_mins?`${C.red}20`:C.surface3,border:`1px solid ${used>t.limit_mins?C.red+"55":C.border}`,borderRadius:10,padding:"4px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:used>t.limit_mins?C.red:C.green,cursor:isMe?"pointer":"default",fontWeight:700,display:"flex",alignItems:"center",gap:4}}
                  >
                    {fmt(used)}{isMe&&<span style={{fontSize:10,opacity:0.5}}>✏️</span>}
                  </button>
                </div>
                <ProgressBar value={used} max={t.limit_mins} color={t.color}/>
                {used>t.limit_mins&&isMe&&<div style={{fontSize:10,color:C.red,fontWeight:700,marginTop:4,textAlign:"right"}}>+{fmt(used-t.limit_mins)} over 🔥</div>}
              </div>
            );
          })}
        </Card>
      ))}

      <PrimaryBtn onClick={()=>setShowAppPicker(true)} style={{marginBottom:20}}>+ add app</PrimaryBtn>
    </div>
  );
}

// ── CHALLENGES ──
function ChallengesTab({ user, members, challenges, completions, setCompletions, setUserXp, showToast, onBack }) {
  const [filter,setFilter] = useState("all");
  const [expanded,setExpanded] = useState(null);
  const [msgMap,setMsgMap] = useState({});
  const [comment,setComment] = useState("");
  const [taskPhotos,setTaskPhotos] = useState({});
  const [pendingComplete,setPendingComplete] = useState(null);
  const filters = ["all","fitness","mindful","social"];
  const filtered = filter==="all"?challenges:challenges.filter(c=>c.type===filter);

  const fetchMsgs = async(id)=>{
    const {data} = await supabase.from("messages").select("*, users(name,avatar,photo)").eq("challenge_id",id).order("created_at");
    if(data) setMsgMap(p=>({...p,[id]:data}));
  };

  const toggleExpand = (id)=>{ if(expanded===id) return setExpanded(null); setExpanded(id); fetchMsgs(id); };

  const sendComment = async(challengeId)=>{
    if(!comment.trim()) return;
    const {data} = await supabase.from("messages").insert({challenge_id:challengeId,user_id:user.id,room_code:user.room_code,text:comment}).select("*, users(name,avatar,photo)").single();
    if(data) setMsgMap(p=>({...p,[challengeId]:[...(p[challengeId]||[]),data]}));
    setComment("");
  };

  const complete = async(challengeId)=>{
    const ch = challenges.find(c=>c.id===challengeId);
    const photoProof = taskPhotos[challengeId]||null;
    const {data} = await supabase.from("challenge_completions").insert({challenge_id:challengeId,user_id:user.id,photo_proof:photoProof}).select().single();
    if(data){
      setCompletions(p=>[...p,data]);
      const newXp=(user.xp||0)+ch.xp;
      await supabase.from("users").update({xp:newXp}).eq("id",user.id);
      setUserXp(newXp);
      showToast(`+${ch.xp} XP! 🎉`);
      playSuccess();
      fireConfetti();
      setPendingComplete(null);
    }
  };

  return(
    <div style={{padding:"12px 16px 0"}} className="fade-up">
      <BackBtn onBack={onBack}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:12}}>challenges</h2>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:12}}>
        {filters.map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",border:`1px solid ${filter===f?C.accent:C.border}`,background:filter===f?`${C.accent}20`:C.surface,color:filter===f?C.accent2:C.textMuted,whiteSpace:"nowrap",flexShrink:0,transition:"all 0.2s"}}>
            {f}
          </button>
        ))}
      </div>

      {filtered.map(c=>{
        const myDone=completions.find(x=>x.challenge_id===c.id&&x.user_id===user.id);
        const donePeople=members.filter(m=>m.status!=="left"&&completions.find(x=>x.challenge_id===c.id&&x.user_id===m.id));
        const msgs=msgMap[c.id]||[];
        const isPending=pendingComplete===c.id;
        return(
          <Card key={c.id} style={{marginBottom:12}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
              <div style={{width:46,height:46,borderRadius:14,background:`${c.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,border:`1px solid ${c.color}30`}}>{c.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:15,marginBottom:3}}>{c.title}</div>
                <div style={{fontSize:12,color:C.textMuted,lineHeight:1.5,marginBottom:8}}>{c.description}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {donePeople.map(m=><Badge key={m.id} color={C.green}>{m.id===user.id?"✓ you":m.name}</Badge>)}
                  <Badge color={C.accent}>⚡ +{c.xp} xp</Badge>
                </div>
              </div>
            </div>

            {myDone?.photo_proof&&(
              <div style={{borderRadius:12,overflow:"hidden",marginBottom:10,border:`1px solid ${C.border}`}}>
                <img src={myDone.photo_proof} style={{width:"100%",maxHeight:180,objectFit:"cover",display:"block"}} alt="proof"/>
              </div>
            )}

            {!myDone&&!isPending&&(
              <button onClick={()=>setPendingComplete(c.id)} style={{width:"100%",background:`${c.color}20`,border:`1px solid ${c.color}40`,color:c.color,borderRadius:12,padding:"10px",fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:10}}>
                mark done ✓
              </button>
            )}

            {isPending&&!myDone&&(
              <div style={{marginBottom:10}}>
                <div style={{fontSize:12,color:C.textMuted,marginBottom:8,fontWeight:600}}>📷 add photo proof (optional)</div>
                <div style={{marginTop:4}}>
                  {taskPhotos[c.id]?(
                    <div style={{position:"relative",borderRadius:12,overflow:"hidden",border:`1px solid ${C.border}`}}>
                      <img src={taskPhotos[c.id]} style={{width:"100%",maxHeight:160,objectFit:"cover",display:"block"}} alt="proof"/>
                      <button onClick={()=>setTaskPhotos(p=>({...p,[c.id]:null}))} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.6)",border:"none",borderRadius:8,color:"#fff",padding:"4px 8px",fontSize:11,cursor:"pointer",fontWeight:700}}>✕</button>
                    </div>
                  ):(
                    <label style={{width:"100%",background:C.surface2,border:`1px dashed ${C.border}`,borderRadius:12,padding:"10px",color:C.textMuted,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                      📷 attach photo proof
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setTaskPhotos(p=>({...p,[c.id]:ev.target.result}));r.readAsDataURL(f);}}/>
                    </label>
                  )}
                </div>
                <div style={{display:"flex",gap:8,marginTop:10}}>
                  <button onClick={()=>complete(c.id)} style={{flex:1,background:`linear-gradient(135deg,${C.accent},${C.accent2})`,border:"none",color:"#fff",borderRadius:12,padding:"11px",fontSize:14,fontWeight:700,cursor:"pointer"}}>confirm ✓</button>
                  <button onClick={()=>setPendingComplete(null)} style={{flex:1,background:C.surface2,border:`1px solid ${C.border}`,color:C.textMuted,borderRadius:12,padding:"11px",fontSize:14,fontWeight:600,cursor:"pointer"}}>cancel</button>
                </div>
              </div>
            )}

            {myDone&&<div style={{textAlign:"center",padding:"9px",fontSize:13,fontWeight:700,color:C.green,marginBottom:10}}>✅ done!</div>}

            <button onClick={()=>toggleExpand(c.id)} style={{background:"none",border:"none",color:C.textMuted,fontSize:12,fontWeight:600,cursor:"pointer",padding:0}}>
              💬 {msgs.length} comments {expanded===c.id?"▲":"▼"}
            </button>

            {expanded===c.id&&(
              <div style={{marginTop:10}}>
                {msgs.map((m,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"flex-start"}}>
                    <AvatarEl emoji={m.users?.avatar||"🧑"} photo={m.users?.photo} size={24}/>
                    <div style={{background:C.surface2,borderRadius:12,padding:"8px 12px",flex:1}}>
                      <div style={{fontSize:11,color:C.accent2,fontWeight:700,marginBottom:2}}>{m.users?.name}</div>
                      <div style={{fontSize:13}}>{m.text}</div>
                    </div>
                  </div>
                ))}
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <input value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendComment(c.id)} placeholder="comment..." style={{flex:1,background:C.surface2,border:`1px solid ${C.border}`,borderRadius:12,padding:"8px 12px",fontSize:13,color:C.text,outline:"none"}}/>
                  <button onClick={()=>sendComment(c.id)} style={{background:C.accent,color:"#fff",border:"none",borderRadius:12,padding:"8px 14px",fontWeight:700,cursor:"pointer"}}>→</button>
                </div>
              </div>
            )}
          </Card>
        );
      })}
      <div style={{height:20}}/>
    </div>
  );
}

// ── LEADERBOARD ──
function LeaderboardTab({ user, members, completions, onBack }) {
  const activeMembers = members.filter(m=>m.status!=="left");
  const leftMembers = members.filter(m=>m.status==="left");
  const ranked = [...activeMembers].sort((a,b)=>b.xp-a.xp);
  const medals = ["🥇","🥈","🥉","4️⃣","5️⃣"];

  return(
    <div style={{padding:"16px 16px 0"}} className="fade-up">
      <BackBtn onBack={onBack}/>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:16}}>leaderboard</h2>
      <Card style={{marginBottom:16}} glow>
        <div style={{textAlign:"center",marginBottom:16,padding:"8px 0"}}>
          <div style={{fontSize:48}}>{ranked[0]?.id===user.id?"🏆":"💪"}</div>
          <div style={{fontSize:18,fontWeight:800,marginTop:4}}>{ranked[0]?.id===user.id?"you're winning!":`${ranked[0]?.name} is ahead!`}</div>
          <div style={{fontSize:13,color:C.textMuted}}>keep going 🔥</div>
        </div>
        {ranked.map((m,i)=>(
          <div key={m.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:i<ranked.length-1?`1px solid ${C.border}`:"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20,width:28}}>{medals[i]}</span>
              <AvatarEl emoji={m.avatar} photo={m.photo} size={32} glow={m.id===user.id}/>
              <span style={{fontWeight:700,fontSize:15,color:m.id===user.id?C.accent2:C.text}}>{m.id===user.id?"you":m.name}</span>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,color:m.id===user.id?C.accent2:C.text}}>{m.xp}<span style={{fontSize:10,color:C.textMuted}}> xp</span></div>
              <div style={{fontSize:11,color:C.textMuted}}>{completions.filter(c=>c.user_id===m.id).length} done</div>
            </div>
          </div>
        ))}
      </Card>

      {leftMembers.length>0&&(
        <Card style={{marginBottom:16,opacity:0.6}}>
          <div style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.5,marginBottom:12}}>left the room</div>
          {leftMembers.map(m=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <AvatarEl emoji={m.avatar} photo={m.photo} size={28} greyed/>
                <span style={{fontSize:14,color:C.textMuted}}>{m.name}</span>
              </div>
              <span style={{fontSize:11,color:C.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>{m.xp} xp · left</span>
            </div>
          ))}
        </Card>
      )}
      <div style={{height:20}}/>
    </div>
  );
}

// ── CHAT ──
function ChatTab({ user, members, onBack }) {
  const [messages,setMessages] = useState([]);
  const [text,setText] = useState([]);
  const [textVal,setTextVal] = useState("");
  const [loadingMsgs,setLoadingMsgs] = useState(true);
  const bottomRef = useRef(null);

  useEffect(()=>{
    fetchMessages();
    const channel = supabase.channel(`chat-${user.room_code}`)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"messages",filter:`room_code=eq.${user.room_code}`},payload=>{
        if(!payload.new.challenge_id){
          const sender = members.find(m=>m.id===payload.new.user_id);
          setMessages(p=>[...p,{...payload.new,users:sender}]);
        }
      }).subscribe();
    return()=>supabase.removeChannel(channel);
  },[]);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  const fetchMessages = async()=>{
    const {data} = await supabase.from("messages").select("*, users(name,avatar,photo)").eq("room_code",user.room_code).is("challenge_id",null).order("created_at").limit(100);
    if(data) setMessages(data);
    setLoadingMsgs(false);
  };

  const send = async()=>{
    if(!textVal.trim()) return;
    const msg=textVal.trim(); setTextVal("");
    await supabase.from("messages").insert({room_code:user.room_code,user_id:user.id,text:msg});
  };

  const sendNudge = async()=>{
    const n=NUDGE_MSGS[Math.floor(Math.random()*NUDGE_MSGS.length)];
    await supabase.from("messages").insert({room_code:user.room_code,user_id:user.id,text:`👋 ${n}`});
  };

  return(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)"}} className="fade-up">
      <div style={{padding:"16px 16px 8px",flexShrink:0}}>
        <BackBtn onBack={onBack}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2 style={{fontSize:22,fontWeight:800}}>chat</h2>
          <button onClick={sendNudge} style={{background:`${C.accent}20`,border:`1px solid ${C.accent}44`,borderRadius:12,padding:"6px 14px",color:C.accent2,fontSize:12,fontWeight:700,cursor:"pointer"}}>
            👋 nudge
          </button>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"0 16px"}}>
        {loadingMsgs&&<div style={{textAlign:"center",padding:20}}><Spinner/></div>}
        {messages.map((m,i)=>{
          const isMe=m.user_id===user.id;
          const isSystem=m.type==="system";
          if(isSystem) return(
            <div key={i} style={{textAlign:"center",padding:"8px 0",fontSize:12,color:C.textMuted}}>{m.text}</div>
          );
          return(
            <div key={i} style={{display:"flex",gap:8,marginBottom:10,flexDirection:isMe?"row-reverse":"row",alignItems:"flex-end"}}>
              {!isMe&&<AvatarEl emoji={m.users?.avatar||"🧑"} photo={m.users?.photo} size={28}/>}
              <div style={{maxWidth:"72%"}}>
                {!isMe&&<div style={{fontSize:11,color:C.textMuted,marginBottom:3,marginLeft:4}}>{m.users?.name}</div>}
                <div style={{background:isMe?`linear-gradient(135deg,${C.accent},${C.accent2})`:C.surface,border:isMe?"none":`1px solid ${C.border}`,borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",fontSize:14,color:C.text,lineHeight:1.5}}>
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}/>
      </div>

      <div style={{padding:"12px 16px",borderTop:`1px solid ${C.border}`,display:"flex",gap:8,flexShrink:0}}>
        <input value={textVal} onChange={e=>setTextVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="say something..." style={{flex:1,background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 16px",fontSize:14,color:C.text,outline:"none"}}/>
        <button onClick={send} style={{background:`linear-gradient(135deg,${C.accent},${C.accent2})`,color:"#fff",border:"none",borderRadius:14,padding:"12px 18px",fontWeight:700,cursor:"pointer",fontSize:16}}>→</button>
      </div>
    </div>
  );
}

// ── PROFILE ──
function ProfileTab({ user, setUser, completions, members, onBack }) {
  const [editing,setEditing] = useState(false);
  const [name,setName] = useState(user.name);
  const [avatar,setAvatar] = useState(user.avatar);
  const [photo,setPhoto] = useState(user.photo||null);
  const [leaving,setLeaving] = useState(false);

  const save = async()=>{
    await supabase.from("users").update({name,avatar,photo:photo||null}).eq("id",user.id);
    const updated={...user,name,avatar,photo};
    setUser(updated);
    localStorage.setItem("hawww_user",JSON.stringify(updated));
    setEditing(false);
  };

  const leaveRoom = async()=>{
    setLeaving(true);
    // Mark user as left
    await supabase.from("users").update({status:"left"}).eq("id",user.id);
    // Post system message to chat
    await supabase.from("messages").insert({room_code:user.room_code,user_id:user.id,text:`${user.name} left the room 👋`,type:"system"});
    // Keep profile in localStorage but clear room
    const updated={...user,status:"left"};
    localStorage.setItem("hawww_user",JSON.stringify(updated));
    window.location.reload();
  };

  return(
    <div style={{padding:"16px 16px 0"}} className="fade-up">
      <BackBtn onBack={onBack}/>
      <div style={{background:`linear-gradient(135deg,${C.accent}33,${C.accent2}11)`,border:`1px solid ${C.accent}44`,borderRadius:24,padding:"28px 24px",marginBottom:16,textAlign:"center",position:"relative",overflow:"hidden"}}>
        {editing?(
          <div style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
              <PhotoUpload onPhoto={setPhoto} label="change photo" size={72}/>
            </div>
            <p style={{fontSize:11,color:C.textMuted,marginBottom:10}}>or pick an emoji</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:12}}>
              {AVATARS.map(a=>(
                <button key={a} onClick={()=>{setAvatar(a);setPhoto(null);}} style={{aspectRatio:"1",borderRadius:12,border:`2px solid ${avatar===a&&!photo?C.accent:C.border}`,background:avatar===a&&!photo?`${C.accent}20`:C.surface,fontSize:18,cursor:"pointer"}}>{a}</button>
              ))}
            </div>
            <input value={name} onChange={e=>setName(e.target.value)} style={{background:"rgba(255,255,255,0.1)",border:`1px solid ${C.accent}`,borderRadius:12,padding:"8px 16px",fontSize:16,fontWeight:700,color:C.text,textAlign:"center",outline:"none",width:"80%"}}/>
          </div>
        ):(
          <>
            <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
              <AvatarEl emoji={user.avatar} photo={user.photo} size={72} glow/>
            </div>
            <div style={{fontSize:26,fontWeight:800,marginBottom:4}}>{user.name}</div>
          </>
        )}
        <div style={{fontSize:12,color:C.textMuted,marginBottom:16,fontFamily:"'JetBrains Mono',monospace"}}>{user.room_code}</div>
        <div style={{display:"flex",justifyContent:"center",gap:24}}>
          {[{v:user.xp,l:"xp"},{v:"7🔥",l:"streak"},{v:completions.filter(c=>c.user_id===user.id).length,l:"done"}].map(s=>(
            <div key={s.l}>
              <div style={{fontSize:22,fontWeight:800,color:C.accent2}}>{s.v}</div>
              <div style={{fontSize:11,color:C.textMuted}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {editing?(
          <><PrimaryBtn onClick={save} style={{flex:1}}>save</PrimaryBtn><GhostBtn onClick={()=>setEditing(false)} style={{flex:1}}>cancel</GhostBtn></>
        ):(
          <GhostBtn onClick={()=>setEditing(true)}>edit profile ✏️</GhostBtn>
        )}
      </div>

      <Card style={{marginBottom:16}}>
        <div style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.5,marginBottom:12}}>badges</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[{i:"🔥",l:"7-day streak",c:C.yellow},{i:"🎯",l:"target setter",c:C.accent},{i:"⚡",l:"challenger",c:C.accent2},{i:"🧘",l:"mindful",c:C.green}].map(b=>(
            <div key={b.l} style={{background:`${b.c}12`,border:`1px solid ${b.c}20`,borderRadius:14,padding:"12px",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:4}}>{b.i}</div>
              <div style={{fontSize:11,fontWeight:700,color:b.c}}>{b.l}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{marginBottom:20}}>
        <div style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.5,marginBottom:12}}>room</div>
        <InviteCard roomCode={user.room_code}/>
        {!leaving?(
          <button onClick={leaveRoom} style={{width:"100%",background:"none",border:`1px solid ${C.red}44`,borderRadius:12,padding:"12px",color:C.red,fontSize:14,fontWeight:700,cursor:"pointer",marginTop:4}}>
            leave room 🚪
          </button>
        ):(
          <div style={{textAlign:"center",padding:12,color:C.textMuted,fontSize:13}}>leaving... 👋</div>
        )}
      </Card>
    </div>
  );
}

// ── MAIN ──
export default function HawwwApp() {
  const [user,setUser] = useState(null);
  const [booting,setBooting] = useState(true);
  const [screen,setScreen] = useState("home");
  const [members,setMembers] = useState([]);
  const [targets,setTargets] = useState([]);
  const [challenges,setChallenges] = useState([]);
  const [progress,setProgress] = useState([]);
  const [completions,setCompletions] = useState([]);
  const [toast,setToast] = useState({show:false,msg:""});
  const [userXp,setUserXp] = useState(0);
  const [intervention,setIntervention] = useState(null);

  const showToast = (msg)=>{ setToast({show:true,msg}); setTimeout(()=>setToast({show:false,msg:""}),2500); };

  const checkIntervention = (targets,progress,userId)=>{
    for(const t of targets){
      const p=progress.find(x=>x.target_id===t.id&&x.user_id===userId);
      if(p&&p.minutes_used>t.limit_mins){ setIntervention({target:t,used:p.minutes_used}); return; }
    }
  };

  useEffect(()=>{
    const saved = localStorage.getItem("hawww_user");
    if(saved){
      const u=JSON.parse(saved);
      // If they left a room, clear it and show onboarding
      if(u.status==="left"){ localStorage.removeItem("hawww_user"); setBooting(false); return; }
      setUser(u); setUserXp(u.xp||0);
    }
    setBooting(false);
  },[]);

  useEffect(()=>{
    if(!user) return;
    const load = async()=>{
      const [m,t,c,p,cp] = await Promise.all([
        supabase.from("users").select().eq("room_code",user.room_code),
        supabase.from("targets").select().eq("room_code",user.room_code),
        supabase.from("challenges").select().eq("room_code",user.room_code),
        supabase.from("target_progress").select(),
        supabase.from("challenge_completions").select(),
      ]);
      if(m.data) setMembers(m.data);
      if(t.data) setTargets(t.data);
      if(c.data) setChallenges(c.data);
      if(p.data) setProgress(p.data);
      if(cp.data) setCompletions(cp.data);
      if(t.data&&p.data) checkIntervention(t.data,p.data,user.id);
    };
    load();
    const ch = supabase.channel("rt")
      .on("postgres_changes",{event:"*",schema:"public",table:"users",filter:`room_code=eq.${user.room_code}`},()=>supabase.from("users").select().eq("room_code",user.room_code).then(({data})=>data&&setMembers(data)))
      .on("postgres_changes",{event:"*",schema:"public",table:"target_progress"},()=>supabase.from("target_progress").select().then(({data})=>data&&setProgress(data)))
      .on("postgres_changes",{event:"*",schema:"public",table:"challenge_completions"},()=>supabase.from("challenge_completions").select().then(({data})=>data&&setCompletions(data)))
      .subscribe();
    return()=>supabase.removeChannel(ch);
  },[user]);

  const navItems = [
    {id:"home",icon:"⌂",label:"home"},
    {id:"targets",icon:"◎",label:"targets"},
    {id:"challenges",icon:"⚡",label:"tasks"},
    {id:"leaderboard",icon:"▲",label:"scores"},
    {id:"chat",icon:"◈",label:"chat"},
    {id:"profile",icon:"◉",label:"you"},
  ];

  if(booting) return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{css}</style>
      <div style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:16}}>👋👋👋</div><Spinner/></div>
    </div>
  );

  if(!user) return(<><style>{css}</style><Onboarding onDone={u=>{setUser(u);setUserXp(u.xp||0);}}/></>);

  const u={...user,xp:userXp};

  return(
    <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",color:C.text,position:"relative"}}>
      <style>{css}</style>
      <Toast msg={toast.msg} show={toast.show}/>
      {intervention&&<HawwwIntervention target={intervention.target} used={intervention.used} members={members} onDismiss={()=>setIntervention(null)}/>}

      {/* Header */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"14px 20px",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:5,background:`${C.green}18`,border:`1px solid ${C.green}33`,borderRadius:20,padding:"3px 10px",fontSize:10,color:C.green,fontWeight:700,marginBottom:6}}>
              <span style={{width:5,height:5,background:C.green,borderRadius:"50%",display:"inline-block",animation:"pulse 2s infinite"}}/>live
            </div>
            <div style={{fontSize:28,fontWeight:800,letterSpacing:-1.5,lineHeight:1}}>
              hawww <span style={{background:`linear-gradient(135deg,${C.accent},${C.accent2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>👋</span>
            </div>
            <div style={{fontSize:10,color:C.textMuted,marginTop:2,fontFamily:"'JetBrains Mono',monospace"}}>
              {members.filter(m=>m.status!=="left").length}/5 active · {user.room_code}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:C.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>xp</div>
              <div style={{fontSize:26,fontWeight:800,color:C.accent2,fontFamily:"'JetBrains Mono',monospace"}}>{userXp}</div>
            </div>
            <button onClick={()=>setScreen("profile")} style={{background:"none",border:"none",cursor:"pointer",padding:0}}>
              <AvatarEl emoji={u.avatar} photo={u.photo} size={38} glow/>
            </button>
          </div>
        </div>
      </div>

      {/* Screens */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:72}}>
        {screen==="home"&&<HomeTab user={u} members={members} targets={targets} challenges={challenges} progress={progress} completions={completions} setScreen={setScreen}/>}
        {screen==="targets"&&<TargetsTab user={u} members={members} targets={targets} setTargets={setTargets} progress={progress} setProgress={setProgress} onBack={()=>setScreen("home")}/>}
        {screen==="challenges"&&<ChallengesTab user={u} members={members} challenges={challenges} completions={completions} setCompletions={setCompletions} setUserXp={setUserXp} showToast={showToast} onBack={()=>setScreen("home")}/>}
        {screen==="leaderboard"&&<LeaderboardTab user={u} members={members} completions={completions} onBack={()=>setScreen("home")}/>}
        {screen==="chat"&&<ChatTab user={u} members={members} onBack={()=>setScreen("home")}/>}
        {screen==="profile"&&<ProfileTab user={u} setUser={u=>{setUser(u);setUserXp(u.xp||0);}} completions={completions} members={members} onBack={()=>setScreen("home")}/>}
      </div>

      {/* Nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:C.surface,borderTop:`1px solid ${C.border}`,display:"flex",padding:"8px 0 16px",justifyContent:"space-around",zIndex:100}}>
        {navItems.map(item=>(
          <button key={item.id} onClick={()=>setScreen(item.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"6px 8px",borderRadius:12,background:screen===item.id?`${C.accent}20`:"none",border:"none",minWidth:44,transition:"all 0.2s"}}>
            <span style={{fontSize:screen===item.id?18:15,color:screen===item.id?C.accent2:C.textDim,transition:"color 0.2s"}}>{item.icon}</span>
            <span style={{fontSize:9,fontWeight:700,color:screen===item.id?C.accent2:C.textDim,letterSpacing:0.5}}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
