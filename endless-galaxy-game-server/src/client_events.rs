use bevy::prelude::*;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub enum ClientEvent {
	Test(String),
	BuyShip(BuyShipOrder),
}

#[derive(Debug, Deserialize)]
pub struct BuyShipOrder {
	shipyard: Entity,
}
