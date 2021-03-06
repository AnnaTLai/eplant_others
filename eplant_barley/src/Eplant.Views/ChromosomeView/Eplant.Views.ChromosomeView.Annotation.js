(function() {
	
	/**
		* Eplant.Views.ChromosomeView.Annotation class
		* Coded by Hans Yu
		* UI designed by Jamie Waese
		*
		* @constructor
		* @param {Eplant.GeneticElement} geneticElement The GeneticElement associated with this Annotation.
		* @param {String} color The color of the Annotation.
		* @param {Number} size The size of the Annotation.
		* @param {Eplant.Views.ChromosomeView} chromosomeView The ChromosomeView that owns this Annotation.
	*/
	Eplant.Views.ChromosomeView.Annotation = function(geneticElement, color, size, chromosomeView, note) {
		/* Attributes */
		this.geneticElement = geneticElement;	// The GeneticElement associated with this Annotation
		this.note = note;
		this.color = color;
		this.size = size;
		this.chromosomeView = chromosomeView;	// The ChromosomeView that owns this Annotation
		this.whiskerVO = null;			// ViewObject for the whisker marking the position of the GeneticElement
		this.labelVO = null;				// ViewObject for the label of the GeneticElement
		this.tagVOs = [];				// Array of ViewObjects for GeneticElement tags
		this.updateAnnotationTagsEventListener = null;	// EventListener for update-annotationTags targeted at this GeneticElement
		
		/* Create ViewObjects */
		this.createVOs();
		
		/* Bind events */
		this.bindEvents();
	};
	
	/**
		* Creates ViewObjects of this Annotation.
	*/
	Eplant.Views.ChromosomeView.Annotation.prototype.createVOs = function() {
		/* Get ChromosomeView.Chromosome object */
		var chromosome = this.chromosomeView.getChromosome(this.geneticElement.chromosome);
		
		/* Whisker */
		this.whiskerVO = new ZUI.ViewObject({
			shape: "path",
			positionScale: "world",
			sizeScale: "world",
			x: chromosome.getX() + ((this.geneticElement.strand == "+") ? -1 : 1) * chromosome.getWidth() / 2,
			y: chromosome.getY() + (this.geneticElement.start + this.geneticElement.end) / 2 * chromosome.perBpHeight,
			vertices: [
				{
					x: 0,
					y: 0
				},
				{
					x: (this.geneticElement.strand == "+") ? 10 : -10,
					y: 0
				}
			],
			strokeColor: this.color,
			fillColor: this.color
		});
		
		/* Label */
		this.labelVO = new ZUI.ViewObject({
			shape: "text",
			positionScale: "world",
			sizeScale: "screen",
			x: chromosome.getX() + ((this.geneticElement.strand == "+") ? -1 : 1) * chromosome.getWidth() / 2,
			y: chromosome.getY() + (this.geneticElement.start + this.geneticElement.end) / 2 * chromosome.perBpHeight,
			size: this.size,
			offsetX: ((this.geneticElement.strand == "+") ? -1 : 1) * (this.size + 3),
			centerAt: ((this.geneticElement.strand == "+") ? "right" : "left") + " center",
			content: this.geneticElement.identifier+(this.note?("\n"+this.note):""),
			strokeColor: "#E6F9AF",
			stroke: false,
			strokeWidth: 5,
			fillColor: this.color,
			leftClick: $.proxy(function() {
				/* Pin element dialog */
				if (this.geneticElement.geneticElementDialog) {
					this.geneticElement.geneticElementDialog.pinned = true;
				}
				this.geneticElement.species.setActiveGeneticElement(this.geneticElement);
				this.geneticElementDialog = new Eplant.Views.ChromosomeView.GeneticElementDialog(this.geneticElement,this.chromosomeView);
				if (this.geneticElement && this.geneticElement.geneticElementDialog) {
					this.geneticElement.geneticElementDialog.close();
				}
			}, this),
			mouseOver: $.proxy(function() {				
				var annotation = this.chromosomeView.getAnnotation(this.geneticElement);
				var bold = this.geneticElement.identifier === this.geneticElement.species.activeGeneticElement.identifier;
				if (annotation&&!bold) {
					annotation.labelVO.bold = true;
				}
				var geneticElementDialog = new Eplant.GeneticElementDialog(this.geneticElement);
				this.geneticElement.geneticElementDialog = geneticElementDialog;
				
			}, this),
			mouseOut: $.proxy(function() {
				var annotation = this.chromosomeView.getAnnotation(this.geneticElement);
				var bold = this.geneticElement.identifier === this.geneticElement.species.activeGeneticElement.identifier;
				if (annotation&&!bold) {
					annotation.labelVO.bold = false;
				}
				if (this.geneticElement && this.geneticElement.geneticElementDialog) {
					this.geneticElement.geneticElementDialog.close();
				}
			}, this)
			
		});
		if(this.note){
			
			var notes = Eplant.wordWrap(this.note, 16);
			this.noteVO = new ZUI.ViewObject({
				shape: "multilinetext",
				positionScale: "world",
				sizeScale: "screen",
				size: this.size,
				x: chromosome.getX() + ((this.geneticElement.strand == "+") ? -1 : 1) * chromosome.getWidth() / 2,
				y: (this.size + 7)+chromosome.getY() + (this.geneticElement.start + this.geneticElement.end) / 2 * chromosome.perBpHeight,
				size: this.size,
				offsetX: ((this.geneticElement.strand == "+") ? -1 : 1) * (this.size + 3),
				centerAt: ((this.geneticElement.strand == "+") ? "right" : "left") + " top",
				content: notes.join("\n"),
				strokeColor: "#E6F9AF",
				stroke: false,
				strokeWidth: 5,
				fillColor: this.color,
				leftClick: $.proxy(function() {
					
				}, this)
				
			});
		}
		
		this.chromosomeView.viewObjects.push(this.labelVO);
		
		/* Tags */
		this.updateTags();
	};
	
	
	/**
		* Binds events.
	*/
	Eplant.Views.ChromosomeView.Annotation.prototype.bindEvents = function() {
		/* update-annotationTags */
		this.updateAnnotationTagsEventListener = new ZUI.EventListener("update-annotationTags", this.geneticElement, function(event, eventData, listenerData) {
			/* Get ChromosomeView Annotation object */
			var annotation = listenerData.annotation;
			
			/* Update tags */
			annotation.updateTags();
			}, {
			annotation: this
		});
		ZUI.addEventListener(this.updateAnnotationTagsEventListener);
		
		/* update-activeGeneticElement */
		this.updateActiveGeneticElementListener = new ZUI.EventListener("update-activeGeneticElement", this.chromosomeView.species, function(event, eventData, listenerData) {
			/* Get ChromosomeView Annotation object */
			var annotation = listenerData.annotation;
			
			/* Update tags */
			annotation.updateTags();
			}, {
			annotation: this
		});
		ZUI.addEventListener(this.updateActiveGeneticElementListener);
	};
	
	/**
		* Recreates tag ViewObjects.
	*/
	Eplant.Views.ChromosomeView.Annotation.prototype.updateTags = function() {
		/* Remove old tags */
		for (var n = 0; n < this.tagVOs.length; n++) {
			var tagVO = this.tagVOs[n];
			tagVO.remove();
		}
		this.tagVOs = [];
		
		/* Create new tags */
		var offset = 5;
		for (var n = 0; n < this.geneticElement.annotationTags.length; n++) {
			/* Get AnnotationTag */
			var annotationTag = this.geneticElement.annotationTags[n];
			
			/* Pass if AnnotationTag is not selected */
			if (!annotationTag.isSelected) {
				continue;
			}
			
			/* Create tag */
			var tagVO = new ZUI.ViewObject({
				shape: "circle",
				positionScale: "world",
				sizeScale: "screen",
				x: this.labelVO.x,
				y: this.labelVO.y,
				offsetX: this.labelVO.offsetX + ((this.geneticElement.strand == "+") ? -1 : 1) * (this.labelVO.width + offset),
				radius: 3,
				centerAt: "center center",
				strokeColor: annotationTag.color,
				fillColor: annotationTag.color
			});
			this.tagVOs.push(tagVO);
			
			/* Increase offset */
			offset += 8;
		}
	};
	
	/**
		* Updates the Annotation after changing color or size.
	*/
	Eplant.Views.ChromosomeView.Annotation.prototype.update = function() {
		/* Update size */
		this.labelVO.offsetX = ((this.geneticElement.strand == "+") ? -1 : 1) * (this.size + 3);
		this.labelVO.size = this.size;
		
		if(this.note){
			var chromosome = this.chromosomeView.getChromosome(this.geneticElement.chromosome);
			
			
			var notes = Eplant.wordWrap(this.note, 16);
			this.noteVO = new ZUI.ViewObject({
				shape: "multilinetext",
				positionScale: "world",
				sizeScale: "screen",
				size: this.size,
				x: chromosome.getX() + ((this.geneticElement.strand == "+") ? -1 : 1) * chromosome.getWidth() / 2,
				y: (this.size + 7)+ chromosome.getY() + (this.geneticElement.start + this.geneticElement.end) / 2 * chromosome.perBpHeight,
				size: this.size,
				offsetX: ((this.geneticElement.strand == "+") ? -1 : 1) * (this.size + 3),
				centerAt: ((this.geneticElement.strand == "+") ? "right" : "left") + " top",
				content: notes.join("\n"),
				strokeColor: "#E6F9AF",
				stroke: false,
				strokeWidth: 5,
				fillColor: this.color,
				leftClick: $.proxy(function() {
					
				}, this)
			});
		}
		
		/* Update color */
		this.whiskerVO.strokeColor = this.color;
		this.whiskerVO.fillColor = this.color;
		this.labelVO.fillColor = this.color;
	};
	
	/**
		* Draws the Annotation.
	*/
	Eplant.Views.ChromosomeView.Annotation.prototype.draw = function() {
		/* Get Chromosome */
		var chromosome = this.chromosomeView.getChromosome(this.geneticElement.chromosome);
		
		/* Update whisker */
		this.whiskerVO.vertices[0].x = ((this.geneticElement.strand == "+") ? -1 : 1) * ZUI.camera.unprojectDistance(this.size);
		this.whiskerVO.strokeWidth = (this.geneticElement.end - this.geneticElement.start) * chromosome.perBpHeight;
		var unitWidth = ZUI.camera.unprojectDistance(1);
		if (this.whiskerVO.strokeWidth < unitWidth) {
			this.whiskerVO.strokeWidth = unitWidth;
		}
		
		/* Draw whisker */
		this.whiskerVO.draw();
		
		/* Draw label */
		this.labelVO.draw();
		if(this.noteVO){
			this.noteVO.draw();
		}
		/* Draw tags */
		var offset = 5;
		for (var n = 0; n < this.tagVOs.length; n++) {
			/* Get tag ViewObject */
			var tagVO = this.tagVOs[n];
			
			/* Update x-offset */
			tagVO.offsetX = this.labelVO.offsetX + ((this.geneticElement.strand == "+") ? -1 : 1) * (this.labelVO.width + offset);
			offset += 8;
			
			/* Draw */
			tagVO.draw();
		}
	};
	
	/**
		* Cleans up this Annotation object.
	*/
	Eplant.Views.ChromosomeView.Annotation.prototype.remove = function() {
		/* Clean up ViewObjects */
		this.whiskerVO.remove();
		this.labelVO.remove();
		if(this.noteVO){
			this.noteVO.remove();
		}
		for (var n = 0; n < this.tagVOs.length; n++) {
			var tagVO = this.tagVOs[n];
			tagVO.remove();
		}
		
		/* Remove event listeners */
		ZUI.removeEventListener(this.updateAnnotationTagsEventListener);
		
		/* Remove label from ViewObjects array */
		var index = this.chromosomeView.viewObjects.indexOf(this.labelVO);
		if (index >= 0) {
			this.chromosomeView.viewObjects.splice(index, 1);
		}
	};
	
})();