// ─────────────────────────────────────────────────────────────────────────────
// Hood Hymns Publishing — Internationalization (i18n)
//
// HOW TO UPDATE TRANSLATIONS:
//   • Edit the `translations` object below — no UI changes needed.
//   • Add a new language by adding a new key to `translations` and
//     a matching entry to `LANGUAGES`.
//   • The `voicePreset` per language maps to the TTS API's language+voice.
// ─────────────────────────────────────────────────────────────────────────────

export type Locale = "en" | "es" | "zh";

export interface LanguageMeta {
  code: Locale;
  label: string;        // Display name in its own language
  flag: string;         // Emoji flag
  dir: "ltr" | "rtl";
  /** Gemini TTS language code for this locale */
  ttsLang: string;
  /** Gemini TTS voice name for this locale */
  ttsVoice: string;
  /** Style prompt prefix guiding voice delivery */
  ttsStyle: string;
}

export const LANGUAGES: LanguageMeta[] = [
  {
    code: "en",
    label: "English",
    flag: "🇺🇸",
    dir: "ltr",
    ttsLang: "en-US",
    ttsVoice: "Zephyr",
    ttsStyle: "You are a deep-voiced African American male narrator from Detroit, Michigan. Speak with the distinctive Detroit accent: use the Inland North nasal 'a' sound, blend syllables naturally at a swift pace, and employ the wide-ranging melodic intonation pattern of African-American Vernacular English. Your cadence should be rhythmic and soulful — like a street preacher who grew up on Motown, telling a testimony to a congregation. Deliberate pauses for emphasis. Let the words breathe. This is a story of faith, family, and the hood — tell it like you lived it.",
  },
  {
    code: "es",
    label: "Español",
    flag: "🇪🇸",
    dir: "ltr",
    ttsLang: "es-ES",
    ttsVoice: "Zephyr",
    ttsStyle: "Lee este pasaje con un tono cálido y cadencioso de narrador del sur — como un testimonio compartido en comunidad.",
  },
  {
    code: "zh",
    label: "中文",
    flag: "🇨🇳",
    dir: "ltr",
    ttsLang: "zh-CN",
    ttsVoice: "Zephyr",
    ttsStyle: "用温暖、深沉、富有感情的叙事语调朗读这段文字 — 如同在讲述一个充满信仰的生命故事。",
  },
];

export const DEFAULT_LOCALE: Locale = "en";

// ── UI String Translations ─────────────────────────────────────────────────────
export interface UIStrings {
  // Nav
  home: string;
  experience: string;
  store: string;
  watchListen: string;
  about: string;
  freeChapter: string;
  films: string;
  content: string;
  subscribe: string;
  // Hero / Home
  heroTag: string;
  heroHeadline: string;
  heroSubhead: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  // Store preview on home
  officialMerch: string;
  theVault: string;
  viewAllProducts: string;
  // Listen / Experience Page
  listenTitle: string;
  listenSubtitle: string;
  pageTagline: string;
  watchTrailer: string;
  listenAuthor: string;
  readOpening: string;
  officialTrailer: string;
  cinemaPreview: string;
  playPreview: string;
  watchOfficialTrailer: string;
  comingSoon: string;
  nowPlaying: string;
  readyForMore: string;
  ownTheBook: string;
  shopCollection: string;
  // Audio Player
  playNarrative: string;
  playAgain: string;
  pauseNarrative: string;
  resume: string;
  stop: string;
  generatingVoice: string;
  studioRecording: string;
  geminiVoice: string;
  browserVoice: string;
  // Store
  storeTitle: string;
  storeSubtitle: string;
  addToCart: string;
  notifyMe: string;
  upcoming: string;
  buyNow: string;
  seriesLabel: string;
  // About
  aboutTitle: string;
  aboutSubtitle: string;
  biographyLabel: string;
  debutNovel: string;
  nowAvailable: string;
  getTheBook: string;
  theUniverse: string;
  universeHeading: string;
  universeBody: string;
  exploreStore: string;
  shopBooks: string;
  listenRead: string;
  // Free Chapter
  exclusiveTag: string;
  freeChapterTitle: string;
  freeChapterSubtitle: string;
  freeChapterCta: string;
  emailPlaceholder: string;
  noSpam: string;
  freeBadge: string;
  // Subscribe
  subscribeTitle: string;
  subscribeSubtitle: string;
  subscribeCta: string;
  fullName: string;
  yourName: string;
  emailAddress: string;
  emailPlaceholder2: string;
  interestedIn: string;
  privacyNote: string;
  comingDate: string;
  freeStageTitle: string;
  freeStageBody: string;
  premiumTitle: string;
  premiumBody: string;
  // Films
  filmsTitle: string;
  filmsSubtitle: string;
  // Content
  contentTitle: string;
  contentSubtitle: string;
  // Footer
  footerTagline: string;
  footerLinks: string;
  footerRights: string;
  footerQuickLinks: string;
  footerCommunity: string;
  // Testimonials
  testimonialsTitle: string;
  testimonialsHeading: string;
  testimonialsSubtitle: string;
  leaveReview: string;
  reviewName: string;
  reviewLocation: string;
  reviewSeries: string;
  reviewRating: string;
  reviewText: string;
  reviewPlaceholder: string;
  submitReview: string;
  reviewThanks: string;
  reviewThanksBody: string;
  reviewSubtitle: string;
  reviewDisclaimer: string;
  // Exit Popup
  exitPopupTag: string;
  exitPopupHeading: string;
  exitPopupBody: string;
  exitPopupCta: string;
  exitPopupNoSpam: string;
  exitPopupSuccess: string;
  exitPopupSuccessBody: string;
  exitPopupClose: string;
  // General
  readMore: string;
  backToHome: string;
}

