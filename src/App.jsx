import { useState, useEffect } from "react";

const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fredoka+One&family=DM+Sans:wght@400;500;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
};

const ME = { name: "You", avatar: "🧑‍💻", color: "#FF6B35" };
const FRIEND = { name: "Zara", avatar: "🧕", color: "#4ECDC4", xp: 80 };
const ROOM_CODE = "HAWW-4821";

const INIT_TARGETS = [
  { id:1, app:"Instagram", icon:"📸", limit:60, you:42, friend:78, color:"#E91E8C", reactions:["❤️","😮"] },
  { id:2, app:"YouTube", icon:"▶️", limit:90, you:110, friend:55, color:"#FF0000", reactions:["😬"] },
  { id:3, app:"Twitter / X", icon:"🐦", limit:30, you:18, friend:44, color:"#1DA1F2", reactions:[] },
  { id:4, app:"TikTok", icon:"🎵", limit:45, you:51, friend:29, color:"#555", reactions:["🔥","🤣"] },
  { id:5, app:"WhatsApp", icon:"💬", limit:60, you:31, friend:29, color:"#25D366", reactions:["👍"] },
  { id:6, app:"Reddit", icon:"🤖", limit:30, you:22, friend:50, color:"#FF4500", reactions:[] },
];

const INIT_CHALLENGES = [
  { id:1, type:"fitness", icon:"🏃", title:"Morning Move", desc:"Log a 15-min walk or run before noon", youDone:false, friendDone:true, color:"#FF6B35", xp:50, comments:["Zara: Done! 🏃‍♀️ felt amazing"], reactions:{"🔥":2,"💪":1} },
  { id:2, type:"photo", icon:"📷", title:"Photo of the Day", desc:"Share something that made you smile today", youDone:true, friendDone:true, color:"#845EC2", xp:30, comments:["Zara: my morning coffee ☕","You: sunset from my window 🌅"], reactions:{"❤️":3,"😍":2} },
  { id:3, type:"mindful", icon:"🧘", title:"30-min Screen Break", desc:"Put your phone down for half an hour", youDone:false, friendDone:false, color:"#4ECDC4", xp:40, comments:[], reactions:{} },
  { id:4, type:"fitness", icon:"💧", title:"Hydration Check", desc:"Drink 8 glasses of water today", youDone:false, friendDone:true, color:"#3498DB", xp:25, comments:["Zara: already at 6! 💧"], reactions:{"💪":1} },
  { id:5, type:"social", icon:"📵", title:"No Phone Dinner", desc:"Phone face-down during your next meal", youDone:true, friendDone:false, color:"#2ECC71", xp:35, comments:["You: actually felt so nice 😌"], reactions:{"👏":2} },
  { id:6, type:"mindful", icon:"📖", title:"Read 10 Pages", desc:"Pick up a book instead of your feed", youDone:false, friendDone:true, color:"#F39C12", xp:30, comments:["Zara: reading Atomic Habits 📚"], reactions:{"❤️":1} },
];

const NUDGE_MSGS = ["hey put the phone down 👀","zara says: skill issue 💀","touch grass challenge unlocked 🌱","your screen time is giving 😬","bet you can't go 30 mins without looking 👾"];
const ALL_EMOJI = ["❤️","🔥","💪","😬","😍","👏","💀","👀"];

const fmt = (m) => m >= 60 ? `${Math.floor(m/60)}h ${m%60}m` : `${m}m`;
const pct = (v,m) => Math.min((v/m)*100,100);

function Confetti({ show }) {
  if (!show) return null;
  return (
    <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:9999}}>
      {Array.from({length:24}).map((_,i) => (
        <div key={i} style={{position:"absolute",left:`${15+Math.random()*70}%`,top:`${Math.random()*45}%`,width:i%3===0?12:8,height:i%3===0?12:8,background:["#FF6B35","#4ECDC4","#845EC2","#FFD700","#FF4757","#2ECC71"][i%6],borderRadius:i%2===0?"50%":3,animation:`cfetti ${0.7+Math.random()*0.8}s ease forwards`,animationDelay:`${Math.random()*0.3}s`}}/>
      ))}
      <div style={{position:"absolute",top:"36%",left:"50%",transform:"translate(-50%,-50%)",fontSize:54,animation:"popIn 0.4s ease forwards"}}>🎉</div>
    </div>
  );
}

