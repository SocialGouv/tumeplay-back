// AUTH
// [OK] BOXS
// [OK] CONTENTS
// ORDER
// [OK] POI
// [OK] PRODUCTS
// [OK] QUIZZS
// SHIPPING-MODE
// [OK] THEMATIQUES
// [OK] USER
// [OK] FEEDBACK
export default {
	openapi: '3.0.1',
	info: {
		version: '1.0.0',
		title: 'Tumeplay - API',    
	},
	components: {
		schemas: {
			genericId: {
				type: 'integer',
				description: 'Component identification number',
			},
			genericTitle: {
				type: 'string',
				description: 'Component title',
			},
			genericShortTitle: {
				type: 'string',
				description: 'Component short title',
			},
			genericDescription: {
				type: 'string',
				description: 'Component description',
			},
			genericShortDescription: {
				type: 'string',
				description: 'Component short description',
			},
			genericIsActive: {
				type: 'boolean', 
				description: 'Component is active / orderable',
			},
			genericPicture: {
				type: 'object',
				properties: {
					id: {
            			$ref: '#/components/schemas/genericId'
					},
					path: {
						type: 'string',
						description: 'Web path of the picture'
					},
					filename: {
						type: 'string',
						description: 'Filename.'
					}
				}
			},
			genericPlainPicture: {
				type: 'string',
				description: 'Full web path of picture',
			},
			PoiTimeTableDay: {
				type: 'object',
				properties: {
					am: {
						type: 'string',
					},
					pm: {
						type: 'string',
					}
				}
			},
			Poi: {
				type: 'object',
				properties: {
					id: {
            			$ref: '#/components/schemas/genericId'
					},
					key: {
            			$ref: '#/components/schemas/genericId'
					},
					name: {
						$ref: '#/components/schemas/genericTitle'	
					},
					description: {
						$ref: '#/components/schemas/genericDescription'	
					},
					zipCode: {
						type: 'string',
						description: 'POI zipcode.',
					},
					street: {
						type: 'string',
						description: 'POI street',
					},
					city: {
						type: 'string',
						description: 'POI City',
					},
					horaires: {
						type: 'object',
						properties: {
							lundi: {
								$ref: '#/components/schemas/PoiTimeTableDay',
							},
							mardi: {
								$ref: '#/components/schemas/PoiTimeTableDay',
							},
							mercredi: {
								$ref: '#/components/schemas/PoiTimeTableDay',
							},
							jeudi: {
								$ref: '#/components/schemas/PoiTimeTableDay',
							},
							vendredi: {
								$ref: '#/components/schemas/PoiTimeTableDay',
							},
							samedi: {
								$ref: '#/components/schemas/PoiTimeTableDay',
							},
							dimanche: {
								$ref: '#/components/schemas/PoiTimeTableDay',
							}
						}
					},
					coordinates: {
						type: 'object',
						properties: {
							latitude: {
								type: 'number',
							},
							longitude: {
								type: 'number',
							}
						}
					},
					distance: {
						type: 'number',
						description: 'POI distance from given lat / long'
					}
					
					
				}
			},
			Pois: {
				type: 'array',
				items: {
					$ref: '#/components/schemas/Poi',
				}
			},
			QuizzQuestionAnswer: {
				type: 'object',
				properties: {
					id:{
            			$ref: '#/components/schemas/genericId'
					},
					text: {
						type: 'string',
						description: 'Answer text'
					} 	
				}
			},
			QuizzQuestion: {
				type: 'object',
				properties: {
					id: {
            			$ref: '#/components/schemas/genericId'
					},
					key: {
            			$ref: '#/components/schemas/genericId'
					},
					question: {
						type: 'string',
						description: 'Question content',
					},
					explanation: {
						type: 'string',
						description: 'Question answer explanation',
					},
					theme: {
						type: 'integer',
						description: "Question's theme ID.",
					},
					category: {
						type: 'integer',
						description: "Question's category ID.",
					},
					background: {
						$ref: '#/components/schemas/genericPlainPicture',
					},
					answers: {
						type: 'array',
						items: {
							$ref: '#/components/schemas/QuizzQuestionAnswer',
						}
					},
					rightAnswer: {
						type: 'integer',
						description: 'Right Answer ID',
					},
					neutralAnswer: {
						type: 'integer',
						description: 'Neutral Answer ID',
					}
				}
			},
			QuizzQuestions: {
				type: 'array',
				items: {
					$ref: '#/components/schemas/QuizzQuestion',
				}
			},
			Content: {
				type: 'object',
				properties: {
					id: {
            			$ref: '#/components/schemas/genericId'
					},
					key: {
            			$ref: '#/components/schemas/genericId'
					}, 
					numberOfLines: {
						type: 'integer',
						description: 'Number of lines to display on front - used in "Show More"',
					},
					theme: {
						type: 'integer',
						description: "Content's theme ID.",
					},
					category: {
						type: 'integer',
						description: "Content's category ID.",
					},
					picture:{
						$ref: '#/components/schemas/genericPlainPicture'	
					},
					title: {
						$ref: '#/components/schemas/genericId'	
					},
					text: {
						$ref: '#/components/schemas/genericDescription'	
					},
					link: {
						type: 'string',
						description: 'Target link of content. Used in "Show more" system.'	
					}
				}
			},
			Thematique: {
				type: 'object',
				properties: {
					id: {
            			$ref: '#/components/schemas/genericId'
					},
					key: {
            			$ref: '#/components/schemas/genericId'
					}, 
					isSpecial: {
						type: 'boolean',
						description: 'Used to know if thematique should have top menu or not.'
					},
					picture: {
						$ref: '#/components/schemas/genericPlainPicture'
					},
					value: {
						$ref: '#/components/schemas/genericTitle'	
					}
				}
			},
			Thematiques: {
				type: 'array',
				items: {
					$ref: '#/components/schemas/Thematique'	
				}
			},
			Contents: {
				type: 'array',
				items: {
					$ref: '#/components/schemas/Content'	
				}
			},
			LightProduct: {
				type: 'object',
				properties: {
					title: {
						$ref: '#/components/schemas/genericTitle'
					},
					shortTitle: {
						$ref: '#/components/schemas/genericShortTitle'
					},
					qty: {
						type: 'integer',
						description: 'Product quantity in current box.',
					}
				}
			},
			Product: {
				type: 'object',
				properties: {
					id: {
            			$ref: '#/components/schemas/genericId'
					},
					title: {
            			$ref: '#/components/schemas/genericTitle'
					},
					description: {
            			$ref: '#/components/schemas/genericDescription'
					},
					shortDescription: {
            			$ref: '#/components/schemas/genericShortDescription'
					},
					qty: {
            			type: 'integer',
						description: 'Product quantity in current pack.',
					},
					defaultQty: {
            			type: 'integer',
						description: 'Product default quantity in current pack.',
					},
					active: {
						$ref: '#/components/schemas/genericIsActive'
					},
					pictureId: {
						type: 'integer',
						description: 'Product picture identification number',
					},
					isOrderable: {
						$ref: '#/components/schemas/genericIsActive'
					},
					picture: {
						$ref: '#/components/schemas/genericPicture'
					}
					
				}
			},     
			Box: {
				type: 'object',
				properties: {
					id: {
            			$ref: '#/components/schemas/genericId'
					},
					key: {
            			$ref: '#/components/schemas/genericId'
					}, 
					title: {
            			$ref: '#/components/schemas/genericTitle'
					},
					description: {
            			$ref: '#/components/schemas/genericDescription'
					},
					available: {
            			$ref: '#/components/schemas/genericIsActive'
					},
					price: {
            			type: 'integer',
            			description: 'Box price (in tokens)'
					},
					products: {
						type: 'array',
						items: {
							$ref: '#/components/schemas/LightProduct',
						}
					},
					picture: {
						$ref: '#/components/schemas/genericPlainPicture'
					}
				}
			},
			BoxesAndProducts: {
				type: 'object',
				properties: {
					boxs: {
						type: 'array',
						items: {
							$ref: '#/components/schemas/Box'
						}
					},
					products: {
						type: 'array',
						items: {
							$ref: '#/components/schemas/Product'
						}
					}
				}
			},
			UserAddress: {
				type: 'object', 
				properties: {
					lastName: {
						type: 'string',
						description: 'User name',
					},	
					firstName: {
						type: 'string',
						description: 'User first name',
					},
					emailAdress: {
						type: 'string',
						description: 'User email address',
					},
					zipCode: {
						type: 'string',
						description: 'User zipcode',
					},
					city: {
						type: 'string',
						description: 'User city',
					},
					adress: {
						type: 'string',
						description: 'User address',
					},
					phoneNumber: {
						type: 'string',
						description: 'User phone number',
					},
				}
			},
			FeedbackQuestion: {
				type: 'object',
				properties: {
					id: {
						$ref: '#/components/schemas/genericId'
					},
					question: {
						type: 'integer',
						description: 'Question content',
					},
					isLiked: {
						type: 'string',
						description: 'feedback isLiked',
					},
					isDisliked: {
						type: 'string',
						description: 'feedback isDisliked',
					},
					comment: {
						type: 'string',
						description: 'feedback comment',
					},
					feedback: {
						type: 'integer',
						description: "Question's feedback ID.",
					},
				}
			},
			securitySchemes: {
				ApiKeyAuth: {
					type: 'apiKey',
					in: 'header',
					name: 'x-api-key'
				}
			}
		}
	},
	paths: {
		'/boxs': {
			get: {
				description: "Get all boxs and products associated with default values",
				responses: {
					'200': {
						description: "Boxes were obtained",
						content: {
							'application/json': {
								schema: {
									$ref: '#components/schemas/BoxesAndProducts'
								}
							}
						}
					}
				}
			}
		},
		'/contents': {
			get: {
				description: "Get all contents with default values",
				responses: {
					'200': {
						description: "Contents were obtained",
						content: {
							'application/json': {
								schema: {
									$ref: '#components/schemas/Contents'	
								}	
							}
						}
					}
				}
			}
		},
		'/quizzs': {
			get: {
				description: 'Get all quizs questions with their answers',
				responses: {
					'200': {
						description: 'Quizs and questoins were obtained',
						content: {
							'application/json': {
								schema: {
									$ref: '#components/schemas/QuizzQuestions',
								}
							}
						}
					}
				}
			}
		},
		'/thematiques': {
			get: {
				description: 'Get all thematiques ( main screen items )',
				responses: {
					'200': {
						description: 'Thematiques were obtained',
						content: {
							'application/json': {
								schema: {
									$ref: '#components/schemas/Thematiques',	
								}
							}
						}
					}
				}
			}
		},
		'/poi/pickup/{latitude}/{longitude}': {
			get: {
				description: "Get all Pickup POI around given latitude and longitude",
				parameters: [
					{
				    	name: 'latitude',
				    	in: 'path',
				        schema: {
				        	type: 'float',
				        	description: 'Searched latitude'
						},
					},  
					{
						name: 'longitude',
				    	in: 'path',
				        schema: {
				        	type: 'float',
				        	description: 'Searched latitude'
						},
					}
				],  
				responses: {
					'200': {
						description: 'POIs were obtained',
						content: {
							'application/json': {
								schema: {
									$ref: '#components/schemas/Pois',	
								}
							}
						}
					}
				}
			}
		},
		'/auth/simple-register': {
			post: {
				description: "Signup point for users",
				requestBody: {
		          content: {
		            'application/json': {
		              schema: {
		              	type: 'object',
		              	properties: {
							uniqId: {
								type: 'string',
								description: 'User UniqID',				
							}
						},
						required: true
		              }
		            }
		          },
		          required: true
		        },
				responses: {
					'200': {
						description: 'User is allowed or not',
						content: {
							'application/json': {
								schema: {
									type: 'object', 
									properties: {
										user: {
											type: 'object',
											properties: {
												id: {
													$ref: '#/components/schemas/genericId',
												},
												name: {
													type: 'string',
													description: 'User name ( should be empty )'
												},
												email: {
													type: 'string', 
													description: 'User generated email ( fake email )'
												},
												roles: {
													type: 'array',
													items: {
														type: 'string',
													},
													description: 'User role'
												},
												createdAt: {
													type: 'string',
												},
												updatedAt: {
													type: 'string',
												}
											}
										},
										token: {
											type: 'string',
											description: 'JWT Token'
										}
									}
								}
							}
						}
					}
				}
			}
		},
		'/orders/is-allowed': {
			post: {
				description: "Decide if user is allowed to order or not based on previous orders",
				requestBody: {
		          content: {
		            'application/json': {
		              schema: {
		              	type: 'object',
		              	properties: {
							userAddress: {
								$ref: '#/components/schemas/UserAddress'
							},
							box: {
								type: 'integer',
								description: 'Box ID',
								example: 123,								
							}
						},
						required: true
		              }
		            }
		          },
		          required: true
		        },
				responses: {
					'200': {
						description: 'User is allowed or not',
						content: {
							'application/json': {
								schema: {
									type: 'object', 
									properties: {
										isAllowed: {
											type: 'boolean',
										}
									}
								}
							}
						}
					}
				}
			}	
		},
		'/orders/confirm': {
			post: {
				description: "Confirm order from user",
				requestBody: {
		          content: {
		            'application/json': {
		              schema: {
		              	type: 'object',
		              	properties: {
		              		deliveryMode: {
								type: 'string',
								description: 'Delivery mode to use',
		              		},
							userAddress: {
								$ref: '#/components/schemas/UserAddress'
							},
							selectedPickup: {
								$ref: '#components/schemas/Poi'	
							},
							box: {
								type: 'integer',
								description: 'Box ID',
								example: 123,								
							},
							products: {
								type: 'array',
								items: {
									$ref: '#components/schemas/Product'	
								},
							}
						},
						required: true
		              }
		            }
		          },
		          required: true
		        },
				responses: {
					'200': {
						description: 'Order validated or not',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: {
											type: 'boolean',
											description: 'Order successful'
										}	
									}
									
								}
							}
						}
					}
				}	
			}
		},
		'/feedback/confirm': {
			post: {
				description: "Confirm feedback from user",
				requestBody: {
		          content: {
		            'application/json': {
		              schema: {
		              	type: 'object',
		              	properties: {
							questionContent: {
								type: 'integer',
								description: 'questionContent ID',
								example: 123,
							},
							isLiked: {
								type: 'string',
								description: 'feedback liked',
							},
							isDisliked: {
								type: 'string',
								description: 'feedback disliked',
							},
							comment: {
								type: 'string',
								description: 'feedback comment',
							},
							feedback: {
								type: 'integer',
								description: 'feedback ID',
								example: 12,
							},
						},
						required: true
		              }
		            }
		          },
		          required: true
		        },
				responses: {
					'200': {
						description: 'feedback validated or not',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: {
											type: 'boolean',
											description: 'feedback successful'
										}
									}

								}
							}
						}
					}
				}
			}
		},
	}
};