var cards = new Array(52);
var START_DATE;
var STOP_AUTOPLAY = 0;
var HUMAN_WINS_AGAIN;
var HUMAN_GOES_ALL_IN;
var RUN_EM = 0;
var NUM_ROUNDS = 0, total_pot = 0, SMALL_BLIND, BIG_BLIND, STARTING_BALANCE = 500;
var players, speed = 1, BG_COLOR="006600",BG_HIGHLIGHT="EFEF30";
var board,current_bet,dealer,deck_index,button_index,current_min_raise;
var current_player_index, current_bet_amount;
var players_still_in;

function player(name, balance, carda, cardb, status, total_bet, sub_bet){
    this.name = name;
    this.balance = balance;
    this.carda = carda;
    this.cardb = cardb;
    this.status = status;
    this.total_bet = total_bet;
    this.sub_bet = sub_bet;
}

//access the storage object of the document's origin, webpage origin. stored data is saved across sessions
//vs sessionStorage gets cleared when session ends
//modernizr's approach: https://stackoverflow.com/questions/16427636/check-if-localstorage-is-available
function check_local_storage(){
    try {
        var test = 'test';
        window.localStorage.setItem(test,test);
        window.localStorage.removeItem(test);
        return true;
    } catch (error) {
        return false;
    }

}

function init(){
    if (!check_local_storage()){
        alert("Browser does not support localStorage");
        return ;
    }
    //preload_card();
    //write_settings();
    deck();
    new_game();
    //valign tag? not supported in HTML5 -> <td style = "vertical-align:bottom">
    //write_frame("board", "<html> <body bgcolor = " +BG_COLOR + "text = FFFFFF> <table height = 100%> <tr> <td valign = center> <tt> <b> Hello! </b> ... <small> <i> Date </i></small></tt></td></tr></table></body></html>")
}

//CARD SYMBOL GIFS
var preload_sd = new Image(), preload_ss = new Image(), preload_sh = new Image(), preload_sc = new Image(), preload_cb = new Image();
function preload_card(){
    preload_sd.src = "#";
    preload_ss.src = "#";
    preload_sc.src = "#";
    preload_sh.src = "#";
    preload_cb.src = "#";
}

//Ace = 15
//every 4 cards are the same. e.g. cards[0] -> cards[3] = 2 of heart,diamond,club,spade, respectively
function deck(){
    var i,j = 0;
    for (i = 2; i < 15; i++){
        cards[j++] = "h" + i;
        cards[j++] = "d" + i;
        cards[j++] = "c" + i;
        cards[j++] = "s" + i;
    }
}

function new_game(){
    var bot_players = [
        new player("Tony Stark", 0, "", "", "", 0, 0),
        new player("Elon Musk", 0, "", "", "", 0, 0),
        new player("George Clooney", 0, "", "", "", 0, 0),
        new player("Kevin Hart", 0, "", "", "", 0, 0)
    ]
    bot_players.sort(compRan);
    players = new Array(bot_players.length+1);

    //ask for variable with id playername
    var player_name = get_local_storage("playername");
    //default value
    if (!playername){
        player_name = "You"
    }
    //first player - aka YOU
    players[0] = new player(player_name, 0, "", "", "", 0, 0);

    for (var i = 1; i < players.length; i++){
        players[i] = bot_players[i-1];    
    }
    reset_cards(bot_players.count);
    reset_status(0);
    reset_bets();
    for (var i = 0; i < players.length; i++){
        players[i].balance = STARTING_BALANCE;    
    }
    button_index = Math.floor(Math.random() * players.length);
    new_round();

}

function new_round(){
    RUN_EM = 0;
    NUM_ROUNDSS++;

    reset_bets();
    reset_pot();
    collect_cards();
    //set_stake()
    current_min_raise = 0;
    dealer = get_next_player_position(dealer, 1);
    set_blinds_and_deal();
}

function set_blinds_and_deal(){
    //default stake
    set_stake(5);
    var small_blind_player = get_next_player_position(dealer, 1);
    bet(small_blind_player, SMALL_BLIND);

    var big_blind_player = get_next_player_position(small_blind, 1);
    bet(big_blind_player, BIG_BLIND);
    button_index = get_next_player_position(big_blind_player, 1);
    deal_first_card();
}

function deal_first_card(){
    var pause_time = 0;
    for (var i = 0; i < players.length; i++){
        var j = get_next_player_position(dealer,i+1);
        if(players[j].carda)
            break;
        players[j].carda = cards[deck_index++];
        setTimeout("write_player(" + j + ",0 ,0, 1)", pause_time*speed);
        pause_time += 500;
    }
    setTimeout("deal_and_write_b()", pause_time*speed);
    

}

function deal_second_card(){
    var pause_time = 0;
    for (var i = 0; i < players.length; i++){
        var j = get_next_player_position(dealer, i+1);
        if (players[j].cardb) 
            break;
        players[j].cardb = cards[deck_index++];
        setTimeout("write_player("+ j + "0,0,1)", pause_time * speed);
        pause_time += 500;
    }
    setTimeout("main()", pause_time * speed);
}

