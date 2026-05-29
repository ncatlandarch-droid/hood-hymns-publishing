// ─────────────────────────────────────────────────────────────────────────────
// Hood Hymns Publishing — Content Data
// ─────────────────────────────────────────────────────────────────────────────

export const AUTHOR = "C.D. Howell";
export const PUBLISHER = "Hood Hymns Publishing";

export interface NarrativeEntry {
  id: string;
  seriesId: string;
  seriesName: string;
  title: string;
  subtitle: string;
  voicePreset: string;
  narrativeText: string;
  audioSrc?: string;
  videoSrc?: string;
  trailerScenes: string[];
  coverImage: string;
  accentColor: string;
}

export interface ExcerptEntry {
  id: string;
  seriesId: string;
  bookTitle: string;
  chapterTitle: string;
  coverImage: string;
  text: string;
}

export interface AuthorBio {
  name: string;
  title: string;
  bio: string[];
  pullQuote: string;
  pullQuoteSource: string;
  photoPlaceholder: string;
  stats: { label: string; value: string }[];
}

export const authorBio: AuthorBio = {
  name: AUTHOR,
  title: "Author & Storyteller",
  bio: [
    `C.D. Howell is an author, musician, and storyteller from the heart of Detroit. His debut series, "The Harmonies of Hope," published through Hood Hymns Publishing in 2026, draws from his own journey — growing up in a two-family flat with five siblings, discovering music through concert band, and finding purpose at the choir stand.`,
    `Through his writing, C.D. Howell weaves stories that honor the reality of urban life while celebrating the transformative power of faith, family, and music. His characters navigate the same streets, face the same temptations, and hear the same sermons — but each must choose their own path.`,
    `"Hood Hymns" is more than a publishing house — it's a movement. C.D. Howell believes that positive, God-focused stories rooted in real neighborhoods can inspire the next generation to dream bigger, pray harder, and walk in purpose.`,
  ],
  pullQuote: `"Stay active, pray up, and keep the faith; otherwise, the streets will swallow you whole."`,
  pullQuoteSource: "— The Harmonies of Hope, Chapter 1",
  photoPlaceholder: "/author-photo.jpg",
  stats: [
    { label: "Published", value: "2026" },
    { label: "Publisher", value: "Hood Hymns" },
    { label: "Genre", value: "Faith Fiction" },
    { label: "Series", value: "2 Active" },
  ],
};

