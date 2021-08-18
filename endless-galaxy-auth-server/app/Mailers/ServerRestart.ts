import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail';

export default class ServerRestart extends BaseMailer {
	/**
	 * The prepare method is invoked automatically when you run
	 * "ServerRestart.send".
	 *
	 * Use this method to prepare the email message. The method can
	 * also be async.
	 */
	public prepare(message: MessageContract) {
		let date = new Date();

		message
			.from('noreply@endless-galaxy.com')
			.to('status@endless-galaxy.com')
			.replyTo('support@endless-galaxy.com', 'Endless Galaxy Support')
			.priority('low')
			.subject('[Status] Endless Galaxy server restarted')
			.text(`The Endless Galaxy server restarted at ${ date.toDateString() } ${ date.toTimeString() }.`);
	}
}
