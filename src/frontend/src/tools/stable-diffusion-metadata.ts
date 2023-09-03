import ExifReader from 'exifreader';

/**
 * Extract stable-diffusion image parameters
 * @param file {File|string} File or Http-Url
 * @returns
 */
export async function extract(file: File | string): Promise<[string, boolean]> {
  let tags = await ExifReader.load(file);
  let parameters = '';

  /**
   * TODO Not support decode user-comment because result is garbage characters
   */
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
    console.info(`not found 'parameters'`, tags);
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

const imageMetaKeyMap = new Map<string, string>([
  ['Seed', 'seed'],
  ['CFG scale', 'cfgScale'],
  ['Sampler', 'sampler'],
  ['Steps', 'steps'],
  ['Clip skip', 'clipSkip'],
]);
const getImageMetaKey = (key: string) => imageMetaKeyMap.get(key.trim()) ?? key.trim();
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
      currentKey = getImageMetaKey(part.slice(priorValueEnd + 1));
    } else {
      currentKey = getImageMetaKey(part);
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
  //TODO stringify...
  return '';
}