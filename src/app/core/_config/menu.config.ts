export class MenuConfig {
    public defaults: any = {
        header: {
            self: {},
            items: [],
        },
        aside: {
            self: {},
            items: [
                // {
                //   title: 'Dashboard',
                //   root: true,
                //   icon: 'flaticon2-architecture-and-city',
                //   page: '/dashboard',
                //   translate: 'MENU.DASHBOARD',
                //   bullet: 'dot',
                // },
                // {
                //   title: 'Layout Builder',
                //   root: true,
                //   icon: 'flaticon2-expand',
                //   page: '/builder'
                // },
                { section: "MENUS GENERALS" },
                
                {
                    title: "Dashboard",
                    bullet: "dot",
                    icon: "flaticon2-shopping-cart",
                    root: true,
                    submenu: [
                        {
                            title: "Dashboard",
                            page: "/dashboard/manager-dashboard",
                        },
                        
                    ],
                },
                {
                    title: "Paramétrages",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon2-delivery-truck",
                    submenu: [
                        {
                            title: "Ajouter Peniche",
                            page: "/peniche/create",
                        },
                        {
                            title: "List des Peniche",
                            page: "/peniche/list",

                        },
                        {
                            title: "Maint des Devises",
                            page: "/devise/create-devise",
                        },
                        {
                            title: "Liste des Devises",
                            page: "/devise/list-devise",
                        },
                        {
                            title: "Maint des Taux de Changes",
                            page: "/devise/exchange-rate",
                        },
                        {
                            title: 'Maint des Banques',
                            page: '/accounting-setting/create-bank',
                        },
                        {
                            title: 'Liste des Banques',
                            page: '/accounting-setting/bank-list',
                        },
                        {
                            title: "Maint code-mstr",
                            page: "/code-mstr/create-code",
                        },
                        {
                            title: "Liste des codes",
                            page: "/code-mstr/codes-list",
                        },
                        {
                            title: "Maint des sequence",
                            page: "/purchasing/create-sequence",
                        },
                        {
                            title: "Liste des sequence",
                            page: "/purchasing/list-sequence",
                        },
                        {
                            title: 'Maint des Taxes',
                            page: '/accounting-setting/create-tax',
                        },
                        {
                            title: 'Liste des Taxes',
                            page: '/accounting-setting/taxes-list',
                        },

        
                     /*   {
                            title: "Configuration Module",
                            page: "/config/maint-config",
                        },*/
                    ]
                },

                {
                    title: "Gestion des Montures",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon2-delivery-truck",
                    submenu: [
                        {
                            title: "La liste des Monture",
                            page: "/articles/list",
                        },
                        {
                            title: "Ajouter Monture",
                            page: "/articles/add",
                        },
                        {
                            title: "Réception Monture",
                            page: "/inventory-transaction/po-receip",
                        },
                        {
                            title: "Consultation Stocks Monture ",
                            page: "/inventory-transaction/inventory-list",
                        },
                        {
                            title: "Inventaire Montures ",
                            page: "/inventory-transaction/create-mn-inv",
                        },

                    ],
                },

                {
                    title: "Gestion des Verres et lentille",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon2-box-1",
                    submenu: [
                        {
                            title: "La liste des Verres et Lentilles",
                            page: "/articles/list-glasses",
                        },
                        {
                            title: "Ajouter des Verres / Lentille",
                            page: "/articles/create-glasses",
                        },
                        {
                            title: "Réception Verres / Lentilles",
                            page: "/inventory-transaction/gls-receip",
                        },
                        {
                            title: "Consultation Stock Verres / Lentilles",
                            page: "/inventory-transaction/invgls-list",
                        },
                        {
                            title: "Inventaire Verres / Lentilles ",
                            page: "/inventory-transaction/create-gls-inv",
                        },
                        
                    ],
                },
                {
                    title: "Gestion des Accessoires",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon2-box-1",
                    submenu: [
                        {
                            title: "La liste des Accessoires",
                            page: "/articles/list-acs",
                        },
                        {
                            title: "Ajouter Accessoire",
                            page: "/articles/create-acs",
                        },
                        {
                            title: "Réception Accessoires",
                            page: "/inventory-transaction/acs-receip",
                        },
                        {
                            title: "Consultation Stock Accessoire ",
                            page: "/inventory-transaction/invacs-list",

                        },
                        {
                            title: "Inventaire Accessoire ",
                            page: "/inventory-transaction/create-acs-inv",
                        },
                    ],
                },

/*                {
                    title: "Gestion des Produits",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon2-delivery-truck",
                    submenu: [

                        
                    ]
                },
  */              
                {
                    title: "Gestion des Docteurs",
                    bullet: "dot",
                    icon: "flaticon2-box-1",
                    root: true,
                    submenu: [
                        {
                            title: "La liste des Docteurs",
                            page: "/doctor/list",
                        },
                        {
                            title: "Ajouter Docteur",
                            page: "/doctor/create",
                        },
                       

                    ],
                },

                {
                    title: "Gestion des Fournisseurs",
                    bullet: "dot",
                    icon: "flaticon2-shopping-cart",
                    root: true,
                    submenu: [
                       /* {
			                title: "La liste des achats par Fournisseur",
			                page: "/providers/itembyproviderlist",
                        },
                        {
			                title: "Activité Fournisseur",
			                page: "/providers/provider-activitylist",
                        },
                        {
			                title: "Chiffre d'affaire par Fournisseur",
			                page: "/providers/provider-calist",
                        },*/

                        {
                            title: "La liste des Fournisseurs",
                            page: "/providers/list",
                        },
                        {
                            title: "Ajouter Fournisseurs",
                            page: "/providers/add",
                        },
                        {
                            title: "Paiement des Fournisseurs",
                            page: "/purchasing/pay-prh",
                        },
                        
                    ],
                },
                {
                    title: "Gestion des Clients",
                    bullet: "dot",
                    icon: "flaticon2-shopping-cart",
                    root: true,
                    submenu: [
                        {
                            title: "La liste des Clients",
                            page: "/customers/customer-list",
                        },
                        {
                            title: "Ajouter Clients",
                            page: "/customers/customer-create",
                        },


                      /*  {
						    title: "La liste des ventes par clients",
						    page: "/customers/caby-itemlist",
                        },
                        {
                            title: "Activité clients",
                            page: "/customers/Customer-activitylist",
                        },
                        {
                            title: "Soldes clients",
                            page: "/customers/Customer-soldelist",
                        },
                        {
                            title: "Chiffre d'affaires par clients",
                            page: "/customers/Customer-calist",
                        },*/
                    ],
                },
                
                
                /*{
                    title: "Gestion Stock",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon2-delivery-truck",
                    submenu: [
                        {
                            title: "Réception OA",
                            page: "/inventory-transaction/po-receip",
                        },
                        {
                            title: "Transfert Article",
                            page: "/inventory-transaction/transfer",
                        },
                        {
                            title: "Sortie non Planifiée ",
                            page: "/inventory-transaction/unplanified-issue",
                        },
                        {
                            title: "Entrée non Planifiée ",
                            page: "/inventory-transaction/unplanified-recept",
                        },
                        {
                            title: "Modification Statut Stock ",
                            page: "/inventory-transaction/edit-status",
                        },
                        
                        {
                            title: "Consultation Stocks ",
                            page: "/inventory-transaction/inventory-list",
                        },
                        {
                            title: "Consultation des Transactions ",
                            page: "/inventory-transaction/transaction-list",
                        },
                        {
                            title: "Etat du Stock A date",
                            page: "/inventory-management/inventory-of-date",
                        },
                        {
                            title: "Journal des stocks",
                            page: "/inventory-management/inventory-activitylist",
                        },
                        {
                            title: "Etat du Stock par Emplacement",
                            page: "/inventory-management/inventory-byloclist",
                        },
                        {
                            title: "Etat du Stock par Statut",
                            page: "/inventory-management/inventory-bystatuslist",
                        },
                        {
                            title: "Etat du Stock sous sécurité",
                            page: "/inventory-management/out-of-stocklist",
                        },
                        {
                            title: 'Gestion des inventaires',
                            submenu:[
                                {
                                    title: "Generation liste d’inventaire",
                                    page: "/inventory-management/physical-inventory-tag",
                                },
                                {
                                    title: "Menu gel des stocks",
                                    page: "/inventory-management/freeze-inventory",
                                },
                                {
                                    title: "Saisie inventaire",
                                    page: "/inventory-management/physical-inventory-tag-entry",
                                },
                                {
                                    title: "Analyse des ecarts",
                                    page: "/inventory-management/tag-gap-analysis",
                                },
                                {
                                    title: "ReSaisie inventaire",
                                    page: "/inventory-management/physical-inventory-tag-reentry",
                                },
                                {
                                    title: "Validation inventaire",
                                    page: "/inventory-management/validate-tag",
                                },
                            ]
                        }
                    ]
                },
                
                */
                {    
                    title: "Gestion des achats",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon-cart",
                    submenu: [
                  /*      {
                            title: "Demande d'achats",
                            page: "/purchasing/create-req",
                        },
                        {
                            title: "Liste des Demande d'achats",
                            page: "/purchasing/req-list",
                        },
                        {
                            title: "Approbation Demande",
                            page: "/purchasing/purchase-order-approval",
                        },
                        {
                            title: "Offre Fournisseurs",
                            page: "/purchasing/create-vendor-proposal",
                        },
                        {
                            title: "Liste des Offre Fournisseurs",
                            page: "/purchasing/vp-list",
                        },
                        {
                            title: "Tableau comparatif des offre",
                            page: "/purchasing/vendor-propsal-comparaison",
                        },*/
                        {
                            title: "Bon de commande",
                            page: "/purchasing/create-po",
                        },
                        {
                            title: "Impression Bon de commande",
                            page: "/purchasing/print-po",
                        },
                        {
                            title: "Liste des Bon de commande",
                            page: "/purchasing/po-list",
                        },
                        {
                            title: "Edit Status BC",
                            page: "/purchasing/edit-status-po",
                        },
                        {
                            title: "Consultations des commandes",
                            page: "/purchasing/purchase-list",
                        }, 
                    ],
                },

                {    
                    title: "Gestion des Ventes",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon-cart",
                    submenu: [
                        {
                            title: "Ajouter Visite",
                            page: "/auth/login-so",
                        },
                        /*{
                            title: "Offres Commerciales",
                            page: "/Sales/create-quote",
                        },
                        {
                            title: "Liste des Offres",
                            page: "/Sales/req-list",
                        },
                        {
                            title: "Confirmation Offre",
                            page: "/Sales/purchase-order-approval",
                        },
                       {
                            title: "Commande Clients",
                            page: "/Sales/create-so",
                        },
                        {
                            title: "Débloque commande",
                            page: "/Sales/unblock-so",
                        },
                        {
                            title: "Confirmation commande",
                            page: "/Sales/confirm-so",
                        },
                        {
                            title: "Liste des Commandes",
                            page: "/Sales/so-list",
                        },
                        {
                            title: "Génération des BL",
                            page: "/Sales/create-psh",
                        },*/
                        {
                            title: "Liste des Commandes aujourd'hui",
                            page: "/Sales/list-so",
                        },
                        {
                            title: "Liste des Vente de Verres",
                            page: "/Sales/sopurchase",
                        },
                        {
                            title: "Paiement Client",
                            page: "/Sales/payment-psh",
                        },
                        {
                            title: "Historique Client",
                            page: "/Sales/cust-hist",
                        },
                        {
                            title: "Liberation Peniche",
                            page: "/Sales/lib-pen",
                        },
                        {
                            title: "Facturation ",
                            page: "/Sales/create-invoice",
                        },
                        {
                            title: "Vente Journaliere ",
                            page: "/Sales/create-direct-invoice",
                        },
                        {
                            title: "Avoir Client ",
                            page: "/Sales/undo-so",
                        },
                        // {
                        //     title: "Liste des Ventes par Vendeur ",
                        //     page: "/Sales/list-so-user",
                        // },
                        // {
                        //     title: "Rapport des Ventes par Client ",
                        //     page: "/Sales/list-ca",
                        // },
                     /*   {
                            title: "Facture Projet ",
                            page: "/Sales/create-project-invoice",
                        },
                        {
                            title: "Impression Facture en Attente ",
                            page: "/Sales/print-invoice",
                        },
                        {
                            title: "Imputation Facture ",
                            page: "/Sales/input-invoice",
                        },
                        {
                            title: "Liste des Factures",
                            page: "/Sales/invoice-list",
                        }*/
                    ],
                },
              /*  {
                    title: "Paiement Client",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon2-delivery-truck",
                    submenu: [
                        {
                            title: "Maint des Paiement",
                            page: "/account-receivable/create-account-receivable",
                        },
                        {
                            title: "Liste des Paiement",
                            page: "/account-receivable/list-payment",
                        },
                        {
                            title: "Paiement à Rapproché",
                            page: "/account-receivable/list-payment-rap",
                        },
                        {
                            title: "Maint des Notes de Débit",
                            page: "/account-receivable/create-note",
                        },
                        {
                            title: "Journal Client",
                            page: "/account-receivable/edit-journal",
                        },
                    ]
                },
                {
                    title: "Paiement Fournisseur",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon2-delivery-truck",
                    submenu: [
                        {
                            title: "Maint des Factures",
                            page: "/account-payable/create-vh",
                        },
                        {
                            title: "Liste des factures",
                            page: "/account-payable/list-vh",
                        },
                        {
                            title: "Maint des Paiement",
                            page: "/account-payable/create-payment",
                        },
                        {
                            title: "Paiement à Rapproché",
                            page: "/account-payable/list-payment-rap",
                        },
                        {
                            title: "Liste des Paiements",
                            page: "/account-payable/list-payment",
                        },
                        {
                            title: "Maint des Notes de Débit",
                            page: "/account-payable/create-note",
                        },
                        {
                            title: "Journal Fournisseur",
                            page: "/account-payable/edit-journal-fournisseur",
                        },
                    ]
                },*/
                /*{
					title: 'Gestion de Production',
					root: true,
                    bullet: "dot",
                    icon: "flaticon-cart",
                    submenu: [
                        {
							title: 'Maint Production',
							page: '/manufacturing/create-prod',
						},
                        
						{
							title: 'Maint Ordre de Fabrication',
							page: '/manufacturing/create-order',
						},
                        {
							title: 'Cloture OF',
							page: '/manufacturing/edit-wo',
						},
                        {
							title: 'List des OFs',
							page: '/manufacturing/list-wo',
						},
						{
							title: 'Lancement OF',
							page: '/manufacturing/launch-order',
						},
						{
							title: 'Maint Centre de Charge ',
							page: '/manufacturing/create-work-center',
						},
                        {
							title: 'List des Centres de Charges',
							page: '/manufacturing/list-work-center',
						},
						{
							title: 'Maint des gammes',
							page: '/manufacturing/create-gamme',
						},
                        {
							title: 'Maint des Code Causes',
							page: '/manufacturing/create-rsn',
						},
                        {
							title: 'List des Codes Cause',
							page: '/manufacturing/list-rsn',
						},
						{
							title: 'Déclaration Operation',
							page: '/manufacturing/create-op',
						},
						{
							title: 'Maint Code Nomenclature',
							page: '/manufacturing/create-nomenclature',
						},
                        {
							title: 'Maint des Nomenclature',
							page: '/manufacturing/create-ps',
						},
						{
							title: 'Déclaration Production',
							page: '/manufacturing/worct-entry',
						},
						{
							title: 'Déclaration Consomation',
							page: '/manufacturing/woiss-entry',
						},
                        {
							title: 'Affectation Nomenclature',
							page: '/manufacturing/affect-bom',
						},
						
					]
				},

                */
             /*   {
                    title: "Gestion des Projets",
                    bullet: "dot",
                    icon: "flaticon-profile",
                    root: true,
                    submenu: [
                    {
                        title: "Gestion des Métier",
                        bullet: "dot",
                        icon: "flaticon-profile",
                        root: true,
                        submenu: [
                            {
                                title: "La liste des Code Métiers",
                                page: "/job/list-job",
                            },
                            {
                                title: "Ajouter un Code Métier",
                                page: "/job/create-job",
                            },
                        ],
                    },
                    {
                        title: "Gestion des Listes Outils",
                        bullet: "dot",
                        icon: "flaticon-profile",
                        root: true,
                        submenu: [
                            {
                                title: "La liste des Listes Outils",
                                page: "/tool/list-tool",
                            },
                            {
                                title: "Ajouter une Liste Outil",
                                page: "/tool/create-tool",
                            },
                        ],
                    },
                    
                    {
                        title: "Gestion des Instructions",
                        bullet: "dot",
                        icon: "flaticon-profile",
                        root: true,
                        submenu: [
                            {
                                title: "La liste des Instructions",
                                page: "/task/list-task",
                            },
                            {
                                title: "Ajouter une Instruction",
                                page: "/task/create-task",
                            },
                        ],
                    },
                   /
                 {
                        title: "Création des Projets",
                        bullet: "dot",
                        icon: "flaticon-profile",
                        root: true,
                        submenu: [
                            {
                                title: "La liste Detail des Projets",
                                page: "/project/list-project",
                            },
                            {
                                title: "Ajouter un projet",
                                page: "/project/create-project",
                            },
                            {
                                title: "La liste des Projets",
                                page: "/project/list-pm",
                            },
                            {
                                title: 'Affectation des Employés',
                                page: '/accounting-setting/affect-emp',
                            },

                            {
                                title: "Rapport d'activité",
                                page: "/project/add-report",
                            },
                           
                        ],
                    },
                  ]
                },*/
                /*{
                    title: "Gestion des Maintenance",
                    bullet: "dot",
                    icon: "flaticon-profile",
                    root: true,
                    submenu: [
                        {
                            title: "La liste des profiles",
                            page: "/profiles/profiles-list",
                        },
                        {
                            title: "Ajouter un profil",
                            page: "/profiles/create-profile",
                        },
                    ],
                },
*/
               /* {
                    title: "Comptabilité Générale",
                    bullet: "dot",
                    icon: "flaticon-profile",
                    root: true,
                    submenu: [
                        {
                            title: "Affectation Frais d approche",
                            page: "/general-accounting/affect-frp",
                        },
                        {
                            title: "Maint Ecriture Standard",
                            page: "/general-accounting/create-gl",
                        },
                        {
                            title: "Liste des Ecritures ",
                            page: "/general-accounting/list-gl",
                        },
                        {
                            title: "Liste  ",
                            page: "/general-accounting/list",
                        },
                       
                    ],
                },
                */
                {    
                    title: "Rapports",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon-cart",
                    submenu: [
                        {
                            title: "Liste des Ventes par Vendeur ",
                            page: "/Sales/list-so-user",
                        },
                        {
                            title: "Rapport des Ventes par Client ",
                            page: "/Sales/list-ca",
                        },
                        {
                            title: "Rapport des Paiement ",
                            page: "/Sales/list-payment",
                        },
                        {
                            title: "Rapport des Ventes Verres ",
                            page: "/Sales/sales-gls",
                        },
                        {
                            title: "Consultation Stock Accessoire ",
                            page: "/inventory-transaction/invacs-list",
                        },
                        {
                            title: "Consultation Stock Verres / Lentilles",
                            page: "/inventory-transaction/invgls-list",
                        },
                        {
                            title: "Consultation Stocks Monture ",
                            page: "/inventory-transaction/inventory-list",
                        },
                        {
                            title: "Consultation Stocks Valorisé ",
                            page: "/inventory-transaction/list-zakat",
                        },
                    ]
                },
                {
                    title: "Gestion des utilisateurs",
                    bullet: "dot",
                    icon: "flaticon-user",
                    root: true,
                    submenu: [
                        {
                            title: "Ajouter un utilisateur",
                            page: "/users/create-user",
                        },
                        {
                            title: "La liste des utilisateurs",
                            page: "/users/users-list",
                        }
                        
                    ],
                },
                {
                    title: "Gestion des profils",
                    bullet: "dot",
                    icon: "flaticon-profile",
                    root: true,
                    submenu: [
                        {
                            title: "La liste des profiles",
                            page: "/profiles/profiles-list",
                        },
                        {
                            title: "Ajouter un profil",
                            page: "/profiles/create-profile",
                        },
                    ],
                },
                
            ],
        },
    }

    public get configs(): any {
        return this.defaults
    }
}
