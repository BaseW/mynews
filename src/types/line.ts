export type LineRequestPostDataContentEventSource = {
  userId: string;
  groupId: string;
}

export type LineRequestPostDataContentEvent = {
  source: LineRequestPostDataContentEventSource;
}

export type LineRequestPostDataContent = {
  events: LineRequestPostDataContentEvent[];
}

export type LineRequestPostData = {
  contents: string;
}

export type LineRequestPayload = {
  postData: LineRequestPostData;
}
