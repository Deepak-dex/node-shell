// function delay(n) {  
//     n = n || 2000;
//     return new Promise(done => {
//       setTimeout(() => {
//         done();
//       }, n);
//     });
// }

// const process = async ()=>{
//     console.log('start process')
//     for(let i=0;i<11;i++){
//         await delay(3000)
//         console.log('running process',i)
//     }
// }

// process()

// console.log('from app')
process.stdout.write('from app process')