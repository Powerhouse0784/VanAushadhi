/**
 * GreenRoots — Health Video Education  (Module 4)
 * ────────────────────────────────────────────────
 * "AI-assisted health concern summarization and education"
 *
 * ONE self-contained screen. Route:  /(app)/video
 * Depends ONLY on files that already exist in your repo:
 *   components/{Button,Primitives,AlertCard,States,StatusBadges}
 *   lib/{healthVideoPipeline,emergency,localStore}
 *   data/plants · context/{AppDataContext,AuthContext} · types
 * Icons + layout helpers are inlined, so nothing you built locally
 * (Icons.tsx, FormField.tsx, ScreenScaffold.tsx) can break it.
 *
 * Flow:  compose (video / description / language / consent)
 *        → processing (simulated upload + 5 AI stages, clearly labelled)
 *        → result (neutral summary, mock transcript, general points,
 *                  red-flag symptoms, related plants, questions for a doctor)
 *        → history (view again / delete one / delete everything)
 *
 * Safety: never diagnoses, never prescribes, emergency text short-circuits
 * the education flow, natural ≠ safe banner, consent before processing,
 * video file itself is never stored — only the text summary, and only if
 * the user opts in.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";

import Button from "@/components/Button";
import AlertCard from "@/components/AlertCard";
import { Card, Badge } from "@/components/Primitives";
import { EmptyState, ErrorState } from "@/components/States";
import { EvidenceBadge } from "@/components/StatusBadges";
import { getPlantById } from "@/data/plants";
import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { EMERGENCY_MESSAGE, isEmergencyText } from "@/lib/emergency";
import {
  runHealthVideoPipeline,
  VIDEO_FEATURE_DISCLAIMER,
  VIDEO_FEATURE_LABEL,
} from "@/lib/healthVideoPipeline";
import { STORAGE_KEYS, writeJSON } from "@/lib/localStore";
import type { HealthVideoSubmission } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// expo-av is loaded defensively so a native-module hiccup can NEVER crash the
// screen on stage — we simply fall back to the illustrated poster.
// ─────────────────────────────────────────────────────────────────────────────
let ExpoVideo: any = null;
try {
  ExpoVideo = require("expo-av").Video;
} catch {
  ExpoVideo = null;
}

type Lang = "en" | "hi";
type Phase = "compose" | "processing" | "result";

// ─────────────────────────────────────────────────────────────────────────────
// Palette (mirrors tailwind.config.js tokens for places where we need raw hex)
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  canopy50: "#EFF8F1",
  canopy100: "#DBEFDE",
  canopy200: "#B4DEBC",
  canopy300: "#8CCC99",
  canopy400: "#5FAE70",
  canopy500: "#3D8A4E",
  canopy600: "#2C6E3B",
  canopy700: "#22562F",
  canopy800: "#194023",
  canopy900: "#0F2A17",
  canopy950: "#091C0F",
  cream50: "#FFFDF8",
  cream100: "#FBF6EA",
  cream200: "#F5ECD6",
  bark200: "#DFCFAE",
  bark600: "#6E5330",
  bark700: "#523E24",
  amber: "#C99A2E",
  red: "#B3392C",
};

// ─────────────────────────────────────────────────────────────────────────────
// Inline icon set
// ─────────────────────────────────────────────────────────────────────────────
type IconName =
  | "back" | "record" | "upload" | "play" | "lock" | "trash" | "check" | "shield"
  | "leaf" | "globe" | "phone" | "share" | "bookmark" | "bookmarkFill" | "sparkle"
  | "clock" | "x" | "arrow" | "video";

function Icon({ name, size = 20, color = C.canopy600 }: { name: IconName; size?: number; color?: string }) {
  const p = { stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === "back" && <Path d="M15 5l-7 7 7 7" {...p} />}
      {name === "record" && (
        <>
          <Circle cx={12} cy={12} r={9} {...p} />
          <Circle cx={12} cy={12} r={4.2} fill={color} />
        </>
      )}
      {name === "upload" && <Path d="M12 16V4m0 0L8 8m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" {...p} />}
      {name === "play" && <Path d="M8 5v14l11-7-11-7Z" fill={color} />}
      {name === "lock" && (
        <>
          <Rect x={5} y={11} width={14} height={9} rx={2.2} {...p} />
          <Path d="M8 11V8a4 4 0 0 1 8 0v3" {...p} />
        </>
      )}
      {name === "trash" && <Path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3" {...p} />}
      {name === "check" && <Path d="M5 12.5 9.5 17 19 7.5" {...p} />}
      {name === "shield" && (
        <>
          <Path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6l-8-3Z" {...p} />
          <Path d="m8.5 12 2.5 2.5 4.5-5" {...p} />
        </>
      )}
      {name === "leaf" && (
        <>
          <Path d="M20 4C10 4 4 10 4 17c0 1.7 1.3 3 3 3 7 0 13-6 13-16Z" {...p} />
          <Path d="M5 19c4-4 8-8 13-13" {...p} />
        </>
      )}
      {name === "globe" && (
        <>
          <Circle cx={12} cy={12} r={9} {...p} />
          <Path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" {...p} />
        </>
      )}
      {name === "phone" && (
        <Path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1Z" {...p} />
      )}
      {name === "share" && <Path d="M12 3v12M8 7l4-4 4 4M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6" {...p} />}
      {name === "bookmark" && <Path d="M6 4h12v17l-6-4-6 4V4Z" {...p} />}
      {name === "bookmarkFill" && <Path d="M6 4h12v17l-6-4-6 4V4Z" fill={color} stroke={color} strokeWidth={1.6} strokeLinejoin="round" />}
      {name === "sparkle" && <Path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" {...p} />}
      {name === "clock" && (
        <>
          <Circle cx={12} cy={12} r={9} {...p} />
          <Path d="M12 7v5l3 2" {...p} />
        </>
      )}
      {name === "x" && <Path d="M6 6l12 12M18 6 6 18" {...p} />}
      {name === "arrow" && <Path d="M5 12h14M13 6l6 6-6 6" {...p} />}
      {name === "video" && (
        <>
          <Rect x={3} y={6} width={13} height={12} rx={2.5} {...p} />
          <Path d="m16 10.5 5-3v9l-5-3" {...p} />
        </>
      )}
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Copy (English + Hindi)
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  en: {
    back: "Back",
    eyebrow: "Health video education",
    heroTitle: "Curious about a plant or a health concern?",
    heroBody:
      "Share a short clip or type a few words. You'll get general educational information — never a diagnosis.",
    protoChip: "Prototype · AI is simulated",
    step1: "Add a short video",
    step1Sub: "Optional · up to 60 seconds",
    record: "Record",
    recordSub: "Use your camera",
    upload: "Upload",
    uploadSub: "From your gallery",
    demo: "Demo clip",
    demoSub: "Simulate for the demo",
    replace: "Replace",
    remove: "Remove",
    step2: "Describe your concern",
    step2Sub: "Optional · plain words are fine",
    placeholder: "e.g. I have had throat discomfort for two days. Is there any general information I should know?",
    langLabel: "Language spoken",
    examples: "Try an example",
    step3: "Your consent",
    step3Sub: "You stay in control of your data",
    consentProcess:
      "I consent to this video / description being processed to create an educational summary. In this prototype the processing is simulated and stays on this device.",
    consentSave: "Save the summary to my history. I can delete it any time.",
    privacyTitle: "Privacy promises",
    privacy: [
      "The video file itself is never stored by GreenRoots.",
      "Only the text summary is kept — and only if you choose to save it.",
      "You can delete one entry or everything, any time.",
    ],
    submit: "Get educational summary",
    needConsent: "Please tick the consent box to continue.",
    needInput: "Add a video or a short description first.",
    errCamera: "Camera permission was not granted. You can still upload a clip or type a description.",
    errPicker: "We couldn't open the video picker on this device. Try the demo clip or type a description.",
    errTooLong: "That clip is longer than 60 seconds. Please choose a shorter one.",
    errTooBig: "That file is larger than 100 MB. Please choose a smaller clip.",
    errPipeline: "Something went wrong while creating the summary. Please try again.",
    emergencyLive: "Your text mentions symptoms that may be an emergency.",
    call112: "Call 112",
    helplineTitle: "If you are thinking about harming yourself",
    helpline: "You're not alone. In India you can call Tele-MANAS at 14416 (free, 24×7) or 112 in an emergency.",
    tipsTitle: "Spot an unsafe claim",
    tipsSub: "Four phrases that should make you pause",
    historyTitle: "Your past submissions",
    historySub: "Stored on this device only",
    historyEmpty: "No submissions yet",
    historyEmptySub: "Your saved summaries will appear here. You can delete them any time.",
    view: "View",
    delete: "Delete",
    deleteAll: "Delete all my health video data",
    deleteConfirm: "Tap again to confirm",
    deleted: "Deleted",
    procTitle: "Working on it…",
    procSub: "Simulated pipeline — no real medical analysis is happening.",
    cancel: "Cancel",
    simulated: "Simulated",
    resultEyebrow: "AI-assisted · educational only",
    resultTitle: "Your concern, summarised neutrally",
    transcript: "Transcript",
    pointsTitle: "General points to know",
    flagsTitle: "See a professional promptly if",
    plantsTitle: "Plants often discussed",
    plantsSub: "Traditional use ≠ proven treatment. Check each profile's evidence label.",
    qTitle: "Questions you could ask a professional",
    naturalTitle: "Natural doesn't mean automatically safe",
    natural:
      "Plants can cause allergies, interact with medicines, and may not suit pregnancy, breastfeeding or children. Never stop a prescribed medicine because of a video, a forward or this app.",
    profile: "Profile",
    safety: "Safety check",
    save: "Save",
    saved: "Saved",
    newOne: "New submission",
    shareBtn: "Share summary",
    savedToHistory: "Saved to your history",
    notSaved: "Not saved — as you chose",
    emergencyTitle: "This may require urgent medical attention",
    stages: [
      "Uploading securely (simulated)",
      "Transcribing speech (mock)",
      "Summarising your concern neutrally",
      "Matching evidence-labelled plant profiles",
      "Screening for safety warnings",
    ],
    simClip: "SIMULATED CLIP",
    tapToPlay: "Tap ▶ to preview",
    emergencyEx: "Emergency example",
    scenarios: {
      throat: "Throat discomfort",
      digestive: "Digestive upset",
      skin: "Skin itch",
      energy: "Feeling tired",
      emergency: "Emergency example",
    },
  },
  hi: {
    back: "वापस",
    eyebrow: "स्वास्थ्य वीडियो शिक्षा",
    heroTitle: "किसी पौधे या स्वास्थ्य संबंधी चिंता के बारे में जानना है?",
    heroBody: "एक छोटा वीडियो साझा करें या कुछ शब्द लिखें। आपको सामान्य शैक्षिक जानकारी मिलेगी — कोई निदान नहीं।",
    protoChip: "प्रोटोटाइप · AI सिमुलेटेड है",
    step1: "एक छोटा वीडियो जोड़ें",
    step1Sub: "वैकल्पिक · अधिकतम 60 सेकंड",
    record: "रिकॉर्ड करें",
    recordSub: "कैमरा इस्तेमाल करें",
    upload: "अपलोड करें",
    uploadSub: "गैलरी से चुनें",
    demo: "डेमो क्लिप",
    demoSub: "डेमो के लिए सिमुलेट करें",
    replace: "बदलें",
    remove: "हटाएँ",
    step2: "अपनी चिंता लिखें",
    step2Sub: "वैकल्पिक · सरल शब्द ही काफ़ी हैं",
    placeholder: "जैसे: दो दिनों से गले में तकलीफ़ है। क्या कोई सामान्य जानकारी मिल सकती है?",
    langLabel: "बोली गई भाषा",
    examples: "एक उदाहरण आज़माएँ",
    step3: "आपकी सहमति",
    step3Sub: "आपका डेटा आपके नियंत्रण में है",
    consentProcess:
      "मैं सहमत हूँ कि इस वीडियो / विवरण को शैक्षिक सारांश बनाने के लिए प्रोसेस किया जाए। इस प्रोटोटाइप में प्रोसेसिंग सिमुलेटेड है और इसी डिवाइस पर रहती है।",
    consentSave: "सारांश मेरी हिस्ट्री में सहेजें। मैं इसे कभी भी हटा सकता/सकती हूँ।",
    privacyTitle: "हमारे गोपनीयता वादे",
    privacy: [
      "वीडियो फ़ाइल को GreenRoots कभी सहेजता नहीं है।",
      "केवल टेक्स्ट सारांश रखा जाता है — और वह भी तभी जब आप सहेजना चुनें।",
      "आप किसी भी समय एक प्रविष्टि या सब कुछ हटा सकते हैं।",
    ],
    submit: "शैक्षिक सारांश पाएँ",
    needConsent: "आगे बढ़ने के लिए कृपया सहमति दें।",
    needInput: "पहले वीडियो जोड़ें या संक्षिप्त विवरण लिखें।",
    errCamera: "कैमरा अनुमति नहीं मिली। आप क्लिप अपलोड कर सकते हैं या विवरण लिख सकते हैं।",
    errPicker: "इस डिवाइस पर वीडियो चयन नहीं खुल सका। डेमो क्लिप आज़माएँ या विवरण लिखें।",
    errTooLong: "यह क्लिप 60 सेकंड से लंबी है। कृपया छोटी क्लिप चुनें।",
    errTooBig: "यह फ़ाइल 100 MB से बड़ी है। कृपया छोटी क्लिप चुनें।",
    errPipeline: "सारांश बनाते समय कुछ गड़बड़ हुई। कृपया फिर कोशिश करें।",
    emergencyLive: "आपके लिखे में ऐसे लक्षण हैं जो आपातकाल हो सकते हैं।",
    call112: "112 पर कॉल करें",
    helplineTitle: "यदि आप खुद को नुकसान पहुँचाने के बारे में सोच रहे हैं",
    helpline: "आप अकेले नहीं हैं। भारत में Tele-MANAS 14416 (निःशुल्क, 24×7) या आपातकाल में 112 पर कॉल करें।",
    tipsTitle: "असुरक्षित दावे पहचानें",
    tipsSub: "चार वाक्य जिन पर रुककर सोचना चाहिए",
    historyTitle: "आपके पिछले सबमिशन",
    historySub: "केवल इसी डिवाइस पर सहेजे गए",
    historyEmpty: "अभी कोई सबमिशन नहीं",
    historyEmptySub: "आपके सहेजे सारांश यहाँ दिखेंगे। आप इन्हें कभी भी हटा सकते हैं।",
    view: "देखें",
    delete: "हटाएँ",
    deleteAll: "मेरा सारा स्वास्थ्य वीडियो डेटा हटाएँ",
    deleteConfirm: "पक्का करने के लिए फिर दबाएँ",
    deleted: "हटा दिया गया",
    procTitle: "काम जारी है…",
    procSub: "सिमुलेटेड प्रक्रिया — कोई वास्तविक चिकित्सा विश्लेषण नहीं हो रहा।",
    cancel: "रद्द करें",
    simulated: "सिमुलेटेड",
    resultEyebrow: "AI-सहायता प्राप्त · केवल शैक्षिक",
    resultTitle: "आपकी चिंता का तटस्थ सारांश",
    transcript: "ट्रांसक्रिप्ट",
    pointsTitle: "जानने योग्य सामान्य बातें",
    flagsTitle: "इन स्थितियों में जल्द विशेषज्ञ को दिखाएँ",
    plantsTitle: "अक्सर चर्चा में आने वाले पौधे",
    plantsSub: "पारंपरिक उपयोग ≠ सिद्ध इलाज। हर प्रोफ़ाइल का प्रमाण-लेबल देखें।",
    qTitle: "विशेषज्ञ से पूछने योग्य प्रश्न",
    naturalTitle: "प्राकृतिक का मतलब अपने-आप सुरक्षित नहीं",
    natural:
      "पौधों से एलर्जी हो सकती है, वे दवाओं के साथ असर कर सकते हैं और गर्भावस्था, स्तनपान या बच्चों के लिए उचित न हों। किसी वीडियो, फ़ॉरवर्ड या इस ऐप के कहने पर निर्धारित दवा कभी बंद न करें।",
    profile: "प्रोफ़ाइल",
    safety: "सुरक्षा जाँच",
    save: "सहेजें",
    saved: "सहेजा गया",
    newOne: "नया सबमिशन",
    shareBtn: "सारांश साझा करें",
    savedToHistory: "आपकी हिस्ट्री में सहेजा गया",
    notSaved: "सहेजा नहीं गया — आपकी पसंद के अनुसार",
    emergencyTitle: "इसमें तुरंत चिकित्सा सहायता की आवश्यकता हो सकती है",
    stages: [
      "सुरक्षित रूप से अपलोड (सिमुलेटेड)",
      "बोली को टेक्स्ट में बदला जा रहा है (मॉक)",
      "आपकी चिंता का तटस्थ सारांश बन रहा है",
      "प्रमाण-लेबल वाली पौधा प्रोफ़ाइल मिलाई जा रही हैं",
      "सुरक्षा चेतावनियों की जाँच",
    ],
    simClip: "सिमुलेटेड क्लिप",
    tapToPlay: "प्रीव्यू के लिए ▶ दबाएँ",
    emergencyEx: "आपातकालीन उदाहरण",
    scenarios: {
      throat: "गले में तकलीफ़",
      digestive: "पेट की तकलीफ़",
      skin: "त्वचा में खुजली",
      energy: "थकान",
      emergency: "आपातकालीन उदाहरण",
    },
  },
} as const;

const EMERGENCY_HI =
  "इसमें तुरंत चिकित्सा सहायता की आवश्यकता हो सकती है। स्थानीय आपातकालीन सेवाओं से संपर्क करें या तुरंत निकटतम आपातकालीन विभाग जाएँ।";

const TIPS: { en: [string, string]; hi: [string, string] }[] = [
  {
    en: ["“Cures everything”", "No single plant treats every condition. Be wary of anything that promises a cure."],
    hi: ["“हर बीमारी का इलाज”", "कोई एक पौधा हर बीमारी ठीक नहीं करता। इलाज का वादा करने वाली बातों से सावधान रहें।"],
  },
  {
    en: ["“No side effects”", "Natural ≠ automatically safe. Plants can trigger allergies and interact with medicines."],
    hi: ["“कोई साइड इफ़ेक्ट नहीं”", "प्राकृतिक ≠ अपने-आप सुरक्षित। पौधों से एलर्जी हो सकती है और दवाओं पर असर पड़ सकता है।"],
  },
  {
    en: ["“Stop your medicine”", "Never stop a prescribed medicine because of a video or a forwarded message."],
    hi: ["“दवा बंद कर दो”", "किसी वीडियो या फ़ॉरवर्ड संदेश के कहने पर निर्धारित दवा कभी बंद न करें।"],
  },
  {
    en: ["“Secret doctors hide”", "Trustworthy information names its source and is honest about its limits."],
    hi: ["“डॉक्टर जो राज़ छिपाते हैं”", "भरोसेमंद जानकारी अपना स्रोत बताती है और अपनी सीमाओं के बारे में ईमानदार होती है।"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Concern library (bilingual). Classification mirrors lib/healthVideoPipeline.ts
// but ALSO understands Hindi keywords, since the shared pipeline is English-only.
// ─────────────────────────────────────────────────────────────────────────────
interface Loc {
  label: string;
  summary: string;
  points: string[];
  flags: string[];
  questions: string[];
}
interface Concern {
  id: string;
  match: RegExp | null;
  plantIds: string[];
  en: Loc;
  hi: Loc;
}

const CONCERNS: Concern[] = [
  {
    id: "throat",
    match: /throat|cough|cold|गला|गले|खांसी|खाँसी|सर्दी|जुकाम/i,
    plantIds: ["tulsi", "ginger", "mint"],
    en: {
      label: "throat discomfort or a mild cough or cold",
      summary:
        "This appears to describe throat discomfort or a mild cough or cold. This is not a diagnosis. General information about hydration, rest and commonly discussed food or plant ingredients may be shown below. Persistent, severe or worsening symptoms should be assessed by a qualified healthcare professional.",
      points: [
        "Staying hydrated and resting the voice are commonly suggested general steps.",
        "Warm fluids are a common comfort measure. Tulsi, ginger or mint are traditionally used — evidence is limited.",
        "Smoke, dust and very cold drinks can irritate an already sore throat.",
      ],
      flags: [
        "Difficulty breathing or swallowing",
        "High fever, or symptoms lasting more than a few days",
        "Blood in saliva or phlegm",
        "Symptoms in a young child or infant",
      ],
      questions: [
        "Could my symptoms need a check-up or a test?",
        "Are any herbal drinks I'm considering safe with my medicines?",
      ],
    },
    hi: {
      label: "गले में तकलीफ़ या हल्की खाँसी-सर्दी",
      summary:
        "यह वीडियो/विवरण गले में तकलीफ़ या हल्की खाँसी-सर्दी के बारे में प्रतीत होता है। यह कोई निदान नहीं है। नीचे पानी पीते रहने, आराम करने और आमतौर पर चर्चा में आने वाली खाने-पीने की चीज़ों व पौधों की सामान्य जानकारी दी गई है। लंबे समय तक रहने वाले, गंभीर या बढ़ते लक्षणों की जाँच किसी योग्य स्वास्थ्य विशेषज्ञ से करवाएँ।",
      points: [
        "पर्याप्त पानी पीना और आवाज़ को आराम देना आमतौर पर सुझाई जाने वाली सामान्य बातें हैं।",
        "गुनगुने तरल पदार्थ आराम देने वाले माने जाते हैं। तुलसी, अदरक या पुदीना पारंपरिक रूप से इस्तेमाल होते हैं — प्रमाण सीमित हैं।",
        "धुआँ, धूल और बहुत ठंडे पेय पहले से खराश वाले गले को और परेशान कर सकते हैं।",
      ],
      flags: [
        "साँस लेने या निगलने में कठिनाई",
        "तेज़ बुखार, या कुछ दिनों से अधिक समय तक रहने वाले लक्षण",
        "थूक या बलगम में खून",
        "छोटे बच्चे या शिशु में लक्षण",
      ],
      questions: [
        "क्या मेरे लक्षणों के लिए जाँच या टेस्ट की ज़रूरत हो सकती है?",
        "क्या मेरी दवाओं के साथ कोई हर्बल पेय लेना सुरक्षित है?",
      ],
    },
  },
  {
    id: "digestive",
    match: /digest|stomach|indigestion|bloat|पेट|पाचन|अपच|गैस|कब्ज/i,
    plantIds: ["mint", "ginger"],
    en: {
      label: "digestive discomfort",
      summary:
        "This appears to describe digestive discomfort. This is not a diagnosis. General information about smaller meals, hydration and commonly discussed ingredients such as mint or ginger may be relevant. Severe abdominal pain, persistent vomiting or blood in stool needs prompt professional evaluation.",
      points: [
        "Smaller, lighter meals and enough fluids are commonly suggested.",
        "Ginger or mint teas are traditionally used. Evidence is limited and they can upset some stomachs.",
        "Noting what you ate and when symptoms began can help a professional.",
      ],
      flags: [
        "Severe or worsening abdominal pain",
        "Persistent vomiting or signs of dehydration",
        "Blood in stool or vomit",
        "Fever together with stomach symptoms",
      ],
      questions: [
        "Could my symptoms need a check-up or tests?",
        "Are ginger or mint products suitable alongside my medicines?",
      ],
    },
    hi: {
      label: "पाचन संबंधी तकलीफ़",
      summary:
        "यह वीडियो/विवरण पाचन संबंधी तकलीफ़ के बारे में प्रतीत होता है। यह कोई निदान नहीं है। कम मात्रा के भोजन, पर्याप्त पानी तथा पुदीना या अदरक जैसी चर्चित चीज़ों की सामान्य जानकारी प्रासंगिक हो सकती है। पेट में तेज़ दर्द, लगातार उल्टी या मल में खून होने पर तुरंत चिकित्सकीय जाँच ज़रूरी है।",
      points: [
        "कम मात्रा के हल्के भोजन और पर्याप्त तरल पदार्थ आमतौर पर सुझाए जाते हैं।",
        "अदरक या पुदीने की चाय पारंपरिक रूप से इस्तेमाल होती है। प्रमाण सीमित हैं और कुछ लोगों को पेट में परेशानी भी हो सकती है।",
        "आपने क्या खाया और लक्षण कब शुरू हुए — यह लिख लेना विशेषज्ञ के लिए मददगार होता है।",
      ],
      flags: [
        "पेट में तेज़ या बढ़ता दर्द",
        "लगातार उल्टी या पानी की कमी के लक्षण",
        "मल या उल्टी में खून",
        "पेट की तकलीफ़ के साथ बुखार",
      ],
      questions: [
        "क्या मेरे लक्षणों के लिए जाँच की ज़रूरत हो सकती है?",
        "क्या मेरी दवाओं के साथ अदरक या पुदीना लेना ठीक रहेगा?",
      ],
    },
  },
  {
    id: "skin",
    match: /skin|rash|itch|acne|त्वचा|खुजली|दाने|चकत्ते|रैश/i,
    plantIds: ["neem", "aloevera", "turmeric"],
    en: {
      label: "a minor skin concern",
      summary:
        "This appears to describe a minor skin concern. This is not a diagnosis. General information sometimes mentions external use of ingredients such as aloe vera or neem, with a small patch test first. Spreading rashes, signs of infection or no improvement should be seen by a doctor or dermatologist.",
      points: [
        "Gentle cleansing and avoiding new products on irritated skin are common suggestions.",
        "If trying any plant ingredient on skin, a small patch test is often advised first — stop if itching or redness appears.",
        "Avoid applying unidentified plants or raw juices to broken skin.",
      ],
      flags: [
        "Spreading redness, warmth, pus or swelling",
        "Swelling of lips, face or tongue",
        "Fever together with a rash",
        "No improvement after several days",
      ],
      questions: [
        "Could this need an examination or a skin test?",
        "Is it safe to use aloe or neem on my skin given my allergies?",
      ],
    },
    hi: {
      label: "त्वचा की मामूली समस्या",
      summary:
        "यह वीडियो/विवरण त्वचा की किसी मामूली समस्या के बारे में प्रतीत होता है। यह कोई निदान नहीं है। सामान्य जानकारी में कभी-कभी एलोवेरा या नीम जैसी चीज़ों के बाहरी उपयोग का ज़िक्र होता है, वह भी पहले छोटे हिस्से पर पैच टेस्ट के साथ। फैलते चकत्ते, संक्रमण के लक्षण या सुधार न होने पर डॉक्टर या त्वचा रोग विशेषज्ञ को दिखाएँ।",
      points: [
        "हल्की सफ़ाई और चिड़चिड़ी त्वचा पर नए उत्पादों से बचना आमतौर पर सुझाया जाता है।",
        "त्वचा पर कोई भी पौधा-आधारित चीज़ आज़माने से पहले छोटे हिस्से पर पैच टेस्ट की सलाह दी जाती है — खुजली या लालिमा होने पर तुरंत बंद करें।",
        "अज्ञात पौधे या कच्चा रस कटी-फटी त्वचा पर न लगाएँ।",
      ],
      flags: [
        "फैलती लालिमा, गर्माहट, मवाद या सूजन",
        "होंठ, चेहरे या जीभ में सूजन",
        "चकत्तों के साथ बुखार",
        "कई दिनों बाद भी सुधार न होना",
      ],
      questions: [
        "क्या इसके लिए जाँच या स्किन टेस्ट की ज़रूरत हो सकती है?",
        "मेरी एलर्जी को देखते हुए क्या त्वचा पर एलोवेरा या नीम लगाना सुरक्षित है?",
      ],
    },
  },
  {
    id: "energy",
    match: /immun|energy|fatigue|tired|weak|थकान|कमजोर|कमज़ोर|ऊर्जा|इम्यून|प्रतिरोधक/i,
    plantIds: ["amla", "moringa", "ashwagandha"],
    en: {
      label: "general immunity, energy or tiredness",
      summary:
        "This appears to describe general immunity, energy or tiredness. This is not a diagnosis. General wellness information often mentions sleep, balanced meals and nutrient-rich foods such as amla or moringa. Persistent, or sudden and severe, tiredness should be discussed with a doctor because it can have many causes.",
      points: [
        "Sleep, regular meals and hydration are commonly discussed foundations.",
        "Nutrient-rich foods like amla or moringa are discussed in nutrition contexts — they are not proven fixes for tiredness.",
        "Tiredness has many possible causes, so a check-up can help find out why.",
      ],
      flags: [
        "Sudden or severe tiredness",
        "Tiredness with chest pain, breathlessness or dizziness",
        "Unexplained weight loss or fever",
        "Low mood that lasts for weeks",
      ],
      questions: [
        "Which basic checks could help find the cause of my tiredness?",
        "Are supplements like ashwagandha suitable with my medicines and conditions?",
      ],
    },
    hi: {
      label: "सामान्य रोग-प्रतिरोधक क्षमता, ऊर्जा या थकान",
      summary:
        "यह वीडियो/विवरण सामान्य रोग-प्रतिरोधक क्षमता, ऊर्जा या थकान के बारे में प्रतीत होता है। यह कोई निदान नहीं है। सामान्य जानकारी में अक्सर नींद, संतुलित भोजन और आँवला या मोरिंगा जैसे पोषक खाद्य पदार्थों का ज़िक्र होता है। लगातार, या अचानक और तेज़, थकान के कई कारण हो सकते हैं, इसलिए डॉक्टर से चर्चा करें।",
      points: [
        "नींद, नियमित भोजन और पर्याप्त पानी को आमतौर पर आधार माना जाता है।",
        "आँवला या मोरिंगा जैसे पोषक खाद्य पोषण के संदर्भ में चर्चित हैं — ये थकान का सिद्ध इलाज नहीं हैं।",
        "थकान के कई संभावित कारण हो सकते हैं, इसलिए जाँच से कारण जानने में मदद मिल सकती है।",
      ],
      flags: [
        "अचानक या बहुत तेज़ थकान",
        "थकान के साथ सीने में दर्द, साँस फूलना या चक्कर",
        "अकारण वज़न घटना या बुखार",
        "हफ़्तों तक रहने वाला उदास मन",
      ],
      questions: [
        "मेरी थकान का कारण जानने के लिए कौन-सी बुनियादी जाँचें मददगार होंगी?",
        "क्या मेरी दवाओं और स्वास्थ्य स्थिति के साथ अश्वगंधा जैसे सप्लीमेंट ठीक रहेंगे?",
      ],
    },
  },
  {
    id: "general",
    match: null,
    plantIds: [],
    en: {
      label: "a general health question",
      summary:
        "This has been reviewed at a general level. This is not a diagnosis. General themes such as hydration, rest and balanced nutrition may be relevant, along with plant profiles in the Library. Persistent, severe or worsening symptoms should be assessed by a qualified healthcare professional.",
      points: [
        "Hydration, rest and balanced meals are common general wellness themes.",
        "Plant profiles in the Library separate traditional use from scientific evidence.",
        "Write down when symptoms started, what changes them, and any medicines you take.",
      ],
      flags: [
        "Symptoms that are severe, persistent or worsening",
        "New symptoms after starting an herbal product",
        "Symptoms in pregnancy, infants or older adults",
      ],
      questions: [
        "What could be causing my symptoms, and do I need any tests?",
        "Is it safe to add any herbal product to my current routine?",
      ],
    },
    hi: {
      label: "सामान्य स्वास्थ्य संबंधी प्रश्न",
      summary:
        "इसे सामान्य स्तर पर देखा गया है। यह कोई निदान नहीं है। पानी पीना, आराम और संतुलित पोषण जैसी सामान्य बातें, साथ ही लाइब्रेरी के पौधों की प्रोफ़ाइल, प्रासंगिक हो सकती हैं। लंबे समय तक रहने वाले, गंभीर या बढ़ते लक्षणों की जाँच किसी योग्य स्वास्थ्य विशेषज्ञ से करवाएँ।",
      points: [
        "पानी पीना, आराम और संतुलित भोजन सामान्य स्वास्थ्य के आम विषय हैं।",
        "लाइब्रेरी की पौधा-प्रोफ़ाइल पारंपरिक उपयोग और वैज्ञानिक प्रमाण को अलग-अलग दिखाती हैं।",
        "लक्षण कब शुरू हुए, किससे घटते-बढ़ते हैं और आप कौन-सी दवाएँ लेते हैं — यह लिख लें।",
      ],
      flags: [
        "गंभीर, लंबे समय तक रहने वाले या बढ़ते लक्षण",
        "कोई हर्बल उत्पाद शुरू करने के बाद नए लक्षण",
        "गर्भावस्था, शिशुओं या बुज़ुर्गों में लक्षण",
      ],
      questions: [
        "मेरे लक्षणों का कारण क्या हो सकता है और क्या किसी जाँच की ज़रूरत है?",
        "क्या मेरी मौजूदा दिनचर्या में कोई हर्बल उत्पाद जोड़ना सुरक्षित है?",
      ],
    },
  },
];

/** Remove nukta marks so "तकलीफ़"/"तकलीफ" and "ज़हर"/"जहर" compare equal. */
function norm(text: string): string {
  return text.normalize("NFD").replace(/\u093C/g, "").normalize("NFC");
}

