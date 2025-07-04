// Generated by Wrangler by running `wrangler types`
// Runtime types generated with workerd@1.20250317.0

declare namespace Cloudflare {
  interface Env {
    OAUTH_KV: KVNamespace;
    MCP_OBJECT: DurableObjectNamespace<import("./src/index").MyMCP>;
    ASSETS: Fetcher;
  }
}

interface Env extends Cloudflare.Env {}

// Begin runtime types
/*!
 * Copyright (c) Cloudflare. All rights reserved.
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS
 * OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT.
 * See the Apache Version 2.0 License for specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable */
// noinspection JSUnusedGlobalSymbols

declare var onmessage: never;

/**
 * An abnormal event (called an exception) which occurs as a result of calling a method or accessing a property of a web API.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMException)
 */
declare class DOMException extends Error {
  constructor(message?: string, name?: string);
  /* [MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMException/message) */
  readonly message: string;
  /* [MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMException/name) */
  readonly name: string;
}

// ... (truncated for brevity - this would contain the full worker configuration types)
