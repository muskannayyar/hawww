import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nvseblgyejvcexdnpzcx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52c2VibGd5ZWp2Y2V4ZG5wemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NzY5MTgsImV4cCI6MjA5MDM1MjkxOH0.djNjrEqC-a0ZahdL1lWtKhgzwpEU8JbCrYB2J_4QwsE";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AVATARS = ["🧑‍💻","🧕","🧙","🦸","🧜","🧚","🐺","🦊","🐻","🐼","🦁","🐯","🐸","🦋","🐙"];
const NUDGE_MSGS = ["hey put the phone down 👀","skill issue 💀","touch grass challenge unlocked 🌱","your screen time is giving 😬","bet you can't go 30 mins without looking 👾"];

const fmt = (m) => m >= 60 ? `${Math.floor(m/60)}h ${m%60}m` : `${m}m`;
const genCode = () => Math.random().toString(36).substring(2,6).toUpperCase() + "-" + Math.random().toString(36).substring(2,6).toUpperCase();

const C = {
  bg: "#0A0A0F",
  surface: "#12121A",
  surface2: "#1A1A26",
  surface3: "#22222F",
  border: "rgba(255,255,255,0.06)",
  accent: "#7C3AED",
  accent2: "#A855F7",
  accentGlow: "rgba(124,58,237,0.3)",
  green: "#10B981",
  red: "#EF4444",
  yellow: "#F59E0B",
  text: "#F1F0FF",
  textMuted: "#6B6B8A",
  textDim: "#3D3D5C",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0A0F; color: #F1F0FF; font-family: 'Syne', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 0; }
  input, textarea, button { font-family: 'Syne', sans-serif; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(124,58,237,0.3); } 50% { box-shadow: 0 0 40px rgba(124,58,237,0.4); } }
  @keyframes popIn { 0% { transform:scale(0.8); opacity:0; } 70% { transform:scale(1.05); } 100% { transform:scale(1); opacity:1; } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade-up { animation: fadeUp 0.4s ease forwards; }
  button:active { transform: scale(0.97) !important; transition: transform 0.1s; }
`;

function Spinner() {
  return <div style={{width:20,height:20,border:`2px solid rgba(255,255,255,0.1)`,borderTop:`2px solid ${C.accent2}`,borderRadius:"50%",animation:"spin 0.7s linear infinite"}} />;
}

function Toast({ msg, show }) {
  return (
    <div style={{position:"fixed",bottom:100,left:"50%",transform:`translateX(-50%) translateY(${show?0:12}px)`,opacity:show?1:0,transition:"all 0.3s cubic-bezier(.34,1.56,.64,1)",background:C.surface3,color:C.text,border:`1px solid ${C.border}`,borderRadius:14,padding:"10px 20px",fontSize:13,fontWeight:600,zIndex:9999,whiteSpace:"nowrap",boxShadow:`0 8px 30px rgba(0,0,0,0.5)`}}>
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

function AvatarEl({ emoji, size=40, glow=false }) {
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:C.surface3,border:`2px solid ${glow?C.accent:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.45,boxShadow:glow?`0 0 16px ${C.accentGlow}`:"none",flexShrink:0}}>
      {emoji}
    </div>
  );
}

