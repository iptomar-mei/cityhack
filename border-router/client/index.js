var request = require('request').defaults();
var fs = require("fs");

var baseURL = "https://localhost:3000/";
var headers = {
    "Content-Type": "application/json"
}

request.get({
    headers: headers,
    url: baseURL + "4",
    agentOptions: { rejectUnauthorized:false }
}, (error, res, body) => {
    console.log("error: ", error);
    console.log("result: ", body);
});
/*

var logger = fs.createWriteStream("records.txt", { flags: "a" });

function myLoop() {
    request.get({ headers: headers, url: baseURL + "1" }, (error, res, body) => {
        logger.write("https://localhost:3000/1\n");
        if (!error) logger.write(body + "\n");

        request.get({ headers: headers, url: baseURL + "2" }, (error, res, body) => {
            logger.write("https://localhost:3000/2\n");
            if (!error) logger.write(body + "\n");

            request.get({ headers: headers, url: baseURL + "3" }, (error, res, body) => {
                logger.write("https://localhost:3000/3\n");
                if (!error) logger.write(body + "\n");

                request.get({ headers: headers, url: baseURL + "4" }, (error, res, body) => {
                    logger.write("https://localhost:3000/4\n");
                    if (!error) logger.write(body + "\n");

                    request.get({ headers: headers, url: baseURL + "5" }, (error, res, body) => {
                        logger.write("https://localhost:3000/5\n");
                        if (!error) logger.write(body + "\n");

                        setTimeout(myLoop, 420000);
                    })
                })
            })
        })
    })
}

myLoop();

 */