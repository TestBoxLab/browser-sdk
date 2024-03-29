import { sendMessageToTestBox } from "./messaging";
import { addFullStory } from "./fullstory";
import {
  CLICK,
  EXIT_FULLSCREEN,
  HEALTH_CHECK,
  INITIALIZE_ACK,
  INITIALIZE_FAIL,
  INITIALIZE_SUCCESS,
} from "./messaging/outgoing";
import { InitializeEvent } from "./messaging/incoming";
import { getConfigItem } from "./config";

export function initializeTestBox(data: InitializeEvent) {
  try {
    sendMessageToTestBox(INITIALIZE_ACK);
    initializeCookies();
    rewriteLinks();
    enhanceFullscreenExperience();
    startHealthChecks();

    if (data.optInFullStory && getConfigItem("allowFullStory")) {
      addFullStory();
    }

    sendMessageToTestBox(INITIALIZE_SUCCESS);
  } catch {
    sendMessageToTestBox(INITIALIZE_FAIL);
  }
}

function initializeCookies() {
  // Moar cookie hacks. In order to make Cloudflare cookies work
  // inside the TestBox, we need to make sure they have samesite=none
  // since the top-level origin != the iframe origin
  const nativeCookieSetter = (document as any).__lookupSetter__("cookie");
  const nativeCookieGetter = (document as any).__lookupGetter__("cookie");

  function setCookieOverride(value: string) {
    if (value.toLowerCase().includes("samesite")) {
      // TODO: probably need to do a regex replacement here.
    } else {
      value += ";samesite=none;secure";
    }
    // @ts-ignore
    return nativeCookieSetter.call(document, value);
  }

  (document as any).__defineSetter__("cookie", setCookieOverride);
  // Re-sets the getter as it gets lost during the seter overwrite
  (document as any).__defineGetter__("cookie", nativeCookieGetter);
}

function enhanceFullscreenExperience() {
  const ESCAPE_KEYS = ["27", "Escape"];

  window.addEventListener(
    "keydown",
    ({ key }: KeyboardEvent) => {
      if (ESCAPE_KEYS.includes(String(key))) {
        sendMessageToTestBox(EXIT_FULLSCREEN);
      }
    },
    false
  );
}

function rewriteLinks() {
  // remove all target = "_blank" props to keep pages inside the iframe ...
  const rewriteTargets = () => {
    var links = document.querySelectorAll("a[target]");
    for (var i = 0; i < links.length; i++) {
      links[i].removeAttribute("target");
    }
  };

  // watch for clicks to fix hrefs ...
  window.addEventListener(
    "click",
    (event) => {
      rewriteTargets();
      let target = "";
      if (event.target instanceof Element) {
        if (event.target.id) {
          target = `#${event.target.id}`;
        } else if (event.target.classList.length) {
          target = `.${event.target.classList.value.replaceAll(" ", ".")}`;
        } else {
          target = event.target.tagName;
        }
      }
      sendMessageToTestBox(CLICK, {
        x: event.x,
        y: event.y,
        target,
      });
    },
    false
  );

  const rewriteLoop = () => {
    rewriteTargets();
    setTimeout(() => {
      rewriteLoop();
    }, getConfigItem("linkTargetLoopInterval", 5000));
  };

  rewriteLoop();
}

function startHealthChecks() {
  const healthCheck = () => {
    sendMessageToTestBox(HEALTH_CHECK, {
      url: window.location.href,
    });
  };

  const healthLoop = () => {
    healthCheck();
    setTimeout(() => healthLoop(), getConfigItem("healthCheckInterval", 1000));
  };

  healthLoop();
}
