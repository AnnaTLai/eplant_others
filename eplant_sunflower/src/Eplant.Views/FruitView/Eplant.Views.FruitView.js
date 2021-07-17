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
	Eplant.Views.FruitView = function(geneticElement) {
		// Get constructor
		var constructor = Eplant.Views.FruitView;

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
		var efpSvgURL = 'data/experiment/efps/Fruit/' + geneticElement.species.scientificName.replace(" ", "_") + '.svg';
		var efpXmlURL = 'data/experiment/efps/Fruit/' + geneticElement.species.scientificName.replace(" ", "_") + '.xml';
		Eplant.BaseViews.EFPView.call(this, geneticElement, efpSvgURL,efpXmlURL, {
		});

	};
	ZUI.Util.inheritClass(Eplant.BaseViews.EFPView, Eplant.Views.FruitView);	// Inherit parent prototype

Eplant.Views.FruitView.viewName = "FruitView";
	Eplant.Views.FruitView.displayName = "Fruit eFP";
	Eplant.Views.FruitView.hierarchy = "genetic element";
	Eplant.Views.FruitView.magnification = 35;
	Eplant.Views.FruitView.description = "Fruit eFP";
	Eplant.Views.FruitView.citation = "";
	Eplant.Views.FruitView.activeIconImageURL = "img/active/plant.png";
	Eplant.Views.FruitView.availableIconImageURL = "img/available/plant.png";
	Eplant.Views.FruitView.unavailableIconImageURL = "img/unavailable/plant.png";

})();