function Toast({ msg, show }) {
  return (
    <div style={{position:"fixed",bottom:90,left:"50%",transform:`translateX(-50%) translateY(${show?0:16}px)`,opacity:show?1:0,transition:"all 0.3s cubic-bezier(.34,1.56,.64,1)",background:"#1A1A2E",color:"#fff",borderRadius:20,padding:"10px 22px",fontSize:13,fontWeight:700,zIndex:9998,whiteSpace:"nowrap",boxShadow:"0 8px 30px rgba(0,0,0,0.2)",fontFamily:"DM Sans, sans-serif"}}>
      {msg}
    </div>
  );
}

function ProgressBar({ value, max, color }) {
  return (
    <div style={{height:8,background:"#F0F0F0",borderRadius:10,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${pct(value,max)}%`,background:value>max?"#FF4757":color,borderRadius:10,transition:"width 0.9s cubic-bezier(.34,1.56,.64,1)"}}/>
    </div>
  );
}

function Badge({ children, color="#FF6B35", bg }) {
  return <span style={{display:"inline-flex",alignItems:"center",gap:3,background:bg||`${color}18`,color,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,fontFamily:"DM Sans, sans-serif"}}>{children}</span>;
}

function NudgeBtn({ onNudge }) {
  const [sent,setSent] = useState(false);
  return (
    <button onClick={()=>{if(sent)return;setSent(true);onNudge();setTimeout(()=>setSent(false),3000);}} style={{background:sent?"#F0FFF4":"#FFF0EB",color:sent?"#2ECC71":"#FF6B35",border:"none",borderRadius:12,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"DM Sans, sans-serif",transition:"all 0.2s"}}>
      {sent?"✓ Sent!":"👋 Nudge"}
    </button>
  );
}

function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const steps = [
    { icon:"👋", title:"hey, welcome to haww", sub:"accountability meets your bestie. your screen time, but make it social.", cta:"let's gooo" },
    { icon:"📱", title:"connect screen time", sub:"sync your Apple Screen Time so we can track which apps are eating your day.", cta:"connect Apple Screen Time", skip:"skip for now" },
    { icon:"🎮", title:"create or join a room", sub:"invite your friends with a code and compete, challenge, and keep each other accountable.", cta:"create my room", skip:"enter a code instead" },
  ];
  const s = steps[step];
  const next = () => step < steps.length-1 ? setStep(step+1) : onDone();
  return (
    <div style={{minHeight:"100vh",background:"#FFF8F3",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",textAlign:"center",fontFamily:"DM Sans, sans-serif",position:"relative"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:"#F0F0F0",borderRadius:4}}>
        <div style={{height:"100%",background:"linear-gradient(90deg,#FF6B35,#FF8C61)",borderRadius:4,width:`${((step+1)/steps.length)*100}%`,transition:"width 0.4s ease"}}/>
      </div>
      <div style={{fontSize:88,marginBottom:24,animation:"popIn 0.5s ease"}}>{s.icon}</div>
      <h1 style={{fontFamily:"Fredoka One, sans-serif",fontSize:32,color:"#1A1A2E",margin:"0 0 12px",lineHeight:1.2}}>{s.title}</h1>
      <p style={{fontSize:15,color:"#888",margin:"0 0 44px",lineHeight:1.7,maxWidth:280}}>{s.sub}</p>
      <button onClick={next} style={{background:"linear-gradient(135deg,#FF6B35,#FF8C61)",color:"#fff",border:"none",borderRadius:18,padding:"16px 36px",fontSize:16,fontWeight:700,cursor:"pointer",width:"100%",maxWidth:300,boxShadow:"0 8px 24px #FF6B3540",fontFamily:"DM Sans, sans-serif"}}>{s.cta}</button>
      {s.skip && <button onClick={next} style={{background:"none",border:"none",color:"#BBB",fontSize:14,fontWeight:700,marginTop:18,cursor:"pointer",fontFamily:"DM Sans, sans-serif"}}>{s.skip}</button>}
      <div style={{display:"flex",gap:8,marginTop:36}}>
        {steps.map((_,i)=><div key={i} style={{width:i===step?24:8,height:8,borderRadius:10,background:i===step?"#FF6B35":"#F0F0F0",transition:"all 0.3s ease"}}/>)}
      </div>
    </div>
  );
}

function HomeTab({ targets, challenges, myXp, onNudge, setTab }) {
  const onTrack = targets.filter(t=>t.you<=t.limit).length;
  const done = challenges.filter(c=>c.youDone).length;
  return (
    <>
      <div style={{display:"flex",gap:10,padding:"16px 16px 4px"}}>
        {[{l:"On Track",v:`${onTrack}/${targets.length}`,c:"#2ECC71",bg:"#F0FFF4",i:"🎯"},{l:"Challenges",v:`${done}/${challenges.length}`,c:"#845EC2",bg:"#F5F0FF",i:"⚡"},{l:"Streak",v:"7 days",c:"#FF6B35",bg:"#FFF3EE",i:"🔥"}].map(s=>(
          <div key={s.l} style={{flex:1,background:s.bg,borderRadius:16,padding:"12px 8px",textAlign:"center"}}>
            <div style={{fontSize:20}}>{s.i}</div>
            <div style={{fontFamily:"Fredoka One, sans-serif",fontSize:16,color:s.c}}>{s.v}</div>
            <div style={{fontSize:10,fontWeight:700,color:"#999",fontFamily:"DM Sans, sans-serif"}}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{margin:"12px 16px",background:"linear-gradient(135deg,#845EC2,#B39CD0)",borderRadius:22,padding:"18px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{color:"rgba(255,255,255,0.7)",fontSize:11,fontWeight:700,fontFamily:"DM Sans, sans-serif",marginBottom:4}}>ROOM CODE</div>
          <div style={{fontFamily:"Fredoka One, sans-serif",fontSize:24,color:"#fff",letterSpacing:2}}>{ROOM_CODE}</div>
          <div style={{color:"rgba(255,255,255,0.7)",fontSize:11,fontFamily:"DM Sans, sans-serif",marginTop:4}}>Share to bring a friend in</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <div style={{background:"rgba(255,255,255,0.25)",borderRadius:12,padding:"8px 14px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",textAlign:"center",fontFamily:"DM Sans, sans-serif"}}>Copy 📋</div>
          <div style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"6px 12px",color:"rgba(255,255,255,0.85)",fontSize:11,fontWeight:700,cursor:"pointer",textAlign:"center",fontFamily:"DM Sans, sans-serif"}}>Share 🔗</div>
        </div>
      </div>

      <div style={{padding:"4px 16px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontFamily:"Fredoka One, sans-serif",fontSize:20,color:"#1A1A2E"}}>Today's Targets</span>
          <button onClick={()=>setTab("targets")} style={{background:"none",border:"none",color:"#FF6B35",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"DM Sans, sans-serif"}}>See all →</button>
        </div>
        {targets.slice(0,3).map(t=>(
          <div key={t.id} style={{background:"#fff",borderRadius:16,padding:"14px 16px",marginBottom:10,boxShadow:"0 2px 12px rgba(0,0,0,0.05)",borderLeft:`4px solid ${t.color}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:20}}>{t.icon}</span>
                <span style={{fontFamily:"DM Sans, sans-serif",fontWeight:700,fontSize:14,color:"#1A1A2E"}}>{t.app}</span>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {t.you > t.limit && <NudgeBtn onNudge={onNudge}/>}
                <Badge color={t.you>t.limit?"#FF4757":"#2ECC71"}>{t.you>t.limit?`+${t.you-t.limit}m over`:"✓ good"}</Badge>
              </div>
            </div>
            <ProgressBar value={t.you} max={t.limit} color={t.color}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#999",fontFamily:"DM Sans, sans-serif",fontWeight:700,marginTop:5}}>
              <span>You: {fmt(t.you)}</span><span>Limit: {fmt(t.limit)}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{padding:"4px 16px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontFamily:"Fredoka One, sans-serif",fontSize:20,color:"#1A1A2E"}}>Challenges</span>
          <button onClick={()=>setTab("challenges")} style={{background:"none",border:"none",color:"#FF6B35",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"DM Sans, sans-serif"}}>See all →</button>
        </div>
        {challenges.slice(0,2).map(c=>(
          <div key={c.id} style={{background:"#fff",borderRadius:16,padding:"14px 16px",marginBottom:10,boxShadow:"0 2px 12px rgba(0,0,0,0.05)",display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:44,height:44,borderRadius:14,background:`${c.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{c.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"DM Sans, sans-serif",fontWeight:700,fontSize:14,color:"#1A1A2E",marginBottom:5}}>{c.title}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <Badge color={c.youDone?"#2ECC71":"#FF6B35"}>{c.youDone?"✓ You done":"Pending"}</Badge>
                <Badge color={c.friendDone?"#2ECC71":"#888"}>{c.friendDone?"✓ Zara done":"Zara pending"}</Badge>
              </div>
            </div>
            <div style={{fontFamily:"Fredoka One, sans-serif",color:"#FF6B35",fontSize:15}}>+{c.xp}</div>
          </div>
        ))}
      </div>
      <div style={{height:20}}/>
    </>
  );
}

function TargetsTab({ targets, setTargets, onNudge }) {
  const [adding, setAdding] = useState(false);
  const [newApp, setNewApp] = useState({name:"",icon:"📱",limit:30});

  const add = () => {
    if(!newApp.name.trim()) return;
    setTargets(p=>[...p,{id:Date.now(),app:newApp.name,icon:newApp.icon,limit:newApp.limit,you:0,friend:0,color:"#888",reactions:[]}]);
    setAdding(false); setNewApp({name:"",icon:"📱",limit:30});
  };

  return (
    <div style={{padding:"16px 16px 0"}}>
      <div style={{fontFamily:"Fredoka One, sans-serif",fontSize:22,color:"#1A1A2E",marginBottom:4}}>Screen Time Targets</div>
      <div style={{fontFamily:"DM Sans, sans-serif",fontSize:13,color:"#999",marginBottom:16}}>You vs Zara · Today</div>
      {targets.map(t=>(
        <div key={t.id} style={{background:"#fff",borderRadius:20,padding:"16px 18px",marginBottom:12,boxShadow:"0 2px 14px rgba(0,0,0,0.06)",borderLeft:`4px solid ${t.color}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:42,height:42,borderRadius:14,background:`${t.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{t.icon}</div>
              <div>
                <div style={{fontFamily:"DM Sans, sans-serif",fontWeight:700,fontSize:15,color:"#1A1A2E"}}>{t.app}</div>
                <div style={{fontFamily:"DM Sans, sans-serif",fontSize:12,color:"#999"}}>Goal · {fmt(t.limit)}/day</div>
              </div>
            </div>
            {(t.you>t.limit||t.friend>t.limit) && <NudgeBtn onNudge={onNudge}/>}
          </div>
          <div style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",fontFamily:"DM Sans, sans-serif",fontSize:12,fontWeight:700,color:"#888",marginBottom:5}}>
              <span>🧑‍💻 You — {fmt(t.you)}</span>
              <span style={{color:t.you>t.limit?"#FF4757":"#2ECC71"}}>{t.you>t.limit?`${fmt(t.you-t.limit)} over`:`${fmt(t.limit-t.you)} left`}</span>
            </div>
            <ProgressBar value={t.you} max={t.limit} color={t.color}/>
          </div>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",fontFamily:"DM Sans, sans-serif",fontSize:12,fontWeight:700,color:"#888",marginBottom:5}}>
              <span>🧕 Zara — {fmt(t.friend)}</span>
              <span style={{color:t.friend>t.limit?"#FF4757":"#2ECC71"}}>{t.friend>t.limit?`${fmt(t.friend-t.limit)} over`:`${fmt(t.limit-t.friend)} left`}</span>
            </div>
            <ProgressBar value={t.friend} max={t.limit} color={t.color}/>
          </div>
          {t.reactions?.length>0 && <div style={{display:"flex",gap:4,marginTop:10}}>{t.reactions.map((r,i)=><span key={i} style={{fontSize:15}}>{r}</span>)}</div>}
        </div>
      ))}

      {adding ? (
        <div style={{background:"#fff",borderRadius:20,padding:18,marginBottom:12,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          <div style={{fontFamily:"DM Sans, sans-serif",fontWeight:700,fontSize:14,marginBottom:12,color:"#1A1A2E"}}>New Target</div>
          <input value={newApp.name} onChange={e=>setNewApp(p=>({...p,name:e.target.value}))} placeholder="App name (e.g. LinkedIn)" style={{width:"100%",border:"2px solid #F0F0F0",borderRadius:12,padding:"10px 14px",fontSize:14,fontFamily:"DM Sans, sans-serif",marginBottom:10,outline:"none",boxSizing:"border-box"}}/>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            {["📱","🎮","🛒","📺","💼","📰"].map(e=>(
              <button key={e} onClick={()=>setNewApp(p=>({...p,icon:e}))} style={{width:38,height:38,borderRadius:12,border:`2px solid ${newApp.icon===e?"#FF6B35":"#F0F0F0"}`,background:newApp.icon===e?"#FFF0EB":"#fff",fontSize:18,cursor:"pointer"}}>{e}</button>
            ))}
          </div>
          <div style={{fontFamily:"DM Sans, sans-serif",fontSize:13,color:"#888",marginBottom:6}}>Daily limit: {newApp.limit} min</div>
          <input type="range" min={10} max={180} step={5} value={newApp.limit} onChange={e=>setNewApp(p=>({...p,limit:+e.target.value}))} style={{width:"100%",accentColor:"#FF6B35",marginBottom:14}}/>
          <div style={{display:"flex",gap:10}}>
            <button onClick={add} style={{flex:1,background:"linear-gradient(135deg,#FF6B35,#FF8C61)",color:"#fff",border:"none",borderRadius:14,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"DM Sans, sans-serif"}}>Add</button>
            <button onClick={()=>setAdding(false)} style={{flex:1,background:"#F5F5F5",color:"#888",border:"none",borderRadius:14,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"DM Sans, sans-serif"}}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={()=>setAdding(true)} style={{width:"100%",background:"linear-gradient(135deg,#FF6B35,#FF8C61)",color:"#fff",border:"none",borderRadius:18,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:20,fontFamily:"DM Sans, sans-serif",boxShadow:"0 6px 20px #FF6B3530"}}>
          + Add New Target
        </button>
      )}
    </div>
  );
}

function ChallengesTab({ challenges, setChallenges, onComplete }) {
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [comment, setComment] = useState("");
  const filters = ["All","Fitness","Photo","Mindful","Social"];
  const filtered = filter==="All" ? challenges : challenges.filter(c=>c.type===filter.toLowerCase());

  const addComment = (id) => {
    if(!comment.trim()) return;
    setChallenges(p=>p.map(c=>c.id===id?{...c,comments:[...c.comments,`You: ${comment}`]}:c));
    setComment("");
  };

  const addReaction = (id,emoji) => {
    setChallenges(p=>p.map(c=>c.id===id?{...c,reactions:{...c.reactions,[emoji]:(c.reactions[emoji]||0)+1}}:c));
  };

  return (
    <div style={{padding:"12px 16px 0"}}>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,marginBottom:8}}>
        {filters.map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 16px",borderRadius:20,fontSize:13,fontWeight:700,cursor:"pointer",border:"2px solid",borderColor:filter===f?"#FF6B35":"#EEE",background:filter===f?"#FF6B35":"#fff",color:filter===f?"#fff":"#888",whiteSpace:"nowrap",flexShrink:0,fontFamily:"DM Sans, sans-serif",transition:"all 0.2s"}}>{f}</button>
        ))}
      </div>
      {filtered.map(c=>(
        <div key={c.id} style={{background:"#fff",borderRadius:20,padding:"16px 18px",marginBottom:12,boxShadow:"0 2px 14px rgba(0,0,0,0.06)"}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:48,height:48,borderRadius:16,background:`${c.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{c.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"DM Sans, sans-serif",fontWeight:700,fontSize:15,color:"#1A1A2E",marginBottom:3}}>{c.title}</div>
              <div style={{fontFamily:"DM Sans, sans-serif",fontSize:12,color:"#999",marginBottom:8,lineHeight:1.5}}>{c.desc}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                <Badge color={c.youDone?"#2ECC71":"#FF6B35"}>{c.youDone?"✓ You done":"You: pending"}</Badge>
                <Badge color={c.friendDone?"#2ECC71":"#888"}>{c.friendDone?"✓ Zara done":"Zara: pending"}</Badge>
                <Badge color="#FF6B35" bg="#FFF3EE">⚡ +{c.xp} XP</Badge>
              </div>
            </div>
          </div>

          <div style={{display:"flex",gap:6,flexWrap:"wrap",margin:"8px 0"}}>
            {Object.entries(c.reactions).map(([r,n])=>(
              <button key={r} onClick={()=>addReaction(c.id,r)} style={{background:"#F5F5F5",border:"none",borderRadius:20,padding:"4px 10px",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:"DM Sans, sans-serif",fontWeight:700,color:"#555"}}>{r} {n}</button>
            ))}
            <button onClick={()=>{const r=ALL_EMOJI[Math.floor(Math.random()*ALL_EMOJI.length)];addReaction(c.id,r);}} style={{background:"#F5F5F5",border:"none",borderRadius:20,padding:"4px 10px",fontSize:12,cursor:"pointer",color:"#888",fontFamily:"DM Sans, sans-serif"}}>+ React</button>
          </div>

          {!c.youDone ? (
            <button onClick={()=>onComplete(c.id)} style={{width:"100%",background:`linear-gradient(135deg,${c.color},${c.color}CC)`,color:"#fff",border:"none",borderRadius:14,padding:"11px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"DM Sans, sans-serif",margin:"6px 0"}}>
              Mark as Done ✓
            </button>
          ) : (
            <div style={{textAlign:"center",padding:"9px",fontSize:14,fontWeight:700,color:"#2ECC71",fontFamily:"DM Sans, sans-serif",margin:"6px 0"}}>✅ You nailed this!</div>
          )}

          <button onClick={()=>setExpanded(expanded===c.id?null:c.id)} style={{background:"none",border:"none",color:"#888",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"DM Sans, sans-serif",padding:0}}>
            💬 {c.comments.length} comment{c.comments.length!==1?"s":""} {expanded===c.id?"▲":"▼"}
          </button>

          {expanded===c.id && (
            <div style={{marginTop:10}}>
              {c.comments.map((cm,i)=>(
                <div key={i} style={{background:"#F9F9F9",borderRadius:12,padding:"8px 12px",marginBottom:6,fontSize:13,fontFamily:"DM Sans, sans-serif",color:"#555"}}>{cm}</div>
              ))}
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <input value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addComment(c.id)} placeholder="Add a comment..." style={{flex:1,border:"2px solid #F0F0F0",borderRadius:12,padding:"8px 12px",fontSize:13,fontFamily:"DM Sans, sans-serif",outline:"none"}}/>
                <button onClick={()=>addComment(c.id)} style={{background:"#FF6B35",color:"#fff",border:"none",borderRadius:12,padding:"8px 14px",fontWeight:700,cursor:"pointer",fontFamily:"DM Sans, sans-serif"}}>→</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function LeaderboardTab({ myXp, challenges }) {
  const friendXp = FRIEND.xp;
  const myDone = challenges.filter(c=>c.youDone).length;
  const friendDone = challenges.filter(c=>c.friendDone).length;
  const iWin = myXp >= friendXp;
  return (
    <div style={{padding:"16px 16px 0"}}>
      <div style={{background:`linear-gradient(135deg,${iWin?"#FF6B35":"#4ECDC4"},${iWin?"#FF8C61":"#81E6D9"})`,borderRadius:22,padding:"22px 24px",marginBottom:16,textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{fontSize:52,marginBottom:6}}>{iWin?"🏆":"🥈"}</div>
        <div style={{fontFamily:"Fredoka One, sans-serif",fontSize:24,color:"#fff",marginBottom:4}}>{iWin?"You're winning!":"Zara's ahead!"}</div>
        <div style={{fontFamily:"DM Sans, sans-serif",fontSize:13,color:"rgba(255,255,255,0.8)"}}>Keep the streak going 🔥</div>
        <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,background:"rgba(255,255,255,0.1)",borderRadius:"50%"}}/>
      </div>

      <div style={{background:"#fff",borderRadius:20,padding:"18px",marginBottom:12,boxShadow:"0 2px 14px rgba(0,0,0,0.06)"}}>
        <div style={{fontFamily:"DM Sans, sans-serif",fontWeight:700,fontSize:12,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>XP Rankings</div>
        {[{name:"You",avatar:"🧑‍💻",xp:myXp,color:"#FF6B35"},{name:"Zara",avatar:"🧕",xp:friendXp,color:"#4ECDC4"}].sort((a,b)=>b.xp-a.xp).map((p,i)=>(
          <div key={p.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:i===0?"1px solid #F5F5F5":"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:22}}>{i===0?"🥇":"🥈"}</span>
              <span style={{fontSize:22}}>{p.avatar}</span>
              <span style={{fontFamily:"DM Sans, sans-serif",fontWeight:700,fontSize:15,color:"#1A1A2E"}}>{p.name}</span>
            </div>
            <span style={{fontFamily:"Fredoka One, sans-serif",fontSize:20,color:p.color}}>{p.xp} XP</span>
          </div>
        ))}
      </div>

      <div style={{background:"#fff",borderRadius:20,padding:"18px",marginBottom:12,boxShadow:"0 2px 14px rgba(0,0,0,0.06)"}}>
        <div style={{fontFamily:"DM Sans, sans-serif",fontWeight:700,fontSize:12,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Head to Head</div>
        {[{l:"Challenges done",y:myDone,f:friendDone},{l:"Targets hit",y:3,f:4},{l:"Streak (days)",y:7,f:5}].map(s=>{
          const tot=s.y+s.f||1;
          return (
            <div key={s.l} style={{marginBottom:14}}>
              <div style={{fontFamily:"DM Sans, sans-serif",fontSize:13,fontWeight:700,color:"#666",marginBottom:6}}>{s.l}</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontFamily:"DM Sans, sans-serif",fontSize:13,fontWeight:700,color:"#FF6B35",width:24}}>{s.y}</span>
                <div style={{flex:1,height:10,background:"#F0F0F0",borderRadius:10,overflow:"hidden",display:"flex"}}>
                  <div style={{height:"100%",width:`${(s.y/tot)*100}%`,background:"#FF6B35"}}/>
                  <div style={{height:"100%",width:`${(s.f/tot)*100}%`,background:"#4ECDC4"}}/>
                </div>
                <span style={{fontFamily:"DM Sans, sans-serif",fontSize:13,fontWeight:700,color:"#4ECDC4",width:24,textAlign:"right"}}>{s.f}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{height:20}}/>
    </div>
  );
}

function ProfileTab({ myXp, challenges }) {
  const done = challenges.filter(c=>c.youDone).length;
  const [name, setName] = useState("You");
  const [editing, setEditing] = useState(false);
  return (
    <div style={{padding:"16px 16px 0"}}>
      <div style={{background:"linear-gradient(135deg,#FF6B35,#FF8C61)",borderRadius:24,padding:"28px 24px",marginBottom:16,textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{fontSize:64,marginBottom:10}}>🧑‍💻</div>
        {editing ? (
          <input value={name} onChange={e=>setName(e.target.value)} onBlur={()=>setEditing(false)} autoFocus style={{background:"rgba(255,255,255,0.3)",border:"none",borderRadius:12,padding:"8px 16px",fontSize:20,fontWeight:700,color:"#fff",textAlign:"center",fontFamily:"Fredoka One, sans-serif",outline:"none",width:"70%"}}/>
        ) : (
          <div onClick={()=>setEditing(true)} style={{fontFamily:"Fredoka One, sans-serif",fontSize:28,color:"#fff",cursor:"pointer"}}>{name} ✏️</div>
        )}
        <div style={{fontFamily:"DM Sans, sans-serif",fontSize:13,color:"rgba(255,255,255,0.8)",marginTop:4,marginBottom:18}}>HAWW-4821 · Day 7</div>
        <div style={{display:"flex",justifyContent:"center",gap:20}}>
          {[{v:myXp,l:"Total XP"},{v:"7🔥",l:"Streak"},{v:done,l:"Challenges"}].map(s=>(
            <div key={s.l} style={{textAlign:"center"}}>
              <div style={{fontFamily:"Fredoka One, sans-serif",fontSize:22,color:"#fff"}}>{s.v}</div>
              <div style={{fontFamily:"DM Sans, sans-serif",fontSize:11,color:"rgba(255,255,255,0.75)"}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,background:"rgba(255,255,255,0.1)",borderRadius:"50%"}}/>
        <div style={{position:"absolute",bottom:-30,left:-10,width:100,height:100,background:"rgba(255,255,255,0.08)",borderRadius:"50%"}}/>
      </div>

      <div style={{background:"#fff",borderRadius:20,padding:"18px",marginBottom:12,boxShadow:"0 2px 14px rgba(0,0,0,0.06)"}}>
        <div style={{fontFamily:"DM Sans, sans-serif",fontWeight:700,fontSize:12,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Badges Earned</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{i:"🔥",l:"7-Day Streak",c:"#FF6B35"},{i:"🎯",l:"Target Setter",c:"#845EC2"},{i:"📷",l:"Photographer",c:"#E91E8C"},{i:"🧘",l:"Mindful Mind",c:"#4ECDC4"}].map(b=>(
            <div key={b.l} style={{background:`${b.c}12`,borderRadius:16,padding:"14px 12px",textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:4}}>{b.i}</div>
              <div style={{fontFamily:"DM Sans, sans-serif",fontSize:12,fontWeight:700,color:b.c}}>{b.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:"#fff",borderRadius:20,padding:"18px",marginBottom:20,boxShadow:"0 2px 14px rgba(0,0,0,0.06)"}}>
        <div style={{fontFamily:"DM Sans, sans-serif",fontWeight:700,fontSize:12,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Settings</div>
        {[{i:"🔔",l:"Notifications",v:"On"},{i:"📱",l:"Screen Time Sync",v:"Connected"},{i:"🎮",l:"Room",v:ROOM_CODE},{i:"🌙",l:"Daily Reminder",v:"9 PM"},{i:"🚪",l:"Leave Room",v:""}].map((s,i,arr)=>(
          <div key={s.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<arr.length-1?"1px solid #F5F5F5":"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>{s.i}</span>
              <span style={{fontFamily:"DM Sans, sans-serif",fontWeight:700,fontSize:14,color:s.l==="Leave Room"?"#FF4757":"#1A1A2E"}}>{s.l}</span>
            </div>
            {s.v && <span style={{fontFamily:"DM Sans, sans-serif",fontSize:13,color:"#AAA"}}>{s.v} ›</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HawwApp() {
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState("home");
  const [targets, setTargets] = useState(INIT_TARGETS);
  const [challenges, setChallenges] = useState(INIT_CHALLENGES);
  const [myXp, setMyXp] = useState(130);
  const [confetti, setConfetti] = useState(false);
  const [toast, setToast] = useState({show:false,msg:""});

  const showToast = (msg) => { setToast({show:true,msg}); setTimeout(()=>setToast({show:false,msg:""}),2500); };

  const handleComplete = (id) => {
    const ch = challenges.find(c=>c.id===id);
    setChallenges(p=>p.map(c=>c.id===id?{...c,youDone:true}:c));
    setMyXp(p=>p+ch.xp);
    setConfetti(true);
    showToast(`+${ch.xp} XP earned! 🎉`);
    setTimeout(()=>setConfetti(false),2200);
  };

  const handleNudge = () => showToast(`Nudge sent: "${NUDGE_MSGS[Math.floor(Math.random()*NUDGE_MSGS.length)]}"`);

  const navItems = [{id:"home",icon:"🏠",label:"Home"},{id:"targets",icon:"🎯",label:"Targets"},{id:"challenges",icon:"⚡",label:"Challenges"},{id:"leaderboard",icon:"🏆",label:"Scores"},{id:"profile",icon:"🧑‍💻",label:"Profile"}];

  const CSS = `
    *{box-sizing:border-box;margin:0;padding:0;}
    ::-webkit-scrollbar{display:none;}
    body{background:#FFF8F3;}
    @keyframes cfetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(-220px) rotate(720deg);opacity:0}}
    @keyframes popIn{0%{transform:scale(0.7);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
    button:active{transform:scale(0.96)!important;}
    input{font-family:DM Sans,sans-serif;}
  `;

  if (!onboarded) return (<><style>{CSS}</style><FontLoader/><Onboarding onDone={()=>setOnboarded(true)}/></>);

  return (
    <div style={{fontFamily:"DM Sans, sans-serif",background:"#FFF8F3",minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",position:"relative"}}>
      <style>{CSS}</style>
      <FontLoader/>
      <Confetti show={confetti}/>
      <Toast msg={toast.msg} show={toast.show}/>

      <div style={{background:"linear-gradient(135deg,#FF6B35 0%,#FF8C61 100%)",padding:"18px 20px 22px",position:"relative",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",width:110,height:110,borderRadius:"50%",background:"rgba(255,255,255,0.09)",top:-30,right:-20}}/>
        <div style={{position:"absolute",width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,0.07)",bottom:-20,right:80}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"3px 10px",fontSize:11,color:"#fff",fontWeight:700,marginBottom:8}}>
              <span style={{width:6,height:6,background:"#7FFFD4",borderRadius:"50%",display:"inline-block"}}/>ROOM ACTIVE
            </div>
            <div style={{fontFamily:"Fredoka One, sans-serif",fontSize:32,color:"#fff",lineHeight:1}}>haww 👋</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.75)",marginTop:4}}>Sunday · Mar 29 · Day 7 together</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{color:"rgba(255,255,255,0.7)",fontSize:10,fontWeight:700}}>YOUR XP</div>
            <div style={{fontFamily:"Fredoka One, sans-serif",fontSize:32,color:"#fff"}}>{myXp}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
          {[ME,FRIEND].map(f=>(
            <div key={f.name} style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.2)",borderRadius:30,padding:"5px 14px 5px 5px"}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{f.avatar}</div>
              <span style={{color:"#fff",fontWeight:700,fontSize:13}}>{f.name}</span>
            </div>
          ))}
          <div style={{marginLeft:"auto",background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"6px 14px",color:"#fff",fontWeight:700,fontSize:13}}>🔥 7 days</div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",paddingBottom:72}}>
        {tab==="home" && <HomeTab targets={targets} challenges={challenges} myXp={myXp} onNudge={handleNudge} setTab={setTab}/>}
        {tab==="targets" && <TargetsTab targets={targets} setTargets={setTargets} onNudge={handleNudge}/>}
        {tab==="challenges" && <ChallengesTab challenges={challenges} setChallenges={setChallenges} onComplete={handleComplete}/>}
        {tab==="leaderboard" && <LeaderboardTab myXp={myXp} challenges={challenges}/>}
        {tab==="profile" && <ProfileTab myXp={myXp} challenges={challenges}/>}
      </div>

      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#fff",borderTop:"1.5px solid rgba(0,0,0,0.06)",display:"flex",padding:"6px 0 14px",justifyContent:"space-around",alignItems:"center",zIndex:100,boxShadow:"0 -8px 30px rgba(0,0,0,0.06)"}}>
        {navItems.map(item=>(
          <button key={item.id} onClick={()=>setTab(item.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"6px 10px",borderRadius:14,background:tab===item.id?"#FFF0EB":"none",border:"none",transition:"all 0.2s"}}>
            <span style={{fontSize:tab===item.id?22:20}}>{item.icon}</span>
            <span style={{fontSize:9,fontWeight:700,color:tab===item.id?"#FF6B35":"#AAA",fontFamily:"DM Sans, sans-serif",letterSpacing:0.3}}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
