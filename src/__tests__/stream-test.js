import { XHRConnection, ConnectionEvent } from "@dcos/connections";
import ConnectionManager from "@dcos/connection-manager";
import stream from "../stream";

jest.mock("@dcos/connection-manager");
jest.mock("@dcos/connections", function() {
  return {
    ConnectionEvent: require.requireActual("@dcos/connections").ConnectionEvent,
    XHRConnection: jest.fn(function() {
      this.events = {};

      this.addListener = (type, callback) => {
        if (!this.events[type]) {
          this.events[type] = [];
        }
        this.events[type].push(callback);
      };
      this.removeListener = (type, callback) => {
        this.events[type] = this.events[type].filter(
          currCallback => currCallback !== callback
        );
      };
      this.__emit = (type, ...rest) => {
        this.events[type].forEach(callback => {
          callback(...rest);
        });
      };
    })
  };
});

describe("stream", () => {
  beforeEach(() => {
    XHRConnection.mockClear();
  });

  describe("with subscribers", () => {
    it("enqueues a connection", () => {
      spyOn(ConnectionManager, "enqueue");
      stream("http://localhost").subscribe(() => {});

      expect(ConnectionManager.enqueue).toHaveBeenCalled();
    });

    it("dequeues a connection when there are no subscibers left", () => {
      spyOn(ConnectionManager, "dequeue");
      stream("http://localhost")
        .subscribe(jest.fn())
        .unsubscribe();

      expect(ConnectionManager.dequeue).toHaveBeenCalled();
    });

    it("calls next on every DATA event", () => {
      const observer = {
        next: jest.fn()
      };

      stream("http://localhost").subscribe(observer);

      const connectionMock = XHRConnection.mock.instances[0];
      connectionMock.response = "chunk";

      const connectionEventMock = { target: connectionMock };
      connectionMock.__emit(ConnectionEvent.DATA, connectionEventMock);
      connectionMock.__emit(ConnectionEvent.DATA, connectionEventMock);
      connectionMock.__emit(ConnectionEvent.DATA, connectionEventMock);

      expect(observer.next).toHaveBeenCalledTimes(3);
      expect(observer.next).toHaveBeenCalledWith("chunk");
    });

    it("emits an error object on connection error", () => {
      const observer = {
        error: jest.fn()
      };

      stream("http://localhost").subscribe(observer);

      const connectionMock = XHRConnection.mock.instances[0];
      connectionMock.xhr = {
        status: 404,
        statusText: "Not Found"
      };
      const connectionEventMock = { target: connectionMock };
      connectionMock.__emit(ConnectionEvent.ERROR, connectionEventMock);

      expect(observer.error).toHaveBeenCalledWith({
        code: 404,
        message: "Not Found"
      });
    });

    it("emits an error object on connection abort", () => {
      const observer = {
        error: jest.fn()
      };

      stream("http://localhost").subscribe(observer);

      const connectionMock = XHRConnection.mock.instances[0];
      connectionMock.xhr = {
        status: 0,
        statusText: "abort"
      };
      const connectionEventMock = { target: connectionMock };
      connectionMock.__emit(ConnectionEvent.ABORT, connectionEventMock);

      expect(observer.error).toHaveBeenCalledWith({
        code: 0,
        message: "abort"
      });
    });
  });

  describe("with no subscribers", () => {
    it("doesn't enqueue a connection", () => {
      spyOn(ConnectionManager, "enqueue");
      stream("http://localhost");

      expect(ConnectionManager.enqueue).not.toHaveBeenCalled();
    });
  });
});
