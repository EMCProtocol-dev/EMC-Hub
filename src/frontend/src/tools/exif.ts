import ExifReader from 'exifreader';

export async function parametersWith(file: File) {
  let tags = await ExifReader.load(file);
  let parameters = '';

  /**
   * TODO Not support decode user-comment because result is garbage characters
   */
  // if (tags.UserComment) {
  //   try {
  //     parameters = String.fromCodePoint(...(tags.UserComment?.value as number[]));
  //     //parameters = Buffer.from(tags.UserComment?.value as number[]).toString();
  //   } catch (e) {
  //     console.error(`parse 'UserComment' error`, tags.UserComment);
  //     console.error(e);
  //   }
  // } else
  if (tags.parameters) {
    parameters = tags.parameters?.value;
  } else {
    console.info(`not found 'parameters'`, tags);
  }

  return parameters;
}
