# IB Watches

One-page site. Plain HTML, one small build script, no dependencies.

## Files
- `template.html` – the page. Edit text, colours and layout here.
- `content/watches/*.json` – one file per watch. The build script turns these into cards.
- `build.mjs` – run `node build.mjs`. It writes the site to `dist/`.
- `.pages.yml` – setup for the free CMS (Pages CMS).
- Hero picture – `assets/hero.jpg`, shown by `<img class="skyline">` at the bottom of the hero, with the text above it on the left. It is in full color. CSS `mix-blend-mode: multiply` makes the white of the picture blend into the page color, so the picture needs a white background. There is no parallax. To change the picture, replace the file. Keep it about 2000 px wide and under 600 KB. `assets/illustration.jpg` is the full-size original. It is not published (`build.mjs` skips it).
- Fonts – Sprat is used for the brand name only (`.logo`). Ronzino is used for all other text through `--font-text`. The web files are in `assets/fonts/` (Sprat Medium, Ronzino Regular and Medium). The `@font-face` rules and `--font-text` are at the top of the CSS in `template.html`. The full downloads (`assets/sprat-main/`, `assets/ronzino-main/`) are not published; `build.mjs` skips them. Ronzino has a Bold file too; copy `Ronzino-Bold.woff2` from the download if you need it.
- `assets/` – images. Put the hero and Daytona illustrations here, then update the two `<img>` placeholders in `template.html`.

## Add a watch (free CMS)
1. Push this folder to a GitHub repository.
2. Go to <https://pagescms.org> and sign in with GitHub. Pages CMS is free.
3. Open the repository. The "Watches" collection shows. Click "Add", fill in the form, upload a photo, and save.
4. Pages CMS commits the change to GitHub. The host builds the site again.

No CMS? Copy `content/watches/rolex-daytona.json`, change the values, and commit.

## Latest arrival
The card on the right of the hero shows one featured watch. In the CMS, switch on "Feature as latest arrival" for that watch. If you switch on more than one, the build uses the first one. If you switch on none, it uses the first available watch. A sold watch is never featured. The card shows the photo, name, reference, case, movement, source city and price; empty fields are left out. The "Enquire" link uses the e-mail address in the contact section of `template.html`. On phones the card moves below the hero text.

## Host for free
Use Cloudflare Pages, Netlify or Vercel. Connect the GitHub repository and set:
- Build command: `node build.mjs`
- Output directory: `dist`

Every commit, including CMS edits, starts a new build. The site updates in about one minute.

## Local preview
`node build.mjs && npx serve dist`
