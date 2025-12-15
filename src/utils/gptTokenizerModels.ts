import * as gpt4o from "gpt-tokenizer/model/gpt-4o";
import * as gpt4o2024_05_13 from "gpt-tokenizer/model/gpt-4o-2024-05-13";
import * as gpt4o2024_08_06 from "gpt-tokenizer/model/gpt-4o-2024-08-06";
import * as gpt4o2024_11_20 from "gpt-tokenizer/model/gpt-4o-2024-11-20";
import * as gpt4oMini from "gpt-tokenizer/model/gpt-4o-mini";
import * as gpt4oMini2024_07_18 from "gpt-tokenizer/model/gpt-4o-mini-2024-07-18";
import * as gpt3_5Turbo from "gpt-tokenizer/model/gpt-3.5-turbo";
import * as gpt3_5Turbo0125 from "gpt-tokenizer/model/gpt-3.5-turbo-0125";
import * as gpt3_5Turbo1106 from "gpt-tokenizer/model/gpt-3.5-turbo-1106";
import * as gpt3_5Turbo0613 from "gpt-tokenizer/model/gpt-3.5-turbo-0613";
import * as gpt3_5Turbo16k0613 from "gpt-tokenizer/model/gpt-3.5-turbo-16k-0613";
import * as gpt4 from "gpt-tokenizer/model/gpt-4";
import * as gpt4Turbo from "gpt-tokenizer/model/gpt-4-turbo";
import * as gpt4Turbo2024_04_09 from "gpt-tokenizer/model/gpt-4-turbo-2024-04-09";
import * as gpt4TurboPreview from "gpt-tokenizer/model/gpt-4-turbo-preview";
import * as gpt40314 from "gpt-tokenizer/model/gpt-4-0314";
import * as gpt40613 from "gpt-tokenizer/model/gpt-4-0613";
import * as gpt432k from "gpt-tokenizer/model/gpt-4-32k";
import * as gpt41106Preview from "gpt-tokenizer/model/gpt-4-1106-preview";
import * as o1 from "gpt-tokenizer/model/o1";
import * as o1Mini from "gpt-tokenizer/model/o1-mini";
import * as o1Preview from "gpt-tokenizer/model/o1-preview";
import * as textDavinci003 from "gpt-tokenizer/model/text-davinci-003";
import * as textCurie001 from "gpt-tokenizer/model/text-curie-001";
import * as textBabbage001 from "gpt-tokenizer/model/text-babbage-001";
import * as textAda001 from "gpt-tokenizer/model/text-ada-001";
import * as codeDavinci002 from "gpt-tokenizer/model/code-davinci-002";

export const GPT_TOKENIZER_MODELS: Record<
  string,
  { estimateCost: (tokenCount: number) => any }
> = {
  "gpt-4o": gpt4o,
  "gpt-4o-2024-05-13": gpt4o2024_05_13,
  "gpt-4o-2024-08-06": gpt4o2024_08_06,
  "gpt-4o-2024-11-20": gpt4o2024_11_20,
  "gpt-4o-mini": gpt4oMini,
  "gpt-4o-mini-2024-07-18": gpt4oMini2024_07_18,

  "gpt-3.5-turbo": gpt3_5Turbo,
  "gpt-3.5-turbo-0125": gpt3_5Turbo0125,
  "gpt-3.5-turbo-1106": gpt3_5Turbo1106,
  "gpt-3.5-turbo-0613": gpt3_5Turbo0613,
  "gpt-3.5-turbo-16k-0613": gpt3_5Turbo16k0613,

  "gpt-4": gpt4,
  "gpt-4-turbo": gpt4Turbo,
  "gpt-4-turbo-2024-04-09": gpt4Turbo2024_04_09,
  "gpt-4-turbo-preview": gpt4TurboPreview,
  "gpt-4-0314": gpt40314,
  "gpt-4-0613": gpt40613,
  "gpt-4-32k": gpt432k,
  "gpt-4-1106-preview": gpt41106Preview,

  o1: o1,
  "o1-mini": o1Mini,
  "o1-preview": o1Preview,

  "text-davinci-003": textDavinci003,
  "text-curie-001": textCurie001,
  "text-babbage-001": textBabbage001,
  "text-ada-001": textAda001,
  "code-davinci-002": codeDavinci002,
};

export function getGptTokenizerEstimateCost(modelName: string) {
  const model = GPT_TOKENIZER_MODELS[modelName];
  return model?.estimateCost;
}
