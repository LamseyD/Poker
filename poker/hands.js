var tests = ["straigh_flush", "quad", "full_house", "flush", "straigh", "set", "two_pairs", "one_pair", "hi_card"];

function get_winners(players){
    var winner;
    for (var i = 0; i < tests.length; i++){
        winner = winners_helper(my_players,tests[i]);
        if (winner){
            break;
        }
    }
    return winner;
}

function winners_helper(players,test){
    var best;
    var winners = new Array(players.length);
    for (var i = 0; i < players.length; i++){
        //busted or folded
        if (!players[i]){
            continue;
        }
        var temp = execute_test("test_" + test, players[i]);
        var num_needed = a["num_needed"];
        //source code uses (num_needed > 0 || (num_needed == 0 && num_needed != "0"))
        if (num_needed > 0){
            continue;
        }
        //=== -> strict equality -> same type same value
        //== -> lose equality

        //first hand tested
        if (typeof best === 'undefined'){
            best = temp;
            winners = new Array(my_players.length); //remake winners array? intentional?
            winners[i] = best;
        //compare with other hands
        } else {
            var comp = execute_compare("compare_" + test, temp, best);
            if (comp == "a"){
                best = temp;
                winners = new Array(my_players.length);
                winners[i] = best;
            } else if (comp == "b") {
            } else if (comp == "c") {
                winners[i] = temp;
            }
        }
    }
    for (var i = 0; i < winners.length; i++){
        if (winners[i]){
            return winners;
        }
    }
    return null;
}

function execute_test(string, player){
    if (string === 'test_straight_flush') {
        return test_straight_flush(player);
      }
      if (string === 'test_quad') {
        return test_quad(player);
      }
      if (string === 'test_full_house') {
        return test_full_house(player);
      }
      if (string === 'test_flush') {
        return test_flush(player);
      }
      if (string === 'test_straight') {
        return test_straight(player);
      }
      if (string === 'test_set') {
        return test_set(player);
      }
      if (string === 'test_two_pair') {
        return test_two_pair(player);
      }
      if (string === 'test_one_pair') {
        return test_one_pair(player);
      }
      if (string === 'test_hi_card') {
        return test_hi_card(player);
      }
      alert("execute_test() cannot tokenize " + string);
}

function execute_compare(string, hand_1, hand_2){
    if (string === 'compare_straight_flush') {
        return compare_straight_flush(hand_1, hand_2);
      }
      if (string === 'compare_quad') {
        return compare_quad(hand_1, hand_2);
      }
      if (string === 'compare_full_house') {
        return compare_full_house(hand_1, hand_2);
      }
      if (string === 'compare_flush') {
        return compare_flush(hand_1, hand_2);
      }
      if (string === 'compare_straight') {
        return compare_straight(hand_1, hand_2);
      }
      if (string === 'compare_set') {
        return compare_set(hand_1, hand_2);
      }
      if (string === 'compare_two_pair') {
        return compare_two_pair(hand_1, hand_2);
      }
      if (string === 'compare_one_pair') {
        return compare_one_pair(hand_1, hand_2);
      }
      if (string === 'compare_hi_card') {
        return compare_hi_card(hand_1, hand_2);
      }
      alert("execute_compare() cannot tokenize " + string);
}

