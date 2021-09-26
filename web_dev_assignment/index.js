let canvas;
let context;
let width;
let height;

let time_interval = true;
let score = 0;
let gravity = 5;
let gravity_reset = 5;
let player_speed = 5;
let speed_reset = 5;

let enemies = [];
let green_enemies = [];
let enemy_ground_h = 311;

let exclude = false;
let gem_positions = [100,140,180,220,240,280];
let gem_height = [0, 30];
let gems = [];
let fuel_array = [];
let no_of_gems = getRandomNumber(0, 10);

let fuel_object = 0;
let select_obstacle_s = 0;

let jetpack_equipped = false;
let thrust = 5;

let game_over_img = new Image();
game_over_img.src = "images/game_logo.png";

let game_over = false;
let in_hole = false;

let ground = 292;
let player = {
    x : 120,
    y : 292,
    size_x : 50,
    size_y : 50,
};

/*---moving background----*/
let mov_background_1 = {
    x : 0
};
let mov_background_2 = {
    x : 700
};
/*-----------------------*/

/*--------------moving obstacle---------------*/
let hill_size = [200,250,350];

let on_obstacle = false;
let b_hill = {
    x : (750 + getRandomNumber(250, 300)),
    y : 200,
    size_x : 350,
    size_y : 140,
};
let hill = {
    x : (700 + getRandomNumber(250, 300)),
    y : 270,
    size_x : 200,
    size_y : 70,
};
let hole = {
    x : (700 + getRandomNumber(50, 100)),
    y : 340,
    size_x : 130,
    size_y : 70,
};
/*------------------------------------------*/

/*-------keyInputs------*/
let moveJump = false;
let moveRight = false;
let moveLeft = false;
let moveFall = false;
let moveGlide = false;
let refresh = false;
/*----------------------*/
let current_health = new Image();
let heart_0 = new Image(); heart_0.src = "images/objects/heart_0.png";
let heart_red = new Image(); heart_red.src = "images/objects/health1.png";
let heart_blue = new Image(); heart_blue.src = "images/objects/health2.png";
/*-------------player images-----------------*/
let current = new Image(); current.src = "images/player/standing.png";
let standing = new Image(); standing.src = "images/player/standing.png";
let standing_left = new Image(); standing_left.src = "images/player/standing.png";
let run_1 = new Image(); run_1.src = "images/player/run_1.png";
let run_2 = new Image(); run_2.src = "images/player/run_2.png";
let run_3 = new Image(); run_3.src = "images/player/run_3.png";
let run_4 = new Image(); run_4.src = "images/player/run_4.png";
let run_5 = new Image(); run_5.src = "images/player/run_5.png";
let run_6 = new Image(); run_6.src = "images/player/run_6.png";
let run_1left = new Image(); run_1left.src = "images/player/run_1left.png";
let run_2left = new Image(); run_2left.src = "images/player/run_2left.png";
let run_3left = new Image(); run_3left.src = "images/player/run_3left.png";
let run_4left = new Image(); run_4left.src = "images/player/run_4left.png";
let run_5left = new Image(); run_5left.src = "images/player/run_5left.png";
let run_6left = new Image(); run_6left.src = "images/player/run_6left.png";
let jumping = new Image(); jumping.src = "images/player/jumping.png";
let jumping_left = new Image(); jumping_left.src = "images/player/jumping_left.png";
/*---------------------------------------------*/

/*-----------jetpack player images-------------*/
let glide1 = new Image(); glide1.src = "images/jetpack/flying1.png";
let glide2 = new Image(); glide2.src = "images/jetpack/flying2.png";
let glide3 = new Image(); glide3.src = "images/jetpack/flying3.png";
let glide_off = new Image(); glide_off.src = "images/jetpack/glide_off.png";
/*---------------------------------------------*/

/*-------------enemy images-----------------*/
let enemy_image = new Image(); enemy_image.src = "images/enemy/standing.png";
let e_standing = new Image(); e_standing.src = "images/enemy/standing.png";
let rightleg_1 = new Image(); rightleg_1.src = "images/enemy/rightleg.png";
let rightleg_2 = new Image(); rightleg_2.src = "images/enemy/rightleg2.png";
let rightleg_3 = new Image(); rightleg_3.src = "images/enemy/rightleg.png";
let leftleg_1 = new Image(); leftleg_1.src = "images/enemy/leftleg.png";
let leftleg_2 = new Image(); leftleg_2.src = "images/enemy/leftleg2.png";
let leftleg_3 = new Image(); leftleg_3.src = "images/enemy/leftleg.png";
let deadenemy = new Image(); deadenemy.src = "images/enemy/deadenemy.png";
/*--------------enemy2 images-----------------*/
let current_green = new Image(); current_green.src = "images/enemy/1.png";
let green_enemy1 = new Image(); green_enemy1.src = "images/enemy/1.png";
let green_enemy2 = new Image(); green_enemy2.src = "images/enemy/2.png";
/*---------------------------------------------*/