// Hindi emergency patterns (nukta-free). English ones live in lib/emergency.ts.
const HI_EMERGENCY =
  /सीने\s*में\s*(तेज\s*)?दर्द|(साँस|सांस)\s*(लेने\s*में\s*)?(कठिनाई|तकलीफ|दिक्कत|नहीं)|बेहोश|बहुत\s*(ज्यादा\s*)?खून|लकवा|चेहरा\s*टेढ|जहर|दौरा|आत्महत्या|मरना\s*चाहता|मरना\s*चाहती|खुद\s*को\s*नुकसान/;
const SELF_HARM = /suicid|self[-\s]?harm|want to die|आत्महत्या|मरना\s*चाहता|मरना\s*चाहती|खुद\s*को\s*नुकसान/i;

function detectEmergency(text: string): boolean {
  return isEmergencyText(text) || HI_EMERGENCY.test(norm(text));
}

function classify(text: string): Concern {
  const t = norm(text);
  return CONCERNS.find((c) => c.match && c.match.test(t)) ?? CONCERNS[CONCERNS.length - 1];
}

// Demo scenarios ("upload or simulate")
const SCENARIOS: { id: keyof typeof T.en.scenarios; emoji: string; en: string; hi: string }[] = [
  {
    id: "throat",
    emoji: "🫖",
    en: "I have had throat discomfort for two days. Is there any general information I should know?",
    hi: "दो दिनों से मेरे गले में तकलीफ़ है। क्या कोई सामान्य जानकारी मिल सकती है?",
  },
  {
    id: "digestive",
    emoji: "🍃",
    en: "My stomach has felt bloated after meals lately. What general information is there about digestion?",
    hi: "आजकल खाने के बाद मेरा पेट फूला-फूला लगता है। पाचन के बारे में कोई सामान्य जानकारी मिलेगी?",
  },
  {
    id: "skin",
    emoji: "🧴",
    en: "I have a mild itchy skin patch on my arm. Can you share some general information?",
    hi: "मेरी बाँह पर त्वचा में हल्की खुजली वाला हिस्सा है। क्या आप कुछ सामान्य जानकारी दे सकते हैं?",
  },
  {
    id: "energy",
    emoji: "🔋",
    en: "I feel tired most days and want to know about general immunity and energy.",
    hi: "मुझे ज़्यादातर दिन थकान रहती है और मैं सामान्य रोग-प्रतिरोधक क्षमता और ऊर्जा के बारे में जानना चाहता हूँ।",
  },
  {
    id: "emergency",
    emoji: "🚨",
    en: "I have chest pain and my breathing is difficult right now.",
    hi: "मुझे सीने में तेज़ दर्द है और साँस लेने में कठिनाई हो रही है।",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────────────────────────
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function fmtDuration(ms?: number) {
  if (!ms && ms !== 0) return "";
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
function fmtSize(bytes?: number) {
  if (!bytes) return "";
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}
function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

function useTypewriter(text: string, enabled: boolean, stepMs = 14) {
  const [n, setN] = useState(enabled ? 0 : text.length);
  useEffect(() => {
    if (!enabled) {
      setN(text.length);
      return;
    }
    setN(0);
    const id = setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          clearInterval(id);
          return v;
        }
        return Math.min(text.length, v + 3);
      });
    }, stepMs);
    return () => clearInterval(id);
  }, [text, enabled, stepMs]);
  return text.slice(0, n);
}

