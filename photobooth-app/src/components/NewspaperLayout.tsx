import type { Background } from '../types';
import Camera from './Camera';
import styles from './NewspaperLayout.module.css';

// ── Types ─────────────────────────────────────────────────────────────────────

interface SlotProps {
  index: number;
  capturedPhotos: string[];
  background: Background;
  isCapturing: boolean;
  countdown: number | null;
  onCapture: (img: string) => void;
  className?: string;
}

// ── Date helpers ──────────────────────────────────────────────────────────────

const today   = new Date();
const DATE_STR = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
const VOL      = Math.floor((today.getTime() - new Date('1900-01-01').getTime()) / 86400000);
const ISSUE    = (today.getMonth() + 1) * 31 + today.getDate();
const YEAR     = today.getFullYear();

// ── Real-world inspired news content ─────────────────────────────────────────
// Content is paraphrased and inspired by real 2025 world events.

const NEWS = {
  mainHeadline: 'WORLD LEADERS GATHER\nAS GLOBAL TENSIONS RISE',
  mainDeck:     'Summit in Geneva draws record attendance amid calls for diplomatic resolution',

  col1Head: 'AI RESHAPES GLOBAL ECONOMY',
  col1Body:
    'Artificial intelligence and automation continued to transform labour markets across Europe and Asia this year, with economists warning of widening inequality. The World Economic Forum reported that over 40 percent of current jobs may be disrupted within a decade, urging governments to accelerate retraining programmes. Several nations have pledged billions toward digital infrastructure.',

  col2Head: 'SCIENTISTS DETECT NEW SIGNALS FROM DEEP SPACE',
  col2Body:
    'Astronomers at the Vera C. Rubin Observatory announced the detection of unusual radio bursts originating from a galaxy cluster 3.2 billion light-years away. The discovery, described as a watershed moment for astrophysics, may shed light on the formation of early cosmic structures. International teams are now coordinating follow-up observations.',

  col3Head: 'EUROPE FACES ENERGY CROSSROADS',
  col3Body:
    'Rising electricity demand driven by data centres and electric vehicles has strained power grids across the continent. The WTO cautioned that high energy costs could slow the AI boom and dampen trade growth. Several EU member states are fast-tracking approvals for offshore wind and nuclear expansion projects.',

  col4Head: 'PACIFIC TRADE PACT ADVANCES',
  col4Body:
    'Negotiators from twelve Pacific-rim nations reached a preliminary agreement on tariff reductions covering semiconductors, pharmaceuticals and agricultural goods. The deal, if ratified, would represent the largest multilateral trade framework since 2016. Critics argue that labour and environmental standards remain insufficiently protected.',

  sideHead:  'BREAKING',
  side1:     'Nobel Prize in Economics awarded for work on innovation-driven growth — Northwestern, Collège de France & Brown University share honour.',
  side2:     'UAE and China sign landmark investment pact worth an estimated $14 billion across infrastructure and clean energy sectors.',
  side3:     'Sudan conflict enters fourth year with over 13 million displaced; UN Security Council calls emergency session.',
  side4:     'Kim Jong Un condemns joint US-South Korea military drills, calling them a "clear will to ignite war" on the peninsula.',

  ticker:    'WORLD SUMMIT OPENS IN GENEVA  ·  AI INVESTMENT HITS RECORD $1.2 TRILLION  ·  PACIFIC TRADE DEAL ADVANCES  ·  SPACE OBSERVATORY DETECTS DEEP-FIELD SIGNALS  ·  ENERGY CRISIS GRIPS EUROPE',

  adLeft:    { title: 'STERLING & SONS', sub: 'Fine Portrait Photography · Est. 1887 · By Appointment Only' },
  adRight:   { title: 'THE GRAND HOTEL', sub: 'Luxury Accommodations · Cable Address: GRANDHOTEL · Telephone 4400' },
};

// ── Masthead ──────────────────────────────────────────────────────────────────

function Masthead() {
  return (
    <div className={styles.masthead}>
      {/* Very top bar */}
      <div className={styles.mastheadTopBar}>
        <span>VOL. {VOL} &nbsp;·&nbsp; NO. {ISSUE}</span>
        <span className={styles.mastheadSpecial}>✦ SPECIAL EDITION ✦</span>
        <span>{DATE_STR}</span>
      </div>

      {/* Thin rule */}
      <div className={styles.ruleDouble} />

      {/* Newspaper name */}
      <div className={styles.mastheadTitle}>The Daily Photobooth</div>

      {/* Tagline row */}
      <div className={styles.mastheadTagline}>
        <span className={styles.taglineRule} />
        <span className={styles.taglineText}>"One Page, Full of Memories"</span>
        <span className={styles.taglineRule} />
      </div>

      {/* Info bar */}
      <div className={styles.mastheadInfoBar}>
        <span>ESTABLISHED {YEAR - 126}</span>
        <span>✦</span>
        <span>LATE CITY FINAL EDITION</span>
        <span>✦</span>
        <span>PRICE: ONE CENT</span>
      </div>

      {/* Thick rule */}
      <div className={styles.ruleThick} />
    </div>
  );
}

