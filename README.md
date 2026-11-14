# IB Watches

One-page site. Plain HTML, one small build script, no dependencies.

## Files
- `template.html` – the page. Edit text, colours and layout here.
- `content/watches/*.json` – one file per watch. The build script turns these into cards.
- `build.mjs` – run `node build.mjs`. It writes the site to `dist/`.
- `.pages.yml` – setup for the free CMS (Pages CMS).
- Hero picture – `assets/hero.jpg`, shown by `<img class="skyline">`. Its width is `--pw` on `.hero`: the larger of 80vw and 100rem (1600 px). Wide screens get 80vw. It sits at the bottom of the hero and is pushed down by 25% of its height, so 75% shows. The picture has `opacity:.45` so the hero text and the latest arrival stay easy to read when they sit on top of it. The hero is 1360 px wide at most. To show more or less of the picture, change `translate(-50%,25%)` on the `.skyline` rule, and change the `.235` (which multiplies `--pw`) in the `.hero .wrap` padding to match (about 0.39 × the visible share × picture height ÷ width). On phones the picture goes below the text and shows in full. `mix-blend-mode: multiply` makes the white of the picture blend into the page color, so the picture needs a white background. There is no parallax. Keep the file about 2000 px wide and under 600 KB. `assets/illustration.jpg` is the full-size original. It is not published (`build.mjs` skips it).
- Fonts – Sprat is used for the brand name only (`.logo`). Ronzino is used for all other text through `--font-text`. The web files are in `assets/fonts/` (Sprat Medium, Ronzino Regular and Medium). The `@font-face` rules and `--font-text` are at the top of the CSS in `template.html`. The full downloads (`assets/sprat-main/`, `assets/ronzino-main/`) are not published; `build.mjs` skips them. Ronzino has a Bold file too; copy `Ronzino-Bold.woff2` from the download if you need it.
- `assets/` – images. Put the hero and Daytona illustrations here, then update the two `<img>` placeholders in `template.html`.

## Add a watch (free CMS)
1. Push this folder to a GitHub repository.
2. Go to <https://pagescms.org> and sign in with GitHub. Pages CMS is free.
3. Open the repository. The "Watches" collection shows. Click "Add", fill in the form, upload photos, and save.
4. Pages CMS commits the change to GitHub. The host builds the site again.

No CMS? Copy `content/watches/rolex-daytona.json`, change the values, and commit.

## Pictures
Each watch has a list of pictures (`images`) in the CMS. Upload as many as you want. **The first picture is the header picture.** It shows in the hero card and as the large picture in the collection. To change the header picture, drag another picture to the top of the list. In the collection, a watch with more than one picture shows small thumbnails under the large picture. A click on a thumbnail shows that picture large. Old files with a single `image` field still work.

## Latest arrival
The card on the right of the hero shows one featured watch. In the CMS, switch on "Feature as latest arrival" for that watch. If you switch on more than one, the build uses the first one. If you switch on none, it uses the first available watch. A sold watch is never featured. The card shows the photo, the label "Latest arrival", the brand and model, and the description as a short highlight line. It has two links: "Enquire" (opens the Email and WhatsApp modal) and "See all" (scrolls to the collection). It shows no price and no specs. On phones the card moves below the hero text.

## Contact buttons
The contact section at the bottom of `template.html` has two buttons: e-mail and WhatsApp. Change `hello@ibwatches.com` and the number in `https://wa.me/41000000000` (country code and number, digits only). Every "Enquire" link (hero card and collection) opens a small modal with two buttons: Email and WhatsApp. The modal reads the e-mail address and the WhatsApp number from these two contact buttons, so you change them in one place. Without JavaScript, the link goes to the contact section.

## Host for free
Use Cloudflare Pages, Netlify or Vercel. Connect the GitHub repository and set:
- Build command: `node build.mjs`
- Output directory: `dist`

Every commit, including CMS edits, starts a new build. The site updates in about one minute.

## Local preview
`node build.mjs && npx serve dist`