function test_flush(player){
    var my_cards = group_cards(player);
    var best_suit = get_predominant_suit(my_cards);
    var working_cards = new Array(7);
    var working_index = 0;
    var num_in_flush = 0;
    for (var i = 0; i < my_cards.length; i++){
        //count the number of cards with the suit as the most dominant suit
        if (get_suit(my_cards[i]) == best_suit){
            num_in_flush++;
            //since poker only counts the top 5 cards on the table -> get rank of all the cards with same suit
            working_cards[working_index++] = get_rank(my_cards[i]);
        }
    }

    //"" means empty, null means not set
    //so since the size of working_cards is 7, if it's not set, the value is set to 7
    for (var i = 0; i < working_cards.length ; i++){
        if (working_cards[i] == null){
            working_cards[i] = -1;
        }
    }
    /*This is because I don't want the function to be called right then and there but rather 
    I want the sort method to have a reference to this compare function so that it can call 
    it as needed while it's trying to sort the array. */

    // -> passing reference to compNum to sort so sort can use it when it's needed
    working_cards.sort(compNum);
    var hash_result = {};
    var num_mine = 0;
    for (var i = 0; i < 5; i++){
        var s = working_cards[i];
        if (!s)
            s = "";
        //accessing ["flush_i"] of the hash_result
        hash_result["flush_" + i] = s;
        if (best_suit + working_cards[i] == player.carda || best_suit + working_cards[i] == player.cardb)
            num_mine++;
    }
    //set hash_result["num_needed"]
    //the strings in the [] are categories. e.g num_needed for the hash_result is 5 - num_in_flush
    hash_result["num_needed"] = 5 - num_in_flush;
    hash_result["num_mine"] = num_mine;
    hash_result["suit"] = best_suit;
    hash_result["hand_name"] = "Flush";

    return hash_result;
}

function test_quad(player){
    var my_cards = group_cards(player);
    var ranks = new Array(13);
    for (var i = 0; i < 13; i++) {
      ranks[i] = 0;
    }
    //get the number of cards with the same ranks
    //checking if there's a quad
    for (var i = 0; i < my_cards.length; i++) {
      ranks[get_rank(my_cards[i]) - 2]++;
    }

    //hashing result. why?
    //since if you have four of a kind, don't need to care about the kicker?
    var four = "";
    var kicker = "";
    for (var i = 0; i < 13; i++) {
      if (ranks[i] == 4) {
        four = i + 2;
      } else if (ranks[i] > 0) {
        kicker = i + 2;
      }
    }

    //num_mine is which card you have, or do you have the card or nah
    var num_mine = 0;
    if (get_rank(player.carda) == four) {
      num_mine++;
    }
    if (get_rank(player.cardb) == four) {
      num_mine++;
    }
    var num_needed = 4;
    //if there's a quad, -> no more needed cards
    if (four) {
      num_needed = 0;
    }
    
    //find hashed rank, kicker, num_needed and number of cards you have
    var hash_result = {};
    hash_result["rank"] = four;
    hash_result["kicker"] = kicker;
    hash_result["num_needed"] = num_needed;
    hash_result["num_mine"] = num_mine;
    hash_result["hand_name"] = "Four of a Kind";
  
    return hash_result;
}

function test_hi_card(player){
    var my_cards = group_cards(player);
    var working_cards = new Array(my_cards.length);
    for (var i = 0; i < working_cards.length; i++) {
      working_cards[i] = get_rank(my_cards[i]);
    }

    //not needed
    for (var i = 0; i < working_cards.length; i++) {
      if (working_cards[i] == null) {
        working_cards[i] = -1; // FF
      }
    }

    working_cards.sort(compNum);
    var hash_result = {};
    for (var i = 0; i < 5; i++) {
        //not needed?
      if (!working_cards[i]) {
        working_cards[i] = "";
      }
      hash_result["hi_card_" + i] = working_cards[i];
    }
    hash_result["num_needed"] = 0;
    hash_result["hand_name"] = "High Card";
  
    return hash_result;
}

function test_one_pair(player){
    var my_cards = group_cards(player);
    var ranks = new Array(13);
    for (i = 0; i < 13; i++) {
        ranks[i] = 0;
    }
    for (i = 0; i < my_cards.length; i++) {
        ranks[get_rank(my_cards[i]) - 2]++;
    }
    var pair = 0;
    var kicker_1 = "";
    var kicker_2 = "";
    var kicker_3 = "";
    //+2 to restore the rank of the card
    for (i = 0; i < 13; i++) {
        if (ranks[i] == 2) {
            pair = i + 2;
        } else if (ranks[i] == 1) {
            kicker_3 = kicker_2;
            kicker_2 = kicker_1;
            kicker_1 = i + 2;
        } else if (ranks[i] > 2) {
            kicker_1 = i + 2;
            kicker_2 = i + 2;
            kicker_3 = i + 2;
        }
    }
    var num_mine = 0;
    if (get_rank(player.carda) == pair) 
        num_mine++;
    if (get_rank(player.cardb) == pair) 
        num_mine++;
    var num_needed = 1;
    //pair is already set so maybe not needed?
    if (pair) 
        num_needed = 0;

    //return hash_result
    var hash_result = {};
    hash_result["rank"] = pair;
    hash_result["num_needed"] = num_needed;
    hash_result["num_mine"] = num_mine;
    hash_result["kicker_1"] = kicker_1;
    hash_result["kicker_2"] = kicker_2;
    hash_result["kicker_3"] = kicker_3;
    hash_result["hand_name"] = "One Pair";

    return hash_result;
}

