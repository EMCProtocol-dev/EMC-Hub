

export const config = [
  { key: 'prompt', type: 'string', required: true, exposeKey: 'prompt', exposeRequired: true },
  { key: 'negativePrompt', type: 'string', exposeKey: 'negative_prompt', exposeRequired: true },
  { key: 'sampler', type: 'string', exposeKey: 'sampler' },
  //override_settings.sd_model_checkpoint
  { key: 'steps', type: 'number', exposeKey: 'steps' },
  { key: 'width', type: 'number', defaultValue: 512, exposeKey: 'width', exposeRequired: true },
  { key: 'height', type: 'number', defaultValue: 512, exposeKey: 'height', exposeRequired: true },
  { key: 'cfgScale', type: 'number', defaultValue: 7, exposeKey: 'cfg_scale' },
  { key: 'seed', type: 'number', defaultValue: -1, exposeKey: 'seed' },
  { key: 'clipSkip', type: 'number', exposeKey: 'clip_skip' },
];
