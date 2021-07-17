(function() {

/**
 * Eplant.Views.WorldLeafView class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * ePlant View for browsing gene expression data of plant tissues during development as eFP.
 *
 * @constructor
 * @augments Eplant.BaseViews.EFPView
 * @param {Eplant.GeneticElement} geneticElement The GeneticElement associated with this view.
 */
Eplant.Views.WorldLeafView = function(geneticElement) {
	// Get constructor
	var constructor = Eplant.Views.WorldLeafView;

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
	var efpSvgURL = 'data/worldLeaf/' + geneticElement.species.scientificName.replace(" ", "_") + '.svg';
	var efpXmlURL = 'data/worldLeaf/' + geneticElement.species.scientificName.replace(" ", "_") + '.xml';
	Eplant.BaseViews.EFPView.call(this, geneticElement, efpSvgURL,efpXmlURL, {
	});
};
ZUI.Util.inheritClass(Eplant.BaseViews.EFPView, Eplant.Views.WorldLeafView);	// Inherit parent prototype

Eplant.Views.WorldLeafView.viewName = "WorldLeafView";
Eplant.Views.WorldLeafView.displayName = "World Leaf eFP (RNA-Seq Data)";
Eplant.Views.WorldLeafView.hierarchy = "genetic element";
Eplant.Views.WorldLeafView.magnification = 10;
Eplant.Views.WorldLeafView.description = "World Leaf eFP";
Eplant.Views.WorldLeafView.citation = "";
Eplant.Views.WorldLeafView.activeIconImageURL = "img/active/world.png";
Eplant.Views.WorldLeafView.availableIconImageURL = "img/available/world.png";
Eplant.Views.WorldLeafView.unavailableIconImageURL = "img/unavailable/world.png";

})();
