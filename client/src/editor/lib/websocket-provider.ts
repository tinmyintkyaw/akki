import { HocuspocusProviderWebsocket } from "@hocuspocus/provider";

const getSocketUrl = () => {
  const url = new URL("api/collab", window.location.origin);
  url.protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
};

const socketProvider = new HocuspocusProviderWebsocket({
  url: getSocketUrl(),
  maxAttempts: 10,
  // TODO: Handle what happens when after set amount of failed connect attempts
  // onMaxAttemptsFailed(data) {},
});

export { socketProvider };
