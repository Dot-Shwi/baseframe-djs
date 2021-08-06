const Main = require(`./Main`);
class Err extends Main {
  static All = [];
  static DefaultLog = true;

  static LogAll() {
    this.InLog(Err.All);
  }

  /**
   * Create an error
   */
  constructor(
    message = "",
    code = "",
    object = { code: "ERR", message: "", at: new Date(), err: new Error() },
    onResolve = () => {}
  ) {
    code = code || "ERR";
    super(code);
    object = object || {};
    object.code = code;
    object.message = message;
    object.at = new Date();
    object.time = object.at.toLocaleTimeString();
    object.date = object.at.toLocaleDateString();
    object.timestamp = Date.now();
    object.err = new Error(message);
    this.code = code;
    this.message = message;
    this.object = object;
    this.resolved = false;
    this.id = Err.All.length + 1;
    this.onResolve = onResolve;

    if (Err.DefaultLog && !object.dont_log) this.LogErr();

    Err.All.push(this.info);
  }

  LogErr() {
    this.InLog(this.message);
  }

  get info() {
    return {
      id: this.id,
      code: this.code,
      message: this.message,
      resolved: this.resolved,
      at: this.object.at,
      time: this.object.time,
      date: this.object.date,
    };
  }
  set info(newInfo) {
    this.code = newInfo.code || this.code;
    this.message = newInfo.message || this.message;
    this.resolved = newInfo.resolved || this.resolved;
  }

  OnResolve(onResolveFunction = () => {}) {
    this.onResolve = onResolveFunction;
  }

  Resolve() {
    if (this.resolved) return;
    this.InLog(
      `Resolved error ${this.message} at ${new Date().toLocaleString()}.`
    );
    this.resolved = true;
    this.onResolve();
  }
}

module.exports = Err;
