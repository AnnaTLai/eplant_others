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
Eplant.Views.RootILsView = function(geneticElement) {
	// Get constructor
	var constructor = Eplant.Views.RootILsView;

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

	var efpSvgURL = 'data/experiment/efps/RootILs/' + geneticElement.species.scientificName.replace(" ", "_") + '.svg';
	var efpXmlURL = 'data/experiment/efps/RootILs/' + geneticElement.species.scientificName.replace(" ", "_") + '.xml';
	Eplant.BaseViews.EFPView.call(this, geneticElement, efpSvgURL,efpXmlURL, {
	});
};
ZUI.Util.inheritClass(Eplant.BaseViews.EFPView, Eplant.Views.RootILsView);	// Inherit parent prototype

Eplant.Views.RootILsView.viewName = "RootILsView";
Eplant.Views.RootILsView.displayName = "Root ILs eFP";
Eplant.Views.RootILsView.hierarchy = "genetic element";
Eplant.Views.RootILsView.magnification = 35;
Eplant.Views.RootILsView.description = "Root ILs eFP";
Eplant.Views.RootILsView.citation = "";
Eplant.Views.RootILsView.activeIconImageURL = "";
Eplant.Views.RootILsView.availableIconImageURL = "";
Eplant.Views.RootILsView.unavailableIconImageURL = "";


})();