/* background images */
let background = new Image(); background.src = "images/mars.png";
/*----------------obstacle images--------------*/
let obstacle = new Image(); obstacle.src = "images/obstacle.png";
let upper_obs_img = new Image(); upper_obs_img.src = "images/upper_obstacle.png";
/*---------------------------------------------*/
/*-------- collectible object image... -------*/
let green = new Image(); green.src = "images/objects/gem.png";
let blue = new Image(); blue.src = "images/objects/blue.png";
let red = new Image(); red.src = "images/objects/red.png";
let fuel = new Image(); fuel.src = "images/objects/fuel.png";
let gem_array = [green, blue, red];
/*-----------------------------*/

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;

    window.addEventListener('keydown', activate,false);
    window.addEventListener('keydown', glide_activate, false);
    window.addEventListener('keyup', glide_deactivate, false);
    window.addEventListener('keydown', restart, false);
    window.addEventListener('keyup', restart_deact, false);


    window.setInterval(draw, 28);
    window.setInterval(player_animations, 60);
    window.setInterval(enemy_animation, 80);
    window.setInterval(green_enemy_anim, 120);
}
function draw() {
    context.clearRect(0, 0, width, height);
    context.drawImage(background, mov_background_1.x, 0, width +20, height); context.drawImage(background, mov_background_2.x, 0, width +20, height);

    context.drawImage(upper_obs_img, b_hill.x, b_hill.y, b_hill.size_x, b_hill.size_y);
    context.drawImage(upper_obs_img, hill.x, hill.y, hill.size_x, hill.size_y);
    context.drawImage(obstacle, hole.x, hole.y, hole.size_x, hole.size_y);

    enemy_generator(); enemy_movement();
    backgr_movement();
    ground_obstacle(); upper_obstacles(); obstacle_movement();

    object_array();
    health_anim();
    score_tracker();


    context.drawImage(current, player.x, player.y, player.size_x, player.size_y);
    context.drawImage(current_health, 25, 25, 25, 21.34);
    if (game_over) {
        context.drawImage(game_over_img, 50, 50, 300, 200);
        if (refresh) {
            window.location.reload(true);
        }
    }
    else {
        if (jetpack_equipped) {
            jetpack();
        }else {
            keyMovement();
            player_speed = speed_reset;
        }
    }
}


function backgr_movement() {
    player_running(mov_background_1);
    player_running(mov_background_2);
    if (mov_background_1.x + width <= 0) {
        mov_background_1.x = width;
        select_obstacle_s = getRandomNumber(0, 3);
        fuel_object = getRandomNumber(0, 5);
    }
    else if (mov_background_2.x + width <= 0) {
        mov_background_2.x = width;
        select_obstacle_s = getRandomNumber(0, 5);
    }

}
function obstacle_movement() {
    if ((player.x + player.size_x) >= (width / 2)) {
        b_hill.x -= player_speed;
        hill.x -= player_speed;
        hole.x -= player_speed;
        if (hill.x + hill.size_x <= 0) {
            if (select_obstacle_s <= 2) {
                hill.x = width;
                hill.size_x = getRandomPosition(hill_size);
            }
        }
        if (b_hill.x + b_hill.size_x <= 0) {
            if (select_obstacle_s <= 1) {
                b_hill.x = width;
                b_hill.size_x = getRandomPosition(hill_size);
            }
        }
        if (hole.x + hole.size_x <= 0) {
            hole.x = width;
        }
    }
}
function upper_obstacles() {
    let feet = player.y + player.size_y;
    for (let enemy of enemies) {
        if (hill.y < feet && feet <= enemy.y + 5 && Ax_in_Bx(player, enemy) && enemy.y <= enemy_ground_h) {
            ground = enemy.y - player.size_y;
            if (enemy.y - 5 <= feet && feet <= enemy.y + 5) {
                gravity = 12;
                moveJump = true;
                enemy.stop = true;
            }
        } else if (b_hill.x <= player.x + player.size_x - 20 && player.x + 20 <= b_hill.x + b_hill.size_x && feet <= b_hill.y) {
            ground = b_hill.y - player.size_y;
            on_obstacle = true;
            in_hole = false;
        } else if (hill.x <= player.x + player.size_x - 20 && player.x + 20 <= hill.x + hill.size_x && b_hill.y < feet && feet <= hill.y) {
            ground = hill.y - player.size_y;
            on_obstacle = true;
            in_hole = false;
        } else {
            ground = 292;
            on_obstacle = false;
        }
    }
}
function ground_obstacle() {
    if (hole.x < player.x + 5 && player.x + player.size_x -5 < hole.x + hole.size_x  && on_obstacle === false) {
        /* if player inside obstacles x domain and on ground level then treat as falling^ */
        in_hole = true;
        moveFall = true;
    } else if (player.y <= ground){
        in_hole = false;
    } if (player.y > 400) {
        game_over = true;
        stop();
    }
}

