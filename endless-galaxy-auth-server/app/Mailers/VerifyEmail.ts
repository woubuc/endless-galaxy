import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail';
import Env from '@ioc:Adonis/Core/Env';
import User from 'App/Models/User';
import FeedService from 'App/Services/FeedService';
import { DateTime } from 'luxon';

export default class VerifyEmail extends BaseMailer {
	public constructor(private user: User) {
		super();
	}

	/**
	 * The prepare method is invoked automatically when you run
	 * "VerifyEmail.send".
	 *
	 * Use this method to prepare the email message. The method can
	 * also be async.
	 */
	public async prepare(message: MessageContract) {
		if (!this.user.emailVerifyToken) {
			throw new Error('Cannot send verification email without token');
		}
		this.user.emailVerifySent = DateTime.now();
		await this.user.save();
		await FeedService.emitUser(this.user);

		let url = `${ Env.get('CLIENT_DOMAIN') }/verify?email=${ encodeURIComponent(this.user.email) }&token=${ encodeURIComponent(this.user.emailVerifyToken!) }`;

		message
			.from('noreply@endless-galaxy.com', 'Endless Galaxy')
			.to(this.user.email)
			.subject('Verify your email address')
			.html(`
	<div style="margin:auto;padding:16px;width:100%;max-width:720px;background:#292524;color:white;font-family:sans-serif;">
		<h1 style="padding:16px;text-align:center;font-size:1.6em;font-weight:600;border-bottom:2px solid #44403C;">Endless Galaxy</h1>
		<p style="font-size:1em;">Welcome to Endless Galaxy! Please confirm your email address to start playing.</p>
		<a href="${ url }" style="margin-bottom:8px;padding:6px 8px;background:#7C3AED;color:white;border-radius:6px;font-weight:600;text-decoration:none;">Confirm your email address</a>

		<p style="font-size:0.9em;color:#A8A29E">Button doesn't work? Copy the following link into your browser:</p>
		<pre style="padding:6px 8px;border-radius:4px;background:#3F3B3A;font-size:0.9em;">${ url }</pre>
	</div>
`);
	}
}
