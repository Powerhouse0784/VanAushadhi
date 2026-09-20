import type { PlantProfile } from "@/types";

const STD_ALLERGY =
  "May cause allergic reactions in sensitive individuals, including skin irritation or, rarely, more serious reactions. Discontinue use and seek care if a rash, swelling, or breathing difficulty occurs.";
const STD_CHILD =
  "Safety and appropriate use in children have not been well established for most preparations. Consult a pediatrician before giving to children.";

export const PLANTS: PlantProfile[] = [
  {
    id: "tulsi",
    commonName: "Tulsi (Holy Basil)",
    localName: "तुलसी",
    scientificName: "Ocimum tenuiflorum",
    category: "Herb",
    images: ["plant-tulsi-1"],
    identificationFeatures:
      "Small aromatic shrub, 30–60 cm tall, with green or purple-tinged oval leaves that release a strong clove-like scent when crushed, and small purple flower spikes.",
    habitat: "Native to the Indian subcontinent; widely cultivated in home courtyards and temple gardens across South and Southeast Asia.",
    climateAndSoil: "Prefers warm, humid climates and well-drained loamy soil; sensitive to waterlogging and frost.",
    sunlight: "Full sun to partial shade, at least 4–6 hours of direct light daily.",
    watering: "Moderate; water when the top inch of soil feels dry. Avoid letting it sit in standing water.",
    careInstructions: [
      "Pinch flowering tops regularly to encourage bushier growth.",
      "Grows well in pots — ensure drainage holes.",
      "Protect from frost and prolonged cold below 10°C.",
    ],
    environmentalBenefits: [
      "Attracts pollinators such as bees.",
      "Commonly grown as a low-maintenance companion plant in home gardens.",
      "Considered culturally significant and encourages home greenery.",
    ],
    partsUsed: ["Leaves", "Seeds (less commonly)"],
    traditionalUses: [
      "Traditionally used in South Asian households as a herbal tea for general wellness.",
      "Traditionally associated with respiratory comfort when used as a warm infusion.",
      "Used in traditional Ayurvedic practice as an adaptogen.",
    ],
    nutrition: "Contains volatile oils (eugenol), and trace vitamin C and antioxidants; typically consumed in small infused amounts, not as a food source.",
    evidenceLevel: "limited",
    preparationInfo:
      "Traditionally prepared as a hot water infusion using a few fresh or dried leaves, steeped for several minutes. Preparation practices vary by region and household.",
    sideEffects: [
      "May have mild blood-thinning or blood-sugar-lowering effects — relevant before surgery or with certain medicines.",
      "High doses have not been well studied for long-term safety.",
    ],
    allergyWarning: STD_ALLERGY,
    medicineInteractionWarning:
      "May interact with anticoagulant/antiplatelet medicines and diabetes medicines. Discuss with your doctor if you take blood thinners or blood-sugar medication.",
    pregnancyWarning:
      "Traditional sources advise caution during pregnancy in concentrated or medicinal amounts; culinary-level use in food is generally distinguished from concentrated extracts. Consult a healthcare professional.",
    childSafetyWarning: STD_CHILD,
    whenNotToUse: [
      "Before scheduled surgery (may affect bleeding/blood sugar).",
      "If already on anticoagulant or diabetes medication, without medical advice.",
    ],
    whenToConsult: [
      "If you are pregnant, breastfeeding, or managing a chronic condition.",
      "If symptoms you are trying to address persist beyond a few days.",
    ],
    relatedPlantIds: ["mint", "ashwagandha"],
  },
  {
    id: "neem",
    commonName: "Neem",
    localName: "नीम",
    scientificName: "Azadirachta indica",
    category: "Tree",
    images: ["plant-neem-1"],
    identificationFeatures:
      "Fast-growing evergreen tree with compound pinnate leaves, small white fragrant flowers, and small olive-like fruit; bark is rough and grey-brown.",
    habitat: "Native to the Indian subcontinent; thrives in tropical and semi-arid regions and is widely planted as a shade and avenue tree.",
    climateAndSoil: "Highly drought-tolerant; grows in a wide range of soils including poor, dry, and degraded land.",
    sunlight: "Full sun.",
    watering: "Low once established; deep occasional watering for young saplings.",
    careInstructions: [
      "Requires minimal care once established.",
      "Prune to shape when young; avoid heavy pruning of mature trees.",
      "Excellent for reforestation of degraded soil.",
    ],
    environmentalBenefits: [
      "Highly effective shade and avenue tree.",
      "Improves soil quality and supports afforestation of arid land.",
      "Leaves and extracts traditionally used as a natural pest deterrent in agriculture.",
    ],
    partsUsed: ["Leaves", "Bark", "Seed oil"],
    traditionalUses: [
      "Traditionally used topically in skin care preparations.",
      "Leaves traditionally used in bathwater for skin comfort.",
      "Neem oil traditionally used in agriculture as a natural pest repellent.",
    ],
    evidenceLevel: "limited",
    preparationInfo:
      "Topical traditional preparations include neem leaf paste or neem-infused water. Neem oil and seed extracts are for external/agricultural use only and are not meant for internal consumption.",
    sideEffects: [
      "Neem oil and seed extract are toxic if ingested, especially by children — this is not a food or oral remedy.",
      "May cause skin irritation in some individuals when applied topically.",
    ],
    allergyWarning: STD_ALLERGY,
    medicineInteractionWarning:
      "Oral use of neem preparations is not recommended without professional guidance, as it may interact with diabetes and immunosuppressant medicines.",
    pregnancyWarning:
      "Neem (especially oil and seed extracts) is traditionally avoided during pregnancy. Do not use internally if pregnant or breastfeeding.",
    childSafetyWarning:
      "Neem oil is documented to be harmful if ingested by infants and young children. Keep neem oil products away from children and never give internally.",
    whenNotToUse: [
      "Never ingest neem oil or seed extract — external/agricultural use only.",
      "Avoid internal use during pregnancy or breastfeeding.",
    ],
    whenToConsult: [
      "Before any internal/oral use of neem preparations.",
      "If skin irritation occurs after topical use.",
    ],
    relatedPlantIds: ["turmeric", "aloevera"],
  },
  {
    id: "aloevera",
    commonName: "Aloe Vera",
    localName: "घृतकुमारी",
    scientificName: "Aloe barbadensis miller",
    category: "Succulent",
    images: ["plant-aloevera-1"],
    identificationFeatures:
      "Rosette-forming succulent with thick, fleshy, serrated green leaves containing clear gel; occasionally produces tall yellow tubular flower spikes.",
    habitat: "Native to arid regions of the Arabian Peninsula; now cultivated worldwide as a houseplant and commercial crop.",
    climateAndSoil: "Thrives in warm, dry climates with sandy, well-draining soil.",
    sunlight: "Bright indirect to full sun.",
    watering: "Drought-tolerant; water deeply only when soil is fully dry, roughly every 2–3 weeks.",
    careInstructions: [
      "Avoid overwatering — root rot is the most common cause of death.",
      "Use a pot with drainage holes and a cactus/succulent mix.",
      "Can be propagated easily from offsets (\"pups\").",
    ],
    environmentalBenefits: [
      "Low water requirement makes it suitable for water-scarce home gardens.",
      "Popular, easy-care houseplant that improves indoor greenery.",
    ],
    partsUsed: ["Leaf gel", "Latex (yellow sap, typically discarded)"],
    traditionalUses: [
      "Gel is widely and traditionally applied topically to minor sunburns and skin dryness.",
      "Used in cosmetic and skincare products for moisturizing.",
    ],
    evidenceLevel: "limited",
    preparationInfo:
      "Fresh gel is typically scooped from a cut leaf and applied externally to skin. The outer yellow latex layer is traditionally removed, as it can be irritating.",
    sideEffects: [
      "Oral consumption of aloe latex/whole-leaf extract can cause cramping and diarrhea and is not advised without medical guidance.",
      "Topical use can occasionally cause contact dermatitis in sensitive skin.",
    ],
    allergyWarning: STD_ALLERGY,
    medicineInteractionWarning:
      "Oral aloe preparations may interact with diabetes medicines and diuretics. Topical gel use has minimal interaction risk for most people.",
    pregnancyWarning:
      "Oral aloe (especially latex) is traditionally avoided during pregnancy and breastfeeding. Topical gel is generally considered lower-risk, but check with a professional first.",
    childSafetyWarning: STD_CHILD,
    whenNotToUse: [
      "Do not take oral aloe latex without medical supervision.",
      "Avoid on open wounds or broken skin without professional advice.",
    ],
    whenToConsult: [
      "Before any oral use of aloe products.",
      "If a skin reaction occurs after topical application.",
    ],
    relatedPlantIds: ["neem", "turmeric"],
  },
  {
    id: "ginger",
    commonName: "Ginger",
    localName: "अदरक",
    scientificName: "Zingiber officinale",
    category: "Rhizome / Spice",
    images: ["plant-ginger-1"],
    identificationFeatures:
      "Herbaceous perennial with narrow lance-shaped leaves growing from an underground knobby, aromatic rhizome; rarely flowers in cultivation.",
    habitat: "Native to Southeast Asia; cultivated widely across tropical regions including India, which is among the world's largest producers.",
    climateAndSoil: "Warm, humid climate with rich, well-drained loamy soil, partial shade.",
    sunlight: "Partial shade to filtered sunlight.",
    watering: "Regular watering, keeping soil consistently moist but not waterlogged.",
    careInstructions: [
      "Grow from a healthy rhizome piece with visible \"eyes\".",
      "Harvest rhizomes after 8–10 months.",
      "Mulch to retain soil moisture.",
    ],
    environmentalBenefits: [
      "A staple companion crop in kitchen gardens.",
      "Supports crop diversity in home and small-scale farming.",
    ],
    partsUsed: ["Rhizome (root)"],
    traditionalUses: [
      "Widely used as a culinary spice across cuisines.",
      "Traditionally used in warm teas for digestive comfort and general wellness.",
      "Commonly associated with easing mild nausea in traditional practice.",
    ],
    nutrition: "Contains gingerol compounds, small amounts of vitamin C, magnesium, and potassium; used in small culinary quantities.",
    evidenceLevel: "limited",
    preparationInfo:
      "Commonly prepared as fresh or dried tea, or used as a cooking spice. Traditional amounts are small (a few grams of fresh root per cup).",
    sideEffects: [
      "Large amounts may cause heartburn, mouth irritation, or stomach discomfort.",
      "May have mild blood-thinning effects at high doses.",
    ],
    allergyWarning: STD_ALLERGY,
    medicineInteractionWarning:
      "May interact with anticoagulant medicines and diabetes medicines at higher-than-culinary doses. Discuss with a doctor if on blood thinners.",
    pregnancyWarning:
      "Small culinary amounts are widely consumed traditionally; concentrated supplements during pregnancy should only be used after consulting a healthcare professional.",
    childSafetyWarning: STD_CHILD,
    whenNotToUse: [
      "In place of medical care for persistent vomiting or severe nausea.",
      "In concentrated supplement form before surgery.",
    ],
    whenToConsult: [
      "If nausea, digestive discomfort, or related symptoms persist beyond a few days.",
      "Before using concentrated ginger supplements during pregnancy.",
    ],
    relatedPlantIds: ["turmeric", "mint"],
  },
  {
    id: "turmeric",
    commonName: "Turmeric",
    localName: "हल्दी",
    scientificName: "Curcuma longa",
    category: "Rhizome / Spice",
    images: ["plant-turmeric-1"],
    identificationFeatures:
      "Herbaceous perennial with large lance-shaped leaves and an underground bright orange rhizome; produces pale yellow-white flower spikes.",
    habitat: "Native to South Asia; extensively cultivated in India, particularly in tropical and subtropical regions.",
    climateAndSoil: "Warm, humid climate with well-drained, fertile loamy soil.",
    sunlight: "Partial shade to full sun.",
    watering: "Regular watering; consistently moist soil during the growing season, reduced before harvest.",
    careInstructions: [
      "Plant rhizome pieces with buds in warm soil.",
      "Harvest after 8–10 months when leaves yellow and dry.",
      "Store harvested rhizomes in a cool, dry place.",
    ],
    environmentalBenefits: [
      "Common intercrop supporting soil biodiversity.",
      "Traditionally grown alongside other spices in kitchen gardens.",
    ],
    partsUsed: ["Rhizome (root)"],
    traditionalUses: [
      "Central spice in South Asian cuisine.",
      "Traditionally applied as a paste for minor skin blemishes.",
      "Traditionally consumed in warm milk for general wellness (\"haldi doodh\").",
    ],
    nutrition: "Contains curcumin, the main active compound studied for its properties; typically consumed in small culinary quantities.",
    evidenceLevel: "limited",
    preparationInfo:
      "Used fresh or as dried powder in cooking, or mixed into warm milk/water. Curcumin has low natural absorption, which is why traditional preparations are often combined with black pepper or fat.",
    sideEffects: [
      "High-dose supplements may cause stomach upset.",
      "May have mild blood-thinning effects at concentrated doses.",
    ],
    allergyWarning: STD_ALLERGY,
    medicineInteractionWarning:
      "Concentrated turmeric/curcumin supplements may interact with blood thinners, diabetes medicines, and some gallbladder conditions. Culinary use is generally distinguished from supplement-level doses.",
    pregnancyWarning:
      "Culinary use in food is common traditionally; concentrated supplements during pregnancy should be discussed with a healthcare professional first.",
    childSafetyWarning: STD_CHILD,
    whenNotToUse: [
      "As a substitute for prescribed anti-inflammatory or diabetes treatment.",
      "In concentrated supplement form if you have gallstones, without medical advice.",
    ],
    whenToConsult: [
      "Before using concentrated turmeric/curcumin supplements alongside prescribed medication.",
      "If a skin reaction occurs after topical paste application.",
    ],
    relatedPlantIds: ["ginger", "neem"],
  },
  {
    id: "mint",
    commonName: "Mint (Pudina)",
    localName: "पुदीना",
    scientificName: "Mentha spicata / Mentha arvensis",
    category: "Herb",
    images: ["plant-mint-1"],
    identificationFeatures:
      "Fast-spreading aromatic herb with square stems and bright green serrated leaves that release a cooling, sharp scent when crushed.",
    habitat: "Grows across temperate and subtropical regions worldwide; a common kitchen-garden herb in South Asia.",
    climateAndSoil: "Prefers moist, rich soil; tolerates partial shade well.",
    sunlight: "Partial shade to full sun.",
    watering: "Keep soil consistently moist; mint does not tolerate prolonged dryness.",
    careInstructions: [
      "Grow in a contained pot — mint spreads aggressively via runners.",
      "Trim regularly to encourage bushy growth and prevent legginess.",
      "Easily propagated from stem cuttings in water.",
    ],
    environmentalBenefits: [
      "Attracts beneficial pollinators.",
      "Natural companion plant said to deter some pests in kitchen gardens.",
    ],
    partsUsed: ["Leaves"],
    traditionalUses: [
      "Widely used fresh in cooking, chutneys, and beverages.",
      "Traditionally used as a tea for digestive comfort after meals.",
      "Traditionally used for a cooling sensation to ease minor throat discomfort.",
    ],
    nutrition: "Contains menthol and small amounts of vitamin A and antioxidants; used in small culinary quantities.",
    evidenceLevel: "limited",
    preparationInfo:
      "Commonly prepared as a fresh-leaf infusion (tea) or used raw in food. Menthol-rich mint oil is a different, more concentrated product and is used separately.",
    sideEffects: [
      "Concentrated mint/menthol oil can irritate skin and mucous membranes and is not the same as culinary mint leaf.",
      "May worsen acid reflux in some individuals.",
    ],
    allergyWarning: STD_ALLERGY,
    medicineInteractionWarning:
      "Culinary use has minimal interaction risk; concentrated peppermint oil may interact with certain reflux medications.",
    pregnancyWarning:
      "Culinary-level mint tea is commonly consumed traditionally; concentrated oils/extracts should be discussed with a healthcare professional.",
    childSafetyWarning:
      "Menthol/mint oil (not mint leaf tea) should not be applied to the face of infants and young children, as it has been associated with breathing difficulty in this age group. Consult a pediatrician.",
    whenNotToUse: [
      "Concentrated mint oil near the nose/face of infants.",
      "As a substitute for care if reflux or throat symptoms are severe or persistent.",
    ],
    whenToConsult: [
      "If digestive or throat symptoms persist beyond a few days.",
      "Before using concentrated mint oil products on or around children.",
    ],
    relatedPlantIds: ["tulsi", "ginger"],
  },
  {
    id: "amla",
    commonName: "Amla (Indian Gooseberry)",
    localName: "आंवला",
    scientificName: "Phyllanthus emblica",
    category: "Fruit tree",
    images: ["plant-amla-1"],
    identificationFeatures:
      "Medium-sized deciduous tree with feathery pinnate leaves and small, round, pale green-yellow fruit with a sour-astringent taste.",
    habitat: "Native to the Indian subcontinent; grows in tropical and subtropical mixed deciduous forests.",
    climateAndSoil: "Tolerates a wide range of soils, including poor and dry soils; prefers a tropical to subtropical climate.",
    sunlight: "Full sun.",
    watering: "Moderate; drought-tolerant once established, benefits from regular watering while young.",
    careInstructions: [
      "Requires minimal maintenance once established.",
      "Prune dead or crowded branches after fruiting season.",
      "Fruits typically ready for harvest in winter months.",
    ],
    environmentalBenefits: [
      "Hardy tree suitable for afforestation of degraded or dry land.",
      "Provides shade and supports local biodiversity.",
    ],
    partsUsed: ["Fruit"],
    traditionalUses: [
      "Widely consumed fresh, dried, or as pickles and preserves.",
      "Traditionally valued in Ayurveda as a vitamin-C-rich fruit for general wellness.",
      "Traditionally used in hair-care oils and preparations.",
    ],
    nutrition: "One of the richest natural sources of vitamin C among fruits, along with antioxidants and dietary fiber.",
    evidenceLevel: "limited",
    preparationInfo:
      "Eaten fresh, dried, juiced, or as murabba (preserve) and pickle. Amounts vary widely by traditional recipe and personal taste.",
    sideEffects: [
      "Large quantities may cause stomach acidity or discomfort in sensitive individuals.",
    ],
    allergyWarning: STD_ALLERGY,
    medicineInteractionWarning:
      "May have mild blood-sugar and blood-thinning effects at concentrated (supplement) doses; food-level fruit consumption is generally lower risk.",
    pregnancyWarning:
      "Commonly eaten as food during pregnancy in many households; concentrated supplements should be discussed with a healthcare professional.",
    childSafetyWarning: STD_CHILD,
    whenNotToUse: [
      "As a substitute for prescribed vitamin C or medical nutrition therapy.",
    ],
    whenToConsult: [
      "Before taking concentrated amla supplements alongside diabetes or blood-thinning medication.",
    ],
    relatedPlantIds: ["guava", "pomegranate"],
  },
  {
    id: "guava",
    commonName: "Guava",
    localName: "अमरूद",
    scientificName: "Psidium guajava",
    category: "Fruit tree",
    images: ["plant-guava-1"],
    identificationFeatures:
      "Small evergreen tree with smooth, mottled greenish-brown bark, oval leaves, white flowers, and round-to-oval green-to-yellow fruit.",
    habitat: "Native to Central America, now naturalized and widely cultivated across South Asia, including India.",
    climateAndSoil: "Tolerates a wide range of soils; prefers a tropical to subtropical climate with moderate rainfall.",
    sunlight: "Full sun.",
    watering: "Moderate and regular, especially during fruit development; drought-tolerant once mature.",
    careInstructions: [
      "Prune annually to encourage fruiting branches.",
      "Mulch around the base to retain soil moisture.",
      "Watch for fruit flies during ripening season.",
    ],
    environmentalBenefits: [
      "Fast-growing fruit tree suitable for home orchards and community plantation drives.",
      "Provides food and habitat for birds.",
    ],
    partsUsed: ["Fruit", "Leaves (traditionally, as tea)"],
    traditionalUses: [
      "Fruit widely eaten fresh or in juices.",
      "Leaf tea traditionally used for digestive comfort in some regional practices.",
    ],
    nutrition: "Rich in vitamin C, dietary fiber, and antioxidants.",
    evidenceLevel: "limited",
    preparationInfo:
      "Fruit eaten fresh or juiced; leaves traditionally boiled to make a tea, typically a small handful of leaves per cup of water.",
    sideEffects: [
      "Unripe fruit may cause digestive discomfort in some individuals.",
    ],
    allergyWarning: STD_ALLERGY,
    medicineInteractionWarning:
      "Leaf tea may have mild blood-sugar-lowering effects — relevant if on diabetes medication.",
    pregnancyWarning: "Fruit is commonly eaten as food during pregnancy; leaf tea/extracts should be discussed with a healthcare professional first.",
    childSafetyWarning: STD_CHILD,
    whenNotToUse: ["As a substitute for prescribed diabetes management."],
    whenToConsult: ["If on diabetes medication and considering regular guava leaf tea."],
    relatedPlantIds: ["amla", "pomegranate"],
  },
  {
    id: "pomegranate",
    commonName: "Pomegranate",
    localName: "अनार",
    scientificName: "Punica granatum",
    category: "Fruit tree / shrub",
    images: ["plant-pomegranate-1"],
    identificationFeatures:
      "Deciduous shrub or small tree with narrow glossy leaves, bright red-orange tubular flowers, and round fruit with a leathery red rind full of juicy seed clusters (arils).",
    habitat: "Native to the region spanning Iran to northern India; widely cultivated in semi-arid regions.",
    climateAndSoil: "Thrives in semi-arid, hot climates with well-drained soil; tolerates drought once established.",
    sunlight: "Full sun.",
    watering: "Moderate; deep watering during flowering and fruit set, reduced watering as fruit matures to prevent splitting.",
    careInstructions: [
      "Prune to remove suckers and shape the canopy.",
      "Fruit typically matures 5–7 months after flowering.",
      "Tolerates poor soil but yields best in fertile, well-drained conditions.",
    ],
    environmentalBenefits: [
      "Drought-hardy species suitable for water-scarce plantation zones.",
      "Attracts pollinators during flowering season.",
    ],
    partsUsed: ["Fruit (arils and juice)"],
    traditionalUses: [
      "Fruit and juice widely consumed as food.",
      "Traditionally regarded as a nutritious fruit for general wellness in many cultures.",
    ],
    nutrition: "Rich in vitamin C, dietary fiber, and antioxidant compounds called punicalagins.",
    evidenceLevel: "limited",
    preparationInfo: "Eaten fresh as arils or consumed as juice; no special preparation required.",
    sideEffects: ["Juice in large quantities may interact with certain medications (see below)."],
    allergyWarning: STD_ALLERGY,
    medicineInteractionWarning:
      "Pomegranate juice can interact with certain blood pressure and cholesterol medications by affecting how the liver processes them. Check with a doctor or pharmacist if on such medication.",
    pregnancyWarning: "Commonly eaten as food during pregnancy; no special concerns for normal dietary amounts.",
    childSafetyWarning: STD_CHILD,
    whenNotToUse: ["Large quantities of juice alongside medications metabolized by the liver, without checking for interactions."],
    whenToConsult: ["If you take blood pressure, cholesterol, or blood-thinning medication and consume pomegranate juice regularly."],
    relatedPlantIds: ["amla", "guava"],
  },
  {
    id: "garlic",
    commonName: "Garlic",
    localName: "लहसुन",
    scientificName: "Allium sativum",
    category: "Bulb / Spice",
    images: ["plant-garlic-1"],
    identificationFeatures:
      "Bulbous herb with flat, narrow grey-green leaves growing from an underground bulb composed of multiple cloves wrapped in papery skin.",
    habitat: "Believed native to Central Asia; cultivated globally as a kitchen staple.",
    climateAndSoil: "Prefers cool growing periods with well-drained, fertile soil.",
    sunlight: "Full sun.",
    watering: "Moderate; reduce watering as bulbs mature before harvest.",
    careInstructions: [
      "Plant individual cloves pointed-end up.",
      "Harvest when the lower leaves begin to yellow and dry.",
      "Cure harvested bulbs in a dry, airy space before storage.",
    ],
    environmentalBenefits: [
      "Common companion crop, traditionally believed to deter some garden pests.",
      "Easy to grow in home kitchen gardens.",
    ],
    partsUsed: ["Bulb (cloves)"],
    traditionalUses: [
      "Fundamental culinary ingredient across many cuisines.",
      "Traditionally used in home remedies for general wellness during cold weather.",
    ],
    nutrition: "Contains allicin (formed when crushed), along with manganese, vitamin B6, and vitamin C in small culinary amounts.",
    evidenceLevel: "limited",
    preparationInfo: "Used raw, crushed, or cooked in food. Traditional home remedies use small amounts (1–2 cloves).",
    sideEffects: [
      "Raw garlic in large amounts may cause heartburn, body odor, or digestive upset.",
      "Has notable blood-thinning properties at higher-than-culinary amounts.",
    ],
    allergyWarning: STD_ALLERGY,
    medicineInteractionWarning:
      "Garlic (especially concentrated supplements) can interact significantly with blood thinners, HIV medications, and some blood pressure medicines. Important to disclose regular garlic supplement use to your doctor before any surgery.",
    pregnancyWarning: "Culinary amounts are widely consumed traditionally; concentrated garlic supplements during pregnancy should be discussed with a healthcare professional.",
    childSafetyWarning: STD_CHILD,
    whenNotToUse: [
      "Concentrated garlic supplements before scheduled surgery, without informing your doctor.",
      "As a substitute for prescribed antibiotic or cardiovascular treatment.",
    ],
    whenToConsult: ["Before starting concentrated garlic supplements if you take blood thinners or blood pressure medication."],
    relatedPlantIds: ["ginger", "turmeric"],
  },
  {
    id: "cinnamon",
    commonName: "Cinnamon",
    localName: "दालचीनी",
    scientificName: "Cinnamomum verum / Cinnamomum cassia",
    category: "Bark / Spice",
    images: ["plant-cinnamon-1"],
    identificationFeatures:
      "Evergreen tree with aromatic bark that is peeled, dried, and curled into the familiar quill-shaped spice; glossy oval leaves with a spicy scent.",
    habitat: "\"True\" cinnamon is native to Sri Lanka and southern India; cassia cinnamon is native to China and Southeast Asia.",
    climateAndSoil: "Tropical climate with well-drained, sandy loam soil.",
    sunlight: "Partial shade to full sun.",
    watering: "Regular watering; young trees need consistent moisture.",
    careInstructions: [
      "Bark is typically harvested from 2-year-old shoots.",
      "Grows best in humid, tropical lowland conditions.",
    ],
    environmentalBenefits: ["Supports agroforestry systems in tropical regions."],
    partsUsed: ["Bark"],
    traditionalUses: [
      "Widely used as a culinary spice in sweet and savory dishes.",
      "Traditionally added to warm beverages for general wellness in cold weather.",
    ],
    nutrition: "Contains cinnamaldehyde and coumarin (higher in cassia variety); used in small culinary quantities.",
    evidenceLevel: "limited",
    preparationInfo: "Used as ground powder or whole bark sticks in cooking and beverages, typically less than a teaspoon per serving.",
    sideEffects: [
      "Cassia cinnamon (the common supermarket variety) contains coumarin, which in large regular amounts may affect liver function.",
      "May have blood-sugar-lowering effects at concentrated doses.",
    ],
    allergyWarning: STD_ALLERGY,
    medicineInteractionWarning: "Concentrated cinnamon supplements may interact with diabetes and liver-metabolized medications.",
    pregnancyWarning: "Culinary amounts are considered common practice; concentrated supplements should be discussed with a healthcare professional.",
    childSafetyWarning: STD_CHILD,
    whenNotToUse: ["As a substitute for prescribed diabetes treatment.", "In large regular supplement amounts if you have liver concerns, without medical advice."],
    whenToConsult: ["If you take diabetes medication and are considering regular cinnamon supplements."],
    relatedPlantIds: ["ginger", "turmeric"],
  },
  {
    id: "moringa",
    commonName: "Moringa (Drumstick Tree)",
    localName: "सहजन",
    scientificName: "Moringa oleifera",
    category: "Tree",
    images: ["plant-moringa-1"],
    identificationFeatures:
      "Fast-growing slender tree with feathery compound leaves, fragrant white flowers, and long, ridged, drumstick-shaped seed pods.",
    habitat: "Native to the sub-Himalayan regions of India; now cultivated across tropical and subtropical regions worldwide.",
    climateAndSoil: "Highly drought-tolerant, thrives in poor, well-drained soils.",
    sunlight: "Full sun.",
    watering: "Low once established; young plants benefit from regular watering.",
    careInstructions: [
      "Extremely fast-growing — can reach several metres in the first year.",
      "Prune regularly to keep leaves within easy harvesting reach.",
      "Pods and leaves are harvested at different growth stages.",
    ],
    environmentalBenefits: [
      "One of the most nutrient-dense, fast-growing trees suited to reforestation and food-security programs.",
      "Improves soil quality and tolerates degraded land well.",
    ],
    partsUsed: ["Leaves", "Pods (\"drumsticks\")", "Seeds"],
    traditionalUses: [
      "Leaves and pods widely used as a nutritious vegetable in South Asian cuisine.",
      "Traditionally valued as a nutrient-rich food source in nutrition programs.",
    ],
    nutrition: "Leaves are notably rich in vitamin A, vitamin C, calcium, iron, and protein relative to many leafy vegetables.",
    evidenceLevel: "limited",
    preparationInfo: "Leaves cooked as a vegetable or dried into powder; pods cooked in curries. Used as a food, not a medicine, in most households.",
    sideEffects: ["Root and root bark (different from leaf/pod) are traditionally avoided as they contain compounds with different, more concerning effects — only leaves and pods should be used as food."],
    allergyWarning: STD_ALLERGY,
    medicineInteractionWarning: "May have mild blood-sugar and blood-pressure-lowering effects at concentrated supplement doses — relevant if on related medication.",
    pregnancyWarning: "Leaves and pods are commonly eaten as food in many pregnancies; root and root-bark preparations are traditionally avoided during pregnancy. Consult a healthcare professional.",
    childSafetyWarning: STD_CHILD,
    whenNotToUse: ["Root or root-bark preparations — not established as food-safe.", "As a substitute for prescribed nutrition or diabetes therapy."],
    whenToConsult: ["Before using concentrated moringa leaf supplements if on blood pressure or diabetes medication."],
    relatedPlantIds: ["curryleaves", "amla"],
  },
  {
    id: "lemon",
    commonName: "Lemon",
    localName: "नींबू",
    scientificName: "Citrus limon",
    category: "Fruit tree",
    images: ["plant-lemon-1"],
    identificationFeatures:
      "Small evergreen tree with glossy oval leaves, fragrant white-purple-tinged flowers, and bright yellow oval citrus fruit.",
    habitat: "Believed native to South Asia; cultivated worldwide in subtropical and Mediterranean-type climates.",
    climateAndSoil: "Prefers well-drained, slightly acidic soil and a frost-free subtropical climate.",
    sunlight: "Full sun.",
    watering: "Regular, consistent watering; avoid waterlogging around roots.",
    careInstructions: [
      "Feed with citrus-appropriate fertilizer during growing season.",
      "Protect from frost.",
      "Prune to remove dead wood and improve air circulation.",
    ],
    environmentalBenefits: ["Common home-garden fruit tree that supports pollinators during flowering."],
    partsUsed: ["Fruit (juice and peel)"],
    traditionalUses: [
      "Juice widely used in cooking and beverages.",
      "Traditionally added to warm water, sometimes with honey, as part of morning routines.",
    ],
    nutrition: "Good source of vitamin C and citric acid.",
    evidenceLevel: "limited",
    preparationInfo: "Juice squeezed fresh and typically diluted in water; peel occasionally used zested in cooking.",
    sideEffects: ["Undiluted juice may irritate the mouth/throat lining or erode tooth enamel with frequent use."],
    allergyWarning: STD_ALLERGY,
    medicineInteractionWarning: "Citrus fruits, including lemon in large quantities, can occasionally interact with certain medications — check with a pharmacist if you take multiple regular medicines.",
    pregnancyWarning: "Commonly consumed as food during pregnancy in normal dietary amounts.",
    childSafetyWarning: STD_CHILD,
    whenNotToUse: ["As a replacement for prescribed vitamin C therapy or dental care advice."],
    whenToConsult: ["If frequent citrus consumption is causing digestive discomfort or dental sensitivity."],
    relatedPlantIds: ["amla", "mint"],
  },
  {
    id: "curryleaves",
    commonName: "Curry Leaves",
    localName: "करी पत्ता",
    scientificName: "Murraya koenigii",
    category: "Herb / Small tree",
    images: ["plant-curryleaves-1"],
    identificationFeatures:
      "Small aromatic tree or shrub with compound leaves made of small glossy leaflets that release a distinctive curry-like aroma when crushed; small white flowers and small black berries.",
    habitat: "Native to the Indian subcontinent; widely grown in home gardens across South Asia.",
    climateAndSoil: "Prefers warm, humid climates and well-drained fertile soil.",
    sunlight: "Full sun to partial shade.",
    watering: "Moderate; keep soil moist but not waterlogged.",
    careInstructions: [
      "Prune regularly to encourage bushy, leafy growth.",
      "Sensitive to frost and prolonged cold.",
      "Grows well in large pots.",
    ],
    environmentalBenefits: ["Common, low-maintenance kitchen-garden plant that supports pollinators when flowering."],
    partsUsed: ["Leaves"],
    traditionalUses: [
      "Essential flavoring leaf in South Indian and broader South Asian cooking.",
      "Traditionally believed to support digestion when used regularly in cooking.",
    ],
    nutrition: "Contains small amounts of iron and antioxidant compounds; used as a flavoring leaf rather than a bulk food.",
    evidenceLevel: "traditional_only",
    preparationInfo: "Used fresh, tempered in hot oil at the start of cooking, or occasionally dried.",
    sideEffects: ["Generally well tolerated in normal culinary amounts; concentrated extracts are not well studied."],
    allergyWarning: STD_ALLERGY,
    medicineInteractionWarning: "No well-documented major interactions at culinary amounts; concentrated extract use should be discussed with a professional.",
    pregnancyWarning: "Commonly used as a cooking ingredient during pregnancy in normal culinary amounts.",
    childSafetyWarning: STD_CHILD,
    whenNotToUse: ["Concentrated extract or supplement form without professional guidance — not well studied."],
    whenToConsult: ["If considering concentrated curry leaf supplements rather than culinary use."],
    relatedPlantIds: ["moringa", "mint"],
  },
  {
    id: "ashwagandha",
    commonName: "Ashwagandha",
    localName: "अश्वगंधा",
    scientificName: "Withania somnifera",
    category: "Herb / Shrub",
    images: ["plant-ashwagandha-1"],
    identificationFeatures:
      "Small woody shrub with velvety oval leaves, small greenish-yellow flowers, and orange-red berries enclosed in a papery husk; the root is the primary traditional part used.",
    habitat: "Native to India, the Middle East, and parts of Africa; grows in dry, stony, subtropical regions.",
    climateAndSoil: "Prefers dry climates and well-drained sandy or loamy soil; drought-tolerant.",
    sunlight: "Full sun.",
    watering: "Low; drought-tolerant once established.",
    careInstructions: [
      "Requires minimal watering once established.",
      "Roots are typically harvested after about a year of growth.",
      "Tolerates poor, dry soils well.",
    ],
    environmentalBenefits: ["Hardy, low-water shrub suitable for dry-climate home gardens."],
    partsUsed: ["Root (primarily)", "Leaves (less commonly)"],
    traditionalUses: [
      "Traditionally used in Ayurvedic practice as an adaptogen for general wellness and stress resilience.",
      "Traditionally associated with supporting sleep and vitality.",
    ],
    evidenceLevel: "limited",
    preparationInfo: "Traditionally prepared as a powder mixed with warm milk or water; commercial capsules and extracts are also available and vary widely in concentration.",
    sideEffects: [
      "May cause stomach upset, drowsiness, or diarrhea in some individuals.",
      "Has been associated with rare cases of liver effects in supplement form — an important reason to source responsibly and use as directed.",
    ],
    allergyWarning: STD_ALLERGY,
    medicineInteractionWarning:
      "May interact with thyroid medication, sedatives, immunosuppressants, and diabetes medicines. Important to disclose use to your doctor if you take any of these.",
    pregnancyWarning: "Traditionally advised against during pregnancy and breastfeeding. Avoid unless specifically advised by a qualified healthcare professional.",
    childSafetyWarning: STD_CHILD,
    whenNotToUse: [
      "During pregnancy or breastfeeding.",
      "If you have a thyroid condition or autoimmune condition, without medical advice.",
      "Alongside sedative medication, without medical advice.",
    ],
    whenToConsult: [
      "Before starting ashwagandha if you take thyroid, sedative, or immunosuppressant medication.",
      "If you notice unusual fatigue, nausea, or yellowing of skin/eyes while using any herbal supplement — seek care promptly.",
    ],
    relatedPlantIds: ["tulsi", "moringa"],
  },
];

export function getPlantById(id: string): PlantProfile | undefined {
  return PLANTS.find((p) => p.id === id);
}