function set_stake(bet_value){
    SMALL_BLIND = bet_value;
    BIG_BLIND = 2*bet_value;
}

//MISSING PRECONDITION CHECK -> BET VALUE MUST BE > 0. PLAYER ID MUST BE IN THE RANGE OF PLAYERS
function bet(player_id, bet_value){
    if (players[player_id].status == "FOLDED"){} // FOLDED
    else if (bet_value >= players[player_id].balance){ // ALL IN
        bet_value = players[player_id].balance;
        
        var temp_current_bet = current_bet;

        if(players[player_id].sub_bet + bet_value > current_bet)
            current_bet = players[player_id].sub_bet + bet_value;
        
        var new_current_min_raise = current_bet - temp_current_bet;
        if (new_current_min_raise > current_min_raise)
            current_min_raise = new_current_min_raise;
        players[player_id].status = "CALL";
    } else if (bet_value + players[player_id].sub_bet == current_bet){ // CALL
        players[player_id].status = "CALL";
    } else if (current_bet > players[player_id].sub_bet + bet_value){
        if(player_id == 0)
            alert("Bet is too low. Current bet is " + current_bet);
            return 0;
            //RAISE TOO SMALL
    } else if (bet_amount + players[player_id].sub_bet > current_bet && get_pot_size() > 0 && bet_amount + players[player_id].sub_bet - current_bet < current_min_raise){
        if (player_id == 0)
            alert("Minimum raise is " + current_min_raise);
        return 0;
    } else { //RAISE
        players[player_id].status = "CALL";
        var temp_current_bet =current_bet;
        current_bet = players[player_id].sub_bet + bet_amount;

        if (get_pot_size() > 0){
            current_min_raise = current_bet - temp_current_bet;
            if (current_min_raise < BIG_BLIND) 
                current_min_raise = BIG_BLIND;
        }
    }  
   players[player_id].sub_bet += bet_amount;
   players[player_id].balance -= bet_amount;
   return 1; 
}

function main(){

}

function reset_board(){
    board = new Array(5);
    for (var i = 0; i < players.length; i++){
        players[i].carda = "";
        players[i].cardb = "";
    }
}

function reset_status(type){
    for (var i = 0; i < players.length; i++){
        //reset all
        if (type == 0){
            players[i].status = "";
        //reset everyone but BUSTED players - for new round
        } else if (type == 1 && players[i].status != "BUSTED"){
            players[i].status = "";
        //reset everyone but FOLDED and BUSTED -> for new card
        } else if (type == 2 && players[i].status != "FOLDED" && players[i].status != "BUSTED"){
            players[i].status = "";
        }
    }
}

function reset_bets(){
    for (var i = 0; i < players.length; i++){
        players[i].sub_bet = 0;
        current_bet = 0;
    }
}

function reset_pot(){
    for (var i = 0; i < players.length; i++){
        players[i].total_bet = 0;
    }
    total_pot = 0;
}

function collect_cards(){
    board = new Array(5);
    for (var i = 0; i < players.length; i++){
        players[i].carda = "";
        players[i].cardb = "";
    }
    deck_index = 0;
    cards.sort(compRan);
}

function compRan(){
    return Math.abs(0.5 - Math.random());
}

function get_pot_size() {
    var result = 0;
    for (var i = 0; i < players.length; i++){
        result += players[i].total_bet + players[i].sub_bet; 
    }
    return result;
}
function players_still_in(){
    players_still_in = 0;
    for (var i = 0; i < players.length; i++){
        if (has_money(i))
            players_still_in ++;
    }
}
function has_money(player_id){
    if (players[player_id].balance > 0)
        return true;
    return false;
}

function get_next_player_position(i, step){
    var j = 0, temp = 1;
    if (step < 0) 
        temp = -1;
    while (1){
        i += temp;
        if (i >= players.length) 
            i = 0;
        else if (i < 0)
            i = players.length - 1;
        if (++j >= step){
            break;
        }
    }
    return i;
}

function get_local_storage(key){
    return localStorage.getItem(key);
}

function set_local_storage(key, value){
    return localStorage.setItem(key, value);
}

function reset_cards(count){

}

//returns the content of key
function get_cookie(key){
    var ck = document.cookie;
    //returns the position of key variable
    var a = ck.indexOf(key + "=");
    if (a < 0) 
        return "";
    a += key.length + 1;
    //find position of the end of the key variable
    //indexOf(search value, start position)
    var b = ck.indexOf(";",a);
    if (b <= a) 
        return ck.substring (a);

    return ck.substring(a,b);
}

function write_frame(frame_id, html, n){
    try {
        frames[frame_id].document.open("text/html", "replace");
        frames[frame_id].document.write(html);
        frames[frame_id].document.close();
        //check browser information
        var u = navigator.userAgent;
        //check type of browser
        //if (u.indexOf("Opera") < 0 && u.indexOf("Safari") < 0 && u.indexOf("MSIE") < 0)
        if (u.indexOf("MSIE") != -1)
            frames[frame_id].location.reload();
    } catch (error) {
        if (!n)
            n = 0;
        if (n < 9)
            write_frame(frame_id,html,++n);
    }
}

