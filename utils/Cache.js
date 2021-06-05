const Main = require(`./Main`);

class Cache extends Main {

    static DefaultLog = false;
    static All = [];

    constructor(message, object) {
        super(`Cache`);
        object = object || {};
        this.message = message;
        object.at = new Date();
        this.object = object;
        this.id = Cache.All.length + 1;

        // Log
        if(Cache.DefaultLog) this.Log();
    }

    Log() {
        this.InLog(this.message);
    }

    get info() {
        return {
            id: this.id,
            message: this.message, 
            at: this.object.at,
            object: this.object
        }
    }

}

module.exports = Cache;