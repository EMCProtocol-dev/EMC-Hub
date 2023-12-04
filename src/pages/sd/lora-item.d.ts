export type LoraItemCover = {
  url: string;
};

export type LoraItem = {
  label: string;
  modelName: string;
  modelVersion: string;
  covers: LoraItemCover[];
  alias: string;
  hashCodeSha256: string;
  shortHashCodeSha256: string;
};