function test_full_house(player){
    var my_cards = group_cards(player);
    var ranks = new Array(13);
    //rank all the cards out of 12 -> 12 = ace
    for (var i = 0; i < 13; i++) {
      ranks[i] = 0;
    }
    //-2 because the deck is from 2 -> 14
    for (var i = 0; i < my_cards.length; i++) {
      ranks[get_rank(my_cards[i]) - 2]++;
    }
    var three = "";
    var two = "";
    
    for (var i = 0; i < 13; i++) {
      if (ranks[i] == 3) {
        //? hashing the ranks of the cards?
        //let's say 3 sixes and 3 fives -> this if statement selects the hand to be 3 sixes
        //and 2 fives instead of 3 fives and 2 sixes
        if (three > two) {
          two = three;
        }
        three = i + 2;
      } else if (ranks[i] == 2) {
        two = i + 2;
      }
    }

    //if there's a set among all the cards, find number of cards you have in order to make that set
    //num_mine_major -> number of cards you have to make the major rank
    var num_needed = 5;
    var major_rank = "";
    var num_mine_major = 0;
    if (three) {
      num_needed -= 3;
      major_rank = three;
      if (get_rank(player.carda) == three) num_mine_major += 1;
      if (get_rank(player.cardb) == three) num_mine_major += 1;
    }
    var hash_result = {};
    hash_result["major_rank"] = major_rank;
    hash_result["num_mine_major"] = num_mine_major;
    //if the pair also exist then that means do the same thing as major for minor
    var minor_rank = "";
    var num_mine_minor = 0;
    if (two) {
      num_needed -= 2;
      minor_rank = two;
      if (get_rank(player.carda) == two) num_mine_minor += 1;
      if (get_rank(player.cardb) == two) num_mine_minor += 1;
    }
    //store hashed result
    hash_result["minor_rank"] = minor_rank;
    hash_result["num_mine_minor"] = num_mine_minor;
    hash_result["num_mine"] = num_mine_minor + num_mine_major;
    hash_result["num_needed"] = num_needed;
    hash_result["hand_name"] = "Full House";
  
    return hash_result;
}

function test_set(player){
    var my_cards = group_cards(player);
    var ranks = new Array(13);
    for (var i = 0; i < 13; i++) {
        ranks[i] = 0;
    }
    for (var i = 0; i < my_cards.length; i++) {
        ranks[get_rank(my_cards[i]) - 2]++;
    }
    var three = "";
    //find kickers
    var kicker_1 = "";
    var kicker_2 = "";
    for (var i = 0; i < 13; i++) {
        if (ranks[i] == 3) {
            three = i + 2;
        } else if (ranks[i] == 1) {
            kicker_2 = kicker_1;
            kicker_1 = i + 2;
        } else if (ranks[i] > 1) {
            kicker_1 = i + 2;
            kicker_2 = i + 2;
        }
    }
    var num_mine = 0;
    if (get_rank(player.carda) == three) {
        num_mine++;
    }
    if (get_rank(player.cardb) == three) {
        num_mine++;
    }
    var num_needed = 3;
    if (three) {
        num_needed = 0;
    }
    var hash_result = {};
    hash_result["rank"] = three;
    hash_result["num_needed"] = num_needed;
    hash_result["num_mine"] = num_mine;
    hash_result["kicker_1"] = kicker_1;
    hash_result["kicker_2"] = kicker_2;
    hash_result["hand_name"] = "Three of a Kind";

    return hash_result;
}