export const translations: Record<Locale, UIStrings> = {
  en: {
    // Nav
    home: "Home",
    experience: "Experience",
    store: "Store",
    watchListen: "Watch & Listen",
    about: "About C.D. Howell",
    freeChapter: "Free Chapter",
    films: "Films",
    content: "Content",
    subscribe: "Subscribe",
    // Hero
    heroTag: "Digital Exclusive Available Now",
    heroHeadline: "Hood Hymns — Positive stories rooted in the streets",
    heroSubhead: "Faith-based urban fiction from Detroit. By C.D. Howell. Published by Hood Hymns Publishing.",
    heroCtaPrimary: "Get the Free Chapter",
    heroCtaSecondary: "Browse the Store",
    // Store home preview
    officialMerch: "Official Merchandise",
    theVault: "The Vault",
    viewAllProducts: "View All Products",
    // Listen / Experience
    listenTitle: "Watch & Listen",
    listenSubtitle: "Hear the stories come alive — narrated by the author.",
    pageTagline: "Hood Hymns Publishing",
    watchTrailer: "Watch the Trailer",
    listenAuthor: "Listen to the Author",
    readOpening: "Read the Opening",
    officialTrailer: "Official Trailer",
    cinemaPreview: "Book Trailer Preview",
    playPreview: "Play Preview",
    watchOfficialTrailer: "Watch Trailer",
    comingSoon: "Coming Soon",
    nowPlaying: "Now Playing · Cinematic Preview",
    readyForMore: "Ready to go deeper?",
    ownTheBook: "Own the Book",
    shopCollection: "Shop the Collection",
    // Player
    playNarrative: "Play Narrative",
    playAgain: "Play Again",
    pauseNarrative: "Pause",
    resume: "Resume",
    stop: "Stop",
    generatingVoice: "Generating voice…",
    studioRecording: "Studio Recording",
    geminiVoice: "Gemini AI Voice",
    browserVoice: "Browser Voice",
    // Store
    storeTitle: "The Store",
    storeSubtitle: "Books, merch, and Block to Blessing drops — shipped worldwide.",
    addToCart: "Add to Cart",
    notifyMe: "Notify Me",
    upcoming: "Coming Soon",
    buyNow: "Buy Now",
    seriesLabel: "Series",
    // About
    aboutTitle: "About C.D. Howell",
    aboutSubtitle: "Author. Musician. Storyteller. Detroit.",
    biographyLabel: "Biography",
    debutNovel: "Debut Novel",
    nowAvailable: "Now Available",
    getTheBook: "Get the Book",
    theUniverse: "The Literary Universe",
    universeHeading: "Two Series. One Vision.",
    universeBody: "C.D. Howell is building a faith-fueled publishing universe — from Detroit street drama to redemption stories. Each series explores faith, family, music, and the journey home.",
    exploreStore: "Explore the Store",
    shopBooks: "Shop the Books",
    listenRead: "Watch & Listen",
    // Free Chapter
    exclusiveTag: "Exclusive Free Download",
    freeChapterTitle: "Read Chapter One — Free",
    freeChapterSubtitle: "Enter your email and we'll send the first chapter of The Harmonies of Hope straight to your inbox.",
    freeChapterCta: "Send My Free Chapter",
    emailPlaceholder: "your@email.com",
    noSpam: "We'll email you the PDF instantly. No spam, ever.",
    freeBadge: "FREE",
    // Subscribe
    subscribeTitle: "Stay in the Loop",
    subscribeSubtitle: "New drops, exclusive content, and behind-the-scenes updates from Hood Hymns Publishing.",
    subscribeCta: "Subscribe",
    fullName: "Full Name",
    yourName: "Your name",
    emailAddress: "Email Address",
    emailPlaceholder2: "your@email.com",
    interestedIn: "I'm interested in:",
    privacyNote: "We respect your privacy. Unsubscribe anytime with one click.",
    comingDate: "Coming 2026",
    freeStageTitle: "🎵 Free Tier",
    freeStageBody: "Read free chapters, listen to narratives, and join the community.",
    premiumTitle: "⭐ Inner Circle",
    premiumBody: "Early access, exclusive content, author notes, and merchandise discounts.",
    // Films
    filmsTitle: "Films",
    filmsSubtitle: "Cinematic adaptations and original short films — coming soon from Hood Hymns Studios.",
    // Content
    contentTitle: "Content Hub",
    contentSubtitle: "Shorts, clips, and behind-the-scenes content from the Hood Hymns universe.",
    // Footer
    footerTagline: "Hood Hymns — Positive stories rooted in the streets.",
    footerLinks: "Store · Watch & Listen · About · Free Chapter",
    footerRights: "© 2026 Hood Hymns Publishing. All rights reserved.",
    footerQuickLinks: "Quick Links",
    footerCommunity: "Community",
    // Testimonials
    testimonialsTitle: "Reader Testimonials",
    testimonialsHeading: "What Readers Are Saying",
    testimonialsSubtitle: "Real reviews from the Hood Hymns community.",
    leaveReview: "Leave a Review",
    reviewName: "Your Name",
    reviewLocation: "City, State (Optional)",
    reviewSeries: "Which Series?",
    reviewRating: "Your Rating",
    reviewText: "Your Review",
    reviewPlaceholder: "Share what you loved, what hit home, or what surprised you…",
    submitReview: "Submit Review",
    reviewThanks: "Thank You!",
    reviewThanksBody: "Your review has been submitted and is pending approval. We appreciate you supporting C.D. Howell's work.",
    reviewSubtitle: "Loved the book? Tell the community. Your review helps other readers discover Hood Hymns.",
    reviewDisclaimer: "All reviews are approved by our team before publishing.",
    // Exit Popup
    exitPopupTag: "Wait — Before You Go",
    exitPopupHeading: "Get Chapter One Free",
    exitPopupBody: "Read the opening chapter of The Harmonies of Hope — no strings attached.",
    exitPopupCta: "Send My Free Chapter →",
    exitPopupNoSpam: "No spam, ever. Unsubscribe anytime.",
    exitPopupSuccess: "Check Your Inbox!",
    exitPopupSuccessBody: "Your free chapter is on its way. Welcome to the community.",
    exitPopupClose: "Close",
    // General
    readMore: "Read More",
    backToHome: "Back to Home",
  },

  es: {
    // Nav
    home: "Inicio",
    experience: "Experiencia",
    store: "Tienda",
    watchListen: "Ver y Escuchar",
    about: "Sobre C.D. Howell",
    freeChapter: "Capítulo Gratis",
    films: "Películas",
    content: "Contenido",
    subscribe: "Suscribirse",
    // Hero
    heroTag: "Exclusiva Digital Disponible Ahora",
    heroHeadline: "Hood Hymns — Historias positivas arraigadas en las calles",
    heroSubhead: "Ficción urbana basada en la fe desde Detroit. Por C.D. Howell. Publicado por Hood Hymns Publishing.",
    heroCtaPrimary: "Obtener el Capítulo Gratis",
    heroCtaSecondary: "Explorar la Tienda",
    // Store home preview
    officialMerch: "Merchandising Oficial",
    theVault: "La Bóveda",
    viewAllProducts: "Ver Todos los Productos",
    // Listen / Experience
    listenTitle: "Ver y Escuchar",
    listenSubtitle: "Escucha las historias cobrar vida — narradas por el autor.",
    pageTagline: "Hood Hymns Publishing",
    watchTrailer: "Ver el Tráiler",
    listenAuthor: "Escuchar al Autor",
    readOpening: "Leer el Inicio",
    officialTrailer: "Tráiler Oficial",
    cinemaPreview: "Vista Previa Cinematográfica",
    playPreview: "Reproducir Vista Previa",
    watchOfficialTrailer: "Ver Tráiler",
    comingSoon: "Próximamente",
    nowPlaying: "Reproduciendo · Vista Previa Cinematográfica",
    readyForMore: "¿Listo para profundizar?",
    ownTheBook: "Consigue el Libro",
    shopCollection: "Ver la Colección",
    // Player
    playNarrative: "Reproducir Narración",
    playAgain: "Reproducir de Nuevo",
    pauseNarrative: "Pausa",
    resume: "Continuar",
    stop: "Detener",
    generatingVoice: "Generando voz…",
    studioRecording: "Grabación de Estudio",
    geminiVoice: "Voz IA Gemini",
    browserVoice: "Voz del Navegador",
    // Store
    storeTitle: "La Tienda",
    storeSubtitle: "Libros, merchandising y lanzamientos Block to Blessing — envío mundial.",
    addToCart: "Añadir al Carrito",
    notifyMe: "Notificarme",
    upcoming: "Próximamente",
    buyNow: "Comprar Ahora",
    seriesLabel: "Serie",
    // About
    aboutTitle: "Sobre C.D. Howell",
    aboutSubtitle: "Autor. Músico. Narrador. Detroit.",
    biographyLabel: "Biografía",
    debutNovel: "Novela Debut",
    nowAvailable: "Disponible Ahora",
    getTheBook: "Obtener el Libro",
    theUniverse: "El Universo Literario",
    universeHeading: "Dos Series. Una Visión.",
    universeBody: "C.D. Howell está construyendo un universo editorial impulsado por la fe — del drama callejero de Detroit a historias de redención. Cada serie explora la fe, la familia, la música y el camino de regreso a casa.",
    exploreStore: "Explorar la Tienda",
    shopBooks: "Comprar Libros",
    listenRead: "Ver y Escuchar",
    // Free Chapter
    exclusiveTag: "Descarga Exclusiva Gratuita",
    freeChapterTitle: "Lee el Capítulo Uno — Gratis",
    freeChapterSubtitle: "Ingresa tu correo y te enviaremos el primer capítulo de Las Armonías de la Esperanza directamente.",
    freeChapterCta: "Enviar Mi Capítulo Gratis",
    emailPlaceholder: "tu@correo.com",
    noSpam: "Te enviaremos el PDF al instante. Sin spam, nunca.",
    freeBadge: "GRATIS",
    // Subscribe
    subscribeTitle: "Mantente al Día",
    subscribeSubtitle: "Nuevos lanzamientos, contenido exclusivo y actualizaciones de Hood Hymns Publishing.",
    subscribeCta: "Suscribirse",
    fullName: "Nombre Completo",
    yourName: "Tu nombre",
    emailAddress: "Correo Electrónico",
    emailPlaceholder2: "tu@correo.com",
    interestedIn: "Me interesa:",
    privacyNote: "Respetamos tu privacidad. Cancela la suscripción en cualquier momento.",
    comingDate: "Próximamente 2026",
    freeStageTitle: "🎵 Nivel Gratuito",
    freeStageBody: "Lee capítulos gratuitos, escucha narrativas y únete a la comunidad.",
    premiumTitle: "⭐ Círculo Íntimo",
    premiumBody: "Acceso anticipado, contenido exclusivo, notas del autor y descuentos en merchandising.",
    // Films
    filmsTitle: "Películas",
    filmsSubtitle: "Adaptaciones cinematográficas y cortometrajes originales — próximamente de Hood Hymns Studios.",
    // Content
    contentTitle: "Centro de Contenido",
    contentSubtitle: "Shorts, clips y contenido detrás de cámaras del universo Hood Hymns.",
    // Footer
    footerTagline: "Hood Hymns — Historias positivas arraigadas en las calles.",
    footerLinks: "Tienda · Ver y Escuchar · El Autor · Capítulo Gratis",
    footerRights: "© 2026 Hood Hymns Publishing. Todos los derechos reservados.",
    footerQuickLinks: "Enlaces Rápidos",
    footerCommunity: "Comunidad",
    // Testimonials
    testimonialsTitle: "Testimonios de Lectores",
    testimonialsHeading: "Lo Que Dicen los Lectores",
    testimonialsSubtitle: "Reseñas reales de la comunidad de Hood Hymns.",
    leaveReview: "Dejar una Reseña",
    reviewName: "Tu Nombre",
    reviewLocation: "Ciudad, Estado (Opcional)",
    reviewSeries: "¿Qué serie leíste?",
    reviewRating: "Tu Valoración",
    reviewText: "Tu Reseña",
    reviewPlaceholder: "Comparte lo que amaste, lo que te impactó o lo que te sorprendió…",
    submitReview: "Enviar Reseña",
    reviewThanks: "¡Gracias!",
    reviewThanksBody: "Tu reseña ha sido enviada y está pendiente de aprobación. Apreciamos tu apoyo al trabajo de C.D. Howell.",
    reviewSubtitle: "¿Amaste el libro? Cuéntaselo a la comunidad. Tu reseña ayuda a otros lectores a descubrir Hood Hymns.",
    reviewDisclaimer: "Todas las reseñas son aprobadas por nuestro equipo antes de publicarse.",
    // Exit Popup
    exitPopupTag: "Espera — Antes de Irte",
    exitPopupHeading: "Obtén el Primer Capítulo Gratis",
    exitPopupBody: "Lee el capítulo inicial de Las Armonías de la Esperanza — sin compromiso.",
    exitPopupCta: "Envíame el Capítulo Gratis →",
    exitPopupNoSpam: "Sin spam, nunca. Cancela cuando quieras.",
    exitPopupSuccess: "¡Revisa tu Correo!",
    exitPopupSuccessBody: "Tu capítulo gratuito está en camino. Bienvenido a la comunidad.",
    exitPopupClose: "Cerrar",
    // General
    readMore: "Leer Más",
    backToHome: "Volver al Inicio",
  },

  zh: {
    // Nav
    home: "首页",
    experience: "体验",
    store: "商店",
    watchListen: "观看与聆听",
    about: "关于C.D. Howell",
    freeChapter: "免费章节",
    films: "影视",
    content: "内容中心",
    subscribe: "订阅",
    // Hero
    heroTag: "数字独家，现已上线",
    heroHeadline: "Hood Hymns — 植根于街头的积极故事",
    heroSubhead: "来自底特律的都市信仰小说。作者：C.D. Howell。由Hood Hymns Publishing出版。",
    heroCtaPrimary: "获取免费章节",
    heroCtaSecondary: "浏览商店",
    // Store home preview
    officialMerch: "官方周边",
    theVault: "精品库",
    viewAllProducts: "查看全部商品",
    // Listen / Experience
    listenTitle: "观看与聆听",
    listenSubtitle: "聆听故事活灵活现 — 由作者亲自讲述。",
    pageTagline: "Hood Hymns Publishing",
    watchTrailer: "观看预告片",
    listenAuthor: "聆听作者",
    readOpening: "阅读开篇",
    officialTrailer: "官方预告片",
    cinemaPreview: "电影预览",
    playPreview: "播放预览",
    watchOfficialTrailer: "观看预告",
    comingSoon: "即将推出",
    nowPlaying: "正在播放 · 电影预览",
    readyForMore: "准备深入了解？",
    ownTheBook: "购买书籍",
    shopCollection: "浏览系列",
    // Player
    playNarrative: "播放叙事",
    playAgain: "再次播放",
    pauseNarrative: "暂停",
    resume: "继续",
    stop: "停止",
    generatingVoice: "正在生成语音…",
    studioRecording: "录音室录音",
    geminiVoice: "Gemini 人工智能语音",
    browserVoice: "浏览器语音",
    // Store
    storeTitle: "商店",
    storeSubtitle: "书籍、周边商品和Block to Blessing系列 — 全球配送。",
    addToCart: "加入购物车",
    notifyMe: "通知我",
    upcoming: "即将推出",
    buyNow: "立即购买",
    seriesLabel: "系列",
    // About
    aboutTitle: "关于C.D. Howell",
    aboutSubtitle: "作家。音乐人。故事讲述者。底特律。",
    biographyLabel: "传记",
    debutNovel: "首部小说",
    nowAvailable: "现已上市",
    getTheBook: "获取书籍",
    theUniverse: "文学宇宙",
    universeHeading: "两个系列，一个愿景。",
    universeBody: "C.D. Howell 正在构建一个以信仰为动力的出版宇宙——从底特律街头戏剧到救赎故事。每个系列都探索信仰、家庭、音乐和归家之路。",
    exploreStore: "探索商店",
    shopBooks: "购买书籍",
    listenRead: "观看与聆听",
    // Free Chapter
    exclusiveTag: "独家免费下载",
    freeChapterTitle: "免费阅读第一章",
    freeChapterSubtitle: "输入您的电子邮件，我们将把《希望的和声》第一章直接发送到您的邮箱。",
    freeChapterCta: "发送免费章节",
    emailPlaceholder: "your@email.com",
    noSpam: "我们将立即将PDF发送到您的邮箱。绝无垃圾邮件。",
    freeBadge: "免费",
    // Subscribe
    subscribeTitle: "保持关注",
    subscribeSubtitle: "来自Hood Hymns Publishing的新品发布、独家内容和幕后更新。",
    subscribeCta: "订阅",
    fullName: "姓名",
    yourName: "您的姓名",
    emailAddress: "电子邮箱",
    emailPlaceholder2: "your@email.com",
    interestedIn: "我感兴趣的：",
    privacyNote: "我们尊重您的隐私。随时一键退订。",
    comingDate: "即将到来 2026",
    freeStageTitle: "🎵 免费层级",
    freeStageBody: "阅读免费章节、收听叙述，加入社区。",
    premiumTitle: "⭐ 核心圈子",
    premiumBody: "抢先体验、独家内容、作者笔记及周边商品折扣。",
    // Films
    filmsTitle: "影视",
    filmsSubtitle: "电影改编和原创短片 — 即将来自Hood Hymns Studios。",
    // Content
    contentTitle: "内容中心",
    contentSubtitle: "Hood Hymns宇宙的短片、剪辑和幕后内容。",
    // Footer
    footerTagline: "Hood Hymns — 植根于街头的积极故事。",
    footerLinks: "商店 · 观看与聆听 · 关于作者 · 免费章节",
    footerRights: "© 2026 Hood Hymns Publishing。保留所有权利。",
    footerQuickLinks: "快速链接",
    footerCommunity: "社区",
    // Testimonials
    testimonialsTitle: "读者评价",
    testimonialsHeading: "读者怎么说",
    testimonialsSubtitle: "来自Hood Hymns社区的真实评价。",
    leaveReview: "发表评价",
    reviewName: "您的姓名",
    reviewLocation: "城市、州（可选）",
    reviewSeries: "您读了哪个系列？",
    reviewRating: "您的评分",
    reviewText: "您的评价",
    reviewPlaceholder: "分享您喜欢的内容、触动您的部分，或让您感到惊喜的地方…",
    submitReview: "提交评价",
    reviewThanks: "感谢您！",
    reviewThanksBody: "您的评价已提交，正在审核中。感谢您对C.D. Howell作品的支持。",
    reviewSubtitle: "喜欢这本书？告诉社区吧。您的评价帮助其他读者发现Hood Hymns。",
    reviewDisclaimer: "所有评价在发布前均由我们的团队审核。",
    // Exit Popup
    exitPopupTag: "等等——在您离开之前",
    exitPopupHeading: "免费获取第一章",
    exitPopupBody: "阅读《希望的和声》的开篇章节——没有附加条件。",
    exitPopupCta: "发送我的免费章节 →",
    exitPopupNoSpam: "绝无垃圾邮件。随时退订。",
    exitPopupSuccess: "请查看您的邮箱！",
    exitPopupSuccessBody: "您的免费章节正在路上。欢迎加入社区。",
    exitPopupClose: "关闭",
    // General
    readMore: "阅读更多",
    backToHome: "返回首页",
  },
};

