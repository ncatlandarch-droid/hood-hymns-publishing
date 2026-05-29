// ─────────────────────────────────────────────────────────────────────────────
// Hood Hymns Publishing — i18n System (EN / ES / ZH)
// ─────────────────────────────────────────────────────────────────────────────

export type Locale = "en" | "es" | "zh";

export interface LanguageMeta {
  code: Locale;
  label: string;
  flag: string;
  ttsLang: string;
  ttsVoice: string;
  ttsStyle: string;
}

export const LANGUAGES: LanguageMeta[] = [
  {
    code: "en",
    label: "English",
    flag: "🇺🇸",
    ttsLang: "en-US",
    ttsVoice: "Zephyr",
    ttsStyle: "You are a deep-voiced African American male narrator from Detroit, Michigan. Speak with the distinctive Detroit accent: use the Inland North nasal 'a' sound, blend syllables naturally at a swift pace, and employ the wide-ranging melodic intonation pattern of African-American Vernacular English. Your cadence should be rhythmic and soulful — like a street preacher who grew up on Motown, telling a testimony to a congregation. Deliberate pauses for emphasis. Let the words breathe. This is a story of faith, family, and the hood — tell it like you lived it.",
  },
  {
    code: "es",
    label: "Español",
    flag: "🇪🇸",
    ttsLang: "es-ES",
    ttsVoice: "Zephyr",
    ttsStyle: "Lee este pasaje con un tono cálido y cadencioso de narrador del sur — como un testimonio compartido en comunidad.",
  },
  {
    code: "zh",
    label: "中文",
    flag: "🇨🇳",
    ttsLang: "zh-CN",
    ttsVoice: "Zephyr",
    ttsStyle: "用温暖、深沉、富有感情的叙事语调朗读这段文字 — 如同在讲述一个充满信仰的生命故事。",
  },
];

// ── UI Strings ──────────────────────────────────────────────────────────────
export interface UIStrings {
  // nav
  home: string;
  store: string;
  watchListen: string;
  about: string;
  freeChapter: string;
  films: string;
  content: string;
  subscribe: string;
  // hero
  heroHeadline: string;
  heroSubhead: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  // store
  storeTitle: string;
  storeSubtitle: string;
  addToCart: string;
  notifyMe: string;
  upcoming: string;
  // listen
  listenTitle: string;
  listenSubtitle: string;
  playNarrative: string;
  pauseNarrative: string;
  generatingVoice: string;
  // about
  aboutTitle: string;
  aboutSubtitle: string;
  // free chapter
  freeChapterTitle: string;
  freeChapterSubtitle: string;
  freeChapterCta: string;
  emailPlaceholder: string;
  // subscribe
  subscribeTitle: string;
  subscribeSubtitle: string;
  subscribeCta: string;
  // films
  filmsTitle: string;
  filmsSubtitle: string;
  comingSoon: string;
  watchTrailer: string;
  // content
  contentTitle: string;
  contentSubtitle: string;
  // footer
  footerTagline: string;
  footerRights: string;
  // general
  readMore: string;
  backToHome: string;
}

