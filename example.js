
var car_q = {
    type: 'survey-select',
    preamble: 'Make some choices',
    questions: [
    	{
            prompt: 'Select a car:',
            name: 'car',
            placeholder: '--select--',
            options: ['Volvo', 'Saab', 'Mercedes', 'Audi'],
            randomize_option_order: true
    	},
    	{
            prompt: 'Select a fruit:',
            options: ['Apply', 'Orange', 'Banana'],
    	},
    ]
};
timeline.push(demographics);