import Rx from "rxjs";

import ConnectionManager from "@dcos/connection-manager";
import { XHRConnection, ConnectionEvent } from "@dcos/connections";

export default function stream(url, options = {}) {
  return Rx.Observable.create(function(observer) {
    const connection = new XHRConnection(url, options);

    connection.addListener(ConnectionEvent.DATA, function(event) {
      observer.next(event.target.response);
    });
    connection.addListener(ConnectionEvent.ERROR, function(event) {
      observer.error({
        code: event.target.xhr.status,
        message: event.target.xhr.statusText,
        response: event.target.response
      });
    });
    connection.addListener(ConnectionEvent.ABORT, function(event) {
      observer.error({
        code: event.target.xhr.status,
        message: event.target.xhr.statusText,
        response: event.target.response
      });
    });
    connection.addListener(ConnectionEvent.COMPLETE, function() {
      observer.complete();
    });

    ConnectionManager.enqueue(connection);

    // Closing the connection when there are no subscribers left
    return function teardown() {
      ConnectionManager.dequeue(connection);
    };
  });
}
