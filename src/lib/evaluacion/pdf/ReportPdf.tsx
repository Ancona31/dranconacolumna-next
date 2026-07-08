import {
  Document,
  Page,
  View,
  Text,
  Image,
  Link,
  Svg,
  Path,
  Line,
  Circle,
  Ellipse,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { DomainId, EvaluationResult } from "@/lib/evaluacion/types";
import {
  buildAlertBanner,
  computeDomains,
  type DomainResult,
  EVALUATION_SIGNATURE,
  FUNC_ALL_GREEN_LINE,
  FUNC_COLORS,
  FUNC_STATE_LABELS,
  type FuncState,
  getEvaluationPlan,
  getRecommendationText,
  getQrWhatsAppLink,
  getWarningSigns,
  nivelDefinitions,
  NIVEL_BADGE_COLORS,
  WARNING_CLOSING,
} from "@/lib/evaluacion/engine";
import { BODY_PATH, BODY_ZONES } from "@/components/home/BodyFigureSVG";
import {
  DOCTOR_FULL_NAME,
  CEDULA_PROFESIONAL,
  CEDULA_ESPECIALIDAD,
} from "@/lib/config";
import QRCode from "qrcode";
import QrSvg from "@/lib/evaluacion/pdf/QrSvg";

// Presupuesto de densidad: si el QR del mensaje completo supera la versión 5
// (37x37 módulos), se recorta a la forma corta. QrSvg usa ECC 'L'.
const QR_MAX_VERSION = 5;

// TODO: si se agregan /public/fonts/*.ttf, registrar aquí Plus Jakarta Sans
// (bold, títulos) e Inter (regular/semibold) con Font.register. Por ahora se
// usan las fuentes estándar Helvetica / Helvetica-Bold del visor de PDF.

// Evita el guionado de palabras (p. ej. "dranconacolumna.com" nunca se parte).
Font.registerHyphenationCallback((word) => [word]);

const C = {
  primary: "#0B3C5D",
  primarySoft: "#E8F1F8",
  accent: "#1B6CA8",
  bg: "#FBFBF9",
  ink: "#16232E",
  success: "#2E7D5B",
  warning: "#C77D1F",
  danger: "#C0453A",
  whatsapp: "#25D366",
  line: "#D8DEE4",
  amberBg: "#F7ECD9",
  coralBg: "#F7E4E2",
  muted: "#6B7A88",
};

const PHONE_DISPLAY = "999 636 4504";
const CERT = "Certificado CMOT 26/5567/25";

// Estilo del QR en UN solo lugar: placa blanca con puntos azul tinta
// (contraste correcto y detectable).
const QR_STYLE = { fg: "#0B3C5D", bgPlate: true };

const LEVELS = {
  leve: { label: "Limitación leve", color: C.success },
  moderada: { label: "Limitación moderada", color: C.warning },
  severa: { label: "Limitación severa", color: C.danger },
};

const styles = StyleSheet.create({
  page: {
    // paddingTop = 86 del membrete fijo + 18 de aire; se aplica en todas las páginas.
    paddingTop: 104,
    paddingHorizontal: 0,
    paddingBottom: 64,
    backgroundColor: C.bg,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.ink,
    lineHeight: 1.35,
  },
  // Membrete universal: mismo header fijo con altura explícita en TODAS las páginas.
  headerBand: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 86,
    backgroundColor: C.primary,
    paddingHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logoPlate: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  logo: { width: 30, height: 30 },
  docName: { fontFamily: "Helvetica-Bold", fontSize: 11.5, color: C.bg },
  docSub: { fontSize: 8, color: C.bg, opacity: 0.85, marginTop: 1 },
  headerRight: { textAlign: "right", fontSize: 7.5, color: C.bg, opacity: 0.85 },
  body: { paddingHorizontal: 40 },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: C.primary,
    marginTop: 14,
  },
  meta: { fontSize: 8.5, color: "#5b6772", marginTop: 2 },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: C.primary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  section: { marginTop: 8 },
  alertBox: { borderLeftWidth: 3, padding: 8, marginTop: 8, borderRadius: 3 },
  levelPill: {
    alignSelf: "flex-start",
    color: "#fff",
    borderRadius: 9,
    paddingVertical: 2.5,
    paddingHorizontal: 9,
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    lineHeight: 1.2,
  },
  recBox: {
    borderLeftWidth: 3,
    backgroundColor: C.primarySoft,
    padding: 8,
    marginTop: 8,
    borderRadius: 3,
  },
  nivelBadge: {
    borderWidth: 1,
    padding: 6,
    marginTop: 8,
    borderRadius: 4,
  },
  capCard: {
    borderWidth: 1,
    borderLeftWidth: 3,
    borderRadius: 4,
    padding: 8,
    marginBottom: 5,
  },
  capTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  capState: { flexDirection: "row", alignItems: "center", gap: 3 },
  signature: { fontSize: 8.5, fontStyle: "italic", color: C.muted, marginTop: 4 },
  ctaBox: {
    backgroundColor: C.primary,
    borderRadius: 8,
    padding: 11,
    marginTop: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greenPill: {
    alignSelf: "flex-start",
    backgroundColor: C.whatsapp,
    color: "#fff",
    borderRadius: 9,
    paddingVertical: 2.5,
    paddingHorizontal: 9,
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    marginTop: 5,
  },
  legal: {
    fontSize: 7,
    color: "#7a828b",
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: C.line,
    paddingTop: 6,
    lineHeight: 1.35,
  },
  footerBand: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 26,
    backgroundColor: C.primary,
    paddingHorizontal: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerText: { color: C.bg, fontSize: 8 },
  footerPage: {
    position: "absolute",
    bottom: 9,
    right: 40,
    color: C.bg,
    fontSize: 8,
    textAlign: "right",
  },
});

function polar(score: number) {
  const angle = (180 - (score / 100) * 180) * (Math.PI / 180);
  return { x: 90 + 72 * Math.cos(angle), y: 90 - 72 * Math.sin(angle) };
}
function arc(a: number, b: number) {
  const p1 = polar(a);
  const p2 = polar(b);
  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A 72 72 0 0 1 ${p2.x.toFixed(
    2
  )} ${p2.y.toFixed(2)}`;
}

function PdfGauge({ score }: { score: number }) {
  const deg = (score / 100) * 180 - 90;
  const rad = (deg * Math.PI) / 180;
  const tipX = 90 + 60 * Math.sin(rad);
  const tipY = 90 - 60 * Math.cos(rad);
  return (
    <Svg width={150} height={88} viewBox="0 0 180 105">
      <Path d={arc(0, 30)} stroke={C.success} strokeWidth={11} fill="none" />
      <Path d={arc(30, 60)} stroke={C.warning} strokeWidth={11} fill="none" />
      <Path d={arc(60, 100)} stroke={C.danger} strokeWidth={11} fill="none" />
      <Line x1="90" y1="90" x2={tipX} y2={tipY} stroke={C.ink} strokeWidth={2.5} />
      <Circle cx="90" cy="90" r="5" fill={C.ink} />
    </Svg>
  );
}

// Membrete universal: mismo header fijo (altura explícita 86) en TODAS las
// páginas. Sin render condicional — se imprime idéntico en p1, p2, pN.
function HeaderBand() {
  return (
    <View style={styles.headerBand} fixed>
      <View style={styles.headerLeft}>
        <View style={styles.logoPlate}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image style={styles.logo} src="/logo.png" />
        </View>
        <View>
          <Text style={styles.docName}>{DOCTOR_FULL_NAME}</Text>
          <Text style={styles.docSub}>
            Ortopedia · Traumatología · Cirugía de Columna
          </Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <Text>
          Céd. Prof. {CEDULA_PROFESIONAL} · Céd. Esp. {CEDULA_ESPECIALIDAD}
        </Text>
        <Text>{CERT}</Text>
      </View>
    </View>
  );
}

function FooterBand() {
  return (
    <>
      <View style={styles.footerBand} fixed>
        <Text style={styles.footerText}>
          dranconacolumna.com  ·  WhatsApp {PHONE_DISPLAY}  ·  Mérida y Umán
        </Text>
      </View>
      {/* Único condicional por página permitido: render en un Text fijo. */}
      <Text
        fixed
        style={styles.footerPage}
        render={({ pageNumber, totalPages }) =>
          `Página ${pageNumber} de ${totalPages}`
        }
      />
    </>
  );
}

function Legal({ citation }: { citation: string }) {
  return (
    <View style={styles.legal} wrap={false}>
      <Text>{citation}</Text>
      <Text style={{ marginTop: 3 }}>
        Este reporte no constituye un diagnóstico ni sustituye una consulta
        médica. Generado en tu dispositivo: tus respuestas no se almacenan en
        ningún servidor. dranconacolumna.com
      </Text>
    </View>
  );
}

function CtaBlock({ waLink, urgent }: { waLink: string; urgent: boolean }) {
  return (
    <View style={styles.ctaBox} wrap={false}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text
          style={{ color: "#fff", fontFamily: "Helvetica-Bold", fontSize: 10.5 }}
        >
          {urgent
            ? "Avísanos de tu caso por WhatsApp"
            : "Escríbenos por WhatsApp para agendar tu valoración"}
        </Text>
        <Link src={waLink} style={styles.greenPill}>
          {PHONE_DISPLAY}
        </Link>
        {urgent ? (
          <Text style={{ color: "#D5E3EF", fontSize: 8.5, marginTop: 7 }}>
            Y lleva este reporte a tu valoración de hoy — le servirá al médico
            que te atienda.
          </Text>
        ) : (
          <>
            <Text style={{ color: "#D5E3EF", fontSize: 8.5, marginTop: 7 }}>
              Consulta en Mérida y Umán
            </Text>
            <Text
              style={{
                color: "#D5E3EF",
                fontSize: 8.5,
                marginTop: 3,
                fontStyle: "italic",
              }}
            >
              Presenta este reporte en tu cita — me permite conocer tu caso antes
              de explorarte.
            </Text>
          </>
        )}
      </View>
      <View style={{ alignItems: "center" }}>
        <Link src={waLink}>
          <QrSvg
            value={waLink}
            size={112}
            fg={QR_STYLE.fg}
            bgPlate={QR_STYLE.bgPlate}
          />
        </Link>
        <Text
          style={{
            color: "#FBFBF9",
            opacity: 0.8,
            fontSize: 6.5,
            marginTop: 3,
            textAlign: "center",
          }}
        >
          Escanéalo o tócalo
        </Text>
      </View>
    </View>
  );
}

function AlertBlock({ result }: { result: EvaluationResult }) {
  const banner = buildAlertBanner(result);
  if (!banner) return null;
  const tone =
    banner.tone === "urgente"
      ? { bg: C.coralBg, color: C.danger }
      : { bg: C.amberBg, color: C.warning };
  return (
    <View
      style={[styles.alertBox, { backgroundColor: tone.bg, borderLeftColor: tone.color }]}
      wrap={false}
    >
      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 11, color: tone.color }}>
        {banner.title}
      </Text>
      <Text style={{ marginTop: 4 }}>{banner.body}</Text>
      {banner.tone === "urgente" ? (
        <Text style={{ marginTop: 5, fontFamily: "Helvetica-Bold" }}>
          Muestra este reporte al médico que te atienda.
        </Text>
      ) : null}
    </View>
  );
}

// Mini-silueta de marca: silueta accent 12% con la zona evaluada marcada en el
// color intenso del nivel. Path reflejado de BodyFigureSVG (ese archivo no se toca).
function PdfMiniSilhouette({ result }: { result: EvaluationResult }) {
  const pt = BODY_ZONES.find((z) => z.id === result.test.zoneId);
  const strong = NIVEL_BADGE_COLORS[result.level].strong;
  const scale = 56 / 540;
  return (
    <Svg width={220 * scale} height={56} viewBox="0 0 220 540">
      <Path d={BODY_PATH} fill={C.accent} fillOpacity={0.12} />
      {pt ? (
        <>
          <Circle cx={pt.cx} cy={pt.cy} r={18} fill={strong} fillOpacity={0.2} />
          <Circle cx={pt.cx} cy={pt.cy} r={9} fill={strong} />
        </>
      ) : null}
    </Svg>
  );
}

// Glifo de estado con primitivos SVG (legible incluso impreso en B/N).
function PdfStatusGlyph({ state, color }: { state: FuncState; color: string }) {
  return (
    <Svg width={13} height={13} viewBox="0 0 14 14">
      <Circle cx={7} cy={7} r={7} fill={color} />
      {state === "verde" ? (
        <Path
          d="M 3.5 7.2 L 6 9.6 L 10.5 4.4"
          stroke="#fff"
          strokeWidth={1.6}
          fill="none"
        />
      ) : null}
      {state === "amarillo" ? <Circle cx={7} cy={7} r={1.7} fill="#fff" /> : null}
      {state === "naranja" ? (
        <>
          <Circle cx={4.9} cy={7} r={1.5} fill="#fff" />
          <Circle cx={9.1} cy={7} r={1.5} fill="#fff" />
        </>
      ) : null}
      {state === "rojo" ? (
        <>
          <Line x1={7} y1={3.2} x2={7} y2={8} stroke="#fff" strokeWidth={1.7} />
          <Circle cx={7} cy={10.2} r={1} fill="#fff" />
        </>
      ) : null}
    </Svg>
  );
}

// Icono de dominio con primitivos SVG (equivalente a los lucide de pantalla:
// Footprints básicas · Activity moderadas · Dumbbell demandantes).
function PdfDomainIcon({ id, color }: { id: DomainId; color: string }) {
  const p = { stroke: color, strokeWidth: 1.3, fill: "none" as const };
  return (
    <Svg width={13} height={13} viewBox="0 0 16 16">
      {id === "moderadas" ? (
        <Path
          d="M1 8 H4.5 L6.5 3 L9.5 13 L11.5 8 H15"
          {...p}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ) : null}
      {id === "demandantes" ? (
        <>
          <Line x1={3} y1={5} x2={3} y2={11} {...p} strokeLinecap="round" />
          <Line x1={5} y1={6} x2={5} y2={10} {...p} strokeLinecap="round" />
          <Line x1={5} y1={8} x2={11} y2={8} {...p} />
          <Line x1={11} y1={6} x2={11} y2={10} {...p} strokeLinecap="round" />
          <Line x1={13} y1={5} x2={13} y2={11} {...p} strokeLinecap="round" />
        </>
      ) : null}
      {id === "basicas" ? (
        <>
          <Ellipse cx={5.5} cy={6} rx={2.3} ry={3.2} {...p} />
          <Ellipse cx={10.5} cy={10} rx={2.3} ry={3.2} {...p} />
        </>
      ) : null}
    </Svg>
  );
}

// Tarjeta del semáforo (misma versión completa que la pantalla): fila superior
// (icono + label + indicador y etiqueta de estado) + ejemplos gris cursiva +
// frase completa de la matriz con sus mirrors.
function CapacityCardPdf({ domain }: { domain: DomainResult }) {
  const { bg, strong } = FUNC_COLORS[domain.state];
  return (
    <View
      style={[styles.capCard, { backgroundColor: bg, borderColor: strong }]}
      wrap={false}
    >
      <View style={styles.capTop}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <PdfDomainIcon id={domain.id} color={strong} />
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, color: C.ink }}>
            {domain.label}
          </Text>
        </View>
        <View style={styles.capState}>
          <PdfStatusGlyph state={domain.state} color={strong} />
          <Text
            style={{ fontFamily: "Helvetica-Bold", fontSize: 8, color: strong }}
          >
            {FUNC_STATE_LABELS[domain.state]}
          </Text>
        </View>
      </View>
      <Text
        style={{ fontSize: 7.5, fontStyle: "italic", color: C.muted, marginTop: 3 }}
      >
        {domain.examples}
      </Text>
      <Text style={{ fontSize: 8.5, color: C.ink, marginTop: 2 }}>
        {domain.fullPhrase}
      </Text>
    </View>
  );
}

// Sección de bullets genérica (viñeta + texto).
function BulletList({ items, color }: { items: string[]; color: string }) {
  return (
    <>
      {items.map((item) => (
        <View key={item} style={{ flexDirection: "row", marginBottom: 2 }}>
          <Text style={{ fontSize: 8.5, marginRight: 4, color }}>•</Text>
          <Text style={{ fontSize: 8.5, flex: 1 }}>{item}</Text>
        </View>
      ))}
    </>
  );
}

export default function ReportPdf({
  result,
  name,
}: {
  result: EvaluationResult;
  name?: string;
  /** Aceptado por compatibilidad con quien invoca; el QR ahora es vectorial. */
  qrDataUrl?: string;
}) {
  const level = LEVELS[result.level];
  // Fuente única del enlace para QR y ambos <Link>; recorta por densidad.
  const fullLink = getQrWhatsAppLink(result);
  const fullVersion = QRCode.create(fullLink, {
    errorCorrectionLevel: "L",
  }).version;
  const qrValue =
    fullVersion > QR_MAX_VERSION
      ? getQrWhatsAppLink(result, { short: true })
      : fullLink;
  const fecha = result.createdAt.toLocaleString("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const domains = computeDomains(result.test, result.answers);
  const allGreen =
    domains.length > 0 && domains.every((d) => d.state === "verde");
  const evaluationPlan = getEvaluationPlan(result);
  const warningSigns = getWarningSigns(result);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <HeaderBand />
        <FooterBand />

        <View style={styles.body}>
          {/* Header-título + mini-silueta de marca (bloque completo) */}
          <View
            wrap={false}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.title}>
                REPORTE DE EVALUACIÓN — {result.zoneLabel.toUpperCase()}
              </Text>
              <Text style={styles.meta}>
                {fecha} · Folio {result.folio}
              </Text>
              {name ? <Text style={styles.meta}>Reporte de: {name}</Text> : null}
            </View>
            <View style={{ marginTop: 10 }}>
              <PdfMiniSilhouette result={result} />
            </View>
          </View>

          {/* Banner de alerta condicional (entre título y resultado) */}
          <AlertBlock result={result} />

          {/* Bloque de resultado */}
          <View style={{ marginTop: 9 }} wrap={false}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
              <View style={{ width: 150 }}>
                <PdfGauge score={result.score} />
              </View>
              <View style={{ flexDirection: "column", flexGrow: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontFamily: "Helvetica-Bold",
                      fontSize: 34,
                      lineHeight: 1,
                      color: C.primary,
                    }}
                  >
                    {result.score}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      lineHeight: 1,
                      marginBottom: 3,
                      marginLeft: 2,
                      color: C.muted,
                    }}
                  >
                    /100
                  </Text>
                </View>
                <Text style={{ fontSize: 9, lineHeight: 1.2, marginTop: 2, color: "#5b6772" }}>
                  índice de limitación
                </Text>
                <Text style={{ fontSize: 7.5, lineHeight: 1.2, color: C.muted, marginTop: 2 }}>
                  0–30 leve · 31–60 moderada · 61–100 severa
                </Text>
                <View style={{ marginTop: 6 }}>
                  <Text style={[styles.levelPill, { backgroundColor: level.color }]}>
                    {level.label}
                  </Text>
                </View>
              </View>
            </View>

            {/* Definición del nivel (badge según el nivel funcional del score) */}
            <View
              style={[
                styles.nivelBadge,
                {
                  backgroundColor: NIVEL_BADGE_COLORS[result.level].bg,
                  borderColor: NIVEL_BADGE_COLORS[result.level].strong,
                },
              ]}
              wrap={false}
            >
              <Text
                style={{
                  fontFamily: "Helvetica-Bold",
                  fontSize: 8.5,
                  color: NIVEL_BADGE_COLORS[result.level].strong,
                }}
              >
                ¿Qué significa limitación {result.level}?
              </Text>
              <Text style={{ fontSize: 8.5, color: C.ink, marginTop: 2 }}>
                {nivelDefinitions[result.level]}
              </Text>
            </View>

            <View style={[styles.recBox, { borderLeftColor: level.color }]}>
              <Text>{getRecommendationText(result.level, result.alertLevel)}</Text>
            </View>
          </View>

          {/* Tu capacidad hoy (variante compacta) */}
          {domains.length > 0 ? (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>
                TU CAPACIDAD HOY, SEGÚN TUS RESPUESTAS
              </Text>
              {domains.map((domain) => (
                <CapacityCardPdf key={domain.id} domain={domain} />
              ))}
              {allGreen ? (
                <Text style={{ fontSize: 8, color: C.muted, marginTop: 1 }}>
                  {FUNC_ALL_GREEN_LINE}
                </Text>
              ) : null}
            </View>
          ) : null}

          {/* Qué significa */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>QUÉ SIGNIFICA TU RESULTADO</Text>
            {result.test.reportTexts[result.level].map((p, i) => (
              <Text key={i} style={{ marginBottom: 3 }}>
                {p}
              </Text>
            ))}
          </View>

          {/* Qué debe evaluarse en tu caso */}
          {evaluationPlan.length > 0 ? (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>
                QUÉ DEBE EVALUARSE EN TU CASO
              </Text>
              <BulletList items={evaluationPlan} color={C.accent} />
              <Text style={styles.signature}>{EVALUATION_SIGNATURE}</Text>
            </View>
          ) : null}

          {/* Señales para no esperar tu cita */}
          {warningSigns.length > 0 ? (
            <View style={styles.section} wrap={false}>
              <Text style={[styles.sectionTitle, { color: C.danger }]}>
                SEÑALES PARA NO ESPERAR TU CITA
              </Text>
              <BulletList items={warningSigns} color={C.danger} />
              <Text
                style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", marginTop: 4 }}
              >
                {WARNING_CLOSING}
              </Text>
            </View>
          ) : null}

          {/* CTA + pie legal agrupados: anti-huérfano. Viajan juntos a la
              página siguiente si no caben; el CTA nunca queda solo. */}
          <View wrap={false}>
            <CtaBlock
              waLink={qrValue}
              urgent={result.alertLevel === "urgente"}
            />
            <Legal citation={result.test.instrumentCitation} />
          </View>
        </View>
      </Page>
    </Document>
  );
}
