# Hood Hymns Publishing — Business Launch Plan

**Prepared for**: Damon C. Howell (C.D. Howell)  
**Business**: Hood Hymns Publishing  
**Prepared by**: Think! Ventures Inc. / Think Design & Planning LLC  
**Date**: June 2026  

---

## Welcome, Damon 🎉

Your publishing platform is built, live, and ready for business at **[hoodhymns.com](https://hoodhymns.com)**. This document is your step-by-step guide to turning Hood Hymns Publishing into a legitimate, revenue-generating business. Follow each section in order — every step has been laid out so you can complete it on your own.

---

## Table of Contents

1. [Phase 1: Form Your LLC](#phase-1-form-your-llc)
2. [Phase 2: Open Your Bank Account](#phase-2-open-your-bank-account)
3. [Phase 3: Set Up Stripe Payments](#phase-3-set-up-stripe-payments)
4. [Phase 4: Connect Printful for Merch](#phase-4-connect-printful-for-merch)
5. [Phase 5: Set Up Email Marketing](#phase-5-set-up-email-marketing)
6. [Phase 6: Marketing Strategy](#phase-6-marketing-strategy)
7. [Phase 7: Content Calendar](#phase-7-content-calendar)
8. [Phase 8: Revenue Goals](#phase-8-revenue-goals)
9. [Phase 9: Tax & Legal Basics](#phase-9-tax--legal-basics)
10. [Important Links & Logins](#important-links--logins)

---

## Phase 1: Form Your LLC

**Time**: 30 minutes  
**Cost**: $50 (Michigan) or $125 (North Carolina)  

An LLC protects your personal assets (car, home, savings) if the business ever gets sued. It also makes you look professional to customers, banks, and partners.

### Option A: File in Michigan (Recommended if you live in MI)

1. Go to: **[Michigan LARA](https://cofs.lara.state.mi.us/corpweb/CorpSearch/CorpSearch.aspx)**
2. Click **"File Online"** → **"Articles of Organization"**
3. Fill in:

| Field | What to Enter |
|-------|--------------|
| **LLC Name** | Hood Hymns Publishing LLC |
| **Registered Agent** | Damon C. Howell |
| **Agent Address** | Your home address |
| **Organizer** | Damon C. Howell |
| **Purpose** | Publishing, merchandise sales, and media production |
| **Management** | Member-Managed |
| **Duration** | Perpetual |

4. Pay the **$50 filing fee**
5. **Save/print your confirmation** — you'll need this for the bank account

### Option B: File in North Carolina (If you live in NC)

1. Go to: **[NC Secretary of State](https://www.sosnc.gov/online_services)**
2. Click **"Business Registration"** → **"LLC"**
3. Same information as above
4. Pay the **$125 filing fee**

### Get Your EIN (Same Day — Free)

Your EIN is like a Social Security number for your business. You need it for the bank account and taxes.

1. Go to: **[IRS EIN Application](https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online)**
2. Select **"Limited Liability Company"**
3. Select **"Started a new business"**
4. Enter your LLC info
5. You'll get your **EIN instantly on screen**
6. **SAVE THIS NUMBER** — print the confirmation letter and keep it safe

> ⚠️ **IMPORTANT**: Do this on a weekday between 7am-10pm ET. The IRS system is only available during those hours.

### Operating Agreement (5 minutes)

Even as a single-member LLC, you need an operating agreement. It proves the LLC is a real separate entity.

**Key items to include:**
- LLC Name: Hood Hymns Publishing LLC
- Member: Damon C. Howell (100% ownership)
- Member contributions: Time, intellectual property (manuscripts, brand)
- Profit distribution: 100% to single member
- Management: Member-managed

> 💡 You can use a free template from [LegalZoom](https://www.legalzoom.com) or [Northwest Registered Agent](https://www.northwestregisteredagent.com). Or ask Think! Ventures for a template.

---

## Phase 2: Open Your Bank Account

**Time**: 15 minutes  
**Cost**: Free  

Never mix personal and business money. This is the #1 mistake new business owners make.

### Open a Novo Business Account

1. Go to: **[novo.co](https://www.novo.co)**
2. Click **"Open a Free Account"**
3. Select **"LLC"**
4. You'll need:
   - Your **EIN** (from Phase 1)
   - Your **Articles of Organization** (LLC filing confirmation)
   - Your **driver's license** or state ID
   - Your **Social Security Number**
5. Choose your account type: **Checking**
6. Complete the application

**Why Novo?**
- ✅ No monthly fees
- ✅ No minimum balance
- ✅ Free invoicing
- ✅ Integrates with Stripe
- ✅ Mobile app for check deposits
- ✅ Free ACH transfers

### What to Do Once the Account Is Open

- [ ] Transfer $100-200 from personal account as "initial capital contribution"
- [ ] Set up direct deposit from Stripe (see Phase 3)
- [ ] Keep ALL business income in this account
- [ ] Pay ALL business expenses from this account
- [ ] Download the Novo mobile app

---

## Phase 3: Set Up Stripe Payments

**Time**: 20 minutes  
**Cost**: Free (Stripe takes 2.9% + $0.30 per transaction)  

Stripe processes all credit card payments on your website. When someone buys a book, ebook, audiobook, or merch — the money goes through Stripe to your Novo bank account.

### Create Your Stripe Account

1. Go to: **[stripe.com](https://stripe.com)**
2. Click **"Start now"**
3. Enter your email and create a password
4. Fill in your business details:

| Field | What to Enter |
|-------|--------------|
| **Business type** | LLC |
| **Legal business name** | Hood Hymns Publishing LLC |
| **DBA (Doing Business As)** | Hood Hymns Publishing |
| **EIN** | Your EIN from Phase 1 |
| **Industry** | Retail → Books & Media |
| **Business website** | hoodhymns.com |
| **Product description** | Books, ebooks, audiobooks, and branded merchandise |

5. Add your **Novo bank account** for payouts:
   - Go to **Settings → Payouts**
   - Add your Novo routing number and account number
   - Set payout schedule to **Daily** or **Weekly**

### Get Your Stripe API Keys

1. In Stripe Dashboard → **Developers → API keys**
2. Copy your **Secret Key** (starts with `sk_live_...`)
3. Copy your **Publishable Key** (starts with `pk_live_...`)
4. Send these keys to Think Design & Planning to connect to your website

> ⚠️ **NEVER share your Secret Key publicly.** Only share it with Think Design & Planning to configure your site.

### Set Up Your Audiobook Payment Link

1. In Stripe Dashboard → **Payment Links → + New**
2. Create a product:
   - Name: **"The Harmonies of Hope — Full Audiobook"**
   - Price: **$9.99** (one-time)
   - Image: Upload your book cover
3. Under **After Payment → Redirect**:
   - URL: `https://hoodhymns.com/audiobook?purchased=audiobook`
4. Copy the payment link and send it to Think Design & Planning

### What You'll Earn Per Sale (After Stripe Fees)

| Product | Price | Stripe Fee | You Keep |
|---------|-------|-----------|----------|
| Ebook | $9.99 | $0.59 | **$9.40** |
| Audiobook | $9.99 | $0.59 | **$9.40** |
| Paperback | $24.99 | $1.02 | **$23.97** (minus print cost) |
| Hoodie | $44.99 | $1.60 | **$43.39** (minus print cost) |
| Complete Bundle | $189.99 | $5.81 | **$184.18** (minus print costs) |

---

## Phase 4: Connect Printful for Merch

**Time**: 15 minutes  
**Cost**: Free (Printful charges per item when ordered)  

Printful prints and ships your merchandise automatically. You never touch inventory.

### Create Your Printful Account

1. Go to: **[printful.com](https://www.printful.com)**
2. Sign up with your business email
3. In the dashboard:
   - Upload your merch designs (provided by Think Design & Planning)
   - Set up products: Hoodies, T-shirts, Crewnecks, Joggers, Snapbacks, Caps
   - Configure sizes and colors for each product

### How It Works

```
Customer buys hoodie on hoodhymns.com ($44.99)
    → Stripe charges their card
    → Printful receives the order automatically
    → Printful prints the design on the hoodie
    → Printful ships directly to the customer
    → You keep the profit (price minus Printful cost)
```

### Printful Costs (What You Pay Per Item)

| Product | Printful Cost | Your Price | Your Profit |
|---------|--------------|-----------|-------------|
| T-Shirt | ~$12 | $34.99 | **~$23** |
| Hoodie | ~$25 | $44.99 | **~$20** |
| Crewneck | ~$22 | $39.99 | **~$18** |
| Joggers | ~$25 | $39.99 | **~$15** |
| Snapback | ~$15 | $34.99 | **~$20** |
| Cap | ~$12 | $29.99 | **~$18** |

---

## Phase 5: Set Up Email Marketing

**Time**: 15 minutes  
**Cost**: Free (up to 500 contacts on Mailchimp free plan)  

Your website already captures emails from:
- The **Free Chapter** page
- The **Subscribe** page
- The **Exit Intent Popup** (when visitors try to leave)

You just need to connect Mailchimp so those emails actually go somewhere.

### Create Your Mailchimp Account

1. Go to: **[mailchimp.com](https://mailchimp.com)**
2. Sign up with your business email
3. Create an **Audience** (your email list):
   - Name: "Hood Hymns Readers"
   - Default From: your business email
   - Reminder: "You signed up at hoodhymns.com"
4. Go to **Account → API Keys → Generate Key**
5. Copy the **API Key** and **Audience ID**
6. Send both to Think Design & Planning to connect to your site

### Email Sequences to Set Up

#### Welcome Sequence (Automated — Set Up Once)

| Day | Email | Subject |
|-----|-------|---------|
| Day 0 | Welcome + Free Chapter | "Your free chapter is here 📖" |
| Day 2 | Author's Story | "Why I wrote this book..." |
| Day 5 | Book Preview | "Chapter 2 preview — Sunday Morning" |
| Day 7 | Offer | "Get the full book — $5 off this week" |
| Day 14 | Merch Drop | "New merch just dropped 🔥" |
| Day 21 | Audiobook | "Now available: Listen to the audiobook 🎧" |

#### Monthly Newsletter

Send one email per month with:
- New chapter previews or behind-the-scenes content
- Merch drops or sales
- Personal updates from you
- Links to your social media

---

## Phase 6: Marketing Strategy

### Social Media Plan

#### Platforms to Focus On (Pick 2-3 to Start)

| Platform | Best For | Posting Frequency |
|----------|---------|-------------------|
| **Instagram** | Book covers, merch photos, short reels | 3-4x per week |
| **TikTok** | Short readings, behind-the-scenes, "day in the life" | 3-5x per week |
| **Facebook** | Community building, events, longer posts | 2-3x per week |
| **YouTube** | Full chapter readings, book trailers | 1-2x per week |
| **X (Twitter)** | Quick thoughts, quotes from your book, engagement | Daily |

#### Content Ideas (Rotate These Weekly)

1. **Quote Graphics** — Pull powerful quotes from your book, design them as images
2. **Chapter Readings** — Record yourself reading 60-second excerpts on TikTok/Reels
3. **Behind the Scenes** — Show your writing process, desk setup, inspiration
4. **Merch Photos** — Wear your merch, show it in real life
5. **Detroit Stories** — Share real stories that inspired the book
6. **Fan Engagement** — Ask questions: "What would you do in Chris's situation?"
7. **Testimonials** — Share reviews and reader reactions
8. **Live Readings** — Go live on Instagram/TikTok and read a chapter

### Hashtag Strategy

Always use a mix of these:
```
#HoodHymns #HarmoniesOfHope #CDHowell
#UrbanFiction #FaithBasedFiction #DetroitStories
#BlackAuthors #SupportBlackAuthors #IndieAuthor
#BookTok #Bookstagram #NewBook #MustRead
#DetroitMade #MotorCityStories #DetroitCulture
#SelfPublished #IndiePublishing #AuthorLife
```

### Paid Marketing (When You're Ready)

Start with **$5-10/day** on one platform:

| Platform | Budget | Strategy |
|----------|--------|----------|
| **Instagram Ads** | $5/day | Promote your best-performing post to "lookalike" audiences |
| **Facebook Ads** | $5/day | Target: Black fiction readers, ages 25-55, Detroit/Michigan |
| **Amazon Ads** | $5/day | Promote your book when people search similar titles |
| **BookBub** | $50-200 one-time | Featured deal to 1M+ readers (apply at bookbub.com) |

### Free Marketing Tactics

| Tactic | How | Cost |
|--------|-----|------|
| **Book clubs** | Search Facebook for Black book clubs, offer free copies for review | Free |
| **Church outreach** | Contact churches in Detroit — offer to speak/read at events | Free |
| **Podcast guesting** | Apply to urban fiction/faith-based podcasts as a guest | Free |
| **Amazon reviews** | Ask every buyer to leave an honest review | Free |
| **Cross-promotion** | Partner with other indie authors to share each other's work | Free |
| **Library submission** | Submit your book to local libraries through IngramSpark | Free |
| **Local bookstores** | Visit indie bookstores in Detroit, offer consignment copies | Low cost |
| **Blog/Medium** | Write about your journey — "From Detroit to Published Author" | Free |

### Launch Strategy (First 30 Days)

| Week | Focus | Actions |
|------|-------|---------|
| **Week 1** | Announce | Share the website on all social media. "My book is LIVE!" Post the link daily. Ask friends/family to share. |
| **Week 2** | Free Chapter | Drive traffic to the free chapter page. "Read Chapter 1 for free!" Collect emails. |
| **Week 3** | Social Proof | Ask early readers for reviews. Post testimonials. Record a reading on TikTok. |
| **Week 4** | Sales Push | Run a limited-time discount or bundle deal. "First 50 orders get free shipping!" |

---

## Phase 7: Content Calendar

### Weekly Posting Schedule

| Day | Platform | Content Type | Example |
|-----|----------|-------------|---------|
| **Monday** | Instagram | Quote graphic | "In the heart of Detroit, a young boy named Chris..." |
| **Tuesday** | TikTok | 60-sec chapter reading | Read an emotional paragraph from the book |
| **Wednesday** | Facebook | Behind-the-scenes | Photo of your writing space + story about inspiration |
| **Thursday** | Instagram | Merch photo | Photo wearing the B2B hoodie |
| **Friday** | TikTok | Fan engagement | "What would you do if you grew up on this block?" |
| **Saturday** | All platforms | Testimonial/Review | Share a reader's review |
| **Sunday** | Instagram | Faith message | Quote from the book tied to a Sunday message |

---

## Phase 8: Revenue Goals

### Month 1 Goals (Realistic)

| Metric | Goal | How |
|--------|------|-----|
| Website visitors | 500 | Social media + friends/family sharing |
| Email subscribers | 50 | Free chapter page |
| Ebook sales | 10 | $99.90 revenue |
| Paperback sales | 5 | $124.95 revenue |
| Merch sales | 3 | $104.97 revenue |
| **Total Revenue** | | **~$330** |

### Month 3 Goals

| Metric | Goal |
|--------|------|
| Website visitors | 2,000/month |
| Email subscribers | 250 |
| Ebook sales | 30/month ($299) |
| Paperback sales | 15/month ($374) |
| Merch sales | 10/month ($379) |
| Audiobook sales | 20/month ($199) |
| **Monthly Revenue** | **~$1,250** |

### Month 6 Goals

| Metric | Goal |
|--------|------|
| Website visitors | 5,000/month |
| Email subscribers | 1,000 |
| Monthly revenue | **$2,500-3,000** |
| Start Book 2 | Manuscript in progress |

### Year 1 Goal

| Metric | Goal |
|--------|------|
| Email list | 5,000+ subscribers |
| Books published | 2 (Harmonies + Prodigal Block) |
| Annual revenue | **$15,000-25,000** |
| Speaking events | 5-10 |

---

## Phase 9: Tax & Legal Basics

### Taxes

As a single-member LLC, your business income goes on your **personal tax return** (Schedule C).

**What to track** (keep receipts for everything):
- [ ] All income from Stripe (books, merch, audiobook)
- [ ] Printful costs (cost of goods sold)
- [ ] Stripe fees (business expense)
- [ ] Website costs (Netlify, domain — business expense)
- [ ] Marketing costs (ads, promo materials)
- [ ] Home office expenses (if you work from home)
- [ ] Mileage (if you drive to events, bookstores, etc.)

**Quarterly estimated taxes**: If you expect to owe more than $1,000 in taxes for the year, you need to pay quarterly. Use [IRS Form 1040-ES](https://www.irs.gov/forms-pubs/about-form-1040-es).

**Tax deadlines**:
- April 15 (Q1)
- June 15 (Q2)  
- September 15 (Q3)
- January 15 (Q4)

> 💡 **Recommendation**: Use **[Wave](https://www.waveapps.com)** (free accounting software) or **[QuickBooks Self-Employed](https://quickbooks.intuit.com/self-employed/)** ($15/mo) to track income and expenses automatically.

### Business License

Check if your city/county requires a general business license:
- **Detroit**: [Detroit Business License](https://detroitmi.gov/departments/buildings-safety-engineering-and-environmental-department/bseed-divisions/business-license-center)
- **Most NC counties**: Contact your county clerk

### Copyright

Your book is automatically copyrighted the moment you write it. But for legal protection, register with the U.S. Copyright Office:
- Go to: **[copyright.gov](https://www.copyright.gov/registration/)**
- Fee: **$65** per work
- This gives you the right to sue for damages if someone copies your work

---

## Important Links & Logins

### Your Website
| Item | Link |
|------|------|
| **Live Website** | [hoodhymns.com](https://hoodhymns.com) |
| **Store** | [hoodhymns.com/store](https://hoodhymns.com/store) |
| **Audiobook** | [hoodhymns.com/audiobook](https://hoodhymns.com/audiobook) |
| **Free Chapter** | [hoodhymns.com/free-chapter](https://hoodhymns.com/free-chapter) |
| **Admin Panel** | [hoodhymns.com/admin](https://hoodhymns.com/admin) |
| **Admin Password** | BrothersWin |

### Accounts to Create

- [ ] **LLC**: Filed with state → [Michigan LARA](https://cofs.lara.state.mi.us) or [NC SOS](https://www.sosnc.gov)
- [ ] **EIN**: [IRS Online](https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online)
- [ ] **Novo Bank**: [novo.co](https://www.novo.co)
- [ ] **Stripe**: [stripe.com](https://stripe.com)
- [ ] **Printful**: [printful.com](https://www.printful.com)
- [ ] **Mailchimp**: [mailchimp.com](https://mailchimp.com)
- [ ] **Amazon KDP**: [kdp.amazon.com](https://kdp.amazon.com) (for paperback distribution)
- [ ] **Copyright Office**: [copyright.gov](https://www.copyright.gov)

### Social Media Accounts to Create

- [ ] Instagram: @hoodhymns or @cdhowell_author
- [ ] TikTok: @hoodhymns
- [ ] Facebook Page: Hood Hymns Publishing
- [ ] YouTube: Hood Hymns Publishing
- [ ] X (Twitter): @hoodhymns

---

## Your Checklist — Do These In Order

### Week 1: Foundation
- [ ] File LLC ($50-125)
- [ ] Get EIN (free)
- [ ] Open Novo bank account (free)
- [ ] Create Stripe account (free)
- [ ] Send Stripe API keys to Think Design & Planning

### Week 2: Content & Marketing
- [ ] Create Instagram account
- [ ] Create TikTok account
- [ ] Create Facebook page
- [ ] Post "My book is LIVE!" on all platforms
- [ ] Share hoodhymns.com with 20 friends/family
- [ ] Ask 5 people to buy and leave reviews

### Week 3: Email & Sales
- [ ] Create Mailchimp account
- [ ] Send API key and Audience ID to Think Design & Planning
- [ ] Share the Free Chapter link on social media
- [ ] Record your first TikTok chapter reading

### Week 4: Growth
- [ ] Record "Testimonial of the Day" on your admin panel
- [ ] Reach out to 5 book clubs on Facebook
- [ ] Contact 3 churches about speaking
- [ ] Apply to 2 podcasts as a guest
- [ ] Upload book to Amazon KDP for wider distribution
- [ ] Register copyright ($65)

---

## Need Help?

**Think! Ventures** is here to support you every step of the way.

- **Technical support** (website, Stripe, Printful): Contact Think Design & Planning
- **Business guidance** (marketing, strategy, growth): Contact Think! Ventures
- **Emergency**: If the website is down or payments aren't working, contact immediately

> *"You have the keys to the car. Now it's time to drive."* 🚀

---

*This business plan was prepared by Think! Ventures Inc. / Think Design & Planning LLC as part of the Business Launch Program. All strategies and recommendations are tailored specifically for Hood Hymns Publishing.*
