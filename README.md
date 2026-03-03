# Headless Platform Blueprint Portfolio

This repository contains a starter Blueprint to get you up and running quickly on [WP Engine's Headless Platform](https://wpengine.com/atlas/) with a WordPress site complete with a blog, portfolio and programs.

## For more information

For more information on this Blueprint please check out the following sources:

- [WP Engine's Headless Platform](https://wpengine.com/atlas/)
- [Faust.js](https://faustjs.org)
- [WPGraphQL](https://www.wpgraphql.com)
- [Atlas Content Modeler](https://wordpress.org/plugins/atlas-content-modeler/)
- [WP Engine's Headless Platform developer community](https://developers.wpengine.com)

## Google Analytics 4 setup

1. Create or open your GA4 web data stream in Google Analytics.
2. Copy the measurement ID (for example `G-XXXXXXXXXX`).
3. Add it to `.env.local`:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Once set, page views are tracked automatically for initial page loads and client-side route changes.

### Contributor License Agreement

All external contributors to WP Engine products must have a signed Contributor License Agreement (CLA) in place before the contribution may be accepted into any WP Engine codebase.

1. [Submit your name and email](https://wpeng.in/cla/)
2. 📝 Sign the CLA emailed to you
3. 📥 Receive copy of signed CLA

❤️ Thank you for helping us fulfill our legal obligations in order to continue empowering builders through headless WordPress.
