import { Observable } from "rxjs";
import ConnectionManager from "@dcos/connection-manager";
import { XHRConnection, ConnectionEvent } from "@dcos/connections";

export default function request(url, options = {}) {
  return Observable.create(function(observer) {
    const connection = new XHRConnection(url, options);

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
    connection.addListener(ConnectionEvent.COMPLETE, function(event) {
      observer.next({
        code: event.target.xhr.status,
        message: event.target.xhr.statusText,
        response: event.target.response
      });
      observer.complete();
    });

    ConnectionManager.enqueue(connection);

    // Closing the connection when there are no subscribers left
    return function teardown() {
      ConnectionManager.dequeue(connection);
    };
  });
}
