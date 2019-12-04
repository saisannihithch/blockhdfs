
const WebHDFS = require("webhdfs");

var request = require("request");

let url = "http://127.0.0.1"; //change this ip address according to your environment

let port = 9870; //change the port according to your env

let dir_path = "user/"; //change this directory path according to your env

let path = "/webhdfs/v1/" + dir_path + "?op=LISTSTATUS";

let full_url = url+':'+port+path;

let offset = -5;
 
request(full_url, function(error, response, body) {
	let jsonStr = JSON.parse(body);
        let myObj = jsonStr.FileStatuses.FileStatus;
	console.log("Total Number of Files Found:", myObj.length);
	let data = myObj[5];         
        let filename = data.pathSuffix;
	let modificationtime = new Date(data.modificationTime);
        let utc1 = modificationtime.getTime() + (modificationtime.getTimezoneOffset() * 60000);
	let nd1 = new Date( utc1 + (3600000*offset));
        let modificationtime1 = nd1.toLocaleString();
        let path1 = "/webhdfs/v1/" + dir_path + filename +"?op=GETFILECHECKSUM";
        let new_url = url+':'+ port + path1;
        request(new_url, function(error, response, body) {
        let jsonStr1 = JSON.parse(body);
        let checksum = jsonStr1.FileChecksum.bytes;
	let checksum1 = checksum.slice(20, 56);
	var assetid = checksum1 + ' , ' + modificationtime1;
	console.log(assetid, filename);
        var JSONformData = {
                        "$class": "org.example.testnetwork.SampleAsset",
                        "assetId": assetid,
                        "owner": "blockhdfs",
                        "value": filename
                        
                           }
        var URL = 'http://localhost:3000/api/SampleAsset';
                  request.post({
                  url: URL,
                  json: JSONformData
                  }, function (error,response,body) {})
       });
});


