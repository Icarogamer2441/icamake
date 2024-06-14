const fs = require('fs');
const { exec } = require('child_process');

let macros = {};

function interpret(code) {
    let macroname = [""];
    let lines = code.split("\n");
    let in_macro = [false];

    lines.forEach(line => {
        let tokens = line.split(/\s+/) || line.split("\t");

        if (tokens.length > 0) {
            let token = tokens[0];

            if (!in_macro[0]) {
                if (token === "EXECMD") {
                    let cmd = tokens.slice(1).join(" ");
                    exec(cmd, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                        console.error(`stderr: ${stderr}`);
                    });
                } else if (token === "@Macro") {
                    in_macro[0] = true;
                    macroname[0] = tokens[1];
                    macros[macroname[0]] = [];
                } else if (token === "" || token === "$") {
                    // Do nothing
                }
            } else if (in_macro[0]) {
                if (token === "@End") {
                    in_macro[0] = false;
                } else {
                    macros[macroname[0]].push(tokens.join(" "));
                }
            }
        }
    });
}

if (process.argv.length === 2) {
    try {
        let code = fs.readFileSync('icamake', 'utf8');
        interpret(code);
    } catch (err) {
        if (err.code === 'ENOENT') {
            try {
                let code = fs.readFileSync('Icamake', 'utf8');
                interpret(code);
            } catch (err2) {
                if (err2.code === 'ENOENT') {
                    console.log("File 'icamake' or 'Icamake' not exists!");
                }
            }
        }
    }
} else {
    try {
        let code = fs.readFileSync('icamake', 'utf8');
        interpret(code);
    } catch (err) {
        if (err.code === 'ENOENT') {
            try {
                let code = fs.readFileSync('Icamake', 'utf8');
                interpret(code);
            } catch (err2) {
                if (err2.code === 'ENOENT') {
                    console.log("File 'icamake' or 'Icamake' not exists!");
                }
            }
        }
    }

    let macro = process.argv[2];
    if (macros[macro]) {
        interpret(macros[macro].join("\n"));
    }
}
