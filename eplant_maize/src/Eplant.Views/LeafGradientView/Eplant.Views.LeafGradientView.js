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
	Eplant.Views.LeafGradientView = function(geneticElement) {
		// Get constructor
		var constructor = Eplant.Views.LeafGradientView;

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
		var efpSvgURL = 'data/experiment/efps/LeafGradient/' + geneticElement.species.scientificName.replace(" ", "_") + '.svg';
		var efpXmlURL = 'data/experiment/efps/LeafGradient/' + geneticElement.species.scientificName.replace(" ", "_") + '.xml';
		Eplant.BaseViews.EFPView.call(this, geneticElement, efpSvgURL,efpXmlURL, {
		});

	};
	ZUI.Util.inheritClass(Eplant.BaseViews.EFPView, Eplant.Views.LeafGradientView);	// Inherit parent prototype

Eplant.Views.LeafGradientView.viewName = "LeafGradientView";
	Eplant.Views.LeafGradientView.displayName = "Leaf Gradient eFP";
	Eplant.Views.LeafGradientView.hierarchy = "genetic element";
	Eplant.Views.LeafGradientView.magnification = 35;
	Eplant.Views.LeafGradientView.description = "LeafGradient eFP";
	Eplant.Views.LeafGradientView.citation = "";
	Eplant.Views.LeafGradientView.activeIconImageURL = "";
	Eplant.Views.LeafGradientView.availableIconImageURL = "";
	Eplant.Views.LeafGradientView.unavailableIconImageURL = "";

})();
