import express from 'express';
import fs from 'fs';

import { root, listSelect, container, header, form, lists } from './elements.js';

function updateView(value) {
    window.location.href = `/?name=${value}`;
}

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let name = 'Default';

app.get('/', (req, res) => {
    name = req.query.name || "Default";
    const bodyContent = container(header("Pros & Cons App") + listSelect(name) + form(name) + lists(name));
    res.send(root(bodyContent));
});

app.post('/add', (req, res) => {
    const name = req.body.name;
    const type = req.body.type;
    if (type !== 'Pros' && type !== 'Cons') {
        return res.status(400).send(`Invalid type "${type}". Must be 'Pros' or 'Cons'.`);
    }
    const item = req.body.item;
    if (item == '') {
        return res.status(400).send(`Invalid type "${item}". Must be a string.`);
    }

    fs.readFile('./lists.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return res.status(500).send("Server Error");
        }

        const jsonData = JSON.parse(data);

        if (!jsonData[name]) {
            jsonData[name] = {
                "Pros": [],
                "Cons": []
            };
        }

        jsonData[name][type].push(item);

        fs.writeFile('./lists.json', JSON.stringify(jsonData, null, 4), err => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).send("Server Error");
            }

            res.redirect(`/?name=${name}`);
        });
    });
});

app.get('/remove', (req, res) => {
    const { name, type, item } = req.query;

    fs.readFile('./lists.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return res.status(500).send("Internal Server Error");
        }

        const jsonData = JSON.parse(data);

        if (jsonData[name] && jsonData[name][type]) {
            const index = jsonData[name][type].indexOf(item);
            if (index > -1) {
                jsonData[name][type].splice(index, 1);
            } else {
                return res.status(400).send("Item not found in list.");
            }
        } else {
            return res.status(400).send("Invalid name or type provided.");
        }

        fs.writeFile('./lists.json', JSON.stringify(jsonData, null, 4), (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).send("Internal Server Error");
            }

            res.redirect(`/?name=${name}`);
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
