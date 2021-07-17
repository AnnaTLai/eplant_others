(function() {

/**
 * Eplant.Views.WorldXylemView class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * ePlant View for browsing gene expression data of plant tissues during development as eFP.
 *
 * @constructor
 * @augments Eplant.BaseViews.EFPView
 * @param {Eplant.GeneticElement} geneticElement The GeneticElement associated with this view.
 */
Eplant.Views.WorldXylemView = function(geneticElement) {
	// Get constructor
	var constructor = Eplant.Views.WorldXylemView;

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
	var efpSvgURL = 'data/worldXylem/' + geneticElement.species.scientificName.replace(" ", "_") + '.svg';
	var efpXmlURL = 'data/worldXylem/' + geneticElement.species.scientificName.replace(" ", "_") + '.xml';
	Eplant.BaseViews.EFPView.call(this, geneticElement, efpSvgURL,efpXmlURL, {
	});
};
ZUI.Util.inheritClass(Eplant.BaseViews.EFPView, Eplant.Views.WorldXylemView);	// Inherit parent prototype

Eplant.Views.WorldXylemView.viewName = "WorldXylemView";
Eplant.Views.WorldXylemView.displayName = "World Xylem eFP (RNA-Seq Data)";
Eplant.Views.WorldXylemView.hierarchy = "genetic element";
Eplant.Views.WorldXylemView.magnification = 10;
Eplant.Views.WorldXylemView.description = "World Xylem eFP";
Eplant.Views.WorldXylemView.citation = "";
Eplant.Views.WorldXylemView.activeIconImageURL = "img/active/world.png";
Eplant.Views.WorldXylemView.availableIconImageURL = "img/available/world.png";
Eplant.Views.WorldXylemView.unavailableIconImageURL = "img/unavailable/world.png";

})();
