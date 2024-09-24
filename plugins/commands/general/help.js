const config = {
    name: "help",
    _name: {
        "ar_SY": "الاوامر"
    },
    aliases: [" cmds", "menu"],
    version: "1.0.3",
    description: "Show all commands or command details",
    usage: "[command] (optional)",
    credits: "Arjhil"
};

const langData = {
    "en_US": {
        "help.list": `
𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜:
╭─╼━━━━━━━━╾─╮
{list}
╰─━━━━━━━━━╾─╯
❐ Prefix: » {prefix} «
❐ Type » {prefix}help <command> « to get more information about a specific command.
❐ Total commands:【 {total} 】`,
        "help.commandNotExists": "Command {command} does not exist.",
        "help.commandDetails": `
𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙳𝚎𝚝𝚊𝚒𝚕𝚜:
╭───────────────────────────╮
│ **Name**: {name}
│ **Aliases**: {aliases}
│ **Version**: {version}
│ **Description**: {description}
│ **Usage**: {prefix}{commandName} {usage}
│ **Permissions**: {permissions}
│ **Category**: {category}
│ **Cooldown**: {cooldown} seconds
│ **Credits**: {credits}
╰───────────────────────────╯
        `,
        "0": "Member",
        "1": "Group Admin",
        "2": "Bot Admin"
    },
    "vi_VN": {
        "help.list": "{list}\n\n⇒ Tổng cộng: {total} lệnh\n⇒ Sử dụng {syntax} [lệnh] để xem thêm thông tin về lệnh.",
        "help.commandNotExists": "Lệnh {command} không tồn tại.",
        "help.commandDetails": `
            𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙳𝚎𝚝𝚊𝚒𝚕𝚜:
            ╭───────────────────────────╮
            │ **Tên**: {name}
            │ **Tên khác**: {aliases}
            │ **Phiên bản**: {version}
            │ **Mô tả**: {description}
            │ **Cách sử dụng**: {prefix}{commandName} {usage}
            │ **Quyền hạn**: {permissions}
            │ **Thể loại**: {category}
            │ **Thời gian chờ**: {cooldown} giây
            │ **Người viết**: {credits}
            ╰───────────────────────────╯
        `,
        "0": "Thành viên",
        "1": "Quản trị nhóm",
        "2": "Quản trị bot"
    },
    "ar_SY": {
        "help.list": "{list}\n\n⇒ المجموع: {total} الاوامر\n⇒ يستخدم {syntax} [امر] لمزيد من المعلومات حول الأمر.",
        "help.commandNotExists": "امر {command} غير موجود.",
        "help.commandDetails": `
            𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙳𝚎𝚝𝚊𝚒𝚕𝚜:
            ╭───────────────────────────╮
            │ **اسم**: {name}
            │ **اسم مستعار**: {aliases}
            │ **وصف**: {description}
            │ **استعمال**: {prefix}{commandName} {usage}
            │ **الصلاحيات**: {permissions}
            │ **فئة**: {category}
            │ **وقت الانتظار**: {cooldown} ثواني
            │ **الاعتمادات**: {credits}
            ╰───────────────────────────╯
        `,
        "0": "عضو",
        "1": "إدارة المجموعة",
        "2": "ادارة البوت"
    }
};

function getCommandName(commandName) {
    if (global.plugins.commandsAliases.has(commandName)) return commandName;

    for (let [key, value] of global.plugins.commandsAliases) {
        if (value.includes(commandName)) return key;
    }

    return null;
}

async function onCall({ message, args, getLang, userPermissions, prefix }) {
    const { commandsConfig } = global.plugins;
    const commandName = args[0]?.toLowerCase();

    if (!commandName) {
        let commands = {};
        const language = data?.thread?.data?.language || global.config.LANGUAGE || 'en_US';
        for (const [key, value] of commandsConfig.entries()) {
            if (!!value.isHidden) continue;
            if (!!value.isAbsolute ? !global.config?.ABSOLUTES.some(e => e == message.senderID) : false) continue;
            if (!value.hasOwnProperty("permissions")) value.permissions = [0, 1, 2];
            if (!value.permissions.some(p => userPermissions.includes(p))) continue;
            if (!commands.hasOwnProperty(value.category)) commands[value.category] = [];
            commands[value.category].push(value._name && value._name[language] ? value._name[language] : key);
        }

        let list = Object.keys(commands)
            .flatMap(category => commands[category].map(cmd => `│ ✦ ${cmd}`))
            .join("\n");

        message.reply(getLang("help.list", {
            total: Object.values(commands).map(e => e.length).reduce((a, b) => a + b, 0),
            list,
            prefix: prefix
        }));
    } else {
        const command = commandsConfig.get(getCommandName(commandName, commandsConfig));
        if (!command) return message.reply(getLang("help.commandNotExists", { command: commandName }));

        const permissions = command.permissions.map(p => getLang(String(p))).join(", ");
        message.reply(getLang("help.commandDetails", {
            name: command.name,
            aliases: command.aliases.join(", "),
            version: command.version || "1.0.0",
            description: command.description || '',
            usage: command.usage || '',
            permissions,
            category: command.category,
            cooldown: command.cooldown || 3,
            credits: command.credits || ""
        }).replace(/^ +/gm, ''));
    }
}

export default {
    config,
    langData,
    onCall
};
