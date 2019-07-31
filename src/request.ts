import { Observable } from "rxjs";
import ConnectionManager from
// @ts-ignore typescript-all-in
"@dcos/connection-manager";
import { XHRConnection, ConnectionEvent } from
// @ts-ignore typescript-all-in
"@dcos/connections";
import { fingerprintUrl } from "./helpers";
export default function request(
// @ts-ignore typescript-all-in
url, options = {}) {
  return Observable.create(function (
  // @ts-ignore typescript-all-in
  observer) {
    const connection = new XHRConnection(fingerprintUrl(url), options);
    connection.addListener(ConnectionEvent.ERROR, function (
    // @ts-ignore typescript-all-in
    event) {
      observer.error({
        code: event.target.xhr.status,
        message: event.target.xhr.statusText,
        response: event.target.response,
        responseType: event.target.responseType,
        responseHeaders: event.target.responseHeaders
      });
    });
    connection.addListener(ConnectionEvent.ABORT, function (
    // @ts-ignore typescript-all-in
    event) {
      observer.error({
        code: event.target.xhr.status,
        message: event.target.xhr.statusText,
        response: event.target.response,
        responseType: event.target.responseType,
        responseHeaders: {}
      });
    });
    connection.addListener(ConnectionEvent.COMPLETE, function (
    // @ts-ignore typescript-all-in
    event) {
      observer.next({
        code: event.target.xhr.status,
        message: event.target.xhr.statusText,
        response: event.target.response,
        responseType: event.target.responseType,
        responseHeaders: event.target.responseHeaders
      });
      observer.complete();
    });
    ConnectionManager.enqueue(connection); // Closing the connection when there are no subscribers left

    return function teardown() {
      ConnectionManager.dequeue(connection);
    };
  });
}