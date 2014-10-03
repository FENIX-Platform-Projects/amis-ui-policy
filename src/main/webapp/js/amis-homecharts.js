$(document).ready(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////GRAFICO 1	
			
				$('#grafico1').highcharts({
				
				//MTY ¨
				
				chart : {
					type: 'column',  //Tipo di grafico:  area, areaspline, boxplot, bubble, column, line, pie, scatter, spline
					alignTicks: false,
					backgroundColor: 'rgba(255, 255, 255, 0)', //Colore di background
				
					spacing: [10,40,30,0],//Spacing intorno (molto simile al margin - Di default il bottom  15, qui l'ho messo a 10 per essere uguale agli altri)
										plotBorderColor: '#FFFFFF', //Colore bordo intorno solo area chart
					plotBorderWidth: 1, //Spessore bordo intorno solo area chart
					style: {
						fontFamily: 'Open Sans Condensed', // Font di tutto
						fontSize: '10px', // La dimensione qui vale solo per i titoli
						color: '#333333'
					},
					resetZoomButton: {
						position: {
							align: 'right', //Allineamento zoom orizzontale
							x: -10, //Posizione del pulsante rispetto all'allineamento (valori positivi > destra) e al PLOT
							
						},
						theme: {
							fill: '#FFFFFF', //Colore di background pulsante reset zoom
							stroke: '#666666', //Colore di stroke pulsante reset zoom
							width: 60, //Larghezza del pulsante reset 
							style: {
								textAlign : 'center', //CSS style aggiunto da me per centrare il testo
								fontSize: 10
							},	
							states: {
								hover: {
										fill: '#e6e6e6', //Colore di background hover pulsante reset zoom
										stroke: '#666666',	//Colore di stroke hover pulsante reset zoom
									style: {
										//color: 'white' //Colore testo hover pulsante reset zoom
									}
								}
							}
						}
							
					}
				},
				colors: [ //Colori delle charts
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999'
				],
				tooltip : {
					enabled: true,
					positioner: function () {
						return { x: 20, y: 10 };
						},
					useHTML: true,
					headerFormat: '',
					shadow: false,
					borderWidth: 0,
					backgroundColor: 'rgba(255,255,255,1)'	
				},
				credits : {
					enabled: false //Attiva o disattiva il link di HighCharts dalla chart
				},
				exporting : {
					enabled: false,
					buttons: {
						contextButton: { //Modifica lo stile del bottone dell'esportazione (principalmente il simbolo al suo internp)
							enabled: true,// Attivazione Bottone esportazione
							symbolStroke: '#666666', //	Colore stroke del simbolo
							symbolStrokeWidth: 1//	Stroke del simbolo	 					
						}
					}	
				},
				navigation: { //Modifica lo stile dei bottoni e spesso del solo bottone dell'esportazione (lo sfondo)
		            buttonOptions: {
		                theme: {
		                    'stroke-width': 1, // Peso stroke del bottone
		                    stroke: '#666666', // Colore stroke del bottone
		                    r: 0, // Smusso stroke del bottone,
		                    states: {
		                        hover: {
		                        	stroke: '#666666', // Press stroke del bottone
		                            fill: '#e6e6e6' // Rollover del bottone
		                        },
		                        select: {
		                            stroke: '#666666', // Press stroke del bottone
		                            fill: '#e6e6e6' // Press Fill del bottone
		                        }
		                    }
		                }
		            }
	            },
	            legend: { //Modifica style della legenda
	            	enabled: false, //Attiva la legenda
	            },
	            plotOptions : {
		            series: {
			            allowPointSelect: true, //Permette di selezionare i punti della chart
			             animation: { // Configura l'animazione di entrata
		                    duration: 1000,
		                    easing: 'swing'
		                },
		                connectNulls: true,
		                cropThreshold:3,
		                lineWidth: 2,// IMPORTANTE - Cambia lo spessore delle linee della chart
		                states: {
			            	hover: {
				            	lineWidth: 3
			            	}  	  
		                },
		                fillColor: {
		                    linearGradient: [0, 0, 0, 350],
		                    stops: [
		                        [0, 'rgba(63, 165, 216,0.5)'],
		                        [1, 'rgba(255,255,255,0)']
		                    ]
		                },
		                marker: {
		                	enabled: false, //Attiva o disattiva i marker
			                //symbol: 'url(http://www.mentaltoy.com/resources/logoChart.png)', //Questo paramentro carica un simbolo personalizzato. Si pu˜ anche avere una chart con marker diverse sulle linee
			                symbol: 'circle', // Tipologia di marker
			                radius: 3,
			                states: {
				                hover : {
					                enabled: true,	// Attiva o disattiva il marker quando si passa sopra la chart
					                symbol: 'circle',
					                fillColor: '#FFFFFF',
					                lineColor: '#3ca7da',
					                radius: 8,
					                lineWidth: 3
				                }
			                }
		                },		                
		            }
	            },				
				//END
				
				
				
				            
	            title: {
	                enabled: false,
	                text: null,
	                x: -20 //center
	            },
	            subtitle: {
	                text: null,
	                x: -20
	            },
	            xAxis: {
	                categories: ['2010', '2011', '2012', '2013'],
	                gridLineWidth: 0, // IMPORTANTE - Attiva le linee verticali
	                lineColor : '#333333',
	                tickColor : '#FFFFFF',
	                labels: {
		            	style: {
			            	color: '#2A5D9F'
		            	}
	            	},	           
	             },
	            yAxis: {
	            	labels: {
		            	style: {
			            	color: '#2A5D9F'
		            	}
	            	},
	                title: {
	                	enabled: false,
	                    text: 'Number of countries',
	                    style: {
		                    color: '#2A5D9F',
		                    fontSize: 10
	                    }
	                },
	                plotLines: [{
	                    value: 0,
	                    width: 0,
	                }]
	            },
	            series: [{
	                name: 'Number of Countries',
	                data: [9, 11, 14, 16]
	  	            }]
	        });
			
		

			
/////////////////////////////////////////////////////////////////////////////////////////////////////////GRAFICO 2			
			
$('#grafico2').highcharts({
				
				//MTY ¨
				
				chart : {
					type: 'column',  //Tipo di grafico:  area, areaspline, boxplot, bubble, column, line, pie, scatter, spline
					alignTicks: false,
					backgroundColor: 'rgba(255, 255, 255, 0)', //Colore di background
				
					spacing: [10,40,30,0],//Spacing intorno (molto simile al margin - Di default il bottom  15, qui l'ho messo a 10 per essere uguale agli altri)
										plotBorderColor: '#FFFFFF', //Colore bordo intorno solo area chart
					plotBorderWidth: 1, //Spessore bordo intorno solo area chart
					style: {
						fontFamily: 'Open Sans Condensed', // Font di tutto
						fontSize: '10px', // La dimensione qui vale solo per i titoli
						color: '#333333'
					},
					resetZoomButton: {
						position: {
							align: 'right', //Allineamento zoom orizzontale
							x: -10, //Posizione del pulsante rispetto all'allineamento (valori positivi > destra) e al PLOT
							
						},
						theme: {
							fill: '#FFFFFF', //Colore di background pulsante reset zoom
							stroke: '#666666', //Colore di stroke pulsante reset zoom
							width: 60, //Larghezza del pulsante reset 
							style: {
								textAlign : 'center', //CSS style aggiunto da me per centrare il testo
								fontSize: 10
							},	
							states: {
								hover: {
										fill: '#e6e6e6', //Colore di background hover pulsante reset zoom
										stroke: '#666666',	//Colore di stroke hover pulsante reset zoom
									style: {
										//color: 'white' //Colore testo hover pulsante reset zoom
									}
								}
							}
						}
							
					}
				},
				colors: [ //Colori delle charts
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999'
				],
				tooltip : {
					enabled: true,
					positioner: function () {
						return { x: 20, y: 10 };
						},
					useHTML: true,
					headerFormat: '',
					shadow: false,
					borderWidth: 0,
					backgroundColor: 'rgba(255,255,255,1)'	
				},
				credits : {
					enabled: false //Attiva o disattiva il link di HighCharts dalla chart
				},
				exporting : {
					enabled: false,
					buttons: {
						contextButton: { //Modifica lo stile del bottone dell'esportazione (principalmente il simbolo al suo internp)
							enabled: true,// Attivazione Bottone esportazione
							symbolStroke: '#666666', //	Colore stroke del simbolo
							symbolStrokeWidth: 1//	Stroke del simbolo	 					
						}
					}	
				},
				navigation: { //Modifica lo stile dei bottoni e spesso del solo bottone dell'esportazione (lo sfondo)
		            buttonOptions: {
		                theme: {
		                    'stroke-width': 1, // Peso stroke del bottone
		                    stroke: '#666666', // Colore stroke del bottone
		                    r: 0, // Smusso stroke del bottone,
		                    states: {
		                        hover: {
		                        	stroke: '#666666', // Press stroke del bottone
		                            fill: '#e6e6e6' // Rollover del bottone
		                        },
		                        select: {
		                            stroke: '#666666', // Press stroke del bottone
		                            fill: '#e6e6e6' // Press Fill del bottone
		                        }
		                    }
		                }
		            }
	            },
	            legend: { //Modifica style della legenda
	            	enabled: false, //Attiva la legenda
	            },
	            plotOptions : {
		            series: {
			            allowPointSelect: true, //Permette di selezionare i punti della chart
			             animation: { // Configura l'animazione di entrata
		                    duration: 1000,
		                    easing: 'swing'
		                },
		                connectNulls: true,
		                cropThreshold:3,
		                lineWidth: 2,// IMPORTANTE - Cambia lo spessore delle linee della chart
		                states: {
			            	hover: {
				            	lineWidth: 3
			            	}  	  
		                },
		                fillColor: {
		                    linearGradient: [0, 0, 0, 350],
		                    stops: [
		                        [0, 'rgba(63, 165, 216,0.5)'],
		                        [1, 'rgba(255,255,255,0)']
		                    ]
		                },
		                marker: {
		                	enabled: false, //Attiva o disattiva i marker
			                //symbol: 'url(http://www.mentaltoy.com/resources/logoChart.png)', //Questo paramentro carica un simbolo personalizzato. Si pu˜ anche avere una chart con marker diverse sulle linee
			                symbol: 'circle', // Tipologia di marker
			                radius: 3,
			                states: {
				                hover : {
					                enabled: true,	// Attiva o disattiva il marker quando si passa sopra la chart
					                symbol: 'circle',
					                fillColor: '#FFFFFF',
					                lineColor: '#3ca7da',
					                radius: 8,
					                lineWidth: 3
				                }
			                }
		                },		                
		            }
	            },				
				//END
				
				
				
				            
	            title: {
	                enabled: false,
	                text: null,
	                x: -20 //center
	            },
	            subtitle: {
	                text: null,
	                x: -20
	            },
	            xAxis: {
	                categories: [/*'2000','2001','2002','2003','2004','2005',*/'2006','2007','2008','2009','2010'],
	                gridLineWidth: 0, // IMPORTANTE - Attiva le linee verticali
	                lineColor : '#333333',
	                tickColor : '#FFFFFF',
	                labels: {
		            	style: {
			            	color: '#2A5D9F',
			            	fontSize: 10
		            	}
	            	},	           
	             },
	            yAxis: {
	            	labels: {
		            	style: {
			            	color: '#2A5D9F'
		            	}
	            	},
	                title: {
	                	enabled: false,
	                    text: 'Number of countries',
	                    style: {
		                    color: '#2A5D9F',
		                    fontSize: 10
	                    }
	                },
	                plotLines: [{
	                    value: 0,
	                    width: 0,
	                }]
	            },
	            series: [{
	                name: 'Number of Countries',
	                data: [/*8,7,7,7,7,7,*/7,7,6,6,6]
	  	            }]
	        });
	        
/////////////////////////////////////////////////////////////////////////////////////////////////////////GRAFICO 3			
			
$('#grafico3').highcharts({
				
				//MTY ¨
				
				chart : {
					type: 'column',  //Tipo di grafico:  area, areaspline, boxplot, bubble, column, line, pie, scatter, spline
					alignTicks: false,
					backgroundColor: 'rgba(255, 255, 255, 0)', //Colore di background
				
					spacing: [10,40,30,0],//Spacing intorno (molto simile al margin - Di default il bottom  15, qui l'ho messo a 10 per essere uguale agli altri)
										plotBorderColor: '#FFFFFF', //Colore bordo intorno solo area chart
					plotBorderWidth: 1, //Spessore bordo intorno solo area chart
					style: {
						fontFamily: 'Open Sans Condensed', // Font di tutto
						fontSize: '10px', // La dimensione qui vale solo per i titoli
						color: '#333333'
					},
					resetZoomButton: {
						position: {
							align: 'right', //Allineamento zoom orizzontale
							x: -10, //Posizione del pulsante rispetto all'allineamento (valori positivi > destra) e al PLOT
							
						},
						theme: {
							fill: '#FFFFFF', //Colore di background pulsante reset zoom
							stroke: '#666666', //Colore di stroke pulsante reset zoom
							width: 60, //Larghezza del pulsante reset 
							style: {
								textAlign : 'center', //CSS style aggiunto da me per centrare il testo
								fontSize: 10
							},	
							states: {
								hover: {
										fill: '#e6e6e6', //Colore di background hover pulsante reset zoom
										stroke: '#666666',	//Colore di stroke hover pulsante reset zoom
									style: {
										//color: 'white' //Colore testo hover pulsante reset zoom
									}
								}
							}
						}
							
					}
				},
				colors: [ //Colori delle charts
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999', 
				   '#999999'
				],
				tooltip : {
					enabled: true,
					positioner: function () {
						return { x: 20, y: 10 };
						},
					useHTML: true,
					headerFormat: '',
					shadow: false,
					borderWidth: 0,
					backgroundColor: 'rgba(255,255,255,1)'	
				},
				credits : {
					enabled: false //Attiva o disattiva il link di HighCharts dalla chart
				},
				exporting : {
					enabled: false,
					buttons: {
						contextButton: { //Modifica lo stile del bottone dell'esportazione (principalmente il simbolo al suo internp)
							enabled: true,// Attivazione Bottone esportazione
							symbolStroke: '#666666', //	Colore stroke del simbolo
							symbolStrokeWidth: 1//	Stroke del simbolo	 					
						}
					}	
				},
				navigation: { //Modifica lo stile dei bottoni e spesso del solo bottone dell'esportazione (lo sfondo)
		            buttonOptions: {
		                theme: {
		                    'stroke-width': 1, // Peso stroke del bottone
		                    stroke: '#666666', // Colore stroke del bottone
		                    r: 0, // Smusso stroke del bottone,
		                    states: {
		                        hover: {
		                        	stroke: '#666666', // Press stroke del bottone
		                            fill: '#e6e6e6' // Rollover del bottone
		                        },
		                        select: {
		                            stroke: '#666666', // Press stroke del bottone
		                            fill: '#e6e6e6' // Press Fill del bottone
		                        }
		                    }
		                }
		            }
	            },
	            legend: { //Modifica style della legenda
	            	enabled: false, //Attiva la legenda
	            },
	            plotOptions : {
		            series: {
			            allowPointSelect: true, //Permette di selezionare i punti della chart
			             animation: { // Configura l'animazione di entrata
		                    duration: 1000,
		                    easing: 'swing'
		                },
		                connectNulls: true,
		                cropThreshold:3,
		                lineWidth: 2,// IMPORTANTE - Cambia lo spessore delle linee della chart
		                states: {
			            	hover: {
				            	lineWidth: 3
			            	}  	  
		                },
		                fillColor: {
		                    linearGradient: [0, 0, 0, 350],
		                    stops: [
		                        [0, 'rgba(63, 165, 216,0.5)'],
		                        [1, 'rgba(255,255,255,0)']
		                    ]
		                },
		                marker: {
		                	enabled: false, //Attiva o disattiva i marker
			                //symbol: 'url(http://www.mentaltoy.com/resources/logoChart.png)', //Questo paramentro carica un simbolo personalizzato. Si pu˜ anche avere una chart con marker diverse sulle linee
			                symbol: 'circle', // Tipologia di marker
			                radius: 3,
			                states: {
				                hover : {
					                enabled: true,	// Attiva o disattiva il marker quando si passa sopra la chart
					                symbol: 'circle',
					                fillColor: '#FFFFFF',
					                lineColor: '#3ca7da',
					                radius: 8,
					                lineWidth: 3
				                }
			                }
		                },		                
		            }
	            },				
				//END
				
				
				
				            
	            title: {
	                enabled: false,
	                text: null,
	                x: -20 //center
	            },
	            subtitle: {
	                text: null,
	                x: -20
	            },
	            xAxis: {
	                categories: [/*'1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005',*/'2006','2007','2008','2009','2010'],
	                gridLineWidth: 0, // IMPORTANTE - Attiva le linee verticali
	                lineColor : '#333333',
	                tickColor : '#FFFFFF',
	                labels: {
		            	style: {
			            	color: '#2A5D9F'
		            	}
	            	},	           
	             },
	            yAxis: {
	            	labels: {
		            	style: {
			            	color: '#2A5D9F'
		            	}
	            	},
	                title: {
	                	enabled: false,
	                    text: 'Number of countries',
	                    style: {
		                    color: '#2A5D9F',
		                    fontSize: 10
	                    }
	                },
	                plotLines: [{
	                    value: 0,
	                    width: 0,
	                }]
	            },
	            series: [{
	                name: 'Number of Countries',
	                data: [/*9,8,8,8,8,8,7,8,8,9,8,*/8,8,8,8,7]
	  	            }]
	        });
	  
			
		
});