// ── Photo slot ────────────────────────────────────────────────────────────────

function PhotoSlot({ index, capturedPhotos, background, isCapturing, countdown, onCapture, className }: SlotProps) {
  const captured = capturedPhotos[index];
  const isLive   = index === capturedPhotos.length;

  if (captured) {
    return (
      <div className={`${styles.photoSlot} ${className ?? ''}`}>
        {background.id !== 'none' && (
          <div className={styles.bgOverlay} style={background.style} aria-hidden="true" />
        )}
        <img src={captured} alt={`Photo ${index + 1}`} className={styles.photo} />
        <div className={styles.photoCaption}>
          {index === 0 ? 'Delegates arrive at the Geneva Convention Centre for the opening session.' : `Scene ${index + 1} — Special correspondent photograph.`}
        </div>
      </div>
    );
  }

  if (isLive) {
    return (
      <div className={`${styles.photoSlot} ${styles.photoSlotLive} ${className ?? ''}`}>
        <Camera
          selectedBackground={background}
          isCapturing={isCapturing}
          countdown={countdown}
          onCapture={onCapture}
        />
        <div className={styles.photoCaption}>Photograph by our special correspondent.</div>
      </div>
    );
  }

  return (
    <div className={`${styles.photoSlot} ${styles.photoSlotEmpty} ${className ?? ''}`}>
      <span className={styles.emptyLabel}>PHOTO {index + 1}</span>
    </div>
  );
}

// ── Text building blocks ──────────────────────────────────────────────────────

function ColHeadline({ text }: { text: string }) {
  return <div className={styles.colHeadline}>{text}</div>;
}

function ColRule() {
  return <div className={styles.colRule} />;
}

function Article({ headline, body, dropCap = true }: { headline: string; body: string; dropCap?: boolean }) {
  return (
    <div className={styles.article}>
      <ColHeadline text={headline} />
      <ColRule />
      <p className={dropCap ? styles.bodyDropCap : styles.body}>{body}</p>
    </div>
  );
}

