# MSM — McCorvey Sheet Metal Works · Brain Powered Operations Portal (Demo)

Sales demo concept build by **Endurance AI Labs** for McCorvey Sheet Metal Works, L.P. (Houston, TX — HVAC sheet metal ductwork detailing, fabrication & installation since 1925).

**Demo environment — all project data, people (except public leadership), financials and AI output are fictional and illustrative.**

## The story

McCorvey spends roughly **$3M a year reviewing bid documents** — ~620 invitations to bid, ~1,420 pages of specs, drawings and addenda each. The flagship module, **AI Bid & Document Review** (`/bidreview/`), machine-reads every set in minutes: quantity extraction (lbs, LF, damper/GRD counts), addenda tracking, and spec-trap detection (gauge-schedule replacements, uncapped LDs, scope shifts, closed substitution lists) — with estimator sign-off on every flag. Run-rate savings modeled at ~$2.4M/yr.

Around it: a full operations portal — executive dashboard, job register with SOV/pay apps/BIM workflow, AIA billing, bid builder + pipeline & win/loss, fabrication division (Duct Direct accounts + shop floor board), forecasting, manpower & EAC, timesheets, role-based access, and an Operating Brain assistant on every page.

## Stack

Static site (no build step) — HTML + vanilla JS + Chart.js, deployed on GitHub Pages under `/mccorvey/`. Data layer in `js/data.js`; shared nav/brand in `js/nav.js`; role personas in `js/util.js`.

Template lineage: Endurance portal framework (Margins design system) → Yates operations portal → this build.
