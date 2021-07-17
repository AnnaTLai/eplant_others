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
Eplant.Views.TomatoAtlasesView = function(geneticElement) {
	// Get constructor
	var constructor = Eplant.Views.TomatoAtlasesView;

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

	var efpSvgURL = 'data/experiment/efps/TomatoAtlases/' + geneticElement.species.scientificName.replace(" ", "_") + '.svg';
	var efpXmlURL = 'data/experiment/efps/TomatoAtlases/' + geneticElement.species.scientificName.replace(" ", "_") + '.xml';
	Eplant.BaseViews.EFPView.call(this, geneticElement, efpSvgURL,efpXmlURL, {
	});
};
ZUI.Util.inheritClass(Eplant.BaseViews.EFPView, Eplant.Views.TomatoAtlasesView);	// Inherit parent prototype

Eplant.Views.TomatoAtlasesView.viewName = "TomatoAtlasesView";
Eplant.Views.TomatoAtlasesView.displayName = "Tomato Atlases eFP";
Eplant.Views.TomatoAtlasesView.hierarchy = "genetic element";
Eplant.Views.TomatoAtlasesView.magnification = 35;
Eplant.Views.TomatoAtlasesView.description = "Tomato Atlases eFP";
Eplant.Views.TomatoAtlasesView.citation = "";
Eplant.Views.TomatoAtlasesView.activeIconImageURL = "";
Eplant.Views.TomatoAtlasesView.availableIconImageURL = "";
Eplant.Views.TomatoAtlasesView.unavailableIconImageURL = "";


})();
