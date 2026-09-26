import React from 'react';

/* =========================================================================
   AUTHENTIC MULTI-COLOR ODOO VECTOR ICONS
   Faithfully matching Odoo's design language from user reference screenshots
   ========================================================================= */

// 1. Accounting: Purple diagonal pill + teal upper & lower circles/pills
export function AccountingIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Diagonal Purple Slash */}
      <rect x="44" y="8" width="12" height="52" rx="6" transform="rotate(38 44 8)" fill="#714B67" />
      {/* Top Left Teal Pill/Dot */}
      <circle cx="21" cy="20" r="8" fill="#017E84" />
      {/* Bottom Right Teal Pill/Dot */}
      <circle cx="43" cy="44" r="8" fill="#017E84" />
    </svg>
  );
}

// 2. Knowledge: Purple notched ribbon bookmark + teal document overlay
export function KnowledgeIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Purple Bookmark Ribbon with V notch */}
      <path d="M18 10C18 7.79086 19.7909 6 22 6H34C36.2091 6 38 7.79086 38 10V56L28 46L18 56V10Z" fill="#714B67" />
      {/* Teal Document Sheet Overlay */}
      <path d="M30 12C30 9.79086 31.7909 8 34 8H46C48.2091 8 50 9.79086 50 12V48C50 50.2091 48.2091 52 46 52H34C31.7909 52 30 50.2091 30 48V12Z" fill="#017E84" opacity="0.95" />
    </svg>
  );
}

// 3. Sign: Flowing blue cursive signature stroke / pen flourish
export function SignIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M14 36C14 26 23 14 30 14C35 14 34 26 28 36C22 46 16 48 20 48C28 48 40 28 46 28C50 28 44 38 52 38C54 38 56 36 57 34"
        stroke="#008080"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 4. CRM: Geometric origami handshake in vibrant teal & magenta/purple
export function CrmIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Teal Left Hand / Arm */}
      <path d="M12 24L28 40L38 30L22 14L12 24Z" fill="#017E84" />
      {/* Magenta / Purple Right Hand / Arm */}
      <path d="M52 24L36 40L26 30L42 14L52 24Z" fill="#714B67" />
      {/* Interlocking Central Diamond */}
      <path d="M28 40L32 44L36 40L32 36L28 40Z" fill="#00BAF2" />
    </svg>
  );
}

// 5. Studio: Crossed cyan wrench & purple screwdriver
export function StudioIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Cyan Wrench */}
      <path
        d="M16 48L32 32M44 20C46.5 16 44 11 40 10C36 9 32 12 34 16L30 20L34 24L44 20Z"
        stroke="#00BAF2"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Purple Screwdriver */}
      <path
        d="M48 48L32 32M18 18L26 26M14 14L18 18"
        stroke="#714B67"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 6. Subscriptions: Two circular refresh arrows (amber top, teal bottom)
export function SubscriptionsIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Top Amber Arrow */}
      <path
        d="M20 28C22 20 30 14 40 16C46 17 50 21 52 26"
        stroke="#F59E0B"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M54 18V28H44" fill="#F59E0B" />
      {/* Bottom Teal Arrow */}
      <path
        d="M44 36C42 44 34 50 24 48C18 47 14 43 12 38"
        stroke="#017E84"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M10 46V36H20" fill="#017E84" />
    </svg>
  );
}

// 7. AI: Bold geometric purple "A" with amber-gradient dot "i"
export function AiIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Purple 'A' */}
      <path d="M14 50L24 16C24.5 14.5 26.5 14.5 27 16L37 50H29.5L27.5 42H23.5L21.5 50H14ZM24.5 36H26.5L25.5 26L24.5 36Z" fill="#714B67" />
      {/* Amber dot for 'i' */}
      <circle cx="44" cy="20" r="4.5" fill="#F59E0B" />
      {/* Amber stem for 'i' */}
      <rect x="40" y="28" width="8" height="22" rx="3" fill="#F59E0B" />
    </svg>
  );
}

