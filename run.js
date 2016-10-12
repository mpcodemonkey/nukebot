var Discord = require("discord.js");
var bot = new Discord.Client();
var fs = require('fs');
var sprintf = require("sprintf-js").sprintf;
var WSG = JSON.parse(fs.readFileSync('./data/survival_guide.json', 'utf8'));


//load excel sheet on startup
//var workbook = XLSX.readFile('./data/pdf_simplified.xlsx');

bot.on("message", msg => {
	
	let prefix = "nukebot";
	//exit if the current message does not contain the prefix
	if(!msg.content.startsWith(prefix)) return;
    

    //bot check to prevent botception
    if(msg.author.bot) return; 

    //ok, now onto the actual logic
    if (msg.content.startsWith(prefix)) {
    	var content = msg.content.split(" ").slice(1);

    	/**
    	*Here we list the valid commands:
    	*query: will query database for the next term entered
    	**/

    	if(content.length >= 1){
    		let command = content[0];

    		var result = "";

    		switch(command){
    			case "query":
    				//rebuild topic for query
    				let topic = content.slice(1);
    				if(topic){
    					msg.channel.sendMessage("querying the wasteland survival guide.....");
    					result = readGuide(topic);
    					msg.channel.sendMessage(result);
    				}
    				else
    					msg.channel.sendMessage("usage: query [topic]");
    				break;
    			case "roll":
    				break;
    			case "commands":
    				msg.channel.sendMessage("Command list: \ncommands: returns a list of all commands\nquery: queries the survival guide for general information");
    				break;
    			default:
    				msg.channel.sendMessage("I'm sorry, I didn't quite get that.");
    		}
    	}
    	else{
    		msg.channel.sendMessage("usage: nukebot <command> [args]");
    	}
    }

});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login("MjMzODAyOTI2NDcwOTg3Nzc3.Ctixow.wyx3iAXRTPpj326ITJNOvqwz2O0");

readGuide = function(topic) {

	var term = topic[0];
	var needle = topic.slice(1).join(" ");
	var result = "";

	switch(term){
		case "races":	
			var races = WSG["Races"];
			for(var race in races){
				if(races.hasOwnProperty(race)){
					var candidate = JSON.stringify(races[race]).toLowerCase();
					if(candidate.includes(needle.toLowerCase())){
						//format information for discord bot here
						var raceName = races[race];
						var stats = raceName["Stats"];
						var str = stats["STR"];
						var per = stats["PER"];
						var end = stats["END"];
						var cha = stats["CHA"];
						var int = stats["INT"];
						var agl = stats["AGL"];
						var luk = stats["LUK"];
						var cp = raceName["CP"];
						var pr = raceName["Perk Rate"];

						result += sprintf("**Race:**\t%s\n**Stat Ranges(min/max)**\n**Strength**:\t%s\n**Perception:**\t%s\n**Endurance:**\t%s\n**Charisma:**\t%s\n**Intelligence:**\t%s\n**Agility:**\t%s\n**Luck:**\t%s\n**Starting Character Points:**\t%s\n**Perk Rate:**\t%s\n----------------------\n", raceName["Race"], str, per, end, cha, int, agl, luk, cp, pr);

					}
				}
			}
			break;
		case "resistances":
			break;
		case "traits":
			break;
		case "stats":
			break
		case "skills":
			break;
		default:
			result ="no match found for " + needle;

	}

	return result;

}