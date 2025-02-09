use calimero_sdk::borsh::{BorshDeserialize, BorshSerialize};
use calimero_sdk::types::Error;
use calimero_sdk::{app, env};
use num_bigint::{BigUint, RandBigInt};
use num_traits::One;
use rand::Rng;

#[app::state]
#[derive(BorshSerialize, BorshDeserialize)]
#[borsh(crate = "calimero_sdk::borsh")]
struct PedersonCommitment {
    p: BigUint, // Large prime
    q: BigUint, // Another large prime
    g: BigUint, // Generator
    h: BigUint, // Second generator
    s: BigUint, // Secret value
}

#[derive(BorshSerialize, BorshDeserialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct CommitmentOutput {
    commitment: BigUint,
    random: BigUint,
    value: BigUint,
}

#[app::logic]
impl PedersonCommitment {
    #[app::init]
    pub fn init(security_bits: u32) -> Self {
        let mut rng = rand::thread_rng();

        // Generate large primes
        let p = rng.gen_prime(security_bits);
        let q = rng.gen_prime(security_bits * 2);

        // Generate random values for g and s
        let g = rng.gen_biguint_below(&q);
        let s = rng.gen_biguint_below(&q);

        // Calculate h = g^s mod q
        let h = g.modpow(&s, &q);

        PedersonCommitment { p, q, g, h, s }
    }

    pub fn commit(&self, value: &BigUint) -> Result<CommitmentOutput, Error> {
        let mut rng = rand::thread_rng();

        // Generate random value r
        let random = rng.gen_biguint_below(&self.q);

        // Calculate commitment: c = g^x * h^r mod q
        let g_x = self.g.modpow(value, &self.q);
        let h_r = self.h.modpow(&random, &self.q);
        let commitment = (g_x * h_r) % &self.q;

        env::log(&format!(
            "Created commitment for value with random: {:?}",
            random
        ));

        Ok(CommitmentOutput {
            commitment,
            random,
            value: value.clone(),
        })
    }

    pub fn verify(&self, output: &CommitmentOutput) -> Result<bool, Error> {
        let g_x = self.g.modpow(&output.value, &self.q);
        let h_r = self.h.modpow(&output.random, &self.q);
        let expected = (g_x * h_r) % &self.q;

        env::log(&format!(
            "Verifying commitment. Expected: {:?}, Got: {:?}",
            expected, output.commitment
        ));

        Ok(expected == output.commitment)
    }

    pub fn add_commitments(
        &self,
        c1: &CommitmentOutput,
        c2: &CommitmentOutput,
    ) -> Result<CommitmentOutput, Error> {
        // Add the commitments: c3 = c1 * c2 mod q
        let new_commitment = (&c1.commitment * &c2.commitment) % &self.q;

        // Add the random values: r3 = r1 + r2 mod q
        let new_random = (&c1.random + &c2.random) % &self.q;

        // Add the values: x3 = x1 + x2
        let new_value = &c1.value + &c2.value;

        env::log("Added two commitments together");

        Ok(CommitmentOutput {
            commitment: new_commitment,
            random: new_random,
            value: new_value,
        })
    }

    pub fn get_parameters(&self) -> Result<(BigUint, BigUint, BigUint, BigUint), Error> {
        Ok((
            self.p.clone(),
            self.q.clone(),
            self.g.clone(),
            self.h.clone(),
        ))
    }
}

// Helper trait for generating prime numbers
trait GenPrime {
    fn gen_prime(&mut self, bits: u32) -> BigUint;
}

impl GenPrime for rand::rngs::ThreadRng {
    fn gen_prime(&mut self, bits: u32) -> BigUint {
        loop {
            let mut num = self.gen_biguint(bits);
            // Ensure the number is odd
            if num.is_even() {
                num |= BigUint::one();
            }

            // Simple primality test (for demonstration - in production use a more robust test)
            if is_probable_prime(&num) {
                return num;
            }
        }
    }
}

// Simple primality test (Miller-Rabin should be used in production)
fn is_probable_prime(n: &BigUint) -> bool {
    if n <= &BigUint::one() {
        return false;
    }

    let two = BigUint::from(2u32);
    if n == &two {
        return true;
    }

    if n.is_even() {
        return false;
    }

    // Simple divisibility test up to 100
    for i in 2..100 {
        if n % i == BigUint::zero() {
            return false;
        }
    }

    true
}
