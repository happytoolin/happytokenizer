import { useMemo } from "react";
import { type ComboboxOption } from "../components/ui/combobox-shadcn";
import {
  MODEL_DISPLAY_NAMES,
  MODEL_ENCODINGS,
} from "../utils/modelEncodings";

export function useModelOptions() {
  return useMemo(() => {
    const options: ComboboxOption[] = [];

    const groupNames: Record<string, string> = {
      o200k_base: "Modern Models",
      cl100k_base: "Chat Models",
      p50k_base: "Completion Models",
      p50k_edit: "Edit Models",
      r50k_base: "Legacy Models",
      o200k_harmony: "OpenAI OSS",
    };

    const specialGroups: Record<
      string,
      { models: string[]; groupName: string }
    > = {
      search: {
        models: [
          "text-search-ada-doc-001",
          "text-search-ada-query-001",
          "text-search-babbage-doc-001",
          "text-search-babbage-query-001",
          "text-search-curie-doc-001",
          "text-search-curie-query-001",
          "text-search-davinci-doc-001",
          "text-search-davinci-query-001",
        ],
        groupName: "Search & Similarity",
      },
      similarity: {
        models: [
          "text-similarity-ada-001",
          "text-similarity-babbage-001",
          "text-similarity-curie-001",
          "text-similarity-davinci-001",
        ],
        groupName: "Search & Similarity",
      },
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
        groupName: "Audio & Media",
      },
      codeSearch: {
        models: [
          "code-search-ada-code-001",
          "code-search-ada-text-001",
          "code-search-babbage-code-001",
          "code-search-babbage-text-001",
        ],
        groupName: "Legacy Models",
      },
    };

    Object.entries(MODEL_ENCODINGS).forEach(([encoding, models]) => {
      if (encoding === "r50k_base") {
        models.forEach((modelName) => {
          let groupName = groupNames[encoding];
          let isInSpecialGroup = false;

          Object.values(specialGroups).forEach((group) => {
            if (group.models.includes(modelName)) {
              groupName = group.groupName;
              isInSpecialGroup = true;
            }
          });

          if (!isInSpecialGroup) {
            options.push({
              value: modelName,
              label: MODEL_DISPLAY_NAMES[modelName] || modelName,
              group: groupName,
            });
          }
        });

        Object.values(specialGroups).forEach((group) => {
          if (
            group.groupName.includes("Search") ||
            group.groupName.includes("Similarity") ||
            group.groupName.includes("Code") ||
            group.groupName.includes("Legacy")
          ) {
            group.models.forEach((modelName) => {
              if (MODEL_ENCODINGS.r50k_base.includes(modelName as any)) {
                options.push({
                  value: modelName,
                  label: MODEL_DISPLAY_NAMES[modelName] || modelName,
                  group: group.groupName,
                });
              }
            });
          }
        });
      } else {
        models.forEach((modelName) => {
          let groupName = groupNames[encoding];
          if (specialGroups.audioMedia.models.includes(modelName)) {
            groupName = specialGroups.audioMedia.groupName;
          }
          options.push({
            value: modelName,
            label: MODEL_DISPLAY_NAMES[modelName] || modelName,
            group: groupName,
          });
        });
      }
    });

    return options;
  }, []);
}