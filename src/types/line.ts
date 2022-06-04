export type LineRequestPostDataContentEventSource = {
  userId: string;
  groupId: string;
}

export enum LineRequestPostDataContentEventType {
  Message = "message",
}

export enum LineRequestPostDataContentEventMessageType {
  Text = "text",
}

export type LineRequestPostDataContentEventMessage = {
  type: LineRequestPostDataContentEventMessageType;
  id: string;
  text: string;
}

export type DeliveryContext = {
  isRedelivery: boolean;
}

export enum LineRequestPostDataContentEventMode {
  Active = "active",
}

export type LineRequestPostDataContentEvent = {
  type: LineRequestPostDataContentEventType;
  message: LineRequestPostDataContentEventMessage;
  webhookEventId: string;
  deliveryContext: DeliveryContext;
  timestamp: number;
  source: LineRequestPostDataContentEventSource;
  replyToken: string;
  mode: LineRequestPostDataContentEventMode;
}

export type LineRequestPostDataContent = {
  destination: string;
  events: LineRequestPostDataContentEvent[];
}

export type LineRequestPostData = {
  contents: string;
}

export type LineRequestPayload = {
  postData: LineRequestPostData;
}
