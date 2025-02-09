const axios = require('axios');
const express = require('express');
const cors = require('cors');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const { encrypt, decrypt } = require('./encryption');
const { stdout } = require('process');


const app = express();
app.use(express.json());
app.use(cors());

function run_script() {
    exec('./Model/run.sh', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
    const script = spawn('bash', ['./Model/run.sh']);

    script.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);

    });



}

app.post('/recieveModel', async (req, res) => {
    try {
        const encryptedModel = req.body; // Get JSON from request body
        console.log("Encrypted model received:", encryptedModel);

        if (!encryptedModel || !encryptedModel.iv || !encryptedModel.encryptedData) {
            return res.status(400).send("Invalid encrypted data format");
        }

        const Model = decrypt(encryptedModel); // Decrypt the model content
        console.log("Decrypted Model:", Model);

        // Write decrypted model to model.py
        fs.writeFileSync('./Model/trial_Model.py', Model);

        run_script(); // Execute script (ensure this function exists)


        res.send("Model received and training began successfully");

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).send("Server error");
    }
});

app.get('/aggregate', async(req, res) => {
    const data = fs.readFileSync('./encryption.txt', 'utf-8');
    console.log(data);
    const match = data.match(/x:(\d+)/);
    const value = match[1];
    res.send({value,data})
})

app.listen(4001, () => {
    console.log("Server running on port 4001");
})