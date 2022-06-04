export type SlackTextInfo = {
  type: string;
  text: string;
}

export type SlackBlockInfo = {
  type: string;
  text: SlackTextInfo;
}

export type SlackPayloadType = {
  blocks: SlackBlockInfo[];
}