function set_timer_2s() {
    time_interval = true;
    let border = document.querySelector('canvas');
    border.style.border = 'solid royalblue .5em';
}
function change_css() {
    let border = document.querySelector('canvas');
    border.style.border = 'solid red .5em';
}

function enemy_generator() {
    if (enemies.length <= 2) {
        let enemy = {
                    x : 700 + getRandomPosition([50, 150, 200, 250]),
                    y : enemy_ground_h,
                    size_x : 30,
                    size_y : 30,
                    gravity : 5,
                    stop : false
        };enemies.push(enemy);
    }if (green_enemies.length <= 2) {
        let enemy = {
                    x : width + getRandomPosition([50, 150, 200, 250]),
                    y : 300 - getRandomPosition([100, 150, 200,250]),
                    size_x : 25,
                    size_y : 30
        };green_enemies.push(enemy);
    }
}
function enemy_animation() {
    if (enemy_image === e_standing) {
        enemy_image = rightleg_1;
    }else if (enemy_image === rightleg_1){
        enemy_image = rightleg_2;
    }else if (enemy_image === rightleg_2) {
        enemy_image = rightleg_3;
    }else if (enemy_image === rightleg_3) {
        enemy_image = leftleg_1;
    }else if (enemy_image === leftleg_1) {
        enemy_image = leftleg_2;
    }else if (enemy_image === leftleg_2) {
        enemy_image = leftleg_3;
    }else {
        enemy_image = e_standing;
    }
}
function green_enemy_anim() {
    if (current_green === green_enemy1) {
        current_green = green_enemy2;
    }else {
        current_green = green_enemy1;
    }
}
function enemy_movement() {
    for (let enemy of enemies) {
        player_running(enemy);
        if (enemy.stop) {
            context.drawImage(deadenemy, enemy.x, enemy.y, enemy.size_x, enemy.size_y);
            let z = 0;
            for (z; z < 12; z += 1) {
                enemy.y -= 1;
            }
            enemy.y = enemy.y + enemy.gravity;
            enemy.gravity += 1;
            if (400 < enemy.y) {
                enemy.x = 700 + getRandomPosition([50, 150, 200, 250]);
                enemy.y = enemy_ground_h;
                enemy.stop = false;
                score += 500;
                enemy.gravity = 5;
            }
        }
        else {
            context.drawImage(enemy_image, enemy.x, enemy.y, enemy.size_x, enemy.size_y);
            if (player.y + player.size_y > enemy.y && enemy.stop === false) {
            player_collision(enemy);
            }
            if (enemy.x + enemy.size_x < 0) {
                let position_list = [50, 150, 250];
                enemy.x = 700 + getRandomPosition(position_list);
                enemy.y = enemy_ground_h;
                enemy.stop = false;
            }
            if ((hole.x < enemy.x && enemy.x +enemy.size_x < hole.x + hole.size_x || enemy.y > enemy_ground_h) && enemy.stop === false) {
                enemy.y = enemy.y + enemy.gravity;
                enemy.gravity += 1;
                enemy.x -= 1;
            }
            else if (enemy.stop === false) {
                enemy.x -= 2;
                enemy.gravity = 5;
            }
        }
    }
    for (let enemy of green_enemies) {
        context.drawImage(current_green, enemy.x, enemy.y, enemy.size_x, enemy.size_y);
        player_running(enemy);
        player_collision(enemy);
        if (enemy.x + enemy.size_x < 0) {
            let position_list = [50, 150, 250];
            enemy.x = 700 + getRandomPosition(position_list);
            enemy.y = 300 - getRandomPosition([140, 190, 240,290]);
        }
        else {
            enemy.x -= 3;
        }
    }
}
function health_anim() {
    if (jetpack_equipped) {
        current_health = heart_blue;
    }else if (game_over) {
        current_health = heart_0;
    }else {
        current_health = heart_red;
    }
}