// ── Narrative translations ──────────────────────────────────────────────────
export const narrativeTranslations: Record<string, Record<Locale, string>> = {
  "harmonies-narrative": {
    en: `The Harmonies of Hope begins in a two-family flat in the heart of Detroit. Five siblings. One household. Aunties, uncles, and cousins filling every room with laughter, love, and life.

But beneath the Motown records and Sunday morning hymns, there is a tension building — between the block and the blessing, between the corner and the choir loft. Chris is eight years old, and the world outside is louder than the music inside.

This is a story about family, faith, and the sound that carries you home when the streets try to drown you out.

The Harmonies of Hope. Published by Hood Hymns Publishing. By C.D. Howell.`,

    es: `Las Armonías de la Esperanza comienza en un apartamento de dos familias en el corazón de Detroit. Cinco hermanos. Un hogar. Tías, tíos y primos llenando cada habitación con risas, amor y vida.

Pero debajo de los discos de Motown y los himnos de la mañana del domingo, hay una tensión creciente — entre el bloque y la bendición, entre la esquina y el balcón del coro. Chris tiene ocho años, y el mundo afuera es más ruidoso que la música adentro.

Esta es una historia sobre la familia, la fe y el sonido que te lleva a casa cuando las calles intentan ahogarte.

Las Armonías de la Esperanza. Publicado por Hood Hymns Publishing. Por C.D. Howell.`,

    zh: `《希望的和声》始于底特律中心的一栋两户式公寓。五个兄弟姐妹。一个家庭。阿姨、叔叔和表兄弟姐妹们用笑声、爱和生活填满每个房间。

但在摩城唱片和周日早晨赞美诗的下面，紧张在积聚——在街区与祝福之间，在街角与唱诗班阁楼之间。克里斯八岁了，外面的世界比里面的音乐更嘈杂。

这是一个关于家庭、信仰和那种在街头试图淹没你时带你回家的声音的故事。

《希望的和声》。Hood Hymns Publishing出版。C.D. Howell著。`,
  },

  "prodigal-narrative": {
    en: `Not everyone heard the choir the first time. Marcus grew up in the same Detroit blocks. Heard the same sermons. Knew the same God. But when the streets called, he answered.

The Prodigal Block is about the ones who walked away — and the long, broken road back to grace. It is a story about second chances, about the difference between being lost and being forgotten, and about the hymn that plays in every prodigal's heart when they finally turn toward home.

The Prodigal Block. Published by Hood Hymns Publishing. By C.D. Howell.`,

    es: `No todos escucharon el coro la primera vez. Marcus creció en los mismos bloques de Detroit. Escuchó los mismos sermones. Conoció al mismo Dios. Pero cuando las calles llamaron, él respondió.

El Bloque Pródigo trata sobre los que se fueron — y el largo y difícil camino de regreso a la gracia. Es una historia sobre segundas oportunidades, sobre la diferencia entre estar perdido y ser olvidado, y sobre el himno que suena en el corazón de cada pródigo cuando finalmente se dirige hacia casa.

El Bloque Pródigo. Publicado por Hood Hymns Publishing. Por C.D. Howell.`,

    zh: `不是每个人第一次就听到了唱诗班。马库斯在底特律同样的街区长大。听过同样的布道。认识同样的上帝。但当街头召唤时，他回应了。

《浪子街区》讲述的是那些离开的人——以及回归恩典的漫长而破碎的道路。这是一个关于第二次机会的故事，关于迷失与被遗忘之间的区别，关于每个浪子心中在最终转身回家时响起的那首赞美诗。

《浪子街区》。Hood Hymns Publishing出版。C.D. Howell著。`,
  },
};

