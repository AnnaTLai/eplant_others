(function() {

	/**
		* Eplant.Views.PlantView class
		* Coded by Hans Yu
		* UI designed by Jamie Waese
		*
		* ePlant View for browsing gene expression data of plant tissues during development as eFP.
		*
		* @constructor
		* @augments Eplant.BaseViews.EFPView
		* @param {Eplant.GeneticElement} geneticElement The GeneticElement associated with this view.
	*/
	Eplant.Views.StressView = function(geneticElement) {
		// Get constructor
		var constructor = Eplant.Views.StressView;

		// Call parent constructor
		Eplant.View.call(this,
		constructor.displayName,			// Name of the View visible to the user
		constructor.viewName,
		constructor.hierarchy,			// Hierarchy of the View
		constructor.magnification,			// Magnification level of the View
		constructor.description,			// Description of the View visible to the user
		constructor.citation,			// Citation template of the View
		constructor.activeIconImageURL,		// URL for the active icon image
		constructor.availableIconImageURL,		// URL for the available icon image
		constructor.unavailableIconImageURL	// URL for the unavailable icon image
		);

		/* Call eFP constructor */
		var efpSvgURL = 'data/experiment/efps/Stress/' + geneticElement.species.scientificName.replace(" ", "_") + '.svg';
		var efpXmlURL = 'data/experiment/efps/Stress/' + geneticElement.species.scientificName.replace(" ", "_") + '.xml';
		Eplant.BaseViews.EFPView.call(this, geneticElement, efpSvgURL,efpXmlURL, {
		});

	};
	ZUI.Util.inheritClass(Eplant.BaseViews.EFPView, Eplant.Views.StressView);	// Inherit parent prototype

Eplant.Views.StressView.viewName = "StressView";
	Eplant.Views.StressView.displayName = "Stress eFP";
	Eplant.Views.StressView.hierarchy = "genetic element";
	Eplant.Views.StressView.magnification = 35;
	Eplant.Views.StressView.description = "Stress eFP";
	Eplant.Views.StressView.citation = "";
	Eplant.Views.StressView.activeIconImageURL = "img/active/plant.png";
	Eplant.Views.StressView.availableIconImageURL = "img/available/plant.png";
	Eplant.Views.StressView.unavailableIconImageURL = "img/unavailable/plant.png";

})();
