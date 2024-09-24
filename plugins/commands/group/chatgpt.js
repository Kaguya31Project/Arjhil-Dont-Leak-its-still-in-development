import axios from 'axios'; 

const config = {
    name: "chatgpt",
    aliases: ["chat", "gpt"],
    description: "Interact with GPT-4 via API",
    usage: "[query]",
    cooldown: 3,
    permissions: [0], 
    isAbsolute: false,
    isHidden: false,
    credits: "Arjhil",
};

const langData = {
    "lang_1": {
        "message": "Please provide a prompt to interact with the AI.",
    },
    "lang_2": {
        "message": "Kailangan mo magbigay ng prompt para makipag-ugnayan sa AI.",
    }
};

async function onCall({ message, args, getLang, data, userPermissions, prefix }) {
    if (args.length === 0) {

        return message.send(getLang("message"));
    }

    const input = args.join(" "); 
    const userId = data.user?.id || 100; 

    try {

        const { data } = await axios.get('https://gpt4-api-zl5u.onrender.com/api/gpt4o', {
            params: {
                prompt: input,
                uid: userId
            }
        });

        if (data && data.response) {
            message.send(data.response); 
        } else {
            message.send("Sorry, I couldn't understand the response from the AI.");
        }
    } catch (error) {
        message.send("An error occurred while trying to reach the AI. Please try again later.");
        console.error("Error while calling AI API:", error);
    }
}

export default {
    config,
    langData,
    onCall
};