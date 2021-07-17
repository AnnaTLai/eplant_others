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
Eplant.Views.SoybeanSeverinView = function(geneticElement) {
	// Get constructor
	var constructor = Eplant.Views.SoybeanSeverinView;

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

	var efpSvgURL = 'data/experiment/efps/SoybeanSeverin/' + geneticElement.species.scientificName.replace(" ", "_") + '.svg';
	var efpXmlURL = 'data/experiment/efps/SoybeanSeverin/' + geneticElement.species.scientificName.replace(" ", "_") + '.xml';
	Eplant.BaseViews.EFPView.call(this, geneticElement, efpSvgURL,efpXmlURL, {
	});
};
ZUI.Util.inheritClass(Eplant.BaseViews.EFPView, Eplant.Views.SoybeanSeverinView);	// Inherit parent prototype

Eplant.Views.SoybeanSeverinView.viewName = "SoybeanSeverinView";
Eplant.Views.SoybeanSeverinView.displayName = "Soybean Severin eFP";
Eplant.Views.SoybeanSeverinView.hierarchy = "genetic element";
Eplant.Views.SoybeanSeverinView.magnification = 35;
Eplant.Views.SoybeanSeverinView.description = "Soybean Severin eFP";
Eplant.Views.SoybeanSeverinView.citation = "";
Eplant.Views.SoybeanSeverinView.activeIconImageURL = "";
Eplant.Views.SoybeanSeverinView.availableIconImageURL = "";
Eplant.Views.SoybeanSeverinView.unavailableIconImageURL = "";


})();
