import type { TurbopackOptions } from "next/dist/server/config-shared";
import { isRegExp } from "util/types";
import { type Configuration, type RuleSetRule } from "webpack";

export const modifyConfigurationForSvgr = (config: Configuration) => {
  if (!Array.isArray(config.module?.rules)) return config;
  const fileLoaderRule = config.module.rules.find((rule) => {
    if (
      rule !== null &&
      typeof rule === "object" &&
      "test" in rule &&
      isRegExp(rule.test)
    ) {
      return rule.test.test(".svg");
    }
    return false;
  }) as RuleSetRule;
  const getFileLoaderNotQuery = () => {
    const query = fileLoaderRule.resourceQuery;
    if (!query) return [];
    if (
      typeof query === "object" &&
      !isRegExp(query) &&
      !Array.isArray(query)
    ) {
      if (Array.isArray(query.not)) {
        return query.not;
      }
      return query.not ?? [];
    }
    return [];
  };

  config.module.rules.push(
    // Reapply the existing rule, but only for svg imports ending in ?url
    {
      ...fileLoaderRule,
      test: /\.svg$/i,
      resourceQuery: /url/, // *.svg?url
    },
    // Convert all other *.svg imports to React components
    {
      test: /\.svg$/i,
      issuer: fileLoaderRule.issuer,
      resourceQuery: {
        not: [getFileLoaderNotQuery(), /url/].flat(),
      }, // exclude if *.svg?url
      use: ["@svgr/webpack"],
    },
  );

  fileLoaderRule.exclude = /\.svg$/i;

  return config;
};

export const turboPackRulesetSVGR: TurbopackOptions["rules"] = {
  "*.svg": {
    as: "*.js",
    loaders: ["@svgr/webpack"],
  },
};
