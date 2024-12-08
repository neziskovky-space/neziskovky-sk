export const Form = {
	NeinvesticnyFond: "Neinvestičný fond",
	SlovenskyCervenyKriz: "Slovenský Červený kríž",
	ObcianskeZdruzenie: "Občianske združenie",
	SubjektyVyskumuAVyvoja: "Subjekty výskumu a vývoja",
	UceloveZariadenieCirkev:
		"Účelové zariadenie cirkvi a náboženskej spoločnosti",
	Nadacia: "Nadácia",
	NeziskovaOrganizacia:
		"Nezisková organizácia poskytujúca všeobecne prospešné služby",
	OrganizaciaSMedzinarodnymPrvkom: "Organizácia s medzinárodným prvkom",
} as const;

export type TForm = (typeof Form)[keyof typeof Form];

export type NGO = {
	Name: string;
	Latitude: number;
	Longitude: number;
	Street: string;
	City: string;
	ZipCode: string;
	Form: TForm;
};
