$(document).ready(function(){
    reloadPokemon('grass');
    var counter = 1;

    //display the 75x29 popup window
    $("li").animate().hover(function(){
        $("li.preview").css("display", "block");
    }, function(){
        $("li.preview").css("display", "none");
    });

    //put the image in the 75x29
    $("a.thumbnav").hover(function(event){
        var rel = $(this).attr("rel");
        $("div.preview-wrapper").css("background","url("+ rel +") no-repeat center");
    });

    var sign = ""; //either += or -=
    var imgNum = 0; //number 1-17
    var move = 0; //num of pixels to move imgs

    $("a.thumbnav").click(function(event){
        event.preventDefault();
        var ref = $(this).attr("href");

        if(ref.indexOf("/1.") != -1){
            imgNum = 1;
            reloadPokemon('grass');
        }else if(ref.indexOf("/2.") != -1){
            imgNum = 2;
            reloadPokemon('fire');
        }else if(ref.indexOf("/3.") != -1){
            imgNum = 3;
            reloadPokemon('water');
        }else if(ref.indexOf("/4.") != -1){
            imgNum = 4;
            reloadPokemon('electric');
        }else if(ref.indexOf("/5.") != -1){
            imgNum = 5;
            reloadPokemon('bug');
        }else if(ref.indexOf("/6.") != -1){
            imgNum = 6;
            reloadPokemon('ground');
        }else if(ref.indexOf("/7.") != -1){
            imgNum = 7;
            reloadPokemon('rock');
        }else if(ref.indexOf("/8.") != -1){
            imgNum = 8;
            reloadPokemon('normal');
        }else if(ref.indexOf("/9.") != -1){
            imgNum = 9;
            reloadPokemon('poison');
        }else if(ref.indexOf("/10.") != -1){
            imgNum = 10;
            reloadPokemon('psychic');
        }else if(ref.indexOf("/11.") != -1){
            imgNum = 11;
            reloadPokemon('fairy');
        }else if(ref.indexOf("/12.") != -1){
            imgNum = 12;
            reloadPokemon('fighting');
        }else if(ref.indexOf("/13.") != -1){
            imgNum = 13;
            reloadPokemon('flying');
        }else if(ref.indexOf("/14.") != -1){
            imgNum = 14;
            reloadPokemon('ghost');
        }else if(ref.indexOf("/15.") != -1){
            imgNum = 15;
            reloadPokemon('dragon');
        }else if(ref.indexOf("/16.") != -1){
            imgNum = 16;
            reloadPokemon('ice');
        }else if(ref.indexOf("/17.") != -1){
            imgNum = 17;
            reloadPokemon('steel');
        }

        if((counter-imgNum) < 0){
            move = (imgNum - counter) * 644;
            sign = "-=";
        }else{
            move = (counter - imgNum) * 644;
            sign = "+=";
        }

        //move the image
        $("img").animate({
            left: sign+move
        }, 250);

        counter = imgNum;
        $("li.selected").removeClass("selected");
        $("li#nav"+imgNum).addClass("selected");
    });

    //make the 75x29 move
    $("li#nav1").hover(function(event){
        $("li.preview").css("left","-34.5px");
    });
    $("li#nav2").hover(function(event){
        $("li.preview").css("left","-14px");
    });
    $("li#nav3").hover(function(event){
        $("li.preview").css("left","5px");
    });
    $("li#nav4").hover(function(event){
        $("li.preview").css("left","24px");
    });
    $("li#nav5").hover(function(event){
        $("li.preview").css("left","43px");
    });
    $("li#nav6").hover(function(event){
        $("li.preview").css("left","62px");
    });
    $("li#nav7").hover(function(event){
        $("li.preview").css("left","81px");
    });
    $("li#nav8").hover(function(event){
        $("li.preview").css("left","100px");
    });
    $("li#nav9").hover(function(event){
        $("li.preview").css("left","119px");
    });
    $("li#nav10").hover(function(event){
        $("li.preview").css("left","138px");
    });
    $("li#nav11").hover(function(event){
        $("li.preview").css("left","157px");
    });
    $("li#nav12").hover(function(event){
        $("li.preview").css("left","176px");
    });
    $("li#nav13").hover(function(event){
        $("li.preview").css("left","195px");
    });
    $("li#nav14").hover(function(event){
        $("li.preview").css("left","214px");
    });
    $("li#nav15").hover(function(event){
        $("li.preview").css("left","233px");
    });
    $("li#nav16").hover(function(event){
        $("li.preview").css("left","252px");
    });
    $("li#nav17").hover(function(event){
        $("li.preview").css("left","271px");
    });

    //when the right arrow is clicked
    $("div.next").click(function(event){
        if (counter == 17){
            //boundary case
            $("img").animate({
                left: "+=" + ((counter-1) * 644)
            }, 50);

            $("li.selected").removeClass("selected");
            $("#nav1").addClass("selected");

            counter = 1;

            reloadPokemon(getPokeTypeFromInt(counter));

        }else if(counter < 17){
            //all other cases
            $("img").animate({
                left:"-=644"
            },250);

            $("li.selected").addClass("prevNav");
            $("li.selected").removeClass("selected");
            $("li.prevNav").next().addClass("selected");
            $("li.prevNav").removeClass("prevNav");

            counter++;

            reloadPokemon(getPokeTypeFromInt(counter));
        }
    }); //end right arrow

    //when the left arrow is clicked
    $("div.prev").click(function(event){
        if (counter == 1){
            //boundary case
            $("img").animate({
                left: "-=" + (16 * 644)
            }, 50);
            $("li.selected").removeClass("selected");
            $("#nav17").addClass("selected");

            counter = 17;

            reloadPokemon(getPokeTypeFromInt(counter));

        }else if(counter > 1){
            //all other cases
            $("img").animate({
                left:"+=644"
            },250);
            $("li.selected").addClass("prevNav");
            $("li.selected").removeClass("selected");
            $("li.prevNav").prev().addClass("selected");
            $("li.prevNav").removeClass("prevNav");

            counter--;

            reloadPokemon(getPokeTypeFromInt(counter));
        }
    }); //end left arrow

    //given a type integer, return the associated string
    function getPokeTypeFromInt(typeInt){
        var type ="";
        if(typeInt == 1){type='grass';}
        else if (typeInt == 2){type='fire';}
        else if (typeInt == 3){type='water';}
        else if (typeInt == 4){type='electric';}
        else if (typeInt == 5){type='bug';}
        else if (typeInt == 6){type='ground';}
        else if (typeInt == 7){type='rock';}
        else if (typeInt == 8){type='normal';}
        else if (typeInt == 9){type='poison';}
        else if (typeInt == 10){type='psychic';}
        else if (typeInt == 11){type='fairy';}
        else if (typeInt == 12){type='fighting';}
        else if (typeInt == 13){type='flying';}
        else if (typeInt == 14){type='ghost';}
        else if (typeInt == 15){type='dragon';}
        else if (typeInt == 16){type='ice';}
        else if (typeInt == 17){type='steel';}

        return type;
    }

    //given a type string, return the associated integer
    function getPokeTypeFromString(typeString){
        var type = 0;
        if(typeString == 'grass'){type=1;}
        else if (typeString == 'fire'){type=2;}
        else if (typeString == 'water'){type=3;}
        else if (typeString == 'electric'){type=4;}
        else if (typeString == 'bug'){type=5;}
        else if (typeString == 'ground'){type=6;}
        else if (typeString == 'rock'){type=7;}
        else if (typeString == 'normal'){type=8;}
        else if (typeString == 'poison'){type=9;}
        else if (typeString == 'psychic'){type=10;}
        else if (typeString == 'fairy'){type=11;}
        else if (typeString == 'fighting'){type=12;}
        else if (typeString == 'flying'){type=13;}
        else if (typeString == 'ghost'){type=14;}
        else if (typeString == 'dragon'){type=15;}
        else if (typeString == 'ice'){type=16;}
        else if (typeString == 'steel'){type=17;}

        return type;
    }

    //reload page when navbar title is clicked
    $('#nav-content-wrapper').click(function(){
        location.reload();
    });

    //given a pokemon type string, change the background image's color
    function setTypeColor(typeString){
        var color = 'rgb(64, 164, 30)';
        if(typeString=='grass'){color='rgba(64, 164, 30, 0.6)'}
        else if(typeString=='fire'){color='rgb(208, 38, 0, 0.6)'}
        else if(typeString=='water'){color='rgba(19, 100, 188, 0.6)'}
        else if(typeString=='electric'){color='rgba(229, 163, 0, 0.6)'}
        else if(typeString=='bug'){color='rgba(134, 152, 11, 0.6)'}
        else if(typeString=='ground'){color='rgba(179, 147, 105, 0.6)'}
        else if(typeString=='rock'){color='rgba(161, 135, 60, 0.6)'}
        else if(typeString=='normal'){color='rgba(145, 145, 139, 0.6)'}
        else if(typeString=='poison'){color='rgba(115, 45, 117, 0.6)'}
        else if(typeString=='psychic'){color='rgba(219, 58, 112, 0.6)'}
        else if(typeString=='fairy'){color='rgba(232, 138, 235, 0.6)'}
        else if(typeString=='fighting'){color='rgba(151, 39, 28, 0.6)'}
        else if(typeString=='flying'){color='rgba(114, 125, 240, 0.6)'}
        else if(typeString=='ghost'){color='rgba(72, 66, 142, 0.8)'}
        else if(typeString=='dragon'){color='rgba(75, 60, 166, 0.6)'}
        else if(typeString=='ice'){color='rgba(110, 212, 234, 0.6)'}
        else if(typeString=='steel'){color='rgba(161, 158, 175, 0.6)'}

        $('body').css('background-color', color);
    }

    //populate the page with pokemon from a JSON list 
    function reloadPokemon(type){
        $.getJSON('js/pokemon.json', function(data){
            var pokemon = data;
            var listLength = (Object.keys(pokemon).length);

            setTypeColor(type);
            
            //ensure that containers fade out rather than suddenly disappear
            $('#pokemon-list-wrapper').fadeTo(250, 0.0);
            $('#pokemon-list-wrapper').promise().done(function(){
                $('.pokemon-container').remove();

                for(let i = 1; i < listLength; i++){
                    var name = pokemon[i - 1].name;
                    var currentId = '#pokemon-'+i;
                    var types = pokemon[i - 1].types;

                    //only return pokemon of the selected type
                    if(types.includes(type)){
                        var row = parseInt(((i-1)/16) + 1);
                        var col = parseInt((i - 16 * (row - 1)));
                
                        var offsetLeft = (col - 1 ) * 223.75;
                        var offsetTop = (row - 1) * 224;

                        //add the necessary elements to the list
                        $('#pokemon-list-wrapper').append(
                            $('<div/>')
                            .attr('id', 'pokemon-'+i)
                            .addClass('pokemon-container')
                        );

                        $(currentId).append(
                            $('<h3/>')
                            .addClass('poke-num')
                            .text('#'+i)
                        );

                        $(currentId).append(
                            $('<div/>')
                            .addClass('pokemon-img')
                            .css('background', ('url(images/larger-sprite-map.png) ' + -offsetLeft + 'px ' + -offsetTop + 'px'))
                        );

                        $(currentId).append(
                            $('<div/>')
                            .addClass('pokemon-type-wrapper')
                        );

                        //add images associated with the current pokemon's type
                        for(let j = 0; j < types.length; j++){
                            $(currentId + ' .pokemon-type-wrapper').append(
                                $('<img/>')
                                .attr('src','images/'+ getPokeTypeFromString(types[j]) +'.png')
                                .addClass('type-img')
                            );
                        }

                        $(currentId).append(
                            $('<h2/>')
                            .addClass('poke-text')
                            .text(name)
                        );
                    }
                }
                //fade the containers back in
                $('#pokemon-list-wrapper').fadeTo(250, 1.0);
            });
        });
    }
});