export const translations: Record<Locale, UIStrings> = {
  en: {
    home: "Home",
    store: "Store",
    watchListen: "Watch & Listen",
    about: "About C.D. Howell",
    freeChapter: "Free Chapter",
    films: "Films",
    content: "Content",
    subscribe: "Subscribe",
    heroHeadline: "Hood Hymns — Positive stories rooted in the streets",
    heroSubhead: "Faith-based urban fiction from Detroit. By C.D. Howell. Published by Hood Hymns Publishing.",
    heroCtaPrimary: "Get the Free Chapter",
    heroCtaSecondary: "Browse the Store",
    storeTitle: "The Store",
    storeSubtitle: "Books, merch, and Block to Blessing drops — shipped worldwide.",
    addToCart: "Add to Cart",
    notifyMe: "Notify Me",
    upcoming: "Coming Soon",
    listenTitle: "Watch & Listen",
    listenSubtitle: "Hear the stories come alive — narrated by the author.",
    playNarrative: "Play Narrative",
    pauseNarrative: "Pause",
    generatingVoice: "Generating voice…",
    aboutTitle: "About C.D. Howell",
    aboutSubtitle: "Author. Musician. Storyteller. Detroit.",
    freeChapterTitle: "Read Chapter One — Free",
    freeChapterSubtitle: "Enter your email and we'll send the first chapter of The Harmonies of Hope straight to your inbox.",
    freeChapterCta: "Send My Free Chapter",
    emailPlaceholder: "your@email.com",
    subscribeTitle: "Stay in the Loop",
    subscribeSubtitle: "New drops, exclusive content, and behind-the-scenes updates from Hood Hymns Publishing.",
    subscribeCta: "Subscribe",
    filmsTitle: "Films",
    filmsSubtitle: "Cinematic adaptations and original short films — coming soon from Hood Hymns Studios.",
    comingSoon: "Coming Soon",
    watchTrailer: "Watch Trailer",
    contentTitle: "Content Hub",
    contentSubtitle: "Shorts, clips, and behind-the-scenes content from the Hood Hymns universe.",
    footerTagline: "Hood Hymns — Positive stories rooted in the streets.",
    footerRights: "© 2026 Hood Hymns Publishing. All rights reserved.",
    readMore: "Read More",
    backToHome: "Back to Home",
  },
  es: {
    home: "Inicio",
    store: "Tienda",
    watchListen: "Ver y Escuchar",
    about: "Sobre C.D. Howell",
    freeChapter: "Capítulo Gratis",
    films: "Películas",
    content: "Contenido",
    subscribe: "Suscribirse",
    heroHeadline: "Hood Hymns — Historias positivas arraigadas en las calles",
    heroSubhead: "Ficción urbana basada en la fe desde Detroit. Por C.D. Howell. Publicado por Hood Hymns Publishing.",
    heroCtaPrimary: "Obtener el Capítulo Gratis",
    heroCtaSecondary: "Explorar la Tienda",
    storeTitle: "La Tienda",
    storeSubtitle: "Libros, merchandising y lanzamientos Block to Blessing — envío mundial.",
    addToCart: "Añadir al Carrito",
    notifyMe: "Notificarme",
    upcoming: "Próximamente",
    listenTitle: "Ver y Escuchar",
    listenSubtitle: "Escucha las historias cobrar vida — narradas por el autor.",
    playNarrative: "Reproducir Narración",
    pauseNarrative: "Pausa",
    generatingVoice: "Generando voz…",
    aboutTitle: "Sobre C.D. Howell",
    aboutSubtitle: "Autor. Músico. Narrador. Detroit.",
    freeChapterTitle: "Lee el Capítulo Uno — Gratis",
    freeChapterSubtitle: "Ingresa tu correo y te enviaremos el primer capítulo de The Harmonies of Hope directamente.",
    freeChapterCta: "Enviar Mi Capítulo Gratis",
    emailPlaceholder: "tu@correo.com",
    subscribeTitle: "Mantente al Día",
    subscribeSubtitle: "Nuevos lanzamientos, contenido exclusivo y actualizaciones de Hood Hymns Publishing.",
    subscribeCta: "Suscribirse",
    filmsTitle: "Películas",
    filmsSubtitle: "Adaptaciones cinematográficas y cortometrajes originales — próximamente de Hood Hymns Studios.",
    comingSoon: "Próximamente",
    watchTrailer: "Ver Tráiler",
    contentTitle: "Centro de Contenido",
    contentSubtitle: "Shorts, clips y contenido detrás de cámaras del universo Hood Hymns.",
    footerTagline: "Hood Hymns — Historias positivas arraigadas en las calles.",
    footerRights: "© 2026 Hood Hymns Publishing. Todos los derechos reservados.",
    readMore: "Leer Más",
    backToHome: "Volver al Inicio",
  },
  zh: {
    home: "首页",
    store: "商店",
    watchListen: "观看与聆听",
    about: "关于C.D. Howell",
    freeChapter: "免费章节",
    films: "影视",
    content: "内容中心",
    subscribe: "订阅",
    heroHeadline: "Hood Hymns — 植根于街头的积极故事",
    heroSubhead: "来自底特律的都市信仰小说。作者：C.D. Howell。由Hood Hymns Publishing出版。",
    heroCtaPrimary: "获取免费章节",
    heroCtaSecondary: "浏览商店",
    storeTitle: "商店",
    storeSubtitle: "书籍、周边商品和Block to Blessing系列 — 全球配送。",
    addToCart: "加入购物车",
    notifyMe: "通知我",
    upcoming: "即将推出",
    listenTitle: "观看与聆听",
    listenSubtitle: "聆听故事活灵活现 — 由作者亲自讲述。",
    playNarrative: "播放叙事",
    pauseNarrative: "暂停",
    generatingVoice: "正在生成语音…",
    aboutTitle: "关于C.D. Howell",
    aboutSubtitle: "作家。音乐人。故事讲述者。底特律。",
    freeChapterTitle: "免费阅读第一章",
    freeChapterSubtitle: "输入您的电子邮件，我们将把《希望的和声》第一章直接发送到您的邮箱。",
    freeChapterCta: "发送免费章节",
    emailPlaceholder: "your@email.com",
    subscribeTitle: "保持关注",
    subscribeSubtitle: "来自Hood Hymns Publishing的新品发布、独家内容和幕后更新。",
    subscribeCta: "订阅",
    filmsTitle: "影视",
    filmsSubtitle: "电影改编和原创短片 — 即将来自Hood Hymns Studios。",
    comingSoon: "即将推出",
    watchTrailer: "观看预告片",
    contentTitle: "内容中心",
    contentSubtitle: "Hood Hymns宇宙的短片、剪辑和幕后内容。",
    footerTagline: "Hood Hymns — 植根于街头的积极故事。",
    footerRights: "© 2026 Hood Hymns Publishing。保留所有权利。",
    readMore: "阅读更多",
    backToHome: "返回首页",
  },
};

