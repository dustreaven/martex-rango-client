const scope = `@rango-dev`;
export const VERCEL_ORG_ID = process.env.VERCEL_ORG_ID;
export const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
export const VERCEL_PACKAGES = {
  [`${scope}/wallets-demo`]: process.env.VERCEL_PROJECT_WALLETS,
  [`${scope}/queue-manager-demo`]: process.env.VERCEL_PROJECT_Q,
  [`${scope}/wallets-adapter-demo`]: process.env.VERCEL_PROJECT_WALLET_ADAPTER,
  [`${scope}/config-client`]: process.env.VERCEL_PROJECT_WIDGET_CONFIG,
};
