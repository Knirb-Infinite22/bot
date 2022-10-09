const request = require('request');
const {ethers} = require("ethers");
const brink = require("@brinkninja/sdk");
const artifact = require("./Implementation.json");

const URL ="https://backend-32sa.onrender.com/api/signedMsgs";
const PRIVATE_KEY = "0ba6a014abf9f887bd1cb9c268df16e15cba6b91cc535be4970db489c5378168";

const implementation = new ethers.Contract(artifact.address, artifact.abi);

const provider = new ethers.providers.AlchemyProvider("goerli", "aiJ9o9gmR9mwDJpsZAHtYu_0GO-Su7PL");
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

let finished = [];
async function submitOrder(implementation, { signedMessage, data }) {
    const account = brink.account(signedMessage.signer, { provider, signer: signer });
    
    const tx = await account.metaDelegateCall(signedMessage, [implementation.address, implementation.address, data.data], {gasLimit: 300000});

    await tx.wait();
}

async function TrySubmit(signedMsg) {
    console.log("Attempting New Order");

    try {
    
        await submitOrder(implementation, signedMsg);
        console.log("order completed");
        finished.push(signedMsg);
    } catch (error) {
        console.log("order processed");
        //console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
}

let isRunning = false;
const mainLoop = async function(){
    if(isRunning) return;
    isRunning = true;
    console.log("Fetching New Values From DB");
    await request(URL, async function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let elements = JSON.parse(body);
            await elements.forEach(async(element) => {
                // console.log(element)
                if(!finished.includes(element)){
                    await TrySubmit(element.signedOrderResponse)
                    isRunning = false;
                }
            });
            }else{
            console.log(error);
            }
    })
          
}

setInterval(mainLoop,100);