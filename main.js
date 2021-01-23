import DotEnv from "dotenv";
import Discord from "discord.js";
import OEIS from "oeis";

DotEnv.config();
const {
	TOKEN,
} = process.env;

const bot = new Discord.Client();
bot.login(TOKEN);

bot.on('ready', () => console.info(`Logged in as ${bot.user.tag}!`));

bot.on('message', async msg => {
	const [command, ...args] = msg.content.split(/[\s,]+/);
	switch (command) {
		case '!whatcomesnext': {
			const response = await OEIS.searchBySequence(args);
			const results = [...(response.results || [])];
			shuffleArray(results);
			for (const result of results) {
				const sequence = result.data.split(',');
				outer: for (let i = 0; i < sequence.length; i++) {
					if (sequence.length < i + args.length + 1) continue outer;
					for (let j = 0; j < args.length; j++) {
						if (sequence[i + j] != args[j]) continue outer;
					}
					msg.reply(`${sequence[i + args.length]} (https://oeis.org/A${result.number})`);
					return;
				}
			}
			
			msg.reply("I don't know :(");
		} break;
		
		case '!say': {
			const rest = msg.content.substr(5);
			msg.channel.send(rest);
		} break;
		
		case '!js': {
			const rest = msg.content.substr(4);
			msg.channel.send(eval(rest));
		} break;
	}
});

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
