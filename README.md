# just-js

Just a demo how to deploy a single web page to Vercel without any build steps, no frameworks, and no third party libraries. The page is even only using a single JavaScript file.

Since in Vercel a serverless function needs to be inside an `api` directory, the page can only be accessed by visiting `/api/hello`. However, we can rewrite the URL to `/` by configuring the `rewrites` property in `vercel.json`. Unfortunately this makes this project a two-file project instead of a single file project.
