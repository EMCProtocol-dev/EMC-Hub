import ExifReader from 'exifreader';

/**
 *
    const text = `masterpiece, best quality, 1girl, (colorful),(delicate eyes and face), volumatic light, ray tracing, bust shot ,extremely detailed CG unity 8k wallpaper,solo,smile,intricate skirt,((flying petal)),(Flowery meadow) sky, cloudy_sky, moonlight, moon, night, (dark theme:1.3), light, fantasy, windy, magic sparks, dark castle,white hair
Negative prompt: paintings, sketches, fingers, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, (outdoor:1.6), backlight,(ugly:1.331), (duplicate:1.331), (morbid:1.21), (mutilated:1.21), (tranny:1.331), mutated hands, (poorly drawn hands:1.5), blurry, (bad anatomy:1.21), (bad proportions:1.331), extra limbs, (disfigured:1.331), (more than 2 nipples:1.331), (missing arms:1.331), (extra legs:1.331), (fused fingers:1.61051), (too many fingers:1.61051), (unclear eyes:1.331), lowers, bad hands, missing fingers, extra digit, (futa:1.1),bad hands, missing fingers, bad-hands-5
Steps: 20, Sampler: DPM++ 2M Karras, CFG scale: 8, Seed: 1931785963, Size: 512x832, Model hash: cca17b08da, Model: MAADBD2fp16, Denoising strength: 0.5, Clip skip: 2, Wildcard negative prompt: "paintings, sketches, fingers, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, (outdoor:1.6), backlight,(ugly:1.331), (duplicate:1.331), (morbid:1.21), (mutilated:1.21), (tranny:1.331), mutated hands, (poorly drawn hands:1.5), blurry, (bad anatomy:1.21), (bad proportions:1.331), extra limbs, (disfigured:1.331), (more than 2 nipples:1.331), (missing arms:1.331), (extra legs:1.331), (fused fingers:1.61051), (too many fingers:1.61051), (unclear eyes:1.331), lowers, bad hands, missing fingers, extra digit, (futa:1.1),bad hands, missing fingers, bad-hands-5", Hires upscale: 2, Hires steps: 20, Hires upscaler: Latent, Version: v1.3.2`;

    const metadata = StableDiffusionMetadata.parse(text);
    console.info(metadata);
    //--> {"steps":"20","sampler":"DPM++ 2M Karras","cfgScale":"8","seed":"1931785963","size":"512x832","Model hash":"cca17b08da","Model":"MAADBD2fp16","Denoising strength":"0.5","clipSkip":"2","Wildcard negative prompt":"\"paintings, sketches, fingers, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, (outdoor:1.6), backlight,(ugly:1.331), (duplicate:1.331), (morbid:1.21), (mutilated:1.21), (tranny:1.331), mutated hands, (poorly drawn hands:1.5), blurry, (bad anatomy:1.21), (bad proportions:1.331), extra limbs, (disfigured:1.331), (more than 2 nipples:1.331), (missing arms:1.331), (extra legs:1.331), (fused fingers:1.61051), (too many fingers:1.61051), (unclear eyes:1.331), lowers, bad hands, missing fingers, extra digit, (futa:1.1),bad hands, missing fingers, bad-hands-5\"","Hires upscale":"2","Hires steps":"20","Hires upscaler":"Latent","Version":"v1.3.2","prompt":"masterpiece, best quality, 1girl, (colorful),(delicate eyes and face), volumatic light, ray tracing, bust shot ,extremely detailed CG unity 8k wallpaper,solo,smile,intricate skirt,((flying petal)),(Flowery meadow) sky, cloudy_sky, moonlight, moon, night, (dark theme:1.3), light, fantasy, windy, magic sparks, dark castle,white hair","negativePrompt":"paintings, sketches, fingers, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, (outdoor:1.6), backlight,(ugly:1.331), (duplicate:1.331), (morbid:1.21), (mutilated:1.21), (tranny:1.331), mutated hands, (poorly drawn hands:1.5), blurry, (bad anatomy:1.21), (bad proportions:1.331), extra limbs, (disfigured:1.331), (more than 2 nipples:1.331), (missing arms:1.331), (extra legs:1.331), (fused fingers:1.61051), (too many fingers:1.61051), (unclear eyes:1.331), lowers, bad hands, missing fingers, extra digit, (futa:1.1),bad hands, missing fingers, bad-hands-5","width":512,"height":832,"hashes":{"model":"cca17b08da"},"resources":[{"type":"model","name":"MAADBD2fp16","hash":"cca17b08da"}]}
    
    const text2 = StableDiffusionMetadata.stringify(metadata);
    console.info(text === text2); 
    //--> true
 */

