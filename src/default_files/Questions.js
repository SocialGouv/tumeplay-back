const questions = [
  {
    key: 1,
    id: 1,
    theme: 1,
    category: 1,
    question: 'À quoi servent les règles ?',
    rightAnswer: 1,
    explanation: 'Chaque mois à partir de la puberté, l\u0092utérus se prépare à accueillir un \u009cuf fécondé. Pour ça, la muqueuse utérine s\u0092épaissit. A la fin de chaque cycle, si la fécondation (rencontre spermatozoïde & ovule) n\u0092a pas eu lieu, la partie superficielle de la muqueuse est évacuée : c\u0092est ce qu\u0092on appelle les règles. C\'est un phénomène naturel qui dure en général entre 3 et 7 jours.',
    answers: [
      {
        id: 1,
        text: 'à évacuer la muqueuse utérine'
      },
      {
        id: 2,
        text: 'à rien'
      },
      {
        id: 3,
        text: 'à purifier la muqueuse utérine'
      }
    ],
    picture: "DTC-photoquiz-regles.jpg"
  },
  {
    key: 2,
    id: 2,
    theme: 1,
    category: 1,
    question: 'Une masturbation sans sperme, c\'est possible ?',
    rightAnswer: null,
    explanation: 'Bien évidemment, une fille n\'a pas de sperme. Les premières émissions de sperme se déclenchent 1 à 2 ans après le début de la puberté. Pas de puberté, pas de sperme donc. Si un garçon se masturbe plusieurs fois par jour, il peut arriver qu\'il éjacule moins (ou plus du tout) de sperme. Son « stock » mettra plusieurs heures pour se reconstituer.',
    answers: [
      {
        id: 1,
        text: 'trop jeune'
      },
      {
        id: 2,
        text: 'bah c\'est une fille'
      },
      {
        id: 3,
        text: 'pas possible'
      }
    ],
    picture: "DTC-photoquiz-masturbationsperme.jpg"
  },
  {
    key: 3,
    id: 3,
    theme: 1,
    category: 1,
    question: 'Toutes les vulves se ressemblent ?',
    rightAnswer: 2,
    explanation: 'Faux ! Tous les sexes féminins sont composés des mêmes structures et organes mais ne se ressemblent pas tous. 50% des femmes ont les lèvres intérieures qui dépassent les extérieures, 30% ont les deux de la même taille et 20% seulement ont les lèvres intérieures plus courtes que les extérieures. Toutes différentes. C\'est du blabla ? Regarde notre galerie.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'C\'est quoi une vulve ?'
      }
    ],
    picture: "DTC-photoquiz-vulve.jpg"
  },
  {
    key: 4,
    id: 4,
    theme: 1,
    category: 1,
    question: 'Tous les pénis se ressemblent ?',
    rightAnswer: 2,
    explanation: 'Faux ! Tous les sexes masculins sont composés des mêmes structures et organes mais ne se ressemblent pas tous, ni en taille, ni en diamètre. Tous les pénis sont beaux, chacun à sa façon. Parfois mieux vaut être avec un petit agile qu\'un gros fainéant. ',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'C\'est quoi un pénis ?'
      }
    ],
    picture: "DTC-photoquiz-penis.jpg"
  },
  {
    key: 5,
    id: 5,
    theme: 1,
    category: 1,
    question: 'Les pertes blanches, c\'est quoi ?',
    rightAnswer: 3,
    explanation: 'Le vagin est tapissé d\u0092une muqueuse qui ressemble à celle de l\u0092intérieur des joues. Comme toutes les muqueuses, la muqueuse vaginale produit un liquide en continu qui permet un auto-nettoyage constant et un maintien d\u0092une flore équilibrée. Il peut se manifester par des pertes blanches.',
    answers: [
      {
        id: 1,
        text: 'La fouf qui sue'
      },
      {
        id: 2,
        text: 'des fuites urinaires'
      },
      {
        id: 3,
        text: 'des sécrétions vaginales'
      }
    ],
    picture: "DTC-photoquiz-pertesblanches.jpg"
  },
  {
    key: 6,
    id: 6,
    theme: 1,
    category: 1,
    question: 'La taille d\'un vagin est de combien ?',
    rightAnswer: 2,
    explanation: 'Le vagin mesure entre 8 et 12 cm. Il relie la vulve à l\'utérus via le col de l\'utérus. Il est extensible et sa dimension peut varier.Le vagin ne peut pas être trop petit car il s\u0092adapte à toutes les tailles de pénis ou de sex toys.',
    answers: [
      {
        id: 1,
        text: '4-7cm'
      },
      {
        id: 2,
        text: '8-12 cm'
      },
      {
        id: 3,
        text: '13-16 cm'
      }
    ],
    picture: "LPF-photoquiz-erectionfille.jpg"
  },
  {
    key: 7,
    id: 7,
    theme: 1,
    category: 1,
    question: 'Quelles sont les différentes parties du pénis ?',
    rightAnswer: 1,
    explanation: 'Le pénis est composé du gland qui lui, est entouré par le prépuce, pli de peau qui peut se retirer pour découvrir le gland et qui est supprimé si l\u0092on est circoncis. Le prépuce est relié au gland par une bande de peau, le frein. L\u0092urètre, se trouve au bout du gland. L\u0092urètre sert à la fois à uriner et à éjaculer.',
    answers: [
      {
        id: 1,
        text: 'urètre, frein, gland, prépuce'
      },
      {
        id: 2,
        text: 'gland, prépuce, os pénien, urètre'
      },
      {
        id: 3,
        text: 'testicules, gland, prépuce'
      }
    ],
    picture: "ETS-photoquiz-sodo.jpg"
  },
  {
    key: 8,
    id: 8,
    theme: 1,
    category: 1,
    question: 'À ton avis, en moyenne, le clitoris mesure combien ?',
    rightAnswer: 2,
    explanation: 'Le clitoris dans son entier, le gland, le coude et les 4 ramifications, mesure en moyenne 12 cm.',
    answers: [
      {
        id: 1,
        text: '4-7 cm'
      },
      {
        id: 2,
        text: '8-13 cm'
      },
      {
        id: 3,
        text: '14-16 cm'
      }
    ],
    picture: "DTC-photoquiz-mesure.jpg"
  },
  {
    key: 9,
    id: 9,
    theme: 1,
    category: 1,
    question: 'À ton avis, en moyenne, le pénis en érection mesure combien ?',
    rightAnswer: 2,
    explanation: 'La pénis en érection mesure en moyenne 13 cm. Cependant, tous les pénis sont différents en termes de formes ou de tailles.',
    answers: [
      {
        id: 1,
        text: '4-7 cm'
      },
      {
        id: 2,
        text: '8-13 cm'
      },
      {
        id: 3,
        text: '14-16 cm'
      }
    ],
    picture: "DTC-photoquiz-taillepenis.jpg"
  },
  {
    key: 10,
    id: 10,
    theme: 1,
    category: 1,
    question: 'Une érection du pénis c\'est quoi ?',
    rightAnswer: 1,
    explanation: 'Une érection du pénis est un phénomène réflexe répondant le plus souvent à une excitation. Quand le pénis durcit et se dresse, il se remplit de sang et ça augmente sa taille et sa circonférence. Cette rigidité temporaire facilite la pénétration, la masturbation...',
    answers: [
      {
        id: 1,
        text: 'quand le pénis se dresse'
      },
      {
        id: 2,
        text: 'quand le pénis éjacule'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "ETS-photoquiz-sodo.jpg"
  },
  {
    key: 11,
    id: 11,
    theme: 1,
    category: 1,
    question: 'La quantité de sperme d\'une éjaculation peut être contenue dans ?',
    rightAnswer: 2,
    explanation: 'La quantité de sperme émise ne se mesure pas en litres, c\'est à peu près une cuillère à café. Plus on a des éjaculations rapprochées, plus la quantité diminue et le sperme devient transparent. La quantité de sperme ne détermine pas le plaisir ! Mais une goutte peut suffire à transmettre une IST ou provoquer une grossesse donc, sans devenir parano, mieux vaut se protéger ;).',
    answers: [
      {
        id: 1,
        text: 'une cuillère à soupe'
      },
      {
        id: 2,
        text: 'une cuillère à café'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-ejaculation.jpg"
  },
  {
    key: 12,
    id: 12,
    theme: 1,
    category: 2,
    question: 'Pour une fille, la première pénétration fait toujours mal ?',
    rightAnswer: 2,
    explanation: 'Faux ! Il peut arriver que la fille ait mal la première fois si son vagin n\'est pas assez lubrifié, parce qu\'elle est stressée, que ça va trop vite, etc. Ses muscles sont alors contractés et le rapport peut faire mal. Un climat de confiance et de communication permet d\'éviter cette situation. À l\'inverse, un garçon stressé peut avoir du mal à bander.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-douleur.jpg"
  },
  {
    key: 13,
    id: 13,
    theme: 1,
    category: 2,
    question: 'Il n\u0092y a que les êtres humains qui peuvent être homosexuels ?',
    rightAnswer: 2,
    explanation: 'Faux ! On compte pas moins de 1500 espèces animales (mammifères, oiseaux, reptiles et insectes) ayant des comportements homosexuels. Certaines espèces entretiennent même des relations de longue durée avec un partenaire de même sexe. L\'homosexualité n\'existe pas uniquement chez l\'être humain.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-homosexuel.jpg"
  },
  {
    key: 14,
    id: 14,
    theme: 1,
    category: 2,
    question: 'Les filles peuvent se masturber ?',
    rightAnswer: 1,
    explanation: 'Vrai ! Les filles peuvent se masturber si elles en ont envie. La masturbation ce sont des caresses, de petits va-et-vient, des frottements, des pressions etc. au niveau des parties génitales internes ou externes qui procurent du plaisir. Elle peuvent le faire seule ou pas. 87% des femmes se sont masturbées au moins une fois dans leur vie.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-masturbation.jpg"
  },
  {
    key: 15,
    id: 15,
    theme: 1,
    category: 2,
    question: 'Est-ce bizarre de ne pas avoir envie de coucher ?',
    rightAnswer: 2,
    explanation: 'Non ce n\'est pas bizarre et ce n\'est pas grave. Certaines personnes n\'ont juste pas envie et c\'est tout à fait possible. Cependant, si tu aimerais avoir des rapports mais que tu ne ressens pas de désir alors que tu aimerais en ressentir (libido, désir sexuel faible), consulte un professionnel de santé.',
    answers: [
      {
        id: 1,
        text: 'De ouf'
      },
      {
        id: 2,
        text: 'Non pas du tout'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-pasenvie.jpg"
  },
  {
    key: 16,
    id: 16,
    theme: 1,
    category: 2,
    question: 'Est-ce qu\'il faut se raser les poils autour du sexe ?',
    rightAnswer: 2,
    explanation: 'Faux ! S\'épiler est un choix personnel et ce n\'est pas forcément plus hygiénique. En fait, l\'hygiène n\'a rien à voir avec les poils. Les poils ne protègent pas contre les infections sexuellement transmissibles. En dehors de l\'hygiène intime, celle du corps, celle des mains, qui sont recommandées : chacun fait ce qu\'il veut avec ses poils !',
    answers: [
      {
        id: 1,
        text: 'Oui, évidemment'
      },
      {
        id: 2,
        text: 'Beh non'
      },
      {
        id: 3,
        text: 'Pourquoi pas ?'
      }
    ],
    picture: "DTC-photoquiz-poils.jpg"
  },
  {
    key: 17,
    id: 17,
    theme: 1,
    category: 2,
    question: 'L\'hymen c\'est le témoin de la virginité ?',
    rightAnswer: 3,
    explanation: 'Une membrane. L\u0092hymen est une petite membrane de forme et d\u0092épaisseur variables qui ferme plus ou moins partiellement le vagin. Cette membrane s\'assouplit et s\'ouvre davantage lors des premiers rapports sexuels. 1/3 des femmes n\'ont jamais eu d\'hymen. Une fille ne saigne pas forcément lors de la première pénétration.',
    answers: [
      {
        id: 1,
        text: 'vrai, s\'il est pas déchiré'
      },
      {
        id: 2,
        text: 'faux, c\'est de la peau'
      },
      {
        id: 3,
        text: 'faux, c\'est une membrane'
      }
    ],
    picture: "ETS-photoquiz-vaginisme.jpg"
  },
  {
    key: 18,
    id: 18,
    theme: 1,
    category: 2,
    question: 'Les rêves érotiques peuvent déclencher une éjaculation ou un orgasme ?',
    rightAnswer: 1,
    explanation: 'Rêver de choses érotiques, c\u0092est normal. Ça arrive à l\u0092adolescence mais ça continue après. Ces rêves peuvent déclencher un orgasme, une éjaculation. Dans un rêve érotique, on choisit pas le scénario, il s\u0092impose. Pas de panique ! Rêver de certaines choses même bizarres ne veut pas dire qu\'on est pervers. Il ne faut pas prendre les rêves au premier degré.',
    answers: [
      {
        id: 1,
        text: 'Oui'
      },
      {
        id: 2,
        text: 'Non'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-ejactorgasme.jpg"
  },
  {
    key: 19,
    id: 19,
    theme: 1,
    category: 2,
    question: 'Avoir des fantasmes c\'est normal ?',
    rightAnswer: 1,
    explanation: 'Les fantasmes, c\u0092est tout ce qu\u0092on peut imaginer et qui provoque notre excitation sexuelle. Des fantasmes, tout le monde peut en avoir. Ou pas. Pas de règle en la matière. On peut s\u0092imaginer dans telle ou telle position, dans tel ou tel lieu, avec tel\u0095le\u0095s partenaire\u0095s. Et ça n\u0092a rien de grave.',
    answers: [
      {
        id: 1,
        text: 'Oui'
      },
      {
        id: 2,
        text: 'Non'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-fantasme.jpg"
  },
  {
    key: 20,
    id: 20,
    theme: 1,
    category: 2,
    question: 'Se masturber tous les jours est dangereux ?',
    rightAnswer: 2,
    explanation: 'Certaines personnes se masturbent tous les jours ou presque, et la masturbation concerne une grande partie des hommes et des femmes. Attention, ce n\'est pas une obligation : chacun\u0095e fait comme il souhaite. Mais se masturber c\'est tout à fait normal, nombreux\u0095ses sont ceux qui le font !',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Ah bon ??!!'
      }
    ],
    picture: "DTC-photoquiz-masturbation.jpg"
  },
  {
    key: 21,
    id: 21,
    theme: 1,
    category: 2,
    question: 'Chez les garçons, les pollutions nocturnes c\'est quand ils transpirent la nuit ?',
    rightAnswer: 1,
    explanation: 'Le sperme peut parfois sortir de manière incontrôlée. Ça arrive souvent durant le sommeil. Ça peut arriver pendant la journée mais plus rarement. C\u0092est ce qu\u0092on appelle l\u0092éjaculation ou la pollution nocturne (ou aussi le « rêve mouillé », le « wet dream »). Ça témoigne souvent du début de la puberté et c\'est fréquent chez l\u0092ado. Ça existe aussi chez l\u0092homme adulte.',
    answers: [
      {
        id: 1,
        text: 'Vrai '
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-nocturne.jpg"
  },
  {
    key: 22,
    id: 22,
    theme: 1,
    category: 2,
    question: 'Un préservatif externe ça existe ?',
    rightAnswer: 1,
    explanation: 'Vrai, il se déroule sur le pénis et est aussi appelé préservatif « masculin ». Il existe en différentes tailles, effets ou matières (nervuré, ultra-fin, avec des goûts, latex ou pas). On peut l\'acheter en pharmacie, supermarché, sur Internet ou en avoir gratuitement dans certaines associations ou par ordonnance du médecin. Attention à vérifier la date de péremption !',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'C\'est quoi ?'
      }
    ],
    picture: "DTC-photoquiz-externe.jpg"
  },
  {
    key: 23,
    id: 23,
    theme: 1,
    category: 3,
    question: 'Plus un homme est petit, plus son pénis est petit ?',
    rightAnswer: 2,
    explanation: 'Légende urbaine ! La taille d\'une personne ne donne aucune idée de la taille de son sexe. La seule façon de connaître la taille c\u0092est de mesurer le pénis en érection entre le bas du ventre et le bout du gland. La taille moyenne du pénis en érection est de 13 cm. Et pour le plaisir, ce n\'est pas la taille qui compte ;)',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux '
      },
      {
        id: 3,
        text: 'Je ne sais pas '
      }
    ],
    picture: "DTC-photoquiz-taillepetit.jpg"
  },
  {
    key: 24,
    id: 24,
    theme: 1,
    category: 3,
    question: 'La taille du pénis peut être estimée en fonction de la taille du pouce ?',
    rightAnswer: 2,
    explanation: 'Légende urbaine ! La longueur des doigts ne donne aucune idée de la taille de son sexe. La seule façon de connaître la taille c\u0092est de mesurer le pénis en érection entre le bas du ventre et le bout du gland. La taille moyenne du pénis en érection est de 13 cm. Et pour le plaisir, ce n\'est pas la taille qui compte ;)',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-taillepenis.jpg"
  },
  {
    key: 25,
    id: 25,
    theme: 1,
    category: 3,
    question: 'Qui a déjà répondu non à : "Site accessible aux majeurs. Avez-vous plus de 18 ans ?"',
    rightAnswer: 3,
    explanation: 'En fait on en sait rien.',
    answers: [
      {
        id: 1,
        text: '10% des gens'
      },
      {
        id: 2,
        text: 'Personne'
      },
      {
        id: 3,
        text: 'Lol'
      }
    ],
    picture: "DTC-photoquiz-enfanthomosexuel.jpg"
  },
  {
    key: 26,
    id: 26,
    theme: 1,
    category: 3,
    question: 'Le pénis du canard est en forme de tire-bouchon',
    rightAnswer: 1,
    explanation: 'C\'est vrai ! ',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux, impossible'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-canard.jpg"
  },
  {
    key: 27,
    id: 27,
    theme: 1,
    category: 4,
    question: 'Les parents peuvent refuser que leur enfant soit homosexuel et le faire changer ?',
    rightAnswer: 2,
    explanation: 'Les parents n\u0092ont pas le droit de refuser que leur enfant soit homosexuel.le. L\'orientation sexuelle fait partie de la sphère privée et personne ne peut décider pour une autre personne (et c\'est dans la loi!). Accepter son homosexualité peut être difficile. Pour en parler, on peut appeler le 0 810 20 30 40, 7j/7 de 8h à 23h (coût d\'une communication locale).',
    answers: [
      {
        id: 1,
        text: 'Ouais :( '
      },
      {
        id: 2,
        text: 'Non, absolument pas'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-enfanthomosexuel.jpg"
  },
  {
    key: 28,
    id: 28,
    theme: 1,
    category: 4,
    question: 'La loi dit qu\'on peut avoir des rapports sexuels à partir de 15 ans ?',
    rightAnswer: 2,
    explanation: 'Il n\u0092y a pas d\u0092âge légal à partir duquel on peut avoir des rapports sexuels. Cependant, un mineur de moins de 15 ans ne peut pas avoir de rapports sexuels avec un majeur de plus de 18 ans.',
    answers: [
      {
        id: 1,
        text: 'C\'est vrai'
      },
      {
        id: 2,
        text: 'C\'est faux ! '
      },
      {
        id: 3,
        text: 'Ah bon ? Je suis pas sûr. '
      }
    ],
    picture: "DTC-photoquiz-loiage.jpg"
  },
  {
    key: 29,
    id: 29,
    theme: 1,
    category: 4,
    question: 'Si on ne veut pas avoir de rapports sexuels c\'est parce qu\'on est pas mûr\u0095e ?',
    rightAnswer: 2,
    explanation: 'Faux ! Le désir, la pratique et les valeurs associés à la sexualité sont différents selon chacun\u0095e. Connaître ses limites et les suivre, c\u0092est un signe de maturité ! Insister ou faire du chantage pour que l\'autre accepte, ce n\'est pas du consentement.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-mur.jpg"
  },
  {
    key: 30,
    id: 30,
    theme: 1,
    category: 4,
    question: 'Des parents peuvent forcer leur fille mineure et enceinte à avorter ?',
    rightAnswer: 2,
    explanation: 'Il est interdit de forcer une femme, mineure ou majeure, à avorter. Les parents sont là pour conseiller mais ne peuvent pas faire pression sur leur enfant. La décision finale n\'appartient qu\'à la femme enceinte. Ainsi pratiquer un avortement sans le consentement de la femme enceinte est puni par la loi.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux '
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-enceinte.jpg"
  },
  {
    key: 31,
    id: 31,
    theme: 1,
    category: 4,
    question: 'Le partenaire peut forcer une femme enceinte à avorter ?',
    rightAnswer: 2,
    explanation: 'Il est interdit de forcer une femme, mineure ou majeure, à avorter. La décision finale n\'appartient qu\'à la femme enceinte. Le partenaire est là pour conseiller mais ne peut pas faire pression. Pratiquer une interruption de grossesse sans le consentement de la femme enceinte peut être puni de cinq ans d\'emprisonnement et de 75 000 euros d\'amende.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-enceinte.jpg"
  },
  {
    key: 32,
    id: 32,
    theme: 1,
    category: 4,
    question: 'On peut faire des bisous à une personne même si elle ne veut pas ?',
    rightAnswer: 3,
    explanation: 'Non, on ne peut pas. Chaque personne décide de ce dont elle a envie ou pas. À elle de choisir son\u0095sa partenaire. De refuser des bisous, des caresses ou d\u0092avoir des relations sexuelles non protégées. De dire « non » quand ce qu\u0092on lui propose ne lui plaît pas. Bref, d\u0092avoir la maîtrise de son corps. Et aux autres de respecter ses choix.',
    answers: [
      {
        id: 1,
        text: 'Oui, la bise'
      },
      {
        id: 2,
        text: 'Oui'
      },
      {
        id: 3,
        text: 'Non'
      }
    ],
    picture: "DTC-photoquiz-bisou.jpg"
  },
  {
    key: 33,
    id: 33,
    theme: 1,
    category: 5,
    question: 'C\'est quoi une IST ?',
    rightAnswer: 3,
    explanation: 'C\'est une Infection principalement Transmissible par voie Sexuelle (bucale, vaginale, anale, frottements intimes). On retrouve les chlamydia, la blennorragie, la syphilis, l\u0092hépatite B, l\u0092herpès génital, l\'HPV, le VIH/SIDA... Les préservatifs (externes ou inernes) ou carrés de latex permettent de s\'en protéger. En cas de doute, on passe par la case dépistage.',
    answers: [
      {
        id: 1,
        text: 'C\'est pas IST, c\'est MST !'
      },
      {
        id: 2,
        text: 'Infection sexuelle trouvée'
      },
      {
        id: 3,
        text: 'Aucun des deux '
      }
    ],
    picture: "DTC-photoquiz-IST.jpg"
  },
  {
    key: 34,
    id: 34,
    theme: 1,
    category: 5,
    question: 'Quand elle s\'essuie aux toilettes, il est conseillé pour une fille de faire quoi ?',
    rightAnswer: 1,
    explanation: 'En se nettoyant de l\'avant vers l\'arrière, la femme évite la propagation de matières fécales vers la vulve, donc d\'infections potentielles.',
    answers: [
      {
        id: 1,
        text: 'se nettoyer d\'avant en arrière'
      },
      {
        id: 2,
        text: 'se nettoyer d\'arrière en avant'
      },
      {
        id: 3,
        text: 'de pas se nettoyer'
      }
    ],
    picture: "DTC-photoquiz-femmetoilette.jpg"
  },
  {
    key: 35,
    id: 35,
    theme: 1,
    category: 5,
    question: 'La mycose ou candidose c\'est une IST ?',
    rightAnswer: 2,
    explanation: 'Faux ! Ce n\'est pas une IST à proprement parler. C\'est une infection des organes génitaux par un champignon, fréquente et banale. Plein de facteurs peuvent expliquer son apparition (pantalons serrés, VIH, traitement antibiotique, pilule, 3ème trimestre de la grossesse, trop d\'hygiène, diabète, etc.). La mycose peut ressurgir après un rapport.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-IST.jpg"
  },
  {
    key: 36,
    id: 36,
    theme: 1,
    category: 5,
    question: 'Les mains ou les doigts peuvent transmettre une infection ?',
    rightAnswer: 1,
    explanation: 'L\'hygiène des mains et des ongles est indispensable avant tout rapport sexuel (préliminaires compris) car ils véhiculent de nombreux germes, attrapés sur ton tél, par exemple.',
    answers: [
      {
        id: 1,
        text: 'Vrai '
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-infectionmains.jpg"
  },
  {
    key: 37,
    id: 37,
    theme: 1,
    category: 5,
    question: 'Le VIH/SIDA peut toucher n\'importe qui ?',
    rightAnswer: 1,
    explanation: 'Vrai ! Le VIH peut toucher n\'importe qui. Il peut se transmettre : 1) lors d\'un rapport sexuel non ou mal protégé avec une personne séropositive, 2) par transmission sanguine ou 3) lors de la grossesse d\'une femme séropositive à son enfant. Son dépistage est essentiel. Les préservatifs sont les seuls moyens de s\'en protéger lors des rapports sexuels.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'C\'est quoi le VIH ?'
      }
    ],
    picture: "LPF-photoquiz-sida.jpg"
  },
  {
    key: 38,
    id: 38,
    theme: 1,
    category: 5,
    question: 'Qu\'est-ce qu\'une contraception ?',
    rightAnswer: 2,
    explanation: 'C\'est l\'ensemble des moyens qui permettent à une fille et un garçon d\'éviter une grossesse non désirée lors de relations sexuelles. En France, certaines contraceptions (pilule, stérilet, etc.) peuvent être délivrées gratuitement et anonynement aux mineurs (moins de 18 ans) dans un centre de plannification familiale, ou prescrites par un médecin ou sage-femme.',
    answers: [
      {
        id: 1,
        text: 'Un moyen d\'éviter une infection'
      },
      {
        id: 2,
        text: 'Un moyen d\'éviter une grossesse'
      },
      {
        id: 3,
        text: 'Les deux'
      }
    ],
    picture: "LPF-photoquiz-enceinte.jpg"
  },
  {
    key: 39,
    id: 39,
    theme: 1,
    category: 5,
    question: 'La pilule protège du VIH ?',
    rightAnswer: 3,
    explanation: 'Non, la pilule ne protège pas du VIH, ni des infections sexuellement transmissibles. C\'est un moyen de contraception hormonal qui protège seulement du risque de grossesse. Le seul moyen de contraception qui protège aussi du VIH/sida et des autres IST, ce sont les préservatifs (externe et interne).',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Vrai mais pas celle d\'urgence'
      },
      {
        id: 3,
        text: 'Non'
      }
    ],
    picture: "ETS-photoquiz-traitement.jpg"
  },
  {
    key: 40,
    id: 40,
    theme: 1,
    category: 5,
    question: 'Le préservatif ne sert à rien si on se retire avant l\'éjaculation ?',
    rightAnswer: 2,
    explanation: 'Faux ! Avant l\'éjaculation, un liquide séminal peut s\'écouler. Ce liquide peut contenir des spermatozoïdes qui peuvent féconder l\'ovule : si c\'est le cas, la fille est enceinte. Le retrait n\'est donc pas une méthode efficace pour éviter une grossesse / éviter d\'être enceinte. En plus, le préservatif est la seule protection utile contre les IST. ',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-ejaculation.jpg"
  },
  {
    key: 41,
    id: 41,
    theme: 2,
    category: 1,
    question: 'Une fille peut-elle avoir une érection ?',
    rightAnswer: 2,
    explanation: 'Le pénis et le clitoris sont constitués des mêmes éléments. Lors de l\'excitation, ils se gorgent de sang, gonflent et durcissent de la même manière. La différence entre un clitoris au repos et en érection est flagrante ! Jettes y un coup d\'oeil ;)',
    answers: [
      {
        id: 1,
        text: 'Non, lol'
      },
      {
        id: 2,
        text: 'Oui !'
      },
      {
        id: 3,
        text: 'Pas d\'bite, pas d\'érection'
      }
    ],
    picture: "LPF-photoquiz-erectionfille.jpg"
  },
  {
    key: 42,
    id: 42,
    theme: 2,
    category: 1,
    question: 'Un vagin peut être trop petit ?',
    rightAnswer: 2,
    explanation: 'Faux. Le vagin ne peut pas être trop petit car il s\u0092adapte à toutes les tailles. Si on ressent une douleur ou si la pénétration est impossible, c\'est souvent lié à la contraction des muscles du vagin ou au manque de lubrification naturelle. Ça peut venir du stress, de la peur, ou du manque de stimulation (du coup pas assez de mouille!).',
    answers: [
      {
        id: 1,
        text: 'Vrai, consulte un médecin'
      },
      {
        id: 2,
        text: 'Faux, faux, faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "ETS-photoquiz-vaginisme.jpg"
  },
  {
    key: 43,
    id: 43,
    theme: 2,
    category: 1,
    question: 'Un pénis courbé en érection ça peut être normal ?',
    rightAnswer: 2,
    explanation: 'Le pénis peut être orienté vers le haut, vers le bas, vers la droite ou la gauche et c\'est normal. Lorsqu\'il existe une courbure à l\'érection, cause d\'une gêne voire d\'une impossibilité à la pénétration, il faut consulter un médecin. Cette particularité touche 3,4% à 9% des hommes. ',
    answers: [
      {
        id: 1,
        text: 'Oui'
      },
      {
        id: 2,
        text: 'Non'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-peniscourbe.jpg"
  },
  {
    key: 44,
    id: 44,
    theme: 2,
    category: 2,
    question: 'Chaque fois qu\'un garçon éjacule, il a un orgasme ?',
    rightAnswer: 2,
    explanation: 'C\'est faux (eh ouais, surprise héhé). Une éjaculation n\'est pas forcément associée à un plaisir intense mais souvent à un plaisir qui variera en fonction de lui, du ou de la partenaire ou de l\'environnement. ',
    answers: [
      {
        id: 1,
        text: 'Oui, 100%'
      },
      {
        id: 2,
        text: 'Non, trop pas'
      },
      {
        id: 3,
        text: 'Aucune idée'
      }
    ],
    picture: "LPF-photoquizz-ejactorgasme.jpg"
  },
  {
    key: 45,
    id: 45,
    theme: 2,
    category: 2,
    question: 'L\'orgasme c\'est quoi ?',
    rightAnswer: 3,
    explanation: 'C\'est un plaisir sexuel intense. Il n\u0092est pas évident d\u0092expliquer ce qu\u0092est un orgasme car les sensations éprouvées dans tout le corps varient beaucoup d\u0092un individu à l\u0092autre, voire d\u0092un moment à l\u0092autre pour la même personne.',
    answers: [
      {
        id: 1,
        text: 'Une bonne éjac\''
      },
      {
        id: 2,
        text: 'Jouir'
      },
      {
        id: 3,
        text: 'Un plaisir sexuel intense'
      }
    ],
    picture: "LPF-photoquiz-orgasme.jpg"
  },
  {
    key: 46,
    id: 46,
    theme: 2,
    category: 2,
    question: 'Si un garçon ne bande pas, c\'est qu\'il ne veut pas avoir de rapports sexuels ?',
    rightAnswer: 2,
    explanation: 'Faux ! Chez l\'homme, il peut y avoir des pannes d\'érection qui n\'ont rien à voir avec l\'excitation ou l\'envie d\'avoir des rapports. Le stress, l\'anxiété ou la fatigue peuvent parfois expliquer ces "pannes". Si elles persistent, ne pas hésiter à contacter un médecin : il saura orienter :) ',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux, pas toujours'
      },
      {
        id: 3,
        text: 'J\'en sais rien'
      }
    ],
    picture: "DTC-photoquiz-nocturne.jpg"
  },
  {
    key: 47,
    id: 47,
    theme: 2,
    category: 2,
    question: 'Si une fille mouille, c\'est qu\'elle a envie d\'un rapport sexuel ?',
    rightAnswer: 2,
    explanation: 'Faux ! si une fille "mouille", cela ne veut pas dire qu\'elle a absolument envie de faire l\'amour ou qu\'elle aime ça. À l\'inverse, elle peut avoir du désir sans mouiller tout de suite. Le mieux c\'est quand même de communiquer pour savoir :)',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux, pas toujours'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-mouille.jpg"
  },
  {
    key: 48,
    id: 48,
    theme: 2,
    category: 2,
    question: 'Perdre sa virginité c\'est quand il y a une pénétration ?',
    rightAnswer: 3,
    explanation: 'Faux ! Une personne dite vierge est une personne qui n\'a pas connu de rapport sexuel. Or, un rapport sexuel ne veut pas forcement dire pénétration : une fellation, un cunnilingus ou une pénétration anale sont aussi considérés comme des rapports sexuels.',
    answers: [
      {
        id: 1,
        text: 'Oui, s\'il y a eu rupture d\'hymen'
      },
      {
        id: 2,
        text: 'Oui, quelque soit la pénétration'
      },
      {
        id: 3,
        text: 'Non, pas du tout'
      }
    ],
    picture: "LPF-photoquiz-virginite.jpg"
  },
  {
    key: 49,
    id: 49,
    theme: 2,
    category: 2,
    question: 'La durée moyenne d\'une pénétration sexuelle est de ?',
    rightAnswer: 2,
    explanation: 'Si une relation sexuelle dure en moyenne 25 minutes, la pénétration elle ne dure que 5 minutes, ce qui explique l\'importance de tout ce qui se passe avant (qu\'on appelle souvent préliminaires) et même après ;). ',
    answers: [
      {
        id: 1,
        text: '2 minutes'
      },
      {
        id: 2,
        text: '5 minutes'
      },
      {
        id: 3,
        text: '15 minutes'
      }
    ],
    picture: "ETS-photoquiz-samedi.jpg"
  },
  {
    key: 50,
    id: 50,
    theme: 2,
    category: 2,
    question: 'Les préliminaires sont indispensables ?',
    rightAnswer: 2,
    explanation: 'Non, pas forcément. Ça dépend du contexte. Le plus souvent, les préliminaires permettent aux partenaires de se donner du plaisir, et peuvent préparer, si les deux le souhaitent, à la pénétration. Ou pas, on peut très bien s\'arrêter là, c\'est tout aussi cool! La sexualité ne se résume pas à la pénétration.',
    answers: [
      {
        id: 1,
        text: 'Oui, obligé'
      },
      {
        id: 2,
        text: 'Non, pas forcément'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-infectionmains.jpg"
  },
  {
    key: 51,
    id: 51,
    theme: 2,
    category: 2,
    question: 'Est-ce que la virginité est liée à l\'hymen ?',
    rightAnswer: 2,
    explanation: 'Faux ! L\'hymen est une membrane qui n\'a pas de fonction particulière. Il n\'est pas rare de naître sans hymen ou que ce dernier se soit déjà atrophié avant le premier rapport. Il est aussi possible que certaines femmes gardent leur hymen intact même après avoir accouché.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "ETS-photoquiz-vaginisme.jpg"
  },
  {
    key: 52,
    id: 52,
    theme: 2,
    category: 2,
    question: 'Un préservatif usagé (déjà porté) peut être réutilisé ?',
    rightAnswer: 2,
    explanation: 'Faux ! Les préservatifs sont à usage unique (une seule foiiiiiiis, pas deux, pas trois). Il faut changer de préservatif à chaque rapport, que ce soit avec le même partenaire ou un partenaire différent. Utiliser le même préservatif peut occasionner des frictions et des déchirures. S\'il est déjà déroulé, impossible de le remettre. ',
    answers: [
      {
        id: 1,
        text: 'Ouais carrément'
      },
      {
        id: 2,
        text: 'Non, pas possible'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-externe.jpg"
  },
  {
    key: 53,
    id: 53,
    theme: 2,
    category: 2,
    question: 'Il n\'existe que des préservatifs pour homme, à mettre sur le pénis ?',
    rightAnswer: 2,
    explanation: 'Il existe aussi le préservatif interne, dit "féminin". C\'est une gaine en nitrile ou en polyuréthane munie d\u0092un anneau souple aux deux extrémités. Il se place dans le vagin ou l\'anus. Il peut être mis en place plusieurs heures avant le rapport sexuel ou juste avant. Il faut le changer à chaque rapport sexuel et entre chaque pénétration : on ne l\'utilise qu\'une seule fois !',
    answers: [
      {
        id: 1,
        text: 'Vrai '
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "ETS-photoquiz-preservatifs.jpg"
  },
  {
    key: 54,
    id: 54,
    theme: 2,
    category: 2,
    question: 'Les éjaculations précoces c\'est quand un garçon n\'arrive pas à éjaculer ?',
    rightAnswer: 2,
    explanation: 'Faux, c\'est quand l\u0092éjaculation survient trop vite chez le garçon. Il n\u0092y a pas de durée précise mais on en parle quand elle laisse la personne insatisfaite, avec la sensation qu\u0092elle n\u0092a aucun contrôle. Certaines situations (conflits avec son\u0095sa partenaire ou autre) créent une tension et empêchent de se détendre. Pas de honte, pas de panique : ça arrive.',
    answers: [
      {
        id: 1,
        text: 'Vrai '
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je  ne sais pas'
      }
    ],
    picture: "LPF-photoquizz-ejactorgasme.jpg"
  },
  {
    key: 55,
    id: 55,
    theme: 2,
    category: 2,
    question: 'Les préservatifs c\'est forcément payant ?',
    rightAnswer: 2,
    explanation: 'Les préservatifs peuvent être achetés en pharmacie et supermarché, mais ils peuvent également être distribués gratuitement en demandant une prescription au médecin ou en allant en chercher dans les Centres de Planification et d\'Education Familiale (CPEF) et Centres Gratuits d\'Information, de Dépistage et de Diagonistic (CeGIDD), ou les associations.',
    answers: [
      {
        id: 1,
        text: 'Vrai '
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "ETS-photoquiz-payant.jpg"
  },
  {
    key: 56,
    id: 56,
    theme: 2,
    category: 2,
    question: 'Quand on est gay, on doit forcément pratiquer la sodomie ?',
    rightAnswer: 2,
    explanation: 'Faux ! Il n\'y a pas de modèle à suivre sinon celui du consentement. C\'est à dire que personne, quel que soit son sexe ou son orientation sexuelle, ne doit se forcer à faire quelque chose qu\'il ne souhaite pas faire. Si on ne souhaite pas avoir de pénétration anale, on en a tout à fait le droit. Et le partenaire ne peut pas forcer ni obliger, sous quelque prétexte que ce soit.',
    answers: [
      {
        id: 1,
        text: 'Oui'
      },
      {
        id: 2,
        text: 'Non'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "ETS-photoquiz-sodo.jpg"
  },
  {
    key: 57,
    id: 57,
    theme: 2,
    category: 2,
    question: 'Il faut attendre d\u0092être fou-amoureux pour faire sa première fois ?',
    rightAnswer: 2,
    explanation: 'Faux ! L\u0092amour et la sexualité ne sont pas toujours liés. On peut désirer une personne et avoir envie d\u0092un rapport sexuel sans être amoureux-se. On peut aussi aimer énormement quelqu\u0092un mais ne pas avoir envie d\u0092être intime avec lui\u0095elle. L\u0092essentiel pour sa première fois, et toutes les autres, c\u0092est que les deux partenaires en aient envie.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'J\'en sais rien'
      }
    ],
    picture: "ETS-photoquiz-fouamoureux.jpg"
  },
  {
    key: 58,
    id: 58,
    theme: 2,
    category: 3,
    question: 'Un ours a un os au niveau du pénis (l\'os pénien) ?',
    rightAnswer: 1,
    explanation: 'L\'os pénien est un os présent dans le pénis de certains mammifères comme l\'ours ou le gorille... mais pas chez l\'homme ;)',
    answers: [
      {
        id: 1,
        text: 'Oui'
      },
      {
        id: 2,
        text: 'Arrête avec tes conneries'
      },
      {
        id: 3,
        text: 'Les hommes aussi'
      }
    ],
    picture: "LPF-photoquiz-ours.jpg"
  },
  {
    key: 59,
    id: 59,
    theme: 2,
    category: 3,
    question: 'La taille du pied ou de la main est proportionnelle à la taille du pénis ?',
    rightAnswer: 2,
    explanation: 'Légende urbaine ! La taille des mains ou des pieds ne donne aucune idée de la taille de son sexe. La seule façon de connaître la taille c\u0092est de mesurer le pénis en érection entre le bas du ventre et le bout du gland. La taille moyenne du pénis en érection est de 13 cm. Et pour le plaisir, ce n\'est pas la taille qui compte ;)',
    answers: [
      {
        id: 1,
        text: 'Vrai '
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-taillepetit.jpg"
  },
  {
    key: 60,
    id: 60,
    theme: 2,
    category: 3,
    question: 'À quelle heure et quel jour fait-on le plus l\'amour ?',
    rightAnswer: 2,
    explanation: '44% des couples feraient le plus souvent l\'amour le samedi à 19h, juste avant de sortir en soirée. Mais chacun ses habitudes ;) ',
    answers: [
      {
        id: 1,
        text: 'Dimanche 9h'
      },
      {
        id: 2,
        text: 'Samedi 19h'
      },
      {
        id: 3,
        text: '31 décembre, à minuit'
      }
    ],
    picture: "ETS-photoquiz-samedi.jpg"
  },
  {
    key: 61,
    id: 61,
    theme: 2,
    category: 3,
    question: 'Les hommes et les femmes ont le même nombre de partenaires au cours de leurs vies ?',
    rightAnswer: 3,
    explanation: 'Chez les hétéro, les hommes déclareraient tous leurs partenaires, alors que les femmes ne déclareraient que les partenaires qui ont compté pour elles. Mais au total, vraisemblablement, hommes ou femmes... chacun fait ce qu\'il veut (dans le respect du consentement, bien sûr!).',
    answers: [
      {
        id: 1,
        text: 'Oui'
      },
      {
        id: 2,
        text: 'Non'
      },
      {
        id: 3,
        text: 'Peut-être, qui sait ?'
      }
    ],
    picture: "ETS-photoquiz-paternaire.jpg"
  },
  {
    key: 62,
    id: 62,
    theme: 2,
    category: 4,
    question: 'Un\u0095e mineur\u0095e ne peut pas être condamné\u0095e pour viol ?',
    rightAnswer: 3,
    explanation: 'C\'est faux. En cas de crime ou de délit, un adolescent doit rendre compte de ses actes devant la justice, bien que la justice favorise l\u0092éducation sur la sanction. Selon la gravité des faits le juge pourra prononcer une mesure éducative, une sanction éducative ou de la prison. Donc, si un.e mineur.e viole, il ou elle peut être condamné.e.',
    answers: [
      {
        id: 1,
        text: 'C\'est une agression, pas un viol'
      },
      {
        id: 2,
        text: 'Ça dépend'
      },
      {
        id: 3,
        text: 'C\'est faux'
      }
    ],
    picture: "DTC-photoquiz-enfanthomosexuel.jpg"
  },
  {
    key: 63,
    id: 63,
    theme: 2,
    category: 4,
    question: 'Lors d\'un rapport sexuel, si un\u0095e des partenaires dit stop, il faut s\'arrêter ?',
    rightAnswer: 1,
    explanation: 'Le consentement est donné pour un acte mais il peut à tout moment être retiré. Dans ce cas-là, continuer le rapport sexuel est constitutif d\u0092un viol. Si un\u0095e partenaire veut arrêter, à n\'importe quel moment, quelle que ce soit la raison, on arrête. En cas de violences sexuelles, on peut appeler le 3919 pour recevoir conseils, aide et information.',
    answers: [
      {
        id: 1,
        text: 'Oui'
      },
      {
        id: 2,
        text: 'Oui si c\'est dit plusieurs fois'
      },
      {
        id: 3,
        text: 'Non'
      }
    ],
    picture: "ETS-photoquiz-fraise.jpg"
  },
  {
    key: 64,
    id: 64,
    theme: 2,
    category: 4,
    question: 'Un\u0095e mineur\u0095e 16 ans peut coucher avec une personne âgée de 30 ans ?',
    rightAnswer: 1,
    explanation: 'Un mineur âgé de 15 à 18 ans peut avoir des relations sexuelles avec un majeur (donc une personne de plus de 18 ans) à condition qu\u0092il consente expressément à avoir ce rapport sexuel et qu\u0092il n\u0092existe aucune autorité entre le majeur et le mineur (son/sa prof, par exemple).',
    answers: [
      {
        id: 1,
        text: 'Oui si elle le veut'
      },
      {
        id: 2,
        text: 'Non c\'est interdit'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-enfanthomosexuel.jpg"
  },
  {
    key: 65,
    id: 65,
    theme: 2,
    category: 4,
    question: 'À 14 ans, on peut avoir des relations sexuelles avec une personne de 13 ans ?',
    rightAnswer: 1,
    explanation: 'Deux mineurs de moins de 15 ans peuvent librement avoir des rapports sexuels entre eux, à condition qu\u0092ils aient expressément consenti à le faire : ça veut dire qu\'ils doivent être d\'accord, tous les deux, pour le faire. Pour être sûr\u0095e, il faut poser la question à son\u0095sa partenaire dans un climat détendu, sans pression ni menaces. ',
    answers: [
      {
        id: 1,
        text: 'Si les deux sont d\'accord, oui'
      },
      {
        id: 2,
        text: 'C\'est interdit par la loi'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "ETS-photoquiz-13.jpg"
  },
  {
    key: 66,
    id: 66,
    theme: 2,
    category: 4,
    question: 'Des parents ont le droit de forcer leur enfant à se marier ?',
    rightAnswer: 2,
    explanation: 'Les parents ne peuvent pas obliger leur enfant à se marier. La loi interdit de marier deux personnes qui ne le veulent pas.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "ETS - photo quiz -fouamoureux.jpg"
  },
  {
    key: 67,
    id: 67,
    theme: 2,
    category: 4,
    question: 'Beaucoup de filles qui disent « non » pensent « oui » ?',
    rightAnswer: 2,
    explanation: 'Non c\'est non. Ça peut arriver que l\'autre insiste. Si malgré les refus, l\'autre continue, ça peut être considéré comme une violence à caractère sexuel. Menacer, avec gestes ou mots, négocier en faisant du chantage, parfois affectif, mentir pour avoir une relation sexuelle, c\'est pas normal. En cas de violences sexuelles, on peut appeler le 3919 pour recevoir de l\'aide.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-oui.jpg"
  },
  {
    key: 68,
    id: 68,
    theme: 2,
    category: 4,
    question: 'Si le\u0095la partenaire dit « je ne sais pas », ça veut dire oui ?',
    rightAnswer: 2,
    explanation: 'C\'est faux. « Je ne sais pas » ne veut pas dire oui. Pour être sûr\u0095e, on peut demander si la personne en a envie. Par exemple : « Veux-tu aller plus loin ? Es-tu à l\u0092aise ? Est-ce que je peux te caresser ici ? As-tu envie d\u0092essayer ça ? » ET on doit écouter la réponse et en tenir compte, sinon il n\u0092y a pas de consentement.',
    answers: [
      {
        id: 1,
        text: 'Ouais, faut insister un peu'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "ETS-photoquiz-bisou.jpg"
  },
  {
    key: 69,
    id: 69,
    theme: 2,
    category: 4,
    question: 'On ne peut pas changer d\'avis pendant l\'acte, dans le feu de l\'action ?',
    rightAnswer: 2,
    explanation: 'Faux, on peut ! On peut dire oui, peut-être, dire non, changer d\u0092avis, dire qu\'on ne sait pas. Par exemple : « Je n\u0092ai pas très envie, je préfère faire ça plutôt que cela, ça me fait peur, je suis mal à l\u0092aise, je veux arrêter, ce n\u0092est pas le bon moment\u0085 » ET le\u0095la partenaire doit en tenir compte, sinon il n\u0092y a pas de consentement.',
    answers: [
      {
        id: 1,
        text: 'Vrai, on peut plus'
      },
      {
        id: 2,
        text: 'Faux, on peut'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "ETS-photoquiz-bisou.jpg"
  },
  {
    key: 70,
    id: 70,
    theme: 2,
    category: 4,
    question: 'Les garçons disent toujours oui, ils ont toujours envie d\'avoir des rapports ?',
    rightAnswer: 2,
    explanation: 'Les garçons n\'ont pas plus de besoins sexuels que les filles. Ils ont aussi des moments où ils n\'ont pas envie. À n\'importe quel moment, on peut dire qu\'on a pas ou plus envie. On peut refuser si on ne veut pas quelque chose (caresse, fellation, cunni, pénétration, bisou, ou autre). Et en face, le\u0095la partenaire doit en tenir compte ! Sinon, pas de consentement.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-oui.jpg"
  },
  {
    key: 71,
    id: 71,
    theme: 2,
    category: 5,
    question: 'Une grossesse est possible sans pénétration ?',
    rightAnswer: 1,
    explanation: 'Oui. Il suffit que le sperme ait été déposé à l\'entrée du vagin pour que les spermatozoïdes remontent jusqu\'à l\'utérus, puis dans les trompes. Attention ! Les spermatozoïdes sont présents également dans le liquide pré-séminal (c\u0092est le liquide qui lubrifie le pénis durant le rapport), donc même avant l\u0092éjaculation.',
    answers: [
      {
        id: 1,
        text: 'Bah oui!'
      },
      {
        id: 2,
        text: 'Euh pas possible'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-enceinte.jpg"
  },
  {
    key: 72,
    id: 72,
    theme: 2,
    category: 5,
    question: 'Une IVG c\'est une infection vulvo-génitale ?',
    rightAnswer: 2,
    explanation: 'Interruption Volontaire de Grossesse. Quand une fille est enceinte et ne souhaite pas poursuivre sa grossesse, elle peut y avoir recours à condition de respecter les délais. En France les IVG sont autorisées jusqu\'à 12 semaines de grossesse. Elles sont pratiquées gratuitement pour les mineures et pris en charge à 100% pour les majeures (et dans le cadre du secret médical).',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-enceinte.jpg"
  },
  {
    key: 73,
    id: 73,
    theme: 2,
    category: 5,
    question: 'Aucun risque d\'IST dans un rapport lesbien ?',
    rightAnswer: 2,
    explanation: 'La majorité des IST se contracte par un échange de fluides entre partenaires. Les femmes ayant des rapports lesbiens peuvent transmettre ou contracter des IST à travers les échanges de cyprine, via des frottements génitaux ou via des pénétrations avec des doigts ou objets non protégés et partagés.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-IST.jpg"
  },
  {
    key: 74,
    id: 74,
    theme: 2,
    category: 5,
    question: 'On peut choper une IST en faisant un cunni ?',
    rightAnswer: 1,
    explanation: 'Vrai ! Les IST peuvent se transmettre lors d\'une fellation, cunnilingus ou annulingus, lors de caresses, de frottements intimes, de contact entre muqueuses, y compris sans pénétration. Pour se protéger, on peut utiliser un carré de latex en le plaçant sur le sexe féminin et sur l\'anus ou un préservatif lors d\'une fellation ou lors d\'une pénétration. ',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-IST.jpg"
  },
  {
    key: 75,
    id: 75,
    theme: 2,
    category: 5,
    question: 'Les préservatifs sont les seuls moyens de protection efficace contre les IST ?',
    rightAnswer: 1,
    explanation: 'Vrai ! Quand on a des rapports sexuels, nos fluides se mélangent entre eux et peuvent être porteurs de bactéries ou virus. Les personnes porteuses d\'IST peuvent ne pas le savoir car il n\'y a pas forcément de symptômes visibles. Les préservatifs et carrés de latex sont les seuls moyens efficaces pour s\'en protéger (fellation, pénétration, cunni, etc.)',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-externe.jpg"
  },
  {
    key: 76,
    id: 76,
    theme: 2,
    category: 5,
    question: 'Quelle différence entre VIH et SIDA ?',
    rightAnswer: 2,
    explanation: 'Le VIH (Virus de l\'Immunodéficience Humaine) attaque nos défenses. Au fil du temps, peuvent apparaitre des maladies de plus en plus graves qu\'on appelle le SIDA (Syndrome d\'Immuno Déficience Acquis). Une personne qui a le SIDA a forcément le VIH. Toutes les personnes infectées par le VIH n\u0092ont pas forcément développé le SIDA.',
    answers: [
      {
        id: 1,
        text: 'Ce sont deux IST différentes'
      },
      {
        id: 2,
        text: 'Même infection, stades différents'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-sida.jpg"
  },
  {
    key: 77,
    id: 77,
    theme: 2,
    category: 5,
    question: 'Si on est mineure et qu\'on veut avorter il faut l\'accord des parents ?\n',
    rightAnswer: 1,
    explanation: 'Il est recommandé d\'en parler à ses parents, mais ce n\'est pas une obligation ! Les jeunes filles mineures doivent être accompagnées par un majeur qu\'elles ont choisi. Elle peut se rendre dans un centre de planification familiale (CPEF) ou appeler le 0800 08 11 11 (numéro gratuit) pour info et conseils.',
    answers: [
      {
        id: 1,
        text: 'Non, pas du tout'
      },
      {
        id: 2,
        text: 'Oui, tu dois les informer'
      },
      {
        id: 3,
        text: 'Oui, il faut leur signature'
      }
    ],
    picture: "LPF-photoquiz-enceinte.jpg"
  },
  {
    key: 78,
    id: 78,
    theme: 2,
    category: 5,
    question: 'Si on a une IST on le sait forcément ?',
    rightAnswer: 2,
    explanation: 'Faux ! Les personnes porteuses d\'IST peuvent ne pas le savoir car il n\'y a pas forcément de symptômes visibles (pas de douleur, pas d\'odeurs, pas de gênes etc.). Ne pas hésiter à aller faire des dépistages pour ne pas contaminer d\'autres personnes, pour éviter des complications et se soigner si besoin ;) ',
    answers: [
      {
        id: 1,
        text: 'VRAI'
      },
      {
        id: 2,
        text: 'Faux!'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-IST2.jpg"
  },
  {
    key: 79,
    id: 79,
    theme: 2,
    category: 5,
    question: 'Porter 2 préservatifs en même temps ça protège 2 fois plus ?',
    rightAnswer: 2,
    explanation: 'Faux ! Ça pourrait le faire... mais non. On ne met qu\'un seul préservatif à la fois. En mettre 2 n\'augmente pas la protection mais peut occasionner des frictions et des déchirures du préservatif et dans ce cas, tout ça aura servi à rien.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas\n'
      }
    ],
    picture: "LPF-photoquiz-payant.jpg"
  },
  {
    key: 80,
    id: 80,
    theme: 2,
    category: 5,
    question: 'Le VIH/SIDA peut se transmettre par la salive ?',
    rightAnswer: 2,
    explanation: 'Faux ! Le VIH/SIDA peut être présent dans certains liquides du corps (sang, liquide séminal, sécrétions vaginales, lait maternel). II se transmet lors de rapports sexuels non protégés avec une personne séropositive, par transmission sanguine ou lors de la grossesse d\'une femme séropositive à son bébé. On ne peut pas transmettre le VIH/SIDA lors d\'un baiser.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-sida.jpg"
  },
  {
    key: 81,
    id: 81,
    theme: 2,
    category: 5,
    question: 'Le sperme contient quoi ?',
    rightAnswer: 2,
    explanation: 'Le sperme contient en petites quantités des nutriments et des protéines qui permettent de maintenir en vie les spermatozoïdes pour une courte durée. Attention, par contre si on a attrapé un virus (VIH, hépatites), il peut être présent dans le sperme et se transmettre lors des relations sexuelles. On a envie de dire : vive le préservatif !',
    answers: [
      {
        id: 1,
        text: 'des protéines en grande quantité'
      },
      {
        id: 2,
        text: 'parfois des virus'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-masturbationsperme.jpg"
  },
  {
    key: 82,
    id: 82,
    theme: 2,
    category: 5,
    question: 'On peut attraper une IST sans pénétration ?',
    rightAnswer: 1,
    explanation: 'Vrai ! Les IST peuvent se transmettre lors d\'une fellation, cunnilingus ou annulingus, lors de caresses, de frottements intimes, de contact entre muqueuses, y compris sans pénétration. Pour se protéger, on peut utiliser un carré de latex en le plaçant sur le sexe féminin ou sur l\'anus ou un préservatif lors d\'une fellation ou lors d\'une pénétration. ',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "ETS-photoquiz-orgamse.jpg"
  },
  {
    key: 83,
    id: 83,
    theme: 2,
    category: 5,
    question: 'Faut-il une ordonnance pour la contraception d\'urgence (pilule) ?',
    rightAnswer: 2,
    explanation: 'Faux ! La contraception d\'urgence sous forme de pilule est disponible en pharmacie, en centre de planification familiale (CPEF) ou auprès de l\'infirmière scolaire. Elle est gratuite et anonyme pour les mineures. Elle peut être délivrée avec ou sans ordonnance (remboursées à 60% avec une ordonnance). Il faut compter entre 3\u0080 et 7\u0080 si on a plus de 18 ans.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "ETS-photoquiz-traitement.jpg"
  },
  {
    key: 84,
    id: 84,
    theme: 2,
    category: 5,
    question: 'La pilule est le seul moyen de contraception existant ?',
    rightAnswer: 2,
    explanation: 'Faux ! Il existe beaucoup de moyens de contraception différents ce qui permet à chacun de choisir sa solution la plus adaptée. Il y a par exemple les stérilets, les patch, l\'implant, l\'anneau vaginal ou les préservatifs. Les préservatifs permettent en plus de se protéger des IST : attention à bien les utiliser ;)',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "ETS-photoquiz-traitement.jpg"
  },
  {
    key: 85,
    id: 85,
    theme: 2,
    category: 5,
    question: 'La pilule du lendemain est une contraception d\'urgence ?',
    rightAnswer: 1,
    explanation: 'Vrai ! Ce n\'est pas vraiment "du lendemain" car on peut la prendre jusqu\'à 3-5 jours après un rapport sexuel non ou mal protégé (si le préservatif a craqué par exemple). ll faut la prendre le plus rapidement possible pour éviter toute grossesse non désirée c\'est-à-dire pour éviter d\'être enceinte. Elle ne protège pas des infections sexuellement transmissibles. ',
    answers: [
      {
        id: 1,
        text: 'Ouaip'
      },
      {
        id: 2,
        text: 'Non'
      },
      {
        id: 3,
        text: 'Ça dépend'
      }
    ],
    picture: "ETS-photoquiz-traitement.jpg"
  },
  {
    key: 86,
    id: 86,
    theme: 2,
    category: 5,
    question: 'La pilule fait grossir ?',
    rightAnswer: 1,
    explanation: 'Certaines pilules peuvent faire grossir. C\u0092est pas automatique et ça ne concerne pas toutes les pilules. Si la pilule mentionne comme effet secondaire une possible prise de poids, il peut être recommandé d\u0092être plus vigilante et en parler avec un professionnel de santé (médecin, sage-femme, gynéco, etc.).    ',
    answers: [
      {
        id: 1,
        text: 'Vrai, parfois'
      },
      {
        id: 2,
        text: 'Vrai, toujours'
      },
      {
        id: 3,
        text: 'Jamais'
      }
    ],
    picture: "ETS-photoquiz-traitement.jpg"
  },
  {
    key: 87,
    id: 87,
    theme: 2,
    category: 5,
    question: 'La pilule protège des IST ?',
    rightAnswer: 3,
    explanation: 'Non, la pilule ne protège pas des infections sexuellement transmissibles. C\'est un moyen de contraception hormonal qui protège seulement du risque de grossesse. Le seul moyen de contraception qui protège aussi du VIH/sida et des autres IST, ce sont les préservatifs (externe et interne).',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Vrai mais pas celle d\'urgence'
      },
      {
        id: 3,
        text: 'Non'
      }
    ],
    picture: "ETS-photoquiz-traitement.jpg"
  },
  {
    key: 88,
    id: 88,
    theme: 2,
    category: 5,
    question: 'Le liquide pré-séminal peut provoquer une grossesse ?',
    rightAnswer: 2,
    explanation: 'A l\u0092état naturel, le liquide pré-séminal ne contient pas de spermatozoïdes. MAIS, il peut entraîner avec lui des spermatozoïdes qui étaient présents dans l\u0092urètre après une précédente éjaculation. De ce fait, une pénétration, même sans éjaculation peut parfois entraîner une grossesse.',
    answers: [
      {
        id: 1,
        text: 'Vrai de vrai, tout le temps'
      },
      {
        id: 2,
        text: 'Vrai, parfois'
      },
      {
        id: 3,
        text: 'Jamais'
      }
    ],
    picture: "DTC-photoquiz-masturbationsperme.jpg"
  },
  {
    key: 89,
    id: 89,
    theme: 2,
    category: 5,
    question: 'Pour un dépistage VIH/SIDA, il faut aller à l\'hôpital ?',
    rightAnswer: 2,
    explanation: 'Faux ! On peut faire un dépistage sans prescription ni passer par l\'hôpital. C\'est possible d\'en faire dans les CeGIDD, dans certains centres de planification familiale ou dans un laboratoire de biologie médicale (avec ou sans ordonnance). On peut aussi faire un dépistage soi-même avec un auto-test acheté en pharmacie ou dans certaines associations avec un TROD.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-sida.jpg"
  },
  {
    key: 90,
    id: 90,
    theme: 3,
    category: 1,
    question: 'Une fille peut bander ?',
    rightAnswer: 2,
    explanation: 'On peut dire que le clito "bande". Le pénis et le clitoris sont constitués des mêmes éléments. Lors de l\'excitation, ils se gorgent de sang, gonflent et durcissent de la même manière. La différence entre un clitoris au repos et en érection est flagrante ! Jettes y un coup d\'oeil ;)',
    answers: [
      {
        id: 1,
        text: 'Je sais pas'
      },
      {
        id: 2,
        text: 'Bah ouais'
      },
      {
        id: 3,
        text: 'Elle a pas de pénis...'
      }
    ],
    picture: "LPF - photo contenu - erectionfille.jpg"
  },
  {
    key: 91,
    id: 91,
    theme: 3,
    category: 1,
    question: 'L\'éjaculation féminine c\'est quoi ?',
    rightAnswer: 2,
    explanation: 'Une réalité. On parle parfois de « femmes fontaines ». Ce n\u0092est pas de l\u0092urine. La couleur, l\u0092odeur sont différentes (et le goût aussi aha!). Pourtant, le liquide sort un peu de la même manière. Chez certaines, cela se manifeste à chaque orgasme. Chez d\u0092autres, cela arrive de temps en temps, voire occasionnellement, ou pas du tout.  ',
    answers: [
      {
        id: 1,
        text: 'un mythe'
      },
      {
        id: 2,
        text: 'une réalité'
      },
      {
        id: 3,
        text: 'Les filles éjaculent ?!'
      }
    ],
    picture: "ETS-photoquiz-ejacfeminine.jpg"
  },
  {
    key: 92,
    id: 92,
    theme: 3,
    category: 1,
    question: 'La cyprine, c\'est quoi ?',
    rightAnswer: 2,
    explanation: 'La cyprine c\'est l\'autre petit nom de la mouille. C\'est le lubrifiant naturel du vagin qui facilite la pénétration lors d\u0092un rapport sexuel. Par contre, quand on utilise un préservatif masculin / externe, il faut ajouter du lubrifant, ça change la vie (en vrai, ça diminue les risques de rupture et augmente les sensations donc tout bénéf\'!)',
    answers: [
      {
        id: 1,
        text: 'Une IST'
      },
      {
        id: 2,
        text: 'Un lubrifiant naturel'
      },
      {
        id: 3,
        text: 'une pilule contraceptive'
      }
    ],
    picture: "LPF-photoquiz-huile.jpg"
  },
  {
    key: 93,
    id: 93,
    theme: 3,
    category: 1,
    question: 'C\'est quoi le vaginisme ?',
    rightAnswer: 3,
    explanation: 'Le vagin ne peut pas être trop petit car il s\u0092adapte à toutes les tailles. Le vaginisme désigne une contraction involontaire des muscles qui entourent le vagin rendant la pénétration impossible. Le pénis ne peut pas entrer et si on force, on peut ressentir alors de vives douleurs. Le mieux est d\'en parler avec son médecin.',
    answers: [
      {
        id: 1,
        text: 'quand le vagin est trop grand'
      },
      {
        id: 2,
        text: 'quand le vagin est trop petit'
      },
      {
        id: 3,
        text: 'aucun des deux'
      }
    ],
    picture: "ETS-photoquiz-vaginisme.jpg"
  },
  {
    key: 94,
    id: 94,
    theme: 3,
    category: 1,
    question: 'Si sur une vulve les petites lèvres sont plus longues que les grandes, c\'est normal ?',
    rightAnswer: 1,
    explanation: 'Oui tout est normal ! Selon les filles, les lèvres du sexe sont plus ou moins grandes, peuvent être asymétriques et de couleurs assez variées, du rose clair au marron plus ou moins foncé. Toutes les vulves sont belles, chacune à sa façon. ',
    answers: [
      {
        id: 1,
        text: 'Bah ouais, tout est normal'
      },
      {
        id: 2,
        text: 'Euh c\'est grave bizarre'
      },
      {
        id: 3,
        text: 'Je ne sais pas trop...'
      }
    ],
    picture: "LPF-photoquizz-erectionfille.jpg"
  },
  {
    key: 95,
    id: 95,
    theme: 3,
    category: 2,
    question: 'Orgasme / Jouissance : c\'est la même chose ?',
    rightAnswer: 3,
    explanation: 'Jouir n\'est pas orgasmer. La jouissance est un plaisir ressenti dans son corps. L\'orgasme est une jouissance intense qui fait perdre la perception des sens. La meilleure façon d\'avoir un orgasme c\'est de ne pas en faire une obsession ! Explorer sans se prendre la tête et se laisser aller.',
    answers: [
      {
        id: 1,
        text: 'Oui'
      },
      {
        id: 2,
        text: 'Kif-kif'
      },
      {
        id: 3,
        text: 'Faux'
      }
    ],
    picture: "LPF-photoquiz-orgasme.jpg"
  },
  {
    key: 96,
    id: 96,
    theme: 3,
    category: 2,
    question: 'Les femmes et les hommes peuvent avoir des orgasmes multiples (c\'est-à-dire successifs) ?',
    rightAnswer: 2,
    explanation: 'La plupart des femmes peuvent ressentir des orgasmes successifs. On les appelle orgasmes multiples. Alors que les hommes, après un orgasme, ont besoin d\'une période réfractaire plus ou moins longue : en gros, pendant ce temps, il aura du mal à bander. De toute façon, restons attentifs aux envies de nos partenaires même après avoir joui!\n',
    answers: [
      {
        id: 1,
        text: 'Oui c\'est vrai'
      },
      {
        id: 2,
        text: 'Non, faux'
      },
      {
        id: 3,
        text: 'Hein ?! C\'est quoi ça?'
      }
    ],
    picture: "LPF-photoquiz-orgasme.jpg"
  },
  {
    key: 97,
    id: 97,
    theme: 3,
    category: 2,
    question: 'Si elle ne mouille pas, c\'est qu\'elle ne veut pas avoir de rapports sexuels ?',
    rightAnswer: 2,
    explanation: 'Faux ! Chez la femme, cela peut prendre un peu de temps avant que la lubrification soit optimale. Elle peut avoir du désir sans mouiller tout de suite. Inversement, si une fille "mouille", cela ne veut pas non plus dire qu\'elle a absolument envie de faire l\'amour ou qu\'elle aime ça. Le mieux c\'est quand même de communiquer pour savoir :)',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'J\'en sais rien'
      }
    ],
    picture: "LPF-photoquiz-huile.jpg"
  },
  {
    key: 98,
    id: 98,
    theme: 3,
    category: 2,
    question: 'Être pansexuel\u0095le c\'est quoi ?',
    rightAnswer: 3,
    explanation: 'Être pansexuel\u0095le est le fait d\'être attiré\u0095e, sexuellement ou sentimentalement, par les personnes indifféremment de leur sexe, de leur genre ou de leur orientation. Les bisexuel\u0095les s\'intéressent à la fois aux hommes et aux femmes. Les pansexuel\u0095les eux sont attirés par les hommes, les femmes, les transgenres, etc.',
    answers: [
      {
        id: 1,
        text: 'Être bi'
      },
      {
        id: 2,
        text: 'Être échangiste'
      },
      {
        id: 3,
        text: 'Aucun des deux'
      }
    ],
    picture: "LPF-photoquiz-trans.jpg"
  },
  {
    key: 99,
    id: 99,
    theme: 3,
    category: 2,
    question: 'On peut fantasmer d\'avoir des rapports gays ou lesbiens en étant hétéro ?',
    rightAnswer: 1,
    explanation: 'Oui et c\'est ok. Certaines personnes ont des fantasmes qui ne collent pas avec leurs orientations sexuelles : par exemple, avoir des fantasmes gays / lesbiens, alors qu\u0092on est hétéro, ou le contraire. Les fantasmes, on n\u0092a pas forcément envie que ça se réalise ou on peut avoir vraiment très envie que ça se réalise. À chacun de se décider !',
    answers: [
      {
        id: 1,
        text: 'Oui'
      },
      {
        id: 2,
        text: 'Non'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-ejactorgasme.jpg"
  },
  {
    key: 100,
    id: 100,
    theme: 3,
    category: 2,
    question: 'L\'huile peut remplacer le lubrifiant ?',
    rightAnswer: 2,
    explanation: 'Faux ! Avec le préservatif, il est nécessaire d\'utiliser des lubrifiants (des gels à base d\'eau ou de silicone). Attention, l\'utilisation d\'huiles, de beurres, de crèmes peuvent irriter les parties génitales, fragiliser le préservatif... et du coup, le faire craquer, voire même le dissoudre.',
    answers: [
      {
        id: 1,
        text: 'Ouais, c\'est pareil'
      },
      {
        id: 2,
        text: 'Ah non !!!'
      },
      {
        id: 3,
        text: 'Je sais pas'
      }
    ],
    picture: "LPF-photoquiz-huile.jpg"
  },
  {
    key: 101,
    id: 101,
    theme: 3,
    category: 2,
    question: 'Être homo et être trans c\'est pareil ? ',
    rightAnswer: 2,
    explanation: 'L\'homosexualité est l\'attirance (sexuelle ou sentimentale) pour une personne de son sexe. Etre trans, c\'est sentir que le sexe avec lequel on est né n\'est pas le bon. C\'est se sentir profondément fille alors que l\'on est né garçon, ou se sentir profondément garçon alors que l\'on est né en fille. Ce sont 2 choses différentes mais trop souvent confondues. ',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-trans.jpg"
  },
  {
    key: 102,
    id: 102,
    theme: 3,
    category: 2,
    question: 'Préservatif externe est l\'autre nom du préservatif masculin ?',
    rightAnswer: 1,
    explanation: 'Vrai, il se déroule sur le pénis et est appelé préservatif externe ou « masculin ». Il existe en différentes tailles, effets ou matières (nervuré, ultra-fin, avec des goûts, latex ou pas). On peut l\'acheter en pharmacie, supermarché, sur Internet ou en avoir gratuitement dans certaines associations ou par ordonnance du médecin. Attention à vérifier la date de péremption !',
    answers: [
      {
        id: 1,
        text: 'Vrai '
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-externe.jpg"
  },
  {
    key: 103,
    id: 103,
    theme: 3,
    category: 2,
    question: 'Quand le\u0095la partenaire est trop excité\u0095e, il faut aller jusqu\'au bout ?',
    rightAnswer: 2,
    explanation: 'Faux ! L\u0092excitation sexuelle n\u0092a jamais « de point de non-retour », elle finit toujours par retomber et ne crée aucune séquelle sur le corps. Arrêter un rapport qui a commencé peut cependant générer de la frustration qu\'il faut apprendre à gérer pour respecter la volonté du ou de la partenaire.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-excite.jpg"
  },
  {
    key: 104,
    id: 104,
    theme: 3,
    category: 2,
    question: 'Faire une fellation ou cunnilingus est le fantasme le plus fréquent ?',
    rightAnswer: 2,
    explanation: 'Faire une fellation ou un cunnilingus fait partie des fantasmes habituels et fréquents. D\'autres fanstasmes fréquents incluent avoir des sentiments pour le ou la partenaire (eh ouais on vous voit les romantiques!), avoir des rapports dans un lieu qui sort de l\'ordinaire, les fessées, les sextos... ',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux '
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-orgasme.jpg"
  },
  {
    key: 105,
    id: 105,
    theme: 3,
    category: 2,
    question: 'Pourquoi les hétéro sont hétéro ?',
    rightAnswer: 3,
    explanation: 'On ne peut pas répondre à cette question, tout comme on ne peut pas dire pourquoi certaines personnes sont homosexuel\u0095le, pansexuel\u0095le, bisexuel\u0095le... L\'orientation sexuelle relève de la vie privée. Chacun\u0095e est libre de faire ce qu\'il veut en respectant les droits humains et le consentement.',
    answers: [
      {
        id: 1,
        text: 'Normal'
      },
      {
        id: 2,
        text: 'Bizarre'
      },
      {
        id: 3,
        text: 'Lol'
      }
    ],
    picture: "DTC-photoquiz-homosexuel.jpg"
  },
  {
    key: 106,
    id: 106,
    theme: 3,
    category: 3,
    question: 'Les fouf aussi pètent ?',
    rightAnswer: 3,
    explanation: 'Le pet vaginal, en gros, c\'est de l\'air qui sort du vagin. C\'est surprenant ! et parfois gênant... lorsqu\'on a un rapport. Le vagin n\u0092est pas en lien avec l\u0092appareil digestif. Le pet vaginal n\u0092a pas d\u0092odeur ;). Il survient lorsqu\u0092il y a eu une entrée d\u0092air dans le vagin lors d\u0092un rapport sexuel. Certaines positions le favorisent.',
    answers: [
      {
        id: 1,
        text: 'Il faut consulter un gynéco'
      },
      {
        id: 2,
        text: 'Tu bouffes trop mcdo'
      },
      {
        id: 3,
        text: 'Tranquille, ça arrive, c\'est rien'
      }
    ],
    picture: "LPF-photoquiz-erectionfille.jpg"
  },
  {
    key: 107,
    id: 107,
    theme: 3,
    category: 3,
    question: 'L\'ouvrage original du Kama-Sutra recense combien de positions sexuelles ?',
    rightAnswer: 3,
    explanation: 'La position 69 en fait partie ;)',
    answers: [
      {
        id: 1,
        text: '120'
      },
      {
        id: 2,
        text: '72'
      },
      {
        id: 3,
        text: '64'
      }
    ],
    picture: "LPF-photoquiz-kama.jpg"
  },
  {
    key: 108,
    id: 108,
    theme: 3,
    category: 3,
    question: 'Un musée du phallus, ça existe ?',
    rightAnswer: 3,
    explanation: 'En Islande, il y a un musée national des phallus ! Dans d\'autres pays, on trouve des musées érotiques ou des musées du sexe.',
    answers: [
      {
        id: 1,
        text: 'N\'importe quoi'
      },
      {
        id: 2,
        text: 'Oui, en France'
      },
      {
        id: 3,
        text: 'Oui, ailleurs'
      }
    ],
    picture: "ETS-photoquiz-musée.jpg"
  },
  {
    key: 109,
    id: 109,
    theme: 3,
    category: 3,
    question: 'Le vagin a le pH de quoi ?',
    rightAnswer: 1,
    explanation: 'Le pH moyen d\'un vagin équilibré se situe entre  4 et 4,5, soit à peu près comme une bière. Santé !',
    answers: [
      {
        id: 1,
        text: 'La bière'
      },
      {
        id: 2,
        text: 'La javel'
      },
      {
        id: 3,
        text: 'Le vinaigre ménager'
      }
    ],
    picture: "LPF-photoquiz-ph.jpg"
  },
  {
    key: 110,
    id: 110,
    theme: 3,
    category: 4,
    question: 'Le consentement donné, par exemple "je suis d\'accord", peut parfois être considéré comme nul ?',
    rightAnswer: 1,
    explanation: 'Oui, ça dépend du contexte. La loi estime qu\u0092il n\u0092y a pas de consentement lorsqu\u0092il est donné après usage de violence, contrainte, menace ou surprise.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "ETS-photoquiz-consentementnul.jpg"
  },
  {
    key: 111,
    id: 111,
    theme: 3,
    category: 4,
    question: 'Le consentement est automatique dans un couple marié ?',
    rightAnswer: 2,
    explanation: 'Le viol entre époux est possible (oui, c\'est dans le code pénal, article 222-22). Dans un couple marié on présume qu\'il y a consentement à l\u0092acte sexuel jusqu\u0092à preuve du contraire.',
    answers: [
      {
        id: 1,
        text: 'Bah oui, ils sont mariés'
      },
      {
        id: 2,
        text: 'Non, c\'est faux'
      },
      {
        id: 3,
        text: 'Je sais pas'
      }
    ],
    picture: "ETS-photoquiz-couple.jpg"
  },
  {
    key: 112,
    id: 112,
    theme: 3,
    category: 4,
    question: 'Si on est presque à l\'orgasme, on peut finir même si le\u0095la partenaire veut plus trop ?',
    rightAnswer: 2,
    explanation: 'Le consentement est donné pour un acte mais il peut à tout moment être retiré. Dans ce cas-là, continuer le rapport sexuel est constitutif d\u0092un viol. Si un partenaire veut arrêter, à n\'importe quel moment, quelle que ce soit la raison, on arrête. En cas de violences sexuelles, on peut appeler le 3919 pour recevoir conseils, aide et information.',
    answers: [
      {
        id: 1,
        text: 'Oui'
      },
      {
        id: 2,
        text: 'Non'
      },
      {
        id: 3,
        text: 'Ça dépend'
      }
    ],
    picture: "ETS-photoquiz-fraise.jpg"
  },
  {
    key: 113,
    id: 113,
    theme: 3,
    category: 4,
    question: 'On peut coucher avec une personne très bourrée vu qu\u0092elle ne pas dit non ?',
    rightAnswer: 2,
    explanation: 'Une personne peut consentir mais sans être en capacité de le faire en raison de son état d\u0092ébriété (parce qu\'elle est trop bourré.e). Dans ce cas, c\u0092est comme si il n\u0092y avait pas eu de consentement et le rapport est un viol. En cas de violences sexuelles, on peut appeler le 3919 pour recevoir conseils, aide et info.',
    answers: [
      {
        id: 1,
        text: 'Ouais, si elle a bu deux verres'
      },
      {
        id: 2,
        text: 'Non, vaut mieux pas'
      },
      {
        id: 3,
        text: 'Oui, elle semble ok'
      }
    ],
    picture: "ETS-photoquiz-fraise.jpg"
  },
  {
    key: 114,
    id: 114,
    theme: 3,
    category: 4,
    question: 'Avoir un orgasme pendant un rapport non consenti, c\u0092est la preuve du consentement ?',
    rightAnswer: 3,
    explanation: 'L\u0092orgasme peut être un moyen de défense adopté par ton corps lors du rapport sexuel non consenti. Cela reste un viol car il n\u0092y a pas eu de consentement à l\u0092acte, même s\'il y a orgasme, même s\'il y a mouille ou même s\'il ya érection, par exemple. En cas de violences sexuelle, on peut appeler le 3919 pour recevoir conseils, aide et info.',
    answers: [
      {
        id: 1,
        text: 'Oui, on a changé d\'avis'
      },
      {
        id: 2,
        text: 'Oui'
      },
      {
        id: 3,
        text: 'Non'
      }
    ],
    picture: "ETS-photoquiz-consentement.jpg"
  },
  {
    key: 115,
    id: 115,
    theme: 3,
    category: 5,
    question: 'La syphillis c\'est quoi ?',
    rightAnswer: 2,
    explanation: 'La syphilis est une infection bactérienne responsable de lésions de la peau et des muqueuses. Elle peut toucher de nombreux organes et favorise la transmission du VIH. Déspitée tôt, on peut la traiter efficacement par antibiotique chez la personne infectée et ses partenaires. Le port du préservatif (ou l\'usage d\'un carré de latex) permet de s\'en protéger. ',
    answers: [
      {
        id: 1,
        text: 'Une IST disparue'
      },
      {
        id: 2,
        text: 'Une IST en augmentation'
      },
      {
        id: 3,
        text: 'Un champignon'
      }
    ],
    picture: "LPF-photoquiz-IST.jpg"
  },
  {
    key: 116,
    id: 116,
    theme: 3,
    category: 5,
    question: 'Pas besoin de préservatifs sur les sex toys ?',
    rightAnswer: 1,
    explanation: 'Si on utilise un ou des sex toys à plusieurs, il est important de mettre un préservatif par personne et par orifice. Il peut y avoir transmission d\'IST. Si on l\'utilise solo, on ne peut pas attraper d\'IST mais des microbes s\'il n\'est pas bien lavé. Mieux vaut se laver après chaque usage, à l\'eau et au savon. Et faire la même chose pour ses mains :)',
    answers: [
      {
        id: 1,
        text: 'Faux, il y a risque d\'IST'
      },
      {
        id: 2,
        text: 'Vrai, pas besoin'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "ETS-photoquiz-sextoy.jpg"
  },
  {
    key: 117,
    id: 117,
    theme: 3,
    category: 5,
    question: 'Après un risque, il y a un traitement qui réduit la probabilité d\'une contamination VIH ?',
    rightAnswer: 1,
    explanation: 'Vrai de vrai. Si on pense avoir été exposé.e au VIH, on peut prendre un traitement qui empêche la multiplication du virus. Ce traitement, appelé TPE (traitement post-exposition), doit être pris le plus tôt possible, dans les 48h après la prise de risque, pour diminuer la probabilité d\u0092une contamination. On le trouve aux urgences de l\'hôpital ou en CeGIDD.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "ETS-photoquiz-traitement.jpg"
  },
  {
    key: 118,
    id: 118,
    theme: 3,
    category: 5,
    question: 'L\'herpès génital touche combien de personnes en France ?',
    rightAnswer: 3,
    explanation: 'Environ 2 millions de personnes sont touchées par l\'herpès génital en France. Il peut rester endormi pendant des années puis apparaître plus tard. Il est très contagieux pendant les poussées qui se manifestent par des picotements, des vésicules, des brûlures, des blessures près des organes génitaux. Un traitement existe pour empêcher les poussées.',
    answers: [
      {
        id: 1,
        text: '10 000'
      },
      {
        id: 2,
        text: '750 000 '
      },
      {
        id: 3,
        text: '2 millions'
      }
    ],
    picture: "ETS-photoquiz-herpes.jpg"
  },
  {
    key: 119,
    id: 119,
    theme: 3,
    category: 5,
    question: 'Le TROD c\'est quoi ?',
    rightAnswer: 3,
    explanation: 'Le test rapide d\'orientation diagnostique (TROD) est anonyme et gratuit. Il est proposé par des associations habilitées au dépistage. Avec une goutte de sang recueillie au bout du doigt, le TROD permet d\u0092obtenir un résultat en 30 min. Attention : son résultat est valable 3 mois après la dernière prise du risque.',
    answers: [
      {
        id: 1,
        text: 'Un moyen de soigner le VIH'
      },
      {
        id: 2,
        text: 'Un auto-test'
      },
      {
        id: 3,
        text: 'Aucun des deux'
      }
    ],
    picture: "LPF-photoquiz-sida.jpg"
  },
  {
    key: 120,
    id: 120,
    theme: 3,
    category: 5,
    question: 'Quand on a une IST, est-ce qu\'il faut en parler à ses anciens ou futurs partenaires ?',
    rightAnswer: 3,
    explanation: 'En plus de symptômes qui peuvent désagréables, les IST peuvent entraîner des complications comme la stérilité, le cancer du col de l\'utérus, et autre. Elles ne se guérissent pas toutes seules et nécessitent un traitement. Il faut prévenir ses partenaires afin qu\'ils puissent se faire dépister, se soigner si besoin et ne pas contaminer d\'autres personnes.',
    answers: [
      {
        id: 1,
        text: 'Oui, aux nouveaux seulement'
      },
      {
        id: 2,
        text: 'Non, surtout pas'
      },
      {
        id: 3,
        text: 'Oui, à tous'
      }
    ],
    picture: "LPF-photoquiz-IST.jpg"
  },
  {
    key: 121,
    id: 121,
    theme: 3,
    category: 5,
    question: 'Les HPV se transmettent aussi par le sang ?',
    rightAnswer: 2,
    explanation: 'Non, contrairement au VIH, il ne se transmet pas par le sang. Le HPV peut se transmettre lors de rapports sexuels ou par contacts directs peau à peau (se toucher, s\u0092embrasser). Il est contagieux et fréquent. Le plus souvent, nos défenses l\'éliminent seules. Mais il peut parfois créer des lésions (condylomes). Le mieux, c\'est de consulter un médecin en cas de doute ;)',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Arrête de dire des conneries'
      },
      {
        id: 3,
        text: 'C\'est quoi les HPV ?'
      }
    ],
    picture: "LPF-photoquiz-IST.jpg"
  },
  {
    key: 122,
    id: 122,
    theme: 3,
    category: 5,
    question: 'Les chlamydia peuvent rendre stérile ?',
    rightAnswer: 3,
    explanation: 'Une infection à chlamydia non soignée peut provoquer la stérilité chez les femmes ET les hommes. C\u0092est l\u0092IST la plus fréquente chez les jeunes et est souvent sans symptômes, d\'où l\'importance du dépistage (eh ouaaais!). Pas de panique, détectée tôt, le traitement est efficace (à faire chez les deux partenaires). Elle se transmet lors de rapports non protégés.',
    answers: [
      {
        id: 1,
        text: 'Les filles seulement'
      },
      {
        id: 2,
        text: 'C\'est faux '
      },
      {
        id: 3,
        text: 'Les filles et les garçons'
      }
    ],
    picture: "ETS-photoquiz-herpes.jpg"
  },
  {
    key: 123,
    id: 123,
    theme: 3,
    category: 5,
    question: 'Une IVG c\'est une intention volontaire de grossesse ?',
    rightAnswer: 2,
    explanation: 'Interruption Volontaire de Grossesse. Quand une fille est enceinte et ne souhaite pas poursuivre sa grossesse, elle peut y avoir recours à condition de respecter les délais. En France les IVG sont autorisées jusqu\'à 12 semaines de grossesse. Elles sont pratiquées gratuitement pour les mineures et pris en charge à 100% pour les majeures (et dans le cadre du secret médical).',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-enceinte.jpg"
  },
  {
    key: 124,
    id: 124,
    theme: 3,
    category: 5,
    question: 'S\'épiler la fouf, c\'est quand même plus hygiénique, non ?',
    rightAnswer: 2,
    explanation: 'Faux ! S\'épiler est un choix personnel et ce n\'est pas forcément plus hygiénique. En fait, l\'hygiène n\'a rien à voir avec les poils. Les poils ne protègent pas contre les infections sexuellement transmissibles. En dehors de l\'hygiène intime, de ton corps, de tes mains, qui sont recommandées : chacun fait ce qu\'il veut avec ses poils !',
    answers: [
      {
        id: 1,
        text: 'C\'est sûr, c\'est plus propre'
      },
      {
        id: 2,
        text: 'Faux, faux, fauuuuuuuuuuuuuuux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-poils.jpg"
  },
  {
    key: 125,
    id: 125,
    theme: 3,
    category: 5,
    question: 'On peut utiliser un préservatif interne ("féminin" et externe ("masculin" en même temps ?',
    rightAnswer: 2,
    explanation: 'Ne jamais utiliser un préservatif exterrne ("masculin" et un préservatif interne ("féminin" en même temps. Ça risquerait de les déchirer. Petite astuce pour le préservatif interne : bien frotter l\'emballage entre les mains avant de l\u0092ouvrir pour bien répartir le lubrifiant.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-externe.jpg"
  },
  {
    key: 126,
    id: 126,
    theme: 3,
    category: 5,
    question: 'Une pénétration sans éjaculation peut entraîner une grossesse ?',
    rightAnswer: 1,
    explanation: 'A l\u0092état naturel, le liquide pré-séminal ne contient pas de spermatozoïdes. MAIS, il peut entraîner avec lui des spermatozoïdes qui étaient présents dans l\u0092urètre après une précédente éjaculation. De ce fait, une pénétration, même sans éjaculation peut parfois entraîner une grossesse.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-enceinte.jpg"
  },
  {
    key: 127,
    id: 127,
    theme: 3,
    category: 5,
    question: 'Après une pénétration anale protégée, on peut enchaîner sur une pénétration bucale ou vaginale ?',
    rightAnswer: 1,
    explanation: 'Vrai ! Rien n\'empêche d\'avoir plusieurs pratiques sexuelles d\'affilées si l\'envie est présente. Mais il faut toujours utiliser le préservatif exerne ou interne, et le changer pour chaque type de pénétration même s\'il n\'y a pas eu d\'éjaculation, même si on utilise un sex toy. Sinon, on risque IST ou germes fécaux donc, on évite. ',
    answers: [
      {
        id: 1,
        text: 'Vrai, si on change de préservatif'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Faux, berrrrk'
      }
    ],
    picture: "LPF-photoquiz-kama.jpg"
  },
  {
    key: 128,
    id: 128,
    theme: 3,
    category: 5,
    question: 'La chaude-pisse c\'est quoi ?',
    rightAnswer: 3,
    explanation: 'C\'est une infection d\u0092origine bactérienne. Elle provoque des brûlures ou un écoulement jaune par la verge, le vagin ou l\'anus. Cette infection se transmet lors de rapports sexuels, bucco-génitaux (bouche-parties génitales), vaginaux ou anaux. Un traitement par antibiotiques permet une guérison rapide.',
    answers: [
      {
        id: 1,
        text: 'du pipi chaud'
      },
      {
        id: 2,
        text: 'après avoir pris froid'
      },
      {
        id: 3,
        text: 'la gonnococcie ou gonorrhée'
      }
    ],
    picture: "LPF-photoquiz-IST.jpg"
  },
  {
    key: 129,
    id: 129,
    theme: 3,
    category: 5,
    question: 'Si on est lesbienne, on ne peut pas attraper d\'IST ?',
    rightAnswer: 2,
    explanation: 'La majorité des IST se contracte par un échange de fluides entre partenaires. Les femmes ayant des rapports lesbiens peuvent transmettre ou contracter des IST à travers les échanges de cyprine, via des frottements génitaux ou via des pénétrations avec des doigts ou objets non protégés et partagés.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "DTC-photoquiz-IST.jpg"
  },
  {
    key: 130,
    id: 130,
    theme: 3,
    category: 5,
    question: 'On peut faire l\'amour pendant ses règles oklm sans risque d\'être enceinte ?',
    rightAnswer: 2,
    explanation: 'C\'est faux. Les saignements ne sont pas favorables aux spermatozoïdes mais il n\'est pas impossible d\'être enceinte à la suite. L\'ovulation peut se déclencher très tôt après les règles et les spermatozoïdes ont une durée de vie de quelques jours : donc, c\'est possible d\'être enceinte suite à des rapports pendant les règles (sauf si on a un moyen de contraception)',
    answers: [
      {
        id: 1,
        text: 'Ouais tranquille'
      },
      {
        id: 2,
        text: 'Archi-faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-regles.jpg"
  },
  {
    key: 131,
    id: 131,
    theme: 3,
    category: 5,
    question: 'Le dépistage du VIH/SIDA se fait obligatoirement à l\'hôpital ?',
    rightAnswer: 2,
    explanation: 'Faux ! On peut faire un dépistage sans prescription ni passer par l\'hôpital. C\'est possible d\'en faire dans les CeGIDD, dans certains centres de planification familiale ou dans un laboratoire de biologie médicale (avec ou sans ordonnance). On peut aussi faire un dépistage soi-même avec un auto-test acheté en pharmacie ou dans certaines associations avec un TROD.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-sida.jpg"
  },
  {
    key: 132,
    id: 132,
    theme: 3,
    category: 5,
    question: 'Toutes les personnes qui ont le VIH ont le SIDA ?',
    rightAnswer: 2,
    explanation: 'Le VIH (Virus de l\'Immunodéficience Humaine) attaque nos défenses. Au fil du temps, peuvent apparaitre des maladies de plus en plus graves qu\'on appelle le SIDA (Syndrome d\'Immuno Déficience Acquis). Une personne qui a le SIDA a forcément le VIH. Toutes les personnes infectées par le VIH n\u0092ont pas forcément développé le SIDA.',
    answers: [
      {
        id: 1,
        text: 'Vrai'
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-sida.jpg"
  },
  {
    key: 133,
    id: 133,
    theme: 3,
    category: 5,
    question: 'Une IST peut se révéler plusieurs années après la contamination ?',
    rightAnswer: 2,
    explanation: 'Un germe peut se multiplier discrètement pendant plusieurs années avant de se manifester voire se transmettre. Votre dernier partenaire n\'est pas forcément responsable d\'une découverte récente. Dans le doute, il faut aller faire un dépistage ou poser la question à un\u0095e professionnel\u0095le de santé.',
    answers: [
      {
        id: 1,
        text: 'Vrai '
      },
      {
        id: 2,
        text: 'Faux'
      },
      {
        id: 3,
        text: 'Je ne sais pas'
      }
    ],
    picture: "LPF-photoquiz-IST.jpg"
  }
];

export default questions;


export default questions;