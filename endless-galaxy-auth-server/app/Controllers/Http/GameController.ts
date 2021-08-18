import GameService from 'App/Services/GameService';

export default class GameController {

	public async state() {
		return GameService.state;
	}

}