function test_straight(player){
    var my_cards = group_cards(player);
    //array(8) to avoid arrayIndexOutOfBound
    var working_cards = new Array(8);
    var ranks = new Array(13);
    for (var i = 0; i < 7; i++) {
        var my_rank = get_rank(my_cards[i]);
        if (ranks[my_rank - 2]){ 
            continue;
        } else {
            ranks[my_rank - 2] = 1;
        }
        working_cards[i] = my_rank;
        if (my_rank == 14) {
            working_cards[7] = 1; // ace==1 too
        }
    }
    for (var i = 0; i < working_cards.length; i++) {
        if (working_cards[i] == null) {
            working_cards[i] = -1; // FF
        }
    }
    //compNum is b-a -> sort descending order
    working_cards.sort(compNum);
    var absolute_longest_stretch = 0;
    var absolute_hi_card = 0;
    var current_longest_stretch = 1;
    var current_hi_card = 0;
    for (var i = 0; i < 8; i++) {
        var a = working_cards[i];
        var b = working_cards[i + 1];
        //if next card smaller than previous card
        if (a && b && a - b == 1) {
            current_longest_stretch++;
            if (current_hi_card < 1) {
                current_hi_card = a;
            }
        //if not -> break streak
        } else if (a) {
            //
            if (current_longest_stretch > absolute_longest_stretch) {
                absolute_longest_stretch = current_longest_stretch;
                if (current_hi_card < 1) {
                    current_hi_card = a;
                }
                absolute_hi_card = current_hi_card;
            }
            current_longest_stretch = 1;
            current_hi_card = 0;
        }
    }
    //get your cards
    var num_mine = 0;
    for (var i = 0; i < absolute_longest_stretch; i++) {
        if (absolute_hi_card - i == get_rank(player.carda) ||
            absolute_hi_card - i == get_rank(player.cardb)) {
            num_mine++;
        }
    }
    var hash_result = {};
    hash_result["straight_hi"] = absolute_hi_card;
    hash_result["num_needed"] = 5 - absolute_longest_stretch;
    hash_result["num_mine"] = num_mine;
    hash_result["hand_name"] = "Straight";
  
    return hash_result;
}

//flush + straight test = straight flush test
function test_straight_flush(player){
    var my_cards = group_cards(player);
    var the_suit = get_predominant_suit(my_cards);
    var working_cards = new Array(8);
    var working_index = 0;
    for (var i = 0; i < 7; i++) {
        if (get_suit(my_cards[i]) == the_suit) {
            var my_rank = get_rank(my_cards[i]);
            working_cards[working_index++] = my_rank;
            if (my_rank == 14) {
                working_cards[7] = 1; // ace==1 too
            }
        }
    }
    for (var i = 0; i < working_cards.length; i++) {
        if (working_cards[i] == null) {
            working_cards[i] = -1; // FF
        }
    }
    working_cards.sort(compNum);
    var absolute_longest_stretch = 0;
    var absolute_hi_card = 0;
    var current_longest_stretch = 1;
    var current_hi_card = 0;
    for (var i = 0; i < 8; i++) {
        var a = working_cards[i];
        var b = working_cards[i + 1];
        if (a && b && a - b == 1) {
            current_longest_stretch++;
            if (current_hi_card < 1) 
                current_hi_card = a;
        } else if (a) {
            if (current_longest_stretch > absolute_longest_stretch) {
                absolute_longest_stretch = current_longest_stretch;
                if (current_hi_card < 1) 
                    current_hi_card = a;
                absolute_hi_card = current_hi_card;
            }
            current_longest_stretch = 1;
            current_hi_card = 0;
        }
    }
    var num_mine = 0;
    for (var i = 0; i < absolute_longest_stretch; i++) {
        if (the_suit + (absolute_hi_card - i) == player.carda || the_suit + (absolute_hi_card - i) == player.cardb) 
            num_mine++;
    }
    var hash_result = {};
    hash_result["straight_hi"] = absolute_hi_card;
    hash_result["num_needed"] = 5 - absolute_longest_stretch;
    hash_result["num_mine"] = num_mine;
    hash_result["hand_name"] = "Straight Flush";
  
    return hash_result;
}

