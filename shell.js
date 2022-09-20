#! /usr/bin/env node

//import library
const fs = require('fs');
const path = require('path')
const {spawn} = require('child_process')
const { isBinary } = require('istextorbinary')
const readline = require('readline');

//write out data
function done(output) {
    process.stdout.write(output);
    process.stdout.write('\nprompt > ');
}

// where we will store our commands
function evaluateCmd(userInput){
    // parses the user input to understand which command was typed
    var userInputArray = userInput.split(" ");

    let command = userInputArray[0]

    switch (command) {
        case "echo":
            commandLibrary.echo(userInputArray.slice(1).join(" "));
            break;
        
        case "ls":
            if (userInputArray.length == 1)
                commandLibrary.ls(process.cwd()); 
            else
                commandLibrary.ls(userInputArray.slice(1)); 
            break;
        
        case "pwd":
            commandLibrary.pwd(); 
            break;

        case "cd":
            if (userInputArray.length == 1)
                commandLibrary.pwd(); 
            else
                commandLibrary.cd(userInputArray.slice(1)); 
            break;

        case "fg":
            commandLibrary.fg(userInputArray.slice(1)); 
            break;

        case "exit":
            commandLibrary.exit(); 
            break;

        default: 
            if (userInput.includes('\\'))
                done("enter path with / instead of \\")
        
            if (userInput.includes('/')){
                let lastIndx = String(userInput).lastIndexOf('/')
                let leftp = userInput.substr(0,lastIndx)
                let rightp = userInput.substr(lastIndx).split(' ')
                
                if (fs.existsSync(leftp+rightp[0])) {

                commandLibrary.exec(leftp+rightp[0],rightp.slice(1)); 
                }else
                console.log("Not a correct path")
            }
            else if(fs.existsSync(userInputArray[0]))
                    commandLibrary.exec(userInputArray[0],userInputArray.slice(1))
            else if (command.charCodeAt() != 26)
                process.stdout.write('Typed command is not accurate');
        }
}
var flag = 1
const commandLibrary = { 
    "echo": function (userInput){
        done(userInput); 
    },
    "ls": function (fullPath){
        dirPath = String(fullPath)
        dirPath.replace(/\\/g,'/')
        fs.readdir(dirPath, (err, data) => {
            if (err) data = "No such directory found"
            formatedData = String(data).replace(/,/g,'\t')
            done(formatedData)
        })
    },
    "pwd": function (){
        currDir = String(process.cwd()).replace(/\\/g,'/')
        done(currDir)
    }, 
    "cd": function (fullPath){
        const dirPath = String(fullPath).replace(/,/g,' ');
        process.chdir(dirPath)
        done(process.cwd()); 
    }, 
    "exec": function(filePath,args){
        file = fs.readFileSync(filePath)
        args.pop()
        if(isBinary(null,file)){
            const child = spawn(filePath,args)
            // const child = spawn('ping', [ '-c', '1', 'google.com' ],{detached:true})
            // child.unref()
            // readline.emitKeypressEvents(process.stdin);
            // process.stdin.setRawMode(true);
            // process.stdin.on('keypress', (ch, key) => {
            // if (key && key.ctrl && key.name == 'z') {
            //     console.log('ctrl+z was pressed');
            //     flag = 0
            //     process.stdin.setRawMode(false);
            //     process.stdin.resume();
            // }
            // });
            // process.stdin.resume();
            // child.stdout.pipe(process.stdout)
            child.stdout.on('data',(data)=>{
                if (flag)
                // console.log('l')
                process.stdout.write(data)
                if (flag != 1)
                process.stdout.write(String(child.pid))
            })
            child.stderr.on('end',(e)=>done('some error occuered'))
        }
        else{
            done("Not a binary file")
        }

    },
    "fg": function(pid){
        flag = 1
        console.log('changed flag',flag)
    },
    "exit": function (){
        process.exit()
    }, 

};


//prompt the user for input 
process.stdout.write('prompt > ');

// the stdin 'data' event triggers after a user types in a line
process.stdin.on('data', (userInput) => {
    userInput = userInput.toString().trim();
    evaluateCmd(userInput);
}); 