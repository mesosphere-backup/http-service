# HTTP Service [![Build Status](https://travis-ci.org/dcos-labs/http-service.svg?branch=master)](https://travis-ci.org/dcos-labs/http-service)

---
👩‍🔬  Please be aware that this package is still experimental —
changes to the interface  and underlying implementation are likely,
and future development or maintenance is not guaranteed.

---

This package wraps connections managed by the `@dcos/connection-manager` package into an Observable.

## Usage
```javascript
import { request, stream } from "@dcos/http-service";

request("http://localhost:4200/payload.json")
  .retry(3)
  .subscribe({
    next: ({ code, message, response }) => console.log(code, message, response),
    error: ({ code, message, response }) => console.error(code, message, response),
    complete: () => console.log("complete")
  });

stream("http://localhost:4200/mesos/api/v1", {
  method: "POST",
  responseType: "text",
  body: JSON.stringify({ type: "SUBSCRIBE" }),
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
})
  .subscribe({
    next: data => console.log(data),
    error: event => console.log(event),
    complete: () => console.log("complete")
  });
```
