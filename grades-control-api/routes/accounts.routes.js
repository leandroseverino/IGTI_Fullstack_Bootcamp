const express = require("express");
const router = express.Router();

const fs = require("fs");

function saveFile(filecontent) {
    fs.writeFile(global.filename, JSON.stringify(filecontent), err => {
        if (err) {
            logger.error(global.errorMessageOnWriteFile, err);
        } else {
            logger.info("File Saved with Success !");
        }
    });
}

router.post("/", (req, res) => {
    let account = req.body;

    fs.readFile(global.filename, "utf8", (err, data) => {
        if (!err) {
            try {
                let json = JSON.parse(data);
                account = { id: json.nextId++, ...account };
                json.accounts.push(account);
                saveFile(json);
                logger.info(`POST /account - ${JSON.stringify(account)}`);                
                res.send(json);
            } catch (err) {
                logger.error(`POST /account - ${err.message}`);
                res.status(400).send({ error: err.message });
            }
        } else {
            res.status(400).send({ error: err.message });
        }
    });
});

router.get("/", (_, res) => {
    fs.readFile(global.filename, "utf8", (err, data) => {
        if (!err) {
            try {
                let json = JSON.parse(data);
                delete json.nextId;
                //let itens = json.accounts.map(account => account);
                logger.info('GET /account');
                res.send(json);
            } catch (err) {
                logger.error(`GET /account - ${err.message}`);
                res.status(500).send({ error: err.message });
            }
        } else {
            res.status(500).send({ error: err.message });
        }
    });
});

router.get("/:id", (req, res) => {
    let id = parseInt(req.params.id);
    fs.readFile(global.filename, "utf8", (err, data) => {
        try {
            if (err) throw err;
            let json = JSON.parse(data);
            let item = json.accounts.find(account => account.id === id);
            if (item) {
                res.send(item);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            res.status(500).send({ error: err.message });
        }
    });
});

router.delete("/:id", (req, res) => {
    let id = parseInt(req.params.id);
    fs.readFile(global.filename, "utf8", (err, data) => {
        try {
            if (err) throw err;
            let json = JSON.parse(data);
            let itens = json.accounts.filter(account => account.id !== id);
            if (itens) {
                json.accounts = itens;
                saveFile(json);
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            res.status(500).send({ error: err.message });
        }
    });
});

router.put("/", (req, res) => {
    let account = req.body;
    fs.readFile(global.filename, "utf8", (err, data) => {
        try {
            if (err) throw err;
            let json = JSON.parse(data);
            let oldIndex = json.accounts.findIndex(item => item.id === account.id);
            if (oldIndex > -1) {
                json.accounts[oldIndex] = account;
                saveFile(json);
                res.send(json);
            } else {
                res.sendStatus(404);
            }
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    });
})

router.post("/transaction", (req, res) => {
    let account = req.body;
    fs.readFile(global.filename, "utf8", (err, data) => {
        try {
            if (err) throw err;
            let json = JSON.parse(data);
            let index = json.accounts.findIndex(item => item.id === account.id);
            if (index > -1) {

                if ((account.value < 0) && ((json.accounts[index].balance + account.value) < 0)) {
                    throw new Error("Não há saldo suficiente para este valor de saque !");
                }

                json.accounts[index].balance += account.value;
                saveFile(json);
                res.send(json.accounts[index]);
            } else {
                res.sendStatus(404);
            }
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    });
})


// export default router;

module.exports = router;