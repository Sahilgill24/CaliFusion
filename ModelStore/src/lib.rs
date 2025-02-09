#![allow(clippy::len_without_is_empty)]

use std::collections::BTreeMap;

use calimero_sdk::borsh::{BorshDeserialize, BorshSerialize};
use calimero_sdk::env::ext::{AccountId, ProposalId};
use calimero_sdk::serde::{Deserialize, Serialize};
use calimero_sdk::{app, env};
use calimero_storage::collections::{unordered_map, StoreError, UnorderedMap, Vector};
use thiserror::Error;

#[app::state(emits = for<'a> Event<'a>)]
#[derive(Debug, BorshSerialize, BorshDeserialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct ModelStore {
    models: UnorderedMap<String, String>,
    // Models stored and the Key to access that model
    // AES encrypted model and key is used
    // key will be sent to the Node or Modeltrainer
    // using diffie-helman key exchange
    // On the trainers local machine the Model is
    // decrypted and training begins
    publisher: String,
    messages: UnorderedMap<ProposalId, Vector<Message>>,
    // these are for the external function calls 
}

#[derive(
    Clone, Debug, PartialEq, PartialOrd, BorshSerialize, BorshDeserialize, Serialize, Deserialize,
)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct Message {
    id: String,
    proposal_id: String,
    author: String,
    text: String,
    created_at: String,
}

#[app::event]
pub enum Event<'a> {
    ModelUploaded { key: &'a str, model: &'a str },
    ModelUpdated { key: &'a str, model: &'a str },
    ModelRemoved { key: &'a str },
    ModelCleared,
}

#[derive(Debug, Error, Serialize)]
#[serde(crate = "calimero_sdk::serde")]
#[serde(tag = "kind", content = "data")]
pub enum Error<'a> {
    #[error("key not found: {0}")]
    NotFound(&'a str),
    #[error("store error: {0}")]
    StoreError(#[from] StoreError),
}

#[app::logic]
impl ModelStore {
    #[app::init]
    pub fn init() -> ModelStore {
        ModelStore {
            models: UnorderedMap::new(),
            publisher: String::from("OWNER"),
            messages: UnorderedMap::new(),
        }
    }

    pub fn set(&mut self, key: String, model: String) -> Result<(), Error> {
        env::log(&format!("Uploaded model {:?} with key : {:?}", model, key));

        if self.models.contains(&key)? {
            app::emit!(Event::ModelUpdated {
                key: &key,
                model: &model,
            });
        } else {
            app::emit!(Event::ModelUploaded {
                key: &key,
                model: &model,
            });
        }

        self.models.insert(key, model)?;

        Ok(())
    }

    pub fn entries(&self) -> Result<BTreeMap<String, String>, Error> {
        env::log("Getting all entries");

        Ok(self.models.entries()?.collect())
    }

    pub fn len(&self) -> Result<usize, Error> {
        env::log("Getting the number of entries");

        Ok(self.models.len()?)
    }

    pub fn get<'a>(&self, key: &'a str) -> Result<Option<String>, Error<'a>> {
        env::log(&format!("Getting key: {:?}", key));

        self.models.get(key).map_err(Into::into)
    }

    pub fn get_unchecked(&self, key: &str) -> Result<String, Error> {
        env::log(&format!("Getting key without checking: {:?}", key));

        Ok(self.models.get(key)?.expect("key not found"))
    }

    pub fn get_result<'a>(&self, key: &'a str) -> Result<String, Error<'a>> {
        env::log(&format!("Getting key, possibly failing: {:?}", key));

        self.get(key)?.ok_or_else(|| Error::NotFound(key))
    }

    pub fn remove(&mut self, key: &str) -> Result<Option<String>, Error> {
        env::log(&format!("Removing key: {:?}", key));

        app::emit!(Event::ModelRemoved { key });

        self.models.remove(key).map_err(Into::into)
    }

    pub fn clear(&mut self) -> Result<(), Error> {
        env::log("Clearing all entries");

        app::emit!(Event::ModelCleared);

        self.models.clear().map_err(Into::into)
    }
}
