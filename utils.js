import fs from 'fs';

export const checkExsistance = (name) => {
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

            fs.writeFile('./lists.json', JSON.stringify(jsonData, null, 4), err => {
                if (err) {
                    console.error("Error writing file:", err);
                    return res.status(500).send("Server Error");
                }
            });
        }
    });
}