function BreakingBox() {
  return (
    <div className={styles.breakingBox}>
      <div className={styles.breakingTitle}>{NEWS.sideHead}</div>
      <div className={styles.breakingRule} />
      {[NEWS.side1, NEWS.side2, NEWS.side3, NEWS.side4].map((item, i) => (
        <div key={i} className={styles.breakingItem}>
          <span className={styles.breakingBullet}>▶</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function Ticker() {
  return (
    <>
      <div className={styles.ruleThick} />
      <div className={styles.ticker}>{NEWS.ticker}</div>
      <div className={styles.ruleThick} />
    </>
  );
}

function ColDivider() {
  return <div className={styles.colDivider} />;
}

// ── Layout 1: single hero ─────────────────────────────────────────────────────

function Layout1({ slotProps }: { slotProps: SlotProps }) {
  return (
    <div className={styles.body1}>
      {/* Main headline */}
      <div className={styles.mainHeadline}>{NEWS.mainHeadline}</div>
      <div className={styles.mainDeck}>{NEWS.mainDeck}</div>
      <div className={styles.ruleThick} />

      {/* Two-column: sidebar + hero photo */}
      <div className={styles.row}>
        {/* Left sidebar */}
        <div className={styles.sidebarCol}>
          <Article headline={NEWS.col1Head} body={NEWS.col1Body} />
          <BreakingBox />
        </div>

        <ColDivider />

        {/* Hero photo + article */}
        <div className={styles.mainCol}>
          <PhotoSlot {...slotProps} index={0} className={styles.photoHero} />
          <Article headline={NEWS.col2Head} body={NEWS.col2Body} dropCap={false} />
        </div>
      </div>
    </div>
  );
}

// ── Layout 2: hero + 1 bottom ─────────────────────────────────────────────────

function Layout2({ slotProps }: { slotProps: SlotProps }) {
  return (
    <div className={styles.body2}>
      {/* Main headline */}
      <div className={styles.mainHeadline}>{NEWS.mainHeadline}</div>
      <div className={styles.mainDeck}>{NEWS.mainDeck}</div>
      <div className={styles.ruleThick} />

      {/* Top row */}
      <div className={styles.row}>
        <div className={styles.sidebarCol}>
          <Article headline={NEWS.col1Head} body={NEWS.col1Body} />
          <BreakingBox />
        </div>
        <ColDivider />
        <div className={styles.mainCol}>
          <PhotoSlot {...slotProps} index={0} className={styles.photoHero} />
          <Article headline={NEWS.col2Head} body={NEWS.col2Body} dropCap={false} />
        </div>
      </div>

      <Ticker />

      {/* Bottom row */}
      <div className={styles.row}>
        <div className={styles.halfCol}>
          <PhotoSlot {...slotProps} index={1} className={styles.photoMid} />
        </div>
        <ColDivider />
        <div className={styles.halfCol}>
          <Article headline={NEWS.col3Head} body={NEWS.col3Body} />
        </div>
      </div>
    </div>
  );
}

// ── Layout 3: hero + 2 bottom ─────────────────────────────────────────────────

function Layout3({ slotProps }: { slotProps: SlotProps }) {
  return (
    <div className={styles.body3}>
      <div className={styles.mainHeadline}>{NEWS.mainHeadline}</div>
      <div className={styles.mainDeck}>{NEWS.mainDeck}</div>
      <div className={styles.ruleThick} />

      <div className={styles.row}>
        <div className={styles.sidebarCol}>
          <Article headline={NEWS.col1Head} body={NEWS.col1Body} />
          <BreakingBox />
        </div>
        <ColDivider />
        <div className={styles.mainCol}>
          <PhotoSlot {...slotProps} index={0} className={styles.photoHero} />
          <Article headline={NEWS.col2Head} body={NEWS.col2Body} dropCap={false} />
        </div>
      </div>

      <Ticker />

      <div className={styles.row}>
        <div className={styles.thirdCol}>
          <PhotoSlot {...slotProps} index={1} className={styles.photoSmall} />
        </div>
        <ColDivider />
        <div className={styles.thirdCol}>
          <Article headline={NEWS.col3Head} body={NEWS.col3Body} />
        </div>
        <ColDivider />
        <div className={styles.thirdCol}>
          <PhotoSlot {...slotProps} index={2} className={styles.photoSmall} />
        </div>
      </div>
    </div>
  );
}

// ── Layout 4: hero + 3 bottom ─────────────────────────────────────────────────

function Layout4({ slotProps }: { slotProps: SlotProps }) {
  return (
    <div className={styles.body4}>
      <div className={styles.mainHeadline}>{NEWS.mainHeadline}</div>
      <div className={styles.mainDeck}>{NEWS.mainDeck}</div>
      <div className={styles.ruleThick} />

      <div className={styles.row}>
        <div className={styles.sidebarCol}>
          <Article headline={NEWS.col1Head} body={NEWS.col1Body} />
          <BreakingBox />
        </div>
        <ColDivider />
        <div className={styles.mainCol}>
          <PhotoSlot {...slotProps} index={0} className={styles.photoHero} />
          <Article headline={NEWS.col2Head} body={NEWS.col2Body} dropCap={false} />
        </div>
      </div>

      <Ticker />

      <div className={styles.row}>
        <div className={styles.quarterCol}>
          <PhotoSlot {...slotProps} index={1} className={styles.photoSmall} />
        </div>
        <ColDivider />
        <div className={styles.quarterCol}>
          <Article headline={NEWS.col3Head} body={NEWS.col3Body} />
        </div>
        <ColDivider />
        <div className={styles.quarterCol}>
          <PhotoSlot {...slotProps} index={2} className={styles.photoSmall} />
        </div>
        <ColDivider />
        <div className={styles.quarterCol}>
          <PhotoSlot {...slotProps} index={3} className={styles.photoSmall} />
        </div>
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function NewspaperFooter() {
  return (
    <div className={styles.footer}>
      <div className={styles.ruleDouble} />
      <div className={styles.footerRow}>
        {/* Ad left */}
        <div className={styles.footerAd}>
          <div className={styles.footerAdTitle}>{NEWS.adLeft.title}</div>
          <div className={styles.footerAdSub}>{NEWS.adLeft.sub}</div>
        </div>

        <div className={styles.footerOrnament}>❧</div>

        {/* Centre copyright */}
        <div className={styles.footerCenter}>
          <div className={styles.footerCopyTitle}>THE DAILY PHOTOBOOTH</div>
          <div className={styles.footerCopySub}>© {YEAR} · All Rights Reserved · Printed in the City of New York</div>
        </div>

        <div className={styles.footerOrnament}>❧</div>

        {/* Ad right */}
        <div className={styles.footerAd}>
          <div className={styles.footerAdTitle}>{NEWS.adRight.title}</div>
          <div className={styles.footerAdSub}>{NEWS.adRight.sub}</div>
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

interface NewspaperLayoutProps {
  photoCount: number;
  capturedPhotos: string[];
  background: Background;
  isCapturing: boolean;
  countdown: number | null;
  onCapture: (img: string) => void;
}

export default function NewspaperLayout({
  photoCount,
  capturedPhotos,
  background,
  isCapturing,
  countdown,
  onCapture,
}: NewspaperLayoutProps) {
  const slotProps: SlotProps = {
    index: 0,
    capturedPhotos,
    background,
    isCapturing,
    countdown,
    onCapture,
  };

  return (
    <div className={styles.newspaper}>
      <Masthead />
      {photoCount === 1 && <Layout1 slotProps={slotProps} />}
      {photoCount === 2 && <Layout2 slotProps={slotProps} />}
      {photoCount === 3 && <Layout3 slotProps={slotProps} />}
      {photoCount >= 4 && <Layout4 slotProps={slotProps} />}
      <NewspaperFooter />
    </div>
  );
}
