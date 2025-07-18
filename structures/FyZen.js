const { Client, Collection, Intents, WebhookClient } = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
const Utils = require('./util');
const Sweepers = require('./Sweepers');
const { QuickDB } = require("quick.db");
const chalk = require('chalk');

module.exports = class FyZen extends Client {
    constructor() {
        super({
            intents: 3276543,
            fetchAllMembers: false,
            shards: 'auto',
            disableEveryone: true
        });

        process.emitWarning = (warning, type, code, ctor, detail) => {
            if (
                warning.includes('DeprecationWarning') ||
                warning.includes('ExperimentalWarning') ||
                warning.includes('MaxListenersExceededWarning')
            ) {
                return;
            }
            process.emit('warning', warning, type, code, ctor, detail);
        };

        this.config = require(`${process.cwd()}/config.json`);
        this.logger = require('./logger');
        this.commands = new Collection();
        this.categories = fs.readdirSync('./commands/');
        this.emoji = {
            tick: '<a:stolen_emoji:1330526992298414131>',
            cross: '<a:stolen_emoji:1330513545112064092>',
            dot: '•'
        };
        this.util = new Utils(this);
        this.Sweeper = new Sweepers(this);
        this.color = `#02b6e7`;
        this.support = ` `;
        this.cooldowns = new Collection();
        this.snek = require('axios');

        this.ratelimit = new WebhookClient({
            url: 'https://discord.com/api/webhooks/1309156830320263268/ShaqyQajH_iqk1qd39KuEhF8LwLrR2oeTPQV30ol7Dp46c9CTo7C3KEYeUxZ_A_mT_RX'
        });

        this.error = new WebhookClient({
            url: "https://discord.com/api/webhooks/1309156830320263268/ShaqyQajH_iqk1qd39KuEhF8LwLrR2oeTPQV30ol7Dp46c9CTo7C3KEYeUxZ_A_mT_RX"
        });

        this.on('error', (error) => {
            this.error.send(`\`\`\`js\n${error.stack}\`\`\``);
        });
        process.on('unhandledRejection', (error) => {
            this.error.send(`\`\`\`js\n${error.stack}\`\`\``);
        });
        process.on('uncaughtException', (error) => {
            this.error.send(`\`\`\`js\n${error.stack}\`\`\``);
        });
        process.on('warning', (warn) => {
            this.error.send(`\`\`\`js\n${warn}\`\`\``);
        });
        process.on('uncaughtExceptionMonitor', (err, origin) => {
            this.error.send(`\`\`\`js\n${err},${origin}\`\`\``);
        });

        this.on('rateLimit', (info) => {
            this.ratelimit.send({
                content: `\`\`\`js\nTimeout: ${info.timeout},\nLimit: ${info.limit},\nMethod: ${info.method},\nPath: ${info.path},\nRoute: ${info.route},\nGlobal: ${info.global}\`\`\``
            });
        });
    }

    async initializedata() {
        this.data = new QuickDB();
        this.logger.log(`${chalk.green('Connecting')} to ${chalk.cyan('Sql')}...`, 'event');
        this.logger.log(`${chalk.green('Sql Database Connected')}`, 'ready');
    }

    async initializeMongoose() {
        this.db = new (require('quickmongo').Database)(this.config.MONGO_DB);
        await this.db.connect();
        this.logger.log(`${chalk.green('Connecting')} to ${chalk.cyan('MongoDb')}...`, 'event');
        
        mongoose.connect(this.config.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            this.logger.log(`${chalk.green('Mongoose Database Connected')}`, 'ready');
        }).catch(err => {
            console.error('MongoDB Connection Error:', err);
        });
    }

    async loadEvents() {
        const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
        this.logger.log(`${chalk.yellow('Loaded')} ${chalk.cyan(eventFiles.length)} ${chalk.yellow('events')}.`, 'event');

        for (const file of eventFiles) {
            const event = require(`${process.cwd()}/events/${file}`);
            if (typeof event !== 'function') {
                console.error(`❌ Error: Event file '${file}' is not exporting a function!`);
                continue;
            }
            event(this); // Ensure event files are functions before calling them
        }
    }

    async loadlogs() {
        const logFiles = fs.readdirSync('./logs/').filter(file => file.endsWith('.js'));
        this.logger.log(`${chalk.yellow('Loaded')} ${chalk.cyan(logFiles.length)} ${chalk.yellow('logs')}.`, 'event');
        
        for (const file of logFiles) {
            const log = require(`${process.cwd()}/logs/${file}`);
            if (typeof log !== 'function') {
                console.error(`❌ Error: Log file '${file}' is not exporting a function!`);
                continue;
            }
            log(this);
        }
    }

    async loadMain() {
        const commandFiles = [];
        const commandDirectories = fs.readdirSync(`${process.cwd()}/commands`);

        for (const directory of commandDirectories) {
            const files = fs
                .readdirSync(`${process.cwd()}/commands/${directory}`)
                .filter((file) => file.endsWith('.js'));

            for (const file of files) {
                commandFiles.push(
                    `${process.cwd()}/commands/${directory}/${file}`
                );
            }
        }

        for (const value of commandFiles) {
            try {
                const file = require(value);
                const splitted = value.split('/');
                const directory = splitted[splitted.length - 2];

                if (file.name) {
                    const properties = { directory, ...file };
                    this.commands.set(file.name, properties);
                }
            } catch (error) {
                console.error(`❌ Error loading command '${value}':`, error);
            }
        }

        this.logger.log(`${chalk.yellow('Loaded')} ${chalk.cyan(this.commands.size)} ${chalk.yellow('commands')}.`, 'cmd');
    }
};