function PrimaryBtn({ children, onClick, loading, style={} }) {
  return (
    <button onClick={onClick} disabled={!!loading} style={{background:`linear-gradient(135deg,${C.accent},${C.accent2})`,color:"#fff",border:"none",borderRadius:14,padding:"14px 28px",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",width:"100%",boxShadow:`0 8px 24px ${C.accentGlow}`,opacity:loading?0.7:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,...style}}>
      {loading ? <Spinner /> : children}
    </button>
  );
}

function GhostBtn({ children, onClick, style={} }) {
  return (
    <button onClick={onClick} style={{background:C.surface2,color:C.text,border:`1px solid ${C.border}`,borderRadius:14,padding:"13px 24px",fontSize:14,fontWeight:600,cursor:"pointer",width:"100%",...style}}>
      {children}
    </button>
  );
}

function Card({ children, style={}, glow=false }) {
  return (
    <div style={{background:C.surface,border:`1px solid ${glow?C.accent+"44":C.border}`,borderRadius:20,padding:"18px 20px",boxShadow:glow?`0 0 24px ${C.accentGlow}`:"none",...style}}>
      {children}
    </div>
  );
}

function ProgressBar({ value, max, color=C.accent }) {
  const pct = Math.min((value/max)*100, 100);
  return (
    <div style={{height:6,background:C.surface3,borderRadius:10,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${pct}%`,background:value>max?C.red:color,borderRadius:10,transition:"width 0.8s cubic-bezier(.34,1.56,.64,1)"}} />
    </div>
  );
}

function Badge({ children, color=C.accent }) {
  return (
    <span style={{display:"inline-flex",alignItems:"center",background:`${color}18`,color,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,border:`1px solid ${color}30`}}>
      {children}
    </span>
  );
}

function InviteCard({ roomCode }) {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}?room=${roomCode}`;
  const copy = () => {
    navigator.clipboard?.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{background:`linear-gradient(135deg,${C.accent}22,${C.accent2}11)`,border:`1px solid ${C.accent}44`,borderRadius:20,padding:"16px 18px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div>
        <div style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>room code</div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:20,fontWeight:500,color:C.text,letterSpacing:3}}>{roomCode}</div>
        <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>share link to invite friends</div>
      </div>
      <button onClick={copy} style={{background:copied?`${C.green}20`:`${C.accent}30`,border:`1px solid ${copied?C.green:C.accent}`,borderRadius:12,padding:"10px 16px",color:copied?C.green:C.accent2,fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap"}}>
        {copied?"✓ copied":"copy link"}
      </button>
    </div>
  );
}

// ── ONBOARDING ──
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [mode, setMode] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("room");
    if (code) { setRoomCode(code.toUpperCase()); setMode("join"); setStep(2); }
  }, []);

  const createRoom = async () => {
    if (!name.trim()) return setError("Add your name first!");
    setLoading(true); setError("");
    try {
      const code = genCode();
      const { error: re } = await supabase.from("rooms").insert({ code, name: `${name}'s Room` });
      if (re) throw re;
      const { data: user, error: ue } = await supabase.from("users").insert({ name: name.trim(), avatar, room_code: code, xp: 0 }).select().single();
      if (ue) throw ue;
      await supabase.from("targets").insert([
        { room_code: code, app: "Instagram", icon: "📸", limit_mins: 60, color: "#E91E8C" },
        { room_code: code, app: "YouTube", icon: "▶️", limit_mins: 90, color: "#EF4444" },
        { room_code: code, app: "TikTok", icon: "🎵", limit_mins: 45, color: C.accent },
      ]);
      await supabase.from("challenges").insert([
        { room_code: code, title: "Morning Move", description: "Log a 15-min walk or run before noon", type: "fitness", icon: "🏃", xp: 50, color: C.green },
        { room_code: code, title: "Screen Break", description: "Put phone down for 30 minutes", type: "mindful", icon: "🧘", xp: 40, color: C.accent },
        { room_code: code, title: "Hydration Check", description: "Drink 8 glasses of water", type: "fitness", icon: "💧", xp: 25, color: "#3B82F6" },
      ]);
      localStorage.setItem("haww_user", JSON.stringify(user));
      onDone(user);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const joinRoom = async () => {
    if (!name.trim()) return setError("Add your name first!");
    if (!roomCode.trim()) return setError("Enter a room code!");
    setLoading(true); setError("");
    try {
      const { data: room } = await supabase.from("rooms").select().eq("code", roomCode.toUpperCase()).single();
      if (!room) throw new Error("Room not found. Check the code!");
      const { count } = await supabase.from("users").select("*", { count: "exact", head: true }).eq("room_code", roomCode.toUpperCase());
      if (count >= 5) throw new Error("Room is full (max 5 people)!");
      const { data: user, error: ue } = await supabase.from("users").insert({ name: name.trim(), avatar, room_code: roomCode.toUpperCase(), xp: 0 }).select().single();
      if (ue) throw ue;
      localStorage.setItem("haww_user", JSON.stringify(user));
      onDone(user);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,${C.accentGlow} 0%,transparent 70%)`,top:"-10%",left:"50%",transform:"translateX(-50%)",pointerEvents:"none"}} />
      <div style={{width:"100%",maxWidth:380,position:"relative",zIndex:1}}>
        <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:40}}>
          {[0,1,2].map(i => (
            <div key={i} style={{width:i===step?28:8,height:8,borderRadius:10,background:i<=step?C.accent:C.surface3,transition:"all 0.3s ease"}} />
          ))}
        </div>

        {step === 0 && (
          <div className="fade-up">
            <div style={{fontSize:64,textAlign:"center",marginBottom:20}}>👋</div>
            <h1 style={{fontSize:40,fontWeight:800,textAlign:"center",marginBottom:8,letterSpacing:-2,lineHeight:1.1}}>
              welcome to{" "}
              <span style={{background:`linear-gradient(135deg,${C.accent},${C.accent2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>haww</span>
            </h1>
            <p style={{color:C.textMuted,textAlign:"center",fontSize:15,lineHeight:1.7,marginBottom:40}}>accountability meets your crew. screen time, but make it social.</p>
            <PrimaryBtn onClick={() => setStep(1)}>let's go →</PrimaryBtn>
          </div>
        )}

        {step === 1 && (
          <div className="fade-up">
            <h2 style={{fontSize:28,fontWeight:800,marginBottom:4}}>who are you?</h2>
            <p style={{color:C.textMuted,fontSize:14,marginBottom:24}}>pick your avatar</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:20}}>
              {AVATARS.map(a => (
                <button key={a} onClick={() => setAvatar(a)} style={{aspectRatio:"1",borderRadius:14,border:`2px solid ${avatar===a?C.accent:C.border}`,background:avatar===a?`${C.accent}20`:C.surface,fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:avatar===a?`0 0 12px ${C.accentGlow}`:"none",transition:"all 0.2s"}}>
                  {a}
                </button>
              ))}
            </div>
            <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key==="Enter"&&(name.trim()?setStep(2):setError("Need a name!"))} placeholder="your name..." style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 18px",fontSize:16,color:C.text,outline:"none",marginBottom:12}} />
            {error && <p style={{color:C.red,fontSize:13,marginBottom:12}}>{error}</p>}
            <PrimaryBtn onClick={() => { if(!name.trim()) return setError("Need a name!"); setError(""); setStep(2); }}>next →</PrimaryBtn>
          </div>
        )}

        {step === 2 && !mode && (
          <div className="fade-up">
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
              <AvatarEl emoji={avatar} size={52} glow />
              <div>
                <div style={{fontSize:20,fontWeight:800}}>{name}</div>
                <div style={{color:C.textMuted,fontSize:13}}>ready to go ✦</div>
              </div>
            </div>
            <h2 style={{fontSize:24,fontWeight:800,marginBottom:4}}>join or create?</h2>
            <p style={{color:C.textMuted,fontSize:14,marginBottom:24}}>start fresh or join your crew</p>
            <PrimaryBtn onClick={() => setMode("create")} style={{marginBottom:10}}>create a room ✦</PrimaryBtn>
            <GhostBtn onClick={() => setMode("join")}>join with a code</GhostBtn>
          </div>
        )}

        {step === 2 && mode === "create" && (
          <div className="fade-up">
            <BackBtn onBack={() => setMode(null)} />
            <h2 style={{fontSize:24,fontWeight:800,marginBottom:4}}>create your room</h2>
            <p style={{color:C.textMuted,fontSize:14,marginBottom:20}}>invite up to 4 friends after</p>
            <Card style={{marginBottom:16}}>
              <div style={{fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>creator</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <AvatarEl emoji={avatar} size={36} />
                <span style={{fontSize:15,fontWeight:700}}>{name}</span>
              </div>
            </Card>
            {error && <p style={{color:C.red,fontSize:13,marginBottom:12}}>{error}</p>}
            <PrimaryBtn onClick={createRoom} loading={loading}>create room 🚀</PrimaryBtn>
          </div>
        )}

        {step === 2 && mode === "join" && (
          <div className="fade-up">
            <BackBtn onBack={() => { setMode(null); const p=new URLSearchParams(window.location.search); if(p.get("room")) window.history.replaceState({},"",window.location.pathname); }} />
            <h2 style={{fontSize:24,fontWeight:800,marginBottom:4}}>join a room</h2>
            <p style={{color:C.textMuted,fontSize:14,marginBottom:20}}>enter the code your friend shared</p>
            <input value={roomCode} onChange={e => setRoomCode(e.target.value.toUpperCase())} placeholder="XXXX-XXXX" style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 18px",fontSize:20,color:C.text,outline:"none",marginBottom:16,letterSpacing:4,textAlign:"center",fontFamily:"'DM Mono',monospace"}} />
            {error && <p style={{color:C.red,fontSize:13,marginBottom:12}}>{error}</p>}
            <PrimaryBtn onClick={joinRoom} loading={loading}>join room →</PrimaryBtn>
          </div>
        )}
      </div>
    </div>
  );
}

// ── HOME ──
function HomeTab({ user, members, targets, challenges, progress, completions, setScreen }) {
  const myProgress = progress.filter(p => p.user_id === user.id);
  const myCompletions = completions.filter(c => c.user_id === user.id);
  const onTrack = targets.filter(t => { const p = myProgress.find(x => x.target_id === t.id); return !p || p.minutes_used <= t.limit_mins; }).length;

  return (
    <div style={{padding:"16px 16px 0"}} className="fade-up">
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[{l:"on track",v:`${onTrack}/${targets.length}`,c:C.green,i:"🎯"},{l:"challenges",v:`${myCompletions.length}/${challenges.length}`,c:C.accent2,i:"⚡"},{l:"streak",v:"7d",c:C.yellow,i:"🔥"}].map(s => (
          <div key={s.l} style={{flex:1,background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:"12px 8px",textAlign:"center"}}>
            <div style={{fontSize:18,marginBottom:4}}>{s.i}</div>
            <div style={{fontSize:16,fontWeight:800,color:s.c}}>{s.v}</div>
            <div style={{fontSize:10,fontWeight:600,color:C.textMuted,marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>

      <InviteCard roomCode={user.room_code} />

      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>in this room</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {members.map(m => (
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:8,background:C.surface,border:`1px solid ${C.border}`,borderRadius:30,padding:"6px 12px 6px 6px"}}>
              <AvatarEl emoji={m.avatar} size={26} glow={m.id===user.id} />
              <span style={{fontSize:13,fontWeight:700,color:m.id===user.id?C.accent2:C.text}}>{m.id===user.id?"you":m.name}</span>
              <span style={{fontSize:10,color:C.textMuted,fontFamily:"'DM Mono',monospace"}}>{m.xp}xp</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:16,fontWeight:800}}>targets</span>
          <button onClick={() => setScreen("targets")} style={{background:"none",border:"none",color:C.accent2,fontWeight:700,fontSize:13,cursor:"pointer"}}>see all →</button>
        </div>
        {targets.slice(0,3).map(t => {
          const p = myProgress.find(x => x.target_id === t.id);
          const used = p?.minutes_used || 0;
          return (
            <Card key={t.id} style={{marginBottom:8,borderLeft:`3px solid ${t.color}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:18}}>{t.icon}</span>
                  <span style={{fontWeight:700,fontSize:14}}>{t.app}</span>
                </div>
                <Badge color={used>t.limit_mins?C.red:C.green}>{used>t.limit_mins?`+${used-t.limit_mins}m over`:"✓ good"}</Badge>
              </div>
              <ProgressBar value={used} max={t.limit_mins} color={t.color} />
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textMuted,marginTop:5,fontFamily:"'DM Mono',monospace"}}>
                <span>{fmt(used)} used</span><span>{fmt(t.limit_mins)} limit</span>
              </div>
            </Card>
          );
        })}
      </div>

      <div style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:16,fontWeight:800}}>challenges</span>
          <button onClick={() => setScreen("challenges")} style={{background:"none",border:"none",color:C.accent2,fontWeight:700,fontSize:13,cursor:"pointer"}}>see all →</button>
        </div>
        {challenges.slice(0,2).map(c => {
          const done = completions.find(x => x.challenge_id === c.id && x.user_id === user.id);
          return (
            <Card key={c.id} style={{marginBottom:8,display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:42,height:42,borderRadius:14,background:`${c.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{c.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{c.title}</div>
                <div style={{display:"flex",gap:6}}><Badge color={done?C.green:C.accent}>{done?"✓ done":"pending"}</Badge></div>
              </div>
              <span style={{fontFamily:"'DM Mono',monospace",color:C.accent2,fontSize:13}}>+{c.xp}</span>
            </Card>
          );
        })}
      </div>
      <div style={{height:20}} />
    </div>
  );
}

// ── TARGETS ──
function TargetsTab({ user, members, targets, setTargets, progress, setProgress, onBack }) {
  const [adding, setAdding] = useState(false);
  const [newApp, setNewApp] = useState({ name:"", icon:"📱", limit:30 });
  const [saving, setSaving] = useState(false);

  const getUsed = (targetId, userId) => (progress.find(x => x.target_id === targetId && x.user_id === userId)?.minutes_used || 0);

  const updateProgress = async (targetId, delta) => {
    const existing = progress.find(x => x.target_id === targetId && x.user_id === user.id);
    const newVal = Math.max(0, (existing?.minutes_used || 0) + delta);
    if (existing) {
      await supabase.from("target_progress").update({ minutes_used: newVal }).eq("id", existing.id);
      setProgress(p => p.map(x => x.id === existing.id ? {...x, minutes_used: newVal} : x));
    } else {
      const { data } = await supabase.from("target_progress").insert({ target_id: targetId, user_id: user.id, minutes_used: Math.max(0,delta) }).select().single();
      if (data) setProgress(p => [...p, data]);
    }
  };

  const addTarget = async () => {
    if (!newApp.name.trim()) return;
    setSaving(true);
    const { data } = await supabase.from("targets").insert({ room_code: user.room_code, app: newApp.name, icon: newApp.icon, limit_mins: newApp.limit, color: C.accent }).select().single();
    if (data) setTargets(t => [...t, data]);
    setAdding(false); setNewApp({ name:"", icon:"📱", limit:30 }); setSaving(false);
  };

  return (
    <div style={{padding:"16px 16px 0"}} className="fade-up">
      <BackBtn onBack={onBack} />
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:4}}>screen time</h2>
      <p style={{color:C.textMuted,fontSize:13,marginBottom:16}}>everyone's usage · today</p>

      {targets.map(t => (
        <Card key={t.id} style={{marginBottom:12,borderLeft:`3px solid ${t.color}`}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
            <div style={{width:40,height:40,borderRadius:12,background:`${t.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{t.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:15}}>{t.app}</div>
              <div style={{fontSize:11,color:C.textMuted,fontFamily:"'DM Mono',monospace"}}>limit · {fmt(t.limit_mins)}/day</div>
            </div>
          </div>
          {members.map(m => {
            const used = getUsed(t.id, m.id);
            const isMe = m.id === user.id;
            return (
              <div key={m.id} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <AvatarEl emoji={m.avatar} size={20} />
                    <span style={{fontSize:12,fontWeight:700,color:isMe?C.accent2:C.text}}>{isMe?"you":m.name}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    {isMe && (
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={() => updateProgress(t.id,-15)} style={{background:C.surface3,border:"none",borderRadius:8,width:26,height:26,color:C.text,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                        <button onClick={() => updateProgress(t.id,15)} style={{background:C.surface3,border:"none",borderRadius:8,width:26,height:26,color:C.text,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                      </div>
                    )}
                    <span style={{fontSize:12,fontFamily:"'DM Mono',monospace",color:used>t.limit_mins?C.red:C.green,minWidth:36,textAlign:"right"}}>{fmt(used)}</span>
                  </div>
                </div>
                <ProgressBar value={used} max={t.limit_mins} color={t.color} />
              </div>
            );
          })}
        </Card>
      ))}

      {adding ? (
        <Card style={{marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>new target</div>
          <input value={newApp.name} onChange={e => setNewApp(p => ({...p,name:e.target.value}))} placeholder="app name" style={{width:"100%",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:12,padding:"10px 14px",fontSize:14,color:C.text,outline:"none",marginBottom:10}} />
          <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
            {["📱","🎮","🛒","📺","💼","📰","🎵","📸"].map(e => (
              <button key={e} onClick={() => setNewApp(p => ({...p,icon:e}))} style={{width:36,height:36,borderRadius:10,border:`2px solid ${newApp.icon===e?C.accent:C.border}`,background:newApp.icon===e?`${C.accent}20`:C.surface2,fontSize:16,cursor:"pointer"}}>{e}</button>
            ))}
          </div>
          <div style={{fontSize:12,color:C.textMuted,marginBottom:6,fontFamily:"'DM Mono',monospace"}}>daily limit: {newApp.limit}m</div>
          <input type="range" min={10} max={180} step={5} value={newApp.limit} onChange={e => setNewApp(p => ({...p,limit:+e.target.value}))} style={{width:"100%",accentColor:C.accent,marginBottom:14}} />
          <div style={{display:"flex",gap:8}}>
            <PrimaryBtn onClick={addTarget} loading={saving} style={{flex:1}}>add</PrimaryBtn>
            <GhostBtn onClick={() => setAdding(false)} style={{flex:1}}>cancel</GhostBtn>
          </div>
        </Card>
      ) : (
        <PrimaryBtn onClick={() => setAdding(true)} style={{marginBottom:20}}>+ add target</PrimaryBtn>
      )}
    </div>
  );
}

// ── CHALLENGES ──
function ChallengesTab({ user, members, challenges, completions, setCompletions, setUserXp, showToast, onBack }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [msgMap, setMsgMap] = useState({});
  const [comment, setComment] = useState("");
  const filters = ["all","fitness","mindful","social"];
  const filtered = filter==="all" ? challenges : challenges.filter(c => c.type===filter);

  const fetchMsgs = async (id) => {
    const { data } = await supabase.from("messages").select("*, users(name,avatar)").eq("challenge_id", id).order("created_at");
    if (data) setMsgMap(p => ({...p, [id]: data}));
  };

  const toggleExpand = (id) => {
    if (expanded===id) return setExpanded(null);
    setExpanded(id); fetchMsgs(id);
  };

  const sendComment = async (challengeId) => {
    if (!comment.trim()) return;
    const { data } = await supabase.from("messages").insert({ challenge_id: challengeId, user_id: user.id, room_code: user.room_code, text: comment }).select("*, users(name,avatar)").single();
    if (data) setMsgMap(p => ({...p, [challengeId]: [...(p[challengeId]||[]), data]}));
    setComment("");
  };

  const complete = async (challengeId) => {
    const ch = challenges.find(c => c.id===challengeId);
    const { data } = await supabase.from("challenge_completions").insert({ challenge_id: challengeId, user_id: user.id }).select().single();
    if (data) {
      setCompletions(p => [...p, data]);
      const newXp = (user.xp||0) + ch.xp;
      await supabase.from("users").update({ xp: newXp }).eq("id", user.id);
      setUserXp(newXp);
      showToast(`+${ch.xp} XP! 🎉`);
    }
  };

  return (
    <div style={{padding:"12px 16px 0"}} className="fade-up">
      <BackBtn onBack={onBack} />
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:12}}>challenges</h2>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:12}}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",border:`1px solid ${filter===f?C.accent:C.border}`,background:filter===f?`${C.accent}20`:C.surface,color:filter===f?C.accent2:C.textMuted,whiteSpace:"nowrap",flexShrink:0,transition:"all 0.2s"}}>
            {f}
          </button>
        ))}
      </div>

      {filtered.map(c => {
        const myDone = completions.find(x => x.challenge_id===c.id && x.user_id===user.id);
        const donePeople = members.filter(m => completions.find(x => x.challenge_id===c.id && x.user_id===m.id));
        const msgs = msgMap[c.id] || [];
        return (
          <Card key={c.id} style={{marginBottom:12}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
              <div style={{width:46,height:46,borderRadius:14,background:`${c.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,border:`1px solid ${c.color}30`}}>{c.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:15,marginBottom:3}}>{c.title}</div>
                <div style={{fontSize:12,color:C.textMuted,lineHeight:1.5,marginBottom:8}}>{c.description}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {donePeople.map(m => <Badge key={m.id} color={C.green}>{m.id===user.id?"✓ you":m.name}</Badge>)}
                  <Badge color={C.accent}>⚡ +{c.xp} xp</Badge>
                </div>
              </div>
            </div>

            {!myDone ? (
              <button onClick={() => complete(c.id)} style={{width:"100%",background:`${c.color}20`,border:`1px solid ${c.color}40`,color:c.color,borderRadius:12,padding:"10px",fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:10}}>
                mark done ✓
              </button>
            ) : (
              <div style={{textAlign:"center",padding:"9px",fontSize:13,fontWeight:700,color:C.green,marginBottom:10}}>✅ done!</div>
            )}

            <button onClick={() => toggleExpand(c.id)} style={{background:"none",border:"none",color:C.textMuted,fontSize:12,fontWeight:600,cursor:"pointer",padding:0}}>
              💬 {msgs.length} comments {expanded===c.id?"▲":"▼"}
            </button>

            {expanded===c.id && (
              <div style={{marginTop:10}}>
                {msgs.map((m,i) => (
                  <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"flex-start"}}>
                    <AvatarEl emoji={m.users?.avatar||"🧑"} size={24} />
                    <div style={{background:C.surface2,borderRadius:12,padding:"8px 12px",flex:1}}>
                      <div style={{fontSize:11,color:C.accent2,fontWeight:700,marginBottom:2}}>{m.users?.name}</div>
                      <div style={{fontSize:13}}>{m.text}</div>
                    </div>
                  </div>
                ))}
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <input value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key==="Enter"&&sendComment(c.id)} placeholder="comment..." style={{flex:1,background:C.surface2,border:`1px solid ${C.border}`,borderRadius:12,padding:"8px 12px",fontSize:13,color:C.text,outline:"none"}} />
                  <button onClick={() => sendComment(c.id)} style={{background:C.accent,color:"#fff",border:"none",borderRadius:12,padding:"8px 14px",fontWeight:700,cursor:"pointer"}}>→</button>
                </div>
              </div>
            )}
          </Card>
        );
      })}
      <div style={{height:20}} />
    </div>
  );
}

// ── LEADERBOARD ──
function LeaderboardTab({ user, members, completions, onBack }) {
  const ranked = [...members].sort((a,b) => b.xp-a.xp);
  const medals = ["🥇","🥈","🥉","4️⃣","5️⃣"];
  return (
    <div style={{padding:"16px 16px 0"}} className="fade-up">
      <BackBtn onBack={onBack} />
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:16}}>leaderboard</h2>
      <Card style={{marginBottom:16}} glow>
        <div style={{textAlign:"center",marginBottom:16,padding:"8px 0"}}>
          <div style={{fontSize:48}}>{ranked[0]?.id===user.id?"🏆":"💪"}</div>
          <div style={{fontSize:18,fontWeight:800,marginTop:4}}>{ranked[0]?.id===user.id?"you're winning!": `${ranked[0]?.name} is ahead!`}</div>
          <div style={{fontSize:13,color:C.textMuted}}>keep going 🔥</div>
        </div>
        {ranked.map((m,i) => (
          <div key={m.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:i<ranked.length-1?`1px solid ${C.border}`:"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20,width:28}}>{medals[i]}</span>
              <AvatarEl emoji={m.avatar} size={32} glow={m.id===user.id} />
              <span style={{fontWeight:700,fontSize:15,color:m.id===user.id?C.accent2:C.text}}>{m.id===user.id?"you":m.name}</span>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:18,color:m.id===user.id?C.accent2:C.text}}>{m.xp}<span style={{fontSize:10,color:C.textMuted}}> xp</span></div>
              <div style={{fontSize:11,color:C.textMuted}}>{completions.filter(c=>c.user_id===m.id).length} done</div>
            </div>
          </div>
        ))}
      </Card>
      <div style={{height:20}} />
    </div>
  );
}

// ── CHAT ──
function ChatTab({ user, members, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const channel = supabase.channel(`chat-${user.room_code}`)
      .on("postgres_changes", { event:"INSERT", schema:"public", table:"messages", filter:`room_code=eq.${user.room_code}` }, payload => {
        const sender = members.find(m => m.id===payload.new.user_id);
        if (!payload.new.challenge_id) setMessages(p => [...p, {...payload.new, users: sender}]);
      }).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase.from("messages").select("*, users(name,avatar)").eq("room_code", user.room_code).is("challenge_id", null).order("created_at").limit(100);
    if (data) setMessages(data);
    setLoadingMsgs(false);
  };

  const send = async () => {
    if (!text.trim()) return;
    const msg = text.trim(); setText("");
    await supabase.from("messages").insert({ room_code: user.room_code, user_id: user.id, text: msg });
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)"}} className="fade-up">
      <div style={{padding:"16px 16px 8px",flexShrink:0}}>
        <BackBtn onBack={onBack} />
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2 style={{fontSize:22,fontWeight:800}}>chat</h2>
          <button onClick={async () => { const n=NUDGE_MSGS[Math.floor(Math.random()*NUDGE_MSGS.length)]; await supabase.from("messages").insert({room_code:user.room_code,user_id:user.id,text:`👋 ${n}`}); }} style={{background:`${C.accent}20`,border:`1px solid ${C.accent}44`,borderRadius:12,padding:"6px 14px",color:C.accent2,fontSize:12,fontWeight:700,cursor:"pointer"}}>
            👋 nudge
          </button>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"0 16px"}}>
        {loadingMsgs && <div style={{textAlign:"center",padding:20}}><Spinner /></div>}
        {messages.map((m,i) => {
          const isMe = m.user_id===user.id;
          return (
            <div key={i} style={{display:"flex",gap:8,marginBottom:10,flexDirection:isMe?"row-reverse":"row",alignItems:"flex-end"}}>
              {!isMe && <AvatarEl emoji={m.users?.avatar||"🧑"} size={28} />}
              <div style={{maxWidth:"72%"}}>
                {!isMe && <div style={{fontSize:11,color:C.textMuted,marginBottom:3,marginLeft:4}}>{m.users?.name}</div>}
                <div style={{background:isMe?`linear-gradient(135deg,${C.accent},${C.accent2})`:C.surface,border:isMe?"none":`1px solid ${C.border}`,borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",fontSize:14,color:C.text,lineHeight:1.5}}>
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div style={{padding:"12px 16px",borderTop:`1px solid ${C.border}`,display:"flex",gap:8,flexShrink:0}}>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key==="Enter"&&send()} placeholder="say something..." style={{flex:1,background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 16px",fontSize:14,color:C.text,outline:"none"}} />
        <button onClick={send} style={{background:`linear-gradient(135deg,${C.accent},${C.accent2})`,color:"#fff",border:"none",borderRadius:14,padding:"12px 18px",fontWeight:700,cursor:"pointer",fontSize:16}}>→</button>
      </div>
    </div>
  );
}

// ── PROFILE ──
function ProfileTab({ user, setUser, completions, onBack }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);

  const save = async () => {
    await supabase.from("users").update({ name, avatar }).eq("id", user.id);
    const updated = {...user, name, avatar};
    setUser(updated);
    localStorage.setItem("haww_user", JSON.stringify(updated));
    setEditing(false);
  };

  return (
    <div style={{padding:"16px 16px 0"}} className="fade-up">
      <BackBtn onBack={onBack} />
      <div style={{background:`linear-gradient(135deg,${C.accent}33,${C.accent2}11)`,border:`1px solid ${C.accent}44`,borderRadius:24,padding:"28px 24px",marginBottom:16,textAlign:"center",position:"relative",overflow:"hidden"}}>
        {editing ? (
          <div style={{marginBottom:12}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:12}}>
              {AVATARS.map(a => (
                <button key={a} onClick={() => setAvatar(a)} style={{aspectRatio:"1",borderRadius:12,border:`2px solid ${avatar===a?C.accent:C.border}`,background:avatar===a?`${C.accent}20`:C.surface,fontSize:18,cursor:"pointer"}}>{a}</button>
              ))}
            </div>
            <input value={name} onChange={e => setName(e.target.value)} style={{background:"rgba(255,255,255,0.1)",border:`1px solid ${C.accent}`,borderRadius:12,padding:"8px 16px",fontSize:16,fontWeight:700,color:C.text,textAlign:"center",outline:"none",width:"80%"}} />
          </div>
        ) : (
          <>
            <AvatarEl emoji={user.avatar} size={72} glow />
            <div style={{fontSize:26,fontWeight:800,marginTop:12,marginBottom:4}}>{user.name}</div>
          </>
        )}
        <div style={{fontSize:12,color:C.textMuted,marginBottom:16,fontFamily:"'DM Mono',monospace"}}>{user.room_code}</div>
        <div style={{display:"flex",justifyContent:"center",gap:24}}>
          {[{v:user.xp,l:"xp"},{v:"7🔥",l:"streak"},{v:completions.filter(c=>c.user_id===user.id).length,l:"done"}].map(s => (
            <div key={s.l}>
              <div style={{fontSize:22,fontWeight:800,color:C.accent2}}>{s.v}</div>
              <div style={{fontSize:11,color:C.textMuted}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {editing ? (
          <><PrimaryBtn onClick={save} style={{flex:1}}>save</PrimaryBtn><GhostBtn onClick={() => setEditing(false)} style={{flex:1}}>cancel</GhostBtn></>
        ) : (
          <GhostBtn onClick={() => setEditing(true)}>edit profile ✏️</GhostBtn>
        )}
      </div>

      <Card style={{marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>badges</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[{i:"🔥",l:"7-day streak",c:C.yellow},{i:"🎯",l:"target setter",c:C.accent},{i:"⚡",l:"challenger",c:C.accent2},{i:"🧘",l:"mindful",c:C.green}].map(b => (
            <div key={b.l} style={{background:`${b.c}12`,border:`1px solid ${b.c}20`,borderRadius:14,padding:"12px",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:4}}>{b.i}</div>
              <div style={{fontSize:11,fontWeight:700,color:b.c}}>{b.l}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{marginBottom:20}}>
        <div style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>room</div>
        <InviteCard roomCode={user.room_code} />
        <button onClick={() => { localStorage.removeItem("haww_user"); window.location.reload(); }} style={{width:"100%",background:"none",border:`1px solid ${C.red}44`,borderRadius:12,padding:"12px",color:C.red,fontSize:14,fontWeight:700,cursor:"pointer",marginTop:4}}>
          leave room 🚪
        </button>
      </Card>
    </div>
  );
}

// ── MAIN ──
export default function HawwApp() {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [screen, setScreen] = useState("home");
  const [members, setMembers] = useState([]);
  const [targets, setTargets] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [progress, setProgress] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [toast, setToast] = useState({ show:false, msg:"" });
  const [userXp, setUserXp] = useState(0);

  const showToast = (msg) => { setToast({show:true,msg}); setTimeout(() => setToast({show:false,msg:""}), 2500); };

  useEffect(() => {
    const saved = localStorage.getItem("haww_user");
    if (saved) { const u = JSON.parse(saved); setUser(u); setUserXp(u.xp||0); }
    setBooting(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [m,t,c,p,cp] = await Promise.all([
        supabase.from("users").select().eq("room_code",user.room_code),
        supabase.from("targets").select().eq("room_code",user.room_code),
        supabase.from("challenges").select().eq("room_code",user.room_code),
        supabase.from("target_progress").select(),
        supabase.from("challenge_completions").select(),
      ]);
      if (m.data) setMembers(m.data);
      if (t.data) setTargets(t.data);
      if (c.data) setChallenges(c.data);
      if (p.data) setProgress(p.data);
      if (cp.data) setCompletions(cp.data);
    };
    load();
    const ch = supabase.channel("rt")
      .on("postgres_changes",{event:"*",schema:"public",table:"users",filter:`room_code=eq.${user.room_code}`},() => supabase.from("users").select().eq("room_code",user.room_code).then(({data}) => data && setMembers(data)))
      .on("postgres_changes",{event:"*",schema:"public",table:"target_progress"},() => supabase.from("target_progress").select().then(({data}) => data && setProgress(data)))
      .on("postgres_changes",{event:"*",schema:"public",table:"challenge_completions"},() => supabase.from("challenge_completions").select().then(({data}) => data && setCompletions(data)))
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [user]);

  const navItems = [
    {id:"home",icon:"⌂",label:"home"},
    {id:"targets",icon:"◎",label:"targets"},
    {id:"challenges",icon:"⚡",label:"tasks"},
    {id:"leaderboard",icon:"▲",label:"scores"},
    {id:"chat",icon:"◈",label:"chat"},
    {id:"profile",icon:"◉",label:"you"},
  ];

  if (booting) return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{css}</style>
      <div style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:16}}>👋</div><Spinner /></div>
    </div>
  );

  if (!user) return (<><style>{css}</style><Onboarding onDone={u => { setUser(u); setUserXp(u.xp||0); }} /></>);

  const u = {...user, xp: userXp};

  return (
    <div style={{fontFamily:"'Syne',sans-serif",background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",color:C.text,position:"relative"}}>
      <style>{css}</style>
      <Toast msg={toast.msg} show={toast.show} />

      {/* Header */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"16px 20px 16px",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:5,background:`${C.green}18`,border:`1px solid ${C.green}33`,borderRadius:20,padding:"3px 10px",fontSize:10,color:C.green,fontWeight:700,marginBottom:6}}>
              <span style={{width:5,height:5,background:C.green,borderRadius:"50%",display:"inline-block",animation:"pulse 2s infinite"}}/>live
            </div>
            <div style={{fontSize:26,fontWeight:800,letterSpacing:-1,lineHeight:1}}>
              haww <span style={{background:`linear-gradient(135deg,${C.accent},${C.accent2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>👋</span>
            </div>
            <div style={{fontSize:10,color:C.textMuted,marginTop:2,fontFamily:"'DM Mono',monospace"}}>{members.length}/5 in room · {user.room_code}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:C.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>xp</div>
            <div style={{fontSize:26,fontWeight:800,color:C.accent2,fontFamily:"'DM Mono',monospace"}}>{userXp}</div>
          </div>
        </div>
      </div>

      {/* Screens */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:72}}>
        {screen==="home" && <HomeTab user={u} members={members} targets={targets} challenges={challenges} progress={progress} completions={completions} setScreen={setScreen} />}
        {screen==="targets" && <TargetsTab user={u} members={members} targets={targets} setTargets={setTargets} progress={progress} setProgress={setProgress} onBack={() => setScreen("home")} />}
        {screen==="challenges" && <ChallengesTab user={u} members={members} challenges={challenges} completions={completions} setCompletions={setCompletions} setUserXp={setUserXp} showToast={showToast} onBack={() => setScreen("home")} />}
        {screen==="leaderboard" && <LeaderboardTab user={u} members={members} completions={completions} onBack={() => setScreen("home")} />}
        {screen==="chat" && <ChatTab user={u} members={members} onBack={() => setScreen("home")} />}
        {screen==="profile" && <ProfileTab user={u} setUser={u => { setUser(u); setUserXp(u.xp||0); }} completions={completions} onBack={() => setScreen("home")} />}
      </div>

      {/* Nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:C.surface,borderTop:`1px solid ${C.border}`,display:"flex",padding:"8px 0 16px",justifyContent:"space-around",zIndex:100}}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setScreen(item.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"6px 8px",borderRadius:12,background:screen===item.id?`${C.accent}20`:"none",border:"none",minWidth:44,transition:"all 0.2s"}}>
            <span style={{fontSize:screen===item.id?18:15,color:screen===item.id?C.accent2:C.textDim,transition:"color 0.2s"}}>{item.icon}</span>
            <span style={{fontSize:9,fontWeight:700,color:screen===item.id?C.accent2:C.textDim,letterSpacing:0.5}}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
