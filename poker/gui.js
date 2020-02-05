//indicate that the code should be executed in "strict mode".
//for example, use undeclared variables.
"use strict";

//reduce the number of code repetition by creating methods to access divs, a general 
//visibility method


function internal_get_class(curr, searched_name){
    if (!curr){
        gui_log_to_history("internal_naming_class, no curr for" + searched_name);
    }
    var nodes = null;
    for (var i = 0; i < curr.childNodes.length; i++){
        if (curr.childNodes[i].className === searched_name){
            nodes = curr.childNodes[i];
            break;
        }
    }
    return nodes;
}

function internal_get_actual_ranks(rank){
    var result = 'UnknownRank';
    if (rank === 14) {
        result = 'ace';
    } else if (rank === 13) {
        result = 'king';
    } else if (rank === 12) {
        result = 'queen';
    } else if (rank === 11) {
        result = 'jack';
    } else if (rank > 0 && rank < 11) {
        // Normal card 1 - 10
        result = rank;
    } else {
        //return type of rank
        console.log(typeof rank);
        alert('Unknown rank ' + rank);
    }
    return result;
}

function internal_get_actual_suits(suit){
    var result = 'UnknownSuit'
    if (suit === 'c'){
        result = 'clubs'
    } else if (suit === 'd'){
        result = 'diamond';
    } else if (suit === 'h'){
        result = 'heart';
    } else if (suit === 's'){
        result = 'spade';
    } else {
        console.log(typeof suit);
        alert('Unknown suit' + suit);
    }
    return result;
}

function internal_get_card_url(card){
    var suit = card.substring(0,1);
    var rank = parseInt(card.substring(1));
    suit = internal_get_actual_suits(suit);
    rank = internal_get_actual_ranks(rank);

    return "url('static/images/" + rank + "_of_" + suit + ".png')";
}

function internal_set_background(diva,image){
    var komage = diva.style;
    komage['background-image'] = image;
}

function internal_set_card(diva, card){
    //card "" -> don't show
    //card "blinded" -> show back
    //card "s14" -> show ace of spades
    var image;
    if (typeof card === 'undefined'){
        alert('undefined card' + card);
        image = "url('static/images/outline.gif')";
    } else if (card === ""){
        image = "url('static/images/outline.gif')";
    } else if (card === "blinded"){
        image = "url('static/images/cardback.png')";
    } else {
        image = internal_get_card_url(card);
    }
    internal_set_background(diva, image);
}

//call function on click
//innerHTML property -> the HTML property of an attribute
//in this case -> we're changing the innerHTML of a button
function internal_clickin_helper(button, button_text, function_on_click){
    if (button_text === 0){
        button.stile.visibility = 'hidden';
    } else {
        button.style.visibility = 'visible';
        button.innerHTML = button_text;
        button.onclick = function_on_click;
    }
}

function internal_show_le_button(buttons, button_name,button_func){
    var le_button = buttons.children[button_name];
    le_button.style.visibility = 'visible';
    le_button.onclick = button_func;
}

function internal_hide_le_button(buttons, button_name){
    var le_button = buttons.children[button_name];
    le_button.style.visibility = 'hidden';
}

//GUI TIME
function gui_hide_poker_table(){
    var table = document.getElementById('poker_table');
    table.style.visibility = 'hidden';
}

function gui_show_poker_table(){
    var table = document.getElementById('poker_table');
    table.style.visibility = 'visible';
}

//.children returns children elements
function gui_set_player_name(name,seat){
    var table = document.getElementById('poker_table');
    //current seat
    var current = 'seat' + seat;
    var seatloc = table.children[current];
    //find seat
    var chipsdiv = internal_get_class(seatloc, 'name-chips');
    //find the name
    var namediv = internal_get_class(chipsdiv, 'player-name');
    if (name === ""){
        seatloc.style.visibility = 'hidden';
    } else {
        seatloc.style.visibility = 'visible';
    }
    // -> set players name here. textContent is the, well, textContent of the HTML div
    namediv.textContent = name;
}

function gui_highlight_player (highlight_color, name_color, seat){
    var table = document.getElementById('poker_table');
    var current = 'seat' + seat;
    var seatloc = table.children[current];
    //find seat
    var chipsdiv = internal_get_class(seatloc, 'name-chips');
    //find the name
    var namediv = internal_get_class(chipsdiv, 'player-name');

    //name colour for highlights
    if (name_color === ""){
        //no change
        namediv.style.color = chipsdiv.style.color;
    } else {
        namediv.style.color = name_color;
    }

    //background colour for highlights
    if (highlight_color === ""){
        namediv.style.backgroundColor = chipsdiv.style.backgroundColor;
    } else {
        namediv.style.backgroundColor = highlight_color;
    }
}

