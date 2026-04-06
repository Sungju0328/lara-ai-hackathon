import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  bg:"#0a0a0a", surface:"#111111", raised:"#161616", border:"#242424",
  muted:"#555555", dim:"#888888", ink:"#e8e8e8",
  lime:"#c8ff00", blue:"#4a9eff", red:"#ff5555", amber:"#ffcc00",
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT IMAGE URLs
// ─────────────────────────────────────────────────────────────────────────────
const URL_DEFAULTS = {
  logo:       "brand_assets/Logo2.png",
  hero:       "https://framerusercontent.com/images/JIqdeaBqcV8M9BT8mJTPV7pZHag.png",
  overview:   "https://framerusercontent.com/images/t9HkeDpArF1E97iS7jvFyaHfJE.png",
  deforest:   "https://framerusercontent.com/images/ugUAPHUt1J0DHJWsbW40uAKPn9k.png",
  persona:    "https://framerusercontent.com/images/SuMTTKGIiVfaqqqoKer92Wlg5o.png",
  brainstorm: "https://framerusercontent.com/images/fy8OL0DU77HatU2eSavnVK17c.png",
  step1:      "image1.png",
  step2:      "image2.png",
  step3:      "image3.png",
  step4:      "image4.png",
  step5:      "image5.png",
  ai1:        "use1.png",
  ai2:        "use2.png",
  ai3:        "use3.png",
  demoMain:   "https://framerusercontent.com/images/1om82kRkkqPO5JyMRXvGwJDhts.png",
  screen1:    "https://framerusercontent.com/images/NLye5HG7FOlMP50dwGZdohfoy8.svg",
  screen2:    "https://framerusercontent.com/images/fEC6646IonXKA6cPuR9gRPC5UiQ.svg",
  screen3:    "https://framerusercontent.com/images/q9W15y5MFA6dvPRQkGyWHUAGEcU.svg",
  demoBottom: "https://framerusercontent.com/images/sRZqq90jBJFvh41CuTmpyrMt2mw.png",
  winner:     "https://framerusercontent.com/images/ZtNIqurb0Q0GjoZijOoacVKDFg.png",
  team1:      "https://framerusercontent.com/images/6tx3gymWx90iG9XUhEFvGu6pUnc.png",
  team2:      "https://framerusercontent.com/images/ZrAzISgCBv8PvwMS93Jo6oU6c.png",
  team3:      "https://framerusercontent.com/images/hNvjdR3Gi1lIZD74zJuaPLnP6g.png",
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT TEXT CONTENT
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  heroIntro:
    "AI-designed, award-winning AR solution for restoring the environment. Utilized a range of AI tools — including ChatGPT, Sora, Adobe Firefly, Visual Electric, and GoogleFX — to lead the entire design process from concept ideation to storytelling and visual execution.\n\nCollaborated with a cross-functional team to create a gamified AR experience where virtual actions contribute to real-world protection and restoration of the Amazon rainforest.",
  overviewBody:
    "ReforestAR is an AI-powered AR platform designed to transform passive concern for the Amazon rainforest into active, measurable impact. This project blends cutting-edge design, artificial intelligence, and immersive interaction to turn environmental preservation into an engaging experience.",
  ideationBody:
    "We began by analyzing the systemic failures causing Amazon deforestation — monopoly power, government inaction, and lack of transparency. From this, we identified our target audience: Gen Z users who care but feel powerless.",
  gameDesc:
    "An AR-based Play-to-Earn eco-restoration game where users can protect and regenerate the Amazon rainforest through immersive gameplay that bridges virtual and real-world actions.",
  outcome1:
    "Our project won first place at an AI Hackathon in San Francisco for its emotional impact and real-world relevance.",
  outcome2:
    "The judging panel responded positively to the \"tangible impact\" feedback loop, where in-game actions were designed to inspire real-world environmental change.",
  outcome3:
    "This demonstrated how human-centered, thoughtful design can make AI feel emotional, empowering, and purpose-driven — not just technical.",
  reflection1:
    "This project began with a question: Can AI and AR help solve the Amazon rainforest crisis?\n\nExploring how technology can reconnect people with nature was inspiring. But as we built the concept, key challenges became clear:",
  reflection2:
    "Gamifying the issue helped make it feel personal, but I learned that broader accessibility requires deeper user research — especially across different age groups and tech familiarity.",
  reflectionQuote:
    "It reminded me that impactful design starts with bold ideas, but succeeds when grounded in real needs, limitations, and empathy.",
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT STEP DATA  (label, title, body, img — Framer array controls override these)
// ─────────────────────────────────────────────────────────────────────────────
const STEPS_DEFAULT = [
  { label:"Enter",   title:"Enter the\nVirtual Amazon",               body:"Users begin by entering a virtual replica of the Amazon using AR, helping create emotional immersion and environmental awareness.",                                                                                              chipBc:C.lime,  chipTc:C.lime,  extra:null,      img:URL_DEFAULTS.step1 },
  { label:"Build",   title:"Build & Regenerate\nthe Forest",          body:"Through missions, users deploy virtual drones and seed pods to plant trees and nurture biodiversity. The forest grows based on strategic actions and time-based progress, reflecting real ecological principles.",              chipBc:C.lime,  chipTc:C.lime,  extra:null,      img:URL_DEFAULTS.step2 },
  { label:"Earn",    title:"Earn Impact-Based\nCrypto Rewards",       body:"Users are rewarded with crypto tokens for their environmental actions. Tokens are tied to real-world ecological contributions — e.g., verified reforestation partners.",                                                          chipBc:C.amber, chipTc:C.amber, extra:null,      img:URL_DEFAULTS.step3 },
  { label:"Invest",  title:"Keep, Donate,\nor Reinvest Tokens",       body:"Tokens can be reinvested to boost reforestation speed, donated to NGOs, or traded in a gamified eco-marketplace — giving users full control over their impact.",                                                                chipBc:C.amber, chipTc:C.amber, extra:"tokens",  img:URL_DEFAULTS.step4 },
  { label:"Restore", title:"Real-World Restoration\nPowered by Play", body:"In-game actions directly fund real-world restoration efforts.",                                                                                                                                                                chipBc:C.lime,  chipTc:C.lime,  extra:"restore", img:URL_DEFAULTS.step5 },
]

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT AI CARD DATA
// ─────────────────────────────────────────────────────────────────────────────
const AI_DEFAULT = [
  { use:"Use 01", bc:C.lime,  tc:C.lime,  num:"AI Application 01", title:"AI Terrain Mapping",      body:"To match AR interaction with real-world deforested areas. Satellite data feeds the zone classification system, ensuring every virtual action corresponds to a real endangered location.", img:URL_DEFAULTS.ai1 },
  { use:"Use 02", bc:C.amber, tc:C.amber, num:"AI Application 02", title:"Impact Prediction Model", body:"Users receive real-time feedback on how their actions affect the ecosystem. AI projects the 6-month trajectory of each zone based on current gameplay.",                                  img:URL_DEFAULTS.ai2 },
  { use:"Use 03", bc:C.blue,  tc:C.blue,  num:"AI Application 03", title:"Dynamic User Path",       body:"AI adapts the user journey depending on engagement patterns — surfacing personalized mission prompts that match each user's skill level and conservation goals.",                           img:URL_DEFAULTS.ai3 },
]

// ─────────────────────────────────────────────────────────────────────────────
// STATIC STRUCTURAL DATA  (not content-editable — layout-level)
// ─────────────────────────────────────────────────────────────────────────────
const PROBLEMS = [
  { num:"1", label:"Amazon is vanishing fast", accent:C.red,   items:["17% is already gone","At 25%, collapse is irreversible","3 football fields lost every minute"] },
  { num:"2", label:"People feel powerless",    accent:C.amber, items:["No clear or trustworthy way to act","Donations disappear in bureaucracy","Saving nature feels like a sacrifice"] },
  { num:"3", label:"Systems are broken",       accent:C.red,   items:["Corruption blocks protection","Local defenders face threats","Conservation is slow, weak, too late"] },
]

const TOKEN_ROWS = [
  { label:"Reinvest", desc:"Boost reforestation speed in chosen zones", badge:"×2 Speed",   bc:C.lime,  tc:C.lime,  bg:"#0a120a" },
  { label:"Donate",   desc:"Give directly to verified NGO partners",    badge:"Verified",    bc:C.blue,  tc:C.blue,  bg:"transparent" },
  { label:"Trade",    desc:"Trade in the gamified eco-marketplace",     badge:"Marketplace", bc:C.amber, tc:C.amber, bg:"transparent" },
]

// extra content by step index (index 3 = tokens UI, index 4 = restore example)
const STEP_EXTRA = [null, null, null, "tokens", "restore"]

// ─────────────────────────────────────────────────────────────────────────────
// INJECTED CSS
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
@keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:.3} }
.rf-dot { animation:pulseDot 2s ease-in-out infinite; }

