import sys
import subprocess as sp

macros = {}

def interpret(code):
    macroname = [""]
    lines = code.split("\n")
    in_macro = [False]

    for line in lines:
        tokens = line.split() or line.split("\t")

        if tokens:
            token = tokens[0]

            if not in_macro[0]:
                if token == "EXECMD":
                    cmd = " ".join(tokens[1:])
                    sp.run(cmd, shell=True)
                elif token == "@Macro":
                    in_macro[0] = True
                    macroname[0] = tokens[1]
                    macros[macroname[0]] = []
                elif token == "" or token == "$":
                    pass
            elif in_macro[0]:
                if token == "@End":
                    in_macro[0] = False
                else:
                    macros[macroname[0]].append(" ".join(tokens))

if __name__ == "__main__":
    if len(sys.argv) == 1:
        try:
            with open("icamake", "r") as f:
                interpret(f.read())
        except FileExistsError:
            try:
                with open("Icamake", "r") as f:
                    interpret(f.read())
            except FileExistsError:
                print("File 'icamake' or 'Icamake' not exists!")
    else:
        try:
            with open("icamake", "r") as f:
                interpret(f.read())
        except FileExistsError:
            try:
                with open("Icamake", "r") as f:
                    interpret(f.read())
            except FileExistsError:
                print("File 'icamake' or 'Icamake' not exists!")
        
        for macro, code in macros.items():
            if sys.argv[1] == macro:
                interpret("\n".join(code))
