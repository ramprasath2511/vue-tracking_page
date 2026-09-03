<template>
  <div class="glass-mark" aria-hidden="true">
    <div class="glass-mark__orbit glass-mark__orbit--one"></div>
    <div class="glass-mark__orbit glass-mark__orbit--two"></div>
    <div class="glass-mark__shadow"></div>
    <div class="glass-mark__card">
      <div class="glass-mark__shine"></div>
      <div class="glass-mark__core"><span>Z</span></div>
      <img src="https://www.zippd.com/wp-content/uploads/2026/02/zippd-logo-blue.png" alt="" />
      <p>DELIVERY, SIMPLIFIED</p>
    </div>
    <i class="glass-mark__star glass-mark__star--one"></i><i class="glass-mark__star glass-mark__star--two"></i>
  </div>
</template>

<style scoped>
.glass-mark { --mark-size: min(19rem, 30vw); position: relative; width: var(--mark-size); height: calc(var(--mark-size) * 1.04); margin: auto; perspective: 900px; isolation: isolate; }
.glass-mark__orbit { position: absolute; width: 88%; aspect-ratio: 1; left: 6%; top: 6%; border-radius: 50%; border: 1px solid rgba(171,225,250,.38); }.glass-mark__orbit--one { transform: rotateX(67deg) rotateZ(-18deg); }.glass-mark__orbit--two { transform: rotateY(68deg) rotateZ(23deg); opacity: .42; }
.glass-mark__shadow { position: absolute; width: 62%; height: 8%; left: 19%; bottom: 6%; border-radius: 50%; background: rgba(0,0,0,.38); filter: blur(13px); animation: glass-shadow 4.5s ease-in-out infinite; }
.glass-mark__card { position: absolute; display: grid; place-items: center; align-content: center; gap: 1rem; width: 65%; aspect-ratio: .9; left: 17.5%; top: 10%; overflow: hidden; border: 1px solid rgba(255,255,255,.52); border-radius: 2rem; background: linear-gradient(135deg, rgba(205,245,255,.39), rgba(64,144,255,.13)); box-shadow: inset 0 1px 0 rgba(255,255,255,.65), inset 0 -18px 30px rgba(16,59,176,.2), 0 26px 45px rgba(1,12,67,.38); backdrop-filter: blur(13px); transform-style: preserve-3d; animation: glass-float 4.5s ease-in-out infinite; }
.glass-mark__shine { position: absolute; width: 150%; height: 44%; left: -30%; top: -10%; background: linear-gradient(110deg, transparent 28%, rgba(255,255,255,.52) 46%, transparent 63%); transform: rotate(-20deg); animation: glass-shine 5s ease-in-out infinite; }
.glass-mark__core { position: relative; display: grid; place-items: center; width: 4.7rem; aspect-ratio: 1; border: 1px solid rgba(255,255,255,.74); border-radius: 50%; color: white; background: rgba(23,61,237,.52); box-shadow: inset 0 1px 9px rgba(255,255,255,.48), 0 8px 18px rgba(4,16,69,.23); font-size: 2.25rem; font-weight: 700; }.glass-mark__core span { transform: translateY(-.05em); }
.glass-mark img { position: relative; width: 74%; height: auto; filter: brightness(0) invert(1); opacity: .96; }.glass-mark p { position: relative; margin: -.4rem 0 0; color: rgba(255,255,255,.78); font-size: .48rem; font-weight: 700; letter-spacing: .16em; }
.glass-mark__star { position: absolute; width: .4rem; height: .4rem; border-radius: 50%; background: white; box-shadow: 0 0 14px white; animation: glass-star 2.8s ease-in-out infinite; }.glass-mark__star--one { left: 9%; top: 21%; }.glass-mark__star--two { right: 4%; bottom: 27%; animation-delay: 1.2s; }
@keyframes glass-float { 0%,100% { transform: translateY(0) rotateX(2deg) rotateY(-11deg) rotateZ(-4deg); } 50% { transform: translateY(-13px) rotateX(-3deg) rotateY(10deg) rotateZ(3deg); } } @keyframes glass-shadow { 0%,100% { transform: scale(1); opacity: .6; } 50% { transform: scale(.78); opacity: .26; } } @keyframes glass-shine { 0%,25% { transform: translateX(-42%) rotate(-20deg); opacity: 0; } 45% { opacity: 1; } 72%,100% { transform: translateX(62%) rotate(-20deg); opacity: 0; } } @keyframes glass-star { 0%,100% { transform: scale(.35); opacity:.2; } 50% { transform:scale(1.25); opacity:1; } } @media (prefers-reduced-motion:reduce) { .glass-mark * { animation:none !important; } }
</style>