type Clip =
  | { kind: "real"; uri: string; durationMs?: number; sizeBytes?: number; name?: string }
  | { kind: "demo"; seconds: number };

interface ResultData {
  transcript: string;
  isEmergency: boolean;
  concern: Concern;
  plantIds: string[];
  sourceText: string;
  createdAt: string;
  lang: Lang;
  animate: boolean;
  saved: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated building blocks
// ─────────────────────────────────────────────────────────────────────────────
function WaveBars({ active, color = C.canopy300, count = 20, height = 36 }: { active: boolean; color?: string; count?: number; height?: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", height, gap: 3 }}>
      {Array.from({ length: count }).map((_, i) => {
        const peak = 8 + ((i * 7) % 5) * ((height - 10) / 5);
        return (
          <MotiView
            key={i}
            from={{ height: 5 }}
            animate={{ height: active ? peak : 5 }}
            transition={{
              type: "timing",
              duration: 360 + (i % 4) * 90,
              delay: i * 35,
              loop: active,
              repeatReverse: true,
            }}
            style={{ width: 3, borderRadius: 2, backgroundColor: color, opacity: active ? 1 : 0.55 }}
          />
        );
      })}
    </View>
  );
}

function PulseRing({ size = 64, color = C.canopy300 }: { size?: number; color?: string }) {
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {[0, 1].map((i) => (
        <MotiView
          key={i}
          from={{ scale: 1, opacity: 0.45 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ type: "timing", duration: 1600, delay: i * 700, loop: true }}
          style={{ position: "absolute", width: size, height: size, borderRadius: size / 2, backgroundColor: color }}
        />
      ))}
      <View style={{ width: size * 0.62, height: size * 0.62, borderRadius: size, backgroundColor: color, alignItems: "center", justifyContent: "center" }}>
        <Icon name="video" size={size * 0.34} color={C.canopy950} />
      </View>
    </View>
  );
}