function test_two_pair(player){
    var my_cards = group_cards(player);
    var ranks = new Array(13);
    //count ranks
    for (var i = 0; i < 13; i++) 
        ranks[i] = 0;
    for (var i = 0; i < my_cards.length; i++) 
        ranks[get_rank(my_cards[i]) - 2]++;
    var first = "";
    var second = "";
    var kicker = "";
    for (i = 12; i > -1; i--) {
        //find first pair
        if (ranks[i] == 2) {
            if (!first) {
                first = i + 2;
            //find second pair
            } else if (!second) {
                second = i + 2;
            //find kicker rank
            } else if (!kicker) {
                kicker = i + 2;
            } else {
                break;
            }
        } else if (!kicker && ranks[i] > 0) {
            kicker = i + 2;
        }
    }
    var num_mine = 0;
    if (get_rank(player.carda) == first || get_rank(player.carda) == second) {
        num_mine++;
    }
    if (get_rank(player.cardb) == first || get_rank(player.cardb) == second) {
        num_mine++;
    }
    //num_needed -> number of cards needed to fit the two pair req
    //num_mine -> number of cards you have that fit the two pair req
    var num_needed = 2;
    if (second) 
        num_needed = 0;
    else if (first) 
        num_needed = 1;
    else 
        num_needed = 2;
    var hash_result = {};
    hash_result["rank_1"] = first;
    hash_result["rank_2"] = second;
    hash_result["num_needed"] = num_needed;
    hash_result["num_mine"] = num_mine;
    hash_result["kicker"] = kicker;
    hash_result["hand_name"] = "Two Pair";
  
    return hash_result;
}

//card_a["flush_"+i]? accessing using e.g card_a[flush_1]?
function compare_flush(card_a, card_b){
    for (var i = 0; i < 5; i++){
        var flush_a = card_a["flush_" + i];
        var flush_b = card_b["flush_" + i];
        if (flush_a > flush_b){
            return "a";
        } else if (flush_b > flush_a){
            return "b";
        }
    }
    return "c";
}

function compare_full_house(card_a, card_b){
    var major_a = card_a["major_rank"];
    var major_b = card_b["major_rank"];
    if (major_a > major_b) 
        return "a";
    else if (major_b > major_a) 
        return "b";
    else {
        var minor_a = card_a["minor_rank"];
        var minor_b = card_b["minor_rank"];
        if (minor_a > minor_b) 
            return "a";
        else if (minor_b > minor_a) 
            return "b";
        else 
            return "c";
    }
}

function compare_hi_card(card_a, card_b){
    for (var i = 0; i < 5; i++) {
        //these card a and card b are hash results obtained from the test methods
        var hi_a = card_a["hi_card_" + i];
        var hi_b = card_b["hi_card_" + i];
        if (hi_a > hi_b) 
            return "a";
        if (hi_b > hi_a) 
            return "b";
    }
    return "c";
}

//compare one pair is a bit tougher because you have to compare all the kickers
function compare_one_pair(card_a, card_b){
    var rank_a = card_a["rank"];
    var rank_b = card_b["rank"];
    if (rank_a > rank_b) {
        return "a";
    }
    if (rank_b > rank_a) {
        return "b";
    }
    var kicker_a = card_a["kicker_1"];
    var kicker_b = card_b["kicker_1"];
    if (kicker_a > kicker_b) {
        return "a";
    }
    if (kicker_b > kicker_a) {
      return "b";
    }
    kicker_a = card_a["kicker_2"];
    kicker_b = card_b["kicker_2"];
    if (kicker_a > kicker_b) {
        return "a";
    }
    if (kicker_b > kicker_a) {
        return "b";
    }
    kicker_a = card_a["kicker_3"];
    kicker_b = card_b["kicker_3"];
    if (kicker_a > kicker_b) {
        return "a";
    }
    if (kicker_b > kicker_a) {
        return "b";
    }
    return "c";
}