// 8. POS: 3D striped storefront awning (purple, amber, coral stripes)
export function PosIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Awning stripes */}
      <path d="M12 20L15 42C15 45 18 47 21 47C24 47 27 45 27 42L25 20H12Z" fill="#714B67" />
      <path d="M25 20L27 42C27 45 30 47 33 47C36 47 39 45 39 42L37 20H25Z" fill="#F59E0B" />
      <path d="M37 20L39 42C39 45 42 47 45 47C48 47 51 45 51 42L49 20H37Z" fill="#E11D48" />
      {/* Top Roof Bar */}
      <rect x="10" y="16" width="44" height="6" rx="2" fill="#523249" />
    </svg>
  );
}

// 9. Discuss: Organic warm orange dialog pebble bubble
export function DiscussIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M16 32C16 20.9543 24.9543 12 36 12C47.0457 12 52 20.9543 52 32C52 43.0457 43.0457 52 32 52C26 52 20 54 14 56C15 50 16 42 16 32Z"
        fill="#F97316"
      />
      <circle cx="28" cy="32" r="3" fill="#FFFFFF" opacity="0.9" />
      <circle cx="36" cy="32" r="3" fill="#FFFFFF" opacity="0.9" />
      <circle cx="44" cy="32" r="3" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

// 10. Documents: Overlapping translucent blue & golden amber folders
export function DocumentsIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Golden Amber Back Sheet */}
      <path d="M26 12H44C46.2091 12 48 13.7909 48 16V46C48 48.2091 46.2091 50 44 50H26C23.7909 50 22 48.2091 22 46V16C22 13.7909 23.7909 12 26 12Z" fill="#F59E0B" />
      {/* Blue Front Sheet */}
      <path d="M16 18H34C36.2091 18 38 19.7909 38 22V52C38 54.2091 36.2091 56 34 56H16C13.7909 56 12 54.2091 12 52V22C12 19.7909 13.7909 18 16 18Z" fill="#0284C7" opacity="0.95" />
    </svg>
  );
}

// 11. Projects: Interlocking checkmarks in purple and teal
export function ProjectsIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Left Purple Check Segment */}
      <path d="M18 34L28 44L36 36L26 26L18 34Z" fill="#714B67" />
      {/* Right Teal Check Wing */}
      <path d="M26 44L48 20L40 14L22 34L26 44Z" fill="#017E84" />
    </svg>
  );
}

// 12. Timesheets: Blue stopwatch gauge with red needle at 10 o'clock
export function TimesheetsIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Stopwatch Blue Outer Ring */}
      <circle cx="32" cy="34" r="20" fill="#0284C7" />
      <circle cx="32" cy="34" r="14" fill="#FFFFFF" />
      {/* Coral Red Needle */}
      <line x1="32" y1="34" x2="24" y2="24" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
      <circle cx="32" cy="34" r="3" fill="#EF4444" />
      {/* Top Stopwatch button */}
      <rect x="29" y="8" width="6" height="5" rx="1.5" fill="#0284C7" />
    </svg>
  );
}

// 13. Field Service: Dynamic dual lightning bolt (purple top, orange bottom)
export function FieldServiceIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Purple Top Bolt */}
      <path d="M34 10L18 32H32L30 38L42 22H32L34 10Z" fill="#714B67" />
      {/* Orange Bottom Bolt */}
      <path d="M30 34L22 46L34 38L30 54L46 30H32L30 34Z" fill="#F97316" />
    </svg>
  );
}

// 14. Planning: Orange left block '<' and teal right block '>'
export function PlanningIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Left Orange Block */}
      <rect x="12" y="16" width="18" height="32" rx="4" fill="#F59E0B" />
      <path d="M23 26L17 32L23 38" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right Teal Block */}
      <rect x="34" y="16" width="18" height="32" rx="4" fill="#017E84" />
      <path d="M41 26L47 32L41 38" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 15. Helpdesk: Rounded mint/teal support cross
export function HelpdeskIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M24 12C24 9.79086 25.7909 8 28 8H36C38.2091 8 40 9.79086 40 12V24H52C54.2091 24 56 25.7909 56 28V36C56 38.2091 54.2091 40 52 40H40V52C40 54.2091 38.2091 56 36 56H28C25.7909 56 24 54.2091 24 52V40H12C9.79086 40 8 38.2091 8 36V28C8 25.7909 9.79086 24 12 24H24V12Z"
        fill="#017E84"
      />
      {/* Inner Heart / Cross Accent */}
      <circle cx="32" cy="32" r="5" fill="#A7F3D0" />
    </svg>
  );
}