/**
 * Extract stable-diffusion image parameters
 * @param file {File|string} File or Http-Url
 * @returns
 */
export async function extract(file: File | string): Promise<[string, boolean]> {
  const tags = await ExifReader.load(file);
  let parameters = '';

  if (tags.UserComment) {
    try {
      const decoder = new TextDecoder('utf-8');
      const result = decoder.decode(Buffer.from(tags.UserComment?.value as number[]));
      const p = document.createElement('p');
      p.innerHTML = result;
      parameters = p.innerHTML;
      p.remove();
    } catch (e) {
      console.error(`parse 'UserComment' error`, tags.UserComment);
      console.error(e);
    }
  } else if (tags.parameters) {
    parameters = tags.parameters?.value;
  } else {
    console.warn(`not found 'parameters' and 'UserComment'`, tags);
  }

  if (parameters) {
    parameters = unescape(parameters.replace('UNICODE', '').replace(/�/g, ''));
  }

  return [parameters, parameters.includes('Steps: ')];
}

type ImageMeta = {
  prompt?: string;
  negativePrompt?: string;
  steps?: string;
  sampler?: string;
  cfgScale?: string;
  seed?: string;
  clipSkip?: string;
  hashes?: { [k: string]: any };
  width?: number;
  height?: number;
  resources?: Resource[];
} & Record<string, any>;

type Resource = {
  type: string;
  name: string;
  weight?: number;
  hash?: string;
};
const imageMetadataKeys: Array<[string, string]> = [
  ['Seed', 'seed'],
  ['CFG scale', 'cfgScale'],
  ['Sampler', 'sampler'],
  ['Steps', 'steps'],
  ['Clip skip', 'clipSkip'],
  ['Size', 'size'],
];
const imageMetaKeyMap = new Map<string, string>(imageMetadataKeys);
const imageMetaKeyReverseMap = new Map<string, string>(
  imageMetadataKeys.map((i) => i.reverse()) as Array<[string, string]>
);
const getImageMetaKey = (key: string, keyMap: Map<string, string>) => keyMap.get(key.trim()) ?? key.trim();
const automaticExtraNetsRegex = /<(lora|hypernet):([a-zA-Z0-9_\.]+):([0-9.]+)>/g;
const automaticNameHash = /([a-zA-Z0-9_\.]+)\(([a-zA-Z0-9]+)\)/;
const badExtensionKeys = ['Resources: ', 'Hashed prompt: ', 'Hashed Negative prompt: '];
const stripKeys = ['Template: ', 'Negative Template: '] as const;
const hashesRegex = /, Hashes:\s*({[^}]+})/;

/**
 * Parse stable-diffusion image parameters
 * Part of the code reference "civitai" [https://github.com/civitai/civitai/blob/b367192a05a3ac0d9a064f978ba3077d8e0aab1b/src/utils/metadata/automatic.metadata.ts]
 * @param parameters
 * @returns {ImageMeta}
 *
 */