function player_running(o) {
    if (player.x === (width / 2) - player.size_x) {
        o.x -= player_speed;
    }
}

function player_animations() {
    if (moveRight && moveJump && jetpack_equipped === false) {
        current = jumping;
    } else if (moveLeft && moveJump && jetpack_equipped === false) {
        current = jumping_left;
    }
    else if (moveGlide === false && jetpack_equipped && player.y < ground) {
        current = glide_off;
    }
    else if (moveGlide) {
        if (current === glide1) {
            current = glide2;
        }else if (current === glide2) {
            current = glide3;
        }else {
            current = glide1;
        }
    }
    else if (moveRight) {
        if (current === standing) {
            current = run_1;
        }else if (current === run_1) {
            current = run_2;
        }else if (current === run_2) {
            current = run_3;
        }else if (current === run_3) {
            current = run_4;
        }else if (current === run_4) {
            current = run_5;
        }else if (current === run_5) {
            current = run_6;
        }else {
            current = run_1;
        }
    }
    else if (moveLeft && jetpack_equipped === false) {
        if (current === standing) {
            current = run_1left;
        }else if (current === run_1left) {
            current = run_2left;
        }else if (current === run_2left) {
            current = run_3left;
        }else if (current === run_3left) {
            current = run_4left;
        }else if (current === run_4left) {
            current = run_5left;
        }else if (current === run_5left) {
            current = run_6left;
        }else{
            current = run_1left;
        }
    }
}
function keyMovement() {
    if (moveRight) {
        player.x += player_speed;
        if (game_over === true) {
          player_speed = 0;
        }else if ((player.x + player.size_x) >= (width / 2)) {
            score += player_speed;
            player.x = (width / 2) - player.size_x;
        }
    }
    if (moveLeft) {
        if (player.x <= 0) {
            player.x = 0;
            current = standing;
            moveLeft = false;
        } else {
            player.x -= player_speed;
        }
    }
    if (moveJump) {
        let i = 0;
        for (i; i < 12; i += 1) {
            player.y -= 1.5;
        }
        moveFall = true;
    }
    if (moveFall) {
        player.y = player.y + gravity;
        gravity += 1;
        if (ground <= player.y && in_hole === false) {
            gravity = gravity_reset;
            player.y = ground;
            moveJump = false;
            // completes the jump & checks if in hole
        }
    }
}
function jetpack() {
    if (jetpack_equipped) {
        player.x += player_speed;
        moveRight = true;
        moveJump = false;
        moveLeft = false;
        moveFall = false;
        if ((player.x + player.size_x) >= (width / 2)) {
            player.x = (width / 2) - player.size_x;
            score += player_speed;
        }
        if (player.y <= 5) {
            player.y = 5;
        }
        if (moveGlide) {
            player.y = player.y - thrust;
            thrust += .01;
            gravity = gravity_reset;
            if (game_over === false) {
                player_speed = 8;
            }
            else {
                player_speed = 0;
            }
        }if (moveGlide === false && ground <= player.y && in_hole === false){
            gravity = gravity_reset;
            player_speed = speed_reset;
            player_speed = 5;
        }else if (moveGlide === false) {
            if (player.y < ground) {
                let i = 0;
                for (i; i < 12; i += 1) {
                    player.y -= .8;
                }
            }
            player.y = player.y + gravity;
            gravity += 1;
            thrust = 5;
            if (ground <= player.y && in_hole === false) {
                gravity = gravity_reset;
                player.y = ground;
                player_speed = speed_reset;
            }
        }
    }
}

function object_array() {
    let a_color = getRandomNumber(0,2);
    if (gems.length <= no_of_gems) {
        let g = {
            x : 700 + getRandomPosition(gem_positions),
            y : 305,
            size_x : 24.3,
            size_y : 21.6,
            color : gem_array[a_color]
        };
        gems.push(g);
    }
    if (fuel_object < 1 && fuel_array.length < 1) {
        let f = {
            x : 700 + getRandomPosition([330]),
            y : 304,
            size_x : 23,
            size_y : 30,
            color : fuel
        };fuel_array.push(f);
    }
    object_stuff(gems);
    object_stuff(fuel_array);
}
function object_stuff(object_list) {
    for (let g of object_list) {
        player_running(g);
        if (g.color === fuel) {
            if (touch(g)) {
                if (jetpack_equipped === true && exclude === false) {
                    score += 5000;
                    exclude = true;
                }
                fuel_object += 1;
                jetpack_equipped = true;
            }
            else if (fuel_object < 1) {
                g.x = 700 + getRandomPosition([360]);
                g.y = 305;
                exclude = false;
            }
            else if (exclude === false){
                context.drawImage(g.color, g.x, g.y, g.size_x, g.size_y);
            }
        } else {
            context.drawImage(g.color, g.x, g.y, g.size_x, g.size_y);
            if (touch(g)) {
                g.x = 700 + getRandomPosition(gem_positions);
                g.y = 305;
                score += 250;
            }
        }
        if (off_canvas(g) && g.color !== fuel) {
            g.x = 700 + getRandomPosition(gem_positions);
            g.y = 305 - getRandomPosition(gem_height);
            no_of_gems = getRandomNumber(0, 6);
            if (player.y < 300 && jetpack_equipped) {
                g.y = 300 - getRandomPosition([100, 150, 200, 250])
            } else if (Ax_in_Bx(b_hill, g)) {
                g.y = b_hill.y - g.size_y - 10;
            } else if (Ax_in_Bx(hill, g)) {
                g.y = hill.y - g.size_y - 10;
            } else if (Ax_in_Bx(hole, g)) {
                g.y = ground - 30;
            } else {
                g.y = 305;
            }
        }
    }
}

