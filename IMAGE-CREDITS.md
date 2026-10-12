# Image credits

Every image on this site is **CC0 / public domain**: free for commercial use, no attribution
required, no watermarks. Provenance is recorded here anyway, because "we believe it was free" is
not a licence record, and a brand site should be able to prove where its pictures came from.

Sourced through the [Openverse](https://openverse.org) API with `license=cc0,pdm`, filtered to
**StockSnap** rather than the general CC0 pool, which is mostly amateur material. Each file was
then downsized and re-encoded locally.

## No identifiable faces, on purpose

CC0 waives the photographer's **copyright**. It says nothing about the **personality rights** of
the people pictured, and using someone's likeness in advertising is governed separately from
copyright in most jurisdictions.

So every image here carries human presence without an identifiable face: hands, a handshake, a
figure from behind, a crowd in silhouette, a table mid-meal. That removes the question entirely
rather than managing it, and it costs nothing, because hands at a shared table read warmer than
a stock smile anyway.

**Keep that rule when replacing any of these.** If a replacement shows a recognisable face, it
needs a model release, not just a CC0 licence.

| File | What it shows | Licence | Source | Link |
|---|---|---|---|---|
| `public/intents/coffee.jpg` | two pairs of hands over coffee | CC0 | stocksnap | [source](https://stocksnap.io/photo/hands-beverage-RYM2WIKREP) |
| `public/intents/meal.jpg` | a shared table seen from above | CC0 | stocksnap | [source](https://stocksnap.io/photo/restaurant-people-5YHRDJ0VRZ) |
| `public/intents/networking.jpg` | a handshake across a table | CC0 | stocksnap | [source](https://stocksnap.io/photo/work-business-J5LXKNDREC) |
| `public/intents/mentorship.jpg` | hands writing in a notebook | CC0 | stocksnap | [source](https://stocksnap.io/photo/writing-letter-BGGYUZB7LO) |
| `public/intents/outing.jpg` | a crowd from behind, stage lights | CC0 | stocksnap | [source](https://stocksnap.io/photo/concert-show-4LZRZTD1MC) |
| `public/intents/rideshare.jpg` | the road at dusk from inside a car | CC0 | stocksnap | [source](https://stocksnap.io/photo/car-road-HOOPKJLX52) |
| `public/intents/dating.jpg` | two glasses and two candles | CC0 | stocksnap | [source](https://stocksnap.io/photo/finedining-dinner-LAA57DAZMZ) |
| `public/scenes/alone.jpg` | one figure from behind on a street | CC0 | stocksnap | [source](https://stocksnap.io/photo/woman-girl-V81YAU9P1W) |
| `public/scenes/rain.jpg` | a red umbrella in neon rain | CC0 | stocksnap | [source](https://stocksnap.io/photo/red-umbrella-45JIYYO371) |
| `public/scenes/city-street.jpg` | an empty street, one lit bar | CC0 | rawpixel | [source](https://www.rawpixel.com/image/5903332/photo-image-public-domain-house-free) |

## If you replace these

`public/scenes/` holds the full-bleed scroll chapters: wide, dark, atmospheric.
`public/intents/` holds the carousel cards. The sources are landscape and the cards are
portrait, so `object-cover` scales by height and only the **horizontal** value of `focus` in
`content/site.ts` has any effect. Tune the crop there rather than re-cropping the file.

Keep the filenames and drop replacements into the same folders, then clear
`.next/dev/cache/images` or the dev server will keep serving the old optimised derivatives.