function FloatingLeaf({ left, top, delay, size, opacity }: { left: number | string; top: number; delay: number; size: number; opacity: number }) {
  return (
    <MotiView
      from={{ translateY: 0, rotate: "-12deg" }}
      animate={{ translateY: -12, rotate: "14deg" }}
      transition={{ type: "timing", duration: 2600, delay, loop: true, repeatReverse: true }}
      style={{ position: "absolute", left: left as any, top, opacity }}
      pointerEvents="none"
    >
      <Icon name="leaf" size={size} color={C.canopy300} />
    </MotiView>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  const [w, setW] = useState(0);
  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}
      style={{ height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.14)", overflow: "hidden" }}
    >
      <MotiView
        animate={{ width: (w * Math.min(100, pct)) / 100 }}
        transition={{ type: "timing", duration: 260 }}
        style={{ height: 8, borderRadius: 4, backgroundColor: C.canopy300 }}
      />
    </View>
  );
}

function StepHeader({ n, title, sub }: { n: number; title: string; sub?: string }) {
  return (
    <View className="flex-row items-center mb-3" style={{ gap: 12 }}>
      <View
        style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: C.canopy600, alignItems: "center", justifyContent: "center" }}
      >
        <Text className="text-white font-body-bold text-sm">{n}</Text>
      </View>
      <View className="flex-1">
        <Text className="font-display text-lg text-canopy-950">{title}</Text>
        {sub ? <Text className="font-body text-xs text-canopy-700/70">{sub}</Text> : null}
      </View>
    </View>
  );
}

