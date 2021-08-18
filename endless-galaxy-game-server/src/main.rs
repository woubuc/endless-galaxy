use std::time::{Duration};

use bevy::app::{ScheduleRunnerSettings};
use bevy::prelude::*;
use bevy::utils::HashMap;
use crossbeam::channel::{Receiver, Sender};

use crate::client_events::ClientEvent;
use crate::ws::ServerEvent;
use std::fs::{File};
use tar::{Builder, Header};
use serde::{Serialize, Deserialize};
use chrono::Utc;
use bevy::core::FixedTimestep;

mod ws;
mod client_events;

#[derive(Debug, Clone, PartialEq, Eq, Hash, StageLabel)]
enum Stage {
	ReceiveInput,
	SendOutput,
	Persist,
}

#[derive(Debug, Default)]
struct UserIdLookup {
	lookup: HashMap<usize, Entity>,
}

impl UserIdLookup {
	pub fn get(&self, user_id: usize) -> Option<&Entity> {
		self.lookup.get(&user_id)
	}

	pub fn add(&mut self, user_id: usize, entity: Entity) {
		self.lookup.insert(user_id, entity);
	}
}

const SECONDS_BETWEEN_SAVE: f64 = 10.0;

fn main() {
	dotenv::dotenv().ok();

	let (server_event_sender, server_event_receiver) = crossbeam::channel::unbounded();
	let (client_event_sender, client_event_receiver) = crossbeam::channel::unbounded();
	std::thread::spawn(move || ws::run(server_event_receiver, client_event_sender));

	App::build()
		.insert_resource(server_event_sender)
		.insert_resource(client_event_receiver)
		.insert_resource(UserIdLookup::default())
		.insert_resource(ScheduleRunnerSettings::run_loop(Duration::from_secs_f64(10.0 / 60.0)))
		.add_plugins(MinimalPlugins)
		.add_startup_system(setup.system())
		//.add_system(handle_buy_ship.system())
		//.add_system(move_ships.system())
		.add_stage_before(CoreStage::Update, Stage::ReceiveInput, SystemStage::single_threaded())
		.add_system_to_stage(Stage::ReceiveInput, process_incoming_client_events.system())
		.add_stage_after(CoreStage::Update, Stage::SendOutput, SystemStage::single_threaded())
		.add_system_to_stage(Stage::SendOutput, send_outgoing_server_events.system())
		.add_stage_after(Stage::SendOutput, Stage::Persist, SystemStage::single_threaded())
		.add_system_set_to_stage(Stage::Persist, SystemSet::new()
			.with_run_criteria(FixedTimestep::step(SECONDS_BETWEEN_SAVE))
			.with_system(persist.exclusive_system())
		)
		.run()
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Player {
	pub name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Wallet {
	money: i128,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Inventory {
	pub items: HashMap<ItemTypeId, InventoryStack>,
}

pub type ItemTypeId = String;

#[derive(Debug, Serialize, Deserialize)]
pub struct InventoryStack {
	pub amount: u16,
	pub value: u32,
}

type ShipTypeId = String;

#[derive(Debug, Serialize, Deserialize)]
pub struct ShipyardOrder {
	pub player: Entity,
	pub ship_type: ShipTypeId,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Shipyard {
	pub queue: Vec<ShipyardOrder>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Ship {
	pub planet: Entity,
	pub ship_type: ShipTypeId,
	pub movement_remaining: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Coordinate {
	pub x: isize,
	pub y: isize,
	pub z: isize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Planet {
	pub name: String,
}

fn setup(mut cmd: Commands) {
	let planet_alpha = cmd.spawn()
		.insert(Planet { name: "Alpha".into() })
		.insert(Coordinate { x: 2, y: -1, z: 0 })
		.id();

	let planet_beta = cmd.spawn()
		.insert(Planet { name: "Beta".into() })
		.insert(Coordinate { x: 4, y: 3, z: -2 })
		.with_children(|planet| {
			planet.spawn()
				.insert(Shipyard { queue: Vec::new() })
				.insert(Wallet { money: 1_000_00 })
				.insert(Inventory { items: HashMap::default() });
		})
		.id();
}

fn process_incoming_client_events(time: Res<Time>, client_events: Res<Receiver<ClientEvent>>) {
	println!("time: {}", time.delta().as_millis());
	while let Ok(evt) = client_events.try_recv() {
		println!("incoming client event: {:?}", evt);
	}
}

fn move_ships(mut ships: Query<&mut Ship>) {
	for mut ship in ships.iter_mut() {
		if ship.movement_remaining > 0 {
			ship.movement_remaining -= 1;
		}
	}
}

fn handle_buy_ship(
	mut players: Query<&mut Wallet, With<Player>>,
	mut shipyards: Query<(&Parent, &mut Shipyard)>,
	mut planets: Query<&Planet>,
) {
	for (planet, shipyard) in shipyards.iter_mut() {
		println!("shipyard: {:?}", shipyard);
		println!("planet: {:?}", planets.get(planet.0));
	}
}

fn send_outgoing_server_events(server_events: Res<Sender<ServerEvent>>) {}

#[derive(Debug)]
struct Game<'a> {
	players: Vec<(&'a Player, &'a Wallet)>,
	ships: Vec<(&'a Ship, &'a Inventory)>,
	shipyards: Vec<(&'a Shipyard, &'a Inventory)>
}

struct SaveFileBuilder {
	builder: Builder<File>,
}

impl SaveFileBuilder {
	pub fn new() -> Self {
		let filename = format!("./saves/{}.tar", Utc::now().timestamp());
		println!("[Persist] Saving world to {}", filename);

		let file = File::create(filename).unwrap();
		let builder = Builder::new(file);

		SaveFileBuilder { builder }
	}

	pub fn add<T: Serialize>(mut self, key: &'static str, data: Vec<T>) -> Self {
		let mut header = Header::new_gnu();
		let path = format!("{}.ron", key);
		println!("[Persist] -> {}", path);

		let data = ron::to_string(&data).unwrap();
		let bytes = data.as_bytes();
		header.set_size(bytes.len() as u64);

		self.builder.append_data(&mut header, path, bytes).unwrap();
		self
	}

	pub fn save(self) -> File {
		let file = self.builder.into_inner().expect("[Persist] Could not write save file");
		println!("[Persist] Done");
		file
	}
}

fn persist(world: &mut World) {
	std::fs::create_dir_all("./saves");
	SaveFileBuilder::new()
		.add("planets", world.query::<(Entity, &Planet, &Coordinate)>().iter(&world).collect())
		.add("players", world.query::<(Entity, &Player, &Wallet)>().iter(&world).collect())
		.add("ships", world.query::<(Entity, &Ship, &Inventory)>().iter(&world).collect())
		.add("shipyards", world.query::<(Entity, &Shipyard, &Inventory)>().iter(&world).collect())
		.save();
}