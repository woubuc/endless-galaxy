use std::net::{TcpListener, TcpStream, IpAddr};

use crossbeam::channel::{Receiver, Sender};
use serde::{Deserialize, Serialize};
use tungstenite::{accept, Message, WebSocket};

use crate::client_events::ClientEvent;
use querystring::QueryParams;
use tungstenite::protocol::CloseFrame;
use tungstenite::protocol::frame::coding::CloseCode;

#[derive(Debug, Serialize, Deserialize)]
pub enum ServerEvent {}

pub type ClientPacket = (IpAddr, ClientEvent);

#[derive(Debug, Serialize, Deserialize)]
struct Auth {
	token: String,
}

fn url(endpoint: &str, query: QueryParams) -> String {
	return format!(
		"{}/_/{}?key={}&{}",
		std::env::var("SERVER_URL").expect("Missing env var: SERVER_URL"),
		endpoint,
		std::env::var("SERVER_KEY").expect("Missing env var: SERVER_KEY"),
		querystring::stringify(query.into()),
	);
}

pub fn run(server_events: Receiver<ServerEvent>, client_events: Sender<ClientEvent>) {
	let listener = TcpListener::bind("127.0.0.1:9000").expect("Could not bind to port");

	for stream in listener.incoming() {
		let mut websocket = accept(stream.unwrap()).unwrap();

		let server_events = server_events.clone();
		let client_events = client_events.clone();
		std::thread::spawn(move || handle_unauthorised(websocket, server_events, client_events));
	}
}

fn handle_unauthorised(mut websocket: WebSocket<TcpStream>, server_events: Receiver<ServerEvent>, client_events: Sender<ClientEvent>) {
	while let Ok(msg) = websocket.read_message() {
		if let Message::Text(json) = msg {
			println!("Received packet: {}", json);
			if let Ok(auth) = serde_json::from_str::<Auth>(&json) {
				println!("Received auth packet: {:?}", auth);
				if let Ok(user_id) = try_authorise(auth.token) {
					println!("Authorised: {}", user_id);
					websocket.write_message(Message::Text("auth".into()));
					return handle_authorised(user_id, websocket, server_events, client_events);
				} else {
					websocket.close(Some(CloseFrame {
						code: CloseCode::Invalid,
						reason: "invalid_token".into(),
					})).ok();
					return;
				}
			}
		}
	}
}

fn try_authorise(token: String) -> Result<String, ()> {
	let url = url("validate-token", vec![("token", &token)]);

	let response = ureq::get(&url).call().expect("Could not validate auth token");
	if response.status() == 200 {
		Ok(response.into_string().expect("Token validation is not a string"))
	} else {
		Err(())
	}
}

fn handle_authorised(user_id: String, mut websocket: WebSocket<TcpStream>, server_events: Receiver<ServerEvent>, client_events: Sender<ClientEvent>) {
	println!("[WS] Connection authorised: {}", user_id);
	loop {
		match websocket.read_message() {
			Ok(Message::Text(json)) => {
				if let Ok(evt) = serde_json::from_str::<ClientEvent>(&json) {
					client_events
						.send(evt)
						.expect("Could not send incoming client event to game");

					websocket.write_message(Message::Text(json));
				} else {
					eprintln!("[WS] WARN malformed event");
				}
			}
			Ok(Message::Close(_)) => {
				println!("[WS] Connection closed");
				return;
			}
			_ => {}
		}

		while let Ok(evt) = server_events.try_recv() {
			let payload = serde_json::to_string(&evt).unwrap();
			websocket.write_message(Message::Text(payload)).expect("Could not write message to websocket");
		}
	}
}