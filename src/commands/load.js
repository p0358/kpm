let path = require('path');
let fs = require('fs');

module.exports = () => {
    return {
        run: function(args, api, event) {
            if (args.length !== 1) {
                api.sendMessage($$`Too many arguments given to load.`, event.thread_id);
                return;
            }
            let lowerName = args[0].trim().toLowerCase();
            let loadDir;
            let module = this.modulesLoader.getLoadedModules().filter((val) => {
                    return val.name.toLowerCase() === lowerName;
                })[0];
            if (module) {
                api.sendMessage($$`"${args[0]}" is already loaded.`, event.thread_id);
                return;
            }
            try {
                loadDir = path.resolve('./modules/' + lowerName);
                let stats = fs.lstatSync(loadDir);
                if (!stats.isDirectory()) {
                    throw Error($$`"${lowerName}" failed to load - no such module.`);
                }
            }
            catch (e) {
                api.sendMessage($$`"${lowerName}" failed to load - no such module.`, event.thread_id);
                return;
            }
            try {
                let descriptor = this.modulesLoader.verifyModule(loadDir);
                this.modulesLoader.loadModule(descriptor, this);
                api.sendMessage($$`"${lowerName}" has been loaded.`, event.thread_id);
            }
            catch (e) {
                console.critical(e);
                api.sendMessage($$`"${lowerName}" failed to load.`, event.thread_id);
            }
        },
        command: 'load <moduleName>',
        help: $$`Loads a module.`,
        detailedHelp: $$`Loads a module extended`
    };
};
