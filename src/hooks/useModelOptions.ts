import { useMemo } from "react";
import { type ComboboxOption } from "../components/ui/combobox-shadcn";
import { MODEL_DISPLAY_NAMES, MODEL_ENCODINGS } from "../utils/modelEncodings";

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
    };

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
          label: MODEL_DISPLAY_NAMES[modelName] || modelName,
          group: groupName,
        });
      });
    });

    return options;
  }, []);
}