// 16. eCommerce: Rich deep purple shopping tote bag
export function EcommerceIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Handle */}
      <path d="M24 22V16C24 11.5817 27.5817 8 32 8C36.4183 8 40 11.5817 40 16V22" stroke="#714B67" strokeWidth="5" strokeLinecap="round" />
      {/* Tote Bag Body */}
      <path d="M14 22H50L46 54C46 55.1046 45.1046 56 44 56H20C18.8954 56 18 55.1046 18 54L14 22Z" fill="#714B67" />
      {/* Bag accent fold */}
      <path d="M22 22L24 56M42 22L40 56" stroke="#56334D" strokeWidth="2" opacity="0.6" />
    </svg>
  );
}

// 17. Website: Split ocean wave sphere in turquoise & cobalt
export function WebsiteIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Top Turquoise Wave */}
      <path d="M14 28C14 18 22 10 32 10C42 10 50 18 50 28C44 26 38 32 32 30C26 28 20 28 14 28Z" fill="#00BAF2" />
      {/* Bottom Cobalt Wave */}
      <path d="M14 36C20 36 26 34 32 36C38 38 44 32 50 36C50 46 42 54 32 54C22 54 14 46 14 36Z" fill="#1E40AF" />
    </svg>
  );
}

// 18. Email Marketing: Paper airplane in purple and cyan
export function MarketingIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Cyan Left Wing */}
      <path d="M12 32L54 12L32 52L26 38L12 32Z" fill="#00BAF2" />
      {/* Purple Right Wing / Fuselage */}
      <path d="M54 12L26 38L32 52L54 12Z" fill="#714B67" />
    </svg>
  );
}

// 19. Inventory: 3D isometric parcel box with purple & teal tape
export function InventoryIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Top Flap */}
      <path d="M32 10L50 20L32 30L14 20L32 10Z" fill="#E2B170" />
      {/* Left Wall */}
      <path d="M14 20L32 30V52L14 42V20Z" fill="#C99451" />
      {/* Right Wall */}
      <path d="M50 20L32 30V52L50 42V20Z" fill="#B37E3B" />
      {/* Purple & Teal Sealing Tape */}
      <path d="M26 13.5L44 23.5L38 27L20 17L26 13.5Z" fill="#714B67" opacity="0.9" />
      <path d="M30 30V52H34V30H30Z" fill="#017E84" />
    </svg>
  );
}

// 20. Sales: Shopping cart / quotation ledger pad
export function SalesIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Cart Basket */}
      <path d="M14 16H20L28 40H46L52 22H24" stroke="#714B67" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Wheels */}
      <circle cx="28" cy="48" r="4" fill="#017E84" />
      <circle cx="44" cy="48" r="4" fill="#017E84" />
      {/* Items in cart */}
      <rect x="26" y="24" width="8" height="10" rx="2" fill="#F59E0B" />
      <rect x="36" y="20" width="10" height="14" rx="2" fill="#00BAF2" />
    </svg>
  );
}

// 21. Purchase: Procurement tote bag with receipt slip
export function PurchaseIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Emerald Tote Bag */}
      <rect x="16" y="22" width="32" height="32" rx="4" fill="#059669" />
      {/* Handle */}
      <path d="M24 22V16C24 11.5817 27.5817 8 32 8C36.4183 8 40 11.5817 40 16V22" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
      {/* Receipt Slip coming out */}
      <path d="M26 18H38V30L35 28L32 30L29 28L26 30V18Z" fill="#ECFDF5" />
    </svg>
  );
}

// 22. MRP / Manufacturing: Factory silhouette with twin chimneys & gear
export function MrpIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Factory Building */}
      <path d="M12 50V30L24 38V30L36 38V22H52V50H12Z" fill="#714B67" />
      {/* Windows */}
      <rect x="40" y="28" width="6" height="6" rx="1" fill="#FDE68A" />
      <rect x="40" y="38" width="6" height="6" rx="1" fill="#FDE68A" />
      {/* Amber Cog / Gear Accent */}
      <circle cx="24" cy="20" r="6" fill="#F59E0B" />
      <circle cx="24" cy="20" r="2.5" fill="#FFFFFF" />
    </svg>
  );
}

