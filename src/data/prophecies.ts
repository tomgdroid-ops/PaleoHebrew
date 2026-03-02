export type ProphecyCategory =
  | "lineage"
  | "ministry"
  | "servant"
  | "suffering"
  | "resurrection"
  | "kingdom";

export interface Prophecy {
  id: number;
  slug: string;
  title: string;
  category: ProphecyCategory;
  categoryLabel: string;
  summary: string;
  otReference: string;
  otText: string;
  dateWritten: string;
  manuscriptAttestation: string;
  ancientJewishInterpretation: string;
  ntReference: string;
  ntText: string;
  narrativeContext: string;
  historicalEvidence: string;
}

export const CATEGORY_META: Record<
  ProphecyCategory,
  { label: string; color: string; bg: string }
> = {
  lineage: {
    label: "Lineage & Birth",
    color: "#D4A843",
    bg: "lineage-bg.png",
  },
  ministry: {
    label: "Forerunner & Ministry",
    color: "#C47D2A",
    bg: "ministry-bg.png",
  },
  servant: {
    label: "Servant & Character",
    color: "#3A8A8C",
    bg: "servant-bg.png",
  },
  suffering: {
    label: "Suffering & Death",
    color: "#8B2D3B",
    bg: "suffering-bg.png",
  },
  resurrection: {
    label: "Resurrection & Exaltation",
    color: "#C0C8D4",
    bg: "resurrection-bg.png",
  },
  kingdom: {
    label: "Eternal Kingdom",
    color: "#6B4C9A",
    bg: "kingdom-bg.png",
  },
};

export const SECTION_COLORS = {
  prophecy: "#D4A843",
  fulfillment: "#2E5D8A",
  evidence: "#4A7C59",
};

