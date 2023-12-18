export const config = [
  { key: 'prompt', label: 'Prompt', type: 'string', required: true, exposeKey: 'prompt', exposeRequired: true },
  {
    key: 'negativePrompt',
    label: 'Negative Prompt',
    type: 'string',
    exposeKey: 'negative_prompt',
    exposeRequired: true,
  },
  { key: 'sampler', label: 'Sampler', type: 'string', exposeKey: 'sampler' },
  //override_settings.sd_model_checkpoint
  { key: 'steps', label: 'Steps', type: 'number', exposeKey: 'steps' },
  { key: 'width', label: 'Width', type: 'number', defaultValue: 512, exposeKey: 'width', exposeRequired: true },
  { key: 'height', label: 'Height', type: 'number', defaultValue: 512, exposeKey: 'height', exposeRequired: true },
  { key: 'cfgScale', label: 'CFG Scale', type: 'number', defaultValue: 7, exposeKey: 'cfg_scale' },
  { key: 'seed', label: 'Seed', type: 'number', defaultValue: -1, exposeKey: 'seed' },
  { key: 'clipSkip', label: 'Clip Skip', type: 'number', exposeKey: 'clip_skip' },
];
