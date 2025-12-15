import { useMemo } from "react";
import { type ComboboxOption } from "../components/ui/combobox-shadcn";
import { MODEL_ENCODINGS } from "../utils/modelEncodings";
import { getModelDisplayName } from "../utils/models";
import { NON_GPT_MODELS } from "../utils/nonGptModels";

export function useModelOptions() {
  return useMemo(() => {
    const options: ComboboxOption[] = [];

    const groupNames: Record<string, string> = {
      o200k_base: "GPT - Modern Models",
      cl100k_base: "GPT - Chat Models",
      p50k_base: "GPT - Completion Models",
      p50k_edit: "GPT - Edit Models",
      r50k_base: "GPT - Legacy Models",
      o200k_harmony: "GPT - OpenAI OSS",
    };

    const specialGroups: Record<
      string,
      { models: string[]; groupName: string }
    > = {
      audioMedia: {
        models: [
          "whisper-1",
          "tts-1",
          "tts-1-hd",
          "dall-e-2",
          "dall-e-3",
          "gpt-audio",
          "gpt-audio-mini",
          "sora-2",
          "sora-2-pro",
        ],
        groupName: "GPT - Audio & Media",
      },
    };

    // Add GPT models
    Object.entries(MODEL_ENCODINGS).forEach(([encoding, models]) => {
      models.forEach((modelName) => {
        let groupName = groupNames[encoding];

        Object.values(specialGroups).forEach((group) => {
          if (group.models.includes(modelName)) {
            groupName = group.groupName;
          }
        });

        options.push({
          value: modelName,
          label: getModelDisplayName(modelName),
          group: groupName,
        });
      });
    });

    // Add non-GPT models
    const nonGptGroupNames: Record<string, string> = {
      "claude-": "Claude Models",
      "llama-": "Llama Models",
      "deepseek-": "DeepSeek Models",
      "qwen": "Qwen Models",
      "gemma": "Gemma Models",
      "mistral-": "Mistral Models",
      "minicpm-": "Other Models",
      "aya-": "Other Models",
      "baichuan": "Other Models",
      "chatglm": "Other Models",
      "command-": "Other Models",
      "internlm": "Other Models",
      "yi": "Other Models",
    };

    Object.entries(NON_GPT_MODELS).forEach(([modelId, modelData]) => {
      let groupName = "Other Models";

      // Determine group based on model ID prefix
      Object.entries(nonGptGroupNames).forEach(([prefix, name]) => {
        if (modelId.startsWith(prefix)) {
          groupName = name;
        }
      });

      options.push({
        value: modelId,
        label: modelData.displayName,
        group: groupName,
      });
    });

    // Sort options by group and then by label
    options.sort((a, b) => {
      const groupA = a.group || "";
      const groupB = b.group || "";
      if (groupA !== groupB) {
        return groupA.localeCompare(groupB);
      }
      return a.label.localeCompare(b.label);
    });

    return options;
  }, []);
}
