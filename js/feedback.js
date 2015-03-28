$(document).ready(function(){
  $('#feedback-form').submit(function(){
    $('#feedback-form').hide();
    $('<i class="fa fa-spinner fa-spin fa-2x" id="feedback-spinner"></i>').appendTo('.feedback');
    $('#feedback-alert').remove();
    name = $('#name').val();
    email = $('#email').val();
    feedback_type = $('#feedback_type').val();
    subject = $('#subject').val();
    body = $('#feedbackParams').val();
    body =  body + '<br><br>' + $('#body').val();
    uid = JSON.parse(localStorage['current_user']).id;
    uid = JSON.parse(localStorage['current_user']).token;
    href = $('#href').val();
    provider = "EduChallenge"
    url = "http://eduissue.herokuapp.com/api/v2/feedbacks";
    $.ajax({
      dataType: "json",
      data: { name: name, email: email, feedback_type: feedback_type, subject: subject, body: body, user_id: user_id, href: href, provider: provider, uid: uid, token: token },
      type: "POST",
      url: url,
      success: function(data) {
        $('#feedback-spinner').remove();
        html = '<div class="alert alert-success" id="feedback-alert" role="alert"><strong>Feedback sent!</strong> Your feedback was sent successfully! Thank you very much, we\'ll review it and get back to you ASAP.</div>';
        $(html).appendTo('.feedback');
      },
      error: function(e) {
        $('#feedback-spinner').remove();
        $('#feedback-form').show();
        html = '<div class="alert alert-danger alert-dismissible" id="feedback-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Oops!</strong> We couldn\'t send your feedback due to a server error. Please try sending it later.</div>';
        $('.feedback').prepend(html);
      },
      timeout: function() {
        $('#feedback-spinner').remove();
        $('#feedback-form').show();
        html = '<div class="alert alert-warning alert-dismissible" id="feedback-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Oops!</strong> We couldn\'t send your feedback due to a timeout error. Please check your internet connection and try sending it again.</div>';
        $('.feedback').prepend(html);
      }
    });
  });
});