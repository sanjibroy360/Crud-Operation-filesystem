const http = require('http');
const fs = require('fs');
const url = require('url');
var PORT = process.env.PORT || 3000;

var server = http.createServer(handleRequest);

function handleRequest(req, res) {
    var store = "";
    var parsedUrl = url.parse(req.url, true);
    var path = __dirname + '/users/'; 

    req.on('data', (chunk) => {
        store += chunk;
    });

    req.on('end', () => {
        
        if(parsedUrl.pathname === '/users' && req.method === 'POST') {
            
            var username = JSON.parse(store).username;
            path += username + '.json';
            
            // Create

            fs.open(path, 'wx', (err, fd) => {
                if(err) {
                    res.end('Username is not avilable!');
                    return;
                } else {
                    fs.writeFile(fd, store, (err) => {
                        if(err) {
                            res.end('Error Occured!');
                            return;
                        } else {
                            fs.close(fd, (err) => {
                                if(err) {
                                    res.end('Error Occured!');
                                    return;
                                } else {
                                    res.end('Account Created!')
                                }
                            })
                        }
                    })
                }
            })

            
        } else if(parsedUrl.pathname === '/users' && req.method === 'GET') {
            
            // Read

            var username = JSON.parse(store).username;
            path += username + '.json';

            fs.open(path, 'r', (err, fd) => {
                if(err) {
                    res.end('User Not Found!');
                    return;
                } else {
                    fs.readFile(fd, (err, data) => {
                        if(err) {
                            res.end('Error Occured!')
                            return;
                        } else {
                            data = JSON.parse(data);
                            res.end(`<b>Username: </b> ${data.username} <br> <b>Name: </b> ${data.name} <br> <b>Email: </b> ${data.email}`);
                        }
                    })
                }
            })
        }

        else if(parsedUrl.pathname === '/users' && req.method === 'PUT') {

            // Update
            
            console.log(parsedUrl);
            var username = JSON.parse(store).username;
            path += username + '.json';
            
            fs.open(path, 'r+', (err, fd) => {
                if(err) {
                    res.end('User Not Found!');
                } else {
                    fs.ftruncate(fd, (err) => {
                        if(err) {
                            res.end('Error Occured!');
                        } else {
                            fs.writeFile(fd, store, (err) => {
                                if(err) {
                                    res.end('Error Occured!')
                                } else {
                                    res.end('Account Details Updated!');
                                }
                            })
                        }
                    })
                }
            })

        }

        else if(parsedUrl.pathname === '/users' && req.method === "DELETE") {
            
            // Delete

            var username = JSON.parse(store).username;
            path += username + '.json';

            fs.unlink(path, (err) => {
                if(err) {
                    res.end('Error Occured!');
                    console.log(err);
                    return;
                } else {
                    res.end('Account Deleted!')
                }
            })
        } else {
            res.statusCode = 404;
            res.end('404, Page Not Found!');
        }

    })
}

server.listen(PORT, console.log(`Server is running on port ${PORT}`))