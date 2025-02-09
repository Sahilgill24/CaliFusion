// aggregator code , will aggregate the values and return the final weights and biases
use calimero_sdk::borsh::{BorshDeserialize, BorshSerialize};
use calimero_sdk::types::Error;
use calimero_sdk::{app, env};
use std::collections::VecDeque;

#[app::state]
#[derive(Default, BorshSerialize, BorshDeserialize)]
#[borsh(crate = "calimero_sdk::borsh")]
struct WeightedAggregator {
    // Store numbers with their weights in a sequence
    numbers: VecDeque<(f64, f64)>, // (number, weight)
    // Keep running totals to avoid recalculating
    total_sum: f64,
    total_weight: f64,
}

#[app::logic]
impl WeightedAggregator {
    #[app::init]
    pub fn init() -> WeightedAggregator {
        WeightedAggregator {
            numbers: VecDeque::new(),
            total_sum: 0.0,
            total_weight: 0.0,
        }
    }

    /// Add a new number with its weight to the aggregator
    pub fn add(&mut self, number: f64, weight: f64) -> Result<(), Error> {
        env::log(&format!(
            "Adding number: {} with weight: {}",
            number, weight
        ));

        // Store the number and weight
        self.numbers.push_back((number, weight));

        // Update running totals
        self.total_sum += number * weight;
        self.total_weight += weight;

        Ok(())
    }

    /// Remove the oldest number
    pub fn remove_oldest(&mut self) -> Result<Option<(f64, f64)>, Error> {
        env::log("Removing oldest number");

        if let Some((number, weight)) = self.numbers.pop_front() {
            // Update running totals
            self.total_sum -= number * weight;
            self.total_weight -= weight;
            Ok(Some((number, weight)))
        } else {
            Ok(None)
        }
    }

    /// Get the current weighted average
    pub fn get_weighted_average(&self) -> Result<Option<f64>, Error> {
        env::log("Calculating weighted average");

        if self.total_weight == 0.0 {
            Ok(None)
        } else {
            Ok(Some(self.total_sum / self.total_weight))
        }
    }

    /// Get all numbers and their weights
    pub fn get_all(&self) -> Vec<(f64, f64)> {
        env::log("Getting all numbers and weights");
        self.numbers.iter().cloned().collect()
    }

    /// Get the total weight of all numbers
    pub fn get_total_weight(&self) -> f64 {
        self.total_weight
    }

    /// Get the number of entries
    pub fn len(&self) -> usize {
        self.numbers.len()
    }

    /// Check if the aggregator is empty
    pub fn is_empty(&self) -> bool {
        self.numbers.is_empty()
    }
}