export function parse(parameters: string): ImageMeta {
  const metadata: ImageMeta = {};
  if (!parameters) return metadata;

  const metaLines = parameters.split('\n').filter((line) => {
    return line.trim() !== '' && !stripKeys.some((key) => line.startsWith(key));
  });

  let detailsLineIndex = metaLines.findIndex((line) => line.startsWith('Steps: '));
  let detailsLine = metaLines[detailsLineIndex] || '';
  // Strip it from the meta lines
  if (detailsLineIndex > -1) metaLines.splice(detailsLineIndex, 1);
  // Remove meta keys I wish I hadn't made... :(
  for (const key of badExtensionKeys) {
    if (!detailsLine.includes(key)) continue;
    detailsLine = detailsLine.split(key)[0];
  }

  // Extract Hashes
  const hashes = detailsLine?.match(hashesRegex)?.[1];
  if (hashes && detailsLine) {
    metadata.hashes = JSON.parse(hashes);
    detailsLine = detailsLine.replace(hashesRegex, '');
  }

  let currentKey = '';
  const parts = detailsLine.split(': ') ?? [];
  for (const part of parts) {
    const priorValueEnd = part.lastIndexOf(',');
    if (parts[parts.length - 1] === part) {
      metadata[currentKey] = part.trim();
    } else if (priorValueEnd !== -1) {
      metadata[currentKey] = part.slice(0, priorValueEnd).trim();
      currentKey = getImageMetaKey(part.slice(priorValueEnd + 1), imageMetaKeyMap);
    } else {
      currentKey = getImageMetaKey(part, imageMetaKeyMap);
    }
  }

  // Extract prompts
  const [prompt, ...negativePrompt] = metaLines
    .join('\n')
    .split('Negative prompt:')
    .map((x) => x.trim());
  metadata.prompt = prompt;
  metadata.negativePrompt = negativePrompt.join(' ').trim();

  // Extract resources
  const extranets = [...prompt.matchAll(automaticExtraNetsRegex)];
  const resources: Resource[] = extranets.map(([, type, name, weight]) => ({
    type,
    name,
    weight: parseFloat(weight),
  }));

  if (metadata.Size || metadata.size) {
    const sizes = (metadata.Size || metadata.size || '0x0').split('x');
    if (!metadata.width) {
      metadata.width = parseFloat(sizes[0]) || 0;
    }
    if (!metadata.height) {
      metadata.height = parseFloat(sizes[1]) || 0;
    }
  }

  if (metadata['Model'] && metadata['Model hash']) {
    const model = metadata['Model'] as string;
    const modelHash = metadata['Model hash'] as string;
    if (!metadata.hashes) metadata.hashes = {};
    if (!metadata.hashes['model']) metadata.hashes['model'] = modelHash;

    resources.push({
      type: 'model',
      name: model,
      hash: modelHash,
    });
  }

  if (metadata['Hypernet'] && metadata['Hypernet strength'])
    resources.push({
      type: 'hypernet',
      name: metadata['Hypernet'] as string,
      weight: parseFloat(metadata['Hypernet strength'] as string),
    });

  if (metadata['AddNet Enabled'] === 'True') {
    let i = 1;
    while (true) {
      const fullname = metadata[`AddNet Model ${i}`] as string;
      if (!fullname) break;
      const [, name, hash] = fullname.match(automaticNameHash) ?? [];

      resources.push({
        type: (metadata[`AddNet Module ${i}`] as string).toLowerCase(),
        name,
        hash,
        weight: parseFloat(metadata[`AddNet Weight ${i}`] as string),
      });
      i++;
    }
  }

  metadata.resources = resources;
  return metadata;
}

export function stringify(metadata: ImageMeta): string {
  const { prompt, negativePrompt, width, height, hashes, resources, ...other } = metadata;
  // [width, height, hashes, resources] is ignore keys
  const lines: string[] = [];
  if (!prompt || !other.steps) {
    //invalid metadata
    return '';
  }
  lines.push(prompt);
  if (negativePrompt) {
    lines.push(`Negative prompt: ${negativePrompt}`);
  }
  const details: string[] = [];
  Object.entries(other).forEach(([_k, v]) => {
    const k = getImageMetaKey(_k, imageMetaKeyReverseMap);
    details.push(`${k}: ${v}`);
  });
  lines.push(details.join(', '));

  return lines.join('\n');
}
