var modules =
{	
	'StdMortRatio': 
	{
		name:'StdMortRatio',
		group:'Counts',
		title: 'Standardized Mortality Ratio',
		titleShort: 'Std.Mort.Ratio',
		inputFields:
		[
			{
				id: 'observedNumberOfCases',
				label: 'Observed number of cases',
				required: true,
				type: 'text',
				jqmType: 'textinput',
				minlength: 5,
				maxlength: 50,
				defaultValue: '4'
			}
			,{
				id: 'expectedNumberOfCases',
				label: 'Expected number of cases',
				required: true,
				type: 'text',
				jqmType: 'textinput',
				minlength: 5,
				maxlength: 50,
				defaultValue: '3'
			}
		]
		,calculate: function(viewModel) { return viewModel.observedNumberOfCases() * viewModel.expectedNumberOfCases(); }
	}
	,'Proportion': 
	{
		name:'Proportion',
		group:'Sample Size',
		title: 'Simple Proportion',
		titleShort: 'Proportion',
		inputFields:
		[
			{
				id: 'numerator',
				name:'numerator',
				label: 'Numerator',
				required: true,
				type: 'text',
				jqmType: 'textinput',
				minlength: 5,
				maxlength: 50,
				defaultValue: '10'
			}
			,{
				id: 'denominator',
				name: 'denominator',
				label: 'Denominator',
				required: true,
				type: 'text',
				jqmType: 'textinput',
				minlength: 5,
				maxlength: 50,
				defaultValue: '20'
			}
		]
		,calculate: function(viewModel) { return viewModel.numerator() / viewModel.denominator(); }
	}	
};

window.modules = modules;