// ── Chapter title + excerpt translations ──────────────────────────────────────
export const excerptTranslations: Record<string, Record<Locale, { bookTitle: string; chapterTitle: string; text: string }>> = {
  "harmonies-ch1": {
    en: {
      bookTitle: "The Harmonies of Hope",
      chapterTitle: "Chapter One — The Two-Family Flat",
      text: `In the heart of Detroit, on a block where the houses leaned like tired soldiers, there was a two-family flat that held more love than its walls could contain.

The bottom floor belonged to Grandma Lois. She kept the kitchen warm year-round — not just with the stove, but with the weight of her presence. She hummed hymns while she cooked, old ones, the kind that don't have names anymore, just melodies passed down through generations of women who understood that some prayers are best sung over a pot of greens.

Chris sat at the kitchen table, eight years old, feet dangling above the linoleum. The radio was on — Motown, always Motown — and the Temptations were singing "My Girl" while his mother ironed clothes in the next room.

"Chris, baby, go tell your brother to come eat before this food gets cold and I give it to the Lord."

He didn't move. He was listening. Not to his grandmother. Not to the radio. To something underneath both — a rhythm he couldn't name yet, a frequency that hummed between the music and the silence, between the block outside and the blessing inside.`,
    },
    es: {
      bookTitle: "Las Armonías de la Esperanza",
      chapterTitle: "Capítulo Uno — El Apartamento de Dos Familias",
      text: `En el corazón de Detroit, en una cuadra donde las casas se inclinaban como soldados cansados, había un apartamento de dos familias que contenía más amor del que sus paredes podían contener.

El piso de abajo pertenecía a la Abuela Lois. Mantenía la cocina caliente todo el año — no solo con la estufa, sino con el peso de su presencia. Tarareaba himnos mientras cocinaba, viejos, de los que ya no tienen nombre, solo melodías transmitidas a través de generaciones de mujeres que entendían que algunas oraciones se cantan mejor sobre una olla de verduras.

Chris se sentaba a la mesa de la cocina, con ocho años, los pies colgando sobre el linóleo. La radio estaba encendida — Motown, siempre Motown — y los Temptations cantaban "My Girl" mientras su madre planchaba ropa en la habitación de al lado.

"Chris, cariño, ve a decirle a tu hermano que venga a comer antes de que la comida se enfríe y se la dé al Señor."

No se movió. Estaba escuchando. No a su abuela. No a la radio. A algo debajo de ambos — un ritmo que aún no podía nombrar, una frecuencia que vibraba entre la música y el silencio, entre el bloque afuera y la bendición adentro.`,
    },
    zh: {
      bookTitle: "希望的和声",
      chapterTitle: "第一章 — 两户式公寓",
      text: `在底特律的中心，在一条房屋像疲惫的士兵一样倾斜的街区上，有一栋两户式公寓，它承载的爱比它的墙壁所能容纳的还要多。

一楼属于洛伊斯奶奶。她一年四季都保持着厨房的温暖——不仅仅是靠炉子，更是靠她的存在带来的厚重感。她一边做饭一边哼着赞美诗，古老的那种，已经没有名字了，只有旋律，代代相传，来自那些懂得某些祷告最好是在一锅蔬菜上唱出来的女人们。

克里斯坐在厨房的桌子旁，八岁，双脚悬在油毡地板上方。收音机开着——摩城，永远是摩城——诱惑乐队正在唱《我的女孩》，他的母亲在隔壁房间熨衣服。

"克里斯，宝贝，去叫你哥哥来吃饭，趁饭还没凉，不然我就把它献给主了。"

他没有动。他在听。不是听他的祖母。不是听收音机。而是听两者之下的什么东西——一种他还无法命名的节奏，一种在音乐和寂静之间、在外面的街区和里面的祝福之间嗡嗡作响的频率。`,
    },
  },
  "prodigal-ch1": {
    en: {
      bookTitle: "The Prodigal Block: Lost Frequency",
      chapterTitle: "Chapter One — The Wrong Door",
      text: `The streetlight on Gratiot Avenue flickered like it was trying to decide whether to stay on or give up entirely.

Marcus stood beneath it, nineteen years old, hoodie up, hands in his pockets, watching the night settle over the east side like a blanket that smelled of exhaust and rain. He knew every crack in this sidewalk. Knew which houses still had families inside and which ones had been hollowed out by foreclosure, by fire, by the slow quiet rot of a city that forgot to come back.

His phone buzzed. A text from his mother: "Where are you?"

He didn't answer. He hadn't answered in three days.

Somewhere behind him, the bass from a Cutlass Supreme shook the block. The car rolled past slowly, tinted windows down just enough to let the smoke out and the eye contact in. The driver nodded once. Marcus nodded back.

That was the door. Not a door with a handle or a hinge — just a nod, a frequency, a signal that said: this way.

He took the step.`,
    },
    es: {
      bookTitle: "El Bloque Pródigo: Frecuencia Perdida",
      chapterTitle: "Capítulo Uno — La Puerta Equivocada",
      text: `La farola en la Avenida Gratiot parpadeaba como si estuviera tratando de decidir si quedarse encendida o rendirse por completo.

Marcus estaba debajo, con diecinueve años, capucha puesta, manos en los bolsillos, viendo cómo la noche se asentaba sobre el lado este como una manta que olía a escape y lluvia. Conocía cada grieta de esta acera. Sabía qué casas todavía tenían familias adentro y cuáles habían sido vaciadas por ejecución hipotecaria, por fuego, por la lenta y silenciosa descomposición de una ciudad que olvidó volver.

Su teléfono vibró. Un mensaje de su madre: "¿Dónde estás?"

No respondió. No había respondido en tres días.

En algún lugar detrás de él, el bajo de un Cutlass Supreme sacudió la cuadra. El auto pasó lentamente, ventanas polarizadas bajadas solo lo suficiente para dejar salir el humo y dejar entrar el contacto visual. El conductor asintió una vez. Marcus asintió de vuelta.

Esa era la puerta. No una puerta con manija o bisagra — solo un asentimiento, una frecuencia, una señal que decía: por aquí.

Dio el paso.`,
    },
    zh: {
      bookTitle: "浪子街区：失落的频率",
      chapterTitle: "第一章 — 错误的门",
      text: `格拉蒂奥特大道上的路灯闪烁着，仿佛在犹豫是继续亮着还是彻底放弃。

马库斯站在灯下，十九岁，帽衫拉起，双手插在口袋里，看着夜色像一条带着废气和雨水气味的毯子一样笼罩在东区上方。他认识这条人行道上的每一条裂缝。知道哪些房子里还住着家庭，哪些已经被丧失抵押品赎回权、火灾、或者一座忘记回来的城市缓慢而寂静的腐烂掏空了。

他的手机响了。妈妈的短信："你在哪儿？"

他没有回复。他已经三天没有回复了。

在他身后的某个地方，一辆至尊弯刀车的低音震动了整个街区。车子慢慢驶过，贴膜车窗只降下了一点点——刚好够让烟飘出来，让目光接触进去。司机点了一次头。马库斯也点头回应。

那就是那扇门。不是一扇有把手或铰链的门——只是一个点头，一个频率，一个信号，意思是：走这边。

他迈出了那一步。`,
    },
  },
};