function gui_set_balance(amount, seat){
    var table = document.getElementById('poker_table');
    var current = 'seat' + seat;
    varseatloc = table.children[current];
    //find seat
    var chipsdiv = internal_get_class(seatloc, 'name-chips');
    //find the name
    var namediv = internal_get_class(chipsdiv, 'chips');
    if (!isNaN(amount) && amount != ""){
        amount = "$" + amount;
    }
    namediv.textContent = amount;
}

function gui_set_bet(bet, seat){
    var table = document.getElementById('poker_table');
    var current = 'seat' + seat;
    var seatloc = table.children[current];
    var betdiv = internal_get_class(seatloc, 'bet');
    betdiv.textContent = bet;
}

function gui_set_player_cards(card_a,card_b,seat){
    var table = document.getElementById('poker_table');
    var current = 'seat' + seat;
    var seatloc = table.children[current];
    var cardsdiv = internal_get_class(seatloc,'holecards');
    var card1 = internal_get_class(cardsdiv, 'card holecard1');
    var card2 = internal_get_class(cardsdiv, 'card holecard2');

    internal_set_card(card1, card_a);
    internal_set_card(card2, card_b);
}

//set board cards
function gui_lay_board_card (n, card){
    var current = '';
    if (n === 0){
        current = 'flop1';
    } else if (n === 1){
        current = 'flop2';
    } else if (n === 2){
        current = 'flop3';
    } else if (n === 3){
        current = 'turn';
    } else if (n === 4){
        current = 'river';
    }

    var table = document.getElementById('poker_table');
    var board = table.children.board;
    var cardsdiv = board.children[current];
    internal_set_card(cardsdiv, card);
}

function gui_burn_card(n, card){
    var current = '';
    if (n === 0){
        current = 'burn1';
    } else if (n === 1){
        current = 'burn2';
    } else if (n === 2){
        current = 'burn3';
    }

    var table = document.getElementById('poker_table');
    var board = table.children.board;
    var cardsdiv = board.children[current];
    internal_set_card(cardsdiv, card);
}

function gui_write_pot_size (amount){
    var table = document.getElementById('poker_table');
    var pot_div = table.children.pot;
    var total_div = pot_div.children['total-pot'];
    var the_pot = 'Total pot: ' + pot_size;
    total_div.innerHTML = the_pot;
}

function gui_write_pot_text (text) {
    var table = document.getElementById('poker_table');
    var pot_div = table.children.pot;
    var total_div = pot_div.children['total-pot'];
    total_div.style.visibility = 'visible';
    total_div.innerHTML = text;
}

var log_text = [];
var log_index = 0;

function gui_log_to_history(text){
    //--i -> subtract first
    for (var i = log_index = 0; i > 0; i--){
        log_text[i] = log_text[i-1];
    }
    log_text[0] = text;
    if (log_index < 40){
        log_index = log_index + 1;
    }
    //b tag bolds the first letter
    var output_text = '<br><b>' + log_text[0] + '</b>'
    for (var i = 1; i < log_index; i++){
        output_text += '<br>' + log_text[i];
    }

    var history = document.getElementById('history');
    history.innerHTML = text_to_output;
}

function gui_hide_log_window () {
    var history = document.getElementById('history');
    history.style.visibility = 'hidden';
    //history.style.display = 'none';
}

function gui_place_dealer_button(seat){
    var table_seat = seat;
    var button = document.getElementById('button');
    if (seat < 0) {
        button.style.visibility = 'hidden';
    } else {
        button.style.visibility = 'visible';
    }
    button.className = 'seat' + table_seat + '-button';
}

function gui_hide_fold_call_raise_click () {
    var buttons = document.getElementById('action-options');
    var fold = buttons.children['fold-button'];
    internal_clickin_helper(fold, 0, 0);
  
    var call = buttons.children['call-button'];
    internal_clickin_helper(call, 0, 0);
  
    var raise = buttons.children['raise-button'];
    internal_clickin_helper(raise, 0, 0);
  
    gui_disable_shortcut_keys();
}



function gui_setup_fold_call_raise_click(show_fold, call_text, raise_text, fold_func,call_func,raise_func){
    var buttons = document.getElementById('action-options');
    var fold = buttons.children['fold-button'];
    internal_clickin_helper(fold, show_fold, fold_func);
  
    var call = buttons.children['call-button'];
    internal_clickin_helper(call, call_text, call_func);
  
    var raise = buttons.children['raise-button'];
    internal_clickin_helper(raise, raise_text, raise_func);
}

