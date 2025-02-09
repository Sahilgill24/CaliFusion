#!/bin/bash

# Exit on error
set -e

# Step 1: Run the Python model script and capture the prediction
prediction=$(python3 ./Model/model.py)
echo "Prediction: $prediction"
# Step 2: Multiply the prediction by 10*3
multiplied_prediction=$(python3 -c "print(${prediction} * 100)")

echo "Multiplied Prediction: $multiplied_prediction"
# This is for generating Partial Byzantine Fault tolerance in the code 
# Call the Python script for encryption 
# Pedersen Commitments Schemes are used for encryption

python3 -c "
import os
import sys
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa

def generate_large_prime(bit_length):
    return rsa.generate_private_key(public_exponent=65537, key_size=bit_length, backend=default_backend()).private_numbers().p

class PedersonCommitment:
    def __init__(self, security=1024):
        self.p = generate_large_prime(security)
        self.q = generate_large_prime(security * 2)
        self.g = int.from_bytes(os.urandom(32), 'big') % self.q
        self.s = int.from_bytes(os.urandom(32), 'big') % self.q
        self.h = pow(self.g, self.s, self.q)

    def commit(self, x):
        r = int.from_bytes(os.urandom(32), 'big') % self.q
        c = (pow(self.g, x, self.q) * pow(self.h, r, self.q)) % self.q
        return c, r,x

    def verify(self, c, x, r):
        return c == (pow(self.g, x, self.q) * pow(self.h, r, self.q)) % self.q

    def add_commitments(self, c1, c2):
        return (c1 * c2) % self.q

# Initialize the commitment scheme
commitment = PedersonCommitment()

def encrypt_cost(cost):
    cost_int = int(cost)
    c, r ,x= commitment.commit(cost_int)
    print(f'salt: {r}')
    print(f'Encrypted cost: {c}')
    sys.stdout.flush()
    with open('encryption.txt', 'w') as f:
        f.write(f'salt: {r}\n')
        f.write(f'Encrypted cost: {c}\n')
        f.write(f'x:{x}\n')
    return c, r, x

encrypt_cost($multiplied_prediction)

"