// ── Series name translations ────────────────────────────────────────────────
export const seriesNames: Record<string, Record<Locale, string>> = {
  "harmonies-of-hope": { en: "The Harmonies of Hope", es: "Las Armonías de la Esperanza", zh: "希望的和声" },
  "prodigal-block": { en: "The Prodigal Block", es: "El Bloque Pródigo", zh: "浪子街区" },
};

// ── Book title translations ─────────────────────────────────────────────────
export const bookTitles: Record<string, Record<Locale, string>> = {
  "harmonies-v1": { en: "The Harmonies of Hope", es: "Las Armonías de la Esperanza", zh: "希望的和声" },
  "prodigal-v1": { en: "The Prodigal Block: Lost Frequency", es: "El Bloque Pródigo: Frecuencia Perdida", zh: "浪子街区：失落的频率" },
  "prodigal-v2": { en: "The Prodigal Block: Coming Home", es: "El Bloque Pródigo: Regreso a Casa", zh: "浪子街区：回家" },
};

// ── Films i18n ──────────────────────────────────────────────────────────────
export const filmsI18n: Record<Locale, { mainTitle: string; mainDesc: string; shortFilmsTitle: string }> = {
  en: {
    mainTitle: "The Harmonies of Hope — The Film",
    mainDesc: "A cinematic adaptation of the debut novel. Coming soon from Hood Hymns Studios.",
    shortFilmsTitle: "Short Films & Trailers",
  },
  es: {
    mainTitle: "Las Armonías de la Esperanza — La Película",
    mainDesc: "Una adaptación cinematográfica de la novela debut. Próximamente de Hood Hymns Studios.",
    shortFilmsTitle: "Cortometrajes y Tráilers",
  },
  zh: {
    mainTitle: "希望的和声 — 电影",
    mainDesc: "首部小说的电影改编。即将来自Hood Hymns Studios。",
    shortFilmsTitle: "短片与预告片",
  },
};

// ── Excerpt labels ──────────────────────────────────────────────────────────
export const excerptLabels: Record<Locale, { excerpt: string; continueReading: string; getBook: string }> = {
  en: { excerpt: "Excerpt", continueReading: "Continue reading…", getBook: "Get the Book" },
  es: { excerpt: "Extracto", continueReading: "Seguir leyendo…", getBook: "Obtener el Libro" },
  zh: { excerpt: "摘录", continueReading: "继续阅读…", getBook: "获取书籍" },
};
