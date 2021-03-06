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
                        html = html + '<a class="btn btn-info btn-lg" style="margin-right:10px; width:20%;" onclick="solve('+val+')">' + val + '</a>';
                    });
                    html = html + '</div><br><br>';
                    $(html).appendTo('#container');
                    (function () {
                      var script = document.createElement("script");
                      script.type = "text/javascript";
                      script.src  = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
                      document.getElementsByTagName("head")[0].appendChild(script);

                      seconds = 15;
                      total = 100/seconds;
                        $('#clock').countdown((new Date().valueOf() + seconds * 1000).toString()).on('update.countdown', function(event) {
                            var format = '%S';
                            $(".progress-bar").css("width",(event.strftime(format)*total)+"%");
                            $(this).html(event.strftime(format));
                         }).on('finish.countdown', function(event) {
                            $('#container').empty();
                            solve('Se acabo el tiempo!');
                         });

                    })();
                },
                headers: {
                    "Authorization": "Basic " + btoa(JSON.parse(localStorage['current_user']).id + ":" + JSON.parse(localStorage['current_user']).token)
                }
            });

        });
        function solve (ans) {
            $('#clock').countdown('stop');
            $('.countdown').remove();
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
                        $('<h2>'+data.text+'</h2>').appendTo('#container');
                        $('<h2>'+data.answer_submitted+'</h2>').appendTo('#container');
                        $('<h2>'+data.correct+'</h2>').appendTo('#container');
                        $('<h2>'+data.explain+'</h2>').appendTo('#container');
                        $('<h2>'+data.correct_answer+'</h2>').appendTo('#container');
                    }else{
                        // Respondio mal
                        $('<h2>'+data.text+'</h2>').appendTo('#container');
                        $('<h2>'+data.answer_submitted+'</h2>').appendTo('#container');
                        $('<h2>'+data.correct+'</h2>').appendTo('#container');
                        $('<h2>'+data.explain+'</h2>').appendTo('#container');
                        $('<h2>'+data.correct_answer+'</h2>').appendTo('#container');
                    }

                    MathJax.Hub.Typeset()
                },
                headers: {
                    "Authorization": "Basic " + btoa(JSON.parse(localStorage['current_user']).id + ":" + JSON.parse(localStorage['current_user']).token)
                }
            });
        }