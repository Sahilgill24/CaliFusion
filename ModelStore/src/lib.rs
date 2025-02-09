use calimero_sdk::borsh::{BorshDeserialize, BorshSerialize};
use calimero_sdk::env::ext::{AccountId, ProposalId};
use calimero_sdk::serde::{Deserialize, Serialize};
use calimero_sdk::types::Error;
use calimero_sdk::{app, env};
use calimero_storage::collections::{StoreError, UnorderedMap, Vector};
use std::collections::BTreeMap;

#[app::state(emits = for<'a> Event<'a>)]
#[derive(Debug, BorshSerialize, BorshDeserialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct ModelStore {
    models: UnorderedMap<String, String>,
    messages: UnorderedMap<ProposalId, Vector<Message>>,
    publisher: String,
    model_price: u128,
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
    PaymentProposalCreated { proposal_id: ProposalId },
    PaymentApproved { proposal_id: ProposalId },
}

#[app::logic]
impl ModelStore {
    #[app::init]
    pub fn init() -> ModelStore {
        ModelStore {
            models: UnorderedMap::new(),
            messages: UnorderedMap::new(),
            publisher: String::from("OWNER"),
            model_price: 100_000_000,
        }
    }

    pub fn create_proposal(
        &mut self,
        receiver_id: String,
        key: String,
        model: String,
    ) -> Result<ProposalId, Error> {
        env::log("Creating transfer proposal");

        let proposal_id = Self::external()
            .propose()
            .transfer(AccountId(receiver_id), self.model_price)
            .send();

        if self.models.contains(&key)? {
            app::emit!(Event::ModelUpdated {
                key: &key,
                model: &model
            });
        } else {
            app::emit!(Event::ModelUploaded {
                key: &key,
                model: &model
            });
        }

        self.models.insert(key, model)?;
        app::emit!(Event::PaymentProposalCreated { proposal_id });

        Ok(proposal_id)
    }

    pub fn approve_proposal(&self, proposal_id: ProposalId) -> Result<(), Error> {
        // Call the external approve function
        Self::external().approve(proposal_id);

        // Emit the payment approved event
        app::emit!(Event::PaymentApproved { proposal_id });

        Ok(())
    }
    pub fn get_proposal_messages(&self, proposal_id: ProposalId) -> Result<Vec<Message>, Error> {
        let Some(msgs) = self.messages.get(&proposal_id)? else {
            return Ok(vec![]);
        };

        let entries = msgs.entries()?;

        Ok(entries.collect())
    }

    pub fn send_proposal_messages(
        &mut self,
        proposal_id: ProposalId,
        message: Message,
    ) -> Result<(), Error> {
        let mut messages = self.messages.get(&proposal_id)?.unwrap_or_default();

        messages.push(message)?;

        self.messages.insert(proposal_id, messages)?;

        Ok(())
    }

    pub fn get(&self, key: &str) -> Result<Option<String>, Error> {
        env::log(&format!("Getting model with key: {:?}", key));
        self.models.get(key).map_err(Into::into)
    }

    pub fn entries(&self) -> Result<BTreeMap<String, String>, Error> {
        env::log("Getting all entries");
        Ok(self.models.entries()?.collect())
    }

    pub fn len(&self) -> Result<usize, Error> {
        Ok(self.models.len()?)
    }

    pub fn set_model_price(&mut self, price: u128) -> Result<(), Error> {
        self.model_price = price;
        Ok(())
    }

    pub fn get_model_price(&self) -> u128 {
        self.model_price
    }
}
