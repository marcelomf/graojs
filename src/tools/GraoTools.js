var path = require('path'),
    fs = require('fs-extra'),
    prompt = require('prompt'),
    argv = require('optimist').argv;

var GraoTools = function (di) {
    var self = this;
    this.commands = di.commands;
    this.server = di.server;
    this.generator = di.generator;
    this.currentDir = process.cwd();
    this.cmdId = ( argv._.length > 0 )
        ? argv._[0]
        : null;

    this.actions = {};
    this.commandsMap = {};

    this.usage = function (msg) {

        console.log(( "\n" + fs.readFileSync(path.join(__dirname, '/../..', 'graojs.ascii'), { encoding: 'utf8' }) ).yellow);
        console.log("\n" + "Usage: grao [OPTION...] [NAME]".yellow + "\n" + Array(70).join('=').yellow);

        Object.keys(this.commandsMap).forEach(function (commandId) {
            var command = self.commandsMap[commandId];
            console.log("\n" + command.title + "\n" + Array(70).join('-'));
            for (var i in command.actions) {
                console.log(self.getActionDesc(command.id + ':' + command.actions[i].id));
            }
        });
        console.log("\n");

        if (msg != undefined) {
            console.log(msg);
        }
        process.exit(-1);
    };

    this.init = function () {
        self.mapCommands(this.commands);
        self.mapCommands(this.server);
        self.mapCommands(this.generator);

        if (this.cmdId === null) {
            this.usage();
        } else {
            this.run(this.cmdId, argv);
        }
    }

    this.mapCommands = function (commands) {
        this.commandsMap[commands.id] = commands;

        for (var i in commands.actions) {

            var action = commands.actions[i];
            var actionId = commands.id + ':' + action.id;
            this.actions[actionId] = action;
            this.actions[actionId].class = commands.id;

        };

    }

    this.getActionDesc = function (actionId) {

        if (this.actions.hasOwnProperty(actionId)) {
            var action = this.actions[actionId];
            return '  ' + actionId.green + Array(30 - actionId.length).join(' ') + action.desc;
        } else {
            return ( "\n  !! Error: Action [" + fullId + "] doesn't exist!\n" ).red.inverse;
        }

    }

    this.run = function (actionId, argv) {

        if (this.actions.hasOwnProperty(actionId)) {

            this.checkAppOnly(actionId);

            var action = this.actions[actionId];
            var command = this.commandsMap[action.class];

            console.log("\n" + action.desc.yellow);
            console.log(Array(70).join('-').yellow);

            prompt.message = "";
            prompt.delimiter = ":".green;
            prompt.override = argv;
            prompt.start();

            command[this.actions[actionId].method](argv, prompt, action.promptSchema);

        } else {

            var msg = "Error: Action [" + actionId + "] doesn't exist!";

            this.usage(msg.red.inverse);
        }

    }

    this.checkAppOnly = function (actionId) {

        if (this.actions.hasOwnProperty(actionId)) {

            if (this.actions[actionId].appOnly) {

                //var skeletonExists = fs.existsSync(path.join(this.currentDir, 'config/default.skeleton.json'));
                var prodJsExists = fs.existsSync(path.join(this.currentDir, 'config', 'prod.js'));
                var graoJsExists = fs.existsSync(path.join(this.currentDir, 'node_modules','graojs','index.js'));

                if (prodJsExists && graoJsExists) {

                    return true;

                } else {

                    var msg = "Error: Action [" + actionId + "] must run inside a graoJS project!";
                    this.usage(msg.red.inverse);

                }

            } else {
                /**
                 * @FIXME
                 */

            }


        } else {

            var msg = "Error: Action [" + actionId + "] doesn't exist!";
            this.usage(msg.red.inverse);

        }

    }
};
module.exports = exports = GraoTools;