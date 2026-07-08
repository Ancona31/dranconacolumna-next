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
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { EvaluationResult } from "@/lib/evaluacion/types";
import {
  buildAlertBanner,
  getRecommendationText,
  getQrWhatsAppLink,
} from "@/lib/evaluacion/engine";
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
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 64,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.ink,
    lineHeight: 1.35,
  },
  headerBand: {
    backgroundColor: C.primary,
    paddingVertical: 14,
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
    marginTop: 18,
  },
  meta: { fontSize: 8.5, color: "#5b6772", marginTop: 2 },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: C.primary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  section: { marginTop: 11 },
  alertBox: { borderLeftWidth: 3, padding: 8, marginTop: 11, borderRadius: 3 },
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
    marginTop: 10,
    borderRadius: 3,
  },
  barTrack: {
    height: 5,
    backgroundColor: "#E2E7EC",
    borderRadius: 3,
    marginTop: 2,
  },
  bandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8.5,
  },
  tableRow: {
    flexDirection: "row",
    height: 14,
    alignItems: "center",
    paddingHorizontal: 6,
  },
  tableCellL: { flex: 1, fontSize: 8.5 },
  tableCellR: { fontSize: 8.5, fontFamily: "Helvetica-Bold" },
  ctaBox: {
    backgroundColor: C.primary,
    borderRadius: 8,
    padding: 11,
    marginTop: 12,
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
    marginTop: 12,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: { color: C.bg, fontSize: 8 },
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

function HeaderBand() {
  return (
    <View style={styles.headerBand}>
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
    <View style={styles.footerBand} fixed>
      <Text style={styles.footerText}>
        dranconacolumna.com  ·  WhatsApp {PHONE_DISPLAY}  ·  Mérida y Umán
      </Text>
    </View>
  );
}

function Legal({ citation }: { citation: string }) {
  return (
    <View style={styles.legal}>
      <Text>{citation}</Text>
      <Text style={{ marginTop: 3 }}>
        Este reporte no constituye un diagnóstico ni sustituye una consulta
        médica. Generado en tu dispositivo: tus respuestas no se almacenan en
        ningún servidor. dranconacolumna.com
      </Text>
    </View>
  );
}

function CtaBlock({ waLink }: { waLink: string }) {
  return (
    <View style={styles.ctaBox} wrap={false}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text
          style={{ color: "#fff", fontFamily: "Helvetica-Bold", fontSize: 10.5 }}
        >
          Escríbenos por WhatsApp para agendar tu valoración
        </Text>
        <Link src={waLink} style={styles.greenPill}>
          {PHONE_DISPLAY}
        </Link>
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
          Presenta este reporte en tu cita — me permite conocer tu caso antes de
          explorarte.
        </Text>
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

function bucketMeta(value: number) {
  if (value <= 1) return { label: "Leve", color: C.success };
  if (value === 2) return { label: "Moderado", color: C.warning };
  return { label: "Alto", color: C.danger };
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
  const rows = result.test.questions.map((q) => {
    const value = result.answers[q.id] ?? 0;
    const opt = q.options.find((o) => o.value === value);
    return { shortLabel: q.shortLabel, answer: opt?.label ?? "—" };
  });
  const sorted = [...result.breakdown].sort((a, b) => b.value - a.value);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <HeaderBand />
        <FooterBand />

        <View style={styles.body}>
          <Text style={styles.title}>
            REPORTE DE EVALUACIÓN — {result.zoneLabel.toUpperCase()}
          </Text>
          <Text style={styles.meta}>
            {fecha} · Folio {result.folio}
          </Text>
          {name ? <Text style={styles.meta}>Reporte de: {name}</Text> : null}

          {/* Banner de alerta condicional (entre título y resultado) */}
          <AlertBlock result={result} />

          {/* Bloque de resultado */}
          <View style={{ marginTop: 12 }} wrap={false}>
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

            <View style={[styles.recBox, { borderLeftColor: level.color }]}>
              <Text>{getRecommendationText(result.level, result.alertLevel)}</Text>
            </View>
          </View>

          {/* Áreas más afectadas */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>ÁREAS MÁS AFECTADAS</Text>
            {sorted.map((item) => {
              const b = bucketMeta(item.value);
              return (
                <View key={item.shortLabel} style={{ marginBottom: 4 }}>
                  <View style={styles.bandRow}>
                    <Text>{item.shortLabel}</Text>
                    <Text style={{ color: b.color, fontFamily: "Helvetica-Bold" }}>
                      {b.label}
                    </Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={{
                        height: 5,
                        borderRadius: 3,
                        backgroundColor: b.color,
                        width: `${Math.max((item.value / 4) * 100, 4)}%`,
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          {/* Qué significa */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>QUÉ SIGNIFICA TU RESULTADO</Text>
            {result.test.reportTexts[result.level].map((p, i) => (
              <Text key={i} style={{ marginBottom: 3 }}>
                {p}
              </Text>
            ))}
            {result.alertLevel === "none" ? (
              <Text style={{ marginTop: 6, fontSize: 8.5, color: C.success }}>
                No se identificaron datos de alarma en tus respuestas.
              </Text>
            ) : null}
          </View>

          {/* Tus respuestas (tabla completa, sin corte) */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>TUS RESPUESTAS</Text>
            {rows.map((r, i) => (
              <View
                key={r.shortLabel}
                style={[
                  styles.tableRow,
                  { backgroundColor: i % 2 === 0 ? C.primarySoft : "transparent" },
                ]}
              >
                <Text style={styles.tableCellL}>{r.shortLabel}</Text>
                <Text style={styles.tableCellR}>{r.answer}</Text>
              </View>
            ))}
          </View>

          {/* Bloque WhatsApp */}
          <CtaBlock waLink={qrValue} />

          <Legal citation={result.test.instrumentCitation} />
        </View>
      </Page>
    </Document>
  );
}