export const prophecies: Prophecy[] = [
  // ============================================
  // Category: Lineage & Birth
  // ============================================
  {
    id: 1,
    slug: "seed-of-the-woman",
    title: "The Seed of the Woman",
    category: "lineage",
    categoryLabel: "Lineage & Birth",
    summary:
      "The first messianic promise: a descendant of the woman who would crush the serpent.",
    otReference: "Genesis 3:15",
    otText:
      "And I will put enmity between you and the woman, and between your offspring and hers; he will crush your head, and you will strike his heel.",
    dateWritten: "~1400 BCE (Mosaic period)",
    manuscriptAttestation:
      "Dead Sea Scrolls Genesis fragments (4QGen); all major codices.",
    ancientJewishInterpretation:
      "Targum Pseudo-Jonathan identifies this with the days of King Messiah. Bereshit Rabbah applies it to the messianic era.",
    ntReference: "Romans 16:20; Galatians 4:4",
    ntText:
      "\"The God of peace will soon crush Satan under your feet.\" (Romans 16:20)\n\n\"But when the set time had fully come, God sent his Son, born of a woman.\" (Galatians 4:4)",
    narrativeContext:
      "Paul and the early church understood Jesus as the ultimate \"seed of the woman\" who would crush the serpent's power through his death and resurrection.",
    historicalEvidence:
      "This is the oldest messianic promise in Scripture, known as the Protoevangelium (\"first gospel\"). Its antiquity is confirmed by its presence in the earliest Genesis manuscripts from Qumran. The Targum Pseudo-Jonathan, an ancient Aramaic paraphrase, explicitly connects this to the Messiah, showing pre-Christian Jewish messianic interpretation.",
  },
  {
    id: 2,
    slug: "blessing-through-abraham",
    title: "Blessing Through Abraham's Seed",
    category: "lineage",
    categoryLabel: "Lineage & Birth",
    summary:
      "Through Abraham's singular offspring, all nations on earth would be blessed.",
    otReference: "Genesis 22:18",
    otText:
      "And through your offspring all nations on earth will be blessed, because you have obeyed me.",
    dateWritten: "~1400 BCE",
    manuscriptAttestation: "4QGen fragments; all codices.",
    ancientJewishInterpretation:
      "Bemidbar Rabbah 2 applies this to the Messiah. The Talmud (Yevamot 63a) connects the blessing to messianic times.",
    ntReference: "Galatians 3:16",
    ntText:
      "The promises were spoken to Abraham and to his seed. Scripture does not say \"and to seeds,\" meaning many people, but \"and to your seed,\" meaning one person, who is Christ.",
    narrativeContext:
      "Paul argued that the singular \"seed\" pointed to one ultimate descendant through whom all nations would be blessed.",
    historicalEvidence:
      "The covenant with Abraham is one of the most well-attested texts in ancient Judaism. Genesis manuscripts from Qumran confirm the text. The universal scope of the blessing (\"all nations\") was unusual in ancient Near Eastern religion and became foundational to both Jewish and Christian theology.",
  },
  {
    id: 3,
    slug: "scepter-from-judah",
    title: "The Scepter from Judah / Shiloh",
    category: "lineage",
    categoryLabel: "Lineage & Birth",
    summary:
      "The ruling scepter would remain with Judah until the one to whom it belongs arrives.",
    otReference: "Genesis 49:10",
    otText:
      "The scepter will not depart from Judah, nor the ruler's staff from between his feet, until he to whom it belongs shall come and the obedience of the nations shall be his.",
    dateWritten: "~1400 BCE",
    manuscriptAttestation:
      "Dead Sea Scrolls Genesis Pesher (4Q252) explicitly interprets this messianically; all Targums; all codices.",
    ancientJewishInterpretation:
      "Talmud Sanhedrin 98b; Targum Onkelos, Targum Pseudo-Jonathan, and the Jerusalem Targum all render \"Shiloh\" as \"Messiah\" or \"King Messiah.\" The Qumran Genesis Pesher (4Q252) identifies this with the \"Branch of David.\"",
    ntReference: "Revelation 5:5; Luke 3:23-34",
    ntText:
      "See, the Lion of the tribe of Judah, the Root of David, has triumphed. (Revelation 5:5)",
    narrativeContext:
      "Jesus' genealogy in both Matthew and Luke establishes his descent from the tribe of Judah through the line of David, fulfilling Jacob's deathbed prophecy.",
    historicalEvidence:
      "The Dead Sea Scrolls document 4Q252 (Genesis Pesher) provides direct pre-Christian evidence that this passage was interpreted messianically at Qumran. The document explicitly connects \"the scepter\" to the \"Branch of David\" who would rule forever. This is one of the strongest manuscript-attested messianic interpretations from the Second Temple period.",
  },
  {
    id: 4,
    slug: "star-from-jacob",
    title: "The Star from Jacob",
    category: "lineage",
    categoryLabel: "Lineage & Birth",
    summary:
      "A star and scepter would rise from Israel, prophesied by the pagan seer Balaam.",
    otReference: "Numbers 24:17",
    otText:
      "I see him, but not now; I behold him, but not near. A star will come out of Jacob; a scepter will rise out of Israel.",
    dateWritten: "~1400 BCE",
    manuscriptAttestation:
      "4QTestimonia (4Q175) groups this with other messianic proof-texts; War Scroll (1QM 11:6-7); all codices.",
    ancientJewishInterpretation:
      "Targum Onkelos and Pseudo-Jonathan apply this to the Messiah. The Bar Kokhba revolt (132-135 CE) took its name (\"Son of the Star\") from this prophecy, showing how deeply embedded the messianic interpretation was.",
    ntReference: "Matthew 2:2; Revelation 22:16",
    ntText:
      "\"Where is the one who has been born king of the Jews? We saw his star when it rose and have come to worship him.\" (Matthew 2:2)\n\n\"I am the Root and the Offspring of David, and the bright Morning Star.\" (Revelation 22:16)",
    narrativeContext:
      "The Magi followed a star to find the newborn Jesus, and the Gospel writer presents this as fulfillment of Balaam's oracle.",
    historicalEvidence:
      "The Qumran document 4QTestimonia (4Q175) is a collection of messianic proof-texts, and Numbers 24:17 appears alongside Deuteronomy 18:18 and Deuteronomy 33:8-11 as one of three foundational messianic prophecies. The War Scroll also references this verse in an eschatological context. Rabbi Akiva applied this prophecy to Simon Bar Kokhba in 132 CE, demonstrating the messianic understanding was mainstream.",
  },
  {
    id: 5,
    slug: "born-in-bethlehem",
    title: "Born in Bethlehem",
    category: "lineage",
    categoryLabel: "Lineage & Birth",
    summary:
      "The ruler of Israel would come from the small town of Bethlehem, with origins from eternity.",
    otReference: "Micah 5:2",
    otText:
      "But you, Bethlehem Ephrathah, though you are small among the clans of Judah, out of you will come for me one who will be ruler over Israel, whose origins are from of old, from ancient times.",
    dateWritten: "~700 BCE",
    manuscriptAttestation:
      "Dead Sea Scrolls Micah fragments (1QMicah, 4QMicah); all codices; Septuagint.",
    ancientJewishInterpretation:
      "Targum Jonathan explicitly renders this as messianic. The Talmud (Megillah 15a) and various Midrashim identify Bethlehem as the Messiah's birthplace. In Matthew 2:4-6, the chief priests and scribes immediately cite this verse when Herod asks where the Messiah would be born, showing it was common knowledge.",
    ntReference: "Matthew 2:1; Luke 2:4-7",
    ntText:
      "After Jesus was born in Bethlehem in Judea, during the time of King Herod... (Matthew 2:1)",
    narrativeContext:
      "Both Matthew and Luke independently record Jesus' birth in Bethlehem. Matthew explicitly cites Micah's prophecy as fulfilled. Luke provides the historical mechanism (the Roman census) that brought Mary and Joseph from Nazareth to Bethlehem.",
    historicalEvidence:
      "Archaeological excavations confirm Bethlehem was a small, inhabited village in the 1st century BCE/CE. The Church of the Nativity, built by Constantine in the 4th century CE, preserves the traditional birthplace site. The phrase \"from ancient times\" (literally \"from days of eternity\") was understood by Jewish interpreters as indicating the Messiah's pre-existence. The Roman census system under Augustus is historically documented, and Luke's account of a census under Quirinius has been debated but finds support in evidence of multiple Roman registrations in the eastern provinces.",
  },
  {
    id: 6,
    slug: "virgin-birth-immanuel",
    title: "The Virgin Birth / Immanuel",
    category: "lineage",
    categoryLabel: "Lineage & Birth",
    summary:
      "A virgin would conceive and bear a son called Immanuel, meaning \"God with us.\"",
    otReference: "Isaiah 7:14",
    otText:
      "Therefore the Lord himself will give you a sign: The virgin will conceive and give birth to a son, and will call him Immanuel.",
    dateWritten: "~700 BCE",
    manuscriptAttestation:
      "Great Isaiah Scroll (1QIsa\u1D43, c. 125 BCE) preserves this verse with a notable variant \u2014 uses YHWH where the Masoretic Text uses Adonai. The Septuagint (3rd century BCE) translated the Hebrew 'almah as Greek parthenos (virgin). All codices.",
    ancientJewishInterpretation:
      "The Septuagint translation choice of \"virgin\" (parthenos) rather than simply \"young woman\" indicates pre-Christian Jewish understanding included a miraculous element. The Dead Sea Scrolls variant using the divine name YHWH may indicate heightened theological significance.",
    ntReference: "Matthew 1:22-23",
    ntText:
      "All this took place to fulfill what the Lord had said through the prophet: \"The virgin will conceive and give birth to a son, and they will call him Immanuel\" \u2014 which means \"God with us.\"",
    narrativeContext:
      "Matthew directly quotes Isaiah 7:14 and applies it to Mary's virgin conception of Jesus. The name Immanuel (\"God with us\") is understood as describing Jesus' divine nature.",
    historicalEvidence:
      "The Great Isaiah Scroll from Qumran confirms this verse existed in its current form over a century before Jesus' birth. The Septuagint's use of parthenos (\"virgin\") demonstrates that at least some Jewish translators in the 3rd-2nd century BCE understood this as a miraculous sign rather than simply a \"young woman.\" This is significant because the Septuagint was a Jewish translation made centuries before Christianity existed.",
  },
  {
    id: 7,
    slug: "divine-child-davids-throne",
    title: "The Divine Child on David's Throne",
    category: "lineage",
    categoryLabel: "Lineage & Birth",
    summary:
      "A child with divine titles would reign on David's throne with an everlasting kingdom.",
    otReference: "Isaiah 9:6-7",
    otText:
      "For to us a child is born, to us a son is given, and the government will be on his shoulders. And he will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace. Of the increase of his government and of peace there will be no end. He will reign on David's throne and over his kingdom.",
    dateWritten: "~700 BCE",
    manuscriptAttestation:
      "Great Isaiah Scroll (1QIsa\u1D43) preserves the complete text; all codices.",
    ancientJewishInterpretation:
      "Targum Jonathan applies this to the Messiah. The fourfold title \u2014 particularly \"Mighty God\" (El Gibbor) \u2014 attributes divine qualities to this child. Debarim Rabbah 1 and Bemidbar Rabbah 11 discuss this in messianic context.",
    ntReference: "Luke 1:32-33",
    ntText:
      "He will be great and will be called the Son of the Most High. The Lord God will give him the throne of his father David, and he will reign over Jacob's descendants forever; his kingdom will never end.",
    narrativeContext:
      "The angel Gabriel's announcement to Mary echoes Isaiah's prophecy almost word for word, placing Jesus on David's throne with an everlasting kingdom.",
    historicalEvidence:
      "The Great Isaiah Scroll confirms this text existed in the 2nd century BCE. The title \"Mighty God\" (El Gibbor) is the same title used for God himself in Isaiah 10:21, making this one of the strongest Old Testament texts attributing deity to the Messiah. The Targum Jonathan, though it softens the divine titles, still applies the passage to \"the Messiah.\"",
  },

  // ============================================
  // Category: Forerunner & Ministry
  // ============================================
  {
    id: 8,
    slug: "prophet-like-moses",
    title: "The Prophet Like Moses",
    category: "ministry",
    categoryLabel: "Forerunner & Ministry",
    summary:
      "God would raise up a prophet like Moses from among the Israelites.",
    otReference: "Deuteronomy 18:15, 18",
    otText:
      "The LORD your God will raise up for you a prophet like me from among you, from your fellow Israelites. You must listen to him... I will put my words in his mouth, and he will tell them everything I command him.",
    dateWritten: "~1400 BCE",
    manuscriptAttestation:
      "4QTestimonia (4Q175) lists this as a key messianic proof-text; multiple Qumran Deuteronomy manuscripts; all codices.",
    ancientJewishInterpretation:
      "4QTestimonia groups this with Numbers 24:17 as foundational messianic texts. The Samaritan tradition identified this as the promise of the Taheb (Restorer).",
    ntReference: "Acts 3:22-23; John 6:14",
    ntText:
      "\"After the people saw the sign Jesus performed, they began to say, 'Surely this is the Prophet who is to come into the world.'\" (John 6:14)",
    narrativeContext:
      "The crowds recognized Jesus as \"the Prophet\" based on this Mosaic promise. Peter's sermon in Acts explicitly identifies Jesus as this prophet.",
    historicalEvidence:
      "The inclusion of Deuteronomy 18:15 in the Qumran messianic testimony collection (4QTestimonia) proves this was considered a messianic prophecy by pre-Christian Jews. The Samaritan expectation of the Taheb, based on this same passage, provides an independent witness to its messianic interpretation.",
  },
  {
    id: 9,
    slug: "messenger-prepares-the-way",
    title: "The Messenger Who Prepares the Way",
    category: "ministry",
    categoryLabel: "Forerunner & Ministry",
    summary:
      "A messenger would prepare the way before the Lord, who would suddenly come to his temple.",
    otReference: "Malachi 3:1",
    otText:
      "I will send my messenger, who will prepare the way before me. Then suddenly the Lord you are seeking will come to his temple; the messenger of the covenant, whom you desire, will come.",
    dateWritten: "~430 BCE",
    manuscriptAttestation:
      "Dead Sea Scrolls Minor Prophets fragments; Na\u1E25al \u1E24ever Greek Minor Prophets scroll (8\u1E24evXIIgr); all codices.",
    ancientJewishInterpretation:
      "Pirqe de Rabbi Eliezer ch. 29 applies this messianically.",
    ntReference: "Matthew 11:10; Mark 1:2-4",
    ntText:
      "This is the one about whom it is written: \"I will send my messenger ahead of you, who will prepare your way before you.\" (Matthew 11:10)",
    narrativeContext:
      "The Gospel writers identify John the Baptist as the \"messenger\" who prepared the way for Jesus, the \"Lord\" who came suddenly to his temple.",
    historicalEvidence:
      "The prophecy requires the Messiah to come to \"his temple\" \u2014 meaning the Second Temple must still be standing. The Second Temple was destroyed in 70 CE by the Romans, creating a fixed deadline. This is historically documented by Josephus and confirmed by archaeology. Any fulfillment must have occurred before 70 CE.",
  },
  {
    id: 10,
    slug: "elijah-before-the-lord",
    title: "Elijah Before the Day of the LORD",
    category: "ministry",
    categoryLabel: "Forerunner & Ministry",
    summary:
      "The prophet Elijah would return before the great and dreadful day of the LORD.",
    otReference: "Malachi 4:5-6",
    otText:
      "See, I will send the prophet Elijah to you before that great and dreadful day of the LORD comes. He will turn the hearts of the parents to their children, and the hearts of the children to their parents.",
    dateWritten: "~430 BCE",
    manuscriptAttestation:
      "Dead Sea Scrolls Minor Prophets fragments; all codices.",
    ancientJewishInterpretation:
      "Widely attested in Talmud and Midrash (Pirqe de R. Eliezer ch. 40; Debarim Rabbah 3; numerous others). The Passover tradition of setting a cup for Elijah reflects this ongoing expectation.",
    ntReference: "Matthew 17:10-13",
    ntText:
      "\"Elijah has already come,\" Jesus replied, \"and they did not recognize him\"... Then the disciples understood that he was talking to them about John the Baptist.",
    narrativeContext:
      "Jesus identified John the Baptist as the Elijah figure who fulfilled Malachi's prophecy \u2014 a herald who came in the spirit and power of Elijah.",
    historicalEvidence:
      "The expectation of Elijah's return was universal in Second Temple Judaism. Josephus records the widespread popularity of John the Baptist as a prophetic figure. The Passover Seder tradition of Elijah's cup, documented in the Mishnah and Talmud, testifies to how deeply embedded this expectation was in Jewish life.",
  },
  {
    id: 11,
    slug: "branch-from-jesse",
    title: "The Branch from Jesse",
    category: "ministry",
    categoryLabel: "Forerunner & Ministry",
    summary:
      "A shoot from the stump of Jesse would bear fruit, anointed with the Spirit of the LORD.",
    otReference: "Isaiah 11:1-10",
    otText:
      "A shoot will come up from the stump of Jesse; from his roots a Branch will bear fruit. The Spirit of the LORD will rest on him \u2014 the Spirit of wisdom and of understanding, the Spirit of counsel and of might, the Spirit of the knowledge and fear of the LORD.",
    dateWritten: "~700 BCE",
    manuscriptAttestation:
      "Great Isaiah Scroll (1QIsa\u1D43); 4QFlorilegium (4Q174) interprets this messianically; all codices.",
    ancientJewishInterpretation:
      "The Qumran 4QFlorilegium and 4QpIsaiah commentaries explicitly identify the \"Branch of David\" as the eschatological Messiah. Targum Jonathan applies the passage to the Messiah. The Hebrew word netser (\"branch\") in verse 1 may be connected to the name Nazareth.",
    ntReference: "Romans 15:12; Matthew 2:23",
    ntText:
      "Isaiah says, \"The Root of Jesse will spring up, one who will arise to rule over the nations; in him the Gentiles will hope.\" (Romans 15:12)",
    narrativeContext:
      "Paul quotes Isaiah 11 directly as fulfilled in Jesus. Matthew's connection of \"Nazarene\" to the Hebrew netser (\"branch\") reflects the play on words that first-century Jewish readers would have recognized.",
    historicalEvidence:
      "The 4QFlorilegium from Qumran is direct manuscript evidence of pre-Christian messianic interpretation of this passage. The document explicitly reads Isaiah 11:1 as a prophecy of the \"Branch of David who shall arise at the end of days.\" The Great Isaiah Scroll confirms the text.",
  },
  {
    id: 12,
    slug: "anointed-proclaimer",
    title: "The Anointed Proclaimer",
    category: "ministry",
    categoryLabel: "Forerunner & Ministry",
    summary:
      "The LORD's anointed would proclaim good news to the poor, freedom to captives, and healing.",
    otReference: "Isaiah 61:1-3",
    otText:
      "The Spirit of the Sovereign LORD is on me, because the LORD has anointed me to proclaim good news to the poor. He has sent me to bind up the brokenhearted, to proclaim freedom for the captives and release from darkness for the prisoners.",
    dateWritten: "~700 BCE",
    manuscriptAttestation:
      "Great Isaiah Scroll (1QIsa\u1D43); Messianic Apocalypse (4Q521) draws directly on this text; all codices.",
    ancientJewishInterpretation:
      "The Messianic Apocalypse scroll (4Q521, c. 1st century BCE) describes the Messiah performing these exact works \u2014 releasing captives, healing the blind, lifting the oppressed, raising the dead \u2014 drawing from Isaiah 61 and Isaiah 35.",
    ntReference: "Luke 4:16-21",
    ntText:
      "He went to Nazareth, where he had been brought up, and on the Sabbath day he went into the synagogue, as was his custom. He stood up to read... \"Today this scripture is fulfilled in your hearing.\"",
    narrativeContext:
      "In his inaugural public sermon, Jesus chose this specific passage from Isaiah, read it aloud, and claimed to be its fulfillment. This was a deliberate messianic declaration.",
    historicalEvidence:
      "The Messianic Apocalypse (4Q521) is one of the most important Dead Sea Scrolls for messianic studies. Written approximately 100 years before Jesus, it lists miracles the Messiah would perform \u2014 and the list matches both Isaiah 61 and the works Jesus cited as evidence of his messiahship in Luke 7:22. The order of the miracles is the same in both 4Q521 and Luke's account.",
  },
  {
    id: 13,
    slug: "king-on-a-donkey",
    title: "The King on a Donkey",
    category: "ministry",
    categoryLabel: "Forerunner & Ministry",
    summary:
      "Zion's king would come righteous and victorious, yet humble, riding on a donkey.",
    otReference: "Zechariah 9:9",
    otText:
      "Rejoice greatly, Daughter Zion! Shout, Daughter Jerusalem! See, your king comes to you, righteous and victorious, lowly and riding on a donkey, on a colt, the foal of a donkey.",
    dateWritten: "~520 BCE",
    manuscriptAttestation:
      "Dead Sea Scrolls Zechariah fragments; all codices.",
    ancientJewishInterpretation:
      "Talmud Sanhedrin 98a; Pirqe de Rabbi Eliezer ch. 31. Rashi comments that this \"cannot be explained except of King Messiah.\" Nearly all ancient Jewish commentators applied this to the Messiah.",
    ntReference: "Matthew 21:4-5",
    ntText:
      "This took place to fulfill what was spoken through the prophet: \"Say to Daughter Zion, See, your king comes to you, gentle and riding on a donkey.\" (Matthew 21:4-5)",
    narrativeContext:
      "Jesus deliberately arranged his entry into Jerusalem on a donkey, a conscious enactment of Zechariah's prophecy. The crowds recognized the messianic symbolism and shouted \"Hosanna to the Son of David.\"",
    historicalEvidence:
      "The Talmud (Sanhedrin 98a) records a famous rabbinic discussion reconciling Zechariah 9:9 (Messiah on a donkey) with Daniel 7:13 (Messiah on clouds): \"If Israel is worthy, he comes with the clouds of heaven; if not, lowly and riding on a donkey.\" This confirms the passage was universally understood as messianic in ancient Judaism.",
  },

  // ============================================
  // Category: Servant & Character
  // ============================================
  {
    id: 14,
    slug: "servant-of-the-lord",
    title: "The Servant of the LORD",
    category: "servant",
    categoryLabel: "Servant & Character",
    summary:
      "God's chosen servant would bring justice to the nations with gentle, quiet strength.",
    otReference: "Isaiah 42:1-4",
    otText:
      "Here is my servant, whom I uphold, my chosen one in whom I delight; I will put my Spirit on him, and he will bring justice to the nations. He will not shout or cry out, or raise his voice in the streets. A bruised reed he will not break, and a smoldering wick he will not snuff out.",
    dateWritten: "~700 BCE",
    manuscriptAttestation:
      "Great Isaiah Scroll (1QIsa\u1D43); all codices.",
    ancientJewishInterpretation:
      "Targum Jonathan explicitly renders Isaiah 42:1 as \"Behold My servant the Messiah.\" This is one of the clearest Targumic identifications.",
    ntReference: "Matthew 12:17-21",
    ntText:
      "This was to fulfill what was spoken through the prophet Isaiah: \"Here is my servant whom I have chosen, the one I love, in whom I delight; I will put my Spirit on him, and he will proclaim justice to the nations.\"",
    narrativeContext:
      "Matthew presents Jesus' quiet, compassionate ministry as the direct fulfillment of the Servant's character described by Isaiah.",
    historicalEvidence:
      "The Targum Jonathan's rendering \"My servant the Messiah\" on this passage is unambiguous. The Great Isaiah Scroll preserves the text fully. The First Servant Song's description of a gentle figure who brings justice to the nations without violence stood in tension with the more militaristic messianic expectations of the period.",
  },
  {
    id: 15,
    slug: "good-shepherd",
    title: "The Good Shepherd",
    category: "servant",
    categoryLabel: "Servant & Character",
    summary:
      "God would place one shepherd over his people: his servant David, a prince among them.",
    otReference: "Ezekiel 34:23-24",
    otText:
      "I will place over them one shepherd, my servant David, and he will tend them; he will tend them and be their shepherd. I the LORD will be their God, and my servant David will be prince among them.",
    dateWritten: "~580 BCE",
    manuscriptAttestation: "Qumran Ezekiel fragments; all codices.",
    ancientJewishInterpretation:
      "Since David was long dead by Ezekiel's time, \"David\" here was understood as a future Davidic descendant \u2014 the Messiah. The Targum on Ezekiel applies this to messianic times.",
    ntReference: "John 10:11",
    ntText:
      "I am the good shepherd. The good shepherd lays down his life for the sheep.",
    narrativeContext:
      "Jesus claimed the title \"Good Shepherd\" for himself, directly echoing Ezekiel's prophecy and identifying himself as the promised Davidic shepherd.",
    historicalEvidence:
      "Ezekiel wrote during the Babylonian exile (6th century BCE), long after David's death. The only way to read \"my servant David\" is as a future figure \u2014 a messianic descendant. Ezekiel fragments from Qumran confirm the text's antiquity.",
  },
  {
    id: 16,
    slug: "branch-of-david",
    title: "The Branch of David / LORD Our Righteousness",
    category: "servant",
    categoryLabel: "Servant & Character",
    summary:
      "A righteous Branch from David would reign wisely, bearing the divine name \"The LORD Our Righteousness.\"",
    otReference: "Jeremiah 23:5-6",
    otText:
      "The days are coming, declares the LORD, when I will raise up for David a righteous Branch, a King who will reign wisely and do what is just and right in the land. In his days Judah will be saved and Israel will live in safety. This is the name by which he will be called: The LORD Our Righteousness.",
    dateWritten: "~600 BCE",
    manuscriptAttestation: "4QJer Dead Sea Scrolls fragments; all codices.",
    ancientJewishInterpretation:
      "Targum Jonathan renders this explicitly as messianic. Talmud Baba Bathra 75b; Midrash on Psalm 21:1; Midrash on Proverbs 19:21; Midrash on Lamentations 1:16.",
    ntReference: "1 Corinthians 1:30",
    ntText:
      "Christ Jesus, who has become for us wisdom from God \u2014 that is, our righteousness, holiness and redemption.",
    narrativeContext:
      "Paul identifies Jesus as the one through whom God's righteousness is given to believers, fulfilling the prophetic title \"The LORD Our Righteousness.\"",
    historicalEvidence:
      "The messianic title YHWH Tsidkenu (\"The LORD Our Righteousness\") is extraordinary \u2014 it applies the divine name YHWH to the Messiah. Jeremiah fragments from the Dead Sea Scrolls confirm the text. The Targum's explicit messianic interpretation shows this was not a Christian invention.",
  },
  {
    id: 17,
    slug: "new-covenant",
    title: "The New Covenant",
    category: "servant",
    categoryLabel: "Servant & Character",
    summary:
      "God would make a new covenant, writing his law on hearts instead of stone tablets.",
    otReference: "Jeremiah 31:31-34",
    otText:
      "The days are coming, declares the LORD, when I will make a new covenant with the people of Israel and with the people of Judah. It will not be like the covenant I made with their ancestors... I will put my law in their minds and write it on their hearts.",
    dateWritten: "~600 BCE",
    manuscriptAttestation:
      "4QJer Dead Sea Scrolls fragments; the Qumran community itself claimed to be part of the \"new covenant\" (Damascus Document CD 6:19; 8:21); all codices.",
    ancientJewishInterpretation:
      "The term \"new covenant\" (brit hadashah) was adopted by the Qumran community to describe their own covenant relationship with God, showing the concept was alive in pre-Christian Judaism.",
    ntReference: "Luke 22:20; Hebrews 8:8-12",
    ntText:
      "This cup is the new covenant in my blood, which is poured out for you. (Luke 22:20)",
    narrativeContext:
      "Jesus explicitly claimed to inaugurate the \"new covenant\" prophesied by Jeremiah through his sacrificial death, using the language at the Last Supper.",
    historicalEvidence:
      "The Dead Sea Scrolls provide remarkable evidence that the concept of a \"new covenant\" was actively discussed in Second Temple Judaism. The Damascus Document from Qumran uses the exact phrase \"new covenant\" (brit hadashah) to describe the community's relationship with God. This proves the concept was not invented by Christians but was part of Jewish messianic expectation before Jesus.",
  },
  {
    id: 18,
    slug: "rejected-cornerstone",
    title: "The Rejected Cornerstone",
    category: "servant",
    categoryLabel: "Servant & Character",
    summary:
      "The stone rejected by the builders would become the most important cornerstone.",
    otReference: "Psalm 118:22-23",
    otText:
      "The stone the builders rejected has become the cornerstone; the LORD has done this, and it is marvelous in our eyes.",
    dateWritten: "~1000-500 BCE",
    manuscriptAttestation:
      "Multiple Dead Sea Scrolls Psalms manuscripts (36 copies of Psalms found at Qumran); all codices.",
    ancientJewishInterpretation:
      "Targum on Psalms applies this to David/the Messiah. Midrashic literature discusses the rejected stone becoming the capstone.",
    ntReference: "Matthew 21:42; Acts 4:11",
    ntText:
      "Jesus said to them, \"Have you never read in the Scriptures: 'The stone the builders rejected has become the cornerstone'?\" (Matthew 21:42)",
    narrativeContext:
      "Jesus applied this psalm to himself, predicting that though he would be rejected by the religious leaders, he would become the foundation of God's kingdom.",
    historicalEvidence:
      "Psalms was the most heavily copied book at Qumran (36 copies), confirming its central importance. The metaphor of a rejected stone becoming the key structural element was understood messianically in ancient Judaism.",
  },

  // ============================================
  // Category: Suffering & Death
  // ============================================
  {
    id: 19,
    slug: "suffering-servant",
    title: "The Suffering Servant",
    category: "suffering",
    categoryLabel: "Suffering & Death",
    summary:
      "The servant would be pierced for our transgressions, crushed for our iniquities, and by his wounds we are healed.",
    otReference: "Isaiah 52:13\u201353:12",
    otText:
      "He was despised and rejected by mankind, a man of suffering, and familiar with pain... He was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed... He was assigned a grave with the wicked, and with the rich in his death.",
    dateWritten: "~700 BCE",
    manuscriptAttestation:
      "Great Isaiah Scroll (1QIsa\u1D43, c. 125 BCE) preserves the complete text. In 53:11, the Dead Sea Scroll adds the word \"light,\" supported by the Septuagint, implying resurrection hope. In 52:14, a scribal variant appears to read \"I have anointed\" (mashakhti), reflecting deliberate messianic interpretation. All codices.",
    ancientJewishInterpretation:
      "Talmud Sanhedrin 98b names the Messiah \"the leper scholar\" based on Isaiah 53. Targum Jonathan on 52:13 reads \"Behold My servant the Messiah shall deal wisely.\" The Zohar and multiple Midrashim apply the passage to the Messiah. The Pesiqta Rabbati describes the Messiah's suffering in language drawn from this chapter.",
    ntReference: "Acts 8:32-35; Matthew 8:17; Mark 10:45; 1 Peter 2:21-25",
    ntText:
      "The Ethiopian eunuch was reading this passage of Scripture: \"He was led like a sheep to the slaughter...\" Philip began with that very passage of Scripture and told him the good news about Jesus. (Acts 8:32-35)",
    narrativeContext:
      "This is the most extensively quoted Old Testament passage in the New Testament. The early church saw Jesus' trial, crucifixion, death among criminals, and burial in a rich man's tomb as the precise fulfillment of Isaiah's Suffering Servant.",
    historicalEvidence:
      "The Great Isaiah Scroll is the single most important manuscript witness. Of the 166 words in Isaiah 53, only one word (three letters \u2014 \"light\" in verse 11) differs substantially between the Dead Sea Scroll and the Masoretic Text after a millennium of transmission. The additional word \"light\" in 53:11 \"signifies the hope of something more \u2014 life beyond death, or resurrection.\" Scribal variants in the Qumran Isaiah scroll reflected \"deliberate alteration of the Hebrew text in order to produce the desired messianic interpretations.\"",
  },
  {
    id: 20,
    slug: "crucifixion-psalm",
    title: "The Crucifixion Psalm",
    category: "suffering",
    categoryLabel: "Suffering & Death",
    summary:
      "A psalm describing pierced hands and feet, divided garments, and mocking crowds \u2014 centuries before crucifixion existed.",
    otReference: "Psalm 22:1, 7-8, 14-18",
    otText:
      "My God, my God, why have you forsaken me?... All who see me mock me; they hurl insults, shaking their heads. \"He trusts in the LORD,\" they say, \"let the LORD rescue him.\"... I am poured out like water, and all my bones are out of joint... they pierce my hands and my feet... people stare and gloat over me. They divide my clothes among them and cast lots for my garment.",
    dateWritten: "~1000 BCE",
    manuscriptAttestation:
      "Multiple Dead Sea Scrolls Psalms manuscripts; key textual issue in verse 16 \u2014 some Dead Sea Scroll witnesses and the Septuagint read \"they pierced\" while the Masoretic Text reads \"like a lion.\" All codices.",
    ancientJewishInterpretation:
      "Pesiqta Rabbati applies elements of this psalm to the suffering Messiah. The Yalkut on Isaiah 60 applies Psalm 22:7 to the Messiah.",
    ntReference: "Matthew 27:35, 39, 43, 46",
    ntText:
      "About three in the afternoon Jesus cried out in a loud voice, \"Eli, Eli, lema sabachthani?\" which means \"My God, my God, why have you forsaken me?\" ... They divided up his clothes by casting lots. (Matthew 27:46, 35)",
    narrativeContext:
      "The details match crucifixion with extraordinary precision: the cry of abandonment, public mocking, pierced hands and feet, bones out of joint (from hanging), garments divided by lot. David wrote this centuries before crucifixion was practiced.",
    historicalEvidence:
      "Crucifixion was invented by the Persians and adopted by Rome \u2014 it did not exist in David's time (~1000 BCE). Yet the psalm describes the exact physiological effects: dehydration (\"I am poured out like water\"), joint dislocation (\"all my bones are out of joint\"), and piercing of extremities. The Roman practice of dividing a victim's clothing among the execution squad is documented by multiple ancient sources. The discovery of the Yehohanan ossuary in Jerusalem (1968) \u2014 containing a heel bone with a crucifixion nail still embedded \u2014 confirmed Roman crucifixion practices in 1st century Judea.",
  },
  {
    id: 21,
    slug: "betrayal-by-friend",
    title: "Betrayal by a Close Friend",
    category: "suffering",
    categoryLabel: "Suffering & Death",
    summary:
      "A trusted companion who shared bread would turn against the righteous one.",
    otReference: "Psalm 41:9",
    otText:
      "Even my close friend, someone I trusted, one who shared my bread, has turned against me.",
    dateWritten: "~1000 BCE",
    manuscriptAttestation:
      "Dead Sea Scrolls Psalms manuscripts; all codices.",
    ancientJewishInterpretation:
      "Midrashic tradition applies David's experience as a pattern for the Messiah.",
    ntReference: "John 13:18",
    ntText:
      "I am not referring to all of you; I know those I have chosen. But this is to fulfill this passage of Scripture: \"He who shared my bread has turned against me.\"",
    narrativeContext:
      "Jesus explicitly cited Psalm 41:9 as fulfilled by Judas Iscariot's betrayal, emphasizing that Judas was an intimate companion who had eaten at his table.",
    historicalEvidence:
      "The text is preserved in multiple Qumran Psalms manuscripts. Jesus' direct quotation of the psalm in the context of the Last Supper shows he understood his betrayal as the fulfillment of a Davidic pattern.",
  },
  {
    id: 22,
    slug: "thirty-pieces-of-silver",
    title: "Thirty Pieces of Silver",
    category: "suffering",
    categoryLabel: "Suffering & Death",
    summary:
      "The shepherd-king valued at thirty silver pieces \u2014 the price of a slave \u2014 thrown to the potter.",
    otReference: "Zechariah 11:12-13",
    otText:
      "I told them, \"If you think it best, give me my pay; but if not, keep it.\" So they paid me thirty pieces of silver. And the LORD said to me, \"Throw it to the potter\" \u2014 the handsome price at which they valued me!",
    dateWritten: "~520 BCE",
    manuscriptAttestation:
      "Dead Sea Scrolls Zechariah fragments; all codices.",
    ancientJewishInterpretation:
      "Bereshit Rabbah 98 connects this with messianic themes.",
    ntReference: "Matthew 26:15; Matthew 27:3-10",
    ntText:
      "They counted out for him thirty pieces of silver. (Matthew 26:15)\n\nSo Judas threw the money into the temple and left. Then he went away and hanged himself. The chief priests picked up the coins... they used them to buy the potter's field. (Matthew 27:5-7)",
    narrativeContext:
      "Judas was paid exactly thirty pieces of silver to betray Jesus. When he returned the money in remorse, the priests used it to buy a potter's field \u2014 matching Zechariah's imagery of the money being thrown \"to the potter.\"",
    historicalEvidence:
      "Thirty pieces of silver was the price of a slave under Mosaic law (Exodus 21:32), making it a deliberately contemptuous valuation. Zechariah manuscripts from the Dead Sea Scrolls confirm the text. The \"potter's field\" (Akeldama) in Jerusalem has been identified since antiquity and is documented by early Christian pilgrims.",
  },
  {
    id: 23,
    slug: "shepherd-struck",
    title: "The Shepherd Struck",
    category: "suffering",
    categoryLabel: "Suffering & Death",
    summary:
      "God's sword would strike his shepherd \u2014 the man close to him \u2014 and the sheep would scatter.",
    otReference: "Zechariah 13:7",
    otText:
      "Awake, sword, against my shepherd, against the man who is close to me! declares the LORD Almighty. Strike the shepherd, and the sheep will be scattered.",
    dateWritten: "~520 BCE",
    manuscriptAttestation:
      "Dead Sea Scrolls Zechariah fragments; all codices.",
    ancientJewishInterpretation:
      "God calls this shepherd \"the man who is close to me\" (amiti) \u2014 a term implying equality or intimate association with God.",
    ntReference: "Matthew 26:31",
    ntText:
      "Then Jesus told them, \"This very night you will all fall away on account of me, for it is written: 'I will strike the shepherd, and the sheep of the flock will be scattered.'\"",
    narrativeContext:
      "Jesus quoted Zechariah 13:7 to predict that his disciples would scatter when he was arrested \u2014 which is exactly what happened in the Garden of Gethsemane.",
    historicalEvidence:
      "The Hebrew term amiti (\"my associate/companion\") is used only here in the Old Testament in reference to a person's relationship with God. It implies the shepherd stands on equal footing with YHWH, which is an extraordinary claim for a human figure. The text is confirmed in Qumran Zechariah fragments.",
  },
  {
    id: 24,
    slug: "the-pierced-one",
    title: "The Pierced One",
    category: "suffering",
    categoryLabel: "Suffering & Death",
    summary:
      "God speaks of one whom \"they have pierced\" \u2014 mourned as an only son by all Jerusalem.",
    otReference: "Zechariah 12:10",
    otText:
      "And I will pour out on the house of David and the inhabitants of Jerusalem a spirit of grace and supplication. They will look on me, the one they have pierced, and they will mourn for him as one mourns for an only child.",
    dateWritten: "~520 BCE",
    manuscriptAttestation:
      "Dead Sea Scrolls Zechariah fragments; all codices.",
    ancientJewishInterpretation:
      "Talmud Sukkah 52a discusses this passage in connection with Mashiach ben Yosef \u2014 a suffering messianic figure. The shift between \"me\" (first person, God speaking) and \"him\" (third person) creates a mysterious identification.",
    ntReference: "John 19:37; Revelation 1:7",
    ntText:
      "As another scripture says, \"They will look on the one they have pierced.\" (John 19:37)\n\n\"Look, he is coming with the clouds, and every eye will see him, even those who pierced him.\" (Revelation 1:7)",
    narrativeContext:
      "John applies this to Jesus' crucifixion, specifically the moment when a Roman soldier pierced Jesus' side with a spear. Revelation projects the fulfillment forward to a future universal recognition.",
    historicalEvidence:
      "The Talmud's discussion of a \"Messiah son of Joseph\" who suffers and dies (Sukkah 52a) shows that even rabbinic Judaism acknowledged a suffering messianic figure based on Zechariah 12:10. The interchange between \"me\" and \"him\" suggests the pierced figure is somehow identified with God himself \u2014 a theologically charged reading confirmed by the Dead Sea Scrolls text.",
  },
  {
    id: 25,
    slug: "seventy-weeks",
    title: "The Seventy Weeks",
    category: "suffering",
    categoryLabel: "Suffering & Death",
    summary:
      "A precise timeline of 490 years foretelling when the Anointed One would come and be \"cut off.\"",
    otReference: "Daniel 9:24-26",
    otText:
      "Seventy 'sevens' are decreed for your people and your holy city to finish transgression, to put an end to sin, to atone for wickedness, to bring in everlasting righteousness... After the sixty-two 'sevens,' the Anointed One will be put to death and will have nothing.",
    dateWritten: "~530 BCE",
    manuscriptAttestation:
      "Eight copies of Daniel found at Qumran; 4QApocryphon of Daniel describes a figure called \"Son of God\" and \"Son of the Most High\"; all codices.",
    ancientJewishInterpretation:
      "Talmud Nazir 32b; Yalkut. The Qumran community was deeply interested in Daniel's chronological prophecies.",
    ntReference: "Luke 3:1",
    ntText:
      "In the fifteenth year of the reign of Tiberius Caesar \u2014 when Pontius Pilate was governor of Judea... the word of God came to John son of Zechariah in the wilderness. (Luke 3:1-2)",
    narrativeContext:
      "Daniel's prophecy provides a timeline: the Anointed One would come and then \"be cut off\" (killed) before the destruction of the city and temple. The Second Temple was destroyed in 70 CE, making any fulfillment necessarily pre-70 CE.",
    historicalEvidence:
      "Daniel manuscripts from Qumran confirm the book existed by the 2nd century BCE at latest. The chronological calculation from Artaxerxes' decree (457 BCE) counting 483 years (69 \u00d7 7) arrives at approximately 27 CE \u2014 the period of Jesus' public ministry. The prophecy also predicts the subsequent destruction of the temple, which occurred in 70 CE \u2014 an event documented by Josephus in The Jewish War.",
  },
  {
    id: 26,
    slug: "passover-lamb",
    title: "The Passover Lamb",
    category: "suffering",
    categoryLabel: "Suffering & Death",
    summary:
      "The Passover lamb: without defect, its blood on the doorframe, and none of its bones broken.",
    otReference: "Exodus 12:5-7, 46",
    otText:
      "The animals you choose must be year-old males without defect... they are to take some of the blood and put it on the sides and tops of the doorframes... Do not break any of the bones.",
    dateWritten: "~1400 BCE",
    manuscriptAttestation:
      "Extensive Qumran Exodus manuscripts; all codices.",
    ancientJewishInterpretation:
      "The Passover lamb as a type of messianic redemption is embedded in Jewish tradition. Isaiah 53:7 explicitly connects the Servant to a lamb: \"He was led like a lamb to the slaughter.\"",
    ntReference: "John 19:36; 1 Corinthians 5:7",
    ntText:
      "These things happened so that the scripture would be fulfilled: \"Not one of his bones will be broken.\" (John 19:36)\n\n\"Christ, our Passover lamb, has been sacrificed.\" (1 Corinthians 5:7)",
    narrativeContext:
      "Jesus was crucified during Passover. John notes that unlike the other crucified men, Jesus' legs were not broken (Roman practice to hasten death), fulfilling the Passover requirement. Paul directly identifies Jesus as \"our Passover lamb.\"",
    historicalEvidence:
      "Jesus' crucifixion during the Passover festival is attested in all four Gospels and is one of the most historically certain facts about his life, accepted even by skeptical scholars. The Roman practice of breaking legs (crurifragium) to hasten death is documented historically. The fact that Jesus' legs were not broken, while unusual, fulfilled the specific Passover regulation.",
  },
  {
    id: 27,
    slug: "day-of-atonement",
    title: "The Day of Atonement Scapegoat",
    category: "suffering",
    categoryLabel: "Suffering & Death",
    summary:
      "The scapegoat bore the sins of the people and was sent away into the wilderness.",
    otReference: "Leviticus 16:21-22",
    otText:
      "He is to lay both hands on the head of the live goat and confess over it all the wickedness and rebellion of the Israelites \u2014 all their sins \u2014 and put them on the goat's head. He shall send the goat away into the wilderness... The goat will carry on itself all their sins to a remote place.",
    dateWritten: "~1400 BCE",
    manuscriptAttestation:
      "Extensive Qumran Leviticus manuscripts; all codices.",
    ancientJewishInterpretation:
      "The Day of Atonement (Yom Kippur) scapegoat ritual was the central act of national atonement. Isaiah 53:6 echoes it: \"The LORD has laid on him the iniquity of us all.\"",
    ntReference: "Hebrews 9:28; 2 Corinthians 5:21",
    ntText:
      "So Christ was sacrificed once to take away the sins of many. (Hebrews 9:28)\n\n\"God made him who had no sin to be sin for us.\" (2 Corinthians 5:21)",
    narrativeContext:
      "The New Testament writers understood Jesus' death as the ultimate Day of Atonement \u2014 the sins of the people placed on one substitute who carries them away.",
    historicalEvidence:
      "The Yom Kippur ritual is extensively documented in the Mishnah (tractate Yoma), which preserves detailed descriptions of the Second Temple ceremony. The concept of substitutionary atonement through a sin-bearer was not a Christian invention but was the central mechanism of Israel's most sacred annual ritual.",
  },
  {
    id: 28,
    slug: "lord-comes-to-temple",
    title: "The LORD Comes to His Temple",
    category: "suffering",
    categoryLabel: "Suffering & Death",
    summary:
      "The glory of the Second Temple would surpass the First \u2014 requiring a messianic visitation before 70 CE.",
    otReference: "Haggai 2:6-9",
    otText:
      "In a little while I will once more shake the heavens and the earth, the sea and the dry land. I will shake all nations, and what is desired by all nations will come, and I will fill this house with glory, says the LORD Almighty. The glory of this present house will be greater than the glory of the former house.",
    dateWritten: "~520 BCE",
    manuscriptAttestation:
      "Dead Sea Scrolls Minor Prophets fragments; all codices.",
    ancientJewishInterpretation:
      "Debarim Rabbah 1 applies this messianically.",
    ntReference: "Luke 2:27-32",
    ntText:
      "Simeon took him in his arms and praised God, saying: \"Sovereign Lord, as you have promised, you may now dismiss your servant in peace. For my eyes have seen your salvation, which you have prepared in the sight of all nations.\" (Luke 2:28-31)",
    narrativeContext:
      "Haggai prophesied that the glory of the Second Temple would surpass the First Temple. The Second Temple was destroyed in 70 CE, requiring any fulfillment before that date.",
    historicalEvidence:
      "The Second Temple stood from approximately 516 BCE to 70 CE. Haggai's prophecy that its glory would exceed Solomon's Temple requires a messianic visitation during this window. The destruction of the Temple in 70 CE (documented by Josephus and confirmed by archaeology) creates an absolute historical deadline.",
  },
  {
    id: 29,
    slug: "messenger-of-the-covenant",
    title: "Messenger of the Covenant",
    category: "suffering",
    categoryLabel: "Suffering & Death",
    summary:
      "The Lord would suddenly come to his temple as the messenger of the covenant.",
    otReference: "Malachi 3:1-4",
    otText:
      "Then suddenly the Lord you are seeking will come to his temple; the messenger of the covenant, whom you desire, will come, says the LORD Almighty. But who can endure the day of his coming?",
    dateWritten: "~430 BCE",
    manuscriptAttestation:
      "Dead Sea Scrolls Minor Prophets fragments; all codices.",
    ancientJewishInterpretation:
      "Pirqe de Rabbi Eliezer ch. 29; Bemidbar Rabbah 17.",
    ntReference: "Mark 11:15-17",
    ntText:
      "On reaching Jerusalem, Jesus entered the temple courts and began driving out those who were buying and selling there. He overturned the tables of the money changers... \"Is it not written: 'My house will be called a house of prayer for all nations'?\" (Mark 11:15-17)",
    narrativeContext:
      "Jesus' cleansing of the Temple was an act of messianic authority \u2014 the \"Lord\" suddenly coming to \"his temple\" as Malachi predicted.",
    historicalEvidence:
      "Like Haggai 2, this prophecy requires the Messiah to come to the Second Temple while it still stands. The Temple's destruction in 70 CE creates a hard historical deadline. Jesus' Temple cleansing is recorded in all four Gospels and is considered one of the most historically reliable Gospel events by mainstream scholarship.",
  },

  // ============================================
  // Category: Resurrection & Exaltation
  // ============================================
  {
    id: 30,
    slug: "not-abandoned-to-sheol",
    title: "Not Abandoned to Sheol",
    category: "resurrection",
    categoryLabel: "Resurrection & Exaltation",
    summary:
      "God's faithful one would not be abandoned to the grave or allowed to see decay.",
    otReference: "Psalm 16:10",
    otText:
      "Because you will not abandon me to the realm of the dead, nor will you let your faithful one see decay.",
    dateWritten: "~1000 BCE",
    manuscriptAttestation:
      "Multiple Dead Sea Scrolls Psalms manuscripts; all codices.",
    ancientJewishInterpretation:
      "Since David himself died and was buried, the psalm was understood as pointing beyond David to a greater figure.",
    ntReference: "Acts 2:25-32",
    ntText:
      "David said about him... \"you will not abandon me to the realm of the dead\"... God has raised this Jesus to life, and we are all witnesses of it. (Acts 2:25, 31-32)",
    narrativeContext:
      "Peter argued that David could not have been speaking about himself (since David died and his tomb was known), therefore the psalm prophesied the Messiah's resurrection.",
    historicalEvidence:
      "David's tomb was a known landmark in Jerusalem in the 1st century CE. Peter's argument depended on this public knowledge \u2014 everyone knew David had died and remained buried, so Psalm 16:10 must refer to someone else whose body would not undergo decay. The claim of Jesus' resurrection was made publicly in Jerusalem within weeks of the event, in a context where it could have been easily disproven if false.",
  },
  {
    id: 31,
    slug: "resurrection-of-the-dead",
    title: "The Resurrection of the Dead",
    category: "resurrection",
    categoryLabel: "Resurrection & Exaltation",
    summary:
      "God would open graves and bring his people up from them \u2014 the Messiah would raise the dead.",
    otReference: "Ezekiel 37:12-14",
    otText:
      "I am going to open your graves and bring you up from them; I will bring you back to the land of Israel. Then you, my people, will know that I am the LORD, when I open your graves and bring you up from them.",
    dateWritten: "~580 BCE",
    manuscriptAttestation:
      "Qumran Ezekiel fragments; Messianic Apocalypse (4Q521) explicitly connects resurrection with the Messiah; all codices.",
    ancientJewishInterpretation:
      "The Dead Sea Scrolls Messianic Apocalypse (4Q521) lists \"raising the dead\" among the works the Messiah would perform, drawing on Ezekiel 37 and Isaiah 26:19. Belief in bodily resurrection was mainstream in Pharisaic Judaism.",
    ntReference: "John 11:25; Romans 6:5",
    ntText:
      "Jesus said to her, \"I am the resurrection and the life. The one who believes in me will live, even though they die.\" (John 11:25)",
    narrativeContext:
      "Jesus not only claimed to fulfill the resurrection promise but demonstrated it by raising Lazarus and, ultimately, by his own resurrection.",
    historicalEvidence:
      "The Messianic Apocalypse (4Q521) is critical evidence. This pre-Christian Jewish text explicitly states that the Messiah would raise the dead. This was not a Christian invention but a Jewish expectation documented in the Dead Sea Scrolls approximately a century before Jesus.",
  },
  {
    id: 32,
    slug: "son-of-man",
    title: "The Son of Man",
    category: "resurrection",
    categoryLabel: "Resurrection & Exaltation",
    summary:
      "A divine figure \"like a son of man\" would receive universal authority, glory, and an everlasting kingdom.",
    otReference: "Daniel 7:13-14",
    otText:
      "In my vision at night I looked, and there before me was one like a son of man, coming with the clouds of heaven. He approached the Ancient of Days and was led into his presence. He was given authority, glory and sovereign power; all nations and peoples of every language worshiped him.",
    dateWritten: "~530 BCE",
    manuscriptAttestation:
      "Eight copies of Daniel at Qumran; 4QApocryphon of Daniel; all codices.",
    ancientJewishInterpretation:
      "Talmud Sanhedrin 98a discusses this in messianic context. Saadiah Gaon identified the Son of Man as the Messiah. The Qumran 4QApocryphon of Daniel describes a figure called \"Son of God\" and \"Son of the Most High\" in language echoing Daniel.",
    ntReference: "Matthew 26:64",
    ntText:
      "\"You will see the Son of Man sitting at the right hand of the Mighty One and coming on the clouds of heaven.\" (Matthew 26:64)",
    narrativeContext:
      "Jesus consistently identified himself as Daniel's \"Son of Man,\" a figure who receives universal worship and an everlasting kingdom from God \u2014 a claim that constituted the charge of blasphemy at his trial.",
    historicalEvidence:
      "The eight copies of Daniel found at Qumran confirm the book's antiquity. The 4QApocryphon of Daniel, written in the 1st century BCE, uses the phrases \"Son of God\" and \"Son of the Most High\" \u2014 the same language the angel Gabriel uses to describe Jesus in Luke 1:32, 35. This Dead Sea Scroll demonstrates that the concept of a divine messianic figure was present in pre-Christian Judaism.",
  },
  {
    id: 33,
    slug: "priest-king-melchizedek",
    title: "The Priest-King After Melchizedek",
    category: "resurrection",
    categoryLabel: "Resurrection & Exaltation",
    summary:
      "The LORD's anointed would sit at God's right hand as an eternal priest in the order of Melchizedek.",
    otReference: "Psalm 110:1, 4",
    otText:
      "The LORD says to my lord: \"Sit at my right hand until I make your enemies a footstool for your feet.\"... The LORD has sworn and will not change his mind: \"You are a priest forever, in the order of Melchizedek.\"",
    dateWritten: "~1000 BCE",
    manuscriptAttestation:
      "Dead Sea Scrolls Psalms manuscripts; 11QMelchizedek (11Q13) identifies Melchizedek as a heavenly, divine messianic figure; all codices.",
    ancientJewishInterpretation:
      "Targum on Psalms; Midrash on Psalm 2; Midrash on Psalm 36. The Qumran Melchizedek Document (11Q13) is extraordinary \u2014 it identifies Melchizedek as a divine judge who will appear at the end of the tenth jubilee, proclaim liberty, and atone for the righteous. The document applies the title Elohim (\"God\") to Melchizedek.",
    ntReference: "Hebrews 5-7; Matthew 22:41-45",
    ntText:
      "Jesus asked them, \"How is it then that David, speaking by the Spirit, calls him 'Lord'? ... If then David calls him 'Lord,' how can he be his son?\" (Matthew 22:43, 45)",
    narrativeContext:
      "Psalm 110 is the most frequently quoted Old Testament passage in the New Testament. Jesus used it to argue that the Messiah was more than a human descendant of David \u2014 he was David's Lord.",
    historicalEvidence:
      "The Qumran Melchizedek Document (11Q13) is one of the most remarkable Dead Sea Scrolls discoveries. Dating to the late 2nd or early 1st century BCE, it presents Melchizedek as a heavenly, divine figure who unites priestly atonement and kingly judgment \u2014 precisely the role the New Testament assigns to Jesus. The document applies Isaiah 52:7 and Psalm 82:1 to Melchizedek. This proves pre-Christian Jews at Qumran already held a concept of a divine messianic deliverer who combined the roles of priest and king.",
  },
  {
    id: 34,
    slug: "lords-anointed-son",
    title: "The LORD's Anointed Son",
    category: "resurrection",
    categoryLabel: "Resurrection & Exaltation",
    summary:
      "Kings and rulers conspire against the LORD's Anointed \u2014 whom God declares \"my Son.\"",
    otReference: "Psalm 2:2, 6-7",
    otText:
      "The kings of the earth rise up and the rulers band together against the LORD and against his anointed... \"I have installed my king on Zion, my holy mountain.\" He said to me, \"You are my son; today I have become your father.\"",
    dateWritten: "~1000 BCE",
    manuscriptAttestation:
      "Multiple Dead Sea Scrolls Psalms manuscripts; all codices.",
    ancientJewishInterpretation:
      "Talmud Berakhot 7b; Abodah Zarah 3b; Sukkah 52a. The Midrash on 1 Samuel 16:1 connects Psalm 2:6 with the suffering of the Messiah and Isaiah 53. Multiple Midrashim and Pirqe de Rabbi Eliezer ch. 28 apply this psalm to the Messiah.",
    ntReference: "Acts 13:33; Acts 4:25-28",
    ntText:
      "He has fulfilled for us, their children, by raising up Jesus. As it is written in the second Psalm: \"You are my son; today I have become your father.\" (Acts 13:33)",
    narrativeContext:
      "The early church understood the alliance of Herod and Pilate against Jesus as the fulfillment of \"kings and rulers\" conspiring against God's Anointed (Messiah/Christ).",
    historicalEvidence:
      "Psalm 2 is one of the most explicitly messianic psalms. The Midrash on 1 Samuel 16:1 is particularly significant because it connects Psalm 2:6 with Isaiah 53, showing that ancient rabbis already linked the messianic king with the suffering servant \u2014 the same connection Christians make. The 36 copies of Psalms at Qumran confirm the text.",
  },

  // ============================================
  // Category: Eternal Kingdom
  // ============================================
  {
    id: 35,
    slug: "eternal-throne",
    title: "The Eternal Throne",
    category: "kingdom",
    categoryLabel: "Eternal Kingdom",
    summary:
      "The king addressed as \"God\" would reign forever with a scepter of justice.",
    otReference: "Psalm 45:6-7",
    otText:
      "Your throne, O God, will last for ever and ever; a scepter of justice will be the scepter of your kingdom. You love righteousness and hate wickedness; therefore God, your God, has set you above your companions by anointing you with the oil of joy.",
    dateWritten: "~1000 BCE",
    manuscriptAttestation:
      "Dead Sea Scrolls Psalms manuscripts; all codices.",
    ancientJewishInterpretation:
      "The Targum identifies the king as the Messiah. The psalm addresses the king as \"God\" (Elohim) while simultaneously distinguishing him from \"God, your God\" \u2014 creating the paradox of a divine yet distinct messianic figure. Bereshit Rabbah 99 connects this with the non-departing scepter of Genesis 49:10.",
    ntReference: "Hebrews 1:8-9",
    ntText:
      "But about the Son he says, \"Your throne, O God, will last for ever and ever; a scepter of justice will be the scepter of your kingdom.\"",
    narrativeContext:
      "The New Testament applies this royal wedding psalm directly to Jesus, arguing that the Messiah is addressed as \"God\" in the Hebrew Scriptures themselves.",
    historicalEvidence:
      "The Targum's messianic identification and the psalm's address of the king as \"Elohim\" (God) are significant. Bereshit Rabbah 99 linking Psalm 45 to Genesis 49:10's scepter prophecy shows the rabbis saw a unified messianic thread connecting these texts. The Dead Sea Scrolls Psalms manuscripts confirm the text.",
  },
  {
    id: 36,
    slug: "seed-of-david",
    title: "The Seed of David / Eternal Kingdom",
    category: "kingdom",
    categoryLabel: "Eternal Kingdom",
    summary:
      "God's covenant with David: his offspring would have an eternal throne and a father-son relationship with God.",
    otReference: "2 Samuel 7:12-14, 16",
    otText:
      "When your days are over and you rest with your ancestors, I will raise up your offspring to succeed you... I will establish the throne of his kingdom forever. I will be his father, and he will be my son... Your house and your kingdom will endure forever before me; your throne will be established forever.",
    dateWritten: "~1000 BCE",
    manuscriptAttestation:
      "Dead Sea Scrolls fragments; 4QFlorilegium (4Q174) explicitly interprets this as referring to the \"Branch of David\" at the end of days; all codices.",
    ancientJewishInterpretation:
      "4QFlorilegium from Qumran is the key text \u2014 it reads 2 Samuel 7 and says: \"This is the Branch of David who shall arise with the Interpreter of the Law... in the last days.\" The Davidic covenant is the foundation of all messianic kingship.",
    ntReference: "Luke 1:32-33",
    ntText:
      "The Lord God will give him the throne of his father David, and he will reign over Jacob's descendants forever; his kingdom will never end. (Luke 1:32-33)",
    narrativeContext:
      "The angel's announcement to Mary explicitly echoes the Davidic covenant, placing Jesus on David's eternal throne.",
    historicalEvidence:
      "The 4QFlorilegium (4Q174) is direct manuscript evidence from Qumran that 2 Samuel 7 was interpreted as a messianic prophecy about the \"Branch of David\" who would arise in the last days. This pre-Christian Jewish document proves the Davidic covenant was understood messianically.",
  },
  {
    id: 37,
    slug: "melchizedek-divine-judge",
    title: "The Melchizedek Figure / Divine Judge",
    category: "kingdom",
    categoryLabel: "Eternal Kingdom",
    summary:
      "A pre-Christian Dead Sea Scroll portrays Melchizedek as a divine messianic deliverer who atones and judges.",
    otReference:
      "11QMelchizedek (drawing on Leviticus 25:13, Isaiah 61:1-2, Isaiah 52:7, Psalm 82:1-2, Psalm 7:8-9)",
    otText:
      "The 11QMelchizedek scroll from Qumran Cave 11 draws on multiple Old Testament texts to construct a portrait of a divine messianic deliverer who combines priestly atonement, kingly judgment, and the proclamation of liberty from Isaiah 61.",
    dateWritten:
      "Compiled from OT texts spanning 1400-700 BCE; the scroll itself dates to late 2nd or early 1st century BCE",
    manuscriptAttestation: "11QMelchizedek (11Q13) from Qumran Cave 11.",
    ancientJewishInterpretation:
      "This Qumran document identifies Melchizedek as a heavenly figure who will appear at the end of the tenth jubilee to execute judgment, proclaim liberty (Isaiah 61:1-2), and atone for the righteous. The document applies the title Elohim (\"God\") to Melchizedek and connects Psalm 82:1 (\"God stands in the divine assembly\") and Isaiah 52:7 (\"Your God reigns\") to this figure.",
    ntReference: "Hebrews 7:1-3",
    ntText:
      "This Melchizedek was king of Salem and priest of God Most High... Without father or mother, without genealogy, without beginning of days or end of life, resembling the Son of God, he remains a priest forever.",
    narrativeContext:
      "The author of Hebrews presents Melchizedek as a type of Christ \u2014 an eternal priest-king who transcends the Levitical system.",
    historicalEvidence:
      "11QMelchizedek is not a biblical text but a pre-Christian Jewish interpretation of biblical texts. Its significance is that it demonstrates Jews at Qumran already held a concept of a divine messianic figure who combined priestly atonement, kingly judgment, and the proclamation of Isaiah 61 \u2014 precisely the composite role the New Testament ascribes to Jesus. The document dates to approximately 100 years before Jesus and represents the most developed pre-Christian messianic theology found in the Dead Sea Scrolls.",
  },
];