//have to compare kicker in case the quad is the community cards
function compare_quad(card_a, card_b){
    var rank_a = a["rank"];
    var rank_b = b["rank"];
    if (rank_a > rank_b) 
        return "a";
    else if (rank_b > rank_a) 
        return "b";
    else {
        var kicker_a = a["kicker"];
        var kicker_b = b["kicker"];
        if (kicker_a > kicker_b) 
            return "a";
        else if (kicker_b > kicker_a) 
            return "b";
        else 
            return "c";
    }
}

function compare_set(card_a, card_b){
    var rank_a = card_a["rank"];
    var rank_b = card_b["rank"];
    if (rank_a > rank_b) {
        return "a";
    }
    if (rank_b > rank_a) {
        return "b";
    }
    var kicker_a = card_a["kicker_1"];
    var kicker_b = card_b["kicker_1"];
    if (kicker_a > kicker_b) {
        return "a";
    }
    if (kicker_b > kicker_a) {
        return "b";
    }
    kicker_a = a["kicker_2"];
    kicker_b = b["kicker_2"];
    if (kicker_a > kicker_b) {
        return "a";
    }
    if (kicker_b > kicker_a) {
        return "b";
    }
    return "c";
}

function compare_straight(card_a, card_b){
    var hi_a = card_a["straight_hi"];
    var hi_b = card_b["straight_hi"];
    if (hi_a > hi_b) {
        return "a";
    } else if (hi_b > hi_a) {
        return "b";
    } else {
        return "c";
    }
}

function compare_straight_flush(card_a, card_b){
    return compare_straight(a, b);
}

function compare_two_pair(card_a, card_b){
    var rank_a = a["rank_1"];
    var rank_b = b["rank_1"];
    if (rank_a > rank_b) {
        return "a";
    }
    if (rank_b > rank_a) {
        return "b";
    }
    rank_a = a["rank_2"];
    rank_b = b["rank_2"];
    if (rank_a > rank_b) {
        return "a";
    }
    if (rank_b > rank_a) {
        return "b";
    }
    var kicker_a = a["kicker"];
    var kicker_b = b["kicker"];
    if (kicker_a > kicker_b) {
        return "a";
    }
    if (kicker_b > kicker_a) {
        return "b";
    }
    return "c";
}

function get_suit(card){
    //substring -> card [0,1)
    if(card){
        return card.substring(0,1);
    }
    return "";
}

function get_rank(card){
    //substring returns a string -> return string at position 1 - 0 to convert to number
    if(card){
        return card.substring(1) - 0;
    }
    return "";
}

function get_predominant_suit(my_cards){
    var suit_count = [0,0,0,0];
    for (var i = 0; i < my_cards.length; i++){
        var s = get_suit(my_cards[i]);
        if (s == "c")
            suit_count[0]++;
        else if (s == "s")
            suit_count[1]++;
        else if (s == "h")
            suit_count[2]++;
        else if (s == "d")
            suit_count[3]++;
    }

    //compare suit counts
    var suit_index = 0;
    if (suit_count[1] > suit_count[suit_index]) 
        suit_index = 1;
    if (suit_count[2] > suit_count[suit_index]) 
        suit_index = 2;
    if (suit_count[3] > suit_count[suit_index]) 
        suit_index = 3;
    if (suit_index == 0) 
        return "c";
    if (suit_index == 1) 
        return "s";
    if (suit_index == 2) 
        return "h";
    if (suit_index == 3) 
        return "d";
    return "";
}

function group_cards(player){
    var c = new Array(7);
    //get cards on board
    for (var i = 0; i < 5; i++){
        c[i] = board[i];
    }
    c[5] = player.carda;
    c[6] = player.cardb;
    return c;
}

function compNum (a, b) {
    return b - a;
}

function internal_exists_flush_potential () {
    var the_hash = test_flush(new player());
    return the_hash["num_needed"];
}
  
function internal_exists_straight_potential () {
    var the_hash = test_straight(new player());
    return the_hash["num_needed"];
}