function carry_in_speedfunction(speed_func){
    var call_back = speed_func;
    var return_function = function(){
        var buttons = document.getElementById('setup-options');
        var speed = buttons.children['speed-button'];
        var selector = speed.children['speed-selector'];
        var options = selector.children['speed-options'];
        var index = options.value;
        var value = options[index].text;
        call_back(value);
    }
    return return_function;
}

function gui_set_selected_speed_option (index) {
    var buttons = document.getElementById('setup-options');
    var speed = buttons.children['speed-button'];
    var selector = speed.children['speed-selector'];
    var qqq = selector.children['speed-options'];
    qqq.value = index;
}

function gui_setup_option_buttons(name_func, speed_func, help_func, check_func, mode_func){
    var buttons = document.getElementById('setup-options');
    var speed = buttons.children['speed-button'];
    speed.style.visibility = 'visible';
    speed.onchange = curry_in_speedfunction(speed_func);
    internal_le_button(buttons, 'name-button', name_func);
    internal_le_button(buttons, 'mode-button', mode_func);
    internal_le_button(buttons, 'help-button', help_func);
    internal_le_button(buttons, 'check-button', check_func);
}

function gui_hide_setup_option_buttons () {
    var buttons = document.getElementById('setup-options');
    internal_hide_le_button(buttons, 'name-button');
    internal_hide_le_button(buttons, 'speed-button');
    internal_hide_le_button(buttons, 'mode-button');
    internal_hide_le_button(buttons, 'help-button');
    internal_hide_le_button(buttons, 'check-button');
}

function gui_show_game_response () {
    var response = document.getElementById('game-response');
    response.style.visibility = 'visible';
}

function gui_hide_game_response () {
    var response = document.getElementById('game-response');
    response.style.visibility = 'hidden';
}
  
function gui_write_game_response (text) {
    var response = document.getElementById('game-response');
    response.innerHTML = text;
}

function gui_write_quick_raise (text) {
    var response = document.getElementById('quick-raises');
    response.style.visibility = 'visible';
    response.innerHTML = text;
    
}

function gui_hide_quick_raise(){
    var response = document.getElementById('quick-raises');
    response.style.visibility = 'hidden';
}


//set textile
function gui_write_modal_box (text) {
    var modal = document.getElementById('modal-box');
    if (text === "") {
        modal.style.display = "none";
    } else {
        modal.innerHTML = text;
        modal.style.display = "block";
        modal.style.opacity = "0.90";
    }
}

function gui_initialize_css () {
    // Set all the backgrounds
    var image;
    var item;
    item = document.getElementById('poker_table');
    image = "url('static/images/poker_table.png')";
    internal_set_background(item, image);
}

function gui_enable_shortcut_keys (func) {
    document.addEventListener('keydown', func);
}

function gui_disable_shortcut_keys (func) {
    document.removeEventListener('keydown', func);
}

function internal_get_theme_mode () {
    var mode = getLocalStorage("currentmode");
    if (mode === null) {  // first time
        mode = "light";
    }
    return mode;
}

function inernal_set_theme_mode(mode){
    var mode = setLocalStorage("currentmode", mode);
}

function internal_get_into_the_mode (mode) {
    var buttons = document.getElementById('setup-options');
    var mode_button = buttons.children['mode-button'];
  
    var color;
    var button_text;
    if (mode == "dark") {
        color = 'DimGray';
        button_text = 'Light mode';
    } else if (mode == "Christmas") {
        color = 'Red';
        button_text = 'Light mode';
    } else {
        color = 'White';
        button_text = 'Dark mode';
    }
    document.body.style.backgroundColor = color;
    mode_button.innerHTML = button_text;
}

function gui_initialize_theme_mode () {
    var mode = internal_get_theme_mode();
    internal_get_into_the_mode(mode);
    internal_set_theme_mode(mode);
}

function gui_toggle_the_theme_mode () {
    var mode = internal_get_theme_mode();
    if (mode == "dark") {
        mode = "light";
    } else if (mode == "Christmas") {
        mode = "light";
    } else {
        mode = "dark";
    }
    internal_get_into_the_mode(mode);
    internal_set_theme_mode(mode);
}

function gui_get_theme_mode_highlight_color () {
    var mode = internal_get_theme_mode();
    var color = "red";
    if (mode == "dark") {
        color = "yellow";
    }
    return color;
}