// 23. HR / Employees: Multi-avatar team organization
export function HrIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Center Purple Avatar */}
      <circle cx="32" cy="22" r="7" fill="#714B67" />
      <path d="M20 48C20 40 25 36 32 36C39 36 44 40 44 48H20Z" fill="#714B67" />
      {/* Left Teal Avatar */}
      <circle cx="18" cy="26" r="5" fill="#017E84" />
      <path d="M10 50C10 44 14 41 18 41C20 41 22 42 24 43V50H10Z" fill="#017E84" opacity="0.9" />
      {/* Right Amber Avatar */}
      <circle cx="46" cy="26" r="5" fill="#F59E0B" />
      <path d="M54 50C54 44 50 41 46 41C44 41 42 42 40 43V50H54Z" fill="#F59E0B" opacity="0.9" />
    </svg>
  );
}

// 24. Contacts: Corporate address ID card with circular avatar portrait
export function ContactsIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Card Body */}
      <rect x="12" y="14" width="40" height="36" rx="4" fill="#0284C7" />
      {/* Avatar inside */}
      <circle cx="24" cy="28" r="6" fill="#FDE68A" />
      <path d="M16 42C16 38 19 36 24 36C29 36 32 38 32 42H16Z" fill="#F59E0B" />
      {/* Text lines */}
      <rect x="36" y="24" width="12" height="3" rx="1.5" fill="#FFFFFF" opacity="0.9" />
      <rect x="36" y="31" width="10" height="3" rx="1.5" fill="#FFFFFF" opacity="0.7" />
      <rect x="36" y="38" width="8" height="3" rx="1.5" fill="#FFFFFF" opacity="0.5" />
    </svg>
  );
}

// 25. Calendar: Tear-off desk calendar with red binding
export function CalendarIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Calendar Page */}
      <rect x="14" y="16" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
      {/* Red Top Binding */}
      <path d="M14 20C14 17.7909 15.7909 16 18 16H46C48.2091 16 50 17.7909 50 20V26H14V20Z" fill="#EF4444" />
      {/* Grid Dots */}
      <circle cx="22" cy="34" r="2.5" fill="#64748B" />
      <circle cx="32" cy="34" r="2.5" fill="#64748B" />
      <circle cx="42" cy="34" r="2.5" fill="#64748B" />
      <circle cx="22" cy="44" r="2.5" fill="#64748B" />
      <circle cx="32" cy="44" r="2.5" fill="#714B67" />
      <circle cx="42" cy="44" r="2.5" fill="#017E84" />
    </svg>
  );
}

// 26. Spatial AI: 3D isometric futuristic spatial node / cube
export function SpatialIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Isometric Cube Top */}
      <path d="M32 10L48 19L32 28L16 19L32 10Z" fill="#00BAF2" />
      {/* Left Wall */}
      <path d="M16 19L32 28V46L16 37V19Z" fill="#714B67" />
      {/* Right Wall */}
      <path d="M48 19L32 28V46L48 37V19Z" fill="#523249" />
      {/* Floating Center AI Node */}
      <circle cx="32" cy="28" r="4" fill="#F59E0B" />
    </svg>
  );
}

// 27. Dashboard: Executive analytics bar chart in purple, teal, coral
export function DashboardIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Bars */}
      <rect x="14" y="36" width="8" height="16" rx="2" fill="#714B67" />
      <rect x="26" y="26" width="8" height="26" rx="2" fill="#017E84" />
      <rect x="38" y="16" width="8" height="36" rx="2" fill="#F59E0B" />
      {/* Upward Trend Line */}
      <path d="M18 32L30 22L42 12L50 18" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* =========================================================================
   THE 4 HAND-DRAWN DOODLE ICONS (from user reference media_1788604168111.png)
   Bold black outline line-art with playful offset duotone color backdrops
   ========================================================================= */