.rf-ai-img { transition:transform .45s cubic-bezier(.4,0,.2,1); }
.rf-ai-card:hover .rf-ai-img { transform:scale(1.04); }

.rf-token-row { transition:background .15s ease; }
.rf-token-row:hover { background:#0f1f0f !important; }

.rf-tab { position:relative; transition:color .15s ease; }
.rf-tab::after {
  content:''; position:absolute; bottom:0; left:0; right:0;
  height:2px; background:#c8ff00;
  transform:scaleX(0);
  transition:transform .28s cubic-bezier(.4,0,.2,1);
  transform-origin:left;
}
.rf-tab.rf-tab-on::after { transform:scaleX(1); }
.rf-tab:not(.rf-tab-on):hover { background:#161616 !important; }

.rf-link { transition:color .15s ease; color:#555555; text-decoration:none; }
.rf-link:hover { color:#e8e8e8; }

.rf-grid-bg {
  background-image:linear-gradient(#ffffff03 1px,transparent 1px),linear-gradient(90deg,#ffffff03 1px,transparent 1px);
  background-size:64px 64px;
}

::-webkit-scrollbar { width:4px; }
::-webkit-scrollbar-track { background:#0a0a0a; }
::-webkit-scrollbar-thumb { background:#242424; border-radius:2px; }

@media(max-width:768px){
  .rf-two-col   { grid-template-columns:1fr !important; }
  .rf-three-col { grid-template-columns:1fr !important; }
  .rf-four-col  { grid-template-columns:1fr 1fr !important; }
  .rf-step-panel-txt { padding:32px 24px !important; }
  .rf-px  { padding-left:24px !important; padding-right:24px !important; }
  .rf-footer-inner { flex-direction:column; gap:24px; align-items:flex-start !important; }
  .rf-hero-h1 { font-size:40px !important; }
}
`

// ─────────────────────────────────────────────────────────────────────────────
// STYLE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const lbl  = (x={}) => ({ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:C.muted, ...x })
const chip = (bc,tc,x={}) => ({ fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", padding:"2px 7px", border:`1px solid ${bc}`, color:tc, display:"inline-block", ...x })
const disp = (x={}) => ({ ...x })
const mono = (x={}) => ({ ...x })

// ─────────────────────────────────────────────────────────────────────────────
// MOTION PRESETS
// ─────────────────────────────────────────────────────────────────────────────
const ease = {
  out:    [0.22, 1, 0.36, 1],
  std:    [0.4, 0, 0.2, 1],
  spring: [0.34, 1.56, 0.64, 1],
}
const fadeUp = {
  hidden: { opacity:0, y:20 },
  show:   { opacity:1, y:0, transition:{ duration:0.65, ease:ease.out } },
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const Dot   = ({ color=C.lime, size=6 }) => (
  <span className="rf-dot" style={{ display:"inline-block", width:size, height:size, borderRadius:"50%", background:color }} />
)
const Chip  = ({ bc, tc, children, style={} }) => (
  <span style={{ ...chip(bc,tc), ...style }}>{children}</span>
)
const Lbl   = ({ children, style={} }) => (
  <span style={{ ...lbl(), ...style }}>{children}</span>
)
const Overlay = ({ fromBottom=true, custom }) => (
  <div style={{
    position:"absolute", inset:0, pointerEvents:"none",
    background: custom || (fromBottom
      ? "linear-gradient(to top,rgba(0,0,0,.7) 0%,transparent 60%)"
      : "linear-gradient(to bottom,transparent 30%,rgba(0,0,0,.8))"),
  }} />
)

// Frame — motion wrapper, image scales on hover when interactive=true
const Frame = ({ src, alt, height, minHeight, style={}, imgStyle={}, className="", interactive=false, children }) => {
  const imgV = { rest:{ scale:1 }, hover:{ scale:1.04, transition:{ duration:0.45, ease:ease.std } } }
  return (
    <motion.div
      initial="rest" whileHover={interactive ? "hover" : undefined}
      style={{ position:"relative", overflow:"hidden", background:C.surface, height, minHeight, ...style }}
      className={className}
    >
      <motion.img src={src} alt={alt} variants={interactive ? imgV : {}}
        style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", ...imgStyle }} />
      {children}
    </motion.div>
  )
}

const Grid = ({ cols, style={}, className="", children }) => (
  <div className={className} style={{ display:"grid", gridTemplateColumns:cols, gap:1, background:C.border, border:`1px solid ${C.border}`, ...style }}>
    {children}
  </div>
)
const Cell    = ({ style={}, className="", children }) => (
  <div style={{ background:C.bg, ...style }} className={className}>{children}</div>
)
const Surface = ({ style={}, className="", children }) => (
  <div style={{ background:C.surface, ...style }} className={className}>{children}</div>
)

// Scroll-reveal — uses framer-motion useInView
function Reveal({ children, id, style={} }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:"-60px 0px" })
  return (
    <motion.section id={id} ref={ref}
      initial={{ opacity:0, y:28 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.65, ease:ease.out }}
      style={{ borderTop:`1px solid ${C.border}`, paddingTop:96, paddingBottom:96, ...style }}
    >
      {children}
    </motion.section>
  )
}

const Inner = ({ children, style={} }) => (
  <div className="rf-px" style={{ maxWidth:1152, margin:"0 auto", paddingLeft:40, paddingRight:40, ...style }}>
    {children}
  </div>
)
const Heading = ({ num, children }) => (
  <div style={{ display:"flex", alignItems:"baseline", gap:16, marginBottom:64 }}>
    <Lbl style={{ minWidth:28 }}>{num}</Lbl>
    <h2 style={{ fontWeight:300, color:"white", fontSize:"clamp(24px,3.5vw,44px)", letterSpacing:"-0.02em", lineHeight:1.1, margin:0 }}>
      {children}
    </h2>
  </div>
)
const WindowChrome = ({ label, badge, bc=C.border, tc=C.dim }) => (
  <div style={{ borderBottom:`1px solid ${C.border}`, padding:"10px 16px", display:"flex", alignItems:"center", gap:12, background:C.surface }}>
    {[0,1,2].map(i=><span key={i} style={{ width:8, height:8, borderRadius:"50%", background:C.border, display:"inline-block" }} />)}
    <Lbl style={{ marginLeft:8 }}>{label}</Lbl>
    {badge && <Chip bc={bc} tc={tc} style={{ marginLeft:"auto" }}>{badge}</Chip>}
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// SECTION COMPONENTS  (all receive `data` and/or `img` from root)
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection({ data, img }) {
  const { heroHeadline, heroAccentText, heroTagline, heroIntro, heroDate, heroTeam, heroCoreSkills, heroTools } = data
  const container = { hidden:{}, show:{ transition:{ staggerChildren:0.1, delayChildren:0.05 } } }
  return (
    <section id="hero" className="rf-grid-bg" style={{ paddingTop:80, paddingBottom:0, position:"relative" }}>
      <Inner>
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={fadeUp} style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:48 }}>
            <span style={{ ...chip(C.lime,C.lime), display:"inline-flex", alignItems:"center", gap:6 }}><Dot size={4} /> Case Study</span>
            <Chip bc={C.amber} tc={C.amber}>★ 1st Place</Chip>
            <Chip bc={C.border} tc={C.dim}>AR Platform</Chip>
            <Chip bc={C.border} tc={C.dim}>AI-Enhanced Design</Chip>
            <Chip bc={C.border} tc={C.dim}>Awards</Chip>
          </motion.div>

          <motion.h1 variants={fadeUp} className="rf-hero-h1" style={{ fontWeight:300, color:"white", margin:"0 0 32px", fontSize:"clamp(40px,6.5vw,80px)", letterSpacing:"-0.03em", lineHeight:1.04 }}>
            {heroHeadline}<br/><span style={{ color:C.lime }}>{heroAccentText}</span>
          </motion.h1>

          <motion.div variants={fadeUp} style={{ marginBottom:48 }}>
            <Grid cols="repeat(4,1fr)" className="rf-four-col" style={{ maxWidth:760 }}>
              {[["Date", heroDate],["Team", heroTeam],["Core Skills", heroCoreSkills],["Tools", heroTools]].map(([label,val])=>(
                <Cell key={label} style={{ padding:"20px 24px" }}>
                  <Lbl style={{ display:"block", marginBottom:6 }}>{label}</Lbl>
                  <span style={{ ...mono({ fontSize:13, color:C.ink }), whiteSpace:"pre-line" }}>{val}</span>
                </Cell>
              ))}
            </Grid>
          </motion.div>

          <motion.p variants={fadeUp} style={{ ...disp({ fontSize:17, lineHeight:1.75, color:C.dim, maxWidth:672, marginBottom:56 }), whiteSpace:"pre-line" }}>
            {heroIntro}
          </motion.p>

          <motion.div variants={fadeUp} style={{ border:`1px solid ${C.border}`, boxShadow:"0 2px 40px #00000099" }}>
            <Frame src={img.hero} alt="ReforestAR — drone AR experience" height={520} interactive>
              <Overlay />
              <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:32, display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
                <div>
                  <Lbl style={{ display:"block", marginBottom:4, color:C.lime }}>ReforestAR</Lbl>
                  <div style={{ ...disp({ fontSize:20, color:"white", fontWeight:500, letterSpacing:"-0.01em" }) }}>{heroTagline}</div>
                </div>
                <span style={{ ...chip(C.lime,C.lime), display:"inline-flex", alignItems:"center", gap:6 }}><Dot size={4} /> AR Active</span>
              </div>
            </Frame>
          </motion.div>
        </motion.div>
      </Inner>
    </section>
  )
}

function OverviewSection({ data, img }) {
  const { overviewQuote, overviewBody } = data
  return (
    <Reveal>
      <Inner>
        <Heading num="02">Overview</Heading>
        <Grid cols="1fr 1fr" className="rf-two-col">
          <Cell style={{ padding:40, display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <p style={{ ...disp({ fontSize:22, color:"white", lineHeight:1.5, letterSpacing:"-0.01em", fontWeight:300, marginBottom:32 }) }}>
              "{overviewQuote}"
            </p>
            <p style={{ ...disp({ fontSize:15, color:C.dim, lineHeight:1.75, margin:0 }) }}>{overviewBody}</p>
          </Cell>
          <Frame src={img.overview} alt="ReforestAR app interface" minHeight={380} interactive>
            <Overlay />
          </Frame>
        </Grid>
      </Inner>
    </Reveal>
  )
}

function ProblemSection({ img }) {
  return (
    <Reveal>
      <Inner>
        <Heading num="03">The Problem</Heading>
        <div style={{ border:`1px solid ${C.border}`, marginBottom:1, boxShadow:"0 2px 24px #00000088" }}>
          <Frame src={img.deforest} alt="Deforested Amazon" height={320} interactive>
            <Overlay fromBottom={false} />
            <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:32 }}>
              <p style={{ ...disp({ fontSize:18, color:"white", fontWeight:500, letterSpacing:"-0.01em", maxWidth:600, margin:0 }) }}>
                People Care, But Action Feels Impossible
              </p>
            </div>
          </Frame>
        </div>
        <Grid cols="1fr 1fr 1fr" className="rf-three-col" style={{ marginBottom:1 }}>
          {PROBLEMS.map(p=>(
            <motion.div key={p.num} whileHover={{ background:C.raised }} transition={{ duration:0.2 }} style={{ background:C.bg, padding:36 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <span style={{ ...mono({ fontSize:28, color:"white", letterSpacing:"-0.03em", lineHeight:1 }) }}>{p.num}</span>
                <Lbl>{p.label}</Lbl>
              </div>
              <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:12 }}>
                {p.items.map(item=>(
                  <li key={item} style={{ display:"flex", gap:12, ...disp({ fontSize:13, color:C.dim, lineHeight:1.6 }) }}>
                    <span style={{ color:p.accent, ...mono({ fontSize:9 }), marginTop:2 }}>▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </Grid>
        <Cell style={{ padding:32, border:`1px solid ${C.border}`, borderTop:"none" }}>
          <p style={{ ...disp({ fontSize:14, color:C.dim, textAlign:"center", lineHeight:1.7, margin:0 }) }}>
            <span style={{ color:C.ink, fontWeight:500 }}>We need a way that's transparent, actionable, and emotionally engaging</span>
            {" "}—{" "}for anyone, anywhere.
          </p>
        </Cell>
      </Inner>
    </Reveal>
  )
}

function PersonaSection({ data, img }) {
  const { personaName, personaAge, personaInsight } = data
  return (
    <Reveal>
      <Inner>
        <Heading num="04">Target Persona</Heading>
        <Grid cols="1fr 1fr" className="rf-two-col">
          <Frame src={img.persona} alt={personaName} minHeight={440} imgStyle={{ objectPosition:"center top" }} interactive>
            <Overlay fromBottom={false} />
            <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:32 }}>
              <div style={{ ...disp({ fontSize:24, color:"white", fontWeight:500, letterSpacing:"-0.02em", marginBottom:4 }) }}>{personaName}</div>
              <div style={{ ...disp({ fontSize:14, color:C.dim }) }}>{personaAge}</div>
            </div>
          </Frame>
          <Cell style={{ padding:40, display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <div style={{ marginBottom:32 }}>
              <Lbl style={{ display:"block", marginBottom:16, color:C.red }}>Pain Points</Lbl>
              <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:16 }}>
                {["Helpless about Amazon's destruction","Lack of transparency in charities","Local vs. global action feels disconnected"].map(t=>(
                  <li key={t} style={{ display:"flex", gap:12, ...disp({ fontSize:14, lineHeight:1.6 }) }}>
                    <span style={{ color:C.red, ...mono({ fontSize:9 }), marginTop:2 }}>×</span>
                    <span style={{ color:C.dim }}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginBottom:32 }}>
              <Lbl style={{ display:"block", marginBottom:16, color:C.lime }}>Goals</Lbl>
              <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:16 }}>
                {["Combine sustainability with real, doable action","Empower global users through decentralized tools","Build deep emotional connection to the Amazon"].map(t=>(
                  <li key={t} style={{ display:"flex", gap:12, ...disp({ fontSize:14, lineHeight:1.6 }) }}>
                    <span style={{ color:C.lime, ...mono({ fontSize:9 }), marginTop:2 }}>→</span>
                    <span style={{ color:C.dim }}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ border:`1px solid ${C.border}`, padding:24, background:C.surface }}>
              <Lbl style={{ display:"block", marginBottom:12 }}>Core Insight</Lbl>
              <p style={{ ...disp({ fontSize:14, color:C.ink, lineHeight:1.7, fontStyle:"italic", margin:0 }) }}>
                "{personaInsight}"
              </p>
            </div>
          </Cell>
        </Grid>
      </Inner>
    </Reveal>
  )
}

function IdeationSection({ data, img }) {
  const { ideationBody, ideationGoal } = data
  return (
    <Reveal>
      <Inner>
        <Heading num="05">Ideation &amp; Research</Heading>
        <Grid cols="1fr 1fr" className="rf-two-col" style={{ marginBottom:1 }}>
          <Cell style={{ padding:40, display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <Lbl style={{ display:"block", marginBottom:20 }}>How We Got Started</Lbl>
            <p style={{ ...disp({ fontSize:15, color:C.dim, lineHeight:1.75, marginBottom:32 }) }}>{ideationBody}</p>
            <div style={{ border:`1px solid ${C.border}`, padding:24, background:C.surface }}>
              <Lbl style={{ display:"block", marginBottom:12, color:C.lime }}>Our Goal</Lbl>
              <p style={{ ...disp({ fontSize:15, color:C.ink, lineHeight:1.7, margin:0 }) }}>{ideationGoal}</p>
            </div>
          </Cell>
          <Surface>
            <Frame src={img.brainstorm} alt="Brainstorming session" style={{ height:"100%", minHeight:340 }} interactive>
              <Overlay />
              <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:24 }}><Lbl>Brainstorming</Lbl></div>
            </Frame>
          </Surface>
        </Grid>
      </Inner>
    </Reveal>
  )
}

function DesignSolutionSection({ aiData }) {
  return (
    <Reveal>
      <Inner>
        <Heading num="06">Design Solution</Heading>
        <Grid cols="1fr" style={{ marginBottom:1 }}>
          <Cell style={{ padding:40 }}>
            <Lbl style={{ display:"block", marginBottom:16 }}>AI × AR Powered Gamification</Lbl>
            <p style={{ ...disp({ fontSize:15, color:C.dim, lineHeight:1.75, maxWidth:672, marginBottom:32 }) }}>
              We designed an AR-based mobile platform where users can:
            </p>
            <Grid cols="repeat(3,1fr)" className="rf-three-col">
              {[
                ["01 — Deploy","Deploy AI-generated drone missions to reforest real land."],
                ["02 — Earn",  "Earn tokens by restoring degraded areas digitally, synced with real conservation."],
                ["03 — Track", "Track and visualize environmental change over time with AI analysis."],
              ].map(([k,v])=>(
                <motion.div key={k} whileHover={{ background:C.raised }} transition={{ duration:0.2 }} style={{ background:C.surface, padding:24 }}>
                  <span style={{ color:C.lime, ...mono({ fontSize:9, letterSpacing:".1em", textTransform:"uppercase", display:"block", marginBottom:12 }) }}>{k}</span>
                  <p style={{ ...disp({ fontSize:13, color:C.dim, lineHeight:1.65, margin:0 }) }}>{v}</p>
                </motion.div>
              ))}
            </Grid>
          </Cell>
        </Grid>

        <div style={{ paddingTop:20, paddingBottom:20 }}><Lbl>How AI Was Used</Lbl></div>

        <Grid cols="repeat(3,1fr)" className="rf-three-col">
          {aiData.map(card=>(
            <motion.div key={card.num} className="rf-ai-card" whileHover={{ background:"#0f0f0f" }} transition={{ duration:0.2 }}
              style={{ background:C.bg, display:"grid", gridTemplateRows:"180px auto 1fr" }}>
              <div style={{ height:180, overflow:"hidden", position:"relative", borderBottom:`1px solid ${C.border}` }}>
                <img src={card.img} alt={card.title} className="rf-ai-img"
                  style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 30%,rgba(0,0,0,.55))", pointerEvents:"none" }} />
                <div style={{ position:"absolute", bottom:0, left:0, padding:16 }}>
                  <Chip bc={card.bc} tc={card.tc}>{card.use}</Chip>
                </div>
              </div>
              <div style={{ borderBottom:`1px solid ${C.border}`, padding:"28px 32px 20px" }}>
                <Lbl style={{ display:"block", marginBottom:8 }}>{card.num}</Lbl>
                <h3 style={{ ...disp({ fontSize:15, color:"white", fontWeight:500, lineHeight:1.3, margin:0 }) }}>{card.title}</h3>
              </div>
              <div style={{ padding:32 }}>
                <p style={{ ...disp({ fontSize:13, color:C.dim, lineHeight:1.7, margin:0 }) }}>{card.body}</p>
              </div>
            </motion.div>
          ))}
        </Grid>
      </Inner>
    </Reveal>
  )
}

function GameMechanicsSection({ data, stepsData }) {
  const [active, setActive] = useState(1)
  const handleStep = useCallback((n) => { if (n !== active) setActive(n) }, [active])
  const step = stepsData[active - 1] || stepsData[0]

  return (
    <Reveal>
      <Inner>
        <div style={{ display:"flex", alignItems:"baseline", gap:16, marginBottom:40 }}>
          <Lbl style={{ minWidth:28 }}>07</Lbl>
          <h2 style={{ fontWeight:300, color:"white", fontSize:"clamp(24px,3.5vw,44px)", letterSpacing:"-0.02em", lineHeight:1.1, margin:0 }}>
            Game Mechanics &<br/>Ecosystem Flow
          </h2>
        </div>
        <p style={{ ...disp({ fontSize:15, color:C.dim, lineHeight:1.75, maxWidth:672, marginBottom:16 }) }}>
          <strong style={{ color:C.ink }}>What Kind of Game Is It?</strong> — {data.gameDescription}
        </p>
        <Lbl style={{ display:"block", marginBottom:24 }}>Game System Overview</Lbl>

        {/* Tab bar */}
        <div style={{ display:"flex", border:`1px solid ${C.border}`, borderBottom:"none" }}>
          {stepsData.map((s, i)=>(
            <motion.button key={s.label + i}
              className={`rf-tab${active===i+1?" rf-tab-on":""}`}
              onClick={()=>handleStep(i+1)}
              whileTap={{ scale:0.96 }}
              transition={{ duration:0.1 }}
              onKeyDown={e=>{
                if(e.key==="ArrowRight") { e.preventDefault(); handleStep(Math.min(stepsData.length, i+2)) }
                if(e.key==="ArrowLeft")  { e.preventDefault(); handleStep(Math.max(1, i)) }
              }}
              style={{
                flex:1, fontSize:9, letterSpacing:".1em", textTransform:"uppercase",
                padding:"14px 8px", cursor:"pointer", border:"none",
                borderRight: i < stepsData.length - 1 ? `1px solid ${C.border}` : "none",
                background: active===i+1 ? "#c8ff0008" : C.surface,
                color:       active===i+1 ? C.lime : C.muted,
              }}
            >
              {String(i+1).padStart(2,"0")} — {s.label}
            </motion.button>
          ))}
        </div>

        {/* Step panel — AnimatePresence for smooth transitions */}
        <div style={{ border:`1px solid ${C.border}`, borderTop:"none" }}>
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
              transition={{ duration:0.28, ease:ease.std }}
              style={{ display:"flex", flexDirection:"column" }}
            >
              {/* Image — full width, natural ratio */}
              <div style={{ position:"relative", background:C.surface, borderBottom:`1px solid ${C.border}` }}>
                <motion.img src={step.img} alt={step.label}
                  initial={{ scale:1.04 }} animate={{ scale:1 }} transition={{ duration:0.5, ease:ease.out }}
                  style={{ width:"100%", height:"auto", display:"block" }} />
                <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:24 }}>
                  <Chip bc={step.chipBc} tc={step.chipTc}>Step {step.num} — {step.label}</Chip>
                </div>
              </div>
              {/* Text */}
              <div style={{ background:C.bg, display:"flex", flexDirection:"column", justifyContent:"center", padding:48 }}>
                <Lbl style={{ display:"block", marginBottom:20 }}>Step {step.num} / {String(stepsData.length).padStart(2,"0")}</Lbl>
                <h3 style={{ ...disp({ fontSize:22, color:"white", fontWeight:500, letterSpacing:"-0.02em", lineHeight:1.2, margin:"0 0 20px" }), whiteSpace:"pre-line" }}>
                  {step.title}
                </h3>
                <p style={{ ...disp({ fontSize:14, color:C.dim, lineHeight:1.75, margin:step.extra?"0 0 24px":0 }) }}>{step.body}</p>

                {step.extra==="tokens" && (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {TOKEN_ROWS.map(t=>(
                      <motion.div key={t.label} className="rf-token-row" whileHover={{ background:"#0f1f0f" }} transition={{ duration:0.15 }}
                        style={{ display:"flex", alignItems:"center", gap:16, padding:"14px 16px", border:`1px solid ${t.bc}`, background:t.bg, cursor:"pointer" }}>
                        <span style={{ color:t.tc, ...mono({ fontSize:9, letterSpacing:".1em", textTransform:"uppercase" }) }}>{t.label}</span>
                        <span style={{ ...disp({ fontSize:12, color:C.dim }), flex:1 }}>{t.desc}</span>
                        <Chip bc={t.bc} tc={t.tc}>{t.badge}</Chip>
                      </motion.div>
                    ))}
                  </div>
                )}

                {step.extra==="restore" && (
                  <div style={{ border:`1px solid ${C.lime}`, padding:20, background:"#0a120a" }}>
                    <Lbl style={{ display:"block", marginBottom:8, color:C.lime }}>Example</Lbl>
                    <p style={{ ...disp({ fontSize:13, color:C.ink, lineHeight:1.65, margin:0 }) }}>
                      Completing a mission → A real tree is planted through a partner NGO.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Inner>
    </Reveal>
  )
}

function FinalDemoSection({ data, img }) {
  const { videoLabel, demoVideo } = data
  return (
    <Reveal>
      <Inner>
        <Heading num="08">Final Demo</Heading>
        {/* Video — shows real video when demoVideo prop is set, otherwise placeholder */}
        <div style={{ border:`1px solid ${C.border}`, marginBottom:1, boxShadow:"0 2px 40px #00000099" }}>
          <WindowChrome label="ReforestAR — Prototype Walkthrough" badge="Video" />
          {demoVideo ? (
            <video
              src={demoVideo}
              autoPlay
              loop
              muted
              playsInline
              style={{ width:"100%", aspectRatio:"16/9", display:"block", objectFit:"cover", background:"#0d0d0d" }}
            />
          ) : (
            <motion.div whileHover={{ background:"#0e0e0e" }} transition={{ duration:0.2 }}
              style={{ position:"relative", width:"100%", aspectRatio:"16/9", background:"#0d0d0d",
                backgroundImage:"radial-gradient(ellipse at 50% 50%,#c8ff0006 0%,transparent 70%),linear-gradient(#ffffff02 1px,transparent 1px),linear-gradient(90deg,#ffffff02 1px,transparent 1px)",
                backgroundSize:"auto,48px 48px,48px 48px",
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                cursor:"pointer", overflow:"hidden" }}
            >
              <motion.div whileHover={{ scale:1.12, background:"rgba(200,255,0,.16)" }} whileTap={{ scale:0.94 }}
                transition={{ duration:0.22, ease:ease.spring }}
                style={{ width:64, height:64, borderRadius:"50%", border:`1px solid ${C.lime}`, background:"rgba(200,255,0,.06)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                <svg width={18} height={20} viewBox="0 0 18 20" fill="none">
                  <path d="M1 1.5L17 10L1 18.5V1.5Z" stroke={C.lime} strokeWidth={1.5} strokeLinejoin="round" />
                </svg>
              </motion.div>
              <Lbl style={{ display:"block", marginBottom:8, color:C.lime }}>{videoLabel}</Lbl>
              <Lbl>Upload video via "Demo Video" in Framer properties</Lbl>
            </motion.div>
          )}
        </div>
        {/* Main demo image */}
        <div style={{ border:`1px solid ${C.border}`, marginBottom:1, boxShadow:"0 2px 40px #00000099" }}>
          <WindowChrome label="ReforestAR — App Screens" badge="Final Prototype" bc={C.lime} tc={C.lime} />
          <Frame src={img.demoMain} alt="ReforestAR Final Demo" height={480} style={{ background:"#0a1a0a" }} interactive />
        </div>
        {/* Three app screens */}
        <Grid cols="1fr 1fr 1fr" className="rf-three-col">
          {[img.screen1, img.screen2, img.screen3].map((src, i)=>(
            <motion.div key={i} whileHover={{ background:C.raised }} transition={{ duration:0.2 }}
              style={{ background:C.surface, minHeight:260, position:"relative", overflow:"hidden" }}>
              <img src={src} alt={`App Screen ${i+1}`}
                style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"contain", padding:16, display:"block" }} />
            </motion.div>
          ))}
        </Grid>
        {/* Bottom demo image */}
        <Grid cols="1fr" style={{ marginTop:1 }}>
          <Frame src={img.demoBottom} alt="ReforestAR App Demo Screen" minHeight={320} interactive />
        </Grid>
      </Inner>
    </Reveal>
  )
}

function OutcomeSection({ data, img }) {
  const { outcome1, outcome2, outcome3 } = data
  return (
    <Reveal>
      <Inner>
        <Heading num="09">Outcome</Heading>
        <div style={{ border:`1px solid ${C.border}`, marginBottom:1, boxShadow:"0 2px 40px #00000099" }}>
          <Frame src={img.winner} alt="AI Hackathon 1st Place" height={400} interactive>
            <Overlay fromBottom={false} />
            <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:32 }}>
              <Chip bc={C.amber} tc={C.amber} style={{ display:"inline-block", marginBottom:12 }}>★ 1st Place Winner</Chip>
              <h3 style={{ ...disp({ fontSize:"clamp(18px,2.5vw,32px)", color:"white", fontWeight:300, letterSpacing:"-0.02em", lineHeight:1.2, margin:0 }) }}>
                AI Hackathon — San Francisco
              </h3>
            </div>
          </Frame>
        </div>
        <Grid cols="1fr 1fr" className="rf-two-col" style={{ marginBottom:1 }}>
          <Cell style={{ padding:40, display:"flex", flexDirection:"column", justifyContent:"center" }}>
            {[outcome1, outcome2, outcome3].map((t,i)=>(
              <p key={i} style={{ ...disp({ fontSize:15, color:C.dim, lineHeight:1.75, margin:"0 0 24px" }) }}>{t}</p>
            ))}
          </Cell>
          <Grid cols="1fr 1fr" style={{ border:"none" }}>
            <Frame src={img.team1} alt="Team working session" minHeight={200} interactive />
            <Frame src={img.team2} alt="Team collaboration"   minHeight={200} interactive />
            <Frame src={img.team3} alt="Team photo"           minHeight={200} style={{ gridColumn:"1/-1" }} interactive />
          </Grid>
        </Grid>
      </Inner>
    </Reveal>
  )
}

function ReflectionSection({ data }) {
  const { reflection1, reflection2, reflectionQuote } = data
  return (
    <Reveal>
      <Inner>
        <Heading num="10">Reflection</Heading>
        <Grid cols="1fr 1fr" className="rf-two-col">
          <motion.div whileHover={{ background:C.raised }} transition={{ duration:0.2 }} style={{ background:C.bg, padding:40 }}>
            <p style={{ ...disp({ fontSize:15, color:C.dim, lineHeight:1.75, marginBottom:24, whiteSpace:"pre-line" }) }}>{reflection1}</p>
            <ul style={{ listStyle:"none", margin:"0 0 24px", padding:0, display:"flex", flexDirection:"column", gap:12 }}>
              {["Is this idea actually feasible?","Will users stay engaged?","Is there a path to real impact and funding?"].map(t=>(
                <li key={t} style={{ display:"flex", gap:12, ...disp({ fontSize:14, color:C.dim, lineHeight:1.6 }) }}>
                  <span style={{ color:C.muted, ...mono({ fontSize:10 }) }}>—</span>{t}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div whileHover={{ background:C.raised }} transition={{ duration:0.2 }} style={{ background:C.bg, padding:40 }}>
            <p style={{ ...disp({ fontSize:15, color:C.dim, lineHeight:1.75, marginBottom:24 }) }}>{reflection2}</p>
            <div style={{ border:`1px solid ${C.border}`, borderLeft:`2px solid ${C.lime}`, padding:28, marginTop:16, background:C.surface }}>
              <p style={{ ...disp({ fontSize:15, color:C.ink, lineHeight:1.75, margin:0 }) }}>{reflectionQuote}</p>
            </div>
          </motion.div>
        </Grid>
      </Inner>
    </Reveal>
  )
}

function Footer({ data }) {
  const { footerName } = data
  return (
    <footer style={{ borderTop:`1px solid ${C.border}` }}>
      <div className="rf-footer-inner rf-px"
        style={{ maxWidth:1152, margin:"0 auto", padding:"32px 40px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <Lbl style={{ display:"block", marginBottom:8 }}>ID:CASE_STUDY / AI_HACKATHON / 1ST_PLACE / APR_2025</Lbl>
          <Lbl style={{ color:"#444" }}>{footerName}</Lbl>
        </div>
        <nav style={{ display:"flex", gap:32 }}>
          {[["#hero","Top ↑"],["#","← All Projects"],["#","Next Case Study →"]].map(([href,label])=>(
            <motion.a key={label} href={href} className="rf-link" style={lbl()}
              whileHover={{ y:-1 }} transition={{ duration:0.15, ease:ease.spring }}>
              {label}
            </motion.a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function ReforestAR({
  // ── Images ───────────────────────────────────────────────────────────────
  logoImage, heroImage, overviewImage, deforestImage, personaImage, brainstormImage,
  demoMainImage, screen1Image, screen2Image, screen3Image, demoBottomImage,
  winnerImage, team1Image, team2Image, team3Image,

  // ── AI Section Images (use01 / use02 / use03) ─────────────────────────────
  aiImage01, aiImage02, aiImage03,

  // ── Game Step Images (image01 – image05) ─────────────────────────────────
  stepImage01, stepImage02, stepImage03, stepImage04, stepImage05,

  // ── Demo Video ────────────────────────────────────────────────────────────
  demoVideo = "Lara.mp4",

  // ── Hero ─────────────────────────────────────────────────────────────────
  heroHeadline    = "AI Hackathon",
  heroAccentText  = "1st Place.",
  heroTagline     = "Play to Protect. Earn to Restore.",
  heroIntro       = T.heroIntro,
  heroDate        = "Apr 2025",
  heroTeam        = "4 UX/UI Designers\nUFSC Support",
  heroCoreSkills  = "AI-Enhanced Design\nCollaboration · Awards",
  heroTools       = "Figma · ChatGPT\nVisual Electric · Sora",

  // ── Overview ─────────────────────────────────────────────────────────────
  overviewQuote   = "Can technology give everyday people the power to reverse global destruction?",
  overviewBody    = T.overviewBody,

  // ── Persona ──────────────────────────────────────────────────────────────
  personaName     = "Davi Almeida",
  personaAge      = "Age 22",
  personaInsight  = "Davi needs a clear, trustworthy, and engaging way to take real action — no matter where he is.",

  // ── Ideation ─────────────────────────────────────────────────────────────
  ideationBody    = T.ideationBody,
  ideationGoal    = "To create a sense of agency. Make forest restoration personal, accessible, and rewarding.",

  // ── Game Mechanics ───────────────────────────────────────────────────────
  gameDescription = T.gameDesc,
  steps           = STEPS_DEFAULT,

  // ── AI Cards ─────────────────────────────────────────────────────────────
  aiCards         = AI_DEFAULT,

  // ── Final Demo ───────────────────────────────────────────────────────────
  videoLabel      = "Prototype Walkthrough",

  // ── Outcome ──────────────────────────────────────────────────────────────
  outcome1        = T.outcome1,
  outcome2        = T.outcome2,
  outcome3        = T.outcome3,

  // ── Reflection ───────────────────────────────────────────────────────────
  reflection1     = T.reflection1,
  reflection2     = T.reflection2,
  reflectionQuote = T.reflectionQuote,

  // ── Footer ───────────────────────────────────────────────────────────────
  footerName      = "Sungju Kim — UX/UI Designer · Product Designer · San Francisco Bay Area",

  style = {},
  className = "",
}) {
  // Build image map with fallbacks to default URLs
  const img = {
    logo:       logoImage       || URL_DEFAULTS.logo,
    hero:       heroImage       || URL_DEFAULTS.hero,
    overview:   overviewImage   || URL_DEFAULTS.overview,
    deforest:   deforestImage   || URL_DEFAULTS.deforest,
    persona:    personaImage    || URL_DEFAULTS.persona,
    brainstorm: brainstormImage || URL_DEFAULTS.brainstorm,
    demoMain:   demoMainImage   || URL_DEFAULTS.demoMain,
    screen1:    screen1Image    || URL_DEFAULTS.screen1,
    screen2:    screen2Image    || URL_DEFAULTS.screen2,
    screen3:    screen3Image    || URL_DEFAULTS.screen3,
    demoBottom: demoBottomImage || URL_DEFAULTS.demoBottom,
    winner:     winnerImage     || URL_DEFAULTS.winner,
    team1:      team1Image      || URL_DEFAULTS.team1,
    team2:      team2Image      || URL_DEFAULTS.team2,
    team3:      team3Image      || URL_DEFAULTS.team3,
    // AI section — use01 / use02 / use03
    ai01: aiImage01 || URL_DEFAULTS.ai1,
    ai02: aiImage02 || URL_DEFAULTS.ai2,
    ai03: aiImage03 || URL_DEFAULTS.ai3,
    // Game steps — image01 – image05
    step01: stepImage01 || URL_DEFAULTS.step1,
    step02: stepImage02 || URL_DEFAULTS.step2,
    step03: stepImage03 || URL_DEFAULTS.step3,
    step04: stepImage04 || URL_DEFAULTS.step4,
    step05: stepImage05 || URL_DEFAULTS.step5,
  }

  // Build text content object
  const data = {
    heroHeadline, heroAccentText, heroTagline, heroIntro,
    heroDate, heroTeam, heroCoreSkills, heroTools,
    overviewQuote, overviewBody,
    personaName, personaAge, personaInsight,
    ideationBody, ideationGoal,
    gameDescription,
    videoLabel, demoVideo,
    outcome1, outcome2, outcome3,
    reflection1, reflection2, reflectionQuote,
    footerName,
  }

  // Top-level step images in order (image01 – image05)
  const stepImgs = [img.step01, img.step02, img.step03, img.step04, img.step05]

  // Merge step props with defaults (Framer array controls override label/title/body)
  const stepsData = (Array.isArray(steps) && steps.length ? steps : STEPS_DEFAULT)
    .slice(0, 5)
    .map((s, i) => {
      const def = STEPS_DEFAULT[i] || STEPS_DEFAULT[0]
      return {
        num:    String(i + 1).padStart(2, "0"),
        label:  s.label  !== undefined ? s.label  : def.label,
        title:  s.title  !== undefined ? s.title  : def.title,
        body:   s.body   !== undefined ? s.body   : def.body,
        img:    stepImgs[i] || def.img,
        chipBc: def.chipBc,
        chipTc: def.chipTc,
        extra:  STEP_EXTRA[i] || null,   // structural — always index-based
      }
    })

  // Top-level AI images in order (use01 / use02 / use03)
  const aiImgs = [img.ai01, img.ai02, img.ai03]

  // Merge AI card props with defaults
  const aiData = (Array.isArray(aiCards) && aiCards.length ? aiCards : AI_DEFAULT)
    .slice(0, 3)
    .map((c, i) => {
      const def = AI_DEFAULT[i] || AI_DEFAULT[0]
      return {
        use:   def.use,
        bc:    def.bc,
        tc:    def.tc,
        num:   def.num,
        title: c.title !== undefined ? c.title : def.title,
        body:  c.body  !== undefined ? c.body  : def.body,
        img:   aiImgs[i] || def.img,
      }
    })

  return (
    <div style={{ background:C.bg, color:C.ink, position:"relative", overflowX:"hidden", ...style }} className={className}>
      <style>{CSS}</style>

      {/* Ambient lime glow */}
      <div style={{ position:"fixed", top:-300, left:"50%", transform:"translateX(-50%)", width:800, height:600,
        background:"radial-gradient(ellipse,#c8ff0008 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      {/* Noise texture */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, opacity:.5,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")` }} />

      <HeroSection          data={data}   img={img} />
      <OverviewSection      data={data}   img={img} />
      <ProblemSection                     img={img} />
      <PersonaSection       data={data}   img={img} />
      <IdeationSection      data={data}   img={img} />
      <DesignSolutionSection              aiData={aiData} />
      <GameMechanicsSection data={data}   stepsData={stepsData} />
      <FinalDemoSection     data={data}   img={img} />
      <OutcomeSection       data={data}   img={img} />
      <ReflectionSection    data={data} />
      <Footer               data={data} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FRAMER PROPERTY CONTROLS
// ─────────────────────────────────────────────────────────────────────────────
addPropertyControls(ReforestAR, {

  // ── Images ───────────────────────────────────────────────────────────────
  logoImage:       { type:ControlType.Image,  title:"Logo" },
  heroImage:       { type:ControlType.Image,  title:"Hero Image" },
  overviewImage:   { type:ControlType.Image,  title:"Overview Image" },
  deforestImage:   { type:ControlType.Image,  title:"Problem Image" },
  personaImage:    { type:ControlType.Image,  title:"Persona Photo" },
  brainstormImage: { type:ControlType.Image,  title:"Brainstorm Image" },
  demoMainImage:   { type:ControlType.Image,  title:"Demo Main Image" },
  screen1Image:    { type:ControlType.Image,  title:"App Screen 1" },
  screen2Image:    { type:ControlType.Image,  title:"App Screen 2" },
  screen3Image:    { type:ControlType.Image,  title:"App Screen 3" },
  demoBottomImage: { type:ControlType.Image,  title:"Demo Bottom Image" },
  winnerImage:     { type:ControlType.Image,  title:"Winner Photo" },
  team1Image:      { type:ControlType.Image,  title:"Team Photo 1" },
  team2Image:      { type:ControlType.Image,  title:"Team Photo 2" },
  team3Image:      { type:ControlType.Image,  title:"Team Photo 3" },

  // ── AI Section Images (use01 / use02 / use03) ─────────────────────────────
  aiImage01: { type:ControlType.Image, title:"AI Use 01 Image" },
  aiImage02: { type:ControlType.Image, title:"AI Use 02 Image" },
  aiImage03: { type:ControlType.Image, title:"AI Use 03 Image" },

  // ── Game Step Images (image01 – image05) ─────────────────────────────────
  stepImage01: { type:ControlType.Image, title:"Step Image 01" },
  stepImage02: { type:ControlType.Image, title:"Step Image 02" },
  stepImage03: { type:ControlType.Image, title:"Step Image 03" },
  stepImage04: { type:ControlType.Image, title:"Step Image 04" },
  stepImage05: { type:ControlType.Image, title:"Step Image 05" },

  // ── Demo Video (Lara) ─────────────────────────────────────────────────────
  demoVideo: { type:ControlType.File, title:"Demo Video", allowedFileTypes:["mp4","webm","mov","ogg"] },

  // ── Hero ─────────────────────────────────────────────────────────────────
  heroHeadline:   { type:ControlType.String, title:"Headline",    defaultValue:"AI Hackathon" },
  heroAccentText: { type:ControlType.String, title:"Accent Line", defaultValue:"1st Place." },
  heroTagline:    { type:ControlType.String, title:"Tagline",     defaultValue:"Play to Protect. Earn to Restore." },
  heroIntro:      { type:ControlType.String, title:"Hero Intro",  displayTextArea:true, defaultValue:T.heroIntro },
  heroDate:       { type:ControlType.String, title:"Date",        defaultValue:"Apr 2025" },
  heroTeam:       { type:ControlType.String, title:"Team",        defaultValue:"4 UX/UI Designers\nUFSC Support" },
  heroCoreSkills: { type:ControlType.String, title:"Core Skills", defaultValue:"AI-Enhanced Design\nCollaboration · Awards" },
  heroTools:      { type:ControlType.String, title:"Tools",       defaultValue:"Figma · ChatGPT\nVisual Electric · Sora" },

  // ── Overview ─────────────────────────────────────────────────────────────
  overviewQuote: { type:ControlType.String, title:"Overview Quote", displayTextArea:true, defaultValue:"Can technology give everyday people the power to reverse global destruction?" },
  overviewBody:  { type:ControlType.String, title:"Overview Body",  displayTextArea:true, defaultValue:T.overviewBody },

  // ── Persona ──────────────────────────────────────────────────────────────
  personaName:    { type:ControlType.String, title:"Persona Name",    defaultValue:"Davi Almeida" },
  personaAge:     { type:ControlType.String, title:"Persona Age",     defaultValue:"Age 22" },
  personaInsight: { type:ControlType.String, title:"Persona Insight", displayTextArea:true, defaultValue:"Davi needs a clear, trustworthy, and engaging way to take real action — no matter where he is." },

  // ── Ideation ─────────────────────────────────────────────────────────────
  ideationBody: { type:ControlType.String, title:"Ideation Body", displayTextArea:true, defaultValue:T.ideationBody },
  ideationGoal: { type:ControlType.String, title:"Ideation Goal", displayTextArea:true, defaultValue:"To create a sense of agency. Make forest restoration personal, accessible, and rewarding." },

  // ── Game Mechanics ───────────────────────────────────────────────────────
  gameDescription: { type:ControlType.String, title:"Game Description", displayTextArea:true, defaultValue:T.gameDesc },
  steps: {
    type:  ControlType.Array,
    title: "Game Steps",
    control: {
      type: ControlType.Object,
      controls: {
        label: { type:ControlType.String, title:"Tab Label",   defaultValue:"Enter" },
        title: { type:ControlType.String, title:"Panel Title", defaultValue:"Step Title" },
        body:  { type:ControlType.String, title:"Body Text",   displayTextArea:true, defaultValue:"Step description." },
      },
    },
    maxCount: 5,
  },

  // ── AI Cards ─────────────────────────────────────────────────────────────
  aiCards: {
    type:  ControlType.Array,
    title: "AI Cards",
    control: {
      type: ControlType.Object,
      controls: {
        title: { type:ControlType.String, title:"Card Title", defaultValue:"AI Application" },
        body:  { type:ControlType.String, title:"Card Body",  displayTextArea:true, defaultValue:"Description." },
      },
    },
    maxCount: 3,
  },

  // ── Final Demo ───────────────────────────────────────────────────────────
  videoLabel: { type:ControlType.String, title:"Video Label", defaultValue:"Prototype Walkthrough" },

  // ── Outcome ──────────────────────────────────────────────────────────────
  outcome1: { type:ControlType.String, title:"Outcome Text 1", displayTextArea:true, defaultValue:T.outcome1 },
  outcome2: { type:ControlType.String, title:"Outcome Text 2", displayTextArea:true, defaultValue:T.outcome2 },
  outcome3: { type:ControlType.String, title:"Outcome Text 3", displayTextArea:true, defaultValue:T.outcome3 },

  // ── Reflection ───────────────────────────────────────────────────────────
  reflection1:     { type:ControlType.String, title:"Reflection Text 1", displayTextArea:true, defaultValue:T.reflection1 },
  reflection2:     { type:ControlType.String, title:"Reflection Text 2", displayTextArea:true, defaultValue:T.reflection2 },
  reflectionQuote: { type:ControlType.String, title:"Reflection Quote",  displayTextArea:true, defaultValue:T.reflectionQuote },

  // ── Footer ───────────────────────────────────────────────────────────────
  footerName: { type:ControlType.String, title:"Footer Credit", defaultValue:"Sungju Kim — UX/UI Designer · Product Designer · San Francisco Bay Area" },
})
