/**
 * One source of truth for everything the site claims about the product.
 *
 * The intents below are copied verbatim from the app's own
 * `frontend/lib/core/models/intent_type.dart`. If a label or tagline changes
 * there, change it here, the site must never describe a product the app
 * does not ship.
 */

export const BRAND = {
  name: "TieHere",
  domain: "tiehere.com",
  line: "Connect with who's here.",
  description:
    "Verified professionals near you, meeting in person, around something specific. TieHere is not another feed. It is a small number of real meetings you actually show up to.",
};

export type Intent = {
  id: string;
  label: string;
  tagline: string;
  /** One sentence of site-only elaboration. Never contradicts the app. */
  note: string;
  /** Scene from the app's own intent artwork. The pairing is the one the app
   *  already makes in `intent_type.dart`, so site and app share one language. */
  image: string;
  /** Horizontal anchor for the crop. These sources are landscape and the cards
   *  are portrait, so cover scales by height: only the X value has any effect. */
  focus: string;
};

export const INTENTS: Intent[] = [
  {
    id: "coffee",
    label: "COFFEE",
    tagline: "A quick cup, a new connection",
    note: "Thirty minutes, no agenda beyond the one you both already agreed to.",
    image: "/intents/coffee.jpg",
    focus: "50% 50%",
  },
  {
    id: "meal",
    label: "MEAL",
    tagline: "Breakfast, lunch or dinner: the time decides",
    note: "You pick a time. The app names the sitting, so you never pick a meal from a menu of meals.",
    image: "/intents/meal.jpg",
    focus: "50% 50%",
  },
  {
    id: "networking",
    label: "NETWORKING",
    tagline: "Grow your circle",
    note: "The word usually means a room of strangers. Here it means one person, on purpose.",
    image: "/intents/networking.jpg",
    focus: "45% 50%",
  },
  {
    id: "mentorship",
    label: "MENTORSHIP",
    tagline: "Learn from someone a step ahead",
    note: "A step ahead, not a stage above. The useful distance is small.",
    image: "/intents/mentorship.jpg",
    focus: "52% 50%",
  },
  {
    id: "outing",
    label: "OUTING",
    tagline: "A gig, a game, a night out",
    note: "The thing you had a spare ticket for, and nobody to go with.",
    image: "/intents/outing.jpg",
    focus: "52% 50%",
  },
  {
    id: "rideshare",
    label: "RIDE SHARE",
    tagline: "Share the road, split the fare",
    note: "Same direction, same hour. The commute stops being dead time.",
    image: "/intents/rideshare.jpg",
    focus: "50% 50%",
  },
  {
    id: "dating",
    label: "DATING",
    tagline: "Connect beyond the office",
    note: "One intent out of seven, and entirely opt-in. It is not what this app is.",
    image: "/intents/dating.jpg",
    focus: "38% 50%",
  },
];

export type Step = { n: string; title: string; body: string };

export const STEPS: Step[] = [
  {
    n: "01",
    title: "Say where, when, and why",
    body: "Pick an intent, a place and a window. That is the whole of it. No profile essay, no pitch, no feed to maintain.",
  },
  {
    n: "02",
    title: "Verified people ask to join",
    body: "Requests come from accounts that cleared the trust ladder. You see who they are before you answer, and you answer once.",
  },
  {
    n: "03",
    title: "You meet",
    body: "Details unlock on confirmation. Safety features travel with you. Afterwards you both rate, and the ladder remembers.",
  },
];

export type Rung = {
  level: string;
  name: string;
  unlocks: string;
  requires: string;
};

export const TRUST: Rung[] = [
  {
    level: "0",
    name: "Looking around",
    unlocks: "Browse what is happening nearby.",
    requires: "Nothing, but locations stay redacted. You can see that something is happening, not where.",
  },
  {
    level: "1",
    name: "A real account",
    unlocks: "Full visibility. Host, request, and be seen.",
    requires: "An account created through any real sign-in: email, Apple, Google or LinkedIn.",
  },
  {
    level: "2",
    name: "Verified person",
    unlocks: "Safety features switch on: SOS, trusted contacts, the per-participant safety gate.",
    requires: "LinkedIn, phone, and a personal email, all three confirmed.",
  },
  {
    level: "3",
    name: "Verified professional",
    unlocks: "The meetups that only open to verified professionals.",
    requires: "A confirmed work email and company, on top of everything at level 2.",
  },
];

export type Principle = { title: string; body: string };

/** The three product decisions competitors cannot claim. All shipped, all in the ADRs. */
export const PRINCIPLES: Principle[] = [
  {
    title: "One meetup at a time",
    body: "Hosting a meetup, or even holding a pending request, blocks another in the same window. The product refuses to let you collect people. If you said yes, you meant it.",
  },
  {
    title: "Nobody gets rejected",
    body: "A turned-down request never says rejected, or declined, or no. The requester sees that it was not the right fit, and sees other meetups nearby instead. Being turned down should not cost you the next attempt.",
  },
  {
    title: "Location is earned, then blurred",
    body: "Below level 1, you cannot see where anything is. Above it, coordinates are quantised before they ever reach another device. Nobody is handed a pin on your exact position, at any trust level.",
  },
];

export type Safety = { title: string; body: string };

export const SAFETY: Safety[] = [
  {
    title: "SOS",
    body: "One control, reachable from inside a meetup, that reaches your trusted contacts with where you are and who you are with.",
  },
  {
    title: "Trusted contacts",
    body: "People outside the app who you choose in advance. They are who the SOS reaches. They never need an account.",
  },
  {
    title: "The safety gate",
    body: "Contact details are shared on confirmation, per participant, and only between people who have both cleared level 2. Not to a group. Not in advance.",
  },
  {
    title: "Quantised coordinates",
    body: "A viewer never receives a precise position. The location you see is deliberately coarse, computed before it leaves the server.",
  },
];

export type Faq = { q: string; a: string };

export const FAQ: Faq[] = [
  {
    q: "Is this a dating app?",
    a: "No. Dating is one of seven intents and it is entirely opt-in. The other six (coffee, meals, networking, mentorship, outings and ride shares) are what the app is built around, and you never see an intent you did not ask for.",
  },
  {
    q: "Who can see where I am?",
    a: "Below level 1, nobody: meetup locations are redacted entirely. Above it, viewers receive quantised coordinates, never your exact position. Your precise location is not something the app hands to other users at any trust level.",
  },
  {
    q: "What does verification actually require?",
    a: "Level 1 is just a real account. Level 2 asks for LinkedIn, a phone number and a personal email, and in return switches on the safety features. Level 3 adds a verified work email and company. You can stop at any rung, because each one is useful on its own.",
  },
  {
    q: "What happens if someone does not show up?",
    a: "Meetups close automatically and both sides rate afterwards. Ratings feed the profile the next person sees, so reliability compounds and so does its absence.",
  },
  {
    q: "Is it free?",
    a: "Yes. Premium adds a higher hosting limit, filters on what is happening soon, and priority support. It is billed through the App Store or Google Play and can be cancelled there at any time.",
  },
  {
    q: "Can I delete my account?",
    a: "Yes, from inside the app, and it removes your data rather than hiding it. There is a public page describing exactly what deletion does.",
  },
];