//table = declare table in html
//td = cell
//tr = row
function write_basic_general(){
    write_frame("general", "<html><body topmargin = 2 bottommargin = 0 bgcolor=" + BG_COLOR +"><table><tr><td>" + get_pot_size_html() + "</td></tr></table></body></html>");
}

//write pot size
function get_pot_size_html(){
    return "<font color = 00EE00 size=+4> <b> Current pot: " +get_pot_size() + "</b></font>";
}
//need a better look
function write_settings(){
    var speeds = ['2', '1', '.6', '.3', '0'];
    var select_speed = ['', '', '', '',''];
    var speed_i = get_cookie("gamespeed");
    if (speed_i == "") speed_i = 1;
    if (speed_i == null || speed_i != 0 || speed_i != 1 || speed_i != 2 || speed_i != 3 || speed_i != 4)
        speed_1 = 1;
    select_speed[speed_i] = "selected";
    set_speed(speeds[speed_i], speed_i);
    var speed_options = "";
    for (var i = 0; i < speeds.length; i++){
        speed_options += "<option value = '" + speeds[i] + "'" + select_speed[i] + ">" + (i + 1);
        
    }
    //vlink tag? specifies the color of visited link
    //mostly use in head tag in HTML5 <style> a:visited {color: #FF0000} </style>
    write_frame("settings", "<html><body topmargin = 7 bottommargin = 0 vlink=0000FF bgcolor =" + BG_COLOR +"><pre><center><b><font size =+2> Options </font> </b> \n\n <a href='javascript: parent.change_name()'> Your name </a> \n\n <form> Speed <select onchange = 'parent.set_speed(options[selectedIndex].value, selectedIndex);'>" + speed_options + "</select> </form> <a target= _blank href= http://rawdataserver.com/poker/help.html> HELP </a> </center> </pre> </body> </html>");
}

//prompt() -> show up a prompt
function change_name(){
    var name = prompt("Enter your username", get_cookie("playername"));
    if (!name) 
        return;
    players[0].name = name;
    write_player(0,0,0,0);
    set_cookie("playername", name);
}

function set_speed(s, i){
    speed = s;
    set_cookie("gamespeed",i);
}

function set_cookie(key, value){
    if (get_cookie(key) == value)
        return;
    //p -> convert to a number of miliseconds 
    var d = new Date();
    var p = Date.parse(d);
    //setTime and toUTCString -> straight forward -> setTime and convert to a string in the form of UTC standard
    d.setTime(p + 365*24*60*60*1000);
    var u = d.toUTCString();
    //document.cookie = -> add on to the cookie of the document
    //expires set expiration date -> as long as it hasn't expired -> don't need to set new
    document.cookie = key + "=" + val + ";expires =" + u
}

function write_player(n, highlight, show_cards, mode){
    var carda = "", cardb = "";
    var base_background = BG_COLOR;
    if (highlight == 1)
        base_background = BG_HIGHLIGHT;
    else if(highlight == 2)
        base_background = "FF0000";
    if(players[n].status == "FOLDED")
        base_background = "999999";

    var background = " background = #"
    var background_a = "";
    var background_b = "";
    var background_color_a = base_background;
    var background_color_b = base_background;
    
    //if player has carda
    if (players[n].carda){
        background_a = background;
        if (n == 0 || show_cards || players[n].status != "FOLD"){
            background_a = "";
            background_color_a = "FFFFFF";
            carda = get_card_html(players[n].carda);
        }
    }

    //if players have card b
    if (players[n].cardb){
        background_b = background;
        if (n == 0 || show_cards || players[n].status != "FOLD"){
            background_b = "";
            background_color_b = "FFFFFF";
            cardb = get_card_html(players[n].cardb);
        }
    }

    var action = "";
    if (n == button_index)
        action = "<font color = FFFFFF> @ </font>";
    var bet_text = "";
    var all_in = "bet:";
    if (!has_money(n))
        all_in = "<font color = FF0000> ALL IN: </font>";
    //print bet/call amount
    if (mode != 1 || players[n].sub_bet > 0 || players[n].status == "CALL")
        bet_text = "<b> <font size=+2>" + all_in + "<font color = 00EE00>" + players[n].sub_bet + "</font> </font> </b>";
    else if (!has_money(n) && players[n].status != "FOLDED" && players[n].status != "BUSTED")
        bet_text = "<b> <font size=+2 color = FF0000> ALL IN </font></b>";
    //IF FOLDED
    if (players[n].status == "FOLDED")
        bet_text = "<b> <font size=+2> FOLDED </font></b>";
    else if(players[n].status == "BUSTED")
        bet_text = "<b> <font size =+2 color = FF0000> BUSTED </font> </b>";

    
}