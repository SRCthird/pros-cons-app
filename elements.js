import fs from 'fs';
import {checkExsistance} from './utils.js';

export const root = (body) => {
    return (
        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Pros & Cons App</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            ${body}
        </body>
        <script>
            document.getElementById("redirectSelect").addEventListener("change", function() {
                window.location.href = \`/?name=\${this.value}\`;
            });
        </script>
        </html>`
    )
}

export const container = (child) => {
    return (
        `<div class="container">
            ${child}
        </div>`
    )
}

export const listSelect = (name) => {
    const jsonData = fs.readFileSync('./lists.json', 'utf-8');
    const data = JSON.parse(jsonData);

    const names = Object.keys(data);
    return (
        `<select name="name" onchange="window.location.href='/?name=' + this.value">
            <option value="${name}">${name}</option>
            ${names.map(value => {
                if (value != name) return `<option value="${value}">${value}</option>`;
            }
            ).join('')}
        </select>`
    )
}

export const form = (thisName) => {
    return (
        `<form action="/add" method="post">
            <input 
                type="name" 
                name="name" 
                required value="${thisName}" 
                style="
                    display: none;
                ">
            <input type="text" name="item" required placeholder="Add a pro or con...">
            <select name="type">
                <option value="Pros">Pro</option>
                <option value="Cons">Con</option>
            </select>
            <button type="submit">Add</button>
        </form>`
    )
}

export const header = (title) => {
    return (
        `<h1>${title}</h1>`
    )
}

export const lists = (name) => {
    checkExsistance(name);
    try {
        const jsonData = fs.readFileSync('./lists.json', 'utf-8');
        const data = JSON.parse(jsonData);
        
        const pros = data[name].Pros || [];
        const cons = data[name].Cons || [];
        return (
            `<div class="lists">
                <div class="list">
                    <h2>Pros:</h2>
                    <ul>
                        ${pros.map(pro =>
                            `<li>
                                <div class="list-item">
                                    <p>${pro}<p>
                                    <a class="remove" href="/remove?name=${name}&type=Pros&item=${pro}">x<a>
                                </div>
                            </li>`
                        ).join('')}
                    </ul>
                </div>
                <div class="list">
                    <h2>Cons:</h2>
                    <ul>
                        ${cons.map(con =>
                            `<li>
                                <div class="list-item">
                                    <p>${con}<p>
                                    <a class="remove" href="/remove?name=${name}&type=Cons&item=${con}">x<a>
                                </div>
                            </li>`
                        ).join('')}
                    </ul>
                </div>
            </div>`
        )
    } catch (err) {
        return (
        `<script>
            alert("Creating new list entry");
            location.reload();
        </script>`);
    }
}