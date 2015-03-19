
    $(document).ready(function(){

            
            
            img = {'square': 'http://graph.facebook.com/10152763176677496/picture?type=square', 'small': 'http://graph.facebook.com/10152763176677496/picture?type=small', 'normal': 'http://graph.facebook.com/10152763176677496/picture?type=normal', 'large': 'http://graph.facebook.com/10152763176677496picture?type=large'};
            
            current_user = { 'id': '10152763176677496','token': 'CAALbheeb6zoBALYFM7pm0SzvmOEhlcxZCJ8CI7SsBd0HuU8VcmCiE01SlergCDou6k5OGIgVGyp9TZAZBfNpsnul8fMtIV4ZBzpw8ZBp0UTN2EytVzUs6LrSIeznwtgZB9PIHbsRRw3K0ieGx4CALQjQVUq8TirnL07TetBYSwMSVsfIjbPda8Qw7KnsT8gDWJMGgXEFmZBMdYqGCILBEme3iU01oxeRCgZD', 'name': 'Juan Gesino', 'img': img };

            localStorage['current_user'] = JSON.stringify(current_user);

            
            var url = "http://localhost:3000/es/api/v1/challenge/exercises/120643";
            $.ajax({
                type: "GET",
                url: url,
                success: function(data){
                    model_name = data.model_name;
                    val = data.values;
                    level = data.level;
                    html = '<ul class="breadcrumb" style="text-align: center;"><li><h2>'+data.generate_text+'</h2></li></ul></div><br><div style="margin-left:10%;">';
                    $.each(data.answers, function(key, val){
                        html = html + '<a class="btn btn-info btn-lg" style="margin-right:10px; width:20%;" onclick="stopCountdown();solve(\''+val+'\')">' + val + '</a>';
                    });
                    html = html + '</div><br><br>';
                    $(html).appendTo('#container');
                    (function () {
                      var script = document.createElement("script");
                      script.type = "text/javascript";
                      script.src  = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
                      document.getElementsByTagName("head")[0].appendChild(script);

                        seconds = 300;
                        total = 100/seconds;
                        countdown = setInterval(function(){
                          
                          $(".progress-bar").css("width",(seconds*total)+"%");
                            if(seconds*total < 50){
                                $(".progress-bar").removeClass( "progress-bar-success" );
                                $(".progress-bar").addClass( "progress-bar-warning" );
                            };

                            if(seconds*total < 20){
                                $(".progress-bar").removeClass( "progress-bar-warning" );
                                $(".progress-bar").addClass( "progress-bar-danger" );                           
                            };
                          if(seconds*total <= 0){
                            solve('Se acabo el tiempo!');
                          };
                          
                          seconds--;  
                        }, 50);

                    })();
                },
                headers: {
                    "Authorization": "Basic " + btoa(JSON.parse(localStorage['current_user']).id + ":" + JSON.parse(localStorage['current_user']).token)
                }
            });

        });
        function solve (ans) {
            stopCountdown();
            $('.progress').remove();
            var url = "http://localhost:3000/es/api/v1/challenge/exercises/solve";
            $.ajax({
                dataType: "json",
                data: { answer: ans, iteration: "1", level: level, exercise: model_name, values: val },
                type: "POST",
                url: url,
                success: function(data){

                    $('#container').empty();

                    if(data.answer_submitted == 'Se acabo el tiempo!'){
                        // La respuesta esta mal porque se le acabo el tiempo
                        $('<ul class="breadcrumb" style="text-align: center;"><li><h2>'+data.text+'</h2></li></ul>').appendTo('#container');
                        if(data.correct == "true") {
                            $('<ul class="breadcrumb" style="text-align: center;"><li><h1 style="color:green;">'+data.answer_submitted+'</h1><img src="img/right.png" style="display: block; margin-left:auto; margin-right:auto; width:80%; margin-top:10%; width:40%;"></li></ul>').appendTo('#container');
                        } else {
                            $('<ul class="breadcrumb" style="text-align: center;"><li><h1 style="color:red;">'+data.answer_submitted+'</h1><img src="img/wrong.png" style="display: block; margin-left:auto; margin-right:auto; width:80%; margin-top:10%; width:40%;"></li></ul>').appendTo('#container');
                            $('<ul class="breadcrumb" style="text-align: center;"><li><h2>'+data.explain+'</h2></li></ul>').appendTo('#container');
                            $('<ul class="breadcrumb" style="text-align: center;"><li><h2>Respuesta correcta: </h2><h2 style="color:green;">'+data.correct_answer+'</h2></li></ul>').appendTo('#container');
                        };  
                    }else{
                        // Respondio mal
                        $('<ul class="breadcrumb" style="text-align: center;"><li><h2>'+data.text+'</h2></li></ul>').appendTo('#container');
                         if(data.correct == "true") {
                            $('<ul class="breadcrumb" style="text-align: center;"><li><h1 style="color:green;">'+data.answer_submitted+'</h1><img src="img/right.png" style="display: block; margin-left:auto; margin-right:auto; width:80%; margin-top:10%; width:40%;"></li></ul>').appendTo('#container');
                        } else {
                            $('<ul class="breadcrumb" style="text-align: center;"><li><h1 style="color:red;">'+data.answer_submitted+'</h1><img src="img/wrong.png" style="display: block; margin-left:auto; margin-right:auto; width:80%; margin-top:10%; width:40%;"></li></ul>').appendTo('#container');
                            $('<ul class="breadcrumb" style="text-align: center;"><li><h2>'+data.explain+'</h2></li></ul>').appendTo('#container');
                            $('<ul class="breadcrumb" style="text-align: center;"><li><h2>Respuesta correcta: </h2><h2 style="color:green;">'+data.correct_answer+'</h2></li></ul>').appendTo('#container');
                        };                           
                    }

                    $('#buttons').append('<a class="btn btn-danger btn-block" href="solve_test.html">Siguiente</a>');
                    $('.btn-success').remove();
                    $('#buttons').append('<a class="btn btn-success btn-block" href="main_test.html">Back</a>');
                    
                    MathJax.Hub.Typeset()
                },
                headers: {
                    "Authorization": "Basic " + btoa(JSON.parse(localStorage['current_user']).id + ":" + JSON.parse(localStorage['current_user']).token)
                }
            });
        }
function stopCountdown(){
          clearInterval(countdown);
        }

        function giveUp(){
            solve('Give up!');
            window.location.href = "main_test.html";
        }

        function paso(){
            if(solved){
                window.location.href = "main_test.html";
            }else{
                giveUp();
            }
        }