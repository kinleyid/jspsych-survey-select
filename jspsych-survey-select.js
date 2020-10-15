
/*
drop-down menu plugin for jsPsych, by Isaac Kinley, Oct 2020.
*/

jsPsych.plugins['survey-select'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'survey-select',
    description: '',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        default: undefined,
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'Prompt for the subject to response'
          },
          placeholder: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Value',
            default: null,
            description: 'Placeholder option'
          },
          options: {
            type: jsPsych.plugins.parameterType.LIST,
            pretty_name: 'Options',
            default: [],
            description: 'List of drop-down menu options'
          },
          randomize_option_order: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Randomize option order',
            default: false,
            description: 'Randomize the order of the options'
          },
          name: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Question Name',
            default: '',
            description: 'Controls the name of data values associated with this question'
          }
        }
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to finish the trial.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].value == 'undefined') {
        trial.questions[i].value = "";
      }
    }

    var html = '';
    // show preamble text
    if(trial.preamble !== null){
      html += '<div id="jspsych-survey-select-preamble" class="jspsych-survey-select-preamble">'+trial.preamble+'</div>';
    }
    // start form
    html += '<form id="jspsych-survey-select-form">'

    // generate question order
    var question_order = [];
    for (var i = 0; i < trial.questions.length; i++){
      question_order.push(i);
    }
    if (trial.randomize_question_order) {
      question_order = jsPsych.randomization.shuffle(question_order);
    }

    // add questions
    for (var i = 0; i < trial.questions.length; i++) {
      var question = trial.questions[question_order[i]];
      var question_index = question_order[i];
      html += '<div id="jspsych-survey-select-' + question_index + '" class="jspsych-survey-select-question" style="margin: 2em 0em;">';
      html += '<p class="jspsych-survey-select">' + question.prompt + '</p>';
      var autofocus = i == 0 ? "autofocus" : "";
      var req = question.required ? "required" : "";
      html += '<select id="input-' + question_index +
        '" name="#jspsych-survey-select-response-' + question_index +
        '" data-name="' + question.name + '" ' + autofocus + ' ' + req + '>';
      if (question.placeholder) {
        html += '<option value="placeholder">' + question.placeholder + '</option>';
      }
      if (question.randomize_option_order) {
        question.options = jsPsych.randomization.shuffle(question.options);
      }
      for (var j = 0; j < question.options.length; j++) {
        html += '<option value="' + question.options[j] +'">' + question.options[j] + '</option>';
      }
      html += '</select></div>'
    }

    // add submit button
    html += '<input type="submit" id="jspsych-survey-select-next" class="jspsych-btn jspsych-survey-select" value="'+trial.button_label+'"></input>';

    html += '</form>'
    display_element.innerHTML = html;

    // backup in case autofocus doesn't work
    display_element.querySelector('#input-'+question_order[0]).focus();

    display_element.querySelector('#jspsych-survey-select-form').addEventListener('submit', function(e) {
      e.preventDefault();
      // measure response time
      var endTime = performance.now();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {};
      
      for(var index=0; index < trial.questions.length; index++){
        var id = "Q" + index;
        var q_element = document.querySelector('#jspsych-survey-select-'+index).querySelector('select');
        var val = q_element.value;
        var name = q_element.attributes['data-name'].value;
        if(name == ''){
          name = id;
        }        
        var obje = {};
        obje[name] = val;
        Object.assign(question_data, obje);
      }
      // save data
      var trialdata = {
        "rt": response_time,
        "responses": JSON.stringify(question_data)
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    });

    var startTime = performance.now();
  };

  return plugin;
})();