function activate(event) {
    let keyCode = event.keyCode;
    if (keyCode === 39){
        moveRight = true;
        moveLeft = false;
    }
    if (keyCode === 37) {
        moveLeft = true;
        moveRight = false;
    }
    if (keyCode === 13) {
        moveJump = true;
    }
}
function glide_activate(event) {
    let keyCode = event.keyCode;
    if (keyCode === 13 && jetpack_equipped) {
        moveGlide = true;
    }
}
function glide_deactivate() {
    let keyCode = event.keyCode;
    if (keyCode === 13 && jetpack_equipped) {
        moveGlide = false;
    }
}
function restart(event) {
    let keyCode = event.keyCode;
    if (keyCode === 82) {
        refresh = true;
    }
}
function restart_deact(event) {
    let keyCode = event.keyCode;
    if (keyCode === 82) {
        refresh = false;
    }
}

function off_canvas(object) {
    if (object.x + object.size_x <= 0) {
        return true;
    }else{
        return false;
    }
}
function player_collision(enemy) {
    if (touch(enemy) && jetpack_equipped) {
            jetpack_equipped = false;
            moveGlide = false;
            moveFall = true;
            time_interval = false;
            change_css();
            window.setInterval(set_timer_2s, 1000);
        }else if (touch(enemy) && time_interval) {
            game_over = true;
            stop();
        }
}
function touch(object) {
    if (player.x + player.size_x -10 < object.x ||
        player.y + player.size_y < object.y +5 ||
        player.x > object.x + object.size_x -10 ||
        player.y > object.y + object.size_y) {
            return false;
    }
    else{
        return true;
    }
}

function Ax_in_Bx(objectA, objectB) {
    if (objectA.x + objectA.size_x -5 < objectB.x || objectA.x +5 > objectB.x + objectB.size_x) {
        return false;
    }else {
        return true;
    }
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomPosition(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function score_tracker() {
    if (moveRight && game_over === false) {
        let displayed_score = document.querySelector('#score');
        displayed_score.value = score;
    }
}
let request;
let done = false;
function stop() {
    player_speed = 0;
    jetpack_equipped = false;
    window.removeEventListener('keydown', glide_activate, false);
    window.removeEventListener('keydown', activate, false);
    moveRight = false;
    moveLeft = false;
    let username = document.querySelector('#username');
    username = username.value;
    if (done === false) {
        let url = 'usrcheck_leaderboard.py?score='+ score+'&username='+ username;
        request = new XMLHttpRequest();
        request.addEventListener('readystatechange', handle_response, false);
        request.open('GET', url, true);
        request.send(null);
        done = true;
    }
}
function handle_response() {
    if (request.readyState === 4) {
        if (request.status === 200) {
            if (request.responseText.trim() === 'success' ) {
                let username = document.querySelector('#username');
                username = username.value;
                let table = document.createElement('table');
                let row = table.insertRow(0);
                let th1 = document.createElement('TH'); let u = document.createTextNode("USERNAME")
                let th2 = document.createElement('TH'); let s = document.createTextNode("SCORE")

                th1.appendChild(u);
                th2.appendChild(s);
                row.appendChild(th1);
                row.appendChild(th2);

                row = table.insertRow(1);
                let p_name = row.insertCell(0); p_name.innerHTML = username;
                let p_score = row.insertCell(1); p_score.innerHTML = score;

                body = document.querySelector('body');
                body.insertBefore(table, body.childNodes[5]);
                // I used w3schools.com's examples for this.^
            }else{
                //
            }
        }
    }
}
