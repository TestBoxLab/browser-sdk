import { TestBoxMessage } from "@testboxlab/frontend-sdk/messaging/index";
import { MessageSender } from "./types";

export const NAVIGATE_REQUEST_EVENT = "navigate-request";
export const INITIALIZE = "initialize";

export const VALID_INCOMING_EVENTS = [NAVIGATE_REQUEST_EVENT, INITIALIZE];

// FYI, incoming events are typed slightly differently than outgoing
// events due to a this issue in TypeScript:
// https://github.com/microsoft/TypeScript/issues/33014

export type InitializeRequestEvent = {
  optInFullStory: boolean;
};

export type InitializeRequestMessage = TestBoxMessage<
  typeof INITIALIZE,
  InitializeRequestEvent
>;

export type NavigateRequestMessage = TestBoxMessage<
  typeof NAVIGATE_REQUEST_EVENT,
  string
>;

export type UnionedIncomingEvents =
  | InitializeRequestMessage
  | NavigateRequestMessage;