/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    '@storybook/addon-docs',

  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    mdx: {
      // Add the remark-gfm plugin to support GitHub Flavored Markdown
      remarkPlugins: [require('remark-gfm')],
    },
  },
};
export default config;
