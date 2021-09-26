let username;
let checker;
let request;

document.addEventListener("DOMContentLoaded", init, false);
function init() {
    username = document.querySelector('#username');
    checker = document.querySelector('#checker');
    username.addEventListener('keyup', check_name, false);
}
function check_name() {
    let url = 'usrcheck_leaderboard.py?username='+username.value;
    request = new XMLHttpRequest();
    request.addEventListener('readystatechange', handle_response, false);
    request.open('GET', url, true);
    request.send(null);
}
function handle_response() {
    if (request.readyState === 4) {
        if (request.status === 200) {
            submit = document.querySelector('#submit');
            if (request.responseText.trim() === 'available') {
                checker.innerHTML = 'Name available';
                submit.disabled = false;
            }else if (request.responseText.trim() === 'in_use') {
                checker.innerHTML = 'Name not available';
                submit.disabled = true;
            }
        }
    }
}
