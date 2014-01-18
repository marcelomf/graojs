var GraoTools = require('./GraoTools');

try {
    var tools = new GraoTools({
        commands: new (require('../commands/GraoCommands'))(),
        server: new (require('../commands/GraoServerCommands'))(),
        generator: new (require('../commands/GraoGeneratorCommands'))()
    });
    tools.init();
} catch (exception) {
    console.log('Error: ' + exception);
    process.exit(-1);
}

module.exports = exports = tools;
