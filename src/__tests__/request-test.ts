import { XHRConnection, ConnectionEvent } from
// @ts-ignore typescript-all-in
"@dcos/connections";
import ConnectionManager from
// @ts-ignore typescript-all-in
"@dcos/connection-manager";
import request from "../request";
jest.mock("@dcos/connection-manager");
jest.mock("@dcos/connections", function () {
  return {
    ConnectionEvent: require.requireActual("@dcos/connections").ConnectionEvent,
    XHRConnection: jest.fn(function (url) {
      // @ts-ignore typescript-all-in
      this.events = {};
      Object.defineProperty(
      // @ts-ignore typescript-all-in
      this, "url", {
        value: url
      });
      Object.defineProperty(
      // @ts-ignore typescript-all-in
      this, "response", {
        get: function () {
          return this.xhr.response;
        },
        set: function (value) {
          if (!this.xhr) {
            this.xhr = {};
          }

          this.xhr.response = value;
        }
      });

      // @ts-ignore typescript-all-in
      this.addListener = (
      // @ts-ignore typescript-all-in
      type,
      // @ts-ignore typescript-all-in
      callback) => {
        if (!
        // @ts-ignore typescript-all-in
        this.events[type]) {
          // @ts-ignore typescript-all-in
          this.events[type] = [];
        }

        // @ts-ignore typescript-all-in
        this.events[type].push(callback);
      };

      // @ts-ignore typescript-all-in
      this.removeListener = (
      // @ts-ignore typescript-all-in
      type,
      // @ts-ignore typescript-all-in
      callback) => {
        // @ts-ignore typescript-all-in
        this.events[type] =
        // @ts-ignore typescript-all-in
        this.events[type].filter(
        // @ts-ignore typescript-all-in
        currCallback => currCallback !== callback);
      };

      // @ts-ignore typescript-all-in
      this.__emit = (
      // @ts-ignore typescript-all-in
      type,
      // @ts-ignore typescript-all-in
      ...rest) => {
        // @ts-ignore typescript-all-in
        this.events[type].forEach(
        // @ts-ignore typescript-all-in
        callback => {
          callback(...rest);
        });
      };
    })
  };
});
describe("request", () => {
  beforeEach(() => {
    XHRConnection.mockClear();
  });
  describe("with subscribers", () => {
    it("enqueues a connection", () => {
      spyOn(ConnectionManager, "enqueue");
      request("http://localhost").subscribe(() => {});
      expect(ConnectionManager.enqueue).toHaveBeenCalled();
    });
    it("dequeues a connection when there are no subscibers left", () => {
      spyOn(ConnectionManager, "dequeue");
      request("http://localhost").subscribe(jest.fn()).unsubscribe();
      expect(ConnectionManager.dequeue).toHaveBeenCalled();
    });
    it("calls next once and only when connection has completed", () => {
      const observer = {
        next: jest.fn()
      };
      request("http://localhost").subscribe(observer);
      const connectionMock = XHRConnection.mock.instances[0];
      connectionMock.xhr = {
        status: 201,
        statusText: "CREATED"
      };
      connectionMock.response = "some text";
      const connectionEventMock = {
        target: connectionMock
      };

      connectionMock.__emit(ConnectionEvent.COMPLETE, connectionEventMock);

      expect(observer.next).toHaveBeenCalledWith({
        response: "some text",
        code: 201,
        message: "CREATED"
      });
    });
    it("emits an error object on connection error", () => {
      const observer = {
        error: jest.fn()
      };
      request("http://localhost").subscribe(observer);
      const connectionMock = XHRConnection.mock.instances[0];
      connectionMock.xhr = {
        status: 404,
        statusText: "Not Found",
        response: "not found"
      };
      const connectionEventMock = {
        target: connectionMock
      };

      connectionMock.__emit(ConnectionEvent.ERROR, connectionEventMock);

      expect(observer.error).toHaveBeenCalledWith({
        code: 404,
        message: "Not Found",
        response: "not found"
      });
    });
    it("emits an error object on connection abort", () => {
      const observer = {
        error: jest.fn()
      };
      request("http://localhost").subscribe(observer);
      const connectionMock = XHRConnection.mock.instances[0];
      connectionMock.xhr = {
        status: 0,
        statusText: "abort",
        response: ""
      };
      const connectionEventMock = {
        target: connectionMock
      };

      connectionMock.__emit(ConnectionEvent.ABORT, connectionEventMock);

      expect(observer.error).toHaveBeenCalledWith({
        code: 0,
        message: "abort",
        response: "",
        responseHeaders: {}
      });
    });
  });
  describe("with no subscribers", () => {
    it("doesn't enqueue a connection", () => {
      spyOn(ConnectionManager, "enqueue");
      request("http://localhost");
      expect(ConnectionManager.enqueue).not.toHaveBeenCalled();
    });
  });
  describe("fingerprint url", () => {
    const partyLikeIts = new Date(1999, 12, 31, 23, 59, 59, 999).getTime();
    beforeEach(() => {
      jest.spyOn(Date, "now").mockImplementation(() => partyLikeIts);
    });
    it("adds a unique query parameter - without existing query parameters", () => {
      const observer = {
        next: jest.fn()
      };
      const testUrl = "http://localhost";
      request(testUrl).subscribe(observer);
      const connectionMock = XHRConnection.mock.instances[0];
      expect(connectionMock.url).toEqual(`${testUrl}?_ts=${partyLikeIts}`);
    });
    it("adds a unique query parameter - with existing query parameters", () => {
      const observer = {
        next: jest.fn()
      };
      const testUrl = "http://localhost?someparam";
      request(testUrl).subscribe(observer);
      const connectionMock = XHRConnection.mock.instances[0];
      expect(connectionMock.url).toEqual(`${testUrl}&_ts=${partyLikeIts}`);
    });
    it("does not duplicate timestamp query parameter", () => {
      const observer = {
        next: jest.fn()
      };
      const testUrl = "http://localhost?_ts=123456&someparam";
      request(testUrl).subscribe(observer);
      const connectionMock = XHRConnection.mock.instances[0];
      expect(connectionMock.url).toEqual(testUrl);
    });
  });
});