function Reveal({ i = 0, children }: { i?: number; children: React.ReactNode }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 18 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 420, delay: 80 + i * 90 }}
    >
      {children}
    </MotiView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Video preview (real clip via expo-av, or illustrated simulated poster)
// ─────────────────────────────────────────────────────────────────────────────
function VideoPreview({ clip, processing, lang, onRemove, onReplace }: { clip: Clip; processing: boolean; lang: Lang; onRemove?: () => void; onReplace?: () => void }) {
  const t = T[lang];
  const H = 210;
  const showReal = clip.kind === "real" && ExpoVideo;

  return (
    <View style={{ height: H, borderRadius: 24, overflow: "hidden", backgroundColor: C.canopy950 }}>
      {showReal ? (
        <ExpoVideo
          source={{ uri: (clip as Extract<Clip, { kind: "real" }>).uri }}
          style={{ width: "100%", height: "100%" }}
          useNativeControls={!processing}
          resizeMode="contain"
          shouldPlay={false}
        />
      ) : (
        <LinearGradient colors={[C.canopy800, C.canopy600, C.canopy400]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Svg width={96} height={96} viewBox="0 0 100 100">
            <Circle cx={50} cy={36} r={16} fill="rgba(255,253,248,0.9)" />
            <Path d="M16 94c2-19 16-28 34-28s32 9 34 28Z" fill="rgba(255,253,248,0.9)" />
          </Svg>
          <View style={{ marginTop: 10 }}>
            <WaveBars active={processing} color={C.cream100} count={22} height={26} />
          </View>
        </LinearGradient>
      )}

      {/* Labels */}
      <View style={{ position: "absolute", top: 12, left: 12, flexDirection: "row", gap: 6 }} pointerEvents="none">
        <View style={{ backgroundColor: "rgba(9,28,15,0.65)", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 }}>
          <Text style={{ color: C.cream100, fontSize: 10, letterSpacing: 0.6 }} className="font-body-semibold">
            {clip.kind === "demo"
              ? `${t.simClip} · ${fmtDuration(clip.seconds * 1000)}`
              : [fmtDuration(clip.durationMs), fmtSize(clip.sizeBytes)].filter(Boolean).join(" · ") || "VIDEO"}
          </Text>
        </View>
      </View>

      {/* Actions */}
      {!processing && (onRemove || onReplace) ? (
        <View style={{ position: "absolute", top: 10, right: 10, flexDirection: "row", gap: 8 }}>
          {onReplace ? (
            <Pressable
              onPress={onReplace}
              accessibilityRole="button"
              accessibilityLabel={t.replace}
              style={{ backgroundColor: "rgba(9,28,15,0.65)", width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" }}
            >
              <Icon name="upload" size={16} color={C.cream100} />
            </Pressable>
          ) : null}
          {onRemove ? (
            <Pressable
              onPress={onRemove}
              accessibilityRole="button"
              accessibilityLabel={t.remove}
              style={{ backgroundColor: "rgba(9,28,15,0.65)", width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" }}
            >
              <Icon name="x" size={16} color={C.cream100} />
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {/* Scan line while processing */}
      {processing ? (
        <>
          <MotiView
            from={{ translateY: 0 }}
            animate={{ translateY: H - 3 }}
            transition={{ type: "timing", duration: 1500, loop: true, repeatReverse: true }}
            style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, backgroundColor: C.canopy300, shadowColor: C.canopy300, shadowOpacity: 0.9, shadowRadius: 8 }}
            pointerEvents="none"
          />
          <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(9,28,15,0.25)" }} pointerEvents="none" />
        </>
      ) : null}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Processing panel
// ─────────────────────────────────────────────────────────────────────────────
function StageRow({ label, state, extra }: { label: string; state: "pending" | "active" | "done"; extra?: string }) {
  return (
    <View className="flex-row items-center" style={{ gap: 12, paddingVertical: 7 }}>
      <View style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
        {state === "done" ? (
          <MotiView
            from={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 10 }}
            style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.canopy400, alignItems: "center", justifyContent: "center" }}
          >
            <Icon name="check" size={13} color={C.canopy950} />
          </MotiView>
        ) : state === "active" ? (
          <ActivityIndicator size="small" color={C.canopy300} />
        ) : (
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.22)" }} />
        )}
      </View>
      <Text
        className="flex-1 font-body-medium text-sm"
        style={{ color: state === "pending" ? "rgba(219,239,222,0.45)" : state === "active" ? "#FFFFFF" : C.canopy200 }}
      >
        {label}
      </Text>
      {extra ? <Text style={{ color: C.canopy300 }} className="font-body-semibold text-xs">{extra}</Text> : null}
    </View>
  );
}

function ProcessingPanel({ clip, lang, stage, uploadPct, onCancel }: { clip: Clip | null; lang: Lang; stage: number; uploadPct: number; onCancel: () => void }) {
  const t = T[lang];
  const overall = Math.min(100, stage * 20 + (stage === 0 ? uploadPct * 0.2 : 0));
  return (
    <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "timing", duration: 380 }}>
      <View style={{ backgroundColor: C.canopy950, borderRadius: 28, padding: 18, gap: 16 }}>
        <View className="flex-row items-center" style={{ gap: 14 }}>
          <PulseRing size={54} />
          <View className="flex-1">
            <Text className="font-display text-xl text-white">{t.procTitle}</Text>
            <Text className="font-body text-xs" style={{ color: "rgba(219,239,222,0.7)" }}>{t.procSub}</Text>
          </View>
          <Text className="font-display text-xl" style={{ color: C.canopy300 }}>{Math.round(overall)}%</Text>
        </View>

        {clip ? <VideoPreview clip={clip} processing lang={lang} /> : <WaveBars active count={34} height={44} />}

        <ProgressBar pct={overall} />

        <View>
          {t.stages.map((label, i) => (
            <StageRow
              key={label}
              label={label}
              state={i < stage ? "done" : i === stage ? "active" : "pending"}
              extra={i === 0 && stage === 0 ? `${uploadPct}%` : undefined}
            />
          ))}
        </View>

        <View className="flex-row items-center justify-between">
          <Badge label={t.simulated} color={C.amber} bg="rgba(201,154,46,0.18)" />
          <Pressable onPress={onCancel} accessibilityRole="button" hitSlop={10}>
            <Text style={{ color: C.canopy200 }} className="font-body-semibold text-sm">{t.cancel}</Text>
          </Pressable>
        </View>
      </View>
    </MotiView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Result view
// ─────────────────────────────────────────────────────────────────────────────
function BulletList({ items, color = C.canopy400 }: { items: string[]; color?: string }) {
  return (
    <View style={{ gap: 8 }}>
      {items.map((it) => (
        <View key={it} className="flex-row" style={{ gap: 10 }}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: color, marginTop: 7 }} />
          <Text className="flex-1 font-body text-sm text-canopy-900 leading-5">{it}</Text>
        </View>
      ))}
    </View>
  );
}

function PlantMini({
  plantId,
  lang,
  saved,
  onToggle,
}: {
  plantId: string;
  lang: Lang;
  saved: boolean;
  onToggle: () => void;
}) {
  const t = T[lang];
  const plant = getPlantById(plantId);
  if (!plant) return null;
  return (
    <Card className="p-4" style={{ gap: 10 }}>
      <View className="flex-row items-start justify-between" style={{ gap: 10 }}>
        <View className="flex-1">
          <Text className="font-display text-lg text-canopy-950">{plant.commonName}</Text>
          <Text className="font-body text-xs text-canopy-700/70">
            {plant.localName} · <Text style={{ fontStyle: "italic" }}>{plant.scientificName}</Text>
          </Text>
        </View>
        <EvidenceBadge level={plant.evidenceLevel} />
      </View>
      <View style={{ backgroundColor: "#FBF1DA", borderRadius: 14, padding: 10, borderWidth: 1, borderColor: "#E7BE6C" }}>
        <Text className="font-body-semibold text-xs" style={{ color: "#7A5A16" }}>
          {lang === "hi" ? "दवाओं के साथ असर (अंग्रेज़ी स्रोत)" : "Medicine interactions"}
        </Text>
        <Text className="font-body text-xs leading-4 mt-0.5" style={{ color: "#7A5A16" }} numberOfLines={3}>
          {plant.medicineInteractionWarning}
        </Text>
      </View>
      <View className="flex-row" style={{ gap: 8 }}>
        <View className="flex-1">
          <Button label={t.profile} size="sm" variant="ghost" fullWidth onPress={() => router.push(`/(app)/plant/${plant.id}` as any)} />
        </View>
        <View className="flex-1">
          <Button label={t.safety} size="sm" variant="outline" fullWidth onPress={() => router.push(`/(app)/safety/${plant.id}` as any)} />
        </View>
        <Pressable
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityLabel={saved ? t.saved : t.save}
          style={{ width: 42, borderRadius: 12, backgroundColor: saved ? C.canopy600 : C.canopy50, alignItems: "center", justifyContent: "center" }}
        >
          <Icon name={saved ? "bookmarkFill" : "bookmark"} size={18} color={saved ? "#FFFFFF" : C.canopy600} />
        </Pressable>
      </View>
    </Card>
  );
}

function ResultView({
  data,
  savedPlantIds,
  onToggleSave,
  onNew,
}: {
  data: ResultData;
  savedPlantIds: string[];
  onToggleSave: (id: string) => void;
  onNew: () => void;
}) {
  const lang = data.lang;
  const t = T[lang];
  const loc = data.concern[lang];
  const summary = useTypewriter(loc.summary, data.animate && !data.isEmergency);
  const selfHarm = SELF_HARM.test(data.sourceText);

  const shareSummary = async () => {
    try {
      await Share.share({
        message: `${VIDEO_FEATURE_LABEL}\n\n${data.isEmergency ? EMERGENCY_MESSAGE : loc.summary}\n\n${VIDEO_FEATURE_DISCLAIMER}`,
      });
    } catch {
      /* sharing is best-effort */
    }
  };

  let i = 0;
  return (
    <View style={{ gap: 14 }}>
      <Reveal i={i++}>
        <View className="flex-row items-center justify-between">
          <Pressable onPress={onNew} accessibilityRole="button" className="flex-row items-center" style={{ gap: 6 }}>
            <Icon name="back" size={18} />
            <Text className="font-body-semibold text-sm text-canopy-700">{t.newOne}</Text>
          </Pressable>
          <Badge label={data.saved ? t.savedToHistory : t.notSaved} color={data.saved ? C.canopy600 : C.bark600} />
        </View>
      </Reveal>

      {data.isEmergency ? (
        <Reveal i={i++}>
          <View style={{ gap: 12 }}>
            <AlertCard tone="danger" title={t.emergencyTitle}>
              <Text style={{ color: "#7A241A" }} className="font-body text-sm leading-5">
                {EMERGENCY_MESSAGE}
                {lang === "hi" ? `\n\n${EMERGENCY_HI}` : ""}
              </Text>
            </AlertCard>
            <Button label={t.call112} variant="danger" size="lg" fullWidth icon={<Icon name="phone" size={18} color="#fff" />} onPress={() => Linking.openURL("tel:112").catch(() => {})} />
            {selfHarm ? (
              <AlertCard tone="info" title={t.helplineTitle}>
                {t.helpline}
              </AlertCard>
            ) : null}
            <AlertCard tone="warning">
              {lang === "hi"
                ? "इस स्थिति में हमने शैक्षिक जानकारी और पौधों के सुझाव जानबूझकर नहीं दिखाए हैं।"
                : "We have deliberately not shown educational tips or plant suggestions for this situation."}
            </AlertCard>
          </View>
        </Reveal>
      ) : (
        <>
          {/* Summary hero */}
          <Reveal i={i++}>
            <LinearGradient colors={[C.canopy800, C.canopy600]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 28, padding: 20, gap: 10 }}>
              <View className="flex-row items-center" style={{ gap: 8 }}>
                <Icon name="sparkle" size={16} color={C.canopy200} />
                <Text style={{ color: C.canopy200, letterSpacing: 0.6 }} className="font-body-semibold text-xs uppercase">
                  {t.resultEyebrow}
                </Text>
              </View>
              <Text className="font-display text-2xl text-white">{t.resultTitle}</Text>
              <Text style={{ color: "#F5ECD6", minHeight: 96 }} className="font-body text-base leading-6">
                {summary}
              </Text>
              <View className="flex-row flex-wrap" style={{ gap: 8, marginTop: 4 }}>
                <Badge label={lang === "hi" ? "निदान नहीं" : "Not a diagnosis"} color="#FFFFFF" bg="rgba(255,255,255,0.16)" />
                <Badge label={t.simulated} color="#F5D58A" bg="rgba(201,154,46,0.28)" />
              </View>
            </LinearGradient>
          </Reveal>

          {/* Transcript */}
          <Reveal i={i++}>
            <Card>
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center" style={{ gap: 8 }}>
                  <Icon name="video" size={16} />
                  <Text className="font-body-bold text-canopy-950">{t.transcript}</Text>
                </View>
                <Badge label={`${t.simulated} · ${lang.toUpperCase()}`} color={C.amber} />
              </View>
              <Text className="font-body text-sm text-canopy-900 leading-5" style={{ fontStyle: "italic" }}>
                {data.transcript}
              </Text>
            </Card>
          </Reveal>

          {/* General points */}
          <Reveal i={i++}>
            <Card>
              <Text className="font-display text-lg text-canopy-950 mb-3">{t.pointsTitle}</Text>
              <BulletList items={loc.points} />
            </Card>
          </Reveal>

          {/* Red flags */}
          <Reveal i={i++}>
            <AlertCard tone="warning" title={t.flagsTitle}>
              <View style={{ gap: 6, marginTop: 2 }}>
                {loc.flags.map((f) => (
                  <View key={f} className="flex-row" style={{ gap: 8 }}>
                    <Text style={{ color: "#7A5A16" }}>•</Text>
                    <Text style={{ color: "#7A5A16" }} className="flex-1 font-body text-sm leading-5">{f}</Text>
                  </View>
                ))}
              </View>
            </AlertCard>
          </Reveal>

          {/* Related plants */}
          {data.plantIds.length > 0 ? (
            <Reveal i={i++}>
              <View style={{ gap: 10 }}>
                <View>
                  <Text className="font-display text-xl text-canopy-950">{t.plantsTitle}</Text>
                  <Text className="font-body text-xs text-canopy-700/70">{t.plantsSub}</Text>
                </View>
                {data.plantIds.map((id) => (
                  <PlantMini key={id} plantId={id} lang={lang} saved={savedPlantIds.includes(id)} onToggle={() => onToggleSave(id)} />
                ))}
              </View>
            </Reveal>
          ) : null}

          {/* Questions */}
          <Reveal i={i++}>
            <Card className="bg-cream-100 border-bark-200">
              <Text className="font-display text-lg text-bark-700 mb-3">{t.qTitle}</Text>
              <BulletList items={loc.questions} color={C.bark600} />
            </Card>
          </Reveal>
        </>
      )}

      {/* Always-on safety */}
      <Reveal i={i++}>
        <AlertCard tone="danger" title={t.naturalTitle}>
          {t.natural}
        </AlertCard>
      </Reveal>

      <Reveal i={i++}>
        <Text className="font-body text-xs text-canopy-700/70 leading-5 text-center px-2">{VIDEO_FEATURE_DISCLAIMER}</Text>
      </Reveal>

      <Reveal i={i++}>
        <View className="flex-row" style={{ gap: 10 }}>
          <View className="flex-1">
            <Button label={t.shareBtn} variant="ghost" fullWidth icon={<Icon name="share" size={16} color={C.canopy700} />} onPress={shareSummary} />
          </View>
          <View className="flex-1">
            <Button label={t.newOne} fullWidth onPress={onNew} />
          </View>
        </View>
      </Reveal>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────
export default function HealthVideoScreen() {
  const { session } = useAuth();
  const appData = useAppData() as ReturnType<typeof useAppData> & {
    // Optional helpers — see INTEGRATION.md (5-line patch). Screen works without them.
    deleteVideoSubmission?: (id: string) => void;
    clearVideoSubmissions?: () => void;
  };
  const { savedPlantIds, toggleSavedPlant, videoSubmissions, addVideoSubmission } = appData;

  const scrollRef = useRef<ScrollView>(null);
  const mounted = useRef(true);
  const runToken = useRef(0);

  const [phase, setPhase] = useState<Phase>("compose");
  const [lang, setLang] = useState<Lang>("en");
  const [clip, setClip] = useState<Clip | null>(null);
  const [description, setDescription] = useState("");
  const [consent, setConsent] = useState(false);
  const [saveHistory, setSaveHistory] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [stage, setStage] = useState(0);
  const [uploadPct, setUploadPct] = useState(0);
  const [result, setResult] = useState<ResultData | null>(null);
  const [fatal, setFatal] = useState(false);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [confirmAll, setConfirmAll] = useState(false);

  const t = T[lang];
  const liveEmergency = useMemo(() => detectEmergency(description), [description]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      runToken.current += 1;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [phase]);

  // Fallback deletion: older context versions may not expose a delete helper; keep storage clean ourselves either way.
  useEffect(() => {
    if (hiddenIds.length === 0) return;
    writeJSON(STORAGE_KEYS.videoSubmissions, videoSubmissions.filter((v) => !hiddenIds.includes(v.id)));
  }, [videoSubmissions, hiddenIds]);

  const visibleHistory = useMemo(() => videoSubmissions.filter((v) => !hiddenIds.includes(v.id)), [videoSubmissions, hiddenIds]);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace("/"));

  // ── Pickers ──────────────────────────────────────────────────────────────
  const pickVideo = useCallback(
    async (source: "camera" | "library") => {
      setFormError(null);
      try {
        if (source === "camera") {
          const perm = await ImagePicker.requestCameraPermissionsAsync();
          if (!perm.granted) {
            setFormError(t.errCamera);
            return;
          }
        }
        const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ["videos"], videoMaxDuration: 60, quality: 1 };
        const res = source === "camera" ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
        if (res.canceled || !res.assets?.[0]) return;
        const a = res.assets[0];
        if (a.duration && a.duration > 61000) {
          setFormError(t.errTooLong);
          return;
        }
        if (a.fileSize && a.fileSize > 100 * 1024 * 1024) {
          setFormError(t.errTooBig);
          return;
        }
        setClip({ kind: "real", uri: a.uri, durationMs: a.duration ?? undefined, sizeBytes: a.fileSize ?? undefined, name: a.fileName ?? undefined });
      } catch {
        setFormError(t.errPicker);
      }
    },
    [t]
  );

  const applyScenario = (id: (typeof SCENARIOS)[number]["id"]) => {
    const s = SCENARIOS.find((x) => x.id === id);
    if (!s) return;
    setDescription(lang === "hi" ? s.hi : s.en);
    setFormError(null);
    if (!clip) setClip({ kind: "demo", seconds: 9 + Math.floor(Math.random() * 8) });
  };

  const startDemoClip = () => {
    setFormError(null);
    applyScenario("throat");
    setClip({ kind: "demo", seconds: 12 });
  };

  // ── Submit → simulated pipeline ──────────────────────────────────────────
  const submit = async () => {
    if (!consent) {
      setFormError(t.needConsent);
      return;
    }
    if (!clip && !description.trim()) {
      setFormError(t.needInput);
      return;
    }
    setFormError(null);
    setFatal(false);
    setPhase("processing");
    setStage(0);
    setUploadPct(0);

    const token = ++runToken.current;
    const alive = () => mounted.current && runToken.current === token;

    try {
      const step = clip?.kind === "real" ? 4 : 10;
      for (let p = 0; p <= 100; p += step) {
        if (!alive()) return;
        setUploadPct(Math.min(100, p));
        await sleep(55);
      }
      setUploadPct(100);
      for (let s = 1; s <= 4; s++) {
        if (!alive()) return;
        setStage(s);
        await sleep(650 + s * 110);
      }
      if (!alive()) return;
      setStage(5);
      await sleep(350);
      if (!alive()) return;

      const text = description.trim();
      const out = runHealthVideoPipeline(text, lang);
      const emergency = out.isEmergency || detectEmergency(text);
      const concern = classify(text);
      const plantIds = emergency ? [] : out.relatedPlantIds.length > 0 ? out.relatedPlantIds : concern.plantIds;

      if (saveHistory) {
        const record: Omit<HealthVideoSubmission, "id" | "createdAt"> = {
          userId: session?.email ?? session?.name ?? "guest",
          description: text || undefined,
          language: lang,
          mockTranscript: out.transcript,
          summary: emergency ? EMERGENCY_MESSAGE : out.summary,
          relatedPlantIds: plantIds,
          isEmergency: emergency,
        };
        addVideoSubmission(record);
      }

      setResult({
        transcript: out.transcript.replace(/^\[[^\]]*\]\n?/, ""),
        isEmergency: emergency,
        concern,
        plantIds,
        sourceText: text,
        createdAt: new Date().toISOString(),
        lang,
        animate: true,
        saved: saveHistory,
      });
      setPhase("result");
    } catch {
      if (!alive()) return;
      setFatal(true);
      setPhase("compose");
      setFormError(t.errPipeline);
    }
  };

  const cancelRun = () => {
    runToken.current += 1;
    setPhase("compose");
  };

  const resetAll = () => {
    setClip(null);
    setDescription("");
    setResult(null);
    setFormError(null);
    setPhase("compose");
  };

  const openFromHistory = (rec: HealthVideoSubmission) => {
    const text = rec.description ?? "";
    setLang(rec.language);
    setResult({
      transcript: rec.mockTranscript.replace(/^\[[^\]]*\]\n?/, ""),
      isEmergency: rec.isEmergency,
      concern: classify(text),
      plantIds: rec.relatedPlantIds,
      sourceText: text,
      createdAt: rec.createdAt,
      lang: rec.language,
      animate: false,
      saved: true,
    });
    setPhase("result");
  };

  const deleteOne = (id: string) => {
    if (appData.deleteVideoSubmission) appData.deleteVideoSubmission(id);
    else setHiddenIds((p) => [...p, id]);
  };

  const deleteAll = () => {
    if (!confirmAll) {
      setConfirmAll(true);
      setTimeout(() => mounted.current && setConfirmAll(false), 4000);
      return;
    }
    if (appData.clearVideoSubmissions) appData.clearVideoSubmissions();
    else {
      setHiddenIds(videoSubmissions.map((v) => v.id));
      writeJSON(STORAGE_KEYS.videoSubmissions, []);
    }
    setConfirmAll(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream50 }} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* Top bar */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-2">
          <Pressable
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel={t.back}
            hitSlop={10}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: C.canopy50, alignItems: "center", justifyContent: "center" }}
          >
            <Icon name="back" size={20} />
          </Pressable>
          <View className="flex-row items-center" style={{ gap: 6 }}>
            {(["en", "hi"] as Lang[]).map((l) => (
              <Pressable
                key={l}
                onPress={() => setLang(l)}
                accessibilityRole="button"
                accessibilityState={{ selected: lang === l }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: lang === l ? C.canopy600 : C.canopy50,
                }}
              >
                <Text className="font-body-semibold text-xs" style={{ color: lang === l ? "#fff" : C.canopy700 }}>
                  {l === "en" ? "EN" : "हिं"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 60 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* HERO */}
          {phase === "compose" ? (
            <LinearGradient colors={[C.canopy900, C.canopy700]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ marginHorizontal: 20, borderRadius: 30, padding: 22, overflow: "hidden" }}>
              <FloatingLeaf left="72%" top={14} delay={0} size={34} opacity={0.35} />
              <FloatingLeaf left="86%" top={70} delay={500} size={22} opacity={0.25} />
              <FloatingLeaf left="60%" top={96} delay={900} size={18} opacity={0.2} />
              <View className="flex-row items-center" style={{ gap: 8 }}>
                <Icon name="video" size={16} color={C.canopy200} />
                <Text style={{ color: C.canopy200, letterSpacing: 0.6 }} className="font-body-semibold text-xs uppercase">{t.eyebrow}</Text>
              </View>
              <Text className="font-display text-3xl text-white mt-3" style={{ lineHeight: 38 }}>{t.heroTitle}</Text>
              <Text style={{ color: "rgba(219,239,222,0.8)" }} className="font-body text-sm leading-5 mt-3">{t.heroBody}</Text>
              <View className="mt-4" style={{ alignSelf: "flex-start" }}>
                <WaveBars active count={26} height={30} />
              </View>
              <View className="flex-row flex-wrap mt-4" style={{ gap: 8 }}>
                <Badge label={t.protoChip} color="#F5D58A" bg="rgba(201,154,46,0.25)" />
              </View>
              <Text style={{ color: "rgba(219,239,222,0.55)" }} className="font-body text-[11px] mt-3">{VIDEO_FEATURE_LABEL}</Text>
            </LinearGradient>
          ) : null}

          <View className="px-5 mt-4" style={{ gap: 16 }}>
            {/* ── COMPOSE ─────────────────────────────────────────────── */}
            {phase === "compose" ? (
              <>
                {fatal ? <ErrorState title={t.errPipeline} /> : null}

                {/* Step 1 */}
                <Reveal i={0}>
                  <Card>
                    <StepHeader n={1} title={t.step1} sub={t.step1Sub} />
                    {clip ? (
                      <VideoPreview
                        clip={clip}
                        processing={false}
                        lang={lang}
                        onRemove={() => setClip(null)}
                        onReplace={() => pickVideo("library")}
                      />
                    ) : (
                      <View className="flex-row" style={{ gap: 10 }}>
                        <ActionTile icon="record" title={t.record} sub={t.recordSub} onPress={() => pickVideo("camera")} />
                        <ActionTile icon="upload" title={t.upload} sub={t.uploadSub} onPress={() => pickVideo("library")} />
                        <ActionTile icon="play" title={t.demo} sub={t.demoSub} accent onPress={startDemoClip} />
                      </View>
                    )}
                  </Card>
                </Reveal>

                {/* Step 2 */}
                <Reveal i={1}>
                  <Card>
                    <StepHeader n={2} title={t.step2} sub={t.step2Sub} />
                    <TextInput
                      value={description}
                      onChangeText={(v) => {
                        setDescription(v.slice(0, 500));
                        if (formError) setFormError(null);
                      }}
                      placeholder={t.placeholder}
                      placeholderTextColor="#8CB394"
                      multiline
                      textAlignVertical="top"
                      accessibilityLabel={t.step2}
                      style={{
                        minHeight: 104,
                        borderRadius: 18,
                        borderWidth: 1,
                        borderColor: liveEmergency ? C.red : C.canopy100,
                        backgroundColor: C.cream50,
                        padding: 14,
                        color: C.canopy950,
                        fontSize: 15,
                        lineHeight: 22,
                      }}
                    />
                    <Text className="text-right font-body text-[11px] text-canopy-700/60 mt-1">{description.length}/500</Text>

                    {liveEmergency ? (
                      <MotiView from={{ opacity: 0, translateY: 6 }} animate={{ opacity: 1, translateY: 0 }} className="mt-2">
                        <AlertCard tone="danger" title={t.emergencyLive}>
                          {EMERGENCY_MESSAGE}
                        </AlertCard>
                      </MotiView>
                    ) : null}

                    <View className="flex-row items-center mt-3" style={{ gap: 8 }}>
                      <Icon name="globe" size={16} />
                      <Text className="font-body-semibold text-sm text-canopy-800">{t.langLabel}</Text>
                    </View>
                    <View className="flex-row mt-2" style={{ gap: 8 }}>
                      {(["en", "hi"] as Lang[]).map((l) => (
                        <Pressable
                          key={l}
                          onPress={() => setLang(l)}
                          accessibilityRole="radio"
                          accessibilityState={{ selected: lang === l }}
                          style={{
                            flex: 1,
                            paddingVertical: 11,
                            borderRadius: 14,
                            alignItems: "center",
                            backgroundColor: lang === l ? C.canopy600 : C.canopy50,
                            borderWidth: 1,
                            borderColor: lang === l ? C.canopy600 : C.canopy100,
                          }}
                        >
                          <Text className="font-body-semibold text-sm" style={{ color: lang === l ? "#fff" : C.canopy700 }}>
                            {l === "en" ? "English" : "हिन्दी"}
                          </Text>
                        </Pressable>
                      ))}
                    </View>

                    <Text className="font-body-semibold text-xs text-canopy-700/70 mt-4 mb-2 uppercase" style={{ letterSpacing: 0.6 }}>
                      {t.examples}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                      {SCENARIOS.map((s) => (
                        <Pressable
                          key={s.id}
                          onPress={() => applyScenario(s.id)}
                          accessibilityRole="button"
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 999,
                            backgroundColor: s.id === "emergency" ? "#FBE9E6" : C.canopy50,
                            borderWidth: 1,
                            borderColor: s.id === "emergency" ? "#E19686" : C.canopy100,
                          }}
                        >
                          <Text>{s.emoji}</Text>
                          <Text className="font-body-medium text-xs" style={{ color: s.id === "emergency" ? "#7A241A" : C.canopy800 }}>
                            {t.scenarios[s.id]}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </Card>
                </Reveal>

                {/* Step 3 */}
                <Reveal i={2}>
                  <Card>
                    <StepHeader n={3} title={t.step3} sub={t.step3Sub} />
                    <ConsentRow value={consent} onChange={(v) => { setConsent(v); if (v) setFormError(null); }} label={t.consentProcess} strong />
                    <View style={{ height: 10 }} />
                    <ConsentRow value={saveHistory} onChange={setSaveHistory} label={t.consentSave} />

                    <View style={{ backgroundColor: C.canopy50, borderRadius: 16, padding: 12, marginTop: 14, gap: 6 }}>
                      <View className="flex-row items-center" style={{ gap: 8 }}>
                        <Icon name="lock" size={15} />
                        <Text className="font-body-bold text-xs text-canopy-800">{t.privacyTitle}</Text>
                      </View>
                      {t.privacy.map((p) => (
                        <Text key={p} className="font-body text-xs text-canopy-800/80 leading-4">
                          • {p}
                        </Text>
                      ))}
                    </View>
                  </Card>
                </Reveal>

                {formError ? (
                  <MotiView from={{ opacity: 0, translateY: 6 }} animate={{ opacity: 1, translateY: 0 }}>
                    <AlertCard tone="danger">{formError}</AlertCard>
                  </MotiView>
                ) : null}

                <Reveal i={3}>
                  <Button
                    label={t.submit}
                    size="lg"
                    fullWidth
                    onPress={submit}
                    icon={<Icon name="sparkle" size={18} color="#fff" />}
                  />
                </Reveal>

                {/* Tips carousel */}
                <Reveal i={4}>
                  <View>
                    <Text className="font-display text-xl text-canopy-950">{t.tipsTitle}</Text>
                    <Text className="font-body text-xs text-canopy-700/70 mb-3">{t.tipsSub}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 8 }}>
                      {TIPS.map((tip, idx) => (
                        <View
                          key={tip.en[0]}
                          style={{
                            width: 230,
                            borderRadius: 24,
                            padding: 16,
                            backgroundColor: idx % 2 === 0 ? C.cream100 : C.canopy50,
                            borderWidth: 1,
                            borderColor: idx % 2 === 0 ? C.bark200 : C.canopy100,
                            gap: 6,
                          }}
                        >
                          <Text className="font-display text-lg" style={{ color: idx % 2 === 0 ? C.bark700 : C.canopy800 }}>{tip[lang][0]}</Text>
                          <Text className="font-body text-sm leading-5" style={{ color: idx % 2 === 0 ? C.bark600 : C.canopy700 }}>{tip[lang][1]}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </Reveal>

                {/* History */}
                <Reveal i={5}>
                  <View>
                    <View className="flex-row items-end justify-between mb-3">
                      <View className="flex-1 pr-2">
                        <Text className="font-display text-xl text-canopy-950">{t.historyTitle}</Text>
                        <Text className="font-body text-xs text-canopy-700/70">{t.historySub}</Text>
                      </View>
                    </View>
                    {visibleHistory.length === 0 ? (
                      <Card>
                        <EmptyState title={t.historyEmpty} subtitle={t.historyEmptySub} />
                      </Card>
                    ) : (
                      <View style={{ gap: 10 }}>
                        {visibleHistory.slice(0, 8).map((rec) => (
                          <HistoryRow key={rec.id} rec={rec} lang={lang} onOpen={() => openFromHistory(rec)} onDelete={() => deleteOne(rec.id)} />
                        ))}
                        <Pressable
                          onPress={deleteAll}
                          accessibilityRole="button"
                          className="flex-row items-center justify-center"
                          style={{
                            gap: 8,
                            paddingVertical: 13,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: confirmAll ? C.red : "#E19686",
                            backgroundColor: confirmAll ? C.red : "#FBE9E6",
                          }}
                        >
                          <Icon name="trash" size={16} color={confirmAll ? "#fff" : C.red} />
                          <Text className="font-body-semibold text-sm" style={{ color: confirmAll ? "#fff" : C.red }}>
                            {confirmAll ? t.deleteConfirm : t.deleteAll}
                          </Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                </Reveal>
              </>
            ) : null}

            {/* ── PROCESSING ──────────────────────────────────────────── */}
            {phase === "processing" ? (
              <ProcessingPanel clip={clip} lang={lang} stage={stage} uploadPct={uploadPct} onCancel={cancelRun} />
            ) : null}

            {/* ── RESULT ──────────────────────────────────────────────── */}
            {phase === "result" && result ? (
              <ResultView data={result} savedPlantIds={savedPlantIds} onToggleSave={toggleSavedPlant} onNew={resetAll} />
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Little presentational pieces used by the screen
// ─────────────────────────────────────────────────────────────────────────────
function ActionTile({ icon, title, sub, onPress, accent }: { icon: IconName; title: string; sub: string; onPress: () => void; accent?: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={title} style={{ flex: 1 }}>
      {({ pressed }) => (
        <MotiView
          animate={{ scale: pressed ? 0.96 : 1 }}
          transition={{ type: "timing", duration: 100 }}
          style={{
            borderRadius: 20,
            paddingVertical: 16,
            paddingHorizontal: 8,
            alignItems: "center",
            gap: 8,
            backgroundColor: accent ? C.canopy600 : C.canopy50,
            borderWidth: 1,
            borderColor: accent ? C.canopy600 : C.canopy100,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: accent ? "rgba(255,255,255,0.18)" : "#fff",
            }}
          >
            <Icon name={icon} size={20} color={accent ? "#fff" : C.canopy600} />
          </View>
          <Text className="font-body-bold text-sm text-center" style={{ color: accent ? "#fff" : C.canopy900 }}>{title}</Text>
          <Text className="font-body text-[11px] text-center" style={{ color: accent ? "rgba(255,255,255,0.8)" : "rgba(34,86,47,0.7)" }} numberOfLines={2}>
            {sub}
          </Text>
        </MotiView>
      )}
    </Pressable>
  );
}

function ConsentRow({ value, onChange, label, strong }: { value: boolean; onChange: (v: boolean) => void; label: string; strong?: boolean }) {
  return (
    <Pressable onPress={() => onChange(!value)} accessibilityRole="switch" accessibilityState={{ checked: value }} className="flex-row items-start" style={{ gap: 12 }}>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: C.canopy100, true: C.canopy500 }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={C.canopy100}
      />
      <Text className={`flex-1 text-sm leading-5 ${strong ? "font-body-medium" : "font-body"} text-canopy-900`}>{label}</Text>
    </Pressable>
  );
}

function HistoryRow({ rec, lang, onOpen, onDelete }: { rec: HealthVideoSubmission; lang: Lang; onOpen: () => void; onDelete: () => void }) {
  const t = T[lang];
  const concern = classify(rec.description ?? "");
  const title = rec.isEmergency ? T[rec.language].emergencyTitle : concern[rec.language].label;
  return (
    <MotiView from={{ opacity: 0, translateX: -10 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: "timing", duration: 300 }}>
      <Card className="p-3">
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: rec.isEmergency ? "#FBE9E6" : C.canopy50,
            }}
          >
            <Icon name={rec.isEmergency ? "phone" : "leaf"} size={18} color={rec.isEmergency ? C.red : C.canopy600} />
          </View>
          <Pressable onPress={onOpen} accessibilityRole="button" className="flex-1">
            <Text className="font-body-semibold text-sm text-canopy-950 capitalize" numberOfLines={1}>{title}</Text>
            <View className="flex-row items-center" style={{ gap: 6, marginTop: 2 }}>
              <Icon name="clock" size={11} color="#5FAE70" />
              <Text className="font-body text-[11px] text-canopy-700/70">
                {fmtDate(rec.createdAt)} · {rec.language.toUpperCase()}
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={onOpen} accessibilityRole="button" hitSlop={8}>
            <Text className="font-body-semibold text-xs text-canopy-600">{t.view}</Text>
          </Pressable>
          <Pressable
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel={t.delete}
            hitSlop={8}
            style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: "#FBE9E6", alignItems: "center", justifyContent: "center" }}
          >
            <Icon name="trash" size={15} color={C.red} />
          </Pressable>
        </View>
      </Card>
    </MotiView>
  );
}