// 1. Doodle Target (Pink/coral offset fill + bold black line target & arrow)
export function DoodleTarget({ size = 44, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Offset Pink Fill */}
      <circle cx="23" cy="25" r="14" fill="#FDA4AF" opacity="0.85" />
      {/* Black Line Art Target */}
      <circle cx="22" cy="24" r="14" stroke="#1E293B" strokeWidth="2.8" />
      <circle cx="22" cy="24" r="9" stroke="#1E293B" strokeWidth="2.8" />
      <circle cx="22" cy="24" r="3.5" fill="#1E293B" />
      {/* Arrow hitting bullseye */}
      <path d="M36 10L24 22M36 10L30 11M36 10L35 16" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 2. Doodle Document (Orange offset fill + bold black line document with plus)
export function DoodleDocument({ size = 44, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Offset Warm Yellow/Orange Fill */}
      <rect x="17" y="12" width="20" height="26" rx="4" fill="#FBBF24" opacity="0.85" />
      {/* Black Line Art Document */}
      <path
        d="M15 10C15 8.34315 16.3431 7 18 7H29L35 13V35C35 36.6569 33.6569 38 32 38H18C16.3431 38 15 36.6569 15 35V10Z"
        stroke="#1E293B"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* Plus Sign */}
      <path d="M25 19V29M20 24H30" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

// 3. Doodle Sliders (Cyan offset fill + bold black line equalizer)
export function DoodleSliders({ size = 44, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Offset Cyan Glow */}
      <ellipse cx="28" cy="25" rx="14" ry="10" fill="#67E8F9" opacity="0.8" />
      {/* Sliders Lines & Knobs */}
      <line x1="12" y1="16" x2="36" y2="16" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="30" cy="16" r="3.8" fill="#1E293B" stroke="#1E293B" strokeWidth="1" />

      <line x1="12" y1="24" x2="36" y2="24" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="18" cy="24" r="3.8" fill="#1E293B" stroke="#1E293B" strokeWidth="1" />

      <line x1="12" y1="32" x2="36" y2="32" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="28" cy="32" r="3.8" fill="#1E293B" stroke="#1E293B" strokeWidth="1" />
    </svg>
  );
}

// 4. Doodle Bucket (Emerald/teal offset splash + tilted paint bucket)
export function DoodleBucket({ size = 44, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Offset Teal Splash */}
      <circle cx="28" cy="26" r="13" fill="#6EE7B7" opacity="0.85" />
      {/* Paint Bucket tilted */}
      <g transform="rotate(25 24 24)">
        <path d="M16 16H32L29 34C29 35.5 27.5 37 26 37H22C20.5 37 19 35.5 19 34L16 16Z" stroke="#1E293B" strokeWidth="2.8" strokeLinejoin="round" />
        <path d="M14 16C14 14 17 12 24 12C31 12 34 14 34 16" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
        {/* Paint drop spilling */}
        <circle cx="32" cy="22" r="2.5" fill="#1E293B" />
      </g>
    </svg>
  );
}

/* =========================================================================
   MAP FROM APP ID TO MULTI-COLOR VECTOR ICON COMPONENT
   ========================================================================= */
export const ODOO_APP_ICONS = {
  accounting: AccountingIcon,
  knowledge: KnowledgeIcon,
  sign: SignIcon,
  crm: CrmIcon,
  studio: StudioIcon,
  subscriptions: SubscriptionsIcon,
  ai: AiIcon,
  pos: PosIcon,
  discuss: DiscussIcon,
  documents: DocumentsIcon,
  projects: ProjectsIcon,
  timesheets: TimesheetsIcon,
  fieldservice: FieldServiceIcon,
  planning: PlanningIcon,
  helpdesk: HelpdeskIcon,
  ecommerce: EcommerceIcon,
  website: WebsiteIcon,
  marketing: MarketingIcon,
  inventory: InventoryIcon,
  sales: SalesIcon,
  purchase: PurchaseIcon,
  mrp: MrpIcon,
  hr: HrIcon,
  contacts: ContactsIcon,
  calendar: CalendarIcon,
  spatial: SpatialIcon,
  dashboard: DashboardIcon,
};

export function getOdooAppIcon(appId) {
  return ODOO_APP_ICONS[appId] || AccountingIcon;
}
