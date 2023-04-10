# Tasks

Tasks is a proof-of-concept. It is built so that data stays on the user's device(s) and in their control. See the [about](https://tasks.page.dev/#about) page for more.

## Developing

```bash
yarn dev
```

## Building

To create a production version of Tasks:

```bash
yarn build
```

You can preview the production build with `yarn preview`.

## Deploying

To deploy as a CloudFlare page, configure the build as follows:

Build command: npm run build
Build output directory:/build
Root directory: /

Set the env variable:

NODE_VERSION 16
