// IPC通信を行う
const ipcRenderer = require('electron').ipcRenderer;

function set_step2() {

    var param = document.getElementById('zipcode').value;
    var request_hash = { request_type: 'need_http_request', params: param };

    // 非同期
    ipcRenderer.send('request_message', request_hash);
};

ipcRenderer.on('response_message', (event, arg) => {
    var json_data = JSON.parse(arg);

    var results = json_data.results;
    console.log(json_data.results);

    for (var i = 0; i < results.length; i++){
        var div = document.createElement('div');
        console.log(results[i]);
        div.textContent = results[i].address1;
        document.getElementById('step2').appendChild(div);
        var div = document.createElement('div');
        div.textContent = results[i].address2;
        document.getElementById('step3').appendChild(div);
        var div = document.createElement('div');
        div.textContent = results[i].address3;
        document.getElementById('step4').appendChild(div);
    }
});