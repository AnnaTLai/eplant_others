(function() {

/**
 * Eplant.Views.ExperimentalView class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * ePlant View for browsing gene expression data of plant tissues during development as eFP.
 *
 * @constructor
 * @augments Eplant.Experimental.EFPView
 * @param {Eplant.GeneticElement} geneticElement The GeneticElement associated with this view.
 */
Eplant.Views.PotatoStressView = function(geneticElement) {
	// Get constructor
	var constructor = Eplant.Views.PotatoStressView;

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

	var efpSvgURL = 'data/experiment/efps/PotatoStress/' + geneticElement.species.scientificName.replace(" ", "_") + '.svg';
	var efpXmlURL = 'data/experiment/efps/PotatoStress/' + geneticElement.species.scientificName.replace(" ", "_") + '.xml';
	Eplant.BaseViews.EFPView.call(this, geneticElement, efpSvgURL,efpXmlURL, {
	});
};
ZUI.Util.inheritClass(Eplant.BaseViews.EFPView, Eplant.Views.PotatoStressView);	// Inherit parent prototype

Eplant.Views.PotatoStressView.viewName = "PotatoStressView";
Eplant.Views.PotatoStressView.displayName = "Potato Stress eFP";
Eplant.Views.PotatoStressView.hierarchy = "genetic element";
Eplant.Views.PotatoStressView.magnification = 35;
Eplant.Views.PotatoStressView.description = "Potato Stress eFP";
Eplant.Views.PotatoStressView.citation = "";
Eplant.Views.PotatoStressView.activeIconImageURL = "";
Eplant.Views.PotatoStressView.availableIconImageURL = "";
Eplant.Views.PotatoStressView.unavailableIconImageURL = "";


})();
