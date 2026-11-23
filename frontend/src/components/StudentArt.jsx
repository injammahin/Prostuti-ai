/** Original flat illustration: a student writing at a desk. Colors follow the brand. */
export default function StudentArt({ shirt = "#1d6b55", sleeve = "#175a47", className }) {
  const skin = "#f4c1a4"
  const hair = "#2a1f1d"
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label="Student studying at a desk">
      {/* lamp */}
      <g>
        <ellipse cx="92" cy="284" rx="26" ry="6" fill="#0c4a3f" />
        <path d="M92 282 L110 212 L84 178" fill="none" stroke="#0c4a3f" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M60 196 L96 162 L112 186 Z" fill="#0c4a3f" />
        <path d="M76 192 L112 186 L118 214 Z" fill="#fde7a6" opacity=".55" />
        <circle cx="84" cy="178" r="6" fill="#7ee0b8" />
      </g>

      {/* hair (back) */}
      <path d="M160 150 C154 196 166 222 182 230 L222 230 C236 222 248 196 240 150 Z" fill={hair} />
      {/* torso */}
      <path d="M124 290 C124 238 150 210 200 210 C250 210 276 238 276 290 Z" fill={shirt} />
      <path d="M186 210 Q200 226 214 210" fill="none" stroke="#0c4a3f" strokeWidth="3" opacity=".35" />
      {/* neck */}
      <rect x="190" y="188" width="20" height="26" rx="8" fill={skin} />
      {/* head */}
      <circle cx="200" cy="158" r="37" fill={skin} />
      {/* hair (front) */}
      <path d="M160 168 C152 118 188 100 214 108 C244 116 250 146 242 176 C238 154 226 136 204 134 C184 133 170 146 166 174 Z" fill={hair} />
      {/* face */}
      <ellipse cx="186" cy="163" rx="3.2" ry="4" fill={hair} />
      <ellipse cx="214" cy="163" rx="3.2" ry="4" fill={hair} />
      <circle cx="178" cy="175" r="6" fill="#f08f80" opacity=".45" />
      <circle cx="222" cy="175" r="6" fill="#f08f80" opacity=".45" />
      <path d="M192 179 Q200 186 208 179" fill="none" stroke="#7a3b2e" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="238" cy="166" r="3.5" fill="#e8a317" />

      {/* notebook */}
      <path d="M148 283 Q176 274 200 280 Q224 274 252 283 L252 291 L148 291 Z" fill="#fff" stroke="#d6dfdc" strokeWidth="2" />
      <path d="M162 284 L190 281 M162 288 L188 285 M210 281 L238 284" stroke="#b7c6c1" strokeWidth="2" strokeLinecap="round" />
      {/* sleeves + hands */}
      <path d="M136 238 C124 262 136 284 170 287 L176 273 C158 270 152 256 158 240 Z" fill={sleeve} />
      <path d="M264 238 C276 262 266 283 234 287 L226 273 C244 268 248 254 242 240 Z" fill={sleeve} />
      <ellipse cx="176" cy="282" rx="11" ry="8" fill={skin} />
      <ellipse cx="228" cy="281" rx="11" ry="8" fill={skin} />
      {/* pencil */}
      <path d="M230 282 L250 248" stroke="#e8a317" strokeWidth="6" strokeLinecap="round" />
      <path d="M248 251 L252 244" stroke="#2a1f1d" strokeWidth="6" strokeLinecap="round" />

      {/* desk */}
      <rect x="44" y="288" width="312" height="14" rx="7" fill="#0c4a3f" />
      <rect x="64" y="302" width="10" height="44" rx="4" fill="#0c4a3f" opacity=".85" />
      <rect x="326" y="302" width="10" height="44" rx="4" fill="#0c4a3f" opacity=".85" />

      {/* books */}
      <rect x="272" y="274" width="62" height="14" rx="3" fill="#0c4a3f" />
      <rect x="278" y="260" width="54" height="14" rx="3" fill="#7ee0b8" />
      <rect x="274" y="246" width="58" height="14" rx="3" fill="#e8a317" />
      <path d="M282 253 H320 M286 267 H322 M282 281 H324" stroke="#fff" strokeWidth="2" opacity=".6" strokeLinecap="round" />

      <circle cx="112" cy="118" r="5" fill="#e8a317" opacity=".8" />
      <circle cx="300" cy="196" r="4" fill="#0c4a3f" opacity=".25" />
    </svg>
  )
}