// ── Narrative translations ──────────────────────────────────────────────────
export const narrativeTranslations: Record<string, Record<Locale, string>> = {
  "harmonies-narrative": {
    en: `The Harmonies of Hope begins in a two-family flat in the heart of Detroit. Five siblings. One household. Aunties, uncles, and cousins filling every room with laughter, love, and life...`,
    es: `Las Armonías de la Esperanza comienza en un apartamento de dos familias en el corazón de Detroit. Cinco hermanos. Un hogar. Tías, tíos y primos llenando cada habitación con risas, amor y vida...`,
    zh: `《希望的和声》始于底特律中心的一栋两户式公寓。五个兄弟姐妹。一个家庭。阿姨、叔叔和表兄弟姐妹们用笑声、爱和生活填满每个房间...`,
  },
  "prodigal-narrative": {
    en: `Not everyone heard the choir the first time. Marcus grew up in the same Detroit blocks. Heard the same sermons. Knew the same God. But when the streets called, he answered...`,
    es: `No todos escucharon el coro la primera vez. Marcus creció en los mismos bloques de Detroit. Escuchó los mismos sermones. Conoció al mismo Dios. Pero cuando las calles llamaron, él respondió...`,
    zh: `不是每个人第一次就听到了唱诗班。马库斯在底特律同样的街区长大。听过同样的布道。认识同样的上帝。但当街头召唤时，他回应了...`,
  },
};

// ── Excerpt translations ────────────────────────────────────────────────────
export const excerptTranslations: Record<string, Record<Locale, { bookTitle: string; chapterTitle: string; text: string }>> = {
  "harmonies-ch1": {
    en: {
      bookTitle: "The Harmonies of Hope",
      chapterTitle: "Chapter One — The Two-Family Flat",
      text: "In the heart of Detroit, a young boy named Chris navigated the challenges of elementary school while dreaming of a brighter future...",
    },
    es: {
      bookTitle: "Las Armonías de la Esperanza",
      chapterTitle: "Capítulo Uno — El Apartamento de Dos Familias",
      text: "En el corazón de Detroit, un joven llamado Chris navegaba los desafíos de la escuela primaria mientras soñaba con un futuro mejor...",
    },
    zh: {
      bookTitle: "希望的和声",
      chapterTitle: "第一章 — 两户式公寓",
      text: "在底特律的中心，一个名叫Chris的小男孩在应对小学的挑战的同时，梦想着更光明的未来...",
    },
  },
  "prodigal-ch1": {
    en: {
      bookTitle: "The Prodigal Block: Lost Frequency",
      chapterTitle: "Chapter One — The Wrong Door",
      text: "The streetlight on Gratiot Avenue flickered like it was trying to decide whether to stay on or give up entirely...",
    },
    es: {
      bookTitle: "El Bloque Pródigo: Frecuencia Perdida",
      chapterTitle: "Capítulo Uno — La Puerta Equivocada",
      text: "La farola en la Avenida Gratiot parpadeaba como si estuviera tratando de decidir si quedarse encendida o rendirse por completo...",
    },
    zh: {
      bookTitle: "浪子街区：失落的频率",
      chapterTitle: "第一章 — 错误的门",
      text: "格拉蒂奥特大道上的路灯闪烁着，仿佛在犹豫是继续亮着还是彻底放弃...",
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