export const narratives: NarrativeEntry[] = [
  {
    id: "harmonies-narrative",
    seriesId: "harmonies-of-hope",
    seriesName: "The Harmonies of Hope",
    title: "The Harmonies of Hope",
    subtitle: "Author's Voice — C.D. Howell",
    voicePreset: "narrator",
    narrativeText: `The Harmonies of Hope begins in a two-family flat in the heart of Detroit.

Five siblings. One household. Aunties, uncles, and cousins filling every room with laughter, love, and life. Chris was one of those kids — the ones who played Monopoly until someone fell asleep, who wrestled in the bedrooms while the adults talked in the living room, who learned respect and manners before they learned to ride a bike.

But it was music that changed everything.

When elementary school introduced concert band, Chris picked up the trombone. His brother chose the drums. Together they practiced, performed, and dreamed — inseparable, just like always. People called them twins. If you had a problem with one, you had two to deal with.

Then the family moved. New neighborhood. New school. New church. And at that church, surrounded by warm smiles and uplifting music, Chris found something he didn't know he was looking for — purpose.

He joined the junior choir. Then he was asked to direct it. Standing at the front with his arms raised, his brother on drums behind him, Chris discovered that music wasn't just something he enjoyed. It was part of God's plan.

The Harmonies of Hope. By C.D. Howell. Published by Hood Hymns Publishing.`,
    audioSrc: "/audio/harmonies-narrative.wav",
    videoSrc: undefined,
    trailerScenes: ["/harmonies-scene1.jpg", "/harmonies-scene2.jpg", "/harmonies-scene3.jpg"],
    coverImage: "/book-harmonies-v1.png",
    accentColor: "#B87333",
  },
  {
    id: "prodigal-narrative",
    seriesId: "prodigal-block",
    seriesName: "The Prodigal Block",
    title: "The Prodigal Block: Lost Frequency",
    subtitle: "Series Teaser — C.D. Howell",
    voicePreset: "dramatic",
    narrativeText: `Not everyone heard the choir the first time.

Marcus grew up in the same Detroit blocks. Heard the same sermons. Knew the same God. But when the streets called, he answered.

At seventeen, the world felt like a closing door. School felt pointless. Church felt distant. The only people who seemed to have answers were the ones standing on corners with money in their pockets and silence in their eyes.

Marcus chose the fast lane. And for a while, it felt like freedom.

But freedom built on sand doesn't last. And when the ground finally gave way beneath him — when the phone calls stopped, the money dried up, and the only sound left was the echo of his grandmother's prayers — Marcus found himself standing in front of a church door he hadn't opened in years.

The Prodigal Block is a story about the long road back. About the ones who wandered. The ones who fell. And the ones who discovered that God's GPS doesn't stop recalculating, no matter how far you drive in the wrong direction.

The Prodigal Block. By C.D. Howell. Published by Hood Hymns Publishing.`,
    audioSrc: "/audio/prodigal-narrative.wav",
    videoSrc: undefined,
    trailerScenes: ["/prodigal-scene1.jpg", "/prodigal-scene2.jpg", "/prodigal-scene3.jpg"],
    coverImage: "/book-prodigal-v1.png",
    accentColor: "#2D1B69",
  },
];

export const excerpts: ExcerptEntry[] = [
  {
    id: "harmonies-ch1",
    seriesId: "harmonies-of-hope",
    bookTitle: "The Harmonies of Hope",
    chapterTitle: "Chapter One — The Two-Family Flat",
    coverImage: "/book-harmonies-v1.png",
    text: `In the heart of Detroit, a young boy named Chris navigated the challenges of elementary school while dreaming of a brighter future. Growing up in a lively two-family flat, Chris was one of five siblings, each vying for attention while building bonds that would last a lifetime. Their home was filled with laughter, spirited debates, playful arguments, and moments of togetherness that reminded them how deeply they were loved.

But Chris's childhood was shaped by more than just his immediate family. There were many days and long nights when aunties, uncles, and cousins filled the house with even more life and energy. Family gatherings were a regular part of growing up, and the small flat somehow always found room for everyone.

For the kids, those nights felt magical.

The cousins would run from room to room playing games for hours. One moment they were wrestling and laughing until someone yelled for them to calm down, and the next they were crowded around a Monopoly board arguing over money, properties, and who was cheating. Sometimes they played so long that one by one the children would drift off to sleep wherever they landed.

Those moments created bonds that went far beyond ordinary family ties.`,
  },
  {
    id: "prodigal-ch1",
    seriesId: "prodigal-block",
    bookTitle: "The Prodigal Block: Lost Frequency",
    chapterTitle: "Chapter One — The Wrong Door",
    coverImage: "/book-prodigal-v1.png",
    text: `The streetlight on Gratiot Avenue flickered like it was trying to decide whether to stay on or give up entirely. Marcus understood the feeling.

He leaned against the bus stop shelter, hood up, hands deep in his pockets, watching the 11:47 bus roll past without stopping. The driver didn't even look. On this side of the city, after dark, you were either invisible or a threat — there was no in-between.

His phone buzzed. A text from Dre: "Pull up. Got something for you."

Marcus knew what "something" meant. It meant the same thing it always meant — an opportunity dressed in danger, wearing cologne that smelled like fast money and short futures.

He looked up at the sky. Somewhere behind the orange haze of the city lights, stars existed. His grandmother used to point them out from the porch, naming constellations she'd learned from her own mother. "God put those up there so you'd always know which way is up," she'd say.

Marcus couldn't see a single one tonight.

He started walking toward Dre's car.`,
  },
];
