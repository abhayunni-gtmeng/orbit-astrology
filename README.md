# Orbit

## Calculation page

`/calculations?date=YYYY-MM-DD#moon` shows each weekly body's NASA longitude, separately computed Astronomy Engine longitude and absolute angular difference, with reproducible NASA links. It also shows zodiac arithmetic, sampled interplanetary aspect calculations and house conventions. Result evidence panels link to this page. Birth details are not included in URLs; this page does not replay a personal natal chart. Browser fetches bypass stale API responses while the server retains its same-date NASA cache. Astronomy Engine is an independent calculation implementation, not independent observational evidence; Astrodienst remains a manual reference.

## Action, reflection and transparent sources

Every day offers a concrete low-stakes action, a reflection question and an afterward check-in. Personal contacts adapt actions to the transit’s whole-sign house and aspect; general mode uses the daily solar-sign sector. Weekly topic cards pair action and reflection. This is editorial guidance, not a scientifically demonstrated effect of planetary positions.

The visible Sources section links directly to reproducible NASA/JPL queries for the five weekly bodies, the Horizons explorer and API documentation, Astrodienst annual ephemeris tables, Swiss Ephemeris provenance, Astronomy Engine code and aspect conventions. External comparison tables are not automatically ingested. Swiss Ephemeris is largely JPL-based: a different publisher/implementation is not wholly independent observational evidence. Positioning distinguishes science-based astronomy from symbolic astrology.

Web-first astrology MVP: choose any of 12 sun signs, optionally enter first name / birth date / birth time and a focus, and generate seven daily reflections. Birth date alone suggests a conventional sun sign. Enter a birth time to enable an optional natal chart, then select a birthplace or manually enter coordinates and IANA timezone. Calculated natal Sun overrides the date-range suggestion. Unknown time explicitly returns to sun-sign mode.

## Run

Node 22+. Install dependencies with `npm install`.

```
npm start
npm test
```

Open http://localhost:4173. The server binds to loopback by default. Set PORT for another local port.

## Data and interpretations

The server fetches Sun, Moon, Mercury, Venus and Mars positions sequentially from NASA/JPL Horizons, observing from Earth's center at 00:00 UTC on each of seven dates beginning today. Quantity 31 returns apparent ecliptic-of-date longitude/latitude. Responses are validated, requests serialized, same-date requests deduplicated and cached in memory (16 dates). Only dates within 31 days are accepted. No NASA key needed. No direct browser calls to NASA. Documentation: https://ssd-api.jpl.nasa.gov/doc/horizons.html and https://ssd.jpl.nasa.gov/horizons/manual.html .

The Western tropical sign is a 30-degree longitude sector. Lunar sign relative to the selected sun sign selects symbolic daily themes. Venus, Mercury, Mars and Sun solar-sign sectors at the opening snapshot inform relationships, work/money, wellbeing and growth respectively. These symbolic sectors are not natal houses. Weekly readings include an overview, three checkpoints, four topic sections and seven expanded daily reflections, actions, cautions and journal prompts. Day-index prompts are editorial planning suggestions, not astronomical events.

Major aspects are computed between the five transiting bodies at each daily sample: conjunction 0°, sextile 60°, square 90°, trine 120°, opposition 180°. Orbit uses an explicit 3° orb for all five types (a product choice, not a universal astrological rule). Angular distances wrap correctly across 0°. Weekly highlights are the closest sampled occurrence per pair/type, never claimed as exact event times or personal natal aspects. Conventional aspect definitions cross-checked with https://www.astro.com/astrowiki/en/Aspect .

Interpretations are deterministic editorial prompts, not AI predictions or scientifically validated advice. NASA is not affiliated with this app. An API outage explicitly switches to sign-only reflections; no fabricated positions or silent stale data. The text download includes the expanded weekly and daily content and its basis.

First name stays in browser memory. Birth date/time, coordinates and timezone are POSTed to the local server, calculated in memory and never persisted or logged; responses use no-store. Birthplace search text is sent to Open-Meteo (GeoNames data). The free geocoding endpoint is for noncommercial use; review licensing before commercialization. Readings can be downloaded as plain text. External Google Fonts can be replaced with locally bundled fonts for offline desktop distribution.

## Natal chart conventions and limits

Western tropical zodiac, geocentric apparent ecliptic-of-date positions for ten planets (Sun through Pluto), and whole-sign houses. Ascendant is the eastern geometric horizon/ecliptic intersection. Astronomy Engine calculates natal positions locally; NASA/JPL supplies the five weekly transiting bodies. Temporal applies historical IANA timezone rules. Dates from 1900 to today, latitude ±66°; invalid, ambiguous or nonexistent DST birth times are rejected rather than guessed. Historical timezone databases and recorded birth-time accuracy limit precision. Verify unusual historical civil-time rules independently.

Personal contacts compare the five weekly bodies against ten natal planets plus ascendant, using the same explicit 3° major-aspect orb. They inform topic sections and append personal context to general sun-sign daily prompts. Dates identify closest daily samples, not exact transits. No outer-planet weekly transits, rectification, sidereal/Vedic mode or alternative house systems. Astrology has no single global standard; these are declared product conventions, not scientifically validated predictions.

Tests cover timezone/DST rejection, east-horizon geometry, house wrapping, natal sensitivity to time, transit orb boundaries and fallback. Five planetary longitudes are cross-checked against NASA/JPL 2026-10-04 fixtures within 0.05°. Reference: https://github.com/cosinekitty/astronomy ; https://tc39.es/proposal-temporal/docs/zoneddatetime.html ; https://open-meteo.com/en/docs/geocoding-api .

## macOS path

`public/` is a platform-independent static frontend; `shared/reading.mjs` is a pure calculation/content module. Transport boundaries are GET /api/sky?date=YYYY-MM-DD, GET /api/places?q=..., and POST /api/natal. `shared/natal.mjs` uses Astronomy Engine and Temporal; `shared/transits.mjs` is a pure personal-transit layer. For a macOS version, package this UI in Tauri or a WKWebView shell, reuse the shared reading module, and provide the same sky response contract through a hosted backend or native adapter. Never depend on a user's local web development server in a shipped Mac app. Native packaging, signing and notarization are future work.

Before public deployment: deploy behind HTTPS, add persistent shared caching and rate limits, restrict backend access, and verify NASA response-format changes. No public deployment has been performed.
