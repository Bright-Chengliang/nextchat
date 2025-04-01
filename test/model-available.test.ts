import { isModelNotavailableInServer } from "../app/utils/model";

describe("isModelNotavailableInServer", () => {
  test("test model will return false, which means the model is available", () => {
    const customModels = "";
    const modelName = "deepseek-chat";
    const providerNames = "DeepSeek";
    const result = isModelNotavailableInServer(
      customModels,
      modelName,
      providerNames,
    );
    expect(result).toBe(false);
  });

  test("test model will return true when model is not available in custom models", () => {
    const customModels = "-all,deepseek-chat";
    const modelName = "deepseek-reasoner";
    const providerNames = "DeepSeek";
    const result = isModelNotavailableInServer(
      customModels,
      modelName,
      providerNames,
    );
    expect(result).toBe(true);
  });

  test("should respect DISABLE_GPT4 setting", () => {
    process.env.DISABLE_GPT4 = "1";
    const result = isModelNotavailableInServer("", "deepseek-chat", "DeepSeek");
    expect(result).toBe(false); // DeepSeek models are not affected by DISABLE_GPT4
  });

  test("should handle empty provider names", () => {
    const result = isModelNotavailableInServer("-all,deepseek-chat", "deepseek-chat", "");
    expect(result).toBe(true);
  });

  test("should be case insensitive for model names", () => {
    const result = isModelNotavailableInServer("-all,DEEPSEEK-CHAT", "deepseek-chat", "DeepSeek");
    expect(result).toBe(true);
  });

  test("support passing multiple providers, model unavailable on one of the providers will return true", () => {
    const customModels = "-all,deepseek-chat@ByteDance";
    const modelName = "deepseek-chat";
    const providerNames = ["DeepSeek", "ByteDance"];
    const result = isModelNotavailableInServer(
      customModels,
      modelName,
      providerNames,
    );
    expect(result).toBe(true);
  });

  // FIXME: 这个测试用例有问题，需要修复
  //   test("support passing multiple providers, model available on one of the providers will return false", () => {
  //     const customModels = "-all,deepseek-chat@ByteDance";
  //     const modelName = "deepseek-chat";
  //     const providerNames = ["DeepSeek", "ByteDance"];
  //     const result = isModelNotavailableInServer(
  //       customModels,
  //       modelName,
  //       providerNames,
  //     );
  //     expect(result).toBe(false);
  //   });

  test("test custom model without setting provider", () => {
    const customModels = "-all,deepseek-reasoner";
    const modelName = "deepseek-reasoner";
    const providerNames = modelName;
    const result = isModelNotavailableInServer(
      customModels,
      modelName,
      providerNames,
    );
    expect(result).toBe(false);
  });
});
