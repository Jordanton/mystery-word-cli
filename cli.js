const
    yargs = require('yargs'),
    app = require('./app')

const flags = yargs.usage('$0: usage --difficulty')
    .options('h', {
        alias: 'help',
        describe: 'displays help'
    })
    .options('d', {
        alias: 'difficulty',
        describe: 'sets the difficulty of the game  [choices: \'easy\', \'hard\']'
    })
    .argv

if (flags.help) {
    yargs.showHelp()
}

if (flags.difficulty) {
    app.run(flags)
}
