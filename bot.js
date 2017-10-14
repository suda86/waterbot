const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;
const rp = require('minimal-request-promise');

module.exports = botBuilder((request, originalApiRequest) => {
	if (
		!request.postback &&
		['hello', 'Hello', 'Hi', 'hi'].indexOf(request.text) !== -1
	) {
		return rp
			.get(
				`https://graph.facebook.com/v2.6/${request.sender}?fields=first_name&access_token=${originalApiRequest
					.env.facebookAccessToken}`
			)
			.then(response => {
				const user = JSON.parse(response.body);
				return [`Hello, ${user.first_name}! How are you?`];
			});
	}

	if (!request.postback && request.text.toLowerCase() === 'start') {
		return [
			new fbTemplate.Text(
				`This is your menu. You can reach it by writing Menu/Help or Start 🙂`
			)
				.addQuickReply(`About water bot`, 'ABOUT_WATER_BOT')
				.addQuickReply(`Change Alerts`, 'ReminderFrequency')
				.get()
		];
	}

	if (request.text && !request.postback) {
		return rp
			.get(
				`https://graph.facebook.com/v2.6/${request.sender}?fields=first_name&access_token=${originalApiRequest
					.env.facebookAccessToken}`
			)
			.then(response => {
				const user = JSON.parse(response.body);
				return 'Sorry Александар. I am a young WaterBot and still learning. Type "Start" to show the start over"';
			});
	}

	if (request.text === 'Start') {
		return rp
			.get(
				`https://graph.facebook.com/v2.6/${request.sender}?fields=first_name&access_token=${originalApiRequest
					.env.facebookAccessToken}`
			)
			.then(response => {
				const user = JSON.parse(response.body);
				// Then let's send two text messages and one generic template with three elements/bubbles
				return [
					`Hi, ${user.first_name}! I am your personal water trainer! :)`,
					new fbTemplate.Text(
						'☑ Daily water reminders \n☑ Personalized AI recommendations \n☑ Number of cups of water drank this week \n☑ Tips about water drinking'
					)
						.addQuickReply(`Let's Start`, 'LETS_START')
						.get()
				];
			});
	}
	if (request.text === 'LETS_START') {
		return [
			'Before we begin...',
			new fbTemplate.Text('How many cups of water do you drink a day?')
				.addQuickReply(`1-2 cups`, '12CUPS')
				.addQuickReply(`3-5 cups`, '35CUPS')
				.addQuickReply(`6 and more`, '6ANDMORE')
				.addQuickReply(`i don't count`, 'IDONTCOUNT')
				.get()
		];
	}
	if (request.text === '12CUPS' || request.text === 'IDONTCOUNT') {
		return [
			new fbTemplate.Image(
				'https://scontent.xx.fbcdn.net/v/t34.0-0/p280x280/17198292_263277337448448_1721647584_n.jpg?_nc_ad=z-m&_nc_cid=0&oh=fe06ed47afc185c27a3a365080a7645c&oe=59E3F626'
			).get(),
			'Recommended amount of water per day is eight 8-ounce glasses, equals to about 2 liters, or half a gallon.',
			new fbTemplate.Text('Choose the frequency for water break reminders?')
				.addQuickReply(`3 times a day`, '3TIMESADAY')
				.addQuickReply(`Twice a day`, 'TWICEADAY')
				.addQuickReply(`Once a day`, 'ONCEADAY')
				.get()
		];
	}

	if (request.text === '35CUPS') {
		return [
			new fbTemplate.Image(
				'https://scontent.xx.fbcdn.net/v/t34.0-0/p280x280/17821593_277151852727663_561650605_n.jpg?_nc_ad=z-m&_nc_cid=0&oh=de93a5e429959aa6c838c8512b66506b&oe=59E3E596'
			).get(),
			'Recommended amount of water per day is eight 8-ounce glasses, equals to about 2 liters, or half a gallon.',
			new fbTemplate.Text('Choose the frequency for water break reminders?')
				.addQuickReply(`3 times a day`, '3TIMESADAY')
				.addQuickReply(`Twice a day`, 'TWICEADAY')
				.addQuickReply(`Once a day`, 'ONCEADAY')
				.get()
		];
	}

	if (request.text.toLowerCase() === 'ABOUT_WATER_BOT') {
		return [
			'Thanks for asking 🙂',
			'WaterBot  was created by SPARTANS AI LTD. We build innovative AI driven products.',
			`WaterBot's goal is to help you drink more water for a healthier life.`,
			new fbTemplate.Text(
				`☑ Daily water reminders \n☑ Personalized AI recommendations \n☑ Number of cups of water drank this week \n☑ Tips about water drinking`
			)
				.addQuickReply(`About water bot`, 'ABOUT_WATER_BOT')
				.addQuickReply(`Change Alerts`, 'ReminderFrequency')
				.get()
		];
	}

	if (request.text === '6ANDMORE') {
		return [
			new fbTemplate.Image(
				'https://scontent.xx.fbcdn.net/v/t34.0-0/p280x280/16977125_258724977903684_188539519_n.jpg?_nc_ad=z-m&_nc_cid=0&oh=b6ef5f3e643e1089787e46b0b9936289&oe=59E2D811'
			).get(),
			`Your'e a real champ 🥂 8 cups is the recommended amount.`,
			new fbTemplate.Text('Choose the frequency for water break reminders?')
				.addQuickReply(`Once a day`, 'ONCEADAY')
				.get()
		];
	}

	if (
		request.text === '3TIMESADAY' ||
		request.text === 'TWICEADAY' ||
		request.text === 'ONCEADAY'
	) {
		return [
			'Noted 🙂',
			new fbTemplate.Text(
				`Let's give it a try now, drink 1 cup of water and press the button`
			)
				.addQuickReply(`Done`, 'DONE')
				.get()
		];
	}

	if (request.text === 'DONE') {
		return rp
			.get(
				`https://graph.facebook.com/v2.6/${request.sender}?fields=first_name&access_token=${originalApiRequest
					.env.facebookAccessToken}`
			)
			.then(response => {
				const user = JSON.parse(response.body);
				return [
					new fbTemplate.Image(
						'https://scontent.xx.fbcdn.net/v/t34.0-0/p280x280/16977125_258724977903684_188539519_n.jpg?_nc_ad=z-m&_nc_cid=0&oh=b6ef5f3e643e1089787e46b0b9936289&oe=59E2D811'
					).get(),
					`Well done ${user.first_name}! Keep it up!`,
					'You can always get to the menu by asking for "Menu" 🙂'
				];
			});
	}

	if (request.text === 'CreateabotonChatfuel') {
		return [
			new fbTemplate.Image(
				'https://scontent.xx.fbcdn.net/v/t34.0-0/p280x280/21291598_344866679289513_1156040944_n.jpg?_nc_ad=z-m&_nc_cid=0&oh=2c93cefab8c5be50f555831982de21d6&oe=59E3A07E'
			).get(),
			new fbTemplate.Button(`WaterBot is powered by Chatfuel — a free and easy to use platform for creating chatbots without coding.
Building a bot on Chatfuel can help you increase audience retention, drive sales, or make an outstanding personal resume.
Just ask Adidas, Audi, British Airways, TechCrunch, LA Times, and thousands of our other users!
Big brands, small businesses, celebrities, or chatbot enthusiasts - this tool is for you!`)
				.addButton(
					'Create your own bot',
					'https://chatfuel.com/?page_ref_id=247439692365546'
				)
				.get()
		];
	}

	if (request.text === 'ReminderFrequency') {
		return new fbTemplate.Text(
			'Changing frequency is super easy. Select new frequency:'
		)
			.addQuickReply(`3 times a day`, '3TIMESADAY')
			.addQuickReply(`Twice a day`, 'TWICEADAY')
			.addQuickReply(`Once a day`, 'ONCEADAY')
			.get();
	}
});
