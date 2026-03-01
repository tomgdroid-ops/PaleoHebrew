/**
 * Add word-form overrides to word-glosses.json.
 * Fixes ambiguous consonantal lookups and adds inflected forms.
 */
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.resolve(__dirname, '..', 'data', 'word-glosses.json');
const g = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

const WORD_OVERRIDES = {
  // Genesis 1 critical words
  "חשכ": { id: "H2822", gloss: "darkness", translit: "choshek" },
  "רוח": { id: "H7307", gloss: "spirit, wind", translit: "ruach" },
  "פנ": { id: "H6440", gloss: "face", translit: "panim" },
  "פני": { id: "H6440", gloss: "face of", translit: "peney" },
  "אור": { id: "H0216", gloss: "light", translit: "or" },
  "טוב": { id: "H2896", gloss: "good", translit: "tov" },
  "מרחפת": { id: "H7363", gloss: "hovering", translit: "merachefet" },
  "ראשית": { id: "H7225", gloss: "beginning", translit: "reshit" },
  "ראש": { id: "H7218", gloss: "head", translit: "rosh" },
  // Common verb forms not in byWord
  "יאמר": { id: "H0559", gloss: "said", translit: "yomer" },
  "יהי": { id: "H1961", gloss: "let there be", translit: "yehi" },
  "ירא": { id: "H7200", gloss: "see", translit: "yar" },
  "יעש": { id: "H6213", gloss: "made", translit: "yaas" },
  "יקרא": { id: "H7121", gloss: "called", translit: "yiqra" },
  "יבדל": { id: "H0914", gloss: "divided", translit: "yavdel" },
  "יתנ": { id: "H5414", gloss: "set, placed", translit: "yiten" },
  "יברכ": { id: "H1288", gloss: "blessed", translit: "yevarekh" },
  "יברא": { id: "H1254", gloss: "created", translit: "yivra" },
  "היתה": { id: "H1961", gloss: "was", translit: "haytah" },
  "היה": { id: "H1961", gloss: "was, be", translit: "hayah" },
  // Key nouns
  "שמימ": { id: "H8064", gloss: "heavens", translit: "shamayim" },
  "ארצ": { id: "H0776", gloss: "earth", translit: "erets" },
  "מימ": { id: "H4325", gloss: "waters", translit: "mayim" },
  "יומ": { id: "H3117", gloss: "day", translit: "yom" },
  "לילה": { id: "H3915", gloss: "night", translit: "layla" },
  "ערב": { id: "H6153", gloss: "evening", translit: "erev" },
  "בקר": { id: "H1242", gloss: "morning", translit: "boqer" },
  "רקיע": { id: "H7549", gloss: "firmament", translit: "raqia" },
  "תהומ": { id: "H8415", gloss: "the deep", translit: "tehom" },
  "תהו": { id: "H8414", gloss: "without form", translit: "tohu" },
  "בהו": { id: "H0922", gloss: "void", translit: "bohu" },
  "אדמ": { id: "H0120", gloss: "man, Adam", translit: "adam" },
  "אדמה": { id: "H0127", gloss: "ground", translit: "adamah" },
  "נפש": { id: "H5315", gloss: "soul, life", translit: "nefesh" },
  "דמ": { id: "H1818", gloss: "blood", translit: "dam" },
  "עצ": { id: "H6086", gloss: "tree", translit: "ets" },
  "פרי": { id: "H6529", gloss: "fruit", translit: "peri" },
  "דשא": { id: "H1877", gloss: "grass", translit: "deshe" },
  "עשב": { id: "H6212", gloss: "herb", translit: "esev" },
  "זרע": { id: "H2233", gloss: "seed", translit: "zera" },
  "מאור": { id: "H3974", gloss: "light", translit: "maor" },
  "מארת": { id: "H3974", gloss: "lights", translit: "meorot" },
  "כוכבימ": { id: "H3556", gloss: "stars", translit: "kokhavim" },
  "תנינמ": { id: "H8577", gloss: "great creatures", translit: "taninim" },
  "בהמה": { id: "H0929", gloss: "beast", translit: "behemah" },
  "רמש": { id: "H7431", gloss: "creeping thing", translit: "remes" },
  "עופ": { id: "H5775", gloss: "bird, fowl", translit: "of" },
  "דגה": { id: "H1710", gloss: "fish", translit: "dagah" },
  "דגת": { id: "H1710", gloss: "fish of", translit: "dagat" },
  "צלמ": { id: "H6754", gloss: "image", translit: "tselem" },
  "דמות": { id: "H1823", gloss: "likeness", translit: "demut" },
  "זכר": { id: "H2145", gloss: "male", translit: "zakhar" },
  "נקבה": { id: "H5347", gloss: "female", translit: "neqevah" },
  "חיה": { id: "H2416", gloss: "living creature", translit: "chayyah" },
  "חית": { id: "H2416", gloss: "beast of", translit: "chayyat" },
  // Genesis 2-3 key words
  "גנ": { id: "H1588", gloss: "garden", translit: "gan" },
  "עדנ": { id: "H5731", gloss: "Eden", translit: "eden" },
  "נהר": { id: "H5104", gloss: "river", translit: "nahar" },
  "צלע": { id: "H6763", gloss: "rib", translit: "tsela" },
  "נחש": { id: "H5175", gloss: "serpent", translit: "nachash" },
  "ערומ": { id: "H6174", gloss: "naked", translit: "arom" },
  "תרדמה": { id: "H8639", gloss: "deep sleep", translit: "tardemah" },
  // Particles and prepositions
  "את": { id: "H0853", gloss: "(obj. marker)", translit: "et" },
  "ואת": { id: "H0853", gloss: "and (obj.)", translit: "veet" },
  "אל": { id: "H0413", gloss: "to, toward", translit: "el" },
  "על": { id: "H5921", gloss: "upon", translit: "al" },
  "מנ": { id: "H4480", gloss: "from", translit: "min" },
  "כי": { id: "H3588", gloss: "for, because", translit: "ki" },
  "לא": { id: "H3808", gloss: "not", translit: "lo" },
  "אשר": { id: "H0834", gloss: "which, that", translit: "asher" },
  "כל": { id: "H3605", gloss: "all, every", translit: "kol" },
  "הנה": { id: "H2009", gloss: "behold", translit: "hinneh" },
  "גמ": { id: "H1571", gloss: "also", translit: "gam" },
  "אנכי": { id: "H0595", gloss: "I", translit: "anokhi" },
  "אני": { id: "H0589", gloss: "I", translit: "ani" },
  // Key Torah vocabulary
  "תורה": { id: "H8451", gloss: "law, Torah", translit: "torah" },
  "ברית": { id: "H1285", gloss: "covenant", translit: "berit" },
  "משה": { id: "H4872", gloss: "Moses", translit: "Mosheh" },
  "ישראל": { id: "H3478", gloss: "Israel", translit: "Yisrael" },
  "אברהמ": { id: "H0085", gloss: "Abraham", translit: "Avraham" },
  "יעקב": { id: "H3290", gloss: "Jacob", translit: "Yaaqov" },
  "מצרימ": { id: "H4714", gloss: "Egypt", translit: "Mitsrayim" },
  "כהנ": { id: "H3548", gloss: "priest", translit: "kohen" },
  "מלכ": { id: "H4428", gloss: "king", translit: "melekh" },
  "נביא": { id: "H5030", gloss: "prophet", translit: "navi" },
  "עבד": { id: "H5650", gloss: "servant", translit: "eved" },
  "משפט": { id: "H4941", gloss: "judgment", translit: "mishpat" },
  "צדקה": { id: "H6666", gloss: "righteousness", translit: "tsedaqah" },
  "חסד": { id: "H2617", gloss: "mercy", translit: "chesed" },
  "אמת": { id: "H0571", gloss: "truth", translit: "emet" },
  "שלומ": { id: "H7965", gloss: "peace", translit: "shalom" },
  "קדש": { id: "H6944", gloss: "holy", translit: "qodesh" },
  "חטא": { id: "H2403", gloss: "sin", translit: "chata" },
  "מזבח": { id: "H4196", gloss: "altar", translit: "mizbeach" },
  "שבת": { id: "H7676", gloss: "sabbath", translit: "shabbat" },
  "שדה": { id: "H7704", gloss: "field", translit: "sadeh" },
  "שדי": { id: "H7706", gloss: "Almighty", translit: "Shaddai" },
  // Common verbs in base form
  "אמר": { id: "H0559", gloss: "say, said", translit: "amar" },
  "ברא": { id: "H1254", gloss: "created", translit: "bara" },
  "עשה": { id: "H6213", gloss: "make, do", translit: "asah" },
  "ראה": { id: "H7200", gloss: "see", translit: "raah" },
  "נתנ": { id: "H5414", gloss: "give", translit: "natan" },
  "הלכ": { id: "H1980", gloss: "walk, go", translit: "halakh" },
  "בוא": { id: "H0935", gloss: "come, enter", translit: "bo" },
  "ישב": { id: "H3427", gloss: "dwell, sit", translit: "yashav" },
  "שמע": { id: "H8085", gloss: "hear", translit: "shama" },
  "ידע": { id: "H3045", gloss: "know", translit: "yada" },
  "דבר": { id: "H1696", gloss: "speak", translit: "davar" },
  "שלח": { id: "H7971", gloss: "send", translit: "shalach" },
  "לקח": { id: "H3947", gloss: "take", translit: "laqach" },
  "שמר": { id: "H8104", gloss: "keep, guard", translit: "shamar" },
  "שובב": { id: "H7725", gloss: "return", translit: "shuv" },
  "קרא": { id: "H7121", gloss: "call", translit: "qara" },
  "שימ": { id: "H7760", gloss: "set, put", translit: "sim" },
  "עלה": { id: "H5927", gloss: "go up", translit: "alah" },
  "ירד": { id: "H3381", gloss: "go down", translit: "yarad" },
  "יצא": { id: "H3318", gloss: "go out", translit: "yatsa" },
  "עמד": { id: "H5975", gloss: "stand", translit: "amad" },
  "מות": { id: "H4191", gloss: "die", translit: "mut" },
  "חיה": { id: "H2416", gloss: "live", translit: "chayah" },
  "אכל": { id: "H0398", gloss: "eat", translit: "akhal" },
  "שתה": { id: "H8354", gloss: "drink", translit: "shatah" },
  "ברכ": { id: "H1288", gloss: "bless", translit: "barakh" },
  "קדש": { id: "H6942", gloss: "sanctify", translit: "qadash" },
  "צוה": { id: "H6680", gloss: "command", translit: "tsavah" },
  "רבה": { id: "H7235", gloss: "multiply", translit: "ravah" },
  "מלא": { id: "H4390", gloss: "fill", translit: "male" },
  "כבש": { id: "H3533", gloss: "subdue", translit: "kavash" },
  "רדה": { id: "H7287", gloss: "rule, have dominion", translit: "radah" },
  "שרצ": { id: "H8317", gloss: "swarm", translit: "sharats" },
  "יצר": { id: "H3335", gloss: "form", translit: "yatsar" },
  "נפח": { id: "H5301", gloss: "breathe", translit: "nafach" },
  "נשמה": { id: "H5397", gloss: "breath", translit: "neshamah" },
  // More common nouns
  "אב": { id: "H0001", gloss: "father", translit: "av" },
  "אמ": { id: "H0517", gloss: "mother", translit: "em" },
  "בנ": { id: "H1121", gloss: "son", translit: "ben" },
  "בת": { id: "H1323", gloss: "daughter", translit: "bat" },
  "אח": { id: "H0251", gloss: "brother", translit: "ach" },
  "אחות": { id: "H0269", gloss: "sister", translit: "achot" },
  "איש": { id: "H0376", gloss: "man", translit: "ish" },
  "אשה": { id: "H0802", gloss: "woman, wife", translit: "ishah" },
  "בית": { id: "H1004", gloss: "house", translit: "bayit" },
  "עיר": { id: "H5892", gloss: "city", translit: "ir" },
  "הר": { id: "H2022", gloss: "mountain", translit: "har" },
  "ימ": { id: "H3220", gloss: "sea", translit: "yam" },
  "שמש": { id: "H8121", gloss: "sun", translit: "shemesh" },
  "ירח": { id: "H3394", gloss: "moon", translit: "yareach" },
  "כנפ": { id: "H3671", gloss: "wing", translit: "kanaf" },
  "לב": { id: "H3820", gloss: "heart", translit: "lev" },
  "ענ": { id: "H5869", gloss: "eye", translit: "ayin" },
  "עינ": { id: "H5869", gloss: "eye", translit: "ayin" },
  "ידא": { id: "H3027", gloss: "hand", translit: "yad" },
  "יד": { id: "H3027", gloss: "hand", translit: "yad" },
  "רגל": { id: "H7272", gloss: "foot", translit: "regel" },
  "שמ": { id: "H8034", gloss: "name", translit: "shem" },
  "דרכ": { id: "H1870", gloss: "way", translit: "derekh" },
  "עמ": { id: "H5971", gloss: "people", translit: "am" },
  "גוי": { id: "H1471", gloss: "nation", translit: "goy" },
  "חרב": { id: "H2719", gloss: "sword", translit: "cherev" },
  "כספ": { id: "H3701", gloss: "silver", translit: "kesef" },
  "זהב": { id: "H2091", gloss: "gold", translit: "zahav" },
  "אבנ": { id: "H0068", gloss: "stone", translit: "even" },
  "מדבר": { id: "H4057", gloss: "wilderness", translit: "midbar" },
  "קול": { id: "H6963", gloss: "voice", translit: "qol" },
  "דבר": { id: "H1697", gloss: "word, thing", translit: "davar" },
  "חכמה": { id: "H2451", gloss: "wisdom", translit: "chokhmah" },
  "כח": { id: "H3581", gloss: "strength", translit: "koach" },
  "ספר": { id: "H5612", gloss: "book", translit: "sefer" },
  "אהל": { id: "H0168", gloss: "tent", translit: "ohel" },
  "ארונ": { id: "H0727", gloss: "ark", translit: "aron" },
  "מקומ": { id: "H4725", gloss: "place", translit: "maqom" },
  "שנה": { id: "H8141", gloss: "year", translit: "shanah" },
  "חדש": { id: "H2320", gloss: "month", translit: "chodesh" },
  "עולמ": { id: "H5769", gloss: "everlasting", translit: "olam" },
  "מצוה": { id: "H4687", gloss: "commandment", translit: "mitsvah" },
  "חקה": { id: "H2708", gloss: "ordinance", translit: "chuqqah" },
};

let count = 0;
for (const [word, entry] of Object.entries(WORD_OVERRIDES)) {
  g.byWord[word] = entry;
  count++;
}

fs.writeFileSync(DATA_PATH, JSON.stringify(g));
console.log("Added/updated " + count + " word-form overrides");

// Verify Genesis 1:1-3
const FINAL = {"\u05DA":"\u05DB","\u05DD":"\u05DE","\u05DF":"\u05E0","\u05E3":"\u05E4","\u05E5":"\u05E6"};
const normalize = t => [...t].map(c => FINAL[c]||c).join("");
const PREFIXES = ["וב","וה","וכ","ול","ומ","וש","ב","ה","ו","כ","ל","מ","ש"];
function lookup(word) {
  const n = normalize(word);
  if (g.byWord[n]) return g.byWord[n].gloss;
  for (const p of PREFIXES) {
    if (n.startsWith(p) && n.length > p.length + 1) {
      const stripped = n.slice(p.length);
      if (g.byWord[stripped]) return g.byWord[stripped].gloss;
    }
  }
  return "NOT FOUND";
}

console.log("\nGenesis 1:1: In the beginning God created the heavens and the earth");
["בראשית","ברא","אלהימ","את","השמימ","ואת","הארצ"].forEach(w => console.log("  " + w + " -> " + lookup(w)));
console.log("\nGenesis 1:2: And the earth was without form and void...");
["והארצ","היתה","תהו","ובהו","וחשכ","על","פני","תהומ","ורוח","אלהימ","מרחפת","על","פני","המימ"].forEach(w => console.log("  " + w + " -> " + lookup(w)));
console.log("\nGenesis 1:3: And God said, Let there be light...");
["ויאמר","אלהימ","יהי","אור","ויהי","אור"].forEach(w => console.log("  " + w + " -> " + lookup